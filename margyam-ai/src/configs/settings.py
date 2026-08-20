from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    env:          str = "development"
    port:         int = 8000
    service_name: str = "margyam-ai"
    log_level:    str = "debug"

    # Redis configuration
    redis_host:     str = "127.0.0.1"
    redis_port:     int = 6379
    redis_password: str = ""

    # Vector database configuration
    weaviate_url:    str = "http://localhost:8080"
    weaviate_api_key: str = ""

    # AI provider key
    gemini_api_key: str = ""

    # gRPC server port
    grpc_port: int = 50051

    # Internal authentication
    internal_api_key: str = "change-me-in-production"

    # Tracing configuration
    langsmith_tracing: bool = False
    langchain_api_key: str = ""
    langchain_project: str = "margyam-ai"
    langchain_endpoint: str = "https://api.smith.langchain.com"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
