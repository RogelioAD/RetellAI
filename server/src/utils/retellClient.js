// Minimal Retell client using axios - adapt to actual Retell endpoints
import axios from "axios";
import { retell } from "../config.js";

if (!retell.apiKey) {
  console.warn("⚠️  RETELL_API_KEY is not set in environment variables");
}

if (!retell.baseUrl) {
  console.warn("⚠️  RETELL_BASE_URL is not set in environment variables");
}

console.log(`🔗 Retell API Base URL: ${retell.baseUrl}`);

const client = axios.create({
  baseURL: retell.baseUrl,
  headers: {
    Authorization: `Bearer ${retell.apiKey || ""}`,
    "Content-Type": "application/json",
  },
});

async function getCall(callId) {
  if (!callId) {
    throw new Error("Call ID is required");
  }
  try {
    const res = await client.get(`/calls/${callId}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching call ${callId}:`, err.response?.data || err.message);
    throw err;
  }
}

async function listCalls(query = {}) {
  // If the retell API supports filtering via metadata, prefer that.
  try {
    const res = await client.get("/calls", { params: query });
    return res.data;
  } catch (err) {
    console.error("Error listing calls (GET):", err.response?.data || err.message);
    throw err;
  }
}

async function listCallsPost(filters = {}) {
  // POST /v2/list-calls endpoint
  if (!retell.apiKey) {
    throw new Error("RETELL_API_KEY is not configured");
  }
  if (!retell.baseUrl) {
    throw new Error("RETELL_BASE_URL is not configured");
  }
  try {
    const url = `${retell.baseUrl}/v2/list-calls`;
    console.log(`📞 Calling Retell API: POST ${url}`);
    const res = await client.post("/v2/list-calls", filters);
    return res.data;
  } catch (err) {
    console.error("Error listing calls (POST):", {
      message: err.message,
      code: err.code,
      url: `${retell.baseUrl}/v2/list-calls`,
      response: err.response?.data
    });
    throw err;
  }
}

/**
 * Fetch all calls with pagination support
 * Handles pagination automatically by checking for next_cursor, has_more, or similar pagination fields
 */
async function listAllCallsPost(filters = {}) {
  const allCalls = [];
  let hasMore = true;
  let cursor = null;
  let page = 0;
  let totalCount = null; // Store total count from API if available
  const maxPages = 100; // Safety limit to prevent infinite loops
  
  // Set a reasonable limit per page if not specified (Retell API typically supports up to 100)
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
        // Some APIs use different field names
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
      
      console.log(`📞 Fetching calls page ${page + 1}${cursor ? ` (cursor: ${cursor})` : ''}${page > 0 ? ` (offset: ${page * limit})` : ''}`);
      const res = await client.post("/v2/list-calls", requestBody);
      const data = res.data;
      
      // Extract calls array and metadata from response
      let callsArray = [];
      let pageTotalCount = null;
      if (Array.isArray(data)) {
        callsArray = data;
        hasMore = false; // If it's a direct array, assume no pagination
      } else if (data.calls && Array.isArray(data.calls)) {
        callsArray = data.calls;
        // Extract total count if available (only from first page)
        pageTotalCount = data.total_count !== undefined ? data.total_count : 
                    data.totalCount !== undefined ? data.totalCount :
                    data.total !== undefined ? data.total : null;
        // Only update totalCount if we don't have one yet (preserve from first page)
        if (totalCount === null && pageTotalCount !== null) {
          totalCount = pageTotalCount;
        }
        // Check for pagination indicators - prioritize explicit pagination flags
        const explicitHasMore = data.has_more !== undefined ? data.has_more : 
                                 data.hasMore !== undefined ? data.hasMore : null;
        cursor = data.next_cursor || data.cursor || data.next || null;
        
        // If explicit has_more flag exists, use it; otherwise, check if we got exactly the limit
        if (explicitHasMore !== null) {
          hasMore = explicitHasMore === true;
        } else {
          // If we got exactly the limit, assume there might be more pages
          // This handles cases where API doesn't provide explicit pagination flags
          hasMore = callsArray.length === limit;
        }
      } else if (data.data && Array.isArray(data.data)) {
        callsArray = data.data;
        pageTotalCount = data.total_count !== undefined ? data.total_count : 
                    data.totalCount !== undefined ? data.totalCount :
                    data.total !== undefined ? data.total : null;
        // Only update totalCount if we don't have one yet (preserve from first page)
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
        hasMore = false; // Unknown structure, assume no more pages
      }
      
      // Store total count from first page if available
      if (page === 0 && totalCount !== null) {
        console.log(`📊 Total calls available: ${totalCount}`);
      }
      
      allCalls.push(...callsArray);
      console.log(`✅ Fetched ${callsArray.length} calls (total: ${allCalls.length})`);
      console.log(`   Pagination state: hasMore=${hasMore}, cursor=${cursor ? 'present' : 'null'}, has_more=${data.has_more !== undefined ? data.has_more : 'not provided'}`);
      
      // If we got fewer results than the limit, we've reached the end
      if (callsArray.length < limit) {
        console.log(`   Stopping pagination: received ${callsArray.length} calls (less than limit of ${limit})`);
        hasMore = false;
      } else if (callsArray.length === 0 && page > 0) {
        // If we got 0 results on a subsequent page, we've reached the end
        console.log(`   Stopping pagination: received 0 calls on page ${page + 1}`);
        hasMore = false;
      }
      
      // Additional check: if we don't have a cursor and we've tried offset-based pagination,
      // and we get the same number of calls, we might be stuck. Try to continue anyway if we got exactly the limit.
      if (!cursor && page > 0 && callsArray.length === limit) {
        // Continue trying with offset-based pagination
        console.log(`   No cursor available, using offset-based pagination (offset: ${page * limit})`);
      }
      
      page++;
    } catch (err) {
      console.error(`Error fetching page ${page + 1}:`, {
        message: err.message,
        response: err.response?.data
      });
      // If it's the first page, throw the error
      if (page === 0) {
        throw err;
      }
      // Otherwise, return what we have so far
      hasMore = false;
    }
  }
  
  console.log(`✅ Total calls fetched: ${allCalls.length} across ${page} page(s)`);
  
  // Check if we might have missed some calls
  // If totalCount was provided and we fetched fewer, log a warning
  if (totalCount !== null && allCalls.length < totalCount) {
    console.log(`⚠️  Warning: Fetched ${allCalls.length} calls but API indicates ${totalCount} total. Some calls may be missing.`);
  }
  
  // Always return an object with metadata to ensure we can track total counts
  // Use fetched_count as total_count if API didn't provide it (since we fetched all pages)
  return {
    calls: allCalls,
    total_count: totalCount !== null ? totalCount : allCalls.length,
    fetched_count: allCalls.length,
    has_more: totalCount !== null ? allCalls.length < totalCount : false
  };
}

async function listAgents() {
  // GET endpoint to get all active agents
  // Try multiple endpoint patterns since Retell API structure may vary
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
        console.log(`✅ Found ${agents.length} agents from ${endpoint}`);
        return agents;
      }
    } catch (err) {
      // Continue to next endpoint
      continue;
    }
  }
  
  // If all endpoints failed, return empty array (filtering will be skipped)
  console.warn("⚠️  Could not fetch agents list from Retell API. Tried endpoints:", endpointsToTry.join(", "));
  return [];
}

export default { getCall, listCalls, listCallsPost, listAllCallsPost, listAgents };
