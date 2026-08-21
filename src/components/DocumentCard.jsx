import React from 'react';
import { FileText, Calendar, Download } from 'lucide-react';
import StatusBadge, { statusToTone } from './StatusBadge.jsx';
import { formatDate } from '../utils/format.js';

function handleDownload(e, document) {
  e.stopPropagation(); // don't trigger the card's onClick

  const content = [
    `Document Type: ${document.type}`,
    `Certificate Number: ${document.certificateNumber || 'N/A'}`,
    `Status: ${document.status}`,
    `Issue Date: ${formatDate(document.issueDate)}`,
    document.status === 'Rejected' && document.rejectionReason
      ? `Rejection Reason: ${document.rejectionReason}`
      : null,
  ].filter(Boolean).join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.ownerDocument.createElement('a');
  link.href = url;
  link.download = `${document.type.replace(/\s+/g, '_')}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

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
        <div className="flex items-center gap-2">
          <StatusBadge label={document.status} tone={statusToTone(document.status)} size="sm" />
          <span
            role="button"
            aria-label={`Download ${document.type}`}
            onClick={(e) => handleDownload(e, document)}
            className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </span>
        </div>
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