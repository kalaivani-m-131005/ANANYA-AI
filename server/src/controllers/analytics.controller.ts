import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthRequest } from '../middleware/auth.middleware';
import { StudySession } from '../models/StudySession';
import { Goal } from '../models/Goal';
import { Task } from '../models/Task';

let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    // Aggregate Study Sessions
    const studySessions = await StudySession.find({ userId });
    
    let totalStudyMinutes = 0;
    let completedStudySessions = 0;
    let plannedStudySessions = 0;
    const subjectWiseStudyMinutes: Record<string, number> = {};
    const recentStudyActivity: Record<string, number> = {}; // YYYY-MM-DD -> minutes

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    studySessions.forEach(session => {
      if (session.status === 'Completed') {
        completedStudySessions++;
        totalStudyMinutes += session.durationMinutes;

        // Subject wise
        if (!subjectWiseStudyMinutes[session.subject]) {
          subjectWiseStudyMinutes[session.subject] = 0;
        }
        subjectWiseStudyMinutes[session.subject] += session.durationMinutes;

        // Recent activity (last 30 days)
        const sessionDate = new Date(session.date);
        if (sessionDate >= thirtyDaysAgo) {
          const dateString = sessionDate.toISOString().split('T')[0];
          if (!recentStudyActivity[dateString]) {
            recentStudyActivity[dateString] = 0;
          }
          recentStudyActivity[dateString] += session.durationMinutes;
        }
      } else if (session.status === 'Planned') {
        plannedStudySessions++;
      }
    });

    const totalStudyHours = Math.floor(totalStudyMinutes / 60);

    // Aggregate Goals
    const goals = await Goal.find({ userId });
    const totalGoals = goals.length;
    let completedGoals = 0;
    let totalProgress = 0;
    
    goals.forEach(goal => {
      if (goal.status === 'completed') {
        completedGoals++;
      }
      totalProgress += goal.progress || 0;
    });

    const averageGoalProgress = totalGoals > 0 ? Math.round(totalProgress / totalGoals) : 0;
    const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Aggregate Tasks
    const tasks = await Task.find({ userId });
    const totalTasks = tasks.length;
    let completedTasks = 0;
    let pendingTasks = 0;

    tasks.forEach(task => {
      if (task.status === 'completed') {
        completedTasks++;
      } else {
        pendingTasks++;
      }
    });

    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Format for charts
    const subjectData = Object.entries(subjectWiseStudyMinutes).map(([subject, minutes]) => ({
      name: subject,
      value: +(minutes / 60).toFixed(1)
    }));

    // Generate recent activity array sorted by date
    const recentActivityData = Object.entries(recentStudyActivity)
      .map(([date, minutes]) => ({ date, hours: +(minutes / 60).toFixed(1) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json({
      study: {
        totalStudyMinutes,
        totalStudyHours,
        totalSessions: studySessions.length,
        completedSessions: completedStudySessions,
        plannedSessions: plannedStudySessions,
        averageSessionDuration: completedStudySessions > 0 ? Math.round(totalStudyMinutes / completedStudySessions) : 0,
      },
      goals: {
        totalGoals,
        completedGoals,
        activeGoals: totalGoals - completedGoals,
        averageGoalProgress,
        goalCompletionRate
      },
      tasks: {
        totalTasks,
        completedTasks,
        pendingTasks,
        taskCompletionRate
      },
      charts: {
        subjectData,
        recentActivityData
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

export const getAIInsights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured' });
    }

    const [studySessions, goals, tasks] = await Promise.all([
      StudySession.find({ userId, status: 'Completed' }),
      Goal.find({ userId }),
      Task.find({ userId })
    ]);

    let totalStudyMinutes = 0;
    const subjectWiseStudyMinutes: Record<string, number> = {};
    studySessions.forEach(session => {
      totalStudyMinutes += session.durationMinutes;
      if (!subjectWiseStudyMinutes[session.subject]) subjectWiseStudyMinutes[session.subject] = 0;
      subjectWiseStudyMinutes[session.subject] += session.durationMinutes;
    });

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const totalProgress = goals.reduce((sum, g) => sum + (g.progress || 0), 0);
    const averageGoalProgress = goals.length > 0 ? Math.round(totalProgress / goals.length) : 0;

    const dataContext = `
    Total Study Hours: ${Math.floor(totalStudyMinutes / 60)}
    Completed Study Sessions: ${studySessions.length}
    Subject Breakdown: ${JSON.stringify(subjectWiseStudyMinutes)}
    
    Total Tasks: ${tasks.length} (Completed: ${completedTasks}, Rate: ${taskCompletionRate}%)
    Total Goals: ${goals.length} (Completed: ${completedGoals}, Average Progress: ${averageGoalProgress}%)
    `;

    const PROMPT = `
    Based on the following academic analytics data for a student, provide 3 to 5 concise AI academic insights.
    
    Requirements:
    - Base insights ONLY on the provided data.
    - Do not make assumptions about demographics, gender, race, etc.
    - Highlight strengths (e.g., strongest study area).
    - Note areas for improvement (e.g., task completion, consistency).
    - Provide a practical next action.
    - Output exactly as a JSON array of strings.
    
    Data:
    ${dataContext}
    
    If there is not enough data (e.g., 0 study hours and 0 tasks), return a JSON array with a single string encouraging them to start studying and adding tasks.
    `;

    const response = await getAI().models.generateContent({
      model: 'gemini-3.6-flash',
      contents: PROMPT,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '[]';
    let insights = [];
    try {
      insights = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse AI insights JSON:', responseText);
      return res.status(500).json({ message: 'Failed to generate valid insights' });
    }

    res.json(insights);
  } catch (error) {
    console.error('AI Insights Error:', error);
    res.status(500).json({ message: 'Failed to fetch AI insights' });
  }
};
