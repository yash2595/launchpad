import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { setAuthSession, setAuthLoading } from './store/authSlice';
import { PrivateRoute, PublicRoute } from './components/Layout/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import InternshipsPage from './pages/InternshipsPage';
import LearningPage from './pages/LearningPage';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/UI/Toast';
import InternshipModal from './components/Internships/InternshipModal';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check current session on application mount
    const initializeAuth = async () => {
      dispatch(setAuthLoading(true));
      try {
        const { data: { session } } = await supabase.auth.getSession();
        dispatch(setAuthSession(session));
      } catch (error) {
        dispatch(setAuthLoading(false));
      }
    };

    initializeAuth();

    // Listen for auth state changes (login, logout, token refreshes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setAuthSession(session));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root path to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public-only authentication routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<VerifyPage />} />
        </Route>

        {/* Protected workspace routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/learning" element={<LearningPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Overlays */}
      <Toast />
      <InternshipModal />
    </BrowserRouter>
  );
}
