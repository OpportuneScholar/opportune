import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Target, FileStack, BrainCircuit, BellRing, ArrowRight,
  UserPlus, UploadCloud, Sparkles, ShieldCheck, ExternalLink,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    title: 'Personalized Opportunities',
    desc: 'Find scholarships based on your course, marks, income and location — matched automatically.',
  },
  {
    icon: FileStack,
    title: 'One-Time Document Vault',
    desc: 'Upload commonly required documents once and reuse them across every application.',
  },
  {
    icon: BrainCircuit,
    title: 'Eligibility Check',
    desc: 'See exactly why an opportunity matches you, criterion by criterion — never a mystery score.',
  },
  {
    icon: BellRing,
    title: 'Deadline Alerts',
    desc: 'Stay ahead of every important date with a single, organized timeline.',
  },
];

const STEPS = [
  { icon: UserPlus, title: 'Create your profile', desc: 'Enter your details once — education, income, category.' },
  { icon: UploadCloud, title: 'Upload documents', desc: 'Build your document vault so it is ready whenever needed.' },
  { icon: Sparkles, title: 'Discover matched opportunities', desc: 'See scholarships and internships ranked by fit.' },
  { icon: ShieldCheck, title: 'Check eligibility', desc: 'Understand precisely what is missing before you apply.' },
  { icon: ExternalLink, title: 'Apply through the official portal', desc: 'Opportune prepares you; the official site receives your application.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <CheckCircle2 className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-slate-900">Opportune</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="chip bg-brand-50 text-brand-700 mx-auto mb-6 text-xs font-semibold">
            Built for SIH 2026 · Student Opportunity Platform
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight animate-fadeUp">
            Opportune
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-display font-semibold text-brand-700 animate-fadeUp" style={{ animationDelay: '80ms' }}>
            Discover. Prepare. Apply. Never Miss an Opportunity.
          </p>
          <p className="mt-5 max-w-xl mx-auto text-slate-500 text-base animate-fadeUp" style={{ animationDelay: '140ms' }}>
            Your personal student opportunity assistant for scholarships, documents, eligibility and deadlines — all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeUp" style={{ animationDelay: '200ms' }}>
            <Link to="/register" className="btn-primary px-6 py-3 text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register?role=student&preview=explore" className="btn-secondary px-6 py-3 text-sm">
              Explore Opportunities
            </Link>
            <Link to="/login" className="btn-ghost px-6 py-3 text-sm">Login</Link>
          </div>

          {/* Signature stat strip */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fadeUp" style={{ animationDelay: '260ms' }}>
            {[
              ['12', 'Live opportunities'],
              ['91%', 'Best profile match'],
              ['5', 'Partner institutions'],
              ['75%', 'Fewer missed deadlines*'],
            ].map(([n, l]) => (
              <div key={l} className="card py-4 px-2">
                <p className="font-display text-2xl font-bold text-slate-900">{n}</p>
                <p className="text-xs text-slate-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">*Simulated demo data — see Impact & Analytics.</p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-pop hover:-translate-y-1 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl font-bold text-slate-900 text-center">How it works</h2>
          <p className="text-slate-500 text-center mt-2 text-sm">Five steps from profile to application.</p>
          <div className="mt-10 grid sm:grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="card p-5 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                      <s.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    </div>
                    <span className="text-2xl font-display font-bold text-slate-200">{i + 1}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Opportune helps students prepare and discover opportunities. Applications are submitted through official portals.
        </p>
        <div className="mt-6">
          <Link to="/register" className="btn-primary px-6 py-3 text-sm">
            Create your free profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        Opportune · SIH 2026 Prototype · Not affiliated with any government scholarship portal
      </footer>
    </div>
  );
}
