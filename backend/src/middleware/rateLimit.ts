import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 20;
const SKIP_PATHS = ['/traffic', '/health'];

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    if (SKIP_PATHS.includes(req.path)) return next();

    try {
        const forwarded = req.headers["x-forwarded-for"] as string;
        const ip = req.headers["x-real-ip"] as string
            || (forwarded ? forwarded.split(",")[0].trim() : undefined)
            || req.ip
            || "unknown";
        const key = `rate:${ip}`;

        const count = await redisClient.incr(key);
        if (count === 1) await redisClient.expire(key, WINDOW_SECONDS);

        if (count > MAX_REQUESTS) {
            const ttl = await redisClient.ttl(key);
            return res.status(429).json({ error: "Too many requests", retryAfter: ttl });
        }

        res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - count));
        next();

    } catch (error) {
        // Redis down → fail open to avoid cascading outage
        console.error("Rate limit error:", error);
        next();
    }
}
