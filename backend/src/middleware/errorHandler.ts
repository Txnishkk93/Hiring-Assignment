import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  errors?: Record<string, string>;

  constructor(statusCode: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  if ((err as { code?: number }).code === 11000) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
}
