import os
import ollama

# ngrok tunnels require this header to bypass the browser warning page
_ollama_host = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
_client = ollama.Client(
    host=_ollama_host,
    headers={"ngrok-skip-browser-warning": "true"}
)

SYSTEM_PROMPT = """You are an assistant for the College of Social Communication Innovation (วิทยาลัยนวัตกรรมสื่อสารสังคม).

RULES:
- Use the context below to answer. It may include CoSCI database info and/or web search results.
- Prioritize CoSCI database info for questions about the college.
- Use web search results for general knowledge questions.
- If neither source has the answer, say "ไม่พบข้อมูลในระบบหรืออินเทอร์เน็ต"
- Answer in the same language as the question (Thai or English)
- Be direct and concise. Do not mention "context" or "web search" in your answer.

Context:
{context}
"""


def _build_messages(question: str, context: str) -> list:
    return [
        {"role": "system", "content": SYSTEM_PROMPT.format(context=context)},
        {"role": "user", "content": question},
    ]


def chat_with_context(question: str, context: str, model: str = "llama3.2") -> str:
    response = _client.chat(model=model, messages=_build_messages(question, context))
    return response["message"]["content"]


def chat_stream(question: str, context: str, model: str = "llama3.2"):
    stream = _client.chat(model=model, messages=_build_messages(question, context), stream=True)
    for chunk in stream:
        yield chunk["message"]["content"]
