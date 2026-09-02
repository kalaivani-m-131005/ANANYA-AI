import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.department = req.body.department || user.department;
      user.college = req.body.college || user.college;
      user.year = req.body.year || user.year;
      user.skills = req.body.skills || user.skills;
      user.careerGoal = req.body.careerGoal || user.careerGoal;

      const updatedUser = await user.save();

      // Return user without password
      const userResponse = updatedUser.toObject();
      delete (userResponse as any).passwordHash;

      res.json(userResponse);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
