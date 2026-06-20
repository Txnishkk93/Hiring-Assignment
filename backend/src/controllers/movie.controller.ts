import { Request, Response } from 'express';
import { Movie } from '../models/Movie.model';
import { AppError } from '../middleware/errorHandler';

export async function listMovies(req: Request, res: Response) {
  const filter: Record<string, string> = {};
  const status = req.query.status as string | undefined;
  if (status === 'now_showing' || status === 'coming_soon') {
    filter.status = status;
  }

  const movies = await Movie.find(filter).sort({ title: 1 });
  res.json({ success: true, data: movies });
}

export async function getMovie(req: Request, res: Response) {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    throw new AppError(404, 'Movie not found');
  }
  res.json({ success: true, data: movie });
}
