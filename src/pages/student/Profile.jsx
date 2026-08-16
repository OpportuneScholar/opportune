import React, { useState } from 'react';
import { Pencil, Save, Trash2, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { initials } from '../../utils/format.js';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { session } = useAuth();
  const data = useData();
  const student = data.students.find((s) => s.id === session.id);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(student);

  if (!student) return null;

  function save() {
    data.updateStudent(student.id, form);
    setEditMode(false);
  }

  const rows = [
    ['Email', 'email'], ['Mobile', 'mobile'], ['Date of Birth', 'dob'], ['Gender', 'gender'],
    ['State', 'state'], ['Domicile', 'domicile'], ['Category', 'category'], ['Family Annual Income', 'familyIncome'],
  ];
  const eduRows = [
    ['Course', 'course'], ['Branch', 'branch'], ['Year', 'year'], ['Semester', 'semester'],
    ['Enrollment Number', 'enrollmentNumber'], ['10th %', 'tenthPercentage'], ['12th %', 'twelfthPercentage'], ['CGPA', 'cgpa'],
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        {editMode ? (
          <button onClick={save} className="btn-primary text-sm"><Save className="w-4 h-4" /> Save Changes</button>
        ) : (
          <button onClick={() => { setForm(student); setEditMode(true); }} className="btn-secondary text-sm"><Pencil className="w-4 h-4" /> Edit Profile</button>
        )}
      </div>

      <div className="card p-6 flex items-center gap-4 animate-fadeUp">
        <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-semibold">
          {initials(student.fullName)}
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">{student.fullName}</h2>
          <p className="text-sm text-slate-500">{student.institutionName}</p>
        </div>
      </div>

      <Section title="Personal Information">
        {rows.map(([label, key]) => (
          <FieldRow key={key} label={label} value={form[key]} editMode={editMode} onChange={(v) => setForm((f) => ({ ...f, [key]: v }))} />
        ))}
      </Section>

      <Section title="Education">
        {eduRows.map(([label, key]) => (
          <FieldRow key={key} label={label} value={form[key]} editMode={editMode} onChange={(v) => setForm((f) => ({ ...f, [key]: v }))} />
        ))}
      </Section>

      <div className="card p-5 animate-fadeUp">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Roadmap</h3>
        <Link to="/roadmap" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1.5">
          <Map className="w-4 h-4" /> View Opportune's future roadmap
        </Link>
      </div>

      <div className="card p-5 flex items-center justify-between animate-fadeUp">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Reset Demo Data</h3>
          <p className="text-xs text-slate-500 mt-0.5">Clears all local prototype data and reloads seed data.</p>
        </div>
        <button
          onClick={() => { if (confirm('This will erase all local demo data. Continue?')) data.resetDemoData(); }}
          className="btn-danger text-sm"
        >
          <Trash2 className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card p-6 animate-fadeUp">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function FieldRow({ label, value, editMode, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5 gap-4">
      <span className="text-sm text-slate-500 flex-shrink-0">{label}</span>
      {editMode ? (
        <input className="input text-sm py-1.5 max-w-[60%]" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <span className="text-sm font-medium text-slate-800 text-right">{value || '—'}</span>
      )}
    </div>
  );
}
