import pytest
from src.graph.workflow import astro_workflow
from src.graph.state import AgentState


@pytest.mark.asyncio
async def test_langgraph_agentic_workflow_execution():
    initial_state: AgentState = {
        "query": "Will I get promoted in my job this year?",
        "user_id": "test_user_99",
        "session_id": "session_123",
        "language": "en",
        "intent": "",
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

    assert final_state["intent"] == "CAREER"
    assert "CAREER" in final_state["reframed_query"]
    assert final_state["response"] is not None
    assert len(final_state["response"]) > 0
    assert final_state["confidence_score"] >= 90
    assert len(final_state["citations"]) > 0
    assert len(final_state["follow_up_questions"]) > 0
