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
  const [totalCount, setTotalCount] = useState(null);

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
        // Extract total count from response if available, otherwise use fetched count
        // This ensures we show the actual total even if API doesn't provide total_count
        // Since we're fetching all pages with pagination, fetched_count should equal total if no total_count provided
        const extractedTotalCount = data.total_count !== undefined 
          ? data.total_count 
          : (data.fetched_count !== undefined ? data.fetched_count : transformedCalls.length);
        setTotalCount(extractedTotalCount);
        console.log(`📊 Total calls: ${extractedTotalCount} (from API: ${data.total_count}, fetched: ${data.fetched_count || transformedCalls.length})`);
      } else {
        setCalls(data);
        // For non-admin, we don't have pagination info, so use array length
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

