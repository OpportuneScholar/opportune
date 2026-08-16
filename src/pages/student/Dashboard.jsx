import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FolderCheck, CalendarClock, Gauge, ArrowUpRight, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { rankOpportunities } from '../../utils/eligibility.js';
import { daysLeft, formatDate } from '../../utils/format.js';
import ProgressBar from '../../components/ProgressBar.jsx';
import OpportunityCard from '../../components/OpportunityCard.jsx';

function computeReadiness(student, documents) {
  const fields = ['fullName', 'email', 'mobile', 'dob', 'state', 'category', 'course', 'year', 'enrollmentNumber', 'twelfthPercentage'];
  const filled = fields.filter((f) => student[f] !== undefined && student[f] !== '' && student[f] !== 0).length;
  const fieldScore = (filled / fields.length) * 60;
  const verified = documents.filter((d) => d.status === 'Verified').length;
  const docScore = documents.length ? (verified / documents.length) * 40 : 0;
  return Math.round(fieldScore + docScore);
}

export default function Dashboard() {
  const { session } = useAuth();
  const data = useData();
  const student = data.students.find((s) => s.id === session.id);
  const myDocs = data.documents.filter((d) => d.studentId === session.id);
  const myDeadlines = data.deadlines.filter((d) => d.studentId === session.id);
  const myNotifications = data.notifications.filter((n) => n.studentId === session.id);

  const ranked = useMemo(
    () => (student ? rankOpportunities(student, data.opportunities.filter((o) => o.status === 'Open'), myDocs) : []),
    [student, data.opportunities, myDocs]
  );
  const recommended = ranked.filter((r) => r.evaluation.score >= 60).slice(0, 3);
  const upcomingDeadlines = myDeadlines
    .filter((d) => daysLeft(d.date) >= 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  const readiness = computeReadiness(student, myDocs);
  const verifiedCount = myDocs.filter((d) => d.status === 'Verified').length;

  const actionItems = [];
  myDocs
    .filter((d) => d.status === 'Pending Verification')
    .forEach((d) => actionItems.push({ tone: 'warning', icon: AlertTriangle, text: `${d.type} verification pending.`, to: '/student/documents' }));
  myDocs
    .filter((d) => d.status === 'Rejected')
    .forEach((d) => actionItems.push({ tone: 'danger', icon: AlertTriangle, text: `${d.type} rejected — ${d.rejectionReason}. Replace it.`, to: '/student/documents' }));
  upcomingDeadlines
    .filter((d) => daysLeft(d.date) <= 7)
    .forEach((d) => actionItems.push({ tone: 'danger', icon: Clock, text: `${d.title} deadline in ${daysLeft(d.date)} days.`, to: d.opportunityId ? `/student/opportunities/${d.opportunityId}` : '/student/deadlines' }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (!student) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">{greeting}, {student.fullName.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-1 text-sm">Here's what needs your attention today.</p>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 animate-fadeUp">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Profile Readiness</span>
            <Gauge className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{readiness}%</p>
          <div className="mt-2"><ProgressBar value={readiness} tone="brand" size="sm" /></div>
        </div>
        <div className="card p-5 animate-fadeUp" style={{ animationDelay: '40ms' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Verified Documents</span>
            <FolderCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{verifiedCount}/{myDocs.length}</p>
          <Link to="/student/documents" className="text-xs text-brand-600 font-medium hover:underline mt-2 inline-block">Manage vault →</Link>
        </div>
        <div className="card p-5 animate-fadeUp" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Recommended</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{recommended.length}</p>
          <Link to="/student/opportunities" className="text-xs text-brand-600 font-medium hover:underline mt-2 inline-block">View all →</Link>
        </div>
        <div className="card p-5 animate-fadeUp" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Upcoming Deadlines</span>
            <CalendarClock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{upcomingDeadlines.length}</p>
          <Link to="/student/deadlines" className="text-xs text-brand-600 font-medium hover:underline mt-2 inline-block">See timeline →</Link>
        </div>
      </div>

      {/* Recommended */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recommended For You</h2>
          <Link to="/student/opportunities" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recommended.length === 0 ? (
          <div className="card p-8 text-center text-sm text-slate-500">
            No strong matches yet — complete your profile and documents to improve recommendations.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map(({ opportunity, evaluation }) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} evaluation={evaluation} />
            ))}
          </div>
        )}
      </div>

      {/* Action required */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Action Required</h2>
        {actionItems.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">You're all caught up — nothing needs attention right now.</div>
        ) : (
          <div className="space-y-2">
            {actionItems.slice(0, 5).map((item, i) => (
              <Link
                to={item.to}
                key={i}
                className="card p-4 flex items-center gap-3 hover:shadow-pop transition-shadow duration-200"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-700 flex-1">{item.text}</p>
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
