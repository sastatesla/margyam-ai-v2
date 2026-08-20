"""
guidance_worker.py — Celery worker for scheduled daily guidance generation.
"""
import asyncio
from celery_app import celery_app
from src.services.guidance_service import GuidanceService

guidance_service = GuidanceService()

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]


@celery_app.task
def generate_daily_guidance():
    """Triggered by Celery Beat every 7 hours."""
    print("[Celery] Generating daily horoscopes and transits for active users & zodiac signs...")

    async def batch_generate():
        results = []
        for sign in ZODIAC_SIGNS:
            res = await guidance_service.generate_daily(user_id=f"zodiac_{sign.lower()}", sign=sign)
            results.append(res)
        return results

    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    generated = loop.run_until_complete(batch_generate())
    return {"status": "completed", "count": len(generated)}

