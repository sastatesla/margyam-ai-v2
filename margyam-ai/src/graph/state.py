from typing import TypedDict, List, Dict, Any, Optional


class AgentState(TypedDict):
    """
    AgentState encapsulates the stateful context passed between nodes
    in the LangGraph workflow engine.
    """
    query: str
    user_id: str
    session_id: str
    language: str
    intent: str
    reframed_query: str
    semantic_cache_hit: bool
    cached_answer: Optional[str]
    astrological_context: Dict[str, Any]
    retrieved_docs: List[Dict[str, Any]]
    response: str
    confidence_score: int
    citations: List[str]
    follow_up_questions: List[str]
    model_used: str
