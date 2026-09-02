import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import profileRoutes from './routes/profile.routes';
import goalRoutes from './routes/goal.routes';
import taskRoutes from './routes/task.routes';
import studySessionRoutes from './routes/studySession.routes';

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/study-sessions', studySessionRoutes);

// Error Middleware
app.use(errorHandler);

export default app;
