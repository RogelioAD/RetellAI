import { Router } from "express";
import { User, CallRecord } from "../models/index.js";
import retellClient from "../utils/retellClient.js";

const router = Router();

function validateWebhookPayload(req, res, next) {
  const event = req.body;
  if (!event || typeof event !== 'object') {
    return res.status(400).json({ error: "Invalid webhook payload" });
  }
  next();
}

// POST /webhooks/retell
// Receives webhook events from Retell AI
// Expected payload: { id: <callId>, metadata: { userId, username, ... } }
// Note: Webhook signature verification should be added if Retell provides webhook secrets
router.post("/retell", validateWebhookPayload, async (req, res) => {
  try {
    const event = req.body;
    if (!event || !event.id) {
      return res.status(400).json({ error: "missing call id" });
    }
    
    // Validate and sanitize call ID
    const retellCallId = String(event.id).trim();
    if (!retellCallId || retellCallId.length > 255) {
      return res.status(400).json({ error: "Invalid call id" });
    }
    
    const metadata = event.metadata || {};

    let mappedUserId = null;
    if (metadata.userId) {
      const user = await User.findOne({ where: { id: metadata.userId } });
      if (user) mappedUserId = user.id;
    }

    // Create or update a CallRecord entry
    const [rec, created] = await CallRecord.findOrCreate({
      where: { retellCallId },
      defaults: { metadata, userId: mappedUserId },
    });

    // If we didn't map but metadata contains username, try map by username
    if (!rec.userId && metadata.username) {
      const user = await User.findOne({
        where: { username: metadata.username },
      });
      if (user) {
        rec.userId = user.id;
        await rec.save();
      }
    }

    // If still not mapped, try to match by agent_name in the call data
    // This requires fetching the call from Retell to get agent_name
    if (!rec.userId) {
      try {
        const { getCall } = retellClient;
        const callData = await getCall(retellCallId);
        
        // Try multiple ways to extract agent_name/agent_id
        const agentName = 
          callData.agent_name || 
          callData.agent?.name || 
          callData.agent_id ||
          callData.agent_name_id ||
          (callData.agent && typeof callData.agent === 'string' ? callData.agent : null) ||
          (callData.agent_id && typeof callData.agent_id === 'string' ? callData.agent_id : null);
        
        if (agentName) {
          const user = await User.findOne({
            where: { username: agentName },
          });
          
          if (user) {
            rec.userId = user.id;
            await rec.save();
            console.log(`✅ Auto-linked call ${retellCallId} to user ${user.username} by agent_name "${agentName}"`);
          } else {
            console.log(`⚠️  No user found matching agent_name "${agentName}" for call ${retellCallId}`);
          }
        } else {
          console.log(`⚠️  No agent_name found in call data for ${retellCallId}`);
        }
      } catch (err) {
        // If we can't fetch call data, log it but don't fail
        console.log(`⚠️  Could not fetch call ${retellCallId} to match by agent_name:`, err.message);
      }
    } else {
      console.log(`✅ Call ${retellCallId} already linked to user via metadata`);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
