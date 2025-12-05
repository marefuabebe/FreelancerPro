import express from 'express';
import { login } from '../../controllers/auth/login.controller.js';
import { validateWithJoi } from '../../middleware/validateRequest.js';
import { schemas } from '../../utils/validators.js';
import { loginLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', loginLimiter, validateWithJoi(schemas.login), login);

export default router;

