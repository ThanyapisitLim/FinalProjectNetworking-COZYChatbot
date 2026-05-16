import os
import time

# lazy init — avoids crash at import time when TAVILY_API_KEY is not set
_client = None


def _get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("TAVILY_API_KEY", "")
        if not api_key:
            print("TAVILY_API_KEY not set — web search disabled")
            return None
        from tavily import TavilyClient
        _client = TavilyClient(api_key=api_key)
    return _client


def web_search(query: str, max_results: int = 3) -> str:
    client = _get_client()
    if client is None:
        return ""

    # Tavily performs better with shorter queries
    short_query = query[:150] if len(query) > 150 else query

    start = time.time()
    try:
        response = client.search(
            query=short_query,
            search_depth="basic",
            max_results=max_results,
            include_answer=False,
        )

        results = response.get("results", [])
        if not results:
            return ""

        output = []
        for i, r in enumerate(results):
            output.append(
                f"[Web Result {i+1}] {r.get('title', '')}\n"
                f"{r.get('content', '')}\n"
                f"Source: {r.get('url', '')}\n"
            )

        return "\n".join(output)

    except Exception as e:
        elapsed = time.time() - start
        print(f"Web search error ({elapsed:.2f}s): {e}")
        return ""
