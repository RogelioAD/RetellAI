import { useState, useEffect, useRef } from "react";
import { fetchAllUsers } from "../services/api";

// Cache for request deduplication (5 second TTL)
const userCache = {
  data: null,
  timestamp: null,
  key: null,
  TTL: 5000, // 5 seconds
};

// Manages user data fetching and state for admin users (only fetches when enabled)
export function useUsers(token, isAdmin, enabled = false) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInProgressRef = useRef(false);

  useEffect(() => {
    if (!isAdmin || !enabled) {
      return;
    }

    // Prevent duplicate concurrent requests
    if (fetchInProgressRef.current) {
      return;
    }

    const cacheKey = `${token}_users`;
    const now = Date.now();

    // Check cache
    if (
      userCache.key === cacheKey &&
      userCache.data !== null &&
      userCache.timestamp !== null &&
      now - userCache.timestamp < userCache.TTL
    ) {
      const validUsers = (userCache.data || []).filter(u => u && u.id);
      setUsers(validUsers);
      setLoading(false);
      return;
    }

    fetchInProgressRef.current = true;
    setLoading(true);
    setError(null);
    
    fetchAllUsers(token)
      .then((data) => {
        const validUsers = (data.users || []).filter(u => u && u.id);
        setUsers(validUsers);
        
        // Update cache
        userCache.data = data.users || [];
        userCache.timestamp = now;
        userCache.key = cacheKey;
        
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      })
      .finally(() => {
        fetchInProgressRef.current = false;
      });
  }, [token, isAdmin, enabled]);

  // Refreshes the users list by fetching from the API
  const refreshUsers = async () => {
    if (!isAdmin || fetchInProgressRef.current) return;
    
    fetchInProgressRef.current = true;
    setLoading(true);
    try {
      const data = await fetchAllUsers(token);
      const validUsers = (data.users || []).filter(u => u && u.id);
      setUsers(validUsers);
      
      // Update cache
      const now = Date.now();
      userCache.data = data.users || [];
      userCache.timestamp = now;
      userCache.key = `${token}_users`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  };

  return { users, loading, error, refreshUsers };
}
