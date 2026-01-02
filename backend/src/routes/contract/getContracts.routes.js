import express from 'express';
import { getContracts } from '../../controllers/contract/getContracts.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectedRoute, getContracts);

export default router;

