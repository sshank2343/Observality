import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders without crashing and redirects unauthenticated users to login', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Unauthenticated users hitting "/" get redirected to /login.
    // Use getByRole to target the heading specifically, since "Log in"
    // also appears as the submit button's text.
    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  });
});