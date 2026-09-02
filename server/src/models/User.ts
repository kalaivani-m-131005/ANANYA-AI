import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  department: {
    type: String,
    default: '',
  },
  college: {
    type: String,
    default: '',
  },
  year: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  careerGoal: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
