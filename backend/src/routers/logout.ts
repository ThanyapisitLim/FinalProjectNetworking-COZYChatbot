import express from "express";
import type { Request, Response } from "express";
import { deleteRefreshToken } from "../controllers/token";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        await deleteRefreshToken(refreshToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.json({ message: "Logout success" });

    } catch (error: any) {
        if (error?.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Refresh token expired" });
        }
        console.error("Logout error:", error);
        return res.status(500).json({ error: "Logout failed" });
    }
});

export default router;
