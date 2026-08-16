import React from 'react';
import { Sparkles, AlertTriangle, AlertOctagon, CheckCircle2, Building2, XCircle, Bell } from 'lucide-react';
import { timeAgo } from '../utils/format.js';

const ICONS = {
  sparkles: { Icon: Sparkles, tone: 'text-brand-600 bg-brand-50' },
  alert: { Icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50' },
  urgent: { Icon: AlertOctagon, tone: 'text-red-600 bg-red-50' },
  check: { Icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
  institution: { Icon: Building2, tone: 'text-indigo-600 bg-indigo-50' },
  reject: { Icon: XCircle, tone: 'text-red-600 bg-red-50' },
};

export default function NotificationItem({ notification, onClick }) {
  const { Icon, tone } = ICONS[notification.icon] || { Icon: Bell, tone: 'text-slate-500 bg-slate-100' };
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl transition-colors ${
        notification.read ? 'bg-white' : 'bg-brand-50/40'
      } hover:bg-slate-50`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tone}`}>
        <Icon className="w-4 h-4" strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${notification.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
          {notification.text}
        </p>
        <p className="text-xs text-slate-400 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.read && <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 flex-shrink-0" />}
    </button>
  );
}
