import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing." });
    }

    const token = authHeader.slice(7).trim();
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub;
        return next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}