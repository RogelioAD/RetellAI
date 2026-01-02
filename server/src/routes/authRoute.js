import { Router } from "express";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { User } from "../models/index.js";
import { jwtSecret } from "../config.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = Router();

// Rate limiting for login endpoint - prevent brute force attacks
// COMMENTED OUT: Rate limiter disabled - uncomment if needed for security
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 login requests per windowMs
//   message: "Too many login attempts, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// Rate limiting for password change endpoint
const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 password change attempts per windowMs
  message: "Too many password change attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /auth/login
// Rate limiter commented out - uncomment loginLimiter above and add it here if needed
router.post("/login", /* loginLimiter, */ async (req, res) => {
  try {
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }
    
    // Sanitize and validate username
    const sanitizedUsername = String(username).trim();
    if (sanitizedUsername.length < 3 || sanitizedUsername.length > 50) {
      return res.status(400).json({ error: "Username must be between 3 and 50 characters" });
    }
    
    // Validate password length
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    
    const user = await User.findOne({ where: { username: sanitizedUsername } });
    if (!user) {
      // Use same error message to prevent username enumeration
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    const ok = await compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "30d" });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    // Don't leak error details to client
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /auth/change-password
// Allows users to change their own password
router.put("/change-password", authMiddleware, passwordChangeLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    // Validate password length
    if (newPassword.length < 6 || newPassword.length > 128) {
      return res.status(400).json({ error: "New password must be between 6 and 128 characters long" });
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: "New password must be different from current password" });
    }

    // Get the user from the database
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash and update the new password
    const newPasswordHash = await hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    // Don't leak error details
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
