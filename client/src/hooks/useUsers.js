import { useState, useEffect } from "react";
import { fetchAllUsers } from "../services/api";

// Manages user data fetching and state for admin users (only fetches when enabled)
export function useUsers(token, isAdmin, enabled = false) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);
    
    fetchAllUsers(token)
      .then((data) => {
        const validUsers = (data.users || []).filter(u => u && u.id);
        setUsers(validUsers);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token, isAdmin, enabled]);

  // Refreshes the users list by fetching from the API
  const refreshUsers = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const data = await fetchAllUsers(token);
      const validUsers = (data.users || []).filter(u => u && u.id);
      setUsers(validUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refreshUsers };
}
