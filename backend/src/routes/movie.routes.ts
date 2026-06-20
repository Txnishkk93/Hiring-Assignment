import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as movieController from '../controllers/movie.controller';

const router = Router();

router.get('/', asyncHandler(movieController.listMovies));
router.get('/:id', asyncHandler(movieController.getMovie));

export default router;
