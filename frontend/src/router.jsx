import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { useAuthContext } from './context/AuthContext';

import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import TraceList from './pages/Traces/TraceList';
import TraceDetail from './pages/Traces/TraceDetail';
import AlertList from './pages/Alerts/AlertList';
import ApiKeys from './pages/Settings/ApiKeys';
import NotFound from './pages/NotFound';
import PageLayout from './components/layout/PageLayout';

// Blocks access to dashboard routes if not logged in
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="traces" element={<TraceList />} />
        <Route path="traces/:traceId" element={<TraceDetail />} />
        <Route path="alerts" element={<AlertList />} />
        <Route path="settings/api-keys" element={<ApiKeys />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;