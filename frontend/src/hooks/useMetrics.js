import { useState, useEffect, useCallback } from 'react';
import { getSummaryMetricsRequest, getTimeSeriesMetricsRequest } from '../api/metrics.api';

export const useMetrics = (projectId, since) => {
  const [summary, setSummary] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const [summaryData, timeseriesData] = await Promise.all([
        getSummaryMetricsRequest({ projectId, since }),
        getTimeSeriesMetricsRequest({ projectId, since }),
      ]);
      setSummary(summaryData);
      setTimeseries(timeseriesData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, [projectId, since]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { summary, timeseries, loading, error, refetch: fetchMetrics };
};