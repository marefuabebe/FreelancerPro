import express from 'express';
import { testEmail } from '../../controllers/auth/testEmail.controller.js';

const router = express.Router();

router.post('/', testEmail);

export default router;
