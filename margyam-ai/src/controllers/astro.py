from fastapi import HTTPException
from src.services.kundli_service import KundliService
from src.services.transit_service import TransitService
from src.schemas.astro import ChartRequest, TransitRequest


class AstroController:
    def __init__(self):
        self.kundli_service  = KundliService()
        self.transit_service = TransitService()

    async def get_chart(self, payload: ChartRequest):
        try:
            chart = await self.kundli_service.calculate(payload)
            return {"success": True, "data": chart}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_transit(self, payload: TransitRequest):
        try:
            transits = await self.transit_service.calculate(payload)
            return {"success": True, "data": transits}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
