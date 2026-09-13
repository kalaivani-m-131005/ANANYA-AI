import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  reason: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  category: { type: String, required: true },
  actionableStep: { type: String, required: true },
  relatedEntity: {
    type: { type: String, enum: ['Goal', 'Task', 'Subject', null] },
    id: { type: mongoose.Schema.Types.ObjectId }
  }
});

const recommendationStoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  recommendations: [recommendationSchema],
  lastGeneratedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const RecommendationStore = mongoose.model('RecommendationStore', recommendationStoreSchema);
