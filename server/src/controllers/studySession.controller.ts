import { Request, Response } from 'express';
import { StudySession } from '../models/StudySession';
import { Goal } from '../models/Goal';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/auth.middleware';

export const getStudySessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await StudySession.find({ userId: req.user._id }).sort({ date: 1, startTime: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createStudySession = async (req: AuthRequest, res: Response) => {
  try {
    const { goalId, taskId, subject, topic, date, startTime, durationMinutes, type, priority, status, notes } = req.body;

    // Validate referenced Goal if provided
    if (goalId) {
      const goal = await Goal.findById(goalId);
      if (!goal || goal.userId.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Invalid or unauthorized goal reference' });
      }
    }

    // Validate referenced Task if provided
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task || task.userId.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Invalid or unauthorized task reference' });
      }
    }

    const session = new StudySession({
      userId: req.user._id,
      goalId,
      taskId,
      subject,
      topic,
      date,
      startTime,
      durationMinutes,
      type,
      priority,
      status,
      notes,
    });

    const createdSession = await session.save();
    res.status(201).json(createdSession);
  } catch (error) {
    res.status(400).json({ message: 'Invalid study session data' });
  }
};

export const getStudySessionById = async (req: AuthRequest, res: Response) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (session) {
      if (session.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to access this study session');
      }
      res.json(session);
    } else {
      res.status(404);
      throw new Error('Study session not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Study session not found' });
  }
};

export const updateStudySession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (session) {
      if (session.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this study session');
      }

      // Validate referenced Goal if provided
      if (req.body.goalId) {
        const goal = await Goal.findById(req.body.goalId);
        if (!goal || goal.userId.toString() !== req.user._id.toString()) {
          return res.status(400).json({ message: 'Invalid or unauthorized goal reference' });
        }
      }

      // Validate referenced Task if provided
      if (req.body.taskId) {
        const task = await Task.findById(req.body.taskId);
        if (!task || task.userId.toString() !== req.user._id.toString()) {
          return res.status(400).json({ message: 'Invalid or unauthorized task reference' });
        }
      }

      session.goalId = req.body.goalId !== undefined ? req.body.goalId : session.goalId;
      session.taskId = req.body.taskId !== undefined ? req.body.taskId : session.taskId;
      session.subject = req.body.subject || session.subject;
      session.topic = req.body.topic || session.topic;
      session.date = req.body.date || session.date;
      session.startTime = req.body.startTime !== undefined ? req.body.startTime : session.startTime;
      session.durationMinutes = req.body.durationMinutes || session.durationMinutes;
      session.type = req.body.type || session.type;
      session.priority = req.body.priority || session.priority;
      session.status = req.body.status || session.status;
      session.notes = req.body.notes !== undefined ? req.body.notes : session.notes;

      const updatedSession = await session.save();
      res.json(updatedSession);
    } else {
      res.status(404);
      throw new Error('Study session not found');
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid study session data' });
  }
};

export const deleteStudySession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (session) {
      if (session.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this study session');
      }

      await session.deleteOne();
      res.json({ message: 'Study session removed' });
    } else {
      res.status(404);
      throw new Error('Study session not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Study session not found' });
  }
};
