import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { AdminLayout, DashboardLayout } from './layouts';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCinemasPage from './pages/AdminCinemasPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components';
import { AuthProvider } from './contexts';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface-container-high)',
              color: 'var(--color-on-surface)',
              border: '1px solid var(--color-outline-variant)',
            },
          }}
        />
        <Routes>
          <Route path="/"       element={<HomePage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="cinemas" element={<AdminCinemasPage />} />
              {/* Add other admin sub-routes here later (e.g. movies) */}
            </Route>
          </Route>

          {/* User Routes - Protected */}
          <Route path="/my-cine" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
