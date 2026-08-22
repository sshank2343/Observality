import axiosClient from './axiosClient';

export const createProjectRequest = async ({ name }) => {
  const { data } = await axiosClient.post('/api/projects', { name });
  return data;
};

export const listProjectsRequest = async () => {
  const { data } = await axiosClient.get('/api/projects');
  return data;
};

export const createApiKeyRequest = async ({ projectId }) => {
  const { data } = await axiosClient.post(`/api/projects/${projectId}/api-keys`);
  return data;
};

export const revokeApiKeyRequest = async ({ keyId }) => {
  const { data } = await axiosClient.delete(`/api/projects/api-keys/${keyId}`);
  return data;
};