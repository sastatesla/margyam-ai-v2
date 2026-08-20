/**
 * RedisHelper
 * Modern ES6 async/await Redis utility class for ioredis clients.
 * Provides clean abstractions for Hashes, Lists, Sets, Distributed Locking, and Pub/Sub.
 */
export class RedisHelper {
  // ── Hash Operations ───────────────────────────────────────────────────────
  static async storeHash(redisClient, key, data, ttlSeconds = null) {
    if (!redisClient || !key) return false;
    let fields = {};
    if (Array.isArray(data)) {
      data.forEach(([k, v]) => { fields[k] = typeof v === 'object' ? JSON.stringify(v) : String(v); });
    } else if (typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => { fields[k] = typeof v === 'object' ? JSON.stringify(v) : String(v); });
    }
    if (Object.keys(fields).length > 0) await redisClient.hset(key, fields);
    if (ttlSeconds && ttlSeconds > 0) await redisClient.expire(key, ttlSeconds);
    return true;
  }

  static async getHash(redisClient, key) {
    if (!redisClient || !key) return {};
    return redisClient.hgetall(key);
  }

  static async getHashField(redisClient, key, field) {
    if (!redisClient || !key || !field) return null;
    return redisClient.hget(key, field);
  }

  // ── List Operations ───────────────────────────────────────────────────────
  static async pushToList(redisClient, key, value, position = 'left') {
    if (!redisClient || !key) return 0;
    const strVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return position === 'right' ? redisClient.rpush(key, strVal) : redisClient.lpush(key, strVal);
  }

  static async popFromList(redisClient, key, position = 'left') {
    if (!redisClient || !key) return null;
    return position === 'right' ? redisClient.rpop(key) : redisClient.lpop(key);
  }

  static async getListRange(redisClient, key, start = 0, stop = -1) {
    if (!redisClient || !key) return [];
    return redisClient.lrange(key, start, stop);
  }

  static async getListLength(redisClient, key) {
    if (!redisClient || !key) return 0;
    return redisClient.llen(key);
  }

  // ── Set Operations ────────────────────────────────────────────────────────
  static async addToSet(redisClient, key, ...members) {
    if (!redisClient || !key || members.length === 0) return 0;
    const stringified = members.map((m) => (typeof m === 'object' ? JSON.stringify(m) : String(m)));
    return redisClient.sadd(key, ...stringified);
  }

  static async removeFromSet(redisClient, key, ...members) {
    if (!redisClient || !key || members.length === 0) return 0;
    const stringified = members.map((m) => (typeof m === 'object' ? JSON.stringify(m) : String(m)));
    return redisClient.srem(key, ...stringified);
  }

  static async getSetMembers(redisClient, key) {
    if (!redisClient || !key) return [];
    return redisClient.smembers(key);
  }

  // ── Distributed Lock Operations ─────────────────────────────────────────
  static async acquireLock(redisClient, key, ttlSeconds = 60) {
    if (!redisClient || !key) return false;
    const result = await redisClient.set(key, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  static async releaseLock(redisClient, key) {
    if (!redisClient || !key) return 0;
    return redisClient.del(key);
  }

  // ── Pub/Sub Operations ───────────────────────────────────────────────────
  static async publish(redisClient, channel, message) {
    if (!redisClient || !channel) return 0;
    const strVal = typeof message === 'object' ? JSON.stringify(message) : String(message);
    return redisClient.publish(channel, strVal);
  }

  // ── General Key Operations ───────────────────────────────────────────────
  static async expire(redisClient, key, ttlSeconds) {
    if (!redisClient || !key) return 0;
    return redisClient.expire(key, ttlSeconds);
  }

  static async delete(redisClient, key) {
    if (!redisClient || !key) return 0;
    return redisClient.del(key);
  }
}
