import express from 'express';
import { verifyKYC } from '../../controllers/admin/verifyKYC.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/:id', protectedRoute, adminOnly, verifyKYC);

export default router;

