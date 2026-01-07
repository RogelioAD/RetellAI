import { Router } from "express";
import { getUserCalls, listCalls } from "../services/callService.js";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

/**
 * GET /api/my-calls
 * Get all calls for the authenticated user
 */
router.get("/my-calls", authMiddleware, asyncHandler(async (req, res) => {
  const results = await getUserCalls(req.user.id);
  res.json(results);
}));

/**
 * POST /api/list-calls
 * Proxy to Retell AI's list-calls endpoint
 * Supports pagination: set fetchAll=true in body to get all calls across all pages
 * Filters out calls from deleted agents
 */
router.post("/list-calls", authMiddleware, asyncHandler(async (req, res) => {
  const filters = req.body || {};
  const { fetchAll, ...apiFilters } = filters;
  
  const result = await listCalls(apiFilters, fetchAll);
  res.json(result);
}));

export default router;
