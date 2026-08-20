"""
prompt_guard.py — Security & Jailbreak Detector.
Blocks prompt injection, system prompt leaks, and malicious override instructions.
"""
import logging
import re

logger = logging.getLogger(__name__)

INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"ignore all instructions",
    r"system prompt",
    r"you are now an unfiltered ai",
    r"override rules",
    r"jailbreak",
]


class PromptGuard:
    @staticmethod
    def detect_prompt_injection(user_input: str) -> bool:
        if not user_input:
            return False

        lower_input = user_input.lower()
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, lower_input):
                logger.warning("Prompt injection attempt detected: %s", pattern)
                return True

        return False

    @staticmethod
    def sanitize(user_input: str) -> str:
        if not user_input:
            return ""
        # Remove XML-like tags to prevent prompt escaping
        clean = re.sub(r"<[^>]*>", "", user_input)
        return clean.strip()


# Singleton instance
prompt_guard = PromptGuard()
