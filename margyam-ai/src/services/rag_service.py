import asyncio
import logging
from src.schemas.rag import RAGQueryRequest, RAGQueryResponse
from src.graph.workflow import astro_workflow
from src.graph.state import AgentState
from src.utils.constants import MODELS

logger = logging.getLogger(__name__)


class RAGService:
    """
    RAGService delegates query processing directly to the compiled LangGraph workflow.
    """
    async def process_query(self, payload: RAGQueryRequest) -> RAGQueryResponse:
        initial_state: AgentState = {
            "query": payload.query,
            "user_id": payload.user_id,
            "session_id": payload.session_id or "",
            "language": payload.language or "en",
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

        final_state = await astro_workflow.run(initial_state)

        return RAGQueryResponse(
            query=final_state.get("query", ""),
            intent=final_state.get("intent", ""),
            response=final_state.get("response", ""),
            confidence_score=final_state.get("confidence_score", 90),
            citations=final_state.get("citations", []),
            follow_up_questions=final_state.get("follow_up_questions", []),
            semantic_cache_hit=final_state.get("semantic_cache_hit", False),
            model_used=final_state.get("model_used", MODELS["GEMINI"]["FLASH_LOW_LATENCY"]),
        )


    async def stream(self, payload: dict):
        query = payload.get("query", "")
        user_id = payload.get("userId") or payload.get("user_id", "guest")
        session_id = payload.get("sessionId") or payload.get("session_id", "")
        language = payload.get("language", "en")

        req = RAGQueryRequest(
            query=query,
            user_id=user_id,
            session_id=session_id,
            language=language,
        )

        response_obj = await self.process_query(req)
        full_text = response_obj.response or ""

        # Stream text response in chunks for ultra-fast socket delivery
        chunk_size = 25
        for i in range(0, len(full_text), chunk_size):
            yield full_text[i:i + chunk_size]
            await asyncio.sleep(0.01)

