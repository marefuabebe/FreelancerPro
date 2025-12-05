import express from 'express';
import { logout } from '../../controllers/auth/logout.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectedRoute, logout);

export default router;

