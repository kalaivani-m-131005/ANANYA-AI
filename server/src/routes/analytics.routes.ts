import express from 'express';
import { getAnalytics, getAIInsights } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getAnalytics);
router.get('/ai-insights', getAIInsights);

export default router;
