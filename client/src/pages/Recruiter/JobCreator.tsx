import React, { useState } from 'react';
import { api } from '../../services/api';
import { Briefcase, DollarSign, Award, PlusCircle } from 'lucide-react';

export const JobCreator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState(12);
  const [minCGPA, setMinCGPA] = useState(7.5);
  const [cgpaScale, setCgpaScale] = useState('10.0');
  const [branches, setBranches] = useState<string[]>(['MCA', 'B.Tech CSE']);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Status feedback
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleBranchToggle = (branch: string) => {
    if (branches.includes(branch)) {
      setBranches(branches.filter(b => b !== branch));
    } else {
      setBranches([...branches, branch]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/jobs', {
        title,
        company,
        location,
        description,
        salary: Number(salary),
        minCGPA: Number(minCGPA),
        branches,
        skills
      });

      setMessage('Job vacancy posted successfully!');
      setTitle('');
      setCompany('');
      setLocation('');
      setDescription('');
      setSkills([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create Recruitment Campaign</h3>
        <p className="text-xs text-slate-400 mt-1 leading-normal">
          Define placement criteria, package detail, and eligibility filters. The checker automatically screens matching students.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-400 font-semibold text-center animate-pulse">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Basic metadata */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-indigo-400" />
            <span>Job Description Metadata</span>
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead QA Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Bangalore (Hybrid)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compensation (LPA)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
                />
                <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description Context</label>
            <textarea
              rows={5}
              required
              placeholder="Describe roles, day-to-day operations, and technical parameters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Eligibility filters */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Award className="h-4 w-4 text-indigo-400" />
            <span>Eligibility & Skills Screeners</span>
          </h4>

          {/* GPA and Branch filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min CGPA Threshold</label>
                <span className="text-[10px] font-semibold text-indigo-400">{cgpaScale}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={minCGPA}
                  onChange={(e) => setMinCGPA(Number(e.target.value))}
                  placeholder={`Min in ${cgpaScale}`}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
                />
                <select
                  value={cgpaScale}
                  onChange={(e) => setCgpaScale(e.target.value)}
                  className="px-2 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-indigo-300 focus:outline-none"
                  title="Select Min CGPA Scale"
                >
                  <option value="10.0">10.0 Scale</option>
                  <option value="9.0">9.0 Scale</option>
                  <option value="4.0">4.0 Scale</option>
                  <option value="100%">100% (Percentage)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eligible Branches</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {['MCA', 'B.Tech CSE', 'ECE'].map(branchOption => {
                  const active = branches.includes(branchOption);
                  return (
                    <button
                      key={branchOption}
                      type="button"
                      onClick={() => handleBranchToggle(branchOption)}
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all border ${
                        active 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {branchOption}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skill filters */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Technical Skills</label>
            <div className="flex flex-wrap gap-1.5 min-h-8 p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl">
              {skills.length === 0 ? (
                <span className="text-[10px] text-slate-500 italic">No skills required yet.</span>
              ) : (
                skills.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-indigo-950/40 border border-indigo-900/30 text-indigo-300 rounded-md text-[10px] font-bold flex items-center space-x-1">
                    <span>{s}</span>
                    <button type="button" onClick={() => handleRemoveSkill(s)} className="text-rose-400 hover:text-rose-300 font-extrabold ml-1">×</button>
                  </span>
                ))
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, Python)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-850 text-indigo-400 hover:text-indigo-300 rounded-xl flex items-center justify-center transition-all"
              >
                <PlusCircle className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center space-x-1.5"
            >
              <span>{loading ? 'Publishing...' : 'Publish Job Posting'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
