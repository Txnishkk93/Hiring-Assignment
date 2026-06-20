import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User, IUser } from '../models/User.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const token = header.slice(7);
    const { userId } = verifyToken(token);
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
