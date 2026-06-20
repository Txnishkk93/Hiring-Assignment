import { Router } from 'express';
import authRoutes from './auth.routes';
import movieRoutes from './movie.routes';
import theatreRoutes from './theatre.routes';
import showtimeRoutes from './showtime.routes';
import bookingRoutes from './booking.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/theatres', theatreRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

export default router;
