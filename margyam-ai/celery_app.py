from celery import Celery
from src.configs.settings import settings

celery_app = Celery(
    "margyam-ai",
    broker=f"redis://{settings.redis_host}:{settings.redis_port}/0",
    backend=f"redis://{settings.redis_host}:{settings.redis_port}/1",
    include=[
        "src.system.workers.guidance.worker",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    # Background cron schedule
    beat_schedule={
        "generate-morning-guidance": {
            "task":     "src.system.workers.guidance.worker.generate_daily_guidance",
            "schedule": 25200.0,   # Every 7 hours
        },
    },
)
