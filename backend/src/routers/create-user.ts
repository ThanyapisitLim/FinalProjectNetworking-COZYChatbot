import express from "express";
import type { Request, Response } from "express";
import { checkExistingGmail, createUser, getUserId } from "../controllers/user";
import { generateAccessToken, generateRefreshToken, storeToken } from "../controllers/token";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, gmail, status, interest } = req.body;

        if (!name || !gmail) {
            return res.status(400).json({ error: "Name and Gmail are required" });
        }

        const existingUser = await checkExistingGmail(gmail);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: "Gmail already exists" });
        }

        const newUser = await createUser(name, gmail, status, interest);
        const user = await getUserId(gmail);
        const userId = user[0].user_id;

        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId, accessToken);
        await storeToken(userId, refreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({ message: "create user success", data: newUser, accessToken });

    } catch (error) {
        console.error("Create user error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
