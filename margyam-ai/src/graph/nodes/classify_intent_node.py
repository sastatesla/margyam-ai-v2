import logging
from src.graph.state import AgentState
from src.services.intent_service import IntentService
from src.utils.progress_translator import translate_progress_message

logger = logging.getLogger(__name__)


class ClassifyIntentNode:
    """
    ClassifyIntentNode categorizes user queries into domain buckets
    (CAREER, WEALTH, RELATIONSHIP, HEALTH, DAILY, DEEP_ASTRO_RESEARCH, GENERAL_CHAT).
    """
    def __init__(self):
        self.intent_service = IntentService()

    async def __call__(self, state: AgentState) -> AgentState:
        query = state.get("query", "")
        lang = state.get("language", "en")
        intent = await self.intent_service.classify(query)

        # Generate reframed query with domain context for vector search
        reframed_query = f"{intent} astrological context: {query}"

        state["intent"] = intent
        state["reframed_query"] = reframed_query
        state["progress_message"] = translate_progress_message("Classifying user intent...", lang)
        logger.info("Classified intent: %s for query: %s", intent, query[:30])
        return state

