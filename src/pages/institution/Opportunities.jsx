import React, { useState } from 'react';
import { Plus, Sparkles, Trash2, Pencil } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { DOCUMENT_TYPES } from '../../data/seedData.js';
import { formatDate } from '../../utils/format.js';
import Modal from '../../components/Modal.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const emptyForm = {
  name: '', description: '', eligibleCourses: '', minimumMarks: '', requiredDocuments: [], deadline: '', officialUrl: '',
};

export default function InstitutionOpportunities() {
  const { session } = useAuth();
  const data = useData();
  const institution = data.institutions.find((i) => i.id === session.id);
  const myOpportunities = data.opportunities.filter((o) => o.institutionId === session.id);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleDoc(doc) {
    setForm((f) => ({
      ...f,
      requiredDocuments: f.requiredDocuments.includes(doc)
        ? f.requiredDocuments.filter((d) => d !== doc)
        : [...f.requiredDocuments, doc],
    }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.deadline) return;
    data.addOpportunity({
      name: form.name,
      provider: institution.name,
      type: 'Institution Opportunity',
      description: form.description,
      eligibleCourses: form.eligibleCourses ? form.eligibleCourses.split(',').map((s) => s.trim()) : [],
      eligibleYears: [],
      minimumMarks: Number(form.minimumMarks) || 0,
      incomeLimit: null,
      eligibleCategories: [],
      eligibleStates: [],
      requiredDocuments: form.requiredDocuments,
      deadline: form.deadline,
      officialUrl: form.officialUrl || `https://${institution.name.toLowerCase().replace(/\s+/g, '')}.edu`,
      institutionId: institution.id,
    });
    setForm(emptyForm);
    setOpen(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
          <p className="text-slate-500 mt-1 text-sm">Publish opportunities visible to your eligible connected students.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Opportunity</button>
      </div>

      {myOpportunities.length === 0 ? (
        <EmptyState icon={Sparkles} title="No opportunities published yet" action={<button onClick={() => setOpen(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Opportunity</button>} />
      ) : (
        <div className="card divide-y divide-slate-100">
          {myOpportunities.map((o) => (
            <div key={o.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{o.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Deadline {formatDate(o.deadline)} · {o.requiredDocuments.length} documents required</p>
              </div>
              <button onClick={() => data.deleteOpportunity(o.id)} className="btn-danger text-sm py-1.5"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Opportunity" size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Opportunity Name</label>
            <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Institutional Merit Award" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe eligibility and purpose" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Eligible Courses (comma separated)</label>
              <input className="input" value={form.eligibleCourses} onChange={(e) => update('eligibleCourses', e.target.value)} placeholder="B.Tech CSE, BBA" />
            </div>
            <div>
              <label className="label">Minimum Marks (%)</label>
              <input className="input" type="number" value={form.minimumMarks} onChange={(e) => update('minimumMarks', e.target.value)} placeholder="75" />
            </div>
          </div>
          <div>
            <label className="label">Required Documents</label>
            <div className="flex flex-wrap gap-2">
              {DOCUMENT_TYPES.map((doc) => (
                <button
                  type="button"
                  key={doc}
                  onClick={() => toggleDoc(doc)}
                  className={`chip text-xs border ${form.requiredDocuments.includes(doc) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  {doc}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Deadline</label>
              <input className="input" type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
            </div>
            <div>
              <label className="label">Official Link</label>
              <input className="input" value={form.officialUrl} onChange={(e) => update('officialUrl', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">Publish Opportunity</button>
        </form>
      </Modal>
    </div>
  );
}
