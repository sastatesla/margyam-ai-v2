import logging
from langgraph.graph import StateGraph, START, END
from src.graph.state import AgentState
from src.graph.nodes.check_cache_node import CheckCacheNode
from src.graph.nodes.classify_intent_node import ClassifyIntentNode
from src.graph.nodes.retrieve_vector_node import RetrieveVectorNode
from src.graph.nodes.enrich_astro_node import EnrichAstroNode
from src.graph.nodes.synthesize_node import SynthesizeNode

logger = logging.getLogger(__name__)


def route_after_cache(state: AgentState) -> str:
    """
    Conditional edge router: If L1 semantic cache hits, skip retrieval & synthesis!
    """
    if state.get("semantic_cache_hit"):
        return END
    return "classify_intent"


class AstroGraphWorkflow:
    """
    AstroGraphWorkflow builds and compiles the production-grade stateful agentic workflow graph.
    """
    def __init__(self):
        self.check_cache = CheckCacheNode()
        self.classify_intent = ClassifyIntentNode()
        self.retrieve_vector = RetrieveVectorNode()
        self.enrich_astro = EnrichAstroNode()
        self.synthesize = SynthesizeNode()

        self.graph = self._build_graph()

    def _build_graph(self):
        builder = StateGraph(AgentState)

        # Add Nodes
        builder.add_node("check_cache", self.check_cache)
        builder.add_node("classify_intent", self.classify_intent)
        builder.add_node("retrieve_vector", self.retrieve_vector)
        builder.add_node("enrich_astro", self.enrich_astro)
        builder.add_node("synthesize", self.synthesize)

        # Build Edges
        builder.add_edge(START, "check_cache")
        builder.add_conditional_edges("check_cache", route_after_cache, {END: END, "classify_intent": "classify_intent"})
        builder.add_edge("classify_intent", "retrieve_vector")
        builder.add_edge("retrieve_vector", "enrich_astro")
        builder.add_edge("enrich_astro", "synthesize")
        builder.add_edge("synthesize", END)

        return builder.compile()

    async def run(self, initial_state: AgentState) -> AgentState:
        logger.info("Executing LangGraph agentic workflow for query: %s", initial_state.get("query", "")[:30])
        final_state = await self.graph.ainvoke(initial_state)
        return final_state


# Singleton instance
astro_workflow = AstroGraphWorkflow()
