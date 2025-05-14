import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (adminOnly && user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
