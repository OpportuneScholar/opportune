import React from 'react';
import { Check, X, ShieldCheck, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function AdminInstitutions() {
  const data = useData();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Institutions</h1>
        <p className="text-slate-500 mt-1 text-sm">Approve or reject institution registrations.</p>
      </div>

      {data.institutions.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No institutions yet" />
      ) : (
        <div className="space-y-2">
          {data.institutions.map((inst) => (
            <div key={inst.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-semibold text-sm">
                {inst.code?.slice(0, 2) || '??'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{inst.name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {inst.location} · {inst.code}</p>
              </div>
              {inst.verified ? (
                <span className="chip bg-emerald-50 text-emerald-700 text-xs"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => data.updateInstitution(inst.id, { verified: true })} className="btn-secondary text-sm py-1.5"><Check className="w-3.5 h-3.5" /> Approve</button>
                  <button onClick={() => data.updateInstitution(inst.id, { verified: false, rejected: true })} className="btn-danger text-sm py-1.5"><X className="w-3.5 h-3.5" /> Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
