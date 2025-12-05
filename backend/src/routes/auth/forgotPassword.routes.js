import express from 'express';
import { forgotPassword } from '../../controllers/auth/forgotPassword.controller.js';
import { passwordResetLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', passwordResetLimiter, forgotPassword);

export default router;

