import express from 'express';
import { updateJob } from '../../controllers/job/updateJob.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';
import { clientOnly } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.put('/:id', protectedRoute, clientOnly, updateJob);

export default router;

