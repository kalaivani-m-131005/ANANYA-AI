import express from 'express';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleSaveResource,
  getRecommendedResources
} from '../controllers/resource.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/recommendations', getRecommendedResources);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);
router.post('/:id/save', toggleSaveResource);

export default router;
