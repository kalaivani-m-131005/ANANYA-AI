import express from 'express';
import { getConversations, getConversationById, deleteConversation, chat, getRecommendations } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/conversations')
  .get(protect, getConversations);

router.route('/conversations/:id')
  .get(protect, getConversationById)
  .delete(protect, deleteConversation);

router.route('/chat')
  .post(protect, chat);

router.route('/recommendations')
  .get(protect, getRecommendations);

export default router;
