import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { initials } from '../../utils/format.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function InstitutionStudents() {
  const { session } = useAuth();
  const data = useData();
  const [query, setQuery] = useState('');
  const myStudents = data.students.filter((s) => s.institutionId === session.id);
  const filtered = myStudents.filter((s) => s.fullName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-500 mt-1 text-sm">All students connected to your institution.</p>
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
              <div key={s.id} className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {initials(s.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{s.fullName}</p>
                  <p className="text-xs text-slate-500">{s.course} · {s.year} · {s.enrollmentNumber}</p>
                </div>
                <span className="text-xs text-slate-500">{verified}/{docs.length} docs verified</span>
                <StatusBadge label={s.institutionConnected ? 'Connected' : 'Pending'} tone={s.institutionConnected ? 'success' : 'warning'} size="sm" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
