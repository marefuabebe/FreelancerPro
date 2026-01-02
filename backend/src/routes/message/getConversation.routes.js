import express from 'express';
import { getConversation } from '../../controllers/message/getConversation.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protectedRoute, getConversation);

export default router;

