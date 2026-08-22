import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('obs_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('obs_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [orgId, setOrgId] = useState(() => localStorage.getItem('obs_org_id'));

  const login = ({ token, user, orgId }) => {
    localStorage.setItem('obs_token', token);
    localStorage.setItem('obs_user', JSON.stringify(user));
    localStorage.setItem('obs_org_id', orgId);
    setToken(token);
    setUser(user);
    setOrgId(orgId);
  };

  const logout = () => {
    localStorage.removeItem('obs_token');
    localStorage.removeItem('obs_user');
    localStorage.removeItem('obs_org_id');
    setToken(null);
    setUser(null);
    setOrgId(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, orgId, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};