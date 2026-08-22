import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { registerRequest, loginRequest } from '../api/auth.api';
import { ROUTES } from '../constants/routes';

export const useAuth = () => {
  const { login: setAuthState, logout: clearAuthState, user, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const register = async ({ email, password, orgName }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerRequest({ email, password, orgName });
      setAuthState(result);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginRequest({ email, password });
      setAuthState(result);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthState();
    navigate(ROUTES.LOGIN);
  };

  return { register, login, logout, loading, error, user, isAuthenticated };
};