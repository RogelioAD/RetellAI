import { Router } from "express";
import { getMyCalls, listAllCalls } from "../controllers/callController.js";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

/**
 * GET /api/my-calls - Get all calls for the authenticated user.
 */
router.get("/my-calls", authMiddleware, asyncHandler(getMyCalls));

/**
 * POST /api/list-calls - Proxies to Retell AI's list-calls endpoint with pagination support.
 */
router.post("/list-calls", authMiddleware, asyncHandler(listAllCalls));

export default router;
