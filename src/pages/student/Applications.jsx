import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { APPLICATION_STATUS_FLOW } from '../../data/seedData.js';
import { formatDate } from '../../utils/format.js';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

export default function Applications() {
  const { session } = useAuth();
  const data = useData();
  const myApplications = data.applications
    .filter((a) => a.studentId === session.id)
    .map((a) => ({ ...a, opportunity: data.opportunities.find((o) => o.id === a.opportunityId) }))
    .filter((a) => a.opportunity)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-1 text-sm">Track every opportunity from interest to approval.</p>
      </div>

      {myApplications.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Check eligibility on a recommended opportunity to start tracking it here."
          action={<Link to="/student/opportunities" className="btn-primary text-sm">Explore Opportunities</Link>}
        />
      ) : (
        <div className="space-y-4">
          {myApplications.map((app) => (
            <div key={app.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{app.opportunity.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Deadline {formatDate(app.opportunity.deadline)} · Updated {formatDate(app.updatedAt)}</p>
                </div>
                <StatusBadge label={app.status} tone="brand" />
              </div>

              <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-1">
                {APPLICATION_STATUS_FLOW.map((s, i) => {
                  const currentIdx = APPLICATION_STATUS_FLOW.indexOf(app.status);
                  const done = i <= currentIdx;
                  return (
                    <React.Fragment key={s}>
                      <div className={`flex-shrink-0 flex flex-col items-center gap-1 ${done ? 'text-brand-700' : 'text-slate-300'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-brand-600' : 'bg-slate-200'}`} />
                        <span className="text-[10px] font-medium whitespace-nowrap">{s}</span>
                      </div>
                      {i < APPLICATION_STATUS_FLOW.length - 1 && (
                        <div className={`h-0.5 w-6 flex-shrink-0 ${i < currentIdx ? 'bg-brand-400' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <select
                  className="input w-auto text-sm py-2"
                  value={app.status}
                  onChange={(e) => data.upsertApplication(session.id, app.opportunityId, e.target.value)}
                >
                  {[...APPLICATION_STATUS_FLOW, 'Rejected'].map((s) => <option key={s}>{s}</option>)}
                </select>
                <Link to={`/student/opportunities/${app.opportunity.id}`} className="btn-secondary text-sm">View Details</Link>
                <a href={app.opportunity.officialUrl} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
                  Official Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
