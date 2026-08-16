import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, FolderCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { evaluateOpportunity } from '../../utils/eligibility.js';
import { formatDate, daysLeft } from '../../utils/format.js';
import EligibilityTable from '../../components/EligibilityTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

const RESULT_COPY = {
  ready: { label: '🟢 Ready to Apply', tone: 'success', desc: 'Your profile matches all available criteria and every required document is verified.' },
  'almost-ready': { label: '🟡 Almost Ready', tone: 'warning', desc: 'Your profile matches the available criteria, but one or more documents still need attention.' },
  'not-eligible': { label: '🔴 Not Eligible', tone: 'danger', desc: 'Your profile does not currently meet one or more required criteria for this opportunity.' },
};

export default function OpportunityDetail() {
  const { id } = useParams();
  const { session } = useAuth();
  const data = useData();
  const opportunity = data.opportunities.find((o) => o.id === id);
  const student = data.students.find((s) => s.id === session.id);
  const myDocs = data.documents.filter((d) => d.studentId === session.id);
  const evaluation = useMemo(() => (student && opportunity ? evaluateOpportunity(student, opportunity, myDocs) : null), [student, opportunity, myDocs]);
  const myApplication = data.applications.find((a) => a.studentId === session.id && a.opportunityId === id);

  if (!opportunity || !evaluation) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-slate-500">Opportunity not found.</p>
        <Link to="/student/opportunities" className="text-brand-600 font-medium hover:underline mt-2 inline-block">Back to Opportunities</Link>
      </div>
    );
  }

  const result = RESULT_COPY[evaluation.status];
  const dLeft = daysLeft(opportunity.deadline);

  function handleApplyClick() {
    if (!myApplication || myApplication.status === 'Interested') {
      data.upsertApplication(session.id, opportunity.id, evaluation.status === 'ready' ? 'Ready' : 'Eligibility Checked');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/student/opportunities" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 animate-fadeUp">
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </Link>

      <div className="card p-6 animate-fadeUp">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="chip bg-brand-50 text-brand-700 text-[11px] font-semibold mb-2">{opportunity.type}</span>
            <h1 className="text-xl font-bold text-slate-900">{opportunity.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{opportunity.provider}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Profile Match</p>
            <p className="text-3xl font-bold font-display text-brand-700">{evaluation.score}%</p>
          </div>
        </div>
        {!opportunity.verified && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
            Demo/sample data — this listing has not been verified against an official source.
          </div>
        )}
        <p className="text-sm text-slate-600 mt-4 leading-relaxed">{opportunity.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>Deadline: <strong className="text-slate-700">{formatDate(opportunity.deadline)}</strong> {dLeft >= 0 && `(${dLeft}d left)`}</span>
        </div>
      </div>

      {/* Eligibility Analysis */}
      <div className="card p-6 animate-fadeUp">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Eligibility Analysis</h2>
        <EligibilityTable checks={evaluation.checks} />
        <div className={`mt-5 rounded-xl p-4 ${
          result.tone === 'success' ? 'bg-emerald-50' : result.tone === 'warning' ? 'bg-amber-50' : 'bg-red-50'
        }`}>
          <p className="font-semibold text-sm text-slate-900">{result.label}</p>
          <p className="text-sm text-slate-600 mt-1">{result.desc}</p>
        </div>
      </div>

      {/* Why this opportunity */}
      <div className="card p-6 animate-fadeUp">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Why Opportune recommended this</h2>
        <ul className="space-y-2.5">
          {evaluation.checks.map((c) => (
            <li key={c.key} className="flex items-start gap-2.5 text-sm">
              {c.pass ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              )}
              <span className="text-slate-700">
                {c.key === 'documents'
                  ? c.pass
                    ? 'All required documents are verified'
                    : `${c.yourValue} required documents verified — ${evaluation.missingDocuments.join(', ') || 'some pending'}`
                  : `Your ${c.label.toLowerCase()} ${c.pass ? 'matches' : 'does not currently match'} (${c.yourValue} vs. ${c.required})`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing documents CTA */}
      {evaluation.missingDocuments.length > 0 && (
        <div className="card p-5 flex items-center gap-4 border-amber-200 bg-amber-50/50 animate-fadeUp">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Missing documents: {evaluation.missingDocuments.join(', ')}</p>
            <p className="text-xs text-slate-500 mt-0.5">Upload these to your Document Vault to become fully eligible.</p>
          </div>
          <Link to="/student/documents" className="btn-primary text-sm flex-shrink-0">Upload Missing Document</Link>
        </div>
      )}

      {/* Official application link */}
      <div className="card p-6 animate-fadeUp">
        <h2 className="text-base font-semibold text-slate-900">Official Application Portal</h2>
        <p className="text-sm text-slate-500 mt-1">Application will continue on the official provider website.</p>
        {myApplication && (
          <div className="mt-3">
            <StatusBadge label={myApplication.status} tone="brand" size="sm" />
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={opportunity.officialUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleApplyClick}
            className="btn-primary"
          >
            Apply on Official Website <ExternalLink className="w-4 h-4" />
          </a>
          <Link to="/student/assistant" className="btn-secondary">Prepare with Smart Assistant</Link>
        </div>
      </div>
    </div>
  );
}
