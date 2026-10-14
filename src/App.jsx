import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import AppLayout from './components/layout/AppLayout.jsx';

// Pages
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import SearchResults from './pages/SearchResults.jsx';
import MediaDetails from './pages/MediaDetails.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import SearchHistory from './pages/SearchHistory.jsx';
import SimilarityAnalyzer from './pages/SimilarityAnalyzer.jsx';
import AlgorithmLab from './pages/AlgorithmLab.jsx';
import Analytics from './pages/Analytics.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import MediaManagement from './pages/MediaManagement.jsx';
import AddMedia from './pages/AddMedia.jsx';
import DataManagement from './pages/DataManagement.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

// Route Guards
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Authenticated Application Routes wrapped in AppLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/media/:id" element={<MediaDetails />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/history" element={<SearchHistory />} />
              <Route path="/similarity" element={<SimilarityAnalyzer />} />
              <Route path="/algorithm-lab" element={<AlgorithmLab />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />

              {/* Admin-only Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/media"
                element={
                  <AdminRoute>
                    <MediaManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/add"
                element={
                  <AdminRoute>
                    <AddMedia />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/algorithms"
                element={
                  <AdminRoute>
                    <AlgorithmLab />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/data-management"
                element={
                  <AdminRoute>
                    <DataManagement />
                  </AdminRoute>
                }
              />

              {/* Catch-all Not Found Route inside Layout */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
