from pydantic import BaseModel
from typing import Optional


class ChartRequest(BaseModel):
    user_id:       str
    latitude:      float
    longitude:     float
    date_of_birth: str   # YYYY-MM-DD
    time_of_birth: str   # HH:MM
    timezone:      str = "Asia/Kolkata"


class Planet(BaseModel):
    name:      str
    sign:      str
    house:     int
    degrees:   float
    retrograde: bool = False


class TransitRequest(BaseModel):
    user_id:  Optional[str] = None
    date:     Optional[str] = None  # Defaults to today if not provided
    timezone: str = "Asia/Kolkata"

