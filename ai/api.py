from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from chroma import load_documents, search_docs_with_relevance
from ollama_service import chat_with_context, chat_stream
from web_search import web_search

app = FastAPI(title="RAG AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_documents("CosciData.txt")


class QuestionRequest(BaseModel):
    question: str


def build_context(question: str) -> str:
    chroma_context, is_relevant = search_docs_with_relevance(question)

    if is_relevant:
        return chroma_context

    web_context = web_search(question)

    if web_context:
        return (
            "=== ข้อมูลจากฐานข้อมูล CoSCI ===\n"
            f"{chroma_context}\n\n"
            "=== ข้อมูลจากอินเทอร์เน็ต (Tavily) ===\n"
            f"{web_context}"
        )

    return chroma_context


@app.post("/ask")
async def ask_question(body: QuestionRequest):
    context = build_context(body.question)
    answer = chat_with_context(body.question, context)
    return {"question": body.question, "answer": answer}


@app.post("/ask/stream")
async def ask_stream(body: QuestionRequest):
    context = build_context(body.question)

    def generate():
        for chunk in chat_stream(body.question, context):
            if chunk:
                yield chunk

    return StreamingResponse(generate(), media_type="text/plain")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
