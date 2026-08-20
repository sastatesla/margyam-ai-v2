import { PrismaClient } from '@prisma/client';
import { logger } from '../common/index.js';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [{ emit: 'event', level: 'query' }, 'warn', 'error']
    : ['warn', 'error'],
});

// Log slow queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    if (e.duration > 200) {
      logger.warn(`[Prisma] Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('[DB] MongoDB connected via Prisma');
  } catch (err) {
    logger.warn('[DB] MongoDB connection failed (running in offline/dev mode)', { error: err.message });
  }
};

export default prisma;
