import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as showtimeController from '../controllers/showtime.controller';

const router = Router();

router.get('/', asyncHandler(showtimeController.listShowtimes));
router.get('/:id', asyncHandler(showtimeController.getShowtime));

export default router;
