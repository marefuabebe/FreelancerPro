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
import { login } from '../../controllers/auth/login.controller.js';
import { validateWithJoi } from '../../middleware/validateRequest.js';
import { schemas } from '../../utils/validators.js';
import { loginLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', loginLimiter, validateWithJoi(schemas.login), login);

export default router;

