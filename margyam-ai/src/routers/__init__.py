from src.routers.astro import router as astro_router
from src.routers.rag  import router as rag_router

# Central router registry — add new routers here
routers = [
    astro_router,
    rag_router,
]
