from fastapi import APIRouter, Depends
from src.controllers.astro import AstroController
from src.schemas.astro import ChartRequest, TransitRequest

router = APIRouter(prefix="/astro", tags=["Astrology"])
controller = AstroController()


@router.post("/chart")
async def calculate_chart(payload: ChartRequest):
    return await controller.get_chart(payload)


@router.post("/transit")
async def calculate_transit(payload: TransitRequest):
    return await controller.get_transit(payload)
