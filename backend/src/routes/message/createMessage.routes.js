import express from 'express';
import { createMessage } from '../../controllers/message/createMessage.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';
import { messageLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', protectedRoute, messageLimiter, createMessage);

export default router;

