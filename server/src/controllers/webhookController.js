import { handleWebhookEvent } from "../services/callService.js";

/**
 * Receives and processes webhook events from Retell AI.
 */
export async function handleRetellWebhook(req, res) {
  const event = req.body;
  await handleWebhookEvent(event);
  res.status(200).json({ ok: true });
}

