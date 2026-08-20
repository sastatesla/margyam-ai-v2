/**
 * RedisHelper
 * Modern ES6 async/await Redis utility class for ioredis clients.
 * Provides clean abstractions for Hashes, Lists, Sets, Distributed Locking, and Pub/Sub.
 */
export class RedisHelper {
  // ── Hash Operations ───────────────────────────────────────────────────────
  /**
   * Stores key-value pairs in a Redis Hash.
   * @param {Object} redisClient - ioredis client instance
   * @param {string} key - Redis key name
   * @param {Object|Array<[string, any]>} data - Object or array of [field, value] tuples
   * @param {number} [ttlSeconds] - Optional TTL in seconds
   */
  static async storeHash(redisClient, key, data, ttlSeconds = null) {
    if (!redisClient || !key) return false;

    let fields = {};
    if (Array.isArray(data)) {
      data.forEach(([k, v]) => {
        fields[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
      });
    } else if (typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => {
        fields[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
      });
    }

    if (Object.keys(fields).length > 0) {
      await redisClient.hset(key, fields);
    }

    if (ttlSeconds && ttlSeconds > 0) {
      await redisClient.expire(key, ttlSeconds);
    }
    return true;
  }

  /**
   * Retrieves all fields and values from a Redis Hash.
   * @param {Object} redisClient
   * @param {string} key
   * @returns {Promise<Object>} Hash fields object
   */
  static async getHash(redisClient, key) {
    if (!redisClient || !key) return {};
    return redisClient.hgetall(key);
  }

  /**
   * Retrieves a single field from a Redis Hash.
   * @param {Object} redisClient
   * @param {string} key
   * @param {string} field
   */
  static async getHashField(redisClient, key, field) {
    if (!redisClient || !key || !field) return null;
    return redisClient.hget(key, field);
  }

  // ── List Operations ───────────────────────────────────────────────────────
  /**
   * Pushes a value to a Redis List (LPUSH or RPUSH).
   * @param {Object} redisClient
   * @param {string} key
   * @param {any} value - Automatically JSON stringified if object
   * @param {'left'|'right'} [position='left']
   */
  static async pushToList(redisClient, key, value, position = 'left') {
    if (!redisClient || !key) return 0;
    const strVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return position === 'right'
      ? redisClient.rpush(key, strVal)
      : redisClient.lpush(key, strVal);
  }

  /**
   * Pops a value from a Redis List (LPOP or RPOP).
   * @param {Object} redisClient
   * @param {string} key
   * @param {'left'|'right'} [position='left']
   */
  static async popFromList(redisClient, key, position = 'left') {
    if (!redisClient || !key) return null;
    return position === 'right'
      ? redisClient.rpop(key)
      : redisClient.lpop(key);
  }

  /**
   * Retrieves a range of elements from a Redis List.
   * @param {Object} redisClient
   * @param {string} key
   * @param {number} [start=0]
   * @param {number} [stop=-1]
   */
  static async getListRange(redisClient, key, start = 0, stop = -1) {
    if (!redisClient || !key) return [];
    return redisClient.lrange(key, start, stop);
  }

  /**
   * Returns the length of a Redis List.
   */
  static async getListLength(redisClient, key) {
    if (!redisClient || !key) return 0;
    return redisClient.llen(key);
  }

  // ── Set Operations ────────────────────────────────────────────────────────
  /**
   * Adds one or more members to a Redis Set.
   */
  static async addToSet(redisClient, key, ...members) {
    if (!redisClient || !key || members.length === 0) return 0;
    const stringified = members.map((m) => (typeof m === 'object' ? JSON.stringify(m) : String(m)));
    return redisClient.sadd(key, ...stringified);
  }

  /**
   * Removes one or more members from a Redis Set.
   */
  static async removeFromSet(redisClient, key, ...members) {
    if (!redisClient || !key || members.length === 0) return 0;
    const stringified = members.map((m) => (typeof m === 'object' ? JSON.stringify(m) : String(m)));
    return redisClient.srem(key, ...stringified);
  }

  /**
   * Retrieves all members of a Redis Set.
   */
  static async getSetMembers(redisClient, key) {
    if (!redisClient || !key) return [];
    return redisClient.smembers(key);
  }

  /**
   * Checks if a member exists in a Redis Set.
   */
  static async isSetMember(redisClient, key, member) {
    if (!redisClient || !key) return false;
    const str = typeof member === 'object' ? JSON.stringify(member) : String(member);
    const result = await redisClient.sismember(key, str);
    return result === 1;
  }

  // ── Distributed Lock Operations ─────────────────────────────────────────
  /**
   * Acquires a distributed lock using SET key val NX EX ttlSeconds.
   * Returns true if lock was acquired, false if held by another process.
   * @param {Object} redisClient
   * @param {string} key
   * @param {number} [ttlSeconds=60]
   * @returns {Promise<boolean>}
   */
  static async acquireLock(redisClient, key, ttlSeconds = 60) {
    if (!redisClient || !key) return false;
    const result = await redisClient.set(key, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  /**
   * Releases a distributed lock.
   */
  static async releaseLock(redisClient, key) {
    if (!redisClient || !key) return 0;
    return redisClient.del(key);
  }

  // ── Pub/Sub Operations ───────────────────────────────────────────────────
  /**
   * Publishes a JSON payload or string to a Redis channel.
   * @param {Object} redisClient
   * @param {string} channel
   * @param {any} message
   */
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
