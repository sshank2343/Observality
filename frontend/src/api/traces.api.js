import axiosClient from './axiosClient';

export const listTracesRequest = async ({ projectId, page = 1, limit = 25, status }) => {
  const { data } = await axiosClient.get('/api/traces', {
    params: { projectId, page, limit, status },
  });
  return data;
};

export const getTraceRequest = async ({ traceId, projectId }) => {
  const { data } = await axiosClient.get(`/api/traces/${traceId}`, {
    params: { projectId },
  });
  return data;
};

export const runEvalRequest = async ({ traceId, projectId }) => {
  const { data } = await axiosClient.post(`/api/evals/${traceId}`, null, {
    params: { projectId },
  });
  return data;
};