import express from 'express';
import { likeJob } from '../../controllers/job/likeJob.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:jobId/like', protectedRoute, likeJob);

export default router;
