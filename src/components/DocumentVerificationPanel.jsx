import React, { useState } from 'react';
import { Check, X, FileCheck2 } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { REJECTION_REASONS } from '../data/seedData.js';
import { formatDate } from '../utils/format.js';
import StatusBadge, { statusToTone } from './StatusBadge.jsx';
import Modal from './Modal.jsx';
import EmptyState from './EmptyState.jsx';

const FILTERS = ['All', 'Pending Verification', 'Verified', 'Rejected'];

export default function DocumentVerificationPanel({ documents, students }) {
  const data = useData();
  const [filter, setFilter] = useState('Pending Verification');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState('');

  const list = filter === 'All' ? documents : documents.filter((d) => d.status === filter);

  function confirmReject() {
    if (!reason) return;
    data.updateDocumentStatus(rejectTarget.id, 'Rejected', reason);
    setRejectTarget(null);
    setReason('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip text-xs font-medium border transition-colors ${
              filter === f ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={FileCheck2} title="No documents found" description="Nothing matches this filter right now." />
      ) : (
        <div className="card divide-y divide-slate-100">
          {list.map((doc) => {
            const s = students.find((st) => st.id === doc.studentId);
            return (
              <div key={doc.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-medium text-slate-900">{s?.fullName || 'Unknown student'} — {doc.type}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Certificate #{doc.certificateNumber || '—'} · Issued {formatDate(doc.issueDate)}
                    {doc.expiryDate && !doc.noExpiry ? ` · Expires ${formatDate(doc.expiryDate)}` : ''}
                  </p>
                  {doc.status === 'Rejected' && doc.rejectionReason && (
                    <p className="text-xs text-red-600 mt-1">Reason: {doc.rejectionReason}</p>
                  )}
                </div>
                <StatusBadge label={doc.status} tone={statusToTone(doc.status)} size="sm" />
                {doc.status === 'Pending Verification' && (
                  <div className="flex gap-2">
                    <button onClick={() => data.updateDocumentStatus(doc.id, 'Verified')} className="btn-secondary text-sm py-1.5">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => setRejectTarget(doc)} className="btn-danger text-sm py-1.5">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
