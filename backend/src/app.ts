import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const normalizeOrigin = (origin?: string) => {
  if (!origin) return origin;
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

export function createApp() {
  const app = express();

  app.use(cors({ origin: normalizeOrigin(process.env.CORS_ORIGIN) }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api', routes);
  app.use(errorHandler);

  return app;
}
