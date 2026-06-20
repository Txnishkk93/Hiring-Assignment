import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/auth';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/', requireAuth, asyncHandler(paymentController.processPayment));

export default router;
