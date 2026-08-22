import { useState } from 'react';
import { createApiKeyRequest, revokeApiKeyRequest } from '../api/projects.api';
import { useProjects } from './useProjects';

export const useApiKeys = () => {
  const { projects, selectedProjectId, refetch } = useProjects();
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState(null); // holds the raw key right after creation — shown once
  const [error, setError] = useState(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const apiKeys = selectedProject?.apiKeys || [];

  const generateKey = async () => {
    if (!selectedProjectId) return;
    setCreating(true);
    setError(null);
    try {
      const result = await createApiKeyRequest({ projectId: selectedProjectId });
      setNewKey(result); // { id, rawKey, keyPrefix, createdAt }
      await refetch(); // refresh the project list so the new key appears in apiKeys
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate API key');
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (keyId) => {
    try {
      await revokeApiKeyRequest({ keyId });
      await refetch();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to revoke key');
    }
  };

  const dismissNewKey = () => setNewKey(null);

  return { apiKeys, selectedProject, creating, newKey, error, generateKey, revokeKey, dismissNewKey };
};