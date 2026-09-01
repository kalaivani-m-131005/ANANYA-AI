import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ananya_ai';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[ANANYA-AI] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ANANYA-AI] Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
