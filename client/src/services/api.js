const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";
export async function login({ username, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    let errorMessage = "Login failed";
    try {
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      errorMessage = "Login failed";
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function fetchMyCalls(token) {
  const res = await fetch(`${API_BASE}/api/my-calls`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let errorMessage = "Failed to fetch calls";
    try {
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      errorMessage = "Failed to fetch calls";
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function fetchAllCalls(token, filters = {}) {
  const res = await fetch(`${API_BASE}/api/list-calls`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(filters),
  });
  if (!res.ok) {
    let errorMessage = "Failed to fetch calls";
    try {
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      errorMessage = "Failed to fetch calls";
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function changePassword(token, { currentPassword, newPassword }) {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: "PUT",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    let errorMessage = "Failed to change password";
    try {
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      errorMessage = "Failed to change password";
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function fetchAllUsers(token) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let errorMessage = "Failed to fetch users";
    try {
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      errorMessage = "Failed to fetch users";
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function createCustomer(token, { username, password, email }) {
  const res = await fetch(`${API_BASE}/admin/create-customer`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ username, password, email }),
  });
  if (!res.ok) {
    let errorMessage = "Failed to create customer";
    try {
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      errorMessage = "Failed to create customer";
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function deleteUser(token, userId) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: "DELETE",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" 
    },
  });
  if (!res.ok) {
    let errorMessage = "Failed to delete user";
    try {
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      errorMessage = "Failed to delete user";
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

