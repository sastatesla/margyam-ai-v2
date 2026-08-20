"""
intent_service.py — Categorizes user queries into domain buckets (CAREER, WEALTH, RELATIONSHIP, HEALTH, DAILY, GENERAL).
"""
class IntentService:
    async def classify(self, query: str) -> str:
        query_lower = query.lower()
        if any(w in query_lower for w in ["job", "career", "business", "promotion", "work"]):
            return "CAREER"
        if any(w in query_lower for w in ["money", "wealth", "financial", "income", "loan"]):
            return "WEALTH"
        if any(w in query_lower for w in ["marriage", "love", "relationship", "spouse", "partner"]):
            return "RELATIONSHIP"
        if any(w in query_lower for w in ["health", "disease", "recovery", "wellness"]):
            return "HEALTH"
        return "GENERAL"
