import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/auth';
import * as bookingController from '../controllers/booking.controller';

const router = Router();

router.post('/', requireAuth, asyncHandler(bookingController.createBooking));
router.get('/', requireAuth, asyncHandler(bookingController.listBookings));
router.get('/:id', requireAuth, asyncHandler(bookingController.getBooking));
router.post('/:id/cancel', requireAuth, asyncHandler(bookingController.cancelBooking));

export default router;
