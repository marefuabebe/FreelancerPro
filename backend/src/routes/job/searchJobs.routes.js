import express from 'express';
import { searchJobs } from '../../controllers/job/searchJobs.controller.js';
import { optionalAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, searchJobs);

export default router;

