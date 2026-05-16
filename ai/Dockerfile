# ─── AI API Service (FastAPI) — port 8000 ───────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# System deps needed for chromadb / onnxruntime / sentence-transformers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and data file
COPY api.py chroma.py ollama_service.py web_search.py main.py CosciData.txt ./

EXPOSE 8000

# Start the FastAPI server (api.py)
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
