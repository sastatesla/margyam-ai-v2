"""
logging.py — Structlog & Standard Logging Setup for margyam-ai.
"""
import logging
import sys


def configure_logging(log_level: str = "INFO"):
    logging.basicConfig(
        level=getattr(logging, log_level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


# Configure logging on module import
configure_logging()
