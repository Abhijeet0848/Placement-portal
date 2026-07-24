import React, { useEffect, useMemo, useState } from 'react';
import { Search as SearchIcon, Briefcase, Users, GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';

export const SearchSystem: React.FC = () => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'students' | 'skills'>('jobs');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.get('/jobs');
        setItems(data.jobs || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return items.filter((item) => {
      if (activeTab === 'jobs') {
        return [item.title, item.company, item.location, item.description].join(' ').toLowerCase().includes(term);
      }
      if (activeTab === 'students') {
        return [item.title, item.company].join(' ').toLowerCase().includes(term);
      }
      return [item.requirements?.skills?.join(' '), item.title].filter(Boolean).join(' ').toLowerCase().includes(term);
    });
  }, [activeTab, items, query]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <SearchIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Search System</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Search jobs, students, companies, and skills from one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
        <div className="relative z-10">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'jobs', label: 'Jobs', icon: Briefcase },
              { key: 'students', label: 'Students', icon: Users },
              { key: 'skills', label: 'Skills', icon: GraduationCap }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, skills, companies..."
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full  mb-4"></div>
          <p className="text-sm font-semibold text-slate-700">Searching the portal...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 text-center">
            <SearchIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700">No results found for this query.</p>
            <p className="text-xs text-slate-500 mt-2">Try adjusting your search terms or filters</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item, index) => (
            <div
              key={item._id || `item-${index}`}
              className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-md hover:shadow-xl  "
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-sm font-bold text-slate-900">{item.title || item.company}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.company || item.description || item.requirements?.skills?.join(', ')}</p>
                {item.location && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                    <TrendingUp className="h-3 w-3" />
                    {item.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
