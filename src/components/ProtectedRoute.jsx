import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ role, children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role) {
    const home = { student: '/student/dashboard', institution: '/institution/dashboard', admin: '/admin/dashboard' }[session.role];
    return <Navigate to={home} replace />;
  }
  return children;
}
