import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/signup', asyncHandler(authController.signup));
router.post('/login', asyncHandler(authController.login));
router.get('/me', requireAuth, asyncHandler(authController.me));

export default router;
