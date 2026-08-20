"""
chunker.py — Classical Text Document Chunker.
Splits classical Sanskrit texts (BPHS, Saravali, Phaladeepika) into clean overlapping chunks.
"""
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


class TextChunker:
    """
    TextChunker breaks text documents into overlapping chunks with metadata tags.
    """
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[Dict[str, Any]]:
        if not text:
            return []

        chunks = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = min(start + chunk_size, text_len)
            chunk_content = text[start:end].strip()

            if chunk_content:
                chunks.append({
                    "content": chunk_content,
                    "length": len(chunk_content),
                    "start_char": start,
                    "end_char": end,
                })

            start += chunk_size - overlap

        logger.info("Chunked text into %d chunks", len(chunks))
        return chunks


# Singleton instance
chunker = TextChunker()
