import axiosClient from './axiosClient';

export const createAlertRuleRequest = async ({ projectId, ...ruleData }) => {
  const { data } = await axiosClient.post('/api/alerts', ruleData, {
    params: { projectId },
  });
  return data;
};

export const listAlertRulesRequest = async ({ projectId }) => {
  const { data } = await axiosClient.get('/api/alerts', {
    params: { projectId },
  });
  return data;
};

export const deleteAlertRuleRequest = async ({ ruleId, projectId }) => {
  const { data } = await axiosClient.delete(`/api/alerts/${ruleId}`, {
    params: { projectId },
  });
  return data;
};