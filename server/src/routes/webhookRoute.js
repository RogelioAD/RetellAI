import { Router } from "express";
import { handleWebhookEvent } from "../services/callService.js";
import { validateWebhookPayload } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

/**
 * POST /webhooks/retell
 * Receives webhook events from Retell AI
 * Expected payload: { id: <callId>, metadata: { userId, username, ... } }
 * Note: Webhook signature verification should be added if Retell provides webhook secrets
 */
router.post("/retell", validateWebhookPayload, asyncHandler(async (req, res) => {
  const event = req.body;
  await handleWebhookEvent(event);
  res.status(200).json({ ok: true });
}));

export default router;
