import axios from "axios";
import { retell } from "../config.js";

if (!retell.apiKey) {
  console.warn("⚠️  RETELL_API_KEY is not set in environment variables");
}

if (!retell.baseUrl) {
  console.warn("⚠️  RETELL_BASE_URL is not set in environment variables");
}

const client = axios.create({
  baseURL: retell.baseUrl,
  headers: {
    Authorization: `Bearer ${retell.apiKey || ""}`,
    "Content-Type": "application/json",
  },
});

// Fetches a single call by ID from Retell API
async function getCall(callId) {
  if (!callId) {
    throw new Error("Call ID is required");
  }
  
  try {
    const res = await client.get(`/calls/${callId}`);
    return res.data;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Error fetching call ${callId}:`, err.response?.data || err.message);
    }
    throw err;
  }
}

// Lists calls from Retell API using GET request with query parameters
async function listCalls(query = {}) {
  try {
    const res = await client.get("/calls", { params: query });
    return res.data;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error listing calls (GET):", err.response?.data || err.message);
    }
    throw err;
  }
}

// Lists calls from Retell API using POST request (preferred method with filters)
async function listCallsPost(filters = {}) {
  if (!retell.apiKey) {
    throw new Error("RETELL_API_KEY is not configured");
  }
  if (!retell.baseUrl) {
    throw new Error("RETELL_BASE_URL is not configured");
  }
  
  try {
    const res = await client.post("/v2/list-calls", filters);
    return res.data;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error listing calls (POST):", {
        message: err.message,
        code: err.code,
        url: `${retell.baseUrl}/v2/list-calls`,
        response: err.response?.data
      });
    }
    throw err;
  }
}

// Fetches all calls from Retell API using pagination (handles multiple response formats)
async function listAllCallsPost(filters = {}) {
  const allCalls = [];
  let hasMore = true;
  let cursor = null;
  let page = 0;
  let totalCount = null;
  const maxPages = 100;
  const limit = filters.limit || 100;
  
  while (hasMore && page < maxPages) {
    try {
      const requestBody = {
        ...filters,
        limit: limit,
      };
      
      if (cursor) {
        requestBody.cursor = cursor;
        if (!requestBody.cursor) {
          requestBody.next_cursor = cursor;
        }
        if (!requestBody.next_cursor) {
          requestBody.offset = cursor;
        }
      } else if (page > 0) {
        requestBody.offset = page * limit;
      }
      
      const res = await client.post("/v2/list-calls", requestBody);
      const data = res.data;
      
      let callsArray = [];
      let pageTotalCount = null;
      
      if (Array.isArray(data)) {
        callsArray = data;
        hasMore = false;
      } else if (data.calls && Array.isArray(data.calls)) {
        callsArray = data.calls;
        pageTotalCount = data.total_count !== undefined ? data.total_count : 
                    data.totalCount !== undefined ? data.totalCount :
                    data.total !== undefined ? data.total : null;
        
        if (totalCount === null && pageTotalCount !== null) {
          totalCount = pageTotalCount;
        }
        
        const explicitHasMore = data.has_more !== undefined ? data.has_more : 
                                 data.hasMore !== undefined ? data.hasMore : null;
        cursor = data.next_cursor || data.cursor || data.next || null;
        
        if (explicitHasMore !== null) {
          hasMore = explicitHasMore === true;
        } else {
          hasMore = callsArray.length === limit;
        }
      } else if (data.data && Array.isArray(data.data)) {
        callsArray = data.data;
        pageTotalCount = data.total_count !== undefined ? data.total_count : 
                    data.totalCount !== undefined ? data.totalCount :
                    data.total !== undefined ? data.total : null;
        
        if (totalCount === null && pageTotalCount !== null) {
          totalCount = pageTotalCount;
        }
        
        const explicitHasMore = data.has_more !== undefined ? data.has_more : 
                                 data.hasMore !== undefined ? data.hasMore : null;
        cursor = data.next_cursor || data.cursor || data.next || null;
        
        if (explicitHasMore !== null) {
          hasMore = explicitHasMore === true;
        } else {
          hasMore = callsArray.length === limit;
        }
      } else {
        const keys = Object.keys(data);
        for (const key of keys) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            callsArray = data[key];
            break;
          }
        }
        hasMore = false;
      }
      
      allCalls.push(...callsArray);
      
      if (callsArray.length < limit) {
        hasMore = false;
      } else if (callsArray.length === 0 && page > 0) {
        hasMore = false;
      }
      
      page++;
    } catch (err) {
      if (page === 0) {
        throw err;
      }
      hasMore = false;
    }
  }
  
  if (totalCount !== null && allCalls.length < totalCount && process.env.NODE_ENV !== 'production') {
    console.warn(`⚠️  Warning: Fetched ${allCalls.length} calls but API indicates ${totalCount} total. Some calls may be missing.`);
  }
  
  return {
    calls: allCalls,
    total_count: totalCount !== null ? totalCount : allCalls.length,
    fetched_count: allCalls.length,
    has_more: totalCount !== null ? allCalls.length < totalCount : false
  };
}

// Fetches list of agents from Retell API, tries multiple endpoint paths
async function listAgents() {
  if (!retell.apiKey) {
    throw new Error("RETELL_API_KEY is not configured");
  }
  if (!retell.baseUrl) {
    throw new Error("RETELL_BASE_URL is not configured");
  }
  
  const endpointsToTry = [
    "/v2/list-agents",
    "/list-agents",
    "/agents",
    "/v2/agents"
  ];
  
  for (const endpoint of endpointsToTry) {
    try {
      const res = await client.get(endpoint);
      const data = res.data;
      
      let agents = [];
      if (Array.isArray(data)) {
        agents = data;
      } else if (data.agents && Array.isArray(data.agents)) {
        agents = data.agents;
      } else if (data.data && Array.isArray(data.data)) {
        agents = data.data;
      }
      
      if (agents.length > 0) {
        return agents;
      }
    } catch (err) {
      continue;
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.warn("⚠️  Could not fetch agents list from Retell API. Tried endpoints:", endpointsToTry.join(", "));
  }
  return [];
}

export default { getCall, listCalls, listCallsPost, listAllCallsPost, listAgents };
