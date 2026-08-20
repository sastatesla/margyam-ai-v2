"""
graph_service.py — Service layer wrapping LangGraph workflow engine execution.
Ported with 100% fidelity from monolith margyam-be/src/services/graph.service.js.
"""
import logging
from typing import Dict, Any
from src.graph.workflow import astro_workflow
from src.graph.state import AgentState
from src.utils.constants import MODELS

logger = logging.getLogger(__name__)


class GraphService:
    """
    GraphService wraps the compiled AstroGraphWorkflow StateGraph execution engine.
    """
    def __init__(self):
        self.workflow = astro_workflow

    async def execute_graph(self, query: str, user_id: str = "guest", session_id: str = "", language: str = "en") -> Dict[str, Any]:
        initial_state: AgentState = {
            "query": query,
            "user_id": user_id,
            "session_id": session_id,
            "language": language,
            "intent": "GENERAL_CHAT",
            "reframed_query": "",
            "semantic_cache_hit": False,
            "cached_answer": None,
            "astrological_context": {},
            "retrieved_docs": [],
            "response": "",
            "confidence_score": 0,
            "citations": [],
            "follow_up_questions": [],
            "model_used": "",
        }

        logger.info("GraphService executing workflow graph for user %s", user_id)
        final_state = await self.workflow.run(initial_state)

        return {
            "query": final_state.get("query", query),
            "intent": final_state.get("intent", "GENERAL_CHAT"),
            "response": final_state.get("response", ""),
            "confidence_score": final_state.get("confidence_score", 90),
            "citations": final_state.get("citations", []),
            "follow_up_questions": final_state.get("follow_up_questions", []),
            "semantic_cache_hit": final_state.get("semantic_cache_hit", False),
            "model_used": final_state.get("model_used", MODELS["GEMINI"]["FLASH_LOW_LATENCY"]),
        }


# Singleton instance
graph_service = GraphService()

