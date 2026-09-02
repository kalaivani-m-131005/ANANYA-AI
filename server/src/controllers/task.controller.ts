import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { Goal } from '../models/Goal';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, goalId, status } = req.body;
    
    if (goalId) {
      const goal = await Goal.findById(goalId);
      if (!goal || goal.userId.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Invalid goal' });
      }
    }

    const task = new Task({
      userId: req.user._id,
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      goalId,
      status: status || 'pending',
    });

    if (task.status === 'completed') {
      task.completedAt = new Date();
    }

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to access this task');
      }
      res.json(task);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Task not found' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this task');
      }

      if (req.body.goalId) {
        const goal = await Goal.findById(req.body.goalId);
        if (!goal || goal.userId.toString() !== req.user._id.toString()) {
          return res.status(400).json({ message: 'Invalid goal' });
        }
      }

      const wasCompleted = task.status === 'completed';

      task.title = req.body.title || task.title;
      task.description = req.body.description !== undefined ? req.body.description : task.description;
      task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
      task.priority = req.body.priority || task.priority;
      task.goalId = req.body.goalId !== undefined ? req.body.goalId : task.goalId;
      task.status = req.body.status || task.status;

      if (task.status === 'completed' && !wasCompleted) {
        task.completedAt = new Date();
      } else if (task.status !== 'completed') {
        task.completedAt = undefined as any;
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this task');
      }

      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Task not found' });
  }
};
