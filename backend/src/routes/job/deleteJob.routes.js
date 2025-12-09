import express from 'express';
import { deleteJob } from '../../controllers/job/deleteJob.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';
import { clientOnly } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.delete('/:id', protectedRoute, clientOnly, deleteJob);

export default router;

