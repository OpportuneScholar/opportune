import React, { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { loadJSON, saveJSON } from '../../utils/storage.js';
import { uid, timeAgo } from '../../utils/format.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function InstitutionNotices() {
  const { session } = useAuth();
  const data = useData();
  const institution = data.institutions.find((i) => i.id === session.id);
  const myStudents = data.students.filter((s) => s.institutionId === session.id && s.institutionConnected);
  const [text, setText] = useState('');
  const [notices, setNotices] = useState(() => loadJSON(`notices:${session.id}`, []));

  function post(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const notice = { id: uid('notice'), text, createdAt: new Date().toISOString() };
    const updated = [notice, ...notices];
    setNotices(updated);
    saveJSON(`notices:${session.id}`, updated);
    myStudents.forEach((s) => data.addNotification(s.id, `${institution.name}: ${text}`, 'institution'));
    setText('');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Notices</h1>
        <p className="text-slate-500 mt-1 text-sm">Send an announcement to all {myStudents.length} connected students.</p>
      </div>

      <form onSubmit={post} className="card p-5 animate-fadeUp">
        <textarea
          className="input"
          rows={3}
          placeholder="Write a notice for your students..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-primary text-sm mt-3"><Send className="w-4 h-4" /> Post Notice</button>
      </form>

      {notices.length === 0 ? (
        <EmptyState icon={Megaphone} title="No notices yet" description="Announcements you post will appear here and reach your students' notification center." />
      ) : (
        <div className="space-y-2">
          {notices.map((n) => (
            <div key={n.id} className="card p-4">
              <p className="text-sm text-slate-800">{n.text}</p>
              <p className="text-xs text-slate-400 mt-1.5">{timeAgo(n.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
