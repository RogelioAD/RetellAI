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
      }
      
      console.log(`📞 Fetching calls page ${page + 1}${cursor ? ` (cursor: ${cursor})` : ''}`);
      const res = await client.post("/v2/list-calls", requestBody);
      const data = res.data;
      
      // Extract calls array from response
      let callsArray = [];
      if (Array.isArray(data)) {
        callsArray = data;
        hasMore = false; // If it's a direct array, assume no pagination
      } else if (data.calls && Array.isArray(data.calls)) {
        callsArray = data.calls;
        // Check for pagination indicators
        cursor = data.next_cursor || data.cursor || data.next || null;
        hasMore = data.has_more !== false && cursor !== null && callsArray.length === limit;
      } else if (data.data && Array.isArray(data.data)) {
        callsArray = data.data;
        cursor = data.next_cursor || data.cursor || data.next || null;
        hasMore = data.has_more !== false && cursor !== null && callsArray.length === limit;
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
      
      allCalls.push(...callsArray);
      console.log(`✅ Fetched ${callsArray.length} calls (total: ${allCalls.length})`);
      
      // If we got fewer results than the limit, we've reached the end
      if (callsArray.length < limit) {
        hasMore = false;
      }
      
      // If no cursor and no has_more flag, assume we're done
      if (!cursor && hasMore) {
        hasMore = false;
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
  
  // Return in the same format as the original API response
  // Try to preserve the original structure if possible
  return allCalls;
}

export default { getCall, listCalls, listCallsPost, listAllCallsPost };
