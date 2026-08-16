import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Sparkles, FileCheck2, ClipboardList, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';

export default function AdminDashboard() {
  const data = useData();
  const pendingInstitutions = data.institutions.filter((i) => !i.verified);
  const pendingDocs = data.documents.filter((d) => d.status === 'Pending Verification');

  const cards = [
    { icon: Users, label: 'Total Students', value: data.students.length, to: '/admin/students', tone: 'text-brand-600 bg-brand-50' },
    { icon: ShieldCheck, label: 'Institutions', value: data.institutions.length, to: '/admin/institutions', tone: 'text-indigo-600 bg-indigo-50' },
    { icon: Sparkles, label: 'Opportunities', value: data.opportunities.length, to: '/admin/opportunities', tone: 'text-purple-600 bg-purple-50' },
    { icon: FileCheck2, label: 'Pending Verifications', value: pendingDocs.length, to: '/admin/documents', tone: 'text-amber-600 bg-amber-50' },
    { icon: ClipboardList, label: 'Applications', value: data.applications.length, to: '/admin/students', tone: 'text-teal-600 bg-teal-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Super Admin</h1>
        <p className="text-slate-500 mt-1 text-sm">Platform-wide oversight of students, institutions and opportunities.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card p-5 hover:shadow-pop transition-shadow duration-200 animate-fadeUp">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.tone}`}>
              <c.icon className="w-[18px] h-[18px]" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Institution Verification</h2>
          <Link to="/admin/institutions" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">View all <ArrowUpRight className="w-3.5 h-3.5" /></Link>
        </div>
        {pendingInstitutions.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">No institutions awaiting verification.</div>
        ) : (
          <div className="space-y-2">
            {pendingInstitutions.map((i) => (
              <div key={i.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{i.name}</p>
                  <p className="text-xs text-slate-500">{i.location} · {i.code}</p>
                </div>
                <Link to="/admin/institutions" className="btn-secondary text-sm py-1.5">Review</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
