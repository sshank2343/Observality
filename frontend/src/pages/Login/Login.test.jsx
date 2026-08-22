import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../../context/AuthContext';
import * as authApi from '../../api/auth.api';

const renderLogin = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

describe('Login page', () => {
  it('renders email and password fields', () => {
    renderLogin();
    // Target the heading specifically — "Log in" also appears on the submit button
    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
    expect(document.querySelectorAll('input').length).toBe(2);
  });

  it('shows an error message on failed login', async () => {
    vi.spyOn(authApi, 'loginRequest').mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });

    renderLogin();

    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'wrong@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'wrongpass' } });

    const form = document.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('calls loginRequest with entered credentials', async () => {
    const mockLogin = vi.spyOn(authApi, 'loginRequest').mockResolvedValue({
      token: 'fake-token',
      user: { id: '1', email: 'test@example.com', role: 'admin' },
      orgId: 'org-1',
    });

    renderLogin();

    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'password123' } });

    const form = document.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});