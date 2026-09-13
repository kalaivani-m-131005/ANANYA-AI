import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthRequest } from '../middleware/auth.middleware';
import { Resource } from '../models/Resource';
import { User } from '../models/User';
import { Goal } from '../models/Goal';
import { Task } from '../models/Task';
import { StudySession } from '../models/StudySession';

let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}

export const getAllResources = async (req: AuthRequest, res: Response) => {
  try {
    const { search, subject, topic, type, difficulty } = req.query;
    
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search as string };
    }
    if (subject) query.subject = new RegExp(subject as string, 'i');
    if (topic) query.topic = new RegExp(topic as string, 'i');
    if (type) query.resourceType = type;
    if (difficulty) query.difficulty = difficulty;

    const resources = await Resource.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(50);
      
    // For each resource, add a boolean indicating if current user has saved it
    const enhancedResources = resources.map(resource => {
      const obj = resource.toObject();
      const isSaved = resource.savedBy.some(id => id.toString() === req.user._id.toString());
      return { ...obj, isSaved, savedBy: undefined }; // Don't leak all saved users
    });

    res.json(enhancedResources);
  } catch (error) {
    console.error('Fetch Resources Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getResourceById = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    const obj = resource.toObject();
    const isSaved = resource.savedBy.some(id => id.toString() === req.user._id.toString());
    res.json({ ...obj, isSaved, savedBy: undefined });
  } catch (error) {
    res.status(404).json({ message: 'Resource not found' });
  }
};

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid data' });
  }
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid data' });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const toggleSaveResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const userId = req.user._id;
    const index = resource.savedBy.findIndex(id => id.toString() === userId.toString());

    if (index === -1) {
      resource.savedBy.push(userId);
    } else {
      resource.savedBy.splice(index, 1);
    }

    await resource.save();
    res.json({ isSaved: index === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRecommendedResources = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured' });
    }

    const [user, goals, tasks, studySessions] = await Promise.all([
      User.findById(userId).select('department year careerGoal skills'),
      Goal.find({ userId, status: { $ne: 'completed' } }),
      Task.find({ userId, status: 'pending' }),
      StudySession.find({ userId }).sort({ createdAt: -1 }).limit(10)
    ]);

    const contextStr = `
STUDENT PROFILE:
Department: ${user?.department || 'Not specified'}
Year: ${user?.year || 'Not specified'}
Career Goal: ${user?.careerGoal || 'Not specified'}
Skills: ${user?.skills?.join(', ') || 'None listed'}

ACTIVE GOALS:
${goals.map(g => `- ${g.title}`).join('\n') || 'None'}

PENDING TASKS:
${tasks.map(t => `- ${t.title}`).join('\n') || 'None'}

RECENT STUDY TOPICS:
${studySessions.map(s => `- ${s.subject}: ${s.topic}`).join('\n') || 'None'}
`;

    const PROMPT = `
You are an expert academic advisor. Based on the student's profile, goals, tasks, and recent study topics below, recommend 3 to 5 highly relevant and specific learning resources.

REQUIREMENTS:
1. Resources must be real, well-known platforms (e.g., freeCodeCamp, MDN, official docs, Khan Academy, MIT OpenCourseWare, Coursera, YouTube educational channels).
2. DO NOT invent fake URLs or 404 links. Use homepage or very common paths if unsure.
3. Recommendations must directly align with their Career Goal, Skills, Active Goals, or recent study topics.
4. Bias-aware: Do not make any demographic assumptions. Focus purely on academic and technical data.
5. Format the output exactly as a JSON array of objects.

JSON Format:
[
  {
    "title": "Resource Title",
    "description": "Short explanation of why this helps them achieve their specific goals.",
    "url": "https://...",
    "resourceType": "Course|Article|Video|Documentation|Practice|Book",
    "difficulty": "Beginner|Intermediate|Advanced",
    "provider": "Platform Name",
    "tags": ["tag1", "tag2"]
  }
]

STUDENT DATA:
${contextStr}
`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3.6-flash',
      contents: PROMPT,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '[]';
    let aiResources = [];
    try {
      aiResources = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse AI resources JSON:', responseText);
      return res.status(500).json({ message: 'Failed to generate valid recommendations' });
    }

    res.json(aiResources);
  } catch (error) {
    console.error('AI Resources Error:', error);
    res.status(500).json({ message: 'Failed to fetch AI recommendations' });
  }
};
