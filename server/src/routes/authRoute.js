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

router.post("/login", loginLimiter, validateLogin, asyncHandler(login));

router.put("/change-password", authMiddleware, passwordChangeLimiter, validateChangePassword, asyncHandler(changeUserPassword));

export default router;
