import weaviate
from weaviate.auth import AuthApiKey
from src.configs.settings import settings

_client = None


def get_weaviate() -> weaviate.WeaviateClient:
    global _client
    if _client is None:
        _client = weaviate.connect_to_custom(
            http_host=settings.weaviate_url.replace("http://", "").split(":")[0],
            http_port=int(settings.weaviate_url.split(":")[-1]) if ":" in settings.weaviate_url else 8080,
            http_secure=settings.weaviate_url.startswith("https"),
            grpc_host=settings.weaviate_url.replace("http://", "").split(":")[0],
            grpc_port=50051,
            grpc_secure=False,
            auth_credentials=AuthApiKey(settings.weaviate_api_key) if settings.weaviate_api_key else None,
        )
    return _client
