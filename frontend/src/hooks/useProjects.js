import { useState, useEffect, useCallback } from 'react';
import { listProjectsRequest, createProjectRequest } from '../api/projects.api';
import { useOrgContext } from '../context/OrgContext';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedProjectId, selectProject } = useOrgContext();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listProjectsRequest();
      setProjects(data);

      // Auto-select the first project if none is selected yet
      if (!selectedProjectId && data.length > 0) {
        selectProject(data[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, selectProject]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name) => {
    const project = await createProjectRequest({ name });
    setProjects((prev) => [project, ...prev]);
    selectProject(project.id);
    return project;
  };

  return { projects, loading, error, selectedProjectId, selectProject, createProject, refetch: fetchProjects };
};