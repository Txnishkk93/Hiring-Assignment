import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as theatreController from '../controllers/theatre.controller';

const router = Router();

router.get('/', asyncHandler(theatreController.listTheatres));

export default router;
