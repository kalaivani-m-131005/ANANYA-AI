import { Request, Response } from 'express';
import { Goal } from '../models/Goal';
import { AuthRequest } from '../middleware/auth.middleware';

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, targetDate, progress, status } = req.body;
    const goal = new Goal({
      userId: req.user._id,
      title,
      description,
      category,
      targetDate,
      progress: progress || 0,
      status: status || 'not_started',
    });
    
    // Automatically set status if progress is 100
    if (goal.progress === 100) {
      goal.status = 'completed';
    }

    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
  } catch (error) {
    res.status(400).json({ message: 'Invalid goal data' });
  }
};

export const getGoalById = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (goal) {
      if (goal.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to access this goal');
      }
      res.json(goal);
    } else {
      res.status(404);
      throw new Error('Goal not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Goal not found' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (goal) {
      if (goal.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this goal');
      }

      goal.title = req.body.title || goal.title;
      goal.description = req.body.description !== undefined ? req.body.description : goal.description;
      goal.category = req.body.category || goal.category;
      goal.targetDate = req.body.targetDate !== undefined ? req.body.targetDate : goal.targetDate;
      goal.progress = req.body.progress !== undefined ? req.body.progress : goal.progress;
      goal.status = req.body.status || goal.status;

      // Automatically complete goal if progress is 100
      if (goal.progress === 100) {
        goal.status = 'completed';
      }

      const updatedGoal = await goal.save();
      res.json(updatedGoal);
    } else {
      res.status(404);
      throw new Error('Goal not found');
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid goal data' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (goal) {
      if (goal.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this goal');
      }

      await goal.deleteOne();
      res.json({ message: 'Goal removed' });
    } else {
      res.status(404);
      throw new Error('Goal not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Goal not found' });
  }
};
