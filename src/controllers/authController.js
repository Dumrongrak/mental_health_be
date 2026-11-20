import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(userId, rememberMe = true) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = rememberMe ? process.env.JWT_EXPIRES_IN || "7d" : "1d";
    return jwt.sign({ sub: userId }, secret, { expiresIn });
}

function sanitizeUser(userDoc) {
    return {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        tel: userDoc.tel,
        gender: userDoc.gender,
        dob: userDoc.dob,
        imageUrl: userDoc.imageUrl,
        currentEmotionId: userDoc.currentEmotionId,
        createdAt: userDoc.createdAt
    };
}

export async function register(req, res) {
    try {
        const { name, email, password, tel, gender, dob, imageUrl } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required." });
        }

        if (String(password).length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters." });
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail }).lean();

        if (existingUser) {
            return res
                .status(409)
                .json({ message: "An account with this email already exists." });
        }

        const passwordHash = await bcrypt.hash(String(password), 12);

        const createdUser = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            passwordHash,
            tel: tel ? String(tel).trim() : "",
            gender: gender ? String(gender).trim() : "",
            dob: dob ? new Date(dob) : null,
            imageUrl: imageUrl ? String(imageUrl).trim() : ""
        });

        const token = signToken(createdUser._id.toString(), true);

        return res.status(201).json({
            message: "Registration successful.",
            token,
            user: sanitizeUser(createdUser)
        });
    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ message: "An account with this email already exists." });
        }
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function login(req, res) {
    try {
        const { email, password, rememberMe = true } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select(
            "+passwordHash"
        );

        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password." });
        }

        const isMatch = await bcrypt.compare(String(password), user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password." });
        }

        const token = signToken(user._id.toString(), Boolean(rememberMe));

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: sanitizeUser(user)
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error("GetMe error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}