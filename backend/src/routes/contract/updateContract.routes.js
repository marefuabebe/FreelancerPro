import express from 'express';
import { updateContract } from '../../controllers/contract/updateContract.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id', protectedRoute, updateContract);

export default router;

