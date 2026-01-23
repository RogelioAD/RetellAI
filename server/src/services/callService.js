import { CallRecord, User, Sequelize } from "../models/index.js";
import retellClient from "../utils/retellClient.js";
import { extractAgentName } from "../utils/agentUtils.js";

const { getCall, listCallsPost, listAgents } = retellClient;

// Extracts calls array from Retell API response, handling multiple response formats
function extractCallsFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (response?.calls && Array.isArray(response.calls)) return response.calls;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
}

// Extracts pagination cursor from API response
function extractNextCursor(response) {
  return response?.next_cursor ?? null;
}

// Fetches all calls from Retell API using pagination (calls API until no more pages)
async function fetchAllRetellCalls(filters = {}) {
  let allCalls = [];
  let cursor = null;

  do {
    const requestBody = {
      ...filters,
      limit: 100,
      ...(cursor ? { cursor } : {}),
    };

    const response = await listCallsPost(requestBody);
    const calls = extractCallsFromResponse(response);

    allCalls.push(...calls);
    cursor = extractNextCursor(response);
  } while (cursor);

  return allCalls;
}

// Extracts call date from call object or database mapping, with fallback to current time
function extractCallDate(call, mapping = {}) {
  return (
    call?.created_at ||
    call?.createdAt ||
    call?.start_timestamp ||
    mapping?.createdAt ||
    new Date().toISOString()
  );
}

// Sorts call results by date (newest first)
function sortCallsByDate(results) {
  return results.sort((a, b) => {
    const aDate = extractCallDate(a.call, a.mapping);
    const bDate = extractCallDate(b.call, b.mapping);
    const aTime = new Date(aDate).getTime();
    const bTime = new Date(bDate).getTime();
    return bTime - aTime;
  });
}

// Gets all calls for a specific user
// Note: Auto-linking is skipped for performance - it should be run manually via the refresh endpoint
export async function getUserCalls(userId, skipAutoLink = true) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Skip expensive auto-linking on every load - only run when explicitly requested
  if (!skipAutoLink) {
    await autoLinkCallsByAgent(user.username);
  }

  const callRecords = await CallRecord.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  // Fetch Retell calls once and reuse
  const retellCalls = await fetchAllRetellCalls();
  const results = await fetchCallDetails(callRecords, retellCalls);
  return sortCallsByDate(results);
}

// Automatically links unlinked calls to a user by matching agent name with username
async function autoLinkCallsByAgent(username) {
  const user = await User.findOne({ where: { username } });
  if (!user) return 0;

  let linkedCount = 0;

  const unlinkedRecords = await CallRecord.findAll({
    where: { userId: null },
    limit: 100,
    order: [["createdAt", "DESC"]],
  });

  for (const record of unlinkedRecords) {
    try {
      const call = await getCall(record.retellCallId);
      const agentName = extractAgentName(call);

      if (agentName === username) {
        record.userId = user.id;
        await record.save();
        linkedCount++;
      }
    } catch {
      continue;
    }
  }

  const retellCalls = await fetchAllRetellCalls();

  for (const call of retellCalls) {
    const agentName = extractAgentName(call);
    if (agentName !== username) continue;

    const callId = call.call_id || call.id || call.callId;
    if (!callId) continue;

    const [record, created] = await CallRecord.findOrCreate({
      where: { retellCallId: callId },
      defaults: {
        userId: user.id,
        metadata: call.metadata || {},
      },
    });

    if (!created && !record.userId) {
      record.userId = user.id;
      await record.save();
      linkedCount++;
    }

    if (created) linkedCount++;
  }

  return linkedCount;
}

// Fetches full call details from Retell API for database call records
// Accepts optional pre-fetched retellCalls array to avoid duplicate API calls
async function fetchCallDetails(callRecords, preFetchedRetellCalls = null) {
  if (!callRecords.length) return [];

  // Use pre-fetched calls if provided, otherwise fetch them
  const retellCalls = preFetchedRetellCalls || await fetchAllRetellCalls();
  const retellMap = new Map();

  retellCalls.forEach(call => {
    const id = call.call_id || call.id || call.callId;
    if (id) retellMap.set(id, call);
  });

  const results = [];
  const missingCallIds = [];

  // First pass: match records with pre-fetched calls
  for (const record of callRecords) {
    const call = retellMap.get(record.retellCallId);

    if (call) {
      results.push({ mapping: record, call });
    } else {
      missingCallIds.push(record);
    }
  }

  // Second pass: only fetch missing calls individually (these are likely deleted)
  // Limit to avoid too many API calls - batch process if needed
  const MAX_INDIVIDUAL_FETCHES = 50;
  const toFetch = missingCallIds.slice(0, MAX_INDIVIDUAL_FETCHES);
  
  for (const record of toFetch) {
    try {
      const fetched = await getCall(record.retellCallId);
      results.push({ mapping: record, call: fetched });
    } catch (err) {
      const is404 =
        err.response?.status === 404 ||
        err.message?.includes("404") ||
        err.message?.includes("not found");

      results.push({
        mapping: record,
        call: null,
        error: err.message,
        isDeleted: is404,
      });
    }
  }

  // For remaining missing calls, mark as potentially deleted without fetching
  for (let i = MAX_INDIVIDUAL_FETCHES; i < missingCallIds.length; i++) {
    const record = missingCallIds[i];
    results.push({
      mapping: record,
      call: null,
      error: "Call not found in Retell",
      isDeleted: true,
    });
  }

  return results;
}

// Gets all calls from database (admin function)
// Automatically syncs missing calls from Retell API to ensure database is up-to-date
export async function getAllCallsFromDatabase(skipAutoLink = true) {
  // Skip expensive auto-linking on every load - only run when explicitly requested
  if (!skipAutoLink) {
    const users = await User.findAll();
    for (const user of users) {
      await autoLinkCallsByAgent(user.username);
    }
  }

  // Automatically sync missing calls from Retell API
  // This ensures calls that came in via webhook to a different server are still visible
  const retellCalls = await fetchAllRetellCalls();
  const existingRecords = await CallRecord.findAll();
  const recordMap = new Map(existingRecords.map(r => [r.retellCallId, r]));
  const users = await User.findAll();
  const userMap = new Map(users.map(u => [u.username, u]));

  // Create missing call records and link them to users
  for (const call of retellCalls) {
    const callId = call.call_id || call.id || call.callId;
    if (!callId) continue;

    let record = recordMap.get(callId);
    
    // Create record if it doesn't exist
    if (!record) {
      const agentName = extractAgentName(call);
      const userId = userMap.get(agentName)?.id || null;
      
      record = await CallRecord.create({
        retellCallId: callId,
        userId: userId,
        metadata: call.metadata || {},
      });
      recordMap.set(callId, record);
    } else if (!record.userId) {
      // Link existing unlinked record if agent name matches a user
      const agentName = extractAgentName(call);
      const user = userMap.get(agentName);
      if (user) {
        record.userId = user.id;
        await record.save();
      }
    }
  }

  // Fetch only linked calls (calls from users you've created)
  const callRecords = await CallRecord.findAll({
    where: { userId: { [Sequelize.Op.ne]: null } },
    order: [["createdAt", "DESC"]],
  });

  // Reuse the already-fetched Retell calls
  const results = await fetchCallDetails(callRecords, retellCalls);
  return sortCallsByDate(results);
}

// Lists calls either from database (fetchAll=true) or directly from Retell API with filters
export async function listCalls(filters = {}, fetchAll = false) {
  if (fetchAll) {
    const results = await getAllCallsFromDatabase();
    
    const calls = results.map(result => {
      if (result.call) {
        return result.call;
      }
      
      const dbCreatedAt = result.mapping?.createdAt;
      return {
        call_id: result.mapping?.retellCallId,
        id: result.mapping?.retellCallId,
        callId: result.mapping?.retellCallId,
        created_at: dbCreatedAt,
        createdAt: dbCreatedAt,
        start_timestamp: dbCreatedAt,
        metadata: result.mapping?.metadata || {},
        _isDeleted: true,
      };
    });
    
    return {
      calls: calls,
      fetched_count: results.length,
    };
  }

  const apiFilters = { ...filters };
  delete apiFilters.fetchAll;

  const response = await listCallsPost(apiFilters);
  const calls = extractCallsFromResponse(response);

  const activeAgents = await getActiveAgents();

  return {
    calls: filterCallsByActiveAgents(calls, activeAgents),
    fetched_count: calls.length,
  };
}

// Gets list of active agents from Retell API (returns empty array on error)
async function getActiveAgents() {
  try {
    return await listAgents();
  } catch {
    return [];
  }
}

// Filters calls to only include those from active agents (or calls with no agent info)
function filterCallsByActiveAgents(calls, activeAgents) {
  if (!activeAgents?.length) return calls;

  const ids = new Set();
  const names = new Set();

  activeAgents.forEach(agent => {
    if (agent.agent_id) ids.add(String(agent.agent_id));
    if (agent.agent_name) names.add(String(agent.agent_name));
  });

  return calls.filter(call => {
    const id = call.agent_id || call.agent?.id;
    const name = call.agent_name || call.agent?.name;

    if (id && ids.has(String(id))) return true;
    if (name && names.has(String(name))) return true;
    if (!id && !name) return true;

    return true;
  });
}

// Links calls to all users by agent name matching (admin function)
export async function linkCallsByAgent() {
  const users = await User.findAll();
  let totalLinked = 0;

  for (const user of users) {
    const linkedCount = await autoLinkCallsByAgent(user.username);
    totalLinked += linkedCount;
  }

  return { linked: totalLinked };
}

// Refreshes call-to-user associations by re-matching agent names (admin function)
// Also creates missing call records from Retell API to sync with local database
export async function refreshAgentNames() {
  const calls = await fetchAllRetellCalls();
  const records = await CallRecord.findAll();

  const recordMap = new Map(records.map(r => [r.retellCallId, r]));
  const users = await User.findAll();
  const userMap = new Map(users.map(u => [u.username, u]));

  let updated = 0;
  let created = 0;

  for (const call of calls) {
    const callId = call.call_id || call.id || call.callId;
    if (!callId) continue;
    
    const agentName = extractAgentName(call);
    let record = recordMap.get(callId);
    
    // Create record if it doesn't exist
    if (!record) {
      const userId = userMap.get(agentName)?.id || null;
      record = await CallRecord.create({
        retellCallId: callId,
        userId: userId,
        metadata: call.metadata || {},
      });
      created++;
      recordMap.set(callId, record); // Add to map for subsequent iterations
    }
    
    // Link to user if unlinked and agent name matches a user
    const user = userMap.get(agentName);
    if (user && record.userId !== user.id) {
      record.userId = user.id;
      await record.save();
      updated++;
    }
  }

  return { updated, created };
}

// Handles incoming webhook event from Retell AI, creates/updates call record and links to user
export async function handleWebhookEvent(event) {
  const retellCallId = String(event.id).trim();
  const metadata = event.metadata || {};

  let userId = null;

  if (metadata.userId) {
    const user = await User.findByPk(metadata.userId);
    if (user) userId = user.id;
  }

  const [record] = await CallRecord.findOrCreate({
    where: { retellCallId },
    defaults: { metadata, userId },
  });

  if (!record.userId && metadata.username) {
    const user = await User.findOne({ where: { username: metadata.username } });
    if (user) {
      record.userId = user.id;
      await record.save();
    }
  }

  if (!record.userId) {
    try {
      const call = await getCall(retellCallId);
      const agentName = extractAgentName(call);
      const user = await User.findOne({ where: { username: agentName } });

      if (user) {
        record.userId = user.id;
        await record.save();
      }
    } catch {}
  }

  return { ok: true };
}
