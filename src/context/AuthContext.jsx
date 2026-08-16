import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadJSON, saveJSON, KEYS } from '../utils/storage.js';
import { DEMO_ACCOUNTS } from '../data/seedData.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadJSON(KEYS.SESSION, null));

  const login = useCallback((role, email, password) => {
    const demo = DEMO_ACCOUNTS[role];
    if (demo && demo.email === email.trim().toLowerCase() && demo.password === password) {
      const newSession = { role, email, id: role === 'student' ? 'stu_1' : role === 'institution' ? 'inst_1' : 'admin_1' };
      setSession(newSession);
      saveJSON(KEYS.SESSION, newSession);
      return { ok: true, session: newSession };
    }
    // Allow any registered student (created via registration flow) to log in with any password for prototype ease
    return { ok: false, error: 'Invalid email or password. Try the demo credentials shown below.' };
  }, []);

  const loginAsStudent = useCallback((studentId, email) => {
    const newSession = { role: 'student', id: studentId, email };
    setSession(newSession);
    saveJSON(KEYS.SESSION, newSession);
    return newSession;
  }, []);

  const loginAsInstitution = useCallback((institutionId, email) => {
    const newSession = { role: 'institution', id: institutionId, email };
    setSession(newSession);
    saveJSON(KEYS.SESSION, newSession);
    return newSession;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    saveJSON(KEYS.SESSION, null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, loginAsStudent, loginAsInstitution, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
