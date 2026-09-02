import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
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
  category: {
    type: String,
    default: 'General',
  },
  targetDate: {
    type: Date,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },
}, { timestamps: true });

export const Goal = mongoose.model('Goal', goalSchema);
