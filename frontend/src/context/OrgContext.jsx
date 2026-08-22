import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

// Tracks which project is currently selected in the dashboard —
// since an org can have multiple projects (per our backend design).
const OrgContext = createContext(null);

export const OrgProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => localStorage.getItem('obs_selected_project') || null
  );

  const selectProject = (projectId) => {
    localStorage.setItem('obs_selected_project', projectId);
    setSelectedProjectId(projectId);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedProjectId(null);
      localStorage.removeItem('obs_selected_project');
    }
  }, [isAuthenticated]);

  return (
    <OrgContext.Provider value={{ selectedProjectId, selectProject }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrgContext = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrgContext must be used within OrgProvider');
  return ctx;
};