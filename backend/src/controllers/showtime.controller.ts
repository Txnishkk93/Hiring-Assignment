import { Request, Response } from 'express';
import { Showtime } from '../models/Showtime.model';
import { AppError } from '../middleware/errorHandler';

export async function listShowtimes(req: Request, res: Response) {
  const filter: Record<string, string> = {};
  const { movieId, date } = req.query;

  if (typeof movieId === 'string' && movieId) filter.movieId = movieId;
  if (typeof date === 'string' && date) filter.date = date;

  const showtimes = await Showtime.find(filter)
    .populate('movieId', 'title posterUrl durationMinutes')
    .populate('theatreId', 'name location')
    .select('-seats')
    .sort({ date: 1, time: 1 });

  res.json({ success: true, data: showtimes });
}

export async function getShowtime(req: Request, res: Response) {
  const showtime = await Showtime.findById(req.params.id)
    .populate('movieId')
    .populate('theatreId');

  if (!showtime) {
    throw new AppError(404, 'Showtime not found');
  }

  res.json({ success: true, data: showtime });
}
