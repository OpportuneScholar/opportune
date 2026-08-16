import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatDate, daysLeft } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

const TYPE_COLORS = {
  Scholarship: 'text-brand-700 bg-brand-50',
  Internship: 'text-purple-700 bg-purple-50',
  Fellowship: 'text-teal-700 bg-teal-50',
  Renewal: 'text-orange-700 bg-orange-50',
  'Institution Opportunity': 'text-indigo-700 bg-indigo-50',
};

export default function OpportunityCard({ opportunity, evaluation }) {
  const dLeft = daysLeft(opportunity.deadline);
  const urgent = dLeft !== null && dLeft <= 7 && dLeft >= 0;
  const score = evaluation?.score ?? null;

  return (
    <div className="card p-5 hover:shadow-pop hover:-translate-y-0.5 transition-all duration-200 animate-fadeUp">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`chip text-[11px] font-semibold ${TYPE_COLORS[opportunity.type] || 'bg-slate-100 text-slate-600'}`}>
          {opportunity.type}
        </span>
        {score !== null && (
          <div className="flex items-center gap-1.5 text-right">
            <span className="text-lg font-bold font-display text-brand-700 leading-none">{score}%</span>
            <span className="text-[11px] text-slate-400 leading-none mt-0.5">match</span>
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-slate-900 leading-snug">{opportunity.name}</h3>
      <p className="text-sm text-slate-500 mt-0.5">{opportunity.provider}</p>

      {evaluation && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {evaluation.checks.slice(0, 5).map((c) => (
            <span
              key={c.key}
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                c.pass ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {c.pass ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {c.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className={`flex items-center gap-1.5 ${urgent ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(opportunity.deadline)}
          {dLeft !== null && dLeft >= 0 && <span className="text-xs">({dLeft}d left)</span>}
        </div>
        {evaluation && (
          <StatusBadge
            size="sm"
            label={
              evaluation.status === 'ready' ? 'Ready to Apply' : evaluation.status === 'almost-ready' ? 'Almost Ready' : 'Not Eligible'
            }
            tone={evaluation.status === 'ready' ? 'success' : evaluation.status === 'almost-ready' ? 'warning' : 'danger'}
          />
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Link to={`/student/opportunities/${opportunity.id}`} className="btn-secondary flex-1 justify-center text-sm py-2">
          Check Eligibility
        </Link>
        <a
          href={opportunity.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary flex-1 justify-center text-sm py-2"
        >
          Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
