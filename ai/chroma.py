import chromadb
from chromadb.utils import embedding_functions

client = chromadb.Client()

thai_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

collection = client.get_or_create_collection(
    name="test_collection",
    embedding_function=thai_ef
)


def load_documents(filepath: str) -> str:
    with open(filepath, "r", encoding="utf-8") as file:
        content = file.read()

    documents = [doc.strip() for doc in content.split("\n\n") if doc.strip()]
    ids = [str(i) for i in range(len(documents))]

    # clear before reload to prevent duplicate ID errors on restart
    existing = collection.get()
    if existing["ids"]:
        collection.delete(ids=existing["ids"])

    collection.add(documents=documents, ids=ids)
    print(f"Loaded {len(documents)} paragraphs")
    return f"Loaded {len(documents)} paragraphs"


def search_docs(query: str, n_results: int = 2) -> str:
    results = collection.query(query_texts=[query], n_results=n_results)

    if not results["documents"] or not results["documents"][0]:
        return "No relevant information found"

    output = [f"[Result {i+1}]\n{doc}\n" for i, doc in enumerate(results["documents"][0])]
    return "\n".join(output)


def search_docs_with_relevance(query: str, n_results: int = 2, threshold: float = 0.7):
    """Returns (context, is_relevant).
    Distance < threshold means the DB has a close match → skip web search.
    """
    results = collection.query(
        query_texts=[query],
        n_results=n_results,
        include=["documents", "distances"]
    )

    if not results["documents"] or not results["documents"][0]:
        return "No relevant information found", False

    distances = results["distances"][0]
    best_distance = min(distances)
    is_relevant = best_distance < threshold

    output = [f"[Result {i+1}]\n{doc}\n" for i, doc in enumerate(results["documents"][0])]
    return "\n".join(output), is_relevant


if __name__ == "__main__":
    try:
        print(load_documents("cosci_data.txt"))
        print(search_docs("ค่าเทอมเอกมัลติมีเดีย", n_results=1))
        print(search_docs("ค่าเทอมสาขาภาพยนตร์เท่าไหร่ เรียนที่ไหน?", n_results=1))
        print(search_docs("รอบพอร์ตต้องใช้เกรดเท่าไหร่ และใช้อะไรบ้าง?", n_results=1))
        print(search_docs("รอบ 3 ใช้คะแนนสอบวิชาอะไรบ้าง?", n_results=1))
    except FileNotFoundError:
        print("File 'cosci_data.txt' not found")
