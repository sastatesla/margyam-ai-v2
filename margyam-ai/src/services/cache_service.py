"""
cache_service.py — Semantic cache for RAG responses backed by Redis.
Includes SHA-256 cache key generation for zodiac & planetary placements.
"""
import hashlib
import json
import logging
from src.configs.redis import get_redis

logger = logging.getLogger(__name__)


class CacheService:
    @staticmethod
    def generate_cache_key(sign: str, query: str) -> str:
        raw_str = f"{sign}:{query.strip().lower()}"
        sha = hashlib.sha256(raw_str.encode("utf-8")).hexdigest()
        return f"cache:rag:{sha}"

    async def get_cached_query(self, query: str, sign: str = "general") -> str | None:
        try:
            redis = await get_redis()
            key = self.generate_cache_key(sign, query)
            val = await redis.get(key)
            if val:
                return val.decode("utf-8") if isinstance(val, bytes) else str(val)
        except Exception as err:
            logger.warning("Redis cache read error: %s", err)
        return None

    async def set_cached_query(self, query: str, answer: str, sign: str = "general", ttl: int = 86400):
        try:
            redis = await get_redis()
            key = self.generate_cache_key(sign, query)
            await redis.set(key, answer, ex=ttl)
        except Exception as err:
            logger.warning("Redis cache write error: %s", err)


# Singleton instance
cache_service = CacheService()
