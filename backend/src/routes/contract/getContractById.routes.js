import express from 'express';
import { getContractById } from '../../controllers/contract/getContractById.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', protectedRoute, getContractById);

export default router;

