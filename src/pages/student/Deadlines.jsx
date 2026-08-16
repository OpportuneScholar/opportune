import React, { useState } from 'react';
import { Plus, CalendarClock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { daysLeft } from '../../utils/format.js';
import DeadlineCard from '../../components/DeadlineCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';

export default function Deadlines() {
  const { session } = useAuth();
  const data = useData();
  const myDeadlines = data.deadlines.filter((d) => d.studentId === session.id);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', type: 'Custom' });

  const sorted = [...myDeadlines].sort((a, b) => daysLeft(a.date) - daysLeft(b.date));
  const upcoming = sorted.filter((d) => daysLeft(d.date) >= 0);
  const overdue = sorted.filter((d) => daysLeft(d.date) < 0);

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.date) return;
    data.addDeadline(session.id, form);
    setForm({ title: '', date: '', type: 'Custom' });
    setOpen(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deadlines</h1>
          <p className="text-slate-500 mt-1 text-sm">Every important date, organized in one timeline.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Deadline
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No deadlines yet" description="Deadlines from matched opportunities will appear here automatically." />
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Upcoming</p>
              <div className="space-y-2">
                {upcoming.map((d) => <DeadlineCard key={d.id} deadline={d} />)}
              </div>
            </div>
          )}
          {overdue.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Overdue</p>
              <div className="space-y-2">
                {overdue.map((d) => <DeadlineCard key={d.id} deadline={d} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Custom Deadline">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. College fee payment" />
          </div>
          <div>
            <label className="label">Date</label>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">Add Deadline</button>
        </form>
      </Modal>
    </div>
  );
}
