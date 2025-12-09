import express from 'express';
import { check } from 'express-validator';
import { resetPassword } from '../../controllers/auth/resetPassword.controller.js';

const router = express.Router();

router.post(
    '/:token',
    [
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    resetPassword
);

export default router;
import { resetPassword } from '../../controllers/auth/resetPassword.controller.js';
import { passwordResetLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', passwordResetLimiter, resetPassword);

export default router;

