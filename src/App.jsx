import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppShell from './components/AppShell.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import InstitutionRegister from './pages/auth/InstitutionRegister.jsx';
import Roadmap from './pages/Roadmap.jsx';

import StudentDashboard from './pages/student/Dashboard.jsx';
import StudentOpportunities from './pages/student/Opportunities.jsx';
import StudentOpportunityDetail from './pages/student/OpportunityDetail.jsx';
import StudentDocuments from './pages/student/Documents.jsx';
import StudentDeadlines from './pages/student/Deadlines.jsx';
import StudentApplications from './pages/student/Applications.jsx';
import StudentNotifications from './pages/student/Notifications.jsx';
import StudentAssistant from './pages/student/SmartAssistant.jsx';
import StudentInstitution from './pages/student/MyInstitution.jsx';
import StudentProfile from './pages/student/Profile.jsx';

import InstitutionDashboard from './pages/institution/Dashboard.jsx';
import InstitutionStudents from './pages/institution/Students.jsx';
import InstitutionDocuments from './pages/institution/Documents.jsx';
import InstitutionOpportunities from './pages/institution/Opportunities.jsx';
import InstitutionNotices from './pages/institution/Notices.jsx';
import InstitutionProfile from './pages/institution/Profile.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminStudents from './pages/admin/Students.jsx';
import AdminInstitutions from './pages/admin/Institutions.jsx';
import AdminDocuments from './pages/admin/Documents.jsx';
import AdminOpportunities from './pages/admin/Opportunities.jsx';
import AdminAnalytics from './pages/admin/Analytics.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/institution/register" element={<InstitutionRegister />} />
      <Route path="/roadmap" element={<Roadmap />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="opportunities" element={<StudentOpportunities />} />
        <Route path="opportunities/:id" element={<StudentOpportunityDetail />} />
        <Route path="documents" element={<StudentDocuments />} />
        <Route path="assistant" element={<StudentAssistant />} />
        <Route path="deadlines" element={<StudentDeadlines />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="institution" element={<StudentInstitution />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/institution"
        element={
          <ProtectedRoute role="institution">
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InstitutionDashboard />} />
        <Route path="students" element={<InstitutionStudents />} />
        <Route path="documents" element={<InstitutionDocuments />} />
        <Route path="opportunities" element={<InstitutionOpportunities />} />
        <Route path="notices" element={<InstitutionNotices />} />
        <Route path="profile" element={<InstitutionProfile />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="institutions" element={<AdminInstitutions />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="opportunities" element={<AdminOpportunities />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
