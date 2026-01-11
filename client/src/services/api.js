const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

// Extracts error message from API response, attempting JSON parse first, then falling back to text
async function extractErrorMessage(res, defaultMessage) {
  try {
    const text = await res.text();
    try {
      const errorData = JSON.parse(text);
      return errorData.error || defaultMessage;
    } catch {
      return text || defaultMessage;
    }
  } catch {
    return defaultMessage;
  }
}

// Handles fetch request with standardized error handling and JSON response parsing
async function fetchWithErrorHandling(url, options, defaultErrorMessage) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorMessage = await extractErrorMessage(res, defaultErrorMessage);
    throw new Error(errorMessage);
  }
  return res.json();
}

// Authenticates user with username and password, returns JWT token and user data
export async function login({ username, password }) {
  return fetchWithErrorHandling(
    `${API_BASE}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    },
    "Login failed"
  );
}

// Fetches all calls for the authenticated user
export async function fetchMyCalls(token) {
  return fetchWithErrorHandling(
    `${API_BASE}/api/my-calls`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    "Failed to fetch calls"
  );
}

// Fetches all calls from Retell API with optional filters (admin only)
export async function fetchAllCalls(token, filters = {}) {
  return fetchWithErrorHandling(
    `${API_BASE}/api/list-calls`,
    {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(filters),
    },
    "Failed to fetch calls"
  );
}

// Changes the password for the authenticated user
export async function changePassword(token, { currentPassword, newPassword }) {
  return fetchWithErrorHandling(
    `${API_BASE}/auth/change-password`,
    {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    },
    "Failed to change password"
  );
}

// Fetches all users (admin only)
export async function fetchAllUsers(token) {
  return fetchWithErrorHandling(
    `${API_BASE}/admin/users`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    "Failed to fetch users"
  );
}

// Refreshes agent names from RetellAI and re-links calls (admin only)
export async function refreshAgentNames(token) {
  return fetchWithErrorHandling(
    `${API_BASE}/admin/refresh-agent-names`,
    {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
    },
    "Failed to refresh agent names"
  );
}

// Creates a new customer user (admin only)
export async function createCustomer(token, { username, password, email }) {
  return fetchWithErrorHandling(
    `${API_BASE}/admin/create-customer`,
    {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ username, password, email }),
    },
    "Failed to create customer"
  );
}

// Deletes a user and all associated data (admin only)
export async function deleteUser(token, userId) {
  return fetchWithErrorHandling(
    `${API_BASE}/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
    },
    "Failed to delete user"
  );
}
