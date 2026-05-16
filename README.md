# COSCI Chatbot

AI Chatbot ที่รันบน Raspberry Pi โดยใช้ RAG (Retrieval-Augmented Generation) ผสาน Web Search และ MCP Server สำหรับ Claude Desktop

## Architecture

```
Internet → Ngrok Tunnel → Nginx (port 80) → Docker Bridge Network (app-net)
                                                 ├── frontend    :3000  (Next.js)
                                                 ├── backend     :3001  (Express)
                                                 ├── ai-api      :8000  (FastAPI + RAG)
                                                 ├── ai-mcp      :8080  (FastMCP)
                                                 ├── redis       :6379  (Cache / Rate Limit)
                                                 └── monitor     :9000  (Dashboard)
```

## Services

| Service | Stack | Port | บทบาท |
|---------|-------|------|--------|
| nginx | Nginx Alpine | 80 | Reverse Proxy / API Gateway |
| frontend | Next.js | 3000 | Web UI + Google OAuth |
| backend | Express / TypeScript | 3001 | REST API + WebSocket |
| ai-api | FastAPI + ChromaDB | 8000 | RAG + Web Search |
| ai-mcp | FastMCP | 8080 | MCP Server สำหรับ Claude Desktop |
| redis | Redis 7 | 6379 | Rate Limiting + Message Cache |
| monitor | Nginx (static) | 9000 | Network Monitor Dashboard |

## Network Concepts

- **Reverse Tunnel** — Ngrok expose Raspberry Pi สู่ internet โดยไม่ต้อง port forward
- **Reverse Proxy** — Nginx รับ traffic ทั้งหมดแล้วกระจายตาม path
- **WebSocket (WSS)** — streaming AI response แบบ real-time
- **Rate Limiting** — นับ request ต่อ IP ด้วย Redis INCR/EXPIRE
- **Docker Bridge Network** — container คุยกันผ่านชื่อ service แทน IP

## Requirements

- Raspberry Pi 4 (แนะนำ 4GB+)
- Docker + Docker Compose
- Ollama (รันบน host หรือเครื่องอื่นที่ expose ผ่าน Ngrok)
- Ngrok account

## Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_jwt_secret

# AI
OLLAMA_HOST=https://your-ollama-ngrok-url
TAVILY_API_KEY=tvly-xxxx

# NextAuth
NEXTAUTH_URL=https://your-ngrok-url
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend
NEXT_PUBLIC_API_URL=https://your-ngrok-url
```

## Run

```bash
# Clone
git clone https://github.com/your-repo/cosci-chatbot
cd cosci-chatbot

# Build และ start ทุก service
sudo docker compose --env-file .env up -d --build

# ดู logs
sudo docker compose logs -f

# ดู status
sudo docker ps
```

## Monitor Dashboard

เข้าถึงได้ที่ `http://<Pi-IP>:9000` ในวง LAN เดียวกัน

แสดง service health, latency, และ live traffic ของทุก request ที่เข้าระบบ

## MCP Server

เชื่อมต่อ Claude Desktop โดยเพิ่มใน `claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cosci": {
      "url": "http://<Pi-IP>:8080/mcp"
    }
  }
}
```
