import asyncio
import grpc
import grpc.aio
from src.configs.settings import settings
from src.system.grpc.handlers.astro_handler import AstroServiceHandler
from src.system.grpc.handlers.rag_handler import RagServiceHandler

# NOTE: proto files are located in margyam-common/src/proto/
# During Docker build, proto files are compiled into pb2 files.
# For local dev, run: python -m grpc_tools.protoc -I../../margyam-common/src/proto ...
try:
    from src.system.grpc.generated import astro_pb2_grpc
except ImportError:
    astro_pb2_grpc = None

_grpc_server = None


async def start_grpc_server():
    global _grpc_server
    _grpc_server = grpc.aio.server()

    if astro_pb2_grpc:
        astro_pb2_grpc.add_AstroServiceServicer_to_server(AstroServiceHandler(), _grpc_server)

    _grpc_server.add_insecure_port(f"0.0.0.0:{settings.grpc_port}")
    await _grpc_server.start()
    print(f"🔌 gRPC server listening on port {settings.grpc_port}")


async def stop_grpc_server():
    if _grpc_server:
        await _grpc_server.stop(grace=5)
        print("🔌 gRPC server stopped")
