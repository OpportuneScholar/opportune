import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { formatDate, daysLeft, deadlineStatus } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

export default function DeadlineCard({ deadline }) {
  const d = daysLeft(deadline.date);
  const status = deadlineStatus(deadline.date);
  const content = (
    <div className="card p-4 flex items-center gap-4 hover:shadow-pop transition-shadow duration-200 animate-fadeUp">
      <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-500 flex flex-col items-center justify-center flex-shrink-0">
        <Calendar className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{deadline.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {formatDate(deadline.date)} · {deadline.type || 'Custom'}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <StatusBadge label={status.label} tone={status.tone} size="sm" />
        <p className="text-xs text-slate-400 mt-1">{d >= 0 ? `${d}d left` : `${Math.abs(d)}d overdue`}</p>
      </div>
    </div>
  );
  if (deadline.opportunityId) {
    return <Link to={`/student/opportunities/${deadline.opportunityId}`}>{content}</Link>;
  }
  return content;
}
