import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { rankOpportunities } from '../../utils/eligibility.js';
import { daysLeft } from '../../utils/format.js';
import OpportunityCard from '../../components/OpportunityCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const FILTERS = ['All', 'Scholarship', 'Internship', 'Fellowship', 'Renewal', 'Institution Opportunity'];
const SORTS = [
  { key: 'match', label: 'Best Match' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'newest', label: 'Newest' },
];

export default function Opportunities() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'explore' ? 'explore' : 'recommended';
  const { session } = useAuth();
  const data = useData();
  const student = data.students.find((s) => s.id === session.id);
  const myDocs = data.documents.filter((d) => d.studentId === session.id);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('match');

  const ranked = useMemo(
    () => (student ? rankOpportunities(student, data.opportunities.filter((o) => o.status === 'Open'), myDocs) : []),
    [student, data.opportunities, myDocs]
  );

  let list = tab === 'recommended' ? ranked.filter((r) => r.evaluation.score >= 60) : ranked;

  if (filter !== 'All') list = list.filter((r) => r.opportunity.type === filter);
  if (search) list = list.filter((r) => r.opportunity.name.toLowerCase().includes(search.toLowerCase()) || r.opportunity.provider.toLowerCase().includes(search.toLowerCase()));

  list = [...list].sort((a, b) => {
    if (sort === 'match') return b.evaluation.score - a.evaluation.score;
    if (sort === 'deadline') return daysLeft(a.opportunity.deadline) - daysLeft(b.opportunity.deadline);
    return b.opportunity.id.localeCompare(a.opportunity.id);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
        <p className="text-slate-500 mt-1 text-sm">Discover scholarships, internships and fellowships matched to your profile.</p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setParams({ tab: 'recommended' })}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'recommended' ? 'bg-white shadow-soft text-brand-700' : 'text-slate-500'}`}
        >
          Recommended For You
        </button>
        <button
          onClick={() => setParams({ tab: 'explore' })}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'explore' ? 'bg-white shadow-soft text-brand-700' : 'text-slate-500'}`}
        >
          Explore Opportunities
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input className="input pl-10" placeholder="Search opportunities..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip text-xs font-medium border transition-colors ${
              filter === f ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No opportunities found"
          description={tab === 'recommended' ? 'Complete your profile and documents to unlock more matches.' : 'Try adjusting your search or filters.'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(({ opportunity, evaluation }) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} evaluation={evaluation} />
          ))}
        </div>
      )}
    </div>
  );
}
