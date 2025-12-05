import express from 'express';
import { signup } from '../../controllers/auth/signup.controller.js';
import { validateWithJoi } from '../../middleware/validateRequest.js';
import { schemas } from '../../utils/validators.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', authLimiter, validateWithJoi(schemas.signup), signup);

export default router;

