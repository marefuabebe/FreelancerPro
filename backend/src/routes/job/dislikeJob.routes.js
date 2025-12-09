import express from 'express';
import { dislikeJob } from '../../controllers/job/dislikeJob.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:jobId/dislike', protectedRoute, dislikeJob);

export default router;
