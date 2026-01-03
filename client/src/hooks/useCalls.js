import { useState, useEffect, useCallback } from "react";
import { fetchMyCalls, fetchAllCalls } from "../services/api";
import { transformAdminCallData } from "../utils/callDataTransformers";

/**
 * Custom hook for fetching and managing calls
 */
export function useCalls(token, isAdmin) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCallsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = isAdmin 
        ? await fetchAllCalls(token, {}) 
        : await fetchMyCalls(token);
      
      if (isAdmin) {
        const transformedCalls = transformAdminCallData(data);
        setCalls(transformedCalls);
      } else {
        setCalls(data);
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
    
    return () => {
      mounted = false;
    };
  }, [fetchCallsData]);

  return { calls, loading, error, refreshCalls: fetchCallsData };
}

