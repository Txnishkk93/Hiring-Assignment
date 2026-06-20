import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createApp } from './app';

dotenv.config();

function validateEnv() {
  const required = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'CORS_ORIGIN', 'BOOKING_FEE'] as const;
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

async function main() {
  validateEnv();

  await mongoose.connect(process.env.MONGO_URI!);
  console.log('Connected to MongoDB');

  const app = createApp();
  const port = Number(process.env.PORT);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
