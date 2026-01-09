import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, changeUserPassword } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateLogin, validateChangePassword } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many password change attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /auth/login - Authenticate user and return JWT token.
 */
router.post("/login", loginLimiter, validateLogin, asyncHandler(login));

/**
 * PUT /auth/change-password - Allows authenticated users to change their own password.
 */
router.put("/change-password", authMiddleware, passwordChangeLimiter, validateChangePassword, asyncHandler(changeUserPassword));

export default router;
