import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, ServerCog, DatabaseZap, Puzzle, ScanEye, MessageSquareMore } from 'lucide-react';

const PHASES = [
  { phase: 'Phase 1', title: 'Prototype', icon: Rocket, desc: 'Profile + Documents + Matching + Deadlines + Official Links', current: true },
  { phase: 'Phase 2', title: 'Real Backend', icon: ServerCog, desc: 'Cloud database and secure authentication' },
  { phase: 'Phase 3', title: 'Verified Data', icon: DatabaseZap, desc: 'Verified opportunity data ingestion from official sources' },
  { phase: 'Phase 4', title: 'Portal Integrations', icon: Puzzle, desc: 'Browser extension / official API integrations' },
  { phase: 'Phase 5', title: 'OCR + AI Readiness', icon: ScanEye, desc: 'OCR and AI-assisted document readiness checks' },
  { phase: 'Phase 6', title: 'Notifications', icon: MessageSquareMore, desc: 'Email / SMS / WhatsApp notifications' },
];

export default function Roadmap() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Future Roadmap</h1>
          <p className="text-slate-500 mt-1 text-sm">What ships in this hackathon prototype, and what comes next.</p>
        </div>
        <div className="space-y-3">
          {PHASES.map((p) => (
            <div key={p.phase} className={`card p-5 flex items-start gap-4 ${p.current ? 'border-brand-300 bg-brand-50/40' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.current ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{p.phase}</p>
                  {p.current && <span className="chip bg-brand-600 text-white text-[10px]">Current</span>}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{p.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
