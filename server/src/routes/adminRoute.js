import { Router } from "express";
import { getUsers, createUser, deleteUserById, linkCalls, refreshAgents } from "../controllers/adminController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { validateCreateCustomer, validateUserIdParam } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/users", authMiddleware, adminMiddleware, asyncHandler(getUsers));

router.post("/create-customer", authMiddleware, adminMiddleware, validateCreateCustomer, asyncHandler(createUser));

router.delete("/users/:userId", authMiddleware, adminMiddleware, validateUserIdParam, asyncHandler(deleteUserById));

router.post("/link-calls-by-agent", authMiddleware, adminMiddleware, asyncHandler(linkCalls));

router.post("/refresh-agent-names", authMiddleware, adminMiddleware, asyncHandler(refreshAgents));

export default router;
