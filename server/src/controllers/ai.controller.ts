import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Conversation } from '../models/Conversation';
import { User } from '../models/User';
import { Goal } from '../models/Goal';
import { Task } from '../models/Task';
import { StudySession } from '../models/StudySession';
import { RecommendationStore } from '../models/RecommendationStore';
import { AuthRequest } from '../middleware/auth.middleware';

// Lazy factory: instantiate GoogleGenAI at request time so that dotenv has
// already loaded process.env.GEMINI_API_KEY before the client is created.
// (ESM static imports are hoisted above all executable code, which means a
// module-level `new GoogleGenAI(...)` runs before dotenv.config() in server.ts.)
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}

const SYSTEM_INSTRUCTION = `You are "ANANYA-AI Academic Assistant".
Your responsibilities:
- Help students understand academic concepts clearly and simply.
- Provide step-by-step explanations and help with programming or study planning.
- Use the student's available academic context when relevant to provide personalized guidance.
- Encourage realistic study plans.
- Avoid pretending to know information you do not know. State uncertainty clearly.
- Avoid making high-stakes claims.
- Do not discriminate based on sensitive attributes or make assumptions about ability/worth based on demographics.
- Treat the student respectfully.

For programming: Explain logic, provide correct code, explain the code, and mention edge cases.
For academic questions: Give a concise answer first, then a deeper explanation. Use examples.

Rely on the provided academic context to tailor your responses, but do not leak their raw database structure to them.`;

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .select('_id title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getConversationById = async (req: AuthRequest, res: Response) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (conversation) {
      if (conversation.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(conversation);
    } else {
      res.status(404).json({ message: 'Conversation not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Conversation not found' });
  }
};

export const deleteConversation = async (req: AuthRequest, res: Response) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (conversation) {
      if (conversation.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await conversation.deleteOne();
      res.json({ message: 'Conversation removed' });
    } else {
      res.status(404).json({ message: 'Conversation not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Conversation not found' });
  }
};

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured' });
    }

    const userId = req.user._id;

    // 1. Retrieve Academic Context
    const [user, goals, tasks, studySessions] = await Promise.all([
      User.findById(userId).select('department college year skills careerGoal'),
      Goal.find({ userId, status: { $ne: 'completed' } }).limit(5),
      Task.find({ userId, status: 'pending' }).sort({ dueDate: 1 }).limit(5),
      StudySession.find({ userId, date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }).sort({ date: 1 }).limit(5)
    ]);

    const contextStr = `
STUDENT CONTEXT:
Department: ${user?.department || 'Not specified'}
Year: ${user?.year || 'Not specified'}
Career Goal: ${user?.careerGoal || 'Not specified'}
Skills: ${user?.skills?.join(', ') || 'None listed'}

ACTIVE GOALS:
${goals.map(g => `- ${g.title} (Progress: ${g.progress}%)`).join('\n') || 'None'}

UPCOMING TASKS:
${tasks.map(t => `- ${t.title} (${t.priority} priority)`).join('\n') || 'None'}

UPCOMING STUDY SESSIONS:
${studySessions.map(s => `- ${s.subject}: ${s.topic} (${s.durationMinutes} mins)`).join('\n') || 'None'}
`;

    // 2. Setup Conversation History
    let conversation;
    let formattedHistory: any[] = [];

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.userId.toString() !== userId.toString()) {
        return res.status(401).json({ message: 'Invalid conversation' });
      }

      // Take last 10 messages for context window control
      const recentMessages = conversation.messages.slice(-10);
      formattedHistory = recentMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    } else {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      conversation = new Conversation({ userId, title, messages: [] });
    }

    // 3. Call Gemini
    const geminiChat = getAI().chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + '\n\n' + contextStr,
      },
      history: formattedHistory
    });

    const response = await geminiChat.sendMessage({
      message
    });

    const assistantReply = response.text || "I'm sorry, I couldn't generate a response.";

    // 4. Save to DB
    conversation.messages.push({ role: 'user', content: message });
    conversation.messages.push({ role: 'assistant', content: assistantReply });

    await conversation.save();

    res.json({
      conversationId: conversation._id,
      reply: assistantReply,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: 'Failed to process AI response' });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const forceRefresh = req.query.forceRefresh === 'true';

    let store = await RecommendationStore.findOne({ userId });

    // Cache for 24 hours
    const CACHE_DURATION = 24 * 60 * 60 * 1000;
    const isCacheValid = store && (Date.now() - store.lastGeneratedAt.getTime() < CACHE_DURATION);

    if (!forceRefresh && isCacheValid && store && store.recommendations.length > 0) {
      return res.json(store.recommendations);
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured' });
    }

    // 1. Retrieve Academic Context
    const [user, goals, tasks, studySessions] = await Promise.all([
      User.findById(userId).select('department college year skills careerGoal'),
      Goal.find({ userId, status: { $ne: 'completed' } }),
      Task.find({ userId, status: 'pending' }),
      StudySession.find({ userId, date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } })
    ]);

    const contextStr = `
STUDENT CONTEXT:
Department: ${user?.department || 'Not specified'}
Year: ${user?.year || 'Not specified'}
Career Goal: ${user?.careerGoal || 'Not specified'}
Skills: ${user?.skills?.join(', ') || 'None listed'}

ACTIVE GOALS:
${goals.map(g => `- ID: ${g._id}, Title: ${g.title}, Progress: ${g.progress}%`).join('\n') || 'None'}

PENDING TASKS:
${tasks.map(t => `- ID: ${t._id}, Title: ${t.title}, Priority: ${t.priority}`).join('\n') || 'None'}

UPCOMING STUDY SESSIONS:
${studySessions.map(s => `- ID: ${s._id}, Subject: ${s.subject}, Topic: ${s.topic}, Duration: ${s.durationMinutes} mins`).join('\n') || 'None'}
`;

    const RECOMMENDATION_PROMPT = `
Based on the provided student context, generate personalized, actionable, and bias-aware academic recommendations.

Requirements:
- Base recommendations ONLY on the provided academic data. Do not make assumptions based on gender, race, religion, or any other demographic factors.
- Recommendations must be specific, actionable, and realistic. Avoid generic advice like "study harder".
- Output exactly as a JSON array of objects.
- Each object must have the following keys:
  - "title" (string)
  - "explanation" (string: short explanation)
  - "reason" (string: reason based on actual student data)
  - "priority" (string: "High", "Medium", or "Low")
  - "category" (string: e.g., "Study Strategy", "Goal Progress", "Skill Development", "Time Management")
  - "actionableStep" (string: what to do next)
  - "relatedEntity" (optional object: { "type": "Goal"|"Task"|"Subject", "id": "<the ObjectId if applicable>" })

Generate up to 5 high-quality recommendations.

${contextStr}
`;

    // Call Gemini with JSON response requirement
    const response = await getAI().models.generateContent({
      model: 'gemini-3.6-flash',
      contents: RECOMMENDATION_PROMPT,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '[]';
    let recommendations = [];
    try {
      recommendations = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON:', responseText);
      return res.status(500).json({ message: 'Failed to generate valid recommendations' });
    }

    if (!store) {
      store = new RecommendationStore({ userId, recommendations, lastGeneratedAt: new Date() });
    } else {
      store.recommendations = recommendations;
      store.lastGeneratedAt = new Date();
    }

    await store.save();

    res.json(store.recommendations);
  } catch (error: any) {
    console.error('AI Recommendations Error:', error);
    res.status(500).json({ message: 'Failed to process AI recommendations' });
  }
};

