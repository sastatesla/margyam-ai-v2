from fastapi import HTTPException
from src.services.rag_service import RAGService
from src.schemas.rag import RAGQueryRequest


class RagController:
    def __init__(self):
        self.rag_service = RAGService()

    async def query(self, payload: RAGQueryRequest):
        try:
            result = await self.rag_service.process_query(payload)
            return {"success": True, "data": result}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

