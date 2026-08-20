import { getRedis } from '../../configs/redis.js';
import { logger } from '../../common/index.js';
import { REDIS_KEYS } from '../../configs/constants.js';

/**
 * produceChatJob — Pushes a chat query job to the Redis Stream `chat:tasks`.
 * margyam-ai workers consume this stream and publish response chunks to Pub/Sub.
 *
 * @param {{ userId, sessionId, query, language, transactionId }} job
 * @returns {Promise<string>} Redis Stream entry ID
 */
export const produceChatJob = async (job) => {
  const redis = getRedis();

  const fields = [
    'userId',        job.userId,
    'sessionId',     job.sessionId,
    'query',         job.query,
    'language',      job.language || 'en',
    'transactionId', job.transactionId,
    'timestamp',     Date.now().toString(),
  ];

  const entryId = await redis.xadd(REDIS_KEYS.CHAT_STREAM, '*', ...fields);
  logger.debug('[Stream] Chat job produced', { entryId, sessionId: job.sessionId });
  return entryId;
};
