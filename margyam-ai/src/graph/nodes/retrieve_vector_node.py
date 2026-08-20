import logging
from typing import List, Dict, Any
from src.graph.state import AgentState
from src.utils.weaviate_manager import weaviate_manager
from src.utils.progress_translator import translate_progress_message

logger = logging.getLogger(__name__)


class RetrieveVectorNode:
    """
    RetrieveVectorNode queries the Weaviate v4 vector store using sparse + dense
    hybrid search on the REFRAMED query string (fixing monolith Tech Debt #4).
    """
    def __init__(self):
        self.weaviate = weaviate_manager

    async def __call__(self, state: AgentState) -> AgentState:
        reframed_query = state.get("reframed_query") or state.get("query", "")
        intent = state.get("intent", "GENERAL_CHAT")
        lang = state.get("language", "en")

        state["progress_message"] = translate_progress_message("Searching classical texts and planetary records...", lang)

        if intent == "GENERAL_CHAT":
            state["retrieved_docs"] = []
            return state

        # Perform hybrid sparse + dense vector search via WeaviateManager
        docs: List[Dict[str, Any]] = await self.weaviate.search_hybrid(reframed_query, limit=3)

        state["retrieved_docs"] = docs
        logger.info("Retrieved %d vector documents for reframed query", len(docs))
        return state


