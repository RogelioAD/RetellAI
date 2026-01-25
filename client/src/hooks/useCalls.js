import { useState, useEffect, useCallback, useRef } from "react"; // eslint-disable-line no-unused-vars
import { fetchMyCalls, fetchAllCalls } from "../services/api";
import { transformAdminCallData } from "../utils/callDataTransformers";

// Cache for request deduplication (5 second TTL)
const callCache = {
  data: null,
  timestamp: null,
  key: null,
  TTL: 5000, // 5 seconds
};

// Fetches and manages call data with automatic refresh on tab visibility change
export function useCalls(token, isAdmin) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const fetchInProgressRef = useRef(false);

  // Fetches calls data (user's calls or all calls for admin) with caching and deduplication
  const fetchCallsData = useCallback(async () => {
    // Prevent duplicate concurrent requests
    if (fetchInProgressRef.current) {
      return;
    }

    const cacheKey = `${token}_${isAdmin}`;
    const now = Date.now();

    // Check cache
    if (
      callCache.key === cacheKey &&
      callCache.data !== null &&
      callCache.timestamp !== null &&
      now - callCache.timestamp < callCache.TTL
    ) {
      // Use cached data
      if (isAdmin) {
        setCalls(callCache.data);
        setTotalCount(callCache.data.length);
      } else {
        setCalls(callCache.data);
        setTotalCount(Array.isArray(callCache.data) ? callCache.data.length : null);
      }
      setLoading(false);
      return;
    }

    fetchInProgressRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = isAdmin 
        ? await fetchAllCalls(token, { fetchAll: true }) 
        : await fetchMyCalls(token);
      
      let processedData;
      if (isAdmin) {
        processedData = transformAdminCallData(data);
        setCalls(processedData);
        setTotalCount(processedData.length);
      } else {
        processedData = data;
        setCalls(data);
        setTotalCount(Array.isArray(data) ? data.length : null);
      }

      // Update cache
      callCache.data = processedData;
      callCache.timestamp = now;
      callCache.key = cacheKey;

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      fetchInProgressRef.current = false;
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
