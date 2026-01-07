import { Router } from "express";
import { getAllUsers, createCustomer, deleteUser } from "../services/userService.js";
import { linkCallsByAgent, refreshAgentNames } from "../services/callService.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { validateCreateCustomer, validateUserIdParam } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

/**
 * GET /admin/users
 * Get all users (admin only)
 */
router.get("/users", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.json({ users });
}));

/**
 * POST /admin/create-customer
 * Creates a new customer user
 * Returns the password in the response (only available at creation time)
 */
router.post("/create-customer", authMiddleware, adminMiddleware, validateCreateCustomer, asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  const result = await createCustomer({ username, password, email });
  
  res.json({
    user: result.user,
    password: result.password,
    message: "User created successfully. Save these credentials - the password cannot be retrieved later.",
  });
}));

/**
 * DELETE /admin/users/:userId
 * Delete a user and all associated data (admin only)
 */
router.delete("/users/:userId", authMiddleware, adminMiddleware, validateUserIdParam, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await deleteUser(userId, req.user.id);
  
  res.json({
    message: "User and all associated data deleted successfully",
    deletedUser: result.deletedUser,
    deletedCallRecords: result.deletedCallRecords,
  });
}));

/**
 * POST /admin/link-calls-by-agent
 * Manually link existing calls to users based on agent_name matching username
 */
router.post("/link-calls-by-agent", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const result = await linkCallsByAgent();
  res.json(result);
}));

/**
 * POST /admin/refresh-agent-names
 * Re-fetches all calls from RetellAI and updates agent names
 */
router.post("/refresh-agent-names", authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const result = await refreshAgentNames();
  res.json(result);
}));

export default router;
