import json
import logging
from src.graph.state import AgentState
from src.prompts.system_prompts import get_astrologer_system_prompt, get_general_chat_prompt
from src.utils.gemini import gemini_client
from src.utils.constants import MODELS
from src.utils.progress_translator import translate_progress_message

logger = logging.getLogger(__name__)


class SynthesizeNode:
    """
    SynthesizeNode routes queries dynamically using the MODELS selection matrix
    and synthesizes structured responses using master system prompts and Google Gemini models.
    """
    async def __call__(self, state: AgentState) -> AgentState:
        query = state.get("query", "")
        intent = state.get("intent", "GENERAL_CHAT")
        docs = state.get("retrieved_docs", [])
        astro = state.get("astrological_context", {})
        lang = state.get("language", "en")

        model_used = MODELS["USE_CASES"].get(intent, MODELS["USE_CASES"]["GENERAL_CHAT"])
        state["model_used"] = model_used
        state["progress_message"] = translate_progress_message("Synthesizing cosmic insights...", lang)



        if intent == "GENERAL_CHAT":
            prompt = get_general_chat_prompt(user_name="Seeker")
        else:
            context_str = "\n".join([f"- {d.get('title')}: {d.get('content')}" for d in docs])
            if astro.get("transits"):
                transits_summary = ", ".join([f"{t['name']} in {t['sign']}" for t in astro["transits"]])
                context_str += f"\n- Active Planetary Transits: {transits_summary}"

            prompt = get_astrologer_system_prompt(
                context=context_str,
                intent=intent,
                has_history=False,
                user_name="Seeker"
            )

        raw_llm_response = await gemini_client.generate_text(prompt, model_name=model_used)

        # Attempt JSON parsing of structured LLM response
        try:
            parsed = json.loads(raw_llm_response)
            state["response"] = parsed.get("answer", raw_llm_response)
            state["confidence_score"] = parsed.get("confidence", 95)
            state["citations"] = parsed.get("citations", [d.get("title") for d in docs])
            state["follow_up_questions"] = parsed.get("followUpQuestions", [
                "How will the upcoming transits affect my chart?",
                "What classical remedies can I perform?"
            ])
        except Exception:
            # Clean fallback formatting if Gemini output is raw Markdown prose
            state["response"] = raw_llm_response
            state["confidence_score"] = 90
            state["citations"] = [d.get("title") for d in docs] if docs else ["Classical Vedic Astrology Principles"]
            state["follow_up_questions"] = [
                "What specific planetary dasha am I running?",
                "Can you suggest favorable timing (muhurta)?"
            ]

        logger.info("Synthesized AI response using model %s for intent %s", model_used, intent)
        return state

