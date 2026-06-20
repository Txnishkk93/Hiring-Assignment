import { Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { User } from '../models/User.model';
import { signToken } from '../utils/jwt';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? 'body';
    errors[key] = issue.message;
  }
  return errors;
}

function toPublicUser(user: { _id: unknown; name: string; email: string; createdAt?: Date }) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function signup(req: AuthRequest, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, 'Validation failed', formatZodErrors(parsed.error));
  }

  const { name, email, password } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(400, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    data: { token, user: toPublicUser(user) },
  });
}

export async function login(req: AuthRequest, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, 'Validation failed', formatZodErrors(parsed.error));
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = signToken(user._id);
  res.json({
    success: true,
    data: { token, user: toPublicUser(user) },
  });
}

export async function me(req: AuthRequest, res: Response) {
  res.json({ success: true, data: { user: toPublicUser(req.user!) } });
}
