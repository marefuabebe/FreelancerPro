import express from 'express';
import { check } from 'express-validator';
import { login } from '../../controllers/auth/login.controller.js';

const router = express.Router();

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    login
);

export default router;
