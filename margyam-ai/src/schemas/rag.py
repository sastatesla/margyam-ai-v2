from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from src.utils.constants import MODELS


class RAGQueryRequest(BaseModel):
    query:      str
    user_id:    str = "guest"
    session_id: Optional[str] = ""
    language:   Optional[str] = "en"
    context:    Optional[Dict[str, Any]] = None


class RAGQueryResponse(BaseModel):
    query:               Optional[str] = ""
    intent:              Optional[str] = "GENERAL_CHAT"
    response:            str
    confidence_score:    int = 90
    citations:           List[str] = []
    follow_up_questions: List[str] = []
    semantic_cache_hit:  bool = False
    model_used:          str = MODELS["GEMINI"]["FLASH_LOW_LATENCY"]


# Aliases for controller & router compatibility
QueryRequest = RAGQueryRequest
QueryResponse = RAGQueryResponse


