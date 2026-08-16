import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';

const STEPS = ['Personal Information', 'Education', 'Institution'];

const STATES = ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Delhi', 'Maharashtra', 'Rajasthan'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const COURSES = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'B.Tech Civil', 'BBA', 'B.Sc'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    fullName: '', email: '', mobile: '', dob: '', gender: 'Female', state: 'Uttar Pradesh', domicile: 'Uttar Pradesh',
    category: 'General', familyIncome: '',
    institutionName: '', course: 'B.Tech CSE', branch: '', year: '1st Year', semester: 'Semester 1',
    enrollmentNumber: '', tenthPercentage: '', twelfthPercentage: '', cgpa: '',
    institutionId: '',
  });
  const [errors, setErrors] = useState({});
  const { loginAsStudent } = useAuth();
  const { institutions, addStudent } = useData();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateStep() {
    const e = {};
    if (step === 0) {
      if (!form.fullName) e.fullName = 'Required';
      if (!form.email) e.email = 'Required';
      if (!form.mobile) e.mobile = 'Required';
      if (!form.dob) e.dob = 'Required';
    }
    if (step === 1) {
      if (!form.branch) e.branch = 'Required';
      if (!form.enrollmentNumber) e.enrollmentNumber = 'Required';
      if (!form.twelfthPercentage) e.twelfthPercentage = 'Required';
    }
    if (step === 2) {
      if (!form.institutionId) e.institutionId = 'Select an institution to continue';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  }

  function finish() {
    const inst = institutions.find((i) => i.id === form.institutionId);
    const newStudent = addStudent({
      fullName: form.fullName,
      email: form.email,
      mobile: form.mobile,
      dob: form.dob,
      gender: form.gender,
      state: form.state,
      domicile: form.domicile,
      category: form.category,
      familyIncome: Number(form.familyIncome) || 0,
      institutionId: inst?.id,
      institutionName: inst?.name,
      institutionConnected: true,
      course: form.course,
      branch: form.branch,
      year: form.year,
      semester: form.semester,
      enrollmentNumber: form.enrollmentNumber,
      tenthPercentage: Number(form.tenthPercentage) || 0,
      twelfthPercentage: Number(form.twelfthPercentage) || 0,
      cgpa: Number(form.cgpa) || 0,
      address: '',
    });
    loginAsStudent(newStudent.id, newStudent.email);
    navigate('/student/dashboard');
  }

  const filteredInstitutions = institutions.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl animate-fadeUp">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-slate-900">Opportune</span>
        </Link>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6 px-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[11px] font-medium hidden sm:block ${i === step ? 'text-brand-700' : 'text-slate-400'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-7">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.fullName}>
                  <input className="input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Adarsh Singh" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
                </Field>
                <Field label="Mobile" error={errors.mobile}>
                  <input className="input" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} placeholder="98XXXXXXXX" />
                </Field>
                <Field label="Date of Birth" error={errors.dob}>
                  <input className="input" type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} />
                </Field>
                <Field label="Gender">
                  <select className="input" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </Field>
                <Field label="State">
                  <select className="input" value={form.state} onChange={(e) => update('state', e.target.value)}>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Domicile">
                  <select className="input" value={form.domicile} onChange={(e) => update('domicile', e.target.value)}>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Category">
                  <select className="input" value={form.category} onChange={(e) => update('category', e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Family Annual Income (₹)">
                  <input className="input" type="number" value={form.familyIncome} onChange={(e) => update('familyIncome', e.target.value)} placeholder="220000" />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Education</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Course">
                  <select className="input" value={form.course} onChange={(e) => update('course', e.target.value)}>
                    {COURSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Branch" error={errors.branch}>
                  <input className="input" value={form.branch} onChange={(e) => update('branch', e.target.value)} placeholder="Computer Science & Engineering" />
                </Field>
                <Field label="Year">
                  <select className="input" value={form.year} onChange={(e) => update('year', e.target.value)}>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </Field>
                <Field label="Semester">
                  <input className="input" value={form.semester} onChange={(e) => update('semester', e.target.value)} placeholder="Semester 2" />
                </Field>
                <Field label="Enrollment Number" error={errors.enrollmentNumber}>
                  <input className="input" value={form.enrollmentNumber} onChange={(e) => update('enrollmentNumber', e.target.value)} placeholder="SMS2026CSE0001" />
                </Field>
                <Field label="10th Percentage">
                  <input className="input" type="number" value={form.tenthPercentage} onChange={(e) => update('tenthPercentage', e.target.value)} placeholder="88" />
                </Field>
                <Field label="12th Percentage" error={errors.twelfthPercentage}>
                  <input className="input" type="number" value={form.twelfthPercentage} onChange={(e) => update('twelfthPercentage', e.target.value)} placeholder="82" />
                </Field>
                <Field label="Current CGPA">
                  <input className="input" type="number" step="0.1" value={form.cgpa} onChange={(e) => update('cgpa', e.target.value)} placeholder="8.2" />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Select Your Institution</h2>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  className="input pl-10"
                  placeholder="Search institution by name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              {errors.institutionId && <p className="text-xs text-red-600">{errors.institutionId}</p>}
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {filteredInstitutions.map((inst) => (
                  <button
                    type="button"
                    key={inst.id}
                    onClick={() => update('institutionId', inst.id)}
                    className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                      form.institutionId === inst.id ? 'border-brand-500 bg-brand-50/60' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-semibold text-sm">
                      {inst.code.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{inst.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {inst.location} · {inst.code}
                      </p>
                    </div>
                    {inst.verified && (
                      <span className="chip bg-emerald-50 text-emerald-700 text-[10px] flex-shrink-0">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </button>
                ))}
                {filteredInstitutions.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6">No institutions match your search.</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost text-sm disabled:opacity-0"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button type="button" onClick={next} className="btn-primary text-sm px-6">
              {step === STEPS.length - 1 ? 'Complete Registration' : 'Continue'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
