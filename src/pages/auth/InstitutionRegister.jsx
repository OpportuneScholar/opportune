import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';

export default function InstitutionRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'Private Engineering College', code: '', email: '', password: '', address: '',
  });
  const { addInstitution } = useData();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    addInstitution({
      name: form.name,
      code: form.code,
      type: form.type,
      email: form.email,
      location: form.address,
      joinLink: `opportune.app/join/${form.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md card p-8 text-center animate-fadeUp">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Registration Submitted</h2>
          <p className="text-sm text-slate-500 mt-2">
            {form.name} has been submitted for verification. A Super Admin will review and approve your institution shortly.
          </p>
          <button onClick={() => navigate('/login?role=institution')} className="btn-primary w-full mt-6">
            Go to Institution Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg animate-fadeUp">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-slate-900">Opportune</span>
        </Link>
        <div className="card p-7">
          <h1 className="text-lg font-semibold text-slate-900">Register Your Institution</h1>
          <p className="text-sm text-slate-500 mt-1">Your registration will be reviewed by a Super Admin before activation.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Institution Name</label>
              <input required className="input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="ABC Institute of Technology" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Institution Type</label>
                <select className="input" value={form.type} onChange={(e) => update('type', e.target.value)}>
                  <option>Private Engineering College</option>
                  <option>Government Polytechnic</option>
                  <option>State University</option>
                  <option>Private Deemed University</option>
                  <option>Institute of National Importance</option>
                </select>
              </div>
              <div>
                <label className="label">AISHE / UDISE Code</label>
                <input required className="input" value={form.code} onChange={(e) => update('code', e.target.value)} placeholder="ABCIT-UP-233" />
              </div>
            </div>
            <div>
              <label className="label">Official Email</label>
              <input required type="email" className="input" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="office@institute.edu" />
            </div>
            <div>
              <label className="label">Password</label>
              <input required type="password" className="input" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea required className="input" rows={2} value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Institution address" />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5">Submit for Verification</button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already registered? <Link to="/login?role=institution" className="text-brand-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
