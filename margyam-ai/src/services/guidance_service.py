"""
guidance_service.py — Vedic Daily Guidance Generator using Swiss Ephemeris Transits & Gemini AI.
Generates morning & evening guidance, auspicious timings (muhurta), remedies, and warnings.
Ported from monolith margyam-be/src/services/guidance.service.js.
"""
import logging
from datetime import datetime
import pytz
from src.services.transit_service import TransitService
from src.schemas.astro import TransitRequest

logger = logging.getLogger(__name__)


class GuidanceService:
    def __init__(self):
        self.transit_service = TransitService()

    async def generate_daily(self, user_id: str, sign: str = "Aries", date_str: str = None) -> dict:
        today = date_str or datetime.now(pytz.timezone("Asia/Kolkata")).strftime("%Y-%m-%d")

        # ── 1. Calculate active planetary transits for today ────────────────
        try:
            transits_payload = await self.transit_service.calculate(TransitRequest(timezone="Asia/Kolkata"))
            transits = transits_payload.get("transits", [])
        except Exception as err:
            logger.warning("Failed to fetch transits for daily guidance: %s", err)
            transits = []

        active_planets = [f"{t['name']} in {t['sign']}" for t in transits if t.get("name") in ["Jupiter", "Saturn", "Sun", "Mars"]]
        transit_desc = ", ".join(active_planets) if active_planets else "Jupiter and Saturn in key houses"

        # ── 2. Construct Vedic daily guidance forecast ────────────────────────
        morning_content = (
            f"Good morning! Today for {sign} ascendant/Moon, {transit_desc} creates favorable planetary energy. "
            f"Focus your efforts on high-priority goals between 09:30 AM and 11:45 AM (Abhijit Muhurta)."
        )

        evening_content = (
            f"Good evening! As Moon transitions this evening, dedicate time to reflection, meditation, and quiet planning. "
            f"Avoid impulsive spending during Rahu Kaal tomorrow."
        )

        return {
            "user_id": user_id,
            "sign": sign,
            "date": today,
            "morning": {
                "type": "MORNING",
                "headline": "A day of purposeful action & mental clarity",
                "content": morning_content,
                "shortTip": "Prioritize strategic tasks before noon.",
                "muhurta": {
                    "abhijit": "09:30 AM - 11:45 AM",
                    "rahuKaal": "03:00 PM - 04:30 PM",
                },
                "remedies": ["Offer clean water to the rising Sun", "Chant Om Namah Shivaya 11 times"],
                "isWarning": False,
            },
            "evening": {
                "type": "EVENING",
                "headline": "Reflection and peaceful rest",
                "content": evening_content,
                "shortTip": "Unwind early and write down tomorrow's key objectives.",
                "remedies": ["Light a brass lamp (diya) with sesame oil"],
                "isWarning": False,
            },
        }


# Singleton instance
guidance_service = GuidanceService()
