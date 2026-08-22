import { useState, useEffect, useCallback } from 'react';
import { listAlertRulesRequest, createAlertRuleRequest, deleteAlertRuleRequest } from '../api/alerts.api';

export const useAlerts = (projectId) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRules = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await listAlertRulesRequest({ projectId });
      setRules(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load alert rules');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = async (ruleData) => {
    const rule = await createAlertRuleRequest({ projectId, ...ruleData });
    setRules((prev) => [rule, ...prev]);
  };

  const deleteRule = async (ruleId) => {
    await deleteAlertRuleRequest({ ruleId, projectId });
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  return { rules, loading, error, createRule, deleteRule };
};