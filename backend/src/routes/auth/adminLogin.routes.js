import express from 'express';
import { check } from 'express-validator';
import { loginAdmin, getMe } from '../../controllers/auth/adminAuth.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginAdmin
);

router.get('/me', protectedRoute, getMe);

export default router;
