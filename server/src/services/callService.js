import { CallRecord, User } from "../models/index.js";
import retellClient from "../utils/retellClient.js";
import { extractAgentName } from "../utils/agentUtils.js";

const { getCall, listAllCallsPost, listAgents } = retellClient;

/**
 * Retrieves all calls for a specific user with automatic linking by agent name.
 */
export async function getUserCalls(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Get linked call records
  let callRecords = await CallRecord.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  // Auto-link unlinked calls by agent_name
  const linkedCount = await autoLinkCallsByAgent(user.username);
  
  if (linkedCount > 0) {
    // Re-fetch after linking
    callRecords = await CallRecord.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  // Fetch call details from Retell
  const results = await fetchCallDetails(callRecords);
  
  // Sort by creation date
  results.sort((a, b) => {
    const dateA = new Date(a.mapping?.createdAt || 0).getTime();
    const dateB = new Date(b.mapping?.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return results;
}

/**
 * Automatically links unlinked calls by matching agent_name with username.
 */
async function autoLinkCallsByAgent(username) {
  try {
    // Link existing CallRecords
    const unlinkedCalls = await CallRecord.findAll({
      where: { userId: null },
      order: [["createdAt", "DESC"]],
      limit: 100, // Only check last 100 unlinked calls
    });

    let linkedCount = 0;
    
    for (const callRecord of unlinkedCalls) {
      try {
        const callData = await getCall(callRecord.retellCallId);
        const agentName = extractAgentName(callData);
        
        if (agentName === username) {
          const user = await User.findOne({ where: { username } });
          if (user) {
            callRecord.userId = user.id;
            await callRecord.save();
            linkedCount++;
          }
        }
      } catch (err) {
        // Skip if we can't fetch the call
        continue;
      }
    }

    // Query Retell API for calls with matching agent_name
    try {
      const retellCalls = await listAllCallsPost({});
      const callsArray = extractCallsArray(retellCalls);
      
      const matchingCalls = callsArray.filter(call => {
        const agentName = extractAgentName(call);
        return agentName === username;
      });

      // Create or update CallRecord entries
      const user = await User.findOne({ where: { username } });
      if (user) {
        for (const call of matchingCalls) {
          try {
            const callId = call.call_id || call.id || call.callId;
            if (!callId) continue;

            const [callRecord, created] = await CallRecord.findOrCreate({
              where: { retellCallId: callId },
              defaults: {
                metadata: call.metadata || {},
                userId: user.id,
              },
            });

            if (!created && !callRecord.userId) {
              callRecord.userId = user.id;
              await callRecord.save();
              linkedCount++;
            } else if (created) {
              linkedCount++;
            }
          } catch (err) {
            // Skip errors
            continue;
          }
        }
      }
    } catch (err) {
      // Continue even if Retell API query fails
    }

    return linkedCount;
  } catch (err) {
    return 0;
  }
}

/**
 * Fetches call details from Retell API for the provided call records.
 */
async function fetchCallDetails(callRecords) {
  const results = [];
  
  if (callRecords.length === 0) {
    return results;
  }

  try {
    const retellCallsResponse = await listAllCallsPost({});
    const callsArray = extractCallsArray(retellCallsResponse);

    // Create map for quick lookup
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
        results.push({ mapping: callRecord, call });
      }
    }

    // Include CallRecords not found in list-calls (fallback)
    for (const rec of callRecords) {
      const alreadyIncluded = results.some(r => r.mapping?.id === rec.id);
      if (!alreadyIncluded) {
        try {
          const call = await getCall(rec.retellCallId);
          results.push({ mapping: rec, call });
        } catch (err) {
          const is404 = err.response?.status === 404 || err.message?.includes("404") || err.message?.includes("not found");
          results.push({
            mapping: rec,
            call: null,
            error: is404 ? "Request failed with status code 404" : (err.message || "Failed to fetch call"),
            isDeleted: is404,
          });
        }
      }
    }
  } catch (err) {
    // Fallback: fetch individually
    for (const rec of callRecords) {
      try {
        const call = await getCall(rec.retellCallId);
        results.push({ mapping: rec, call });
      } catch (err) {
        const is404 = err.response?.status === 404 || err.message?.includes("404") || err.message?.includes("not found");
        results.push({
          mapping: rec,
          call: null,
          error: is404 ? "Request failed with status code 404" : (err.message || "Failed to fetch call"),
          isDeleted: is404,
        });
      }
    }
  }

  return results;
}

/**
 * Lists calls from Retell API with optional filtering and pagination.
 */
export async function listCalls(filters = {}, fetchAll = false) {
  // Remove fetchAll from filters to avoid passing it to API
  const apiFilters = { ...filters };
  delete apiFilters.fetchAll;
  
  let callsResult;
  if (fetchAll === true || fetchAll === "true") {
    callsResult = await listAllCallsPost(apiFilters);
  } else {
    const { listCallsPost } = retellClient;
    callsResult = await listCallsPost(apiFilters);
  }

  // Extract calls array and metadata
  const { callsArray, totalCount, fetchedCount } = extractCallsMetadata(callsResult);
  
  // Filter out calls from deleted agents
  const activeAgents = await getActiveAgents();
  const filteredCalls = filterCallsByActiveAgents(callsArray, activeAgents);
  
  return {
    calls: filteredCalls,
    ...(totalCount !== null && { total_count: totalCount }),
    ...(fetchedCount !== null && { fetched_count: fetchedCount }),
  };
}

/**
 * Retrieves active agents from Retell API.
 */
async function getActiveAgents() {
  try {
    return await listAgents();
  } catch (err) {
    return [];
  }
}

/**
 * Filters calls to only include those associated with active agents.
 */
function filterCallsByActiveAgents(calls, activeAgents) {
  if (!activeAgents || activeAgents.length === 0) {
    return calls;
  }

  const activeAgentIds = new Set();
  const activeAgentNames = new Set();
  
  activeAgents.forEach(agent => {
    const agentId = agent.agent_id || agent.id || agent.agentId;
    const agentName = agent.agent_name || agent.name || agent.agentName;
    if (agentId) activeAgentIds.add(String(agentId));
    if (agentName) activeAgentNames.add(String(agentName));
  });

  return calls.filter(call => {
    const callAgentId = call.agent_id || call.agent?.id || call.agentId;
    const callAgentName = call.agent_name || call.agent?.name || call.agentName;
    
    if (callAgentId && activeAgentIds.has(String(callAgentId))) {
      return true;
    }
    if (callAgentName && activeAgentNames.has(String(callAgentName))) {
      return true;
    }
    if (!callAgentId && !callAgentName) {
      return true; // Include if no agent info (might be old format)
    }
    return false; // Exclude (agent is deleted)
  });
}

/**
 * Extracts the calls array from various Retell API response formats.
 */
function extractCallsArray(response) {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.calls && Array.isArray(response.calls)) {
    return response.calls;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
}

/**
 * Extracts calls metadata including total count and fetched count from Retell API response.
 */
function extractCallsMetadata(response) {
  let callsArray = [];
  let totalCount = null;
  let fetchedCount = null;

  if (Array.isArray(response)) {
    callsArray = response;
    fetchedCount = response.length;
  } else if (response.calls && Array.isArray(response.calls)) {
    callsArray = response.calls;
    totalCount = response.total_count;
    fetchedCount = response.fetched_count || response.calls.length;
  } else if (response.data && Array.isArray(response.data)) {
    callsArray = response.data;
    totalCount = response.total_count;
    fetchedCount = response.fetched_count || response.data.length;
  }

  return { callsArray, totalCount, fetchedCount };
}

/**
 * Links call records to users by matching agent names with usernames.
 */
export async function linkCallsByAgent() {
  const { getCall } = retellClient;
  
  const unlinkedCalls = await CallRecord.findAll({
    where: { userId: null },
  });

  let linkedCount = 0;
  let errorCount = 0;
  const linkDetails = [];

  for (const callRecord of unlinkedCalls) {
    try {
      const callData = await getCall(callRecord.retellCallId);
      const agentName = extractAgentName(callData);
      
      if (agentName) {
        const user = await User.findOne({ where: { username: agentName } });
        
        if (user) {
          callRecord.userId = user.id;
          await callRecord.save();
          linkedCount++;
          linkDetails.push({
            callId: callRecord.retellCallId,
            agentName,
            username: user.username,
          });
        } else {
          linkDetails.push({
            callId: callRecord.retellCallId,
            agentName,
            username: null,
            note: "No matching user found",
          });
        }
      } else {
        linkDetails.push({
          callId: callRecord.retellCallId,
          agentName: null,
          note: "No agent_name found in call data",
        });
      }
    } catch (err) {
      errorCount++;
      linkDetails.push({
        callId: callRecord.retellCallId,
        error: err.message,
      });
    }
  }

  return {
    message: `Linked ${linkedCount} calls to users. ${errorCount} errors out of ${unlinkedCalls.length} total.`,
    linked: linkedCount,
    errors: errorCount,
    total: unlinkedCalls.length,
    details: linkDetails.slice(0, 20),
  };
}

/**
 * Refreshes agent names from RetellAI and re-links calls to users.
 */
export async function refreshAgentNames() {
  const retellCalls = await listAllCallsPost({});
  const callsArray = extractCallsArray(retellCalls);
  
  // Get all CallRecords
  const allCallRecords = await CallRecord.findAll();
  const callRecordMap = new Map();
  allCallRecords.forEach(rec => {
    callRecordMap.set(rec.retellCallId, rec);
  });
  
  // Extract unique agent names for batch user lookup
  const uniqueAgentNames = new Set();
  callsArray.forEach(call => {
    const agentName = extractAgentName(call);
    if (agentName) {
      uniqueAgentNames.add(agentName);
    }
  });
  
  // Batch fetch all users at once to avoid N+1 queries
  const users = await User.findAll({
    where: { username: Array.from(uniqueAgentNames) },
  });
  const userMap = new Map();
  users.forEach(user => {
    userMap.set(user.username, user);
  });
  
  let updatedCount = 0;
  let linkedCount = 0;
  const details = [];
  
  for (const call of callsArray) {
    const callId = call.call_id || call.id || call.callId;
    if (!callId) continue;
    
    const callRecord = callRecordMap.get(callId);
    if (!callRecord) continue;
    
    const agentName = extractAgentName(call);
    
    if (agentName) {
      const user = userMap.get(agentName);
      
      if (user) {
        if (callRecord.userId !== user.id) {
          callRecord.userId = user.id;
          await callRecord.save();
          linkedCount++;
          details.push({
            callId,
            oldUserId: callRecord.userId,
            newUserId: user.id,
            agentName,
            username: user.username,
          });
        }
        updatedCount++;
      } else {
        details.push({
          callId,
          agentName,
          note: "No user found with matching username",
        });
      }
    }
  }
  
  return {
    message: `Refreshed ${updatedCount} calls. Re-linked ${linkedCount} calls to users.`,
    updated: updatedCount,
    reLinked: linkedCount,
    total: callsArray.length,
    details: details.slice(0, 50),
  };
}

/**
 * Handles webhook events from Retell by creating or updating call records and linking to users.
 */
export async function handleWebhookEvent(event) {
  const { getCall } = retellClient;
  
  const retellCallId = String(event.id).trim();
  const metadata = event.metadata || {};

  // Try to link by metadata userId
  let mappedUserId = null;
  if (metadata.userId) {
    const user = await User.findOne({ where: { id: metadata.userId } });
    if (user) mappedUserId = user.id;
  }

  // Create or update CallRecord
  const [rec, created] = await CallRecord.findOrCreate({
    where: { retellCallId },
    defaults: { metadata, userId: mappedUserId },
  });

  // Try to link by metadata username
  if (!rec.userId && metadata.username) {
    const user = await User.findOne({ where: { username: metadata.username } });
    if (user) {
      rec.userId = user.id;
      await rec.save();
    }
  }

  // Try to link by agent_name from call data
  if (!rec.userId) {
    try {
      const callData = await getCall(retellCallId);
      const agentName = extractAgentName(callData);
      
      if (agentName) {
        const user = await User.findOne({ where: { username: agentName } });
        if (user) {
          rec.userId = user.id;
          await rec.save();
        }
      }
    } catch (err) {
      // Continue if we can't fetch call data
    }
  }

  return { ok: true };
}

