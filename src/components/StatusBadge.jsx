import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Circle } from 'lucide-react';

const TONES = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
};

const ICONS = {
  success: CheckCircle2,
  warning: Clock,
  danger: AlertTriangle,
  neutral: Circle,
  brand: CheckCircle2,
};

export default function StatusBadge({ label, tone = 'neutral', icon = true, size = 'md' }) {
  const Icon = ICONS[tone] || Circle;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`chip ${TONES[tone]} ${sizeClasses}`}>
      {icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} strokeWidth={2.5} />}
      {label}
    </span>
  );
}

export function statusToTone(status) {
  const map = {
    Verified: 'success',
    'Pending Verification': 'warning',
    Rejected: 'danger',
    Open: 'brand',
    Approved: 'success',
    Submitted: 'brand',
    'Under Review': 'warning',
    'Ready to Apply': 'success',
    Applied: 'brand',
    Interested: 'neutral',
    'Eligibility Checked': 'neutral',
    Ready: 'success',
    'Application Started': 'brand',
  };
  return map[status] || 'neutral';
}
