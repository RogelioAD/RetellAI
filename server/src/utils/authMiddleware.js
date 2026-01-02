import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";
import { User } from "../models/index.js";

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    console.warn("Auth middleware: Missing or invalid Authorization header");
    return res.status(401).json({ error: "Missing token" });
  }
  const token = auth.split(" ")[1];
  if (!jwtSecret) {
    console.error("Auth middleware: JWT_SECRET is not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.userId);
    if (!user) {
      console.warn(`Auth middleware: User not found for userId: ${payload.userId}`);
      return res.status(401).json({ error: "Invalid token - user not found" });
    }
    req.user = { id: user.id, username: user.username, role: user.role };
    next();
  } catch (err) {
    console.error("Auth middleware error:", {
      message: err.message,
      name: err.name,
      path: req.path
    });
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default authMiddleware;
