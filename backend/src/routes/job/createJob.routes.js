import express from 'express';
import { createJob } from '../../controllers/job/createJob.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';
import { clientOnly } from '../../middleware/roleMiddleware.js';
import { validateWithJoi } from '../../middleware/validateRequest.js';
import { schemas } from '../../utils/validators.js';
import { jobCreationLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/',
  protectedRoute,
  clientOnly,
  jobCreationLimiter,
  validateWithJoi(schemas.createJob),
  createJob
);

export default router;

