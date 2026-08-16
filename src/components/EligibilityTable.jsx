import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function EligibilityTable({ checks }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <th className="text-left font-semibold px-4 py-3">Requirement</th>
            <th className="text-left font-semibold px-4 py-3">Your Profile</th>
            <th className="text-left font-semibold px-4 py-3">Required</th>
            <th className="text-center font-semibold px-4 py-3">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {checks.map((c) => (
            <tr key={c.key} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-800">{c.label}</td>
              <td className="px-4 py-3 text-slate-600">{c.yourValue}</td>
              <td className="px-4 py-3 text-slate-500">{c.required}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  {c.pass ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : c.partial ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
