"""
rag_handler.py — gRPC handler for RAG queries.
"""
from src.services.rag_service import RAGService
from src.schemas.rag import RAGQueryRequest

try:
    from src.system.grpc.generated import astro_pb2, astro_pb2_grpc
    BaseServicer = astro_pb2_grpc.AstroServiceServicer
except ImportError:
    astro_pb2 = None
    BaseServicer = object

rag_service = RAGService()


class RagServiceHandler(BaseServicer):
    async def RunRagQuery(self, request, context):
        try:
            req = RAGQueryRequest(
                query=getattr(request, "query", ""),
                user_id=getattr(request, "user_id", "guest"),
                session_id=getattr(request, "session_id", ""),
                language=getattr(request, "language", "en"),
            )
            result = await rag_service.process_query(req)
            answer = getattr(result, "response", "") or ""

            if astro_pb2:
                return astro_pb2.RagResponse(
                    success=True,
                    answer=answer,
                    session_id=getattr(request, "session_id", ""),
                )
            return {"success": True, "answer": answer, "session_id": getattr(request, "session_id", "")}
        except Exception as e:
            if astro_pb2:
                return astro_pb2.RagResponse(success=False, error=str(e))
            return {"success": False, "error": str(e)}

