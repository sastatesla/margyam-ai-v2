import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager

from src.configs.settings import settings
from src.routers import routers
from src.middlewares.error_handler import register_exception_handlers
from src.system.grpc.server import start_grpc_server, stop_grpc_server


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle manager."""
    # Service startup
    print(f"margyam-ai starting [{settings.env}]")
    await start_grpc_server()
    yield
    # Service shutdown
    await stop_grpc_server()


app = FastAPI(
    title="Margyam Astrology Intelligence API",
    version="1.0.0",
    description="Service B: Swiss Ephemeris calculations, RAG pipeline, and AI inference",
    docs_url="/docs"    if settings.env != "production" else None,
    redoc_url="/redoc"  if settings.env != "production" else None,
    lifespan=lifespan,
)

# Register exception handlers
register_exception_handlers(app)

# Mount API routers
for router in routers:
    app.include_router(router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "margyam-ai"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=settings.env == "development")
