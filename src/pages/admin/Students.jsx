import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import { initials } from '../../utils/format.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';

export default function AdminStudents() {
  const data = useData();
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState(null);
  const filtered = data.students.filter((s) => s.fullName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-500 mt-1 text-sm">View basic student profile and status across the platform.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input className="input pl-10" placeholder="Search students..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No students found" />
      ) : (
        <div className="card divide-y divide-slate-100">
          {filtered.map((s) => {
            const docs = data.documents.filter((d) => d.studentId === s.id);
            const verified = docs.filter((d) => d.status === 'Verified').length;
            return (
              <button key={s.id} onClick={() => setDetail(s)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {initials(s.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{s.fullName}</p>
                  <p className="text-xs text-slate-500">{s.institutionName || 'No institution'} · {s.course}</p>
                </div>
                <span className="text-xs text-slate-500">{verified}/{docs.length} docs</span>
                <StatusBadge label={s.institutionConnected ? 'Connected' : 'Unconnected'} tone={s.institutionConnected ? 'success' : 'neutral'} size="sm" />
              </button>
            );
          })}
        </div>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.fullName}>
        {detail && (
          <div className="space-y-2 text-sm">
            <Row label="Email">{detail.email}</Row>
            <Row label="Mobile">{detail.mobile}</Row>
            <Row label="Institution">{detail.institutionName || '—'}</Row>
            <Row label="Course">{detail.course}</Row>
            <Row label="Year">{detail.year}</Row>
            <Row label="Category">{detail.category}</Row>
            <Row label="State">{detail.state}</Row>
            <Row label="CGPA">{detail.cgpa}</Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{children}</span>
    </div>
  );
}
