import express from 'express';
import { getJobs } from '../../controllers/job/getJobs.controller.js';
import { optionalAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);

export default router;

