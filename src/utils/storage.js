const NS = 'opportune:';

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write failed', e);
  }
}

export function clearAllOpportuneData() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(NS))
    .forEach((k) => localStorage.removeItem(k));
}

export const KEYS = {
  SESSION: 'session',
  STUDENTS: 'students',
  INSTITUTIONS: 'institutions',
  OPPORTUNITIES: 'opportunities',
  DOCUMENTS: 'documents',
  DEADLINES: 'deadlines',
  NOTIFICATIONS: 'notifications',
  APPLICATIONS: 'applications',
  SEEDED: 'seeded_v1',
};
