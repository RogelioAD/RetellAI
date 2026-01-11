import { useState, useEffect, useCallback } from "react";
import { fetchMyCalls, fetchAllCalls } from "../services/api";
import { transformAdminCallData } from "../utils/callDataTransformers";

// Fetches and manages call data with automatic refresh on tab visibility change
export function useCalls(token, isAdmin) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  // Fetches calls data (user's calls or all calls for admin)
  const fetchCallsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = isAdmin 
        ? await fetchAllCalls(token, { fetchAll: true }) 
        : await fetchMyCalls(token);
      
      if (isAdmin) {
        const transformedCalls = transformAdminCallData(data);
        setCalls(transformedCalls);
        setTotalCount(transformedCalls.length);
      } else {
        setCalls(data);
        setTotalCount(Array.isArray(data) ? data.length : null);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    let mounted = true;
    
    fetchCallsData().then(() => {
      if (!mounted) return;
    });
    
    // Refresh when the page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && mounted) {
        fetchCallsData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCallsData]);

  return { calls, loading, error, totalCount, refreshCalls: fetchCallsData };
}
