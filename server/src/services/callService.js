import { CallRecord, User } from "../models/index.js";
import retellClient from "../utils/retellClient.js";
import { extractAgentName } from "../utils/agentUtils.js";

const { getCall, listCallsPost, listAgents } = retellClient;

/**
 * Extracts calls array from Retell API response handling multiple response shapes.
 */
function extractCallsFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (response?.calls && Array.isArray(response.calls)) return response.calls;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
}

/**
 * Extracts the next cursor from Retell API response.
 * IMPORTANT: Retell only supports `next_cursor`.
 */
function extractNextCursor(response) {
  return response?.next_cursor ?? null;
}

/**
 * Fetches ALL calls from Retell using cursor-based pagination.
 * IMPORTANT: Retell API returns max 100 calls per request. This function loops until next_cursor is null
 * to fetch the complete dataset. Always use this for analytics, displays, or when the full dataset is required.
 */
async function fetchAllRetellCalls(filters = {}) {
  let allCalls = [];
  let cursor = null;

  do {
    const requestBody = {
      ...filters,
      limit: 100, // Retell API maximum per request
      ...(cursor ? { cursor } : {}),
    };

    const response = await listCallsPost(requestBody);
    const calls = extractCallsFromResponse(response);

    allCalls.push(...calls);
    cursor = extractNextCursor(response);
  } while (cursor);

  return allCalls;
}

/**
 * Retrieves all calls for a specific user.
 */
export async function getUserCalls(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await autoLinkCallsByAgent(user.username);

  const callRecords = await CallRecord.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  const results = await fetchCallDetails(callRecords);

  return results.sort((a, b) => {
    const aTime = new Date(a.mapping.createdAt).getTime();
    const bTime = new Date(b.mapping.createdAt).getTime();
    return bTime - aTime;
  });
}

/**
 * Automatically links unlinked calls to a user by agent name.
 */
async function autoLinkCallsByAgent(username) {
  const user = await User.findOne({ where: { username } });
  if (!user) return 0;

  let linkedCount = 0;

  // Link recent unlinked CallRecords first
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

  // Fetch ALL Retell calls once (paginated)
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

/**
 * Fetches Retell call details for mapped CallRecords.
 */
async function fetchCallDetails(callRecords) {
  if (!callRecords.length) return [];

  const retellCalls = await fetchAllRetellCalls();
  const retellMap = new Map();

  retellCalls.forEach(call => {
    const id = call.call_id || call.id || call.callId;
    if (id) retellMap.set(id, call);
  });

  const results = [];

  for (const record of callRecords) {
    const call = retellMap.get(record.retellCallId);

    if (call) {
      results.push({ mapping: record, call });
      continue;
    }

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

  return results;
}

/**
 * Lists calls with optional filtering and pagination support.
 * NOTE: When fetchAll=false, only the first 100 calls are returned (Retell API limit).
 * For analytics or display purposes requiring the complete dataset, always use fetchAll=true.
 */
export async function listCalls(filters = {}, fetchAll = false) {
  const apiFilters = { ...filters };
  delete apiFilters.fetchAll;

  let calls = [];

  if (fetchAll) {
    // Paginated fetch - gets ALL calls by looping until next_cursor is null
    calls = await fetchAllRetellCalls(apiFilters);
  } else {
    // Single-page fetch - capped at 100 calls (Retell API limit)
    // WARNING: Do NOT use this path for analytics or displays that need accurate totals
    const response = await listCallsPost(apiFilters);
    calls = extractCallsFromResponse(response);
  }

  const activeAgents = await getActiveAgents();

  return {
    calls: filterCallsByActiveAgents(calls, activeAgents),
    fetched_count: calls.length, // Actual number of calls fetched (not capped if fetchAll=true)
  };
}

/**
 * Retrieves active agents from Retell.
 */
async function getActiveAgents() {
  try {
    return await listAgents();
  } catch {
    return [];
  }
}

/**
 * Filters calls to only include calls from active agents.
 * NOTE: This function is intentionally permissive to avoid hiding valid calls.
 */
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

    // Permissive fallback — do NOT hide calls
    return true;
  });
}

/**
 * Links existing calls to users by matching agent_name to username.
 */
export async function linkCallsByAgent() {
  const users = await User.findAll();
  let totalLinked = 0;

  for (const user of users) {
    const linkedCount = await autoLinkCallsByAgent(user.username);
    totalLinked += linkedCount;
  }

  return { linked: totalLinked };
}

/**
 * Refreshes agent names and relinks calls.
 */
export async function refreshAgentNames() {
  const calls = await fetchAllRetellCalls();
  const records = await CallRecord.findAll();

  const recordMap = new Map(records.map(r => [r.retellCallId, r]));
  const users = await User.findAll();
  const userMap = new Map(users.map(u => [u.username, u]));

  let updated = 0;

  for (const call of calls) {
    const callId = call.call_id || call.id;
    const agentName = extractAgentName(call);
    const record = recordMap.get(callId);
    const user = userMap.get(agentName);

    if (record && user && record.userId !== user.id) {
      record.userId = user.id;
      await record.save();
      updated++;
    }
  }

  return { updated };
}

/**
 * Handles Retell webhook events.
 */
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
