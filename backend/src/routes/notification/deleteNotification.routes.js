import express from 'express';
import { deleteNotification } from '../../controllers/notification/deleteNotification.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.delete('/:id', protectedRoute, deleteNotification);

export default router;

