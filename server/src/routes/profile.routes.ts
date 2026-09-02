import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router;
