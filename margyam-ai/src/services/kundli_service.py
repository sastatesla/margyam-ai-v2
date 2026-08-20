"""
kundli_service.py — Sidereal Vedic natal chart calculation using pyswisseph (Swiss Ephemeris).
Fully ports Lahiri Ayanamsha, Nakshatras, Ketu calculation, and Vimshottari Dasha timeline from margyam-be.
"""
import asyncio
import math
import swisseph as swe
from datetime import datetime, timedelta
import pytz
from src.schemas.astro import ChartRequest

NAKSHATRAS = [
    {"name": "Ashwini", "lord": "Ketu", "years": 7},
    {"name": "Bharani", "lord": "Venus", "years": 20},
    {"name": "Krittika", "lord": "Sun", "years": 6},
    {"name": "Rohini", "lord": "Moon", "years": 10},
    {"name": "Mrigashirsha", "lord": "Mars", "years": 7},
    {"name": "Ardra", "lord": "Rahu", "years": 18},
    {"name": "Punarvasu", "lord": "Jupiter", "years": 16},
    {"name": "Pushya", "lord": "Saturn", "years": 19},
    {"name": "Ashlesha", "lord": "Mercury", "years": 17},
    {"name": "Magha", "lord": "Ketu", "years": 7},
    {"name": "Purva Phalguni", "lord": "Venus", "years": 20},
    {"name": "Uttara Phalguni", "lord": "Sun", "years": 6},
    {"name": "Hasta", "lord": "Moon", "years": 10},
    {"name": "Chitra", "lord": "Mars", "years": 7},
    {"name": "Swati", "lord": "Rahu", "years": 18},
    {"name": "Vishakha", "lord": "Jupiter", "years": 16},
    {"name": "Anuradha", "lord": "Saturn", "years": 19},
    {"name": "Jyeshtha", "lord": "Mercury", "years": 17},
    {"name": "Mula", "lord": "Ketu", "years": 7},
    {"name": "Purva Ashadha", "lord": "Venus", "years": 20},
    {"name": "Uttara Ashadha", "lord": "Sun", "years": 6},
    {"name": "Shravana", "lord": "Moon", "years": 10},
    {"name": "Dhanishtha", "lord": "Mars", "years": 7},
    {"name": "Shatabhisha", "lord": "Rahu", "years": 18},
    {"name": "Purva Bhadrapada", "lord": "Jupiter", "years": 16},
    {"name": "Uttara Bhadrapada", "lord": "Saturn", "years": 19},
    {"name": "Revati", "lord": "Mercury", "years": 17},
]

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

PLANET_IDS = [
    (swe.SUN, "Sun"),
    (swe.MOON, "Moon"),
    (swe.MARS, "Mars"),
    (swe.MERCURY, "Mercury"),
    (swe.JUPITER, "Jupiter"),
    (swe.VENUS, "Venus"),
    (swe.SATURN, "Saturn"),
    (swe.TRUE_NODE, "Rahu"),
]


class KundliService:
    def __init__(self):
        try:
            swe.set_ephe_path("/usr/share/ephe")
        except Exception:
            pass

    async def calculate(self, payload: ChartRequest) -> dict:
        return await asyncio.to_thread(self._calculate_sync, payload)

    def _calculate_sync(self, payload: ChartRequest) -> dict:
        try:
            tz = pytz.timezone(payload.timezone or "Asia/Kolkata")
        except Exception:
            tz = pytz.timezone("Asia/Kolkata")

        dob = datetime.strptime(f"{payload.date_of_birth} {payload.time_of_birth}", "%Y-%m-%d %H:%M")
        utc_dt = tz.localize(dob).astimezone(pytz.utc)

        hour_decimal = utc_dt.hour + (utc_dt.minute / 60.0) + (utc_dt.second / 3600.0)
        jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hour_decimal, swe.GREG_CAL)

        # Set Sidereal Mode to Lahiri
        swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
        ayanamsha = swe.get_ayanamsa_ut(jd)

        # Ascendant calculation
        houses_res = swe.houses_ex(jd, payload.latitude, payload.longitude, b'P', swe.FLG_SIDEREAL)
        asc = houses_res[0][0]

        flag = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED

        planets = []
        moon_lon = 0.0

        for pid, name in PLANET_IDS:
            res = swe.calc_ut(jd, pid, flag)
            lon = ((res[0][0] % 360) + 360) % 360
            sign_idx = int(lon // 30)
            asc_idx = int(asc // 30)
            house = ((sign_idx - asc_idx + 12) % 12) + 1

            if name == "Moon":
                moon_lon = lon

            planets.append({
                "name": name,
                "longitude": round(lon, 4),
                "degrees": round(lon % 30, 4),
                "sign": SIGNS[sign_idx],
                "house": house,
                "retrograde": res[0][3] < 0,
            })

        # Calculate Ketu (180 degrees opposite Rahu)
        rahu = next((p for p in planets if p["name"] == "Rahu"), None)
        if rahu:
            ketu_lon = (rahu["longitude"] + 180) % 360
            ketu_sign_idx = int(ketu_lon // 30)
            asc_idx = int(asc // 30)
            ketu_house = ((ketu_sign_idx - asc_idx + 12) % 12) + 1

            planets.append({
                "name": "Ketu",
                "longitude": round(ketu_lon, 4),
                "degrees": round(ketu_lon % 30, 4),
                "sign": SIGNS[ketu_sign_idx],
                "house": ketu_house,
                "retrograde": True,
            })

        lagna_sign = SIGNS[int(asc // 30)]
        nakshatra = self.get_nakshatra(moon_lon)
        dashas = self.calculate_vimshottari_dashas(moon_lon, dob)

        return {
            "success": True,
            "planets": planets,
            "lagna": lagna_sign,
            "ascendant_degrees": round(asc % 30, 4),
            "ayanamsha": round(ayanamsha, 4),
            "nakshatra": nakshatra,
            "vimshottari_dasha": dashas,
        }

    @staticmethod
    def get_nakshatra(moon_lon: float) -> dict:
        idx = int(moon_lon // (360.0 / 27.0))
        return {**NAKSHATRAS[idx], "index": idx}

    @staticmethod
    def calculate_vimshottari_dashas(moon_lon: float, birth_dt: datetime) -> dict:
        nak_span = 13.333333333333334  # 13°20'
        pos_in_nak = moon_lon % nak_span
        fraction_used = pos_in_nak / nak_span

        nak_idx = int(moon_lon // nak_span)
        current_nak = NAKSHATRAS[nak_idx]

        balance_years = current_nak["years"] * (1.0 - fraction_used)
        start_date = birth_dt
        end_date = start_date + timedelta(days=int(balance_years * 365.25))

        return {
            "current_mahadasha": current_nak["lord"],
            "mahadasha_end": end_date.strftime("%Y-%m-%d"),
            "balance_years": round(balance_years, 2),
        }
