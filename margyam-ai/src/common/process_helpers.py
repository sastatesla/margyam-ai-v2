import random
import string
import re


class ProcessHelpers:
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        return "".join(random.choices(string.digits, k=length))

    @staticmethod
    def generate_alphanumeric(length: int = 6) -> str:
        chars = string.ascii_uppercase + string.digits
        return "".join(random.choices(chars, k=length))

    @staticmethod
    def generate_slug(text: str) -> str:
        if not text:
            return ""
        text = text.lower().strip()
        text = re.sub(r"[^a-z0-9]+", "-", text)
        return re.sub(r"(^-|-$)", "", text)

    @staticmethod
    def paginate(page: int = 1, limit: int = 20) -> dict:
        safe_page = max(1, page)
        safe_limit = min(100, max(1, limit))
        return {
            "skip": (safe_page - 1) * safe_limit,
            "limit": safe_limit,
            "page": safe_page,
        }

    @staticmethod
    def paginated_result(data: list, total: int, page: int, limit: int) -> dict:
        total_pages = (total + limit - 1) // limit if limit > 0 else 0
        return {
            "data": data,
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": total_pages,
            },
        }
