import express from 'express';
import { check } from 'express-validator';
import { signup } from '../../controllers/auth/signup.controller.js';

const router = express.Router();

router.post(
    '/',
    [
        check('firstName', 'First name is required').notEmpty(),
        check('lastName', 'Last name is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('role', 'Role is required').isIn(['client', 'freelancer']),
    ],
    signup
);

export default router;
