import { authenticate } from '../middlewares/auth.js';
import { subscribeChatStream } from '../system/streams/chat.subscriber.js';
import { produceChatJob } from '../system/streams/chat.producer.js';
import { verifyAndDeduct, refundCoins } from '../system/grpc/clients/ledger.client.js';
import { logger } from '../common/index.js';
import { REDIS_KEYS } from '../configs/constants.js';

const CHAT_COST_COINS = 10;

/**
 * Initializes Socket.io event handlers.
 * @param {import('socket.io').Server} io
 */
export const initChatSocket = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return next(new Error('UNAUTHORIZED'));

      const { verifyToken } = await import('../common/index.js');
      socket.user = verifyToken(token);
      next();
    } catch {
      next(new Error('UNAUTHORIZED'));
    }
  });

  io.on('connection', (socket) => {
    const { userId } = socket.user;
    logger.info('[Socket] Client connected', { userId, socketId: socket.id });

    // Join room for user notifications
    socket.join(`user:${userId}`);

    // Real-time chat message handler
    socket.on('chat:message', async ({ sessionId, query, language = 'en' }) => {
      let transactionId = null;
      let unsubscribe   = null;

      try {
        // Step 1: Deduct coins via gRPC ledger call
        const deductResult = await verifyAndDeduct({
          user_id:         userId,
          amount:          CHAT_COST_COINS,
          idempotency_key: `${userId}:${sessionId}:${Date.now()}`,
          description:     'AI chat question',
        });

        if (!deductResult.success) {
          return socket.emit('chat:error', { code: 'INSUFFICIENT_BALANCE', message: 'Not enough coins' });
        }

        transactionId = deductResult.transaction_id;

        // Step 2: Subscribe to real-time response stream
        unsubscribe = await subscribeChatStream(sessionId, (chunk, done) => {
          socket.emit('chat:chunk', { chunk, done });
          if (done && unsubscribe) unsubscribe();
        });

        // Step 3: Enqueue message job into Redis stream
        await produceChatJob({ userId, sessionId, query, language, transactionId });

      } catch (err) {
        logger.error('[Socket] chat:message error', { userId, error: err.message });

        // Step 4: Refund coins on failure
        if (transactionId) {
          await refundCoins({ transaction_id: transactionId, reason: err.message }).catch(() => {});
        }

        if (unsubscribe) await unsubscribe().catch(() => {});
        socket.emit('chat:error', { code: 'INTERNAL_ERROR', message: 'Something went wrong' });
      }
    });

    socket.on('disconnect', () => {
      logger.info('[Socket] Client disconnected', { userId, socketId: socket.id });
    });
  });
};
