import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";
import { User } from "../models/index.js";

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
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

    // Attach user info to request (without password hash)
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

/**
 * Admin authorization middleware
 * Must be used after authMiddleware
 * Checks if user has admin role
 */
export async function adminMiddleware(req, res, next) {
  // User should already be attached by authMiddleware
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check role directly from req.user (no need to re-fetch from DB)
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}

