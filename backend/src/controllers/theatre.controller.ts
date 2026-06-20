import { Request, Response } from 'express';
import { Theatre } from '../models/Theatre.model';

export async function listTheatres(_req: Request, res: Response) {
  const theatres = await Theatre.find().sort({ name: 1 });
  res.json({ success: true, data: theatres });
}
