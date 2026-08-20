"""
astro_handler.py — gRPC handler for AstroService interface.
"""
from src.services.kundli_service import KundliService
from src.schemas.astro import ChartRequest

try:
    from src.system.grpc.generated import astro_pb2, astro_pb2_grpc
    BaseServicer = astro_pb2_grpc.AstroServiceServicer
except ImportError:
    astro_pb2 = None
    BaseServicer = object

kundli_service = KundliService()


class AstroServiceHandler(BaseServicer):
    async def CalculateChart(self, request, context):
        try:
            req = ChartRequest(
                user_id=request.user_id,
                latitude=request.latitude,
                longitude=request.longitude,
                date_of_birth=request.date_of_birth,
                time_of_birth=request.time_of_birth,
                timezone=request.timezone or "Asia/Kolkata",
            )
            chart = await kundli_service.calculate(req)
            if astro_pb2:
                planets = [
                    astro_pb2.Planet(
                        name=p["name"],
                        sign=p["sign"],
                        house=p["house"],
                        degrees=p["degrees"],
                        retrograde=p["retrograde"],
                    )
                    for p in chart.get("planets", [])
                ]
                return astro_pb2.ChartResponse(
                    success=True,
                    planets=planets,
                    lagna=chart.get("lagna", ""),
                )
            return {"success": True, "planets": chart.get("planets", []), "lagna": chart.get("lagna", "")}
        except Exception as e:
            if astro_pb2:
                return astro_pb2.ChartResponse(success=False, error=str(e))
            return {"success": False, "error": str(e)}
