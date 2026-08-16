import React from 'react';
import { TrendingDown, FileCheck2, BellRing, ClipboardCheck, Sparkles, Info } from 'lucide-react';
import { ANALYTICS_DEMO } from '../../data/seedData.js';
import ProgressBar from '../../components/ProgressBar.jsx';

export default function AdminAnalytics() {
  const { before, after } = ANALYTICS_DEMO;
  const improvement = Math.round(((before.missedDeadlines - after.missedDeadlines) / before.missedDeadlines) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Impact & Analytics</h1>
        <p className="text-slate-500 mt-1 text-sm">Illustrative simulated data demonstrating the platform's expected impact.</p>
      </div>

      <div className="card p-4 flex items-start gap-3 bg-amber-50/60 border-amber-200 animate-fadeUp">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Simulated demo data.</strong> These figures illustrate expected impact for the hackathon prototype and are not drawn from real-world deployments.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card p-6 animate-fadeUp">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Before Opportune</p>
          <Stat label="Students" value={before.students} />
          <Stat label="Missed Deadlines" value={before.missedDeadlines} tone="danger" />
          <Stat label="Documents Expired Unnoticed" value={before.documentsExpired} tone="danger" />
          <Stat label="Late Applications" value={before.lateApplications} tone="danger" />
        </div>
        <div className="card p-6 border-emerald-200 bg-emerald-50/30 animate-fadeUp">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-4">With Opportune</p>
          <Stat label="Students" value={after.students} />
          <Stat label="Missed Deadlines" value={after.missedDeadlines} tone="success" />
          <Stat label="Documents Expired Unnoticed" value={after.documentsExpired} tone="success" />
          <Stat label="Late Applications" value={after.lateApplications} tone="success" />
        </div>
      </div>

      <div className="card p-6 text-center animate-fadeUp">
        <TrendingDown className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
        <p className="text-3xl font-bold font-display text-slate-900">{improvement}% fewer missed deadlines</p>
        <p className="text-sm text-slate-500 mt-1">Simulated improvement across a 100-student cohort</p>
        <div className="max-w-xs mx-auto mt-4"><ProgressBar value={improvement} tone="success" /></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={FileCheck2} label="Documents Completed" value={ANALYTICS_DEMO.documentsCompleted} />
        <MetricCard icon={BellRing} label="Students Alerted" value={ANALYTICS_DEMO.studentsAlerted} />
        <MetricCard icon={ClipboardCheck} label="Applications Prepared" value={ANALYTICS_DEMO.applicationsPrepared} />
        <MetricCard icon={Sparkles} label="Opportunities Matched" value={ANALYTICS_DEMO.opportunitiesMatched} />
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const color = tone === 'danger' ? 'text-red-600' : tone === 'success' ? 'text-emerald-600' : 'text-slate-900';
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-bold font-display ${color}`}>{value}</span>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="card p-5 animate-fadeUp">
      <Icon className="w-[18px] h-[18px] text-brand-600 mb-3" />
      <p className="text-xl font-bold font-display text-slate-900">{value.toLocaleString('en-IN')}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
