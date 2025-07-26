import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuestAuth } from '../contexts/QuestAuthContext';

const QuestProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useQuestAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default QuestProtectedRoute;