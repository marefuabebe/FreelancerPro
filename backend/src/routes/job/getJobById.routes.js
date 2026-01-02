import express from 'express';
import { getJobById } from '../../controllers/job/getJobById.controller.js';
import { optionalAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', optionalAuth, getJobById);

export default router;

