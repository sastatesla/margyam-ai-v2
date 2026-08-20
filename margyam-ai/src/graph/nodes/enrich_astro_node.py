import logging
from src.graph.state import AgentState
from src.services.transit_service import TransitService
from src.schemas.astro import TransitRequest

logger = logging.getLogger(__name__)


class EnrichAstroNode:
    """
    EnrichAstroNode computes high-precision Lahiri Sidereal Gochar transits
    and merges natal Kundli placements into the LLM prompt context.
    """
    def __init__(self):
        self.transit_service = TransitService()

    async def __call__(self, state: AgentState) -> AgentState:
        try:
            transit_res = await self.transit_service.calculate(TransitRequest(timezone="Asia/Kolkata"))
            state["astrological_context"] = {
                "transits": transit_res.get("transits", []),
                "transit_date": transit_res.get("transit_date"),
            }
            logger.info("Enriched state with Gochar transits")
        except Exception as err:
            logger.warning("Enrich astro context warning: %s", err)
            state["astrological_context"] = {}

        return state
