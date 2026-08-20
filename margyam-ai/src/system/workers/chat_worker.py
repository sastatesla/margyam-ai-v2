"""
chat_worker.py — Consumes the 'chat:tasks' Redis Stream.
Processes each job through the RAG pipeline and publishes
response tokens back via Redis Pub/Sub for the Gateway to stream to the client.

Run:
  python -m src.system.workers.chat_worker
"""
import asyncio
import json
from src.configs.redis import get_redis
from src.services.rag_service import RAGService

STREAM_KEY     = "chat:tasks"
CONSUMER_GROUP = "ai-workers"
CONSUMER_NAME  = "ai-worker-1"

rag_service = RAGService()



async def process_job(job: dict):
    redis  = await get_redis()
    session_id = job.get("sessionId")
    channel    = f"stream:{session_id}"

    try:
        async for chunk in rag_service.stream(job):
            await redis.publish(channel, json.dumps({"chunk": chunk, "done": False}))

        await redis.publish(channel, json.dumps({"chunk": "", "done": True}))

    except Exception as err:
        await redis.publish(channel, json.dumps({"chunk": "", "done": True, "error": str(err)}))


async def run():
    redis = await get_redis()

    try:
        await redis.xgroup_create(STREAM_KEY, CONSUMER_GROUP, id="0", mkstream=True)
    except Exception:
        pass  # Group already exists

    print(f"[Worker] Listening on stream '{STREAM_KEY}'...")

    while True:
        messages = await redis.xreadgroup(
            CONSUMER_GROUP, CONSUMER_NAME,
            {STREAM_KEY: ">"}, count=1, block=5000
        )
        for _, entries in (messages or []):
            for entry_id, fields in entries:
                await process_job(fields)
                await redis.xack(STREAM_KEY, CONSUMER_GROUP, entry_id)


if __name__ == "__main__":
    asyncio.run(run())
