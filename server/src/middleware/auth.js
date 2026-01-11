import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";
import { User } from "../models/index.js";

// Express middleware to verify JWT token and attach user to request object
export async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = auth.split(" ")[1];
  
  if (!jwtSecret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.userId);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token - user not found" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Express middleware to verify user has admin role (must be used after authMiddleware)
export async function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}
