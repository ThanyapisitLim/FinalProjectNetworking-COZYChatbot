import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { generateAccessToken, decodedToken, generateRefreshToken, updateToken, checkToken } from '../controllers/token';

const router = express.Router();

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token' });
        }

        const decoded = decodedToken(refreshToken) as { userId: string };
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const token = await checkToken(refreshToken);
        if (token.length === 0) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId, newAccessToken);
        await updateToken(refreshToken, newRefreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: 'Token refreshed successfully', accessToken: newAccessToken });

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token has expired, please login again' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        next(error);
    }
});

export default router;
