import express from 'express';
import { getMessages } from '../../controllers/message/getMessages.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:conversationId', protectedRoute, getMessages);

export default router;

