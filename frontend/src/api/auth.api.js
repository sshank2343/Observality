import axiosClient from './axiosClient';

export const registerRequest = async ({ email, password, orgName }) => {
  const { data } = await axiosClient.post('/api/auth/register', { email, password, orgName });
  return data;
};

export const loginRequest = async ({ email, password }) => {
  const { data } = await axiosClient.post('/api/auth/login', { email, password });
  return data;
};