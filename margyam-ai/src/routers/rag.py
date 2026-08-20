from fastapi import APIRouter
from src.controllers.rag import RagController
from src.schemas.rag import RAGQueryRequest

router = APIRouter(prefix="/rag", tags=["RAG"])
controller = RagController()


@router.post("/query")
async def run_query(payload: RAGQueryRequest):
    return await controller.query(payload)

