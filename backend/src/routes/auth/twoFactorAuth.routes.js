import express from 'express';
import { enable2FA, verify2FA, disable2FA } from '../../controllers/auth/twoFactorAuth.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/enable', protectedRoute, enable2FA);
router.post('/verify', protectedRoute, verify2FA);
router.post('/disable', protectedRoute, disable2FA);

export default router;

