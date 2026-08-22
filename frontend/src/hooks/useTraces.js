import { useState, useEffect, useCallback } from 'react';
import { listTracesRequest } from '../api/traces.api';

export const useTraces = (projectId, { page = 1, limit = 25, status } = {}) => {
  const [traces, setTraces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTraces = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listTracesRequest({ projectId, page, limit, status });
      setTraces(data.traces);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load traces');
    } finally {
      setLoading(false);
    }
  }, [projectId, page, limit, status]);

  useEffect(() => {
    fetchTraces();
  }, [fetchTraces]);

  return { traces, pagination, loading, error, refetch: fetchTraces };
};