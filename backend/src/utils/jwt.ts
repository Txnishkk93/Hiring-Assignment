import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_EXPIRY = '7d';

export interface JwtPayload {
  userId: string;
}

export function signToken(userId: Types.ObjectId | string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ userId: userId.toString() }, secret, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.verify(token, secret) as JwtPayload;
}
