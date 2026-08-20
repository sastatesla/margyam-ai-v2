import { getRedis } from '../../configs/redis.js';
import { logger } from '../../common/index.js';
import { REDIS_KEYS } from '../../configs/constants.js';

/**
 * subscribeChatStream — Subscribes to a Redis Pub/Sub channel for a session.
 * When the Python AI worker publishes a token chunk, this callback is invoked.
 * The gateway then emits the token to the active Socket.io client.
 *
 * @param {string} sessionId - The active chat session ID
 * @param {(chunk: string, done: boolean) => void} onChunk - Callback for each token
 * @returns {() => void} Unsubscribe function — call on socket disconnect
 */
export const subscribeChatStream = async (sessionId, onChunk) => {
  // Use a dedicated subscriber redis connection (pub/sub blocks the connection)
  const redis = getRedis().duplicate();
  const channel = REDIS_KEYS.STREAM_CHANNEL(sessionId);

  await redis.subscribe(channel);
  logger.debug('[PubSub] Subscribed to chat channel', { channel });

  redis.on('message', (ch, message) => {
    if (ch !== channel) return;
    try {
      const { chunk, done } = JSON.parse(message);
      onChunk(chunk, done);
    } catch {
      // ignore malformed messages
    }
  });

  // Return cleanup function
  return async () => {
    await redis.unsubscribe(channel);
    redis.disconnect();
    logger.debug('[PubSub] Unsubscribed from chat channel', { channel });
  };
};
