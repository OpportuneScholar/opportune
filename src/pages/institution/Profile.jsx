import React, { useState } from 'react';
import { Copy, ShieldCheck, MapPin, Mail, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';

export default function InstitutionProfile() {
  const { session } = useAuth();
  const data = useData();
  const institution = data.institutions.find((i) => i.id === session.id);
  const [copied, setCopied] = useState(false);

  if (!institution) return null;

  function copyLink() {
    navigator.clipboard?.writeText(`https://${institution.joinLink}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Institution Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your institution's public details and student join link.</p>
      </div>

      <div className="card p-6 animate-fadeUp">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold font-display flex-shrink-0">
            {institution.code.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-slate-900">{institution.name}</h2>
              {institution.verified ? (
                <span className="chip bg-emerald-50 text-emerald-700 text-[10px]"><ShieldCheck className="w-3 h-3" /> Verified</span>
              ) : (
                <span className="chip bg-amber-50 text-amber-700 text-[10px]">Pending Verification</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">{institution.type}</p>
          </div>
        </div>
        <div className="mt-5 space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {institution.location}</p>
          <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {institution.email}</p>
        </div>
      </div>

      <div className="card p-6 animate-fadeUp">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Generate Student Join Link</h3>
        <p className="text-xs text-slate-500 mb-4">
          Share this link so students can join "{institution.name}" directly — it never exposes your credentials, and the student only completes their own profile.
        </p>
        <div className="flex items-center gap-2">
          <div className="input flex items-center gap-2 flex-1 text-slate-600 overflow-x-auto">
            <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{institution.joinLink}</span>
          </div>
          <button onClick={copyLink} className="btn-secondary text-sm flex-shrink-0"><Copy className="w-4 h-4" /> {copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>
    </div>
  );
}
