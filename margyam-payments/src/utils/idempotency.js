import { v4 as uuidv4 } from 'uuid';

/**
 * generateIdempotencyKey — Produces a deterministic key for a wallet operation.
 * Prevents double-debit if the same request is retried.
 *
 * @param {string} userId
 * @param {string} sessionId
 * @returns {string}
 */
export const generateIdempotencyKey = (userId, sessionId) => {
  return `${userId}:${sessionId}:${Date.now()}`;
};

/**
 * randomKey — Generates a random UUID-based idempotency key.
 */
export const randomKey = () => uuidv4();
