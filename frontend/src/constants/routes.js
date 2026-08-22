// Centralized route paths — avoids hardcoded strings scattered across the app
export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  TRACES: '/traces',
  TRACE_DETAIL: '/traces/:traceId',
  ALERTS: '/alerts',
  SETTINGS_API_KEYS: '/settings/api-keys',
  SETTINGS_TEAM: '/settings/team',
  SETTINGS_PROJECT: '/settings/project',
};

// Helper for dynamic routes
export const traceDetailPath = (traceId) => `/traces/${traceId}`;