import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, GraduationCap, Building2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { DEMO_ACCOUNTS } from '../../data/seedData.js';

const TABS = [
  { key: 'student', label: 'Student', icon: GraduationCap, home: '/student/dashboard' },
  { key: 'institution', label: 'Institution', icon: Building2, home: '/institution/dashboard' },
  { key: 'admin', label: 'Admin', icon: ShieldCheck, home: '/admin/dashboard' },
];

export default function Login() {
  const [params] = useSearchParams();
  const initialTab = params.get('role') && TABS.some((t) => t.key === params.get('role')) ? params.get('role') : 'student';
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const activeTab = TABS.find((t) => t.key === tab);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const result = login(tab, email, password);
    if (result.ok) {
      navigate(activeTab.home);
    } else {
      setError(result.error);
    }
  }

  function fillDemo() {
    setEmail(DEMO_ACCOUNTS[tab].email);
    setPassword(DEMO_ACCOUNTS[tab].password);
    setError('');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fadeUp">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-slate-900">Opportune</span>
        </Link>

        <div className="card p-7">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setError(''); }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tab === t.key ? 'bg-white shadow-soft text-brand-700' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>

          <h1 className="text-lg font-semibold text-slate-900">{activeTab.label} Login</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back — sign in to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">{tab === 'institution' ? 'Official Email' : 'Email'}</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <button type="button" className="text-xs text-brand-600 font-medium hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" className="btn-primary w-full py-2.5">Login</button>
          </form>

          <button onClick={fillDemo} className="mt-3 w-full text-xs text-center text-brand-600 font-medium hover:underline">
            Use demo {activeTab.label.toLowerCase()} credentials
          </button>

          <div className="mt-5 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">
            {tab === 'student' && (
              <>Don't have an account? <Link to="/register" className="text-brand-600 font-medium hover:underline">Register</Link></>
            )}
            {tab === 'institution' && (
              <>New institution? <Link to="/institution/register" className="text-brand-600 font-medium hover:underline">Register Institution</Link></>
            )}
            {tab === 'admin' && <span className="text-slate-400">Admin accounts are provisioned by Opportune.</span>}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400">
          Demo: {DEMO_ACCOUNTS[tab].email} / {DEMO_ACCOUNTS[tab].password}
        </div>
      </div>
    </div>
  );
}
