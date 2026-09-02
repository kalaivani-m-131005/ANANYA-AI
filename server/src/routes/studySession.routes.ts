import express from 'express';
import { getStudySessions, createStudySession, getStudySessionById, updateStudySession, deleteStudySession } from '../controllers/studySession.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(protect, getStudySessions)
  .post(protect, createStudySession);

router.route('/:id')
  .get(protect, getStudySessionById)
  .put(protect, updateStudySession)
  .delete(protect, deleteStudySession);

export default router;
