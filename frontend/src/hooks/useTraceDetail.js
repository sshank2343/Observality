import { useState, useEffect, useCallback } from 'react';
import { getTraceRequest, runEvalRequest } from '../api/traces.api';

export const useTraceDetail = (traceId, projectId) => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const fetchTrace = useCallback(async () => {
    if (!traceId || !projectId) return;
    setLoading(true);
    try {
      const data = await getTraceRequest({ traceId, projectId });
      setTrace(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load trace');
    } finally {
      setLoading(false);
    }
  }, [traceId, projectId]);

  useEffect(() => {
    fetchTrace();
  }, [fetchTrace]);

  const runEval = async () => {
    setEvaluating(true);
    try {
      const updated = await runEvalRequest({ traceId, projectId });
      setTrace(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  return { trace, loading, error, evaluating, runEval };
};