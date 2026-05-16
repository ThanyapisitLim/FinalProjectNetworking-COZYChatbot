import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('connect', () => console.log('Redis connecting...'));
redisClient.on('ready',   () => console.log('Redis ready'));
redisClient.on('error',   (err) => console.error('Redis error:', err));
redisClient.on('end',     () => console.log('Redis disconnected'));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
};

export default redisClient;
