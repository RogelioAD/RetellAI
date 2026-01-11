import { Router } from "express";
import { getMyCalls, listAllCalls } from "../controllers/callController.js";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/my-calls", authMiddleware, asyncHandler(getMyCalls));

router.post("/list-calls", authMiddleware, asyncHandler(listAllCalls));

export default router;
