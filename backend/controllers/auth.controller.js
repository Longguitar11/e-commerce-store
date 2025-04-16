import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateTokens, setCookies, storeRefreshToken } from "../utils/handleToken.js";
import { ACCESS_TOKEN_SECRET, NODE_ENV, REFRESH_TOKEN_SECRET } from "../config/env.js";
import { redis } from "../config/redis.js";
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ error: "User already exists" })
        const user = await User.create({ name, email, password });

        const { accessToken, refreshToken } = generateTokens(user._id);
        storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({ message: "User created successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.log("Fail to signup:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ error: "Invalid credentials" })

        console.log(await user.comparePassword(password))
        if (await user.comparePassword(password)) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);
            res.json({ message: "Login successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        }
        else return res.status(400).json({ error: "Invalid credentials" })
    } catch (error) {
        console.log("Fail to login:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ error: "No refresh token provided" });
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${decoded.userId}`);

        res.clearCookie("refreshToken")
        res.clearCookie("accessToken")
        res.json({ message: "Logout successfully" })
    } catch (error) {
        console.log("Fail to logout:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) return res.status(401).json({ error: "No refresh token provided" });

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;

        const storedRefreshToken = await redis.get(`refresh_token:${userId}`);
        if (storedRefreshToken !== refreshToken) return res.status(403).json({ error: "Invalid refresh token" });

        const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.json({ message: "Refresh access token successfully" });
    } catch (error) {
        console.log("Fail to refresh token:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json({ user: req.user })
    } catch (error) {
        console.log("Fail to get profile:", error.message);
        res.status(500).json({ error: error.message })
    }
}

