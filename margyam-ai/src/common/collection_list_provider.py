class CollectionListProvider:
    @staticmethod
    def parse_query_params(params: dict) -> dict:
        page = int(params.get("page", 1)) if str(params.get("page", 1)).isdigit() else 1
        limit = int(params.get("limit", 20)) if str(params.get("limit", 20)).isdigit() else 20
        return {
            "page": max(1, page),
            "limit": min(100, max(1, limit)),
            "query": params.get("q", ""),
        }
