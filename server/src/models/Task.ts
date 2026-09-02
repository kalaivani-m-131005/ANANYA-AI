import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  completedAt: {
    type: Date,
  }
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
