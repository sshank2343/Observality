import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from './useAuth';
import { AuthProvider } from '../context/AuthContext';
import * as authApi from '../api/auth.api';

const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('useAuth', () => {
  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets error state when login fails', async () => {
    vi.spyOn(authApi, 'loginRequest').mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'x@x.com', password: 'wrong' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid credentials');
    });
  });
});