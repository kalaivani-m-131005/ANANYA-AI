import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
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
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
  },
  resourceType: {
    type: String,
    enum: ['Video', 'Article', 'Documentation', 'Course', 'Practice', 'Book'],
    required: [true, 'Resource type is required'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  topic: {
    type: String,
    default: '',
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  provider: {
    type: String,
    default: '',
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

// Create text index for search
resourceSchema.index({ title: 'text', description: 'text', subject: 'text', topic: 'text', tags: 'text' });

export const Resource = mongoose.model('Resource', resourceSchema);
