import express from 'express';
import { check } from 'express-validator';
import { forgotPassword } from '../../controllers/auth/forgotPassword.controller.js';

const router = express.Router();

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
    ],
    forgotPassword
);

export default router;
