import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import { WebSocketServer } from 'ws';
import type { Application } from 'express';
import { connectRedis } from './config/redis';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { rateLimitMiddleware } from './middleware/rateLimit';
import healthRouter from './health';
import createUserRouter from './routers/create-user';
import loginRouter from './routers/login';
import refreshTokenRouter from './routers/refresh-token';
import checkGmailRouter from './routers/check-gmail';
import getUserRouter from './routers/get-user';
import logoutRouter from './routers/logout';
import messageRouter from './routers/message';
import jwt from 'jsonwebtoken';
import { createMessage, createGroup } from './controllers/message';
import redisClient from './config/redis';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

interface TrafficEntry {
  id: number;
  type: 'http' | 'ws';
  method: string;
  path: string;
  status: number | null;
  ip: string;
  ms: number;
  time: string;
}

const trafficLog: TrafficEntry[] = [];
let trafficId = 0;
const MAX_TRAFFIC = 100;

function addTraffic(entry: Omit<TrafficEntry, 'id'>) {
  trafficLog.unshift({ id: ++trafficId, ...entry });
  if (trafficLog.length > MAX_TRAFFIC) trafficLog.pop();
}

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use((req, res, next) => {
  const start = Date.now();
  const ip = (req.headers['x-real-ip'] as string)
    || (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
    || req.socket.remoteAddress
    || 'unknown';
  res.on('finish', () => {
    if (req.path === '/traffic') return; // skip self to avoid log loop
    addTraffic({
      type: 'http',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ip,
      ms: Date.now() - start,
      time: new Date().toISOString(),
    });
  });
  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(rateLimitMiddleware);
app.use('/health', healthRouter);

app.get('/traffic', (_req, res) => {
  res.json(trafficLog.slice(0, 50));
});

app.use('/create-user', createUserRouter);
app.use('/login', loginRouter);
app.use('/refresh-token', refreshTokenRouter);
app.use('/check-gmail', checkGmailRouter);
app.use('/logout', logoutRouter);
app.use('/get-user', getUserRouter);
app.use('/message', messageRouter);

connectRedis().then(() => {
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server, path: '/ws/chat' });

    wss.on('connection', (ws, req) => {
        const wsIp = (req.headers['x-real-ip'] as string)
          || (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
          || req.socket.remoteAddress || 'unknown';
        const wsStart = Date.now();
        addTraffic({ type: 'ws', method: 'WS', path: '/ws/chat', status: 101, ip: wsIp, ms: 0, time: new Date().toISOString() });

        ws.on('close', () => {
          addTraffic({ type: 'ws', method: 'WS', path: '/ws/chat [closed]', status: null, ip: wsIp, ms: Date.now() - wsStart, time: new Date().toISOString() });
        });

        ws.on('message', async (data) => {
            try {
                const { question, token, groupId } = JSON.parse(data.toString());

                const ip = (req.headers['x-real-ip'] as string)
                    || (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
                    || req.socket.remoteAddress
                    || 'unknown';
                const rlKey = `rate:${ip}`;
                const rlCount = await redisClient.incr(rlKey);
                if (rlCount === 1) await redisClient.expire(rlKey, 60);
                if (rlCount > 20) {
                    const ttl = await redisClient.ttl(rlKey);
                    ws.send(JSON.stringify({ status: 'rate_limit', retryAfter: ttl }));
                    return;
                }

                if (!token) {
                    ws.send(JSON.stringify({ error: 'Unauthorized' }));
                    return;
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
                const userId = decoded.userId;

                let finalGroupId = groupId ? parseInt(groupId) : null;
                if (!finalGroupId) {
                    const groupName = question.length > 40 ? question.slice(0, 40) + '...' : question;
                    const newGroup = await createGroup(groupName);
                    finalGroupId = newGroup.group_id as number;
                }

                const userMessage = await createMessage(userId, 'user', question, finalGroupId);
                ws.send(JSON.stringify({ status: 'thinking', groupId: finalGroupId, userMessage }));

                const AI_API_URL = process.env.AI_API_URL || 'http://ai-api:8000';
                const aiResponse = await fetch(`${AI_API_URL}/ask/stream`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question })
                });

                let fullAnswer = '';
                const reader = aiResponse.body!.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    fullAnswer += chunk;
                    ws.send(JSON.stringify({ status: 'chunk', text: chunk }));
                }

                const assistantMessage = await createMessage(userId, 'assistant', fullAnswer, finalGroupId);
                await redisClient.del(`messages:${userId}`);

                ws.send(JSON.stringify({
                    status: 'done',
                    question,
                    answer: fullAnswer,
                    groupId: finalGroupId,
                    userMessage,
                    assistantMessage
                }));

            } catch (error) {
                console.error('WebSocket error:', error);
                ws.send(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    });

    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`WebSocket at ws://localhost:${PORT}/ws/chat`);
        console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
});
