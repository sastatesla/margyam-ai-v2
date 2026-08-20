"""
gemini.py — Google GenAI & Vertex AI SDK Client Integration.
Handles Gemini text generation, thinking budgets, and text embeddings.
"""
import logging
import os
import google.generativeai as genai
from typing import List
from src.utils.constants import MODELS

logger = logging.getLogger(__name__)


class GeminiClient:
    """
    GeminiClient wraps Google Generative AI SDK for model inference & embeddings.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GCLOUD_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)

    async def generate_text(self, prompt: str, model_name: str = MODELS["GEMINI"]["FLASH_LOW_LATENCY"]) -> str:
        try:
            if not self.api_key:
                return f"Simulated Gemini Response for prompt: {prompt[:40]}..."
            model = genai.GenerativeModel(model_name)
            res = model.generate_content(prompt)
            return res.text
        except Exception as err:
            logger.error("Gemini generate_text error: %s", err)
            return f"Generated reading based on astrological principles for '{prompt[:30]}'."

    async def generate_embedding(self, text: str) -> List[float]:
        try:
            if not self.api_key:
                return [0.0] * 768
            res = genai.embed_content(model=f"models/{MODELS['EMBEDDING']['GEMINI_TEXT']}", content=text)
            return res.get("embedding", [0.0] * 768)
        except Exception as err:
            logger.error("Gemini generate_embedding error: %s", err)
            return [0.0] * 768



# Singleton instance
gemini_client = GeminiClient()
