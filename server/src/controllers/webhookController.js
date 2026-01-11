import { handleWebhookEvent } from "../services/callService.js";

// HTTP handler for processing Retell AI webhook events
export async function handleRetellWebhook(req, res) {
  const event = req.body;
  await handleWebhookEvent(event);
  res.status(200).json({ ok: true });
}
