import React from 'react';

export default function ProgressBar({ value, max = 100, tone = 'brand', showLabel = false, size = 'md' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneClass = {
    brand: 'bg-brand-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  }[tone];
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${toneClass} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <div className="mt-1 text-xs font-medium text-slate-500">{Math.round(pct)}%</div>}
    </div>
  );
}
