import { RequestHandler } from 'express';

// Wraps async route handlers so thrown errors reach the centralized error handler.
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
