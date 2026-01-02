import { Router } from "express";
import { CallRecord } from "../models/index.js";
import authMiddleware from "../utils/authMiddleware.js";
import retellClient from "../utils/retellClient.js";
const { getCall, listCallsPost, listAllCallsPost } = retellClient;

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
        for (const call of callsArray) {
          const callId = call.call_id || call.id || call.callId;
          if (!callId) continue;

          const callRecord = callRecordMap.get(callId);
          if (callRecord) {
            const agentName = 
              call.agent_name || 
              call.agent?.name || 
              call.agent_id ||
              call.agent_name_id;
            
            if (agentName === user.username) {
              results.push({ mapping: callRecord, call });
            }
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
router.post("/list-calls", authMiddleware, async (req, res) => {
  try {
    const filters = req.body || {};
    const { fetchAll, ...apiFilters } = filters;
    
    // If fetchAll is true, use the pagination-aware function
    if (fetchAll === true || fetchAll === "true") {
      console.log("📋 Fetching all calls with pagination support...");
      const allCalls = await listAllCallsPost(apiFilters);
      res.json(allCalls);
    } else {
      // Otherwise, use the regular function (single page)
      const result = await listCallsPost(apiFilters);
      res.json(result);
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
