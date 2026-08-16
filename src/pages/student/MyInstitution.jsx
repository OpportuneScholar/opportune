import React from 'react';
import { Building2, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';

export default function MyInstitution() {
  const { session } = useAuth();
  const data = useData();
  const student = data.students.find((s) => s.id === session.id);
  const institution = data.institutions.find((i) => i.id === student?.institutionId);
  const instOpportunities = data.opportunities.filter((o) => o.institutionId === institution?.id);

  if (!institution) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">You are not connected to an institution yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">My Institution</h1>
        <p className="text-slate-500 mt-1 text-sm">Your connected institution and its published opportunities.</p>
      </div>

      <div className="card p-6 animate-fadeUp">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0 font-bold font-display">
            {institution.code.slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-slate-900">{institution.name}</h2>
              {institution.verified && (
                <span className="chip bg-emerald-50 text-emerald-700 text-[10px]"><ShieldCheck className="w-3 h-3" /> Verified</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {institution.location}</p>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {institution.email}</p>
            <p className="text-xs text-slate-400 mt-2">Institution code: {institution.code}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Published by {institution.name}</h2>
        {instOpportunities.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">No institution-published opportunities yet.</div>
        ) : (
          <div className="space-y-2">
            {instOpportunities.map((o) => (
              <div key={o.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{o.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{o.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
