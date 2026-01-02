import { useState, useEffect } from "react";
import { fetchMyCalls, fetchAllCalls } from "../services/api";
import { transformAdminCallData } from "../utils/callDataTransformers";

/**
 * Custom hook for fetching and managing calls
 */
export function useCalls(token, isAdmin) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchCalls = isAdmin 
      ? fetchAllCalls(token, {}) 
      : fetchMyCalls(token);

    fetchCalls
      .then((data) => {
        if (!mounted) return;
        
        if (isAdmin) {
          const transformedCalls = transformAdminCallData(data);
          setCalls(transformedCalls);
        } else {
          setCalls(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });
    
    return () => {
      mounted = false;
    };
  }, [token, isAdmin]);

  return { calls, loading, error };
}

