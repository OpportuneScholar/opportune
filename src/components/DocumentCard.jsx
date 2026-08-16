import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import StatusBadge, { statusToTone } from './StatusBadge.jsx';
import { formatDate } from '../utils/format.js';

export default function DocumentCard({ document, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 text-left w-full hover:shadow-pop hover:-translate-y-0.5 transition-all duration-200 animate-fadeUp"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <StatusBadge label={document.status} tone={statusToTone(document.status)} size="sm" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{document.type}</h3>
      <p className="text-xs text-slate-500 mt-0.5">{document.certificateNumber || 'No certificate number'}</p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Calendar className="w-3.5 h-3.5" />
        Issued {formatDate(document.issueDate)}
      </div>
      {document.status === 'Rejected' && document.rejectionReason && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-2.5 py-1.5">{document.rejectionReason}</p>
      )}
    </button>
  );
}
