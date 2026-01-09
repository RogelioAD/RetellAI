import { Router } from "express";
import { getUsers, createUser, deleteUserById, linkCalls, refreshAgents } from "../controllers/adminController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { validateCreateCustomer, validateUserIdParam } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

/**
 * GET /admin/users - Get all users (admin only).
 */
router.get("/users", authMiddleware, adminMiddleware, asyncHandler(getUsers));

/**
 * POST /admin/create-customer - Creates a new customer user and returns credentials.
 */
router.post("/create-customer", authMiddleware, adminMiddleware, validateCreateCustomer, asyncHandler(createUser));

/**
 * DELETE /admin/users/:userId - Delete a user and all associated data (admin only).
 */
router.delete("/users/:userId", authMiddleware, adminMiddleware, validateUserIdParam, asyncHandler(deleteUserById));

/**
 * POST /admin/link-calls-by-agent - Links existing calls to users based on agent_name matching username.
 */
router.post("/link-calls-by-agent", authMiddleware, adminMiddleware, asyncHandler(linkCalls));

/**
 * POST /admin/refresh-agent-names - Re-fetches all calls from RetellAI and updates agent names.
 */
router.post("/refresh-agent-names", authMiddleware, adminMiddleware, asyncHandler(refreshAgents));

export default router;
