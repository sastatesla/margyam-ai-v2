"""
error_handler.py — Global exception handlers for FastAPI.
"""
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "status": 500,
                "message": str(exc),
                "code": "INTERNAL_SERVER_ERROR",
            },
        )
