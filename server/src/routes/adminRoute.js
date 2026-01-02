import { Router } from "express";
import { hash } from "bcrypt";
import { User } from "../models/index.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = Router();

// Middleware to check if user is admin
async function adminMiddleware(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// GET /admin/users
// Get all users (admin only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["passwordHash"] },
      order: [["createdAt", "DESC"]],
    });
    console.log(`✅ Admin ${req.user.id} fetched ${users.length} users:`, users.map(u => u.username));
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /admin/link-calls-by-agent
// Manually link existing calls to users based on agent_name matching username
// Note: This endpoint is kept for manual linking but auto-linking happens automatically
router.post("/link-calls-by-agent", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { CallRecord } = await import("../models/index.js");
    const retellClientModule = await import("../utils/retellClient.js");
    const retellClient = retellClientModule.default;
    const { getCall } = retellClient;
    
    // Get all call records without a userId
    const unlinkedCalls = await CallRecord.findAll({
      where: { userId: null },
    });

    let linkedCount = 0;
    let errorCount = 0;
    const linkDetails = [];

    for (const callRecord of unlinkedCalls) {
      try {
        // Fetch call data from Retell to get agent_name
        const callData = await getCall(callRecord.retellCallId);
        
        // Try multiple ways to get agent_name
        const agentName = 
          callData.agent_name || 
          callData.agent?.name || 
          callData.agent_id ||
          callData.agent_name_id ||
          (callData.agent && typeof callData.agent === 'string' ? callData.agent : null);
        
        if (agentName) {
          const exactUser = await User.findOne({
            where: { username: agentName },
          });
          
          if (exactUser) {
            callRecord.userId = exactUser.id;
            await callRecord.save();
            linkedCount++;
            linkDetails.push({
              callId: callRecord.retellCallId,
              agentName: agentName,
              username: exactUser.username
            });
            console.log(`Linked call ${callRecord.retellCallId} (agent: ${agentName}) to user ${exactUser.username}`);
          } else {
            linkDetails.push({
              callId: callRecord.retellCallId,
              agentName: agentName,
              username: null,
              note: "No matching user found"
            });
          }
        } else {
          linkDetails.push({
            callId: callRecord.retellCallId,
            agentName: null,
            note: "No agent_name found in call data"
          });
        }
      } catch (err) {
        console.error(`Error linking call ${callRecord.retellCallId}:`, err.message);
        errorCount++;
        linkDetails.push({
          callId: callRecord.retellCallId,
          error: err.message
        });
      }
    }

    res.json({
      message: `Linked ${linkedCount} calls to users. ${errorCount} errors out of ${unlinkedCalls.length} total.`,
      linked: linkedCount,
      errors: errorCount,
      total: unlinkedCalls.length,
      details: linkDetails.slice(0, 20) // Return first 20 for debugging
    });
  } catch (err) {
    console.error("Error linking calls:", err);
    // Don't leak error details
    res.status(500).json({ error: "Server error" });
  }
});

// POST /admin/refresh-agent-names
// Re-fetches all calls from RetellAI and updates agent names
// Useful when agent names are changed in RetellAI
router.post("/refresh-agent-names", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { CallRecord } = await import("../models/index.js");
    const retellClientModule = await import("../utils/retellClient.js");
    const retellClient = retellClientModule.default;
    const { listAllCallsPost } = retellClient;
    
    console.log("🔄 Refreshing agent names from RetellAI...");
    
    // Fetch all calls from RetellAI
    const retellCalls = await listAllCallsPost({});
    
    // Extract calls array from response
    let callsArray = [];
    if (Array.isArray(retellCalls)) {
      callsArray = retellCalls;
    } else if (retellCalls.calls && Array.isArray(retellCalls.calls)) {
      callsArray = retellCalls.calls;
    } else if (retellCalls.data && Array.isArray(retellCalls.data)) {
      callsArray = retellCalls.data;
    }
    
    console.log(`📞 Found ${callsArray.length} calls in RetellAI`);
    
    let updatedCount = 0;
    let linkedCount = 0;
    const details = [];
    
    // Get all CallRecords
    const allCallRecords = await CallRecord.findAll();
    const callRecordMap = new Map();
    allCallRecords.forEach(rec => {
      callRecordMap.set(rec.retellCallId, rec);
    });
    
    // Process each call from RetellAI
    for (const call of callsArray) {
      const callId = call.call_id || call.id || call.callId;
      if (!callId) continue;
      
      const callRecord = callRecordMap.get(callId);
      if (!callRecord) continue;
      
      // Extract agent name from fresh RetellAI data
      const agentName = 
        call.agent_name || 
        call.agent?.name || 
        call.agent_id ||
        call.agent_name_id ||
        (call.agent && typeof call.agent === 'string' ? call.agent : null);
      
      if (agentName) {
        // Try to find user with matching username
        const user = await User.findOne({
          where: { username: agentName },
        });
        
        if (user) {
          // Update the call record's userId if it changed
          if (callRecord.userId !== user.id) {
            callRecord.userId = user.id;
            await callRecord.save();
            linkedCount++;
            details.push({
              callId: callId,
              oldUserId: callRecord.userId,
              newUserId: user.id,
              agentName: agentName,
              username: user.username
            });
          }
          updatedCount++;
        } else {
          details.push({
            callId: callId,
            agentName: agentName,
            note: "No user found with matching username"
          });
        }
      }
    }
    
    res.json({
      message: `Refreshed ${updatedCount} calls. Re-linked ${linkedCount} calls to users.`,
      updated: updatedCount,
      reLinked: linkedCount,
      total: callsArray.length,
      details: details.slice(0, 50) // Return first 50 for debugging
    });
  } catch (err) {
    console.error("Error refreshing agent names:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /admin/create-customer
// Creates a new customer user
// Returns the password in the response (only available at creation time)
router.post("/create-customer", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: "username & password required" });
    }
    
    // Sanitize and validate username
    const sanitizedUsername = String(username).trim();
    if (sanitizedUsername.length < 3 || sanitizedUsername.length > 50) {
      return res.status(400).json({ error: "Username must be between 3 and 50 characters" });
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedUsername)) {
      return res.status(400).json({ error: "Username can only contain letters, numbers, underscores, and hyphens" });
    }
    
    // Validate password
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ error: "Password must be between 6 and 128 characters" });
    }
    
    // Check if username already exists
    const existing = await User.findOne({ where: { username: sanitizedUsername } });
    if (existing) {
      return res.status(400).json({ error: "username already taken" });
    }
    
    // Validate email format if provided
    let sanitizedEmail = null;
    if (email && email.trim() !== "") {
      sanitizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      if (sanitizedEmail.length > 255) {
        return res.status(400).json({ error: "Email is too long" });
      }
    }
    
    const passwordHash = await hash(password, 10);
    
    // Only include email if it's provided and valid
    const userData = {
      username: sanitizedUsername,
      passwordHash,
      role: "user"
    };
    
    if (sanitizedEmail) {
      userData.email = sanitizedEmail;
    }
    
    const user = await User.create(userData);
    res.json({
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      password: password,
      message: "User created successfully. Save these credentials - the password cannot be retrieved later."
    });
  } catch (err) {
    console.error("Error creating user:", err);
    // Don't leak error details
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /admin/users/:userId
// Delete a user and all associated data (admin only)
router.delete("/users/:userId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { CallRecord } = await import("../models/index.js");
    const { userId } = req.params;
    
    // Validate userId format
    if (!userId || userId.trim() === "") {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Prevent deleting admin users
    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin users" });
    }
    
    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(403).json({ error: "Cannot delete your own account" });
    }
    
    // Delete all CallRecords associated with this user
    const deletedCallRecords = await CallRecord.destroy({
      where: { userId: user.id }
    });
    
    // Delete the user
    await user.destroy();
    
    console.log(`✅ Admin ${req.user.id} deleted user ${user.username} (${user.id}) and ${deletedCallRecords} call records`);
    
    res.json({
      message: "User and all associated data deleted successfully",
      deletedUser: {
        id: user.id,
        username: user.username
      },
      deletedCallRecords
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
