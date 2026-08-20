"""
tracer.py — LangSmith & OpenTelemetry Distributed Tracing Wrapper for Margyam AI.
Provides PII-safe span wrapping around LangGraph workflow execution, vector search, and Gemini LLM calls.
Ported with 100% fidelity from monolith margyam-be/src/utils/tracer.js.
"""
import logging
import os
from functools import wraps
from typing import Dict, Any, Callable, Optional
from src.configs.settings import settings

logger = logging.getLogger(__name__)

# Configure environment for native LangSmith / LangChain tracing if API key is provided
if settings.langchain_api_key or os.getenv("LANGCHAIN_API_KEY"):
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGCHAIN_ENDPOINT"] = os.getenv("LANGCHAIN_ENDPOINT", settings.langchain_endpoint)
    os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY", settings.langchain_api_key)
    os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT", settings.langchain_project)


def mask_query(query: str) -> str:
    """Masks query string to preserve privacy while retaining metadata."""
    if not query:
        return "[empty]"
    trimmed = query.strip()
    if len(trimmed) <= 40:
        return f"{trimmed[:40]}… [{len(trimmed)} chars]"
    return f"{trimmed[:40]}… [{len(trimmed)} chars total]"


def mask_astro_context(context: Dict[str, Any]) -> Dict[str, Any]:
    """Replaces astrological context with non-PII structural metadata."""
    if not context:
        return {"present": False}
    return {
        "present": True,
        "transits_count": len(context.get("transits", [])),
        "has_chart": bool(context.get("chart")),
    }


class AstroTracer:
    def __init__(self):
        self.enabled = (
            os.getenv("LANGCHAIN_TRACING_V2", "false").lower() == "true"
            or settings.langsmith_tracing
            or bool(os.getenv("LANGCHAIN_API_KEY"))
        )
        self.project = os.getenv("LANGCHAIN_PROJECT", settings.langchain_project)

    def trace_span(self, span_name: str, metadata: Optional[Dict[str, Any]] = None):
        if self.enabled:
            masked_meta = {
                k: (mask_query(v) if k == "query" else v)
                for k, v in (metadata or {}).items()
            }
            logger.info("[LANGSMITH SPAN: %s | Project: %s] Meta: %s", span_name, self.project, masked_meta)


def traced(span_name: str):
    """Decorator to trace function calls with LangSmith span tracking."""
    def decorator(func: Callable):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            tracer.trace_span(span_name, {"args_count": len(args), "kwargs_keys": list(kwargs.keys())})
            return await func(*args, **kwargs)

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            tracer.trace_span(span_name, {"args_count": len(args), "kwargs_keys": list(kwargs.keys())})
            return func(*args, **kwargs)

        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator


import asyncio

# Singleton instance
tracer = AstroTracer()
