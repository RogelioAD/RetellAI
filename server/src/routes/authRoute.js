import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticateUser, changePassword } from "../services/authService.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateLogin, validateChangePassword } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

// Rate limiting for login endpoint - prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for password change endpoint
const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 password change attempts per windowMs
  message: "Too many password change attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 */
router.post("/login", loginLimiter, validateLogin, asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await authenticateUser(username, password);
  res.json(result);
}));

/**
 * PUT /auth/change-password
 * Allows authenticated users to change their own password
 */
router.put("/change-password", authMiddleware, passwordChangeLimiter, validateChangePassword, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await changePassword(req.user.id, currentPassword, newPassword);
  res.json({ message: "Password changed successfully" });
}));

export default router;
