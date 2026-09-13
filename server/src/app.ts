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
import aiRoutes from './routes/ai.routes';

const app = express();

// ALLOWED_ORIGINS is built lazily on the first request so that dotenv has
// already populated process.env before we read CLIENT_URL.
// Root cause: ESM static `import app from './app'` in server.ts is hoisted
// above dotenv.config(), so any module-level read of process.env.CLIENT_URL
// sees `undefined` and falls back to only 'http://localhost:5173'.
let _allowedOrigins: Set<string> | null = null;
function getAllowedOrigins(): Set<string> {
  if (!_allowedOrigins) {
    _allowedOrigins = new Set(
      (process.env.CLIENT_URL || 'http://localhost:5173')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    );
  }
  return _allowedOrigins;
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / curl requests (no Origin header) and listed origins.
    if (!origin || getAllowedOrigins().has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    }
  },
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
app.use('/api/ai', aiRoutes);

// Error Middleware
app.use(errorHandler);

export default app;
