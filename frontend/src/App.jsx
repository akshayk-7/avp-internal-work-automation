import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Placeholder components for dashboard views
const CEODashboard = () => <div className="p-4"><h1>CEO Dashboard</h1><p>Welcome, CEO. Here is your overview.</p></div>;
const AODashboard = () => <div className="p-4"><h1>AO Dashboard</h1><p>Welcome, AO. Manage your ranges here.</p></div>;
const OADashboard = () => <div className="p-4"><h1>OA Dashboard</h1><p>Welcome, OA. Here are your assigned tasks.</p></div>;

// Placeholder components for other routes

const ClientList = () => <div className="p-4"><h1>Client Worklist</h1></div>;
const ImportPage = () => <div className="p-4"><h1>Import Data</h1></div>;

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Helper to redirect based on role
  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.user_role === 'CEO') return '/dashboard/ceo';
    if (user.user_role === 'AO') return '/dashboard/ao';
    if (user.user_role === 'OA') return '/dashboard/oa';
    return '/dashboard';
  };

  return (
    <Routes>
      {/* Public Route: Landing Page */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <LandingPage />
      } />

      <Route path="/login" element={
        isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Login />
      } />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Nested Routes based on Layout */}
          <Route path="ceo" element={<CEODashboard />} />
          <Route path="ao" element={<AODashboard />} />
          <Route path="oa" element={<OADashboard />} />

          {/* Common Protected Routes */}
          <Route path="clients" element={<ClientList />} />
          <Route path="import" element={<ImportPage />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
