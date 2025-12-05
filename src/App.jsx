// Main App Component
import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from './utils/axios';
import { ToastProvider } from './contexts/ToastContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Spinner from './components/Spinner';

// Lazy load components for better performance
const Login = lazy(() => import('./components/Login.jsx'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./components/ResetPassword.jsx'));
const Support = lazy(() => import('./components/Support.jsx'));
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const DataCapture = lazy(() => import('./components/DataCapture.jsx'));
const Records = lazy(() => import('./components/Records.jsx'));
const Reports = lazy(() => import('./components/Reports.jsx'));
const Users = lazy(() => import('./components/Users.jsx'));
const DocumentViewer = lazy(() => import('./components/DocumentViewer.jsx'));
const Settings = lazy(() => import('./components/Settings.jsx'));
const Profile = lazy(() => import('./components/Profile.jsx'));
const Layout = lazy(() => import('./components/Layout.jsx'));

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in axios headers
      axios.defaults.headers.common['x-auth-token'] = token;

      axios.get('/api/auth/me')
        .then(res => {
          if (res.data._id) setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  if (loading) {
    return <Spinner minHeight="100vh" text="Loading application..." />;
  }

  return (
    <ToastProvider>
      <SettingsProvider>
        <Router>
          <Suspense fallback={<Spinner minHeight="100vh" text="Loading..." />}>
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
              <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
              <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
              <Route path="/support" element={<Support />} />
              <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
                {/* Dashboard - Admin and Viewer only */}
                <Route index element={
                  user?.role === 'admin' || user?.role === 'viewer'
                    ? <Dashboard />
                    : <Navigate to="/records" />
                } />

                {/* Data Capture - Admin and Data Entry only */}
                <Route path="data-capture" element={
                  user?.role === 'admin' || user?.role === 'data_entry'
                    ? <DataCapture />
                    : <Navigate to="/records" />
                } />

                {/* Records - All roles */}
                <Route path="records" element={<Records />} />

                {/* Reports - Admin and Viewer only */}
                <Route path="reports" element={
                  user?.role === 'admin' || user?.role === 'viewer'
                    ? <Reports />
                    : <Navigate to="/records" />
                } />

                {/* Users - Admin only */}
                <Route path="users" element={
                  user?.role === 'admin'
                    ? <Users />
                    : <Navigate to="/records" />
                } />



                {/* Settings - All roles */}
                <Route path="settings" element={<Settings />} />

                {/* Profile - All roles */}
                <Route path="profile" element={<Profile />} />

                {/* Help - All roles */}
                <Route path="help" element={
                  <div style={{ padding: '20px' }}>
                    <h2>Help & Support</h2>
                    <p>Contact support at support@burial-permit.com</p>
                  </div>
                } />

                {/* Document Viewer - All roles */}
                <Route path="document/:id" element={<DocumentViewer />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </SettingsProvider>
    </ToastProvider>
  );
}

export default App;
