import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileCheck2, Sparkles, UserPlus2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { initials } from '../../utils/format.js';
import Modal from '../../components/Modal.jsx';
import { REJECTION_REASONS } from '../../data/seedData.js';

export default function InstitutionDashboard() {
  const { session } = useAuth();
  const data = useData();
  const institution = data.institutions.find((i) => i.id === session.id);
  const myStudents = data.students.filter((s) => s.institutionId === session.id);
  const connected = myStudents.filter((s) => s.institutionConnected);
  const pendingRequests = myStudents.filter((s) => !s.institutionConnected);
  const pendingDocs = data.documents.filter((d) => connected.some((s) => s.id === d.studentId) && d.status === 'Pending Verification');
  const myOpportunities = data.opportunities.filter((o) => o.institutionId === session.id);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState('');

  function approveRequest(studentId) {
    data.updateStudent(studentId, { institutionConnected: true });
    data.addNotification(studentId, `${institution.name} approved your connection.`, 'institution');
  }
  function rejectRequest(studentId) {
    data.updateStudent(studentId, { institutionId: undefined, institutionName: undefined, institutionConnected: false });
  }

  function confirmReject() {
    if (!reason) return;
    data.updateDocumentStatus(rejectTarget.id, 'Rejected', reason);
    setRejectTarget(null);
    setReason('');
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">{institution?.name}</h1>
        <p className="text-slate-500 mt-1 text-sm">Institution dashboard — students, documents and opportunities.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Connected Students" value={connected.length} tone="text-brand-600 bg-brand-50" />
        <StatCard icon={FileCheck2} label="Pending Documents" value={pendingDocs.length} tone="text-amber-600 bg-amber-50" />
        <StatCard icon={Sparkles} label="Opportunities" value={myOpportunities.length} tone="text-purple-600 bg-purple-50" />
        <StatCard icon={UserPlus2} label="Pending Requests" value={pendingRequests.length} tone="text-red-600 bg-red-50" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Student Requests</h2>
        {pendingRequests.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">No pending student requests.</div>
        ) : (
          <div className="space-y-2">
            {pendingRequests.map((s) => (
              <div key={s.id} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {initials(s.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{s.fullName}</p>
                  <p className="text-xs text-slate-500">{s.course} · {s.year}</p>
                </div>
                <button onClick={() => approveRequest(s.id)} className="btn-secondary text-sm py-1.5"><Check className="w-3.5 h-3.5" /> Approve</button>
                <button onClick={() => rejectRequest(s.id)} className="btn-danger text-sm py-1.5"><X className="w-3.5 h-3.5" /> Reject</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Document Verification</h2>
          <Link to="/institution/documents" className="text-sm text-brand-600 font-medium hover:underline">View all</Link>
        </div>
        {pendingDocs.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">No documents pending verification.</div>
        ) : (
          <div className="space-y-2">
            {pendingDocs.slice(0, 5).map((doc) => {
              const s = connected.find((st) => st.id === doc.studentId);
              return (
                <div key={doc.id} className="card p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{s?.fullName} — {doc.type}</p>
                    <p className="text-xs text-slate-500">Certificate #{doc.certificateNumber}</p>
                  </div>
                  <button onClick={() => data.updateDocumentStatus(doc.id, 'Verified')} className="btn-secondary text-sm py-1.5">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => setRejectTarget(doc)} className="btn-danger text-sm py-1.5">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={!!rejectTarget} onClose={() => { setRejectTarget(null); setReason(''); }} title="Reject Document">
        <p className="text-sm text-slate-600 mb-4">A rejection reason is required so the student knows what to fix.</p>
        <div className="space-y-2">
          {REJECTION_REASONS.map((r) => (
            <label key={r} className="flex items-center gap-2.5 text-sm p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="text-brand-600 focus:ring-brand-200" />
              {r}
            </label>
          ))}
        </div>
        <button onClick={confirmReject} disabled={!reason} className="btn-danger w-full mt-5 py-2.5">Confirm Rejection</button>
      </Modal>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="card p-5 animate-fadeUp">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tone}`}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <p className="text-2xl font-bold font-display text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
