import express from 'express';
import { createContract } from '../../controllers/contract/createContract.controller.js';
import { protectedRoute } from '../../middleware/authMiddleware.js';
import { clientOnly } from '../../middleware/roleMiddleware.js';
import { validateWithJoi } from '../../middleware/validateRequest.js';
import { schemas } from '../../utils/validators.js';

const router = express.Router();

router.post(
  '/',
  protectedRoute,
  clientOnly,
  validateWithJoi(schemas.createContract),
  createContract
);

export default router;

