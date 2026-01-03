import { Router } from "express";
import { CallRecord } from "../models/index.js";
import authMiddleware from "../utils/authMiddleware.js";
import retellClient from "../utils/retellClient.js";
const { getCall, listCallsPost, listAllCallsPost, listAgents } = retellClient;

const router = Router();

// GET /api/my-calls
router.get("/my-calls", authMiddleware, async (req, res) => {
  try {
    const { User } = await import("../models/index.js");
    
    // Get the user to access their username
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // get all retellCallIds for this user
    let callRecords = await CallRecord.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    // Auto-link calls by agent_name if no calls are linked
    // This is a fallback when webhooks haven't linked calls automatically
    if (callRecords.length === 0) {
      console.log(`No linked calls found for user ${user.username}, attempting to find and link calls...`);
      
      try {
        // First, try to link existing CallRecord entries
        const unlinkedCalls = await CallRecord.findAll({
          where: { userId: null },
          order: [["createdAt", "DESC"]],
          limit: 100, // Only check last 100 unlinked calls
        });

        let linkedCount = 0;
        for (const callRecord of unlinkedCalls) {
          try {
            // Fetch call data from Retell to get agent_name
            const callData = await getCall(callRecord.retellCallId);
            
            // Try multiple ways to extract agent_name
            const agentName = 
              callData.agent_name || 
              callData.agent?.name || 
              callData.agent_id ||
              callData.agent_name_id ||
              (callData.agent && typeof callData.agent === 'string' ? callData.agent : null);
            
            if (agentName && agentName === user.username) {
              callRecord.userId = user.id;
              await callRecord.save();
              linkedCount++;
              console.log(`✅ Auto-linked existing call ${callRecord.retellCallId} to user ${user.username} by agent_name "${agentName}"`);
            }
          } catch (err) {
            // Skip if we can't fetch the call
            console.log(`⚠️  Could not fetch call ${callRecord.retellCallId}:`, err.message);
          }
        }

        // If still no calls, try querying Retell API directly for calls with matching agent_name
        if (linkedCount === 0) {
          console.log(`No existing CallRecord entries found, querying Retell API directly for agent_name "${user.username}"...`);
          
          try {
            const { listAllCallsPost } = retellClient;
            // Query Retell for calls - fetch all pages to find matching calls
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

            // Filter calls by agent_name matching username
            const matchingCalls = callsArray.filter(call => {
              const agentName = 
                call.agent_name || 
                call.agent?.name || 
                call.agent_id ||
                call.agent_name_id;
              return agentName === user.username;
            });

            console.log(`Found ${matchingCalls.length} calls in Retell with agent_name "${user.username}"`);

            // Create CallRecord entries for matching calls and link them
            for (const call of matchingCalls) {
              try {
                const callId = call.call_id || call.id || call.callId;
                if (!callId) continue;

                // Create or get CallRecord
                const [callRecord, created] = await CallRecord.findOrCreate({
                  where: { retellCallId: callId },
                  defaults: { 
                    metadata: call.metadata || {},
                    userId: user.id 
                  },
                });

                // If it already existed but wasn't linked, link it now
                if (!created && !callRecord.userId) {
                  callRecord.userId = user.id;
                  await callRecord.save();
                }

                if (created || !callRecord.userId) {
                  linkedCount++;
                  console.log(`✅ Created/linked call ${callId} to user ${user.username}`);
                }
              } catch (err) {
                console.log(`⚠️  Error processing call:`, err.message);
              }
            }
          } catch (err) {
            console.error("Error querying Retell API:", err);
          }
        }

        if (linkedCount > 0) {
          // Re-fetch the call records after linking
          callRecords = await CallRecord.findAll({
            where: { userId: req.user.id },
            order: [["createdAt", "DESC"]],
          });
          console.log(`✅ Linked ${linkedCount} calls to user ${user.username}`);
        } else {
          console.log(`ℹ️  No calls found matching agent_name "${user.username}"`);
        }
      } catch (err) {
        console.error("Error auto-linking calls:", err);
        // Continue even if auto-linking fails
      }
    }

    // Fetch call details from Retell using list-calls endpoint
    // This provides full call data including transcripts
    const results = [];
    
    if (callRecords.length > 0) {
      try {
        // Fetch all calls with pagination to ensure we get all matching calls
        const retellCallsResponse = await listAllCallsPost({});
        
        // Extract calls array from response
        let callsArray = [];
        if (Array.isArray(retellCallsResponse)) {
          callsArray = retellCallsResponse;
        } else if (retellCallsResponse.calls && Array.isArray(retellCallsResponse.calls)) {
          callsArray = retellCallsResponse.calls;
        } else if (retellCallsResponse.data && Array.isArray(retellCallsResponse.data)) {
          callsArray = retellCallsResponse.data;
        }

        // Create a map of retellCallId to CallRecord for quick lookup
        const callRecordMap = new Map();
        callRecords.forEach(rec => {
          callRecordMap.set(rec.retellCallId, rec);
        });

        // Match calls from Retell with our CallRecords
        // Since CallRecords are already linked to this user, include all matched calls
        for (const call of callsArray) {
          const callId = call.call_id || call.id || call.callId;
          if (!callId) continue;

          const callRecord = callRecordMap.get(callId);
          if (callRecord) {
            // CallRecord is already linked to this user, so include it
            results.push({ mapping: callRecord, call });
          }
        }

        // Include CallRecords that weren't found in list-calls (may be older calls)
        for (const rec of callRecords) {
          const alreadyIncluded = results.some(r => r.mapping.id === rec.id);
          if (!alreadyIncluded) {
            // Try to fetch individually as fallback
            try {
              const call = await getCall(rec.retellCallId);
              results.push({ mapping: rec, call });
            } catch (err) {
              // Check if it's a 404 error (call deleted or invalid)
              const is404 = err.response?.status === 404 || err.message?.includes("404") || err.message?.includes("not found");
              const errorMsg = is404 
                ? "Request failed with status code 404" 
                : err.message || "Failed to fetch call";
              results.push({ mapping: rec, call: null, error: errorMsg, isDeleted: is404 });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching calls from Retell list-calls:", err);
        // Fallback: fetch calls individually
        for (const rec of callRecords) {
          try {
            const call = await getCall(rec.retellCallId);
            results.push({ mapping: rec, call });
          } catch (err) {
            // Check if it's a 404 error (call deleted or invalid)
            const is404 = err.response?.status === 404 || err.message?.includes("404") || err.message?.includes("not found");
            const errorMsg = is404 
              ? "Request failed with status code 404" 
              : err.message || "Failed to fetch call";
            results.push({ mapping: rec, call: null, error: errorMsg, isDeleted: is404 });
          }
        }
      }
    }

    results.sort((a, b) => {
      const dateA = new Date(a.mapping.createdAt || 0).getTime();
      const dateB = new Date(b.mapping.createdAt || 0).getTime();
      return dateB - dateA;
    });

    console.log(`Returning ${results.length} calls for user ${user.username}`);
    res.json(results);
  } catch (err) {
    console.error("Error in /api/my-calls:", err);
    // Don't leak error details to client
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/list-calls
// Proxy to Retell AI's list-calls endpoint
// Supports pagination: set fetchAll=true in body to get all calls across all pages
// Filters out calls from deleted agents
router.post("/list-calls", authMiddleware, async (req, res) => {
  try {
    const filters = req.body || {};
    const { fetchAll, ...apiFilters } = filters;
    
    let callsResult;
    // If fetchAll is true, use the pagination-aware function
    if (fetchAll === true || fetchAll === "true") {
      console.log("📋 Fetching all calls with pagination support...");
      callsResult = await listAllCallsPost(apiFilters);
    } else {
      // Otherwise, use the regular function (single page)
      callsResult = await listCallsPost(apiFilters);
    }

    // Extract calls array from response
    let callsArray = [];
    if (Array.isArray(callsResult)) {
      callsArray = callsResult;
    } else if (callsResult.calls && Array.isArray(callsResult.calls)) {
      callsArray = callsResult.calls;
    } else if (callsResult.data && Array.isArray(callsResult.data)) {
      callsArray = callsResult.data;
    } else {
      // If structure is unknown, return as-is
      res.json(callsResult);
      return;
    }

    // Fetch active agents to filter out calls from deleted agents
    try {
      const activeAgents = await listAgents();
      if (activeAgents && activeAgents.length > 0) {
        // Create a set of active agent IDs and names for quick lookup
        const activeAgentIds = new Set();
        const activeAgentNames = new Set();
        
        activeAgents.forEach(agent => {
          const agentId = agent.agent_id || agent.id || agent.agentId;
          const agentName = agent.agent_name || agent.name || agent.agentName;
          if (agentId) activeAgentIds.add(String(agentId));
          if (agentName) activeAgentNames.add(String(agentName));
        });

        // Filter calls to only include those with active agents
        const filteredCalls = callsArray.filter(call => {
          const callAgentId = call.agent_id || call.agent?.id || call.agentId;
          const callAgentName = call.agent_name || call.agent?.name || call.agentName;
          
          // If we have agent ID, check if it's in active agents
          if (callAgentId && activeAgentIds.has(String(callAgentId))) {
            return true;
          }
          // If we have agent name, check if it's in active agents
          if (callAgentName && activeAgentNames.has(String(callAgentName))) {
            return true;
          }
          // If no agent ID or name, include it (might be old format)
          if (!callAgentId && !callAgentName) {
            return true;
          }
          // Otherwise, exclude (agent is deleted)
          return false;
        });

        console.log(`🔍 Filtered ${callsArray.length} calls to ${filteredCalls.length} (removed ${callsArray.length - filteredCalls.length} calls from deleted agents)`);
        
        // Return filtered calls in the same structure
        if (Array.isArray(callsResult)) {
          res.json(filteredCalls);
        } else if (callsResult.calls) {
          res.json({ ...callsResult, calls: filteredCalls });
        } else if (callsResult.data) {
          res.json({ ...callsResult, data: filteredCalls });
        } else {
          res.json(filteredCalls);
        }
      } else {
        // No agents list available, return all calls (graceful degradation)
        console.log("⚠️  Could not fetch agents list, returning all calls without filtering");
        res.json(callsResult);
      }
    } catch (agentErr) {
      // If fetching agents fails, log but don't fail the request
      console.warn("⚠️  Could not fetch agents list to filter deleted agents:", agentErr.message);
      res.json(callsResult);
    }
  } catch (err) {
    console.error("Error listing calls from Retell:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      stack: err.stack
    });
    // Don't leak internal error details
    const statusCode = err.response?.status || 500;
    res.status(statusCode).json({ 
      error: statusCode === 500 ? "Failed to list calls" : (err.response?.data?.message || "Failed to list calls")
    });
  }
});

export default router;
