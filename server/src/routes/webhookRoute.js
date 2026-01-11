import { Router } from "express";
import { handleRetellWebhook } from "../controllers/webhookController.js";
import { validateWebhookPayload } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.post("/retell", validateWebhookPayload, asyncHandler(handleRetellWebhook));

export default router;
