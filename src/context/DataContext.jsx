import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadJSON, saveJSON, clearAllOpportuneData, KEYS } from '../utils/storage.js';
import { uid } from '../utils/format.js';
import {
  INSTITUTIONS,
  OPPORTUNITIES,
  DEMO_STUDENT_PROFILE,
  DEMO_PENDING_STUDENT,
  DEMO_DOCUMENTS,
  DEMO_DEADLINES,
  DEMO_NOTIFICATIONS,
  DEMO_APPLICATIONS,
} from '../data/seedData.js';

const DataContext = createContext(null);

function seedIfNeeded() {
  if (loadJSON(KEYS.SEEDED, false)) return;
  saveJSON(KEYS.STUDENTS, [DEMO_STUDENT_PROFILE, DEMO_PENDING_STUDENT]);
  saveJSON(KEYS.INSTITUTIONS, INSTITUTIONS);
  saveJSON(KEYS.OPPORTUNITIES, OPPORTUNITIES);
  saveJSON(
    KEYS.DOCUMENTS,
    DEMO_DOCUMENTS.map((d) => ({ ...d, studentId: 'stu_1' }))
  );
  saveJSON(
    KEYS.DEADLINES,
    DEMO_DEADLINES.map((d) => ({ ...d, studentId: 'stu_1' }))
  );
  saveJSON(
    KEYS.NOTIFICATIONS,
    DEMO_NOTIFICATIONS.map((n) => ({ ...n, studentId: 'stu_1' }))
  );
  saveJSON(
    KEYS.APPLICATIONS,
    DEMO_APPLICATIONS.map((a) => ({ ...a, studentId: 'stu_1' }))
  );
  saveJSON(KEYS.SEEDED, true);
}

export function DataProvider({ children }) {
  seedIfNeeded();

  const [students, setStudents] = useState(() => loadJSON(KEYS.STUDENTS, []));
  const [institutions, setInstitutions] = useState(() => loadJSON(KEYS.INSTITUTIONS, []));
  const [opportunities, setOpportunities] = useState(() => loadJSON(KEYS.OPPORTUNITIES, []));
  const [documents, setDocuments] = useState(() => loadJSON(KEYS.DOCUMENTS, []));
  const [deadlines, setDeadlines] = useState(() => loadJSON(KEYS.DEADLINES, []));
  const [notifications, setNotifications] = useState(() => loadJSON(KEYS.NOTIFICATIONS, []));
  const [applications, setApplications] = useState(() => loadJSON(KEYS.APPLICATIONS, []));

  useEffect(() => saveJSON(KEYS.STUDENTS, students), [students]);
  useEffect(() => saveJSON(KEYS.INSTITUTIONS, institutions), [institutions]);
  useEffect(() => saveJSON(KEYS.OPPORTUNITIES, opportunities), [opportunities]);
  useEffect(() => saveJSON(KEYS.DOCUMENTS, documents), [documents]);
  useEffect(() => saveJSON(KEYS.DEADLINES, deadlines), [deadlines]);
  useEffect(() => saveJSON(KEYS.NOTIFICATIONS, notifications), [notifications]);
  useEffect(() => saveJSON(KEYS.APPLICATIONS, applications), [applications]);

  const addNotification = useCallback((studentId, text, icon = 'sparkles') => {
    setNotifications((prev) => [
      { id: uid('notif'), studentId, text, icon, createdAt: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  const addStudent = useCallback((profile) => {
    const newStudent = { id: uid('stu'), profileComplete: true, ...profile };
    setStudents((prev) => [...prev, newStudent]);
    addNotification(newStudent.id, 'Welcome to Opportune! Your profile is ready.', 'check');
    return newStudent;
  }, [addNotification]);

  const updateStudent = useCallback((studentId, patch) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, ...patch } : s)));
  }, []);

  const addDocument = useCallback((studentId, doc) => {
    const newDoc = {
      id: uid('doc'),
      studentId,
      status: 'Pending Verification',
      uploadedAt: new Date().toISOString(),
      ...doc,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addNotification(studentId, `${doc.type} uploaded and is pending verification.`, 'alert');
    return newDoc;
  }, [addNotification]);

  const updateDocumentStatus = useCallback((docId, status, rejectionReason) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const updated = { ...d, status, rejectionReason: status === 'Rejected' ? rejectionReason : undefined };
        if (status === 'Verified') {
          addNotification(d.studentId, `${d.type} verification completed.`, 'check');
        } else if (status === 'Rejected') {
          addNotification(d.studentId, `${d.type} was rejected — ${rejectionReason}.`, 'reject');
        }
        return updated;
      })
    );
  }, [addNotification]);

  const addDeadline = useCallback((studentId, deadline) => {
    setDeadlines((prev) => [{ id: uid('dl'), studentId, custom: true, ...deadline }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback((studentId) => {
    setNotifications((prev) => prev.map((n) => (n.studentId === studentId ? { ...n, read: true } : n)));
  }, []);

  const upsertApplication = useCallback((studentId, opportunityId, status) => {
    setApplications((prev) => {
      const existing = prev.find((a) => a.studentId === studentId && a.opportunityId === opportunityId);
      if (existing) {
        return prev.map((a) =>
          a.id === existing.id ? { ...a, status, updatedAt: new Date().toISOString() } : a
        );
      }
      return [
        { id: uid('app'), studentId, opportunityId, status, updatedAt: new Date().toISOString() },
        ...prev,
      ];
    });
  }, []);

  const addOpportunity = useCallback((opportunity) => {
    setOpportunities((prev) => [{ id: uid('opp'), status: 'Open', verified: false, ...opportunity }, ...prev]);
  }, []);

  const updateOpportunity = useCallback((oppId, patch) => {
    setOpportunities((prev) => prev.map((o) => (o.id === oppId ? { ...o, ...patch } : o)));
  }, []);

  const deleteOpportunity = useCallback((oppId) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== oppId));
  }, []);

  const addInstitution = useCallback((institution) => {
    const newInst = { id: uid('inst'), verified: false, ...institution };
    setInstitutions((prev) => [...prev, newInst]);
    return newInst;
  }, []);

  const updateInstitution = useCallback((instId, patch) => {
    setInstitutions((prev) => prev.map((i) => (i.id === instId ? { ...i, ...patch } : i)));
  }, []);

  const connectStudentToInstitution = useCallback((studentId, institutionId) => {
    const inst = institutions.find((i) => i.id === institutionId);
    updateStudent(studentId, {
      institutionId,
      institutionName: inst?.name,
      institutionConnected: true,
    });
  }, [institutions, updateStudent]);

  const resetDemoData = useCallback(() => {
    clearAllOpportuneData();
    window.location.href = '/';
  }, []);

  const value = {
    students, institutions, opportunities, documents, deadlines, notifications, applications,
    addStudent, updateStudent,
    addDocument, updateDocumentStatus,
    addDeadline,
    addNotification, markNotificationRead, markAllNotificationsRead,
    upsertApplication,
    addOpportunity, updateOpportunity, deleteOpportunity,
    addInstitution, updateInstitution, connectStudentToInstitution,
    resetDemoData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
