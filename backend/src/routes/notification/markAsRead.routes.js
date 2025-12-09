import express from 'express';
import { markAsRead, markAllAsRead } from '../../controllers/notification/markAsRead.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.put('/all', protectedRoute, markAllAsRead);
router.put('/:id', protectedRoute, markAsRead);

export default router;

