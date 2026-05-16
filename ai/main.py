from fastmcp import FastMCP
from chroma import load_documents, search_docs

# สร้าง MCP Server
mcp = FastMCP("AI Assistant Server")

# load documents ตอน server เริ่มต้น
load_documents("CosciData.txt")

@mcp.tool()
def search_documents(query: str, n_results: int = 2) -> str:
    """ค้นหา documents ที่เกี่ยวข้องกับ query จาก ChromaDB

    Args:
        query: คำค้นหา
        n_results: จำนวนผลลัพธ์ที่ต้องการ (default: 2)
    """
    results = search_docs(query, n_results=n_results)
    return results


if __name__ == "__main__":
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8080, path="/mcp")