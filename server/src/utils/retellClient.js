// Retell API client using axios
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

/**
 * Get a specific call by ID
 * @param {string} callId - Call ID
 * @returns {Promise<object>} Call data
 */
async function getCall(callId) {
  if (!callId) {
    throw new Error("Call ID is required");
  }
  
  try {
    const res = await client.get(`/calls/${callId}`);
    return res.data;
  } catch (err) {
    // Only log errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Error fetching call ${callId}:`, err.response?.data || err.message);
    }
    throw err;
  }
}

/**
 * List calls using GET endpoint
 * @param {object} query - Query parameters
 * @returns {Promise<object>} Calls data
 */
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

/**
 * List calls using POST endpoint
 * @param {object} filters - Filter parameters
 * @returns {Promise<object>} Calls data
 */
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
    // Only log detailed errors in development
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

/**
 * Fetch all calls with pagination support
 * Handles pagination automatically by checking for next_cursor, has_more, or similar pagination fields
 * @param {object} filters - Filter parameters
 * @returns {Promise<object>} All calls with metadata
 */
async function listAllCallsPost(filters = {}) {
  const allCalls = [];
  let hasMore = true;
  let cursor = null;
  let page = 0;
  let totalCount = null;
  const maxPages = 100; // Safety limit to prevent infinite loops
  const limit = filters.limit || 100;
  
  while (hasMore && page < maxPages) {
    try {
      const requestBody = {
        ...filters,
        limit: limit,
      };
      
      // Add pagination cursor if available
      if (cursor) {
        requestBody.cursor = cursor;
        if (!requestBody.cursor) {
          requestBody.next_cursor = cursor;
        }
        if (!requestBody.next_cursor) {
          requestBody.offset = cursor;
        }
      } else if (page > 0) {
        // If no cursor but we're past page 1, try offset-based pagination
        requestBody.offset = page * limit;
      }
      
      const res = await client.post("/v2/list-calls", requestBody);
      const data = res.data;
      
      // Extract calls array and metadata from response
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
        // If response structure is unexpected, try to extract any array
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
      
      // If we got fewer results than the limit, we've reached the end
      if (callsArray.length < limit) {
        hasMore = false;
      } else if (callsArray.length === 0 && page > 0) {
        hasMore = false;
      }
      
      page++;
    } catch (err) {
      // If it's the first page, throw the error
      if (page === 0) {
        throw err;
      }
      // Otherwise, return what we have so far
      hasMore = false;
    }
  }
  
  // Check if we might have missed some calls
  if (totalCount !== null && allCalls.length < totalCount && process.env.NODE_ENV !== 'production') {
    console.warn(`⚠️  Warning: Fetched ${allCalls.length} calls but API indicates ${totalCount} total. Some calls may be missing.`);
  }
  
  // Always return an object with metadata to ensure we can track total counts
  return {
    calls: allCalls,
    total_count: totalCount !== null ? totalCount : allCalls.length,
    fetched_count: allCalls.length,
    has_more: totalCount !== null ? allCalls.length < totalCount : false
  };
}

/**
 * List all active agents
 * @returns {Promise<Array>} Array of agents
 */
async function listAgents() {
  if (!retell.apiKey) {
    throw new Error("RETELL_API_KEY is not configured");
  }
  if (!retell.baseUrl) {
    throw new Error("RETELL_BASE_URL is not configured");
  }
  
  // Try common endpoint patterns
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
      // Continue to next endpoint
      continue;
    }
  }
  
  // If all endpoints failed, return empty array (filtering will be skipped)
  if (process.env.NODE_ENV !== 'production') {
    console.warn("⚠️  Could not fetch agents list from Retell API. Tried endpoints:", endpointsToTry.join(", "));
  }
  return [];
}

export default { getCall, listCalls, listCallsPost, listAllCallsPost, listAgents };
