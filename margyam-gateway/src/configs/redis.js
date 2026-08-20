import Redis from 'ioredis';
import { logger } from '../common/index.js';
import appConfig from './app.config.js';

let redis;

export const connectRedis = async () => {
  redis = new Redis({
    host:     appConfig.redis.host,
    port:     appConfig.redis.port,
    password: appConfig.redis.password,
    retryStrategy: (times) => Math.min(times * 100, 3000),
    lazyConnect: true,
  });

  redis.on('connect',   () => logger.info('[Redis] Connected'));
  redis.on('error',     (err) => logger.error('[Redis] Error', { error: err.message }));
  redis.on('reconnecting', () => logger.warn('[Redis] Reconnecting...'));

  await redis.connect();
  return redis;
};

export const getRedis = () => {
  if (!redis) throw new Error('[Redis] Client not initialized. Call connectRedis() first.');
  return redis;
};

export default { connectRedis, getRedis };
