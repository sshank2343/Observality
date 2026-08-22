import axiosClient from './axiosClient';

export const getSummaryMetricsRequest = async ({ projectId, since }) => {
  const { data } = await axiosClient.get('/api/metrics/summary', {
    params: { projectId, since },
  });
  return data;
};

export const getTimeSeriesMetricsRequest = async ({ projectId, since }) => {
  const { data } = await axiosClient.get('/api/metrics/timeseries', {
    params: { projectId, since },
  });
  return data;
};