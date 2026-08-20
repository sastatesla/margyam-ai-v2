"""
transit_service.py — Gochar planetary transit calculations using pyswisseph (Swiss Ephemeris).
Calculates current transit positions of slow & fast-moving planets relative to user natal Moon/Lagna.
"""
import asyncio
import swisseph as swe
from datetime import datetime
import pytz
from src.schemas.astro import TransitRequest

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]


class TransitService:
    def __init__(self):
        try:
            swe.set_ephe_path("/usr/share/ephe")
        except Exception:
            pass

    async def calculate(self, payload: TransitRequest) -> dict:
        return await asyncio.to_thread(self._calculate_sync, payload)

    def _calculate_sync(self, payload: TransitRequest) -> dict:
        try:
            tz = pytz.timezone(payload.timezone or "Asia/Kolkata")
        except Exception:
            tz = pytz.timezone("Asia/Kolkata")

        now = datetime.now(tz)
        utc_dt = now.astimezone(pytz.utc)
        hour_decimal = utc_dt.hour + (utc_dt.minute / 60.0) + (utc_dt.second / 3600.0)
        jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hour_decimal, swe.GREG_CAL)

        # Lahiri Sidereal Mode
        swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
        flag = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED

        bodies = [
            (swe.SUN, "Sun"),
            (swe.MOON, "Moon"),
            (swe.MERCURY, "Mercury"),
            (swe.VENUS, "Venus"),
            (swe.MARS, "Mars"),
            (swe.JUPITER, "Jupiter"),
            (swe.SATURN, "Saturn"),
            (swe.TRUE_NODE, "Rahu"),
        ]

        transits = []
        for pid, name in bodies:
            res = swe.calc_ut(jd, pid, flag)
            lon = ((res[0][0] % 360) + 360) % 360
            sign = SIGNS[int(lon // 30)]

            transits.append({
                "name": name,
                "longitude": round(lon, 4),
                "degrees": round(lon % 30, 4),
                "sign": sign,
                "retrograde": res[0][3] < 0,
            })

        rahu = next((t for t in transits if t["name"] == "Rahu"), None)
        if rahu:
            ketu_lon = (rahu["longitude"] + 180) % 360
            transits.append({
                "name": "Ketu",
                "longitude": round(ketu_lon, 4),
                "degrees": round(ketu_lon % 30, 4),
                "sign": SIGNS[int(ketu_lon // 30)],
                "retrograde": True,
            })

        return {
            "success": True,
            "transit_date": now.strftime("%Y-%m-%d %H:%M:%S"),
            "transits": transits,
        }
