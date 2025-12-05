import express from 'express';
import { resendVerification } from '../../controllers/auth/resendVerification.controller.js';
import { validateWithJoi } from '../../middleware/validateRequest.js';
import { schemas } from '../../utils/validators.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', authLimiter, validateWithJoi(schemas.resendVerification), resendVerification);

export default router;
