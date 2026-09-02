import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  startTime: {
    type: String,
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: 1,
  },
  type: {
    type: String,
    enum: ['Study', 'Revision', 'Practice', 'Assignment', 'Exam Preparation'],
    default: 'Study',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed'],
    default: 'Planned',
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
}, { timestamps: true });

export const StudySession = mongoose.model('StudySession', studySessionSchema);
