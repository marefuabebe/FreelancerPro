import express from 'express';
import { resetPassword } from '../../controllers/auth/resetPassword.controller.js';
import { passwordResetLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', passwordResetLimiter, resetPassword);

export default router;

