import express from 'express';
import { getConversations } from '../../controllers/message/getConversations.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectedRoute, getConversations);

export default router;
