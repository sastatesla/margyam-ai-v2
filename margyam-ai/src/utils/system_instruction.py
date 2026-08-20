"""
system_instruction.py — Re-exports master system prompts from src/prompts/system_prompts.py.
"""
from src.prompts.system_prompts import (
    get_astrologer_system_prompt,
    get_query_reframing_prompt,
    get_general_chat_prompt,
)

__all__ = [
    "get_astrologer_system_prompt",
    "get_query_reframing_prompt",
    "get_general_chat_prompt",
]
