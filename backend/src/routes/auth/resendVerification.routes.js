import express from 'express';
import { check } from 'express-validator';
import { resendVerification } from '../../controllers/auth/resendVerification.controller.js';

const router = express.Router();

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
    ],
    resendVerification
);

export default router;
