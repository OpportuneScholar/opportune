import React, { useState } from 'react';
import { CheckCircle2, Copy, Pencil, Rocket, Puzzle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';

export default function SmartAssistant() {
  const { session } = useAuth();
  const data = useData();
  const student = data.students.find((s) => s.id === session.id);
  const [prepared, setPrepared] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState(null);

  if (!student) return null;

  const fields = [
    { key: 'fullName', label: 'Full Name', value: student.fullName },
    { key: 'dob', label: 'Date of Birth', value: student.dob },
    { key: 'institutionName', label: 'College', value: student.institutionName },
    { key: 'course', label: 'Course', value: student.course },
    { key: 'semester', label: 'Semester', value: student.semester },
    { key: 'cgpa', label: 'Marks (CGPA)', value: student.cgpa },
    { key: 'familyIncome', label: 'Family Income', value: student.familyIncome ? `₹${Number(student.familyIncome).toLocaleString('en-IN')}` : '' },
    { key: 'address', label: 'Address', value: student.address },
  ];
  const foundCount = fields.filter((f) => f.value).length;

  function prepare() {
    setForm(Object.fromEntries(fields.map((f) => [f.key, f.value])));
    setPrepared(true);
  }

  function copyAll() {
    const text = fields.map((f) => `${f.label}: ${form?.[f.key] ?? f.value}`).join('\n');
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Smart Application Assistant</h1>
        <p className="text-slate-500 mt-1 text-sm">Reuse your saved profile so you never fill the same form twice.</p>
      </div>

      <div className="card p-6 animate-fadeUp">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{foundCount} of {fields.length} required fields found in your Opportune profile.</p>
            <p className="text-xs text-slate-500 mt-0.5">Fields are pulled from your registration and education details.</p>
          </div>
        </div>
        <ul className="mt-5 grid sm:grid-cols-2 gap-2">
          {fields.map((f) => (
            <li key={f.key} className="flex items-center gap-2 text-sm text-slate-600">
              {f.value ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <Pencil className="w-4 h-4 text-amber-500 flex-shrink-0" />}
              {f.label}
            </li>
          ))}
        </ul>
        {!prepared && (
          <button onClick={prepare} className="btn-primary mt-6 text-sm">
            <Rocket className="w-4 h-4" /> Prepare Application
          </button>
        )}
      </div>

      {prepared && (
        <div className="card p-6 animate-fadeUp">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Review & Confirm</h2>
            <button onClick={() => setEditMode((v) => !v)} className="btn-ghost text-sm">
              <Pencil className="w-3.5 h-3.5" /> {editMode ? 'Done Editing' : 'Edit'}
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.key} className="grid grid-cols-3 gap-3 items-center">
                <span className="text-sm text-slate-500 col-span-1">{f.label}</span>
                {editMode ? (
                  <input
                    className="input col-span-2 text-sm py-1.5"
                    value={form[f.key] ?? ''}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-800 col-span-2">{form[f.key] || '—'}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={copyAll} className="btn-secondary text-sm">
              <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button onClick={() => setPrepared(false)} className="btn-primary text-sm">
              <CheckCircle2 className="w-4 h-4" /> Confirm & Ready
            </button>
          </div>
        </div>
      )}

      <div className="card p-5 flex items-start gap-3 bg-slate-50/60 animate-fadeUp">
        <Puzzle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-600">Future:</strong> browser extension / API-based autofill for supported official portals.
          This prototype does not automatically fill or submit information on external websites.
        </p>
      </div>
    </div>
  );
}
