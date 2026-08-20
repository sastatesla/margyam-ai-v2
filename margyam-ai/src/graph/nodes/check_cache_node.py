import logging
from src.graph.state import AgentState
from src.services.cache_service import CacheService

logger = logging.getLogger(__name__)


class CheckCacheNode:
    """
    CheckCacheNode checks Redis L1 exact hashes FIRST before invoking
    expensive embedding API calls, eliminating unnecessary Latency & API cost.
    """
    def __init__(self):
        self.cache_service = CacheService()

    async def __call__(self, state: AgentState) -> AgentState:
        query = state.get("query", "")
        if not query:
            return state

        try:
            cached_res = await self.cache_service.get_cached_query(query)
            if cached_res:
                logger.info("Semantic cache HIT for query: %s", query[:30])
                state["semantic_cache_hit"] = True
                state["cached_answer"] = cached_res
                state["response"] = cached_res
                state["confidence_score"] = 99
                state["citations"] = ["Cache: Exact Historical Pattern Match"]
                state["follow_up_questions"] = [
                    "Would you like to know more about this transit?",
                    "What specific area of life would you like to explore next?"
                ]
            else:
                state["semantic_cache_hit"] = False
                state["cached_answer"] = None
        except Exception as err:
            logger.warning("Cache lookup warning: %s", err)
            state["semantic_cache_hit"] = False

        return state
