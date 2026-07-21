import React, { useState } from 'react';
import { api } from '../../services/api';
import { Briefcase, DollarSign, Award, PlusCircle, MapPin, Building2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const JobCreator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState<number | ''>('');
  const [minCGPA, setMinCGPA] = useState<number | ''>('');
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
      setSalary('');
      setMinCGPA('');
      setSkills([]);
      
      // Auto clear success message
      setTimeout(() => setMessage(''), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-300/30 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-subtle"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                <Briefcase className="h-6 w-6 text-indigo-300" />
              </div>
              Launch Recruitment Campaign
            </h3>
            <p className="text-sm text-indigo-200 mt-3 max-w-2xl leading-relaxed">
              Define placement criteria, compensation details, and AI eligibility filters. Our system will automatically screen and rank matching students from the campus database.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shadow-lg shadow-emerald-500/5 animate-float">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-600 font-bold">{message}</p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl shadow-lg shadow-rose-500/5">
          <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
          <p className="text-sm text-rose-600 font-bold">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Job Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-100 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm">1</span>
              <h4 className="text-lg font-bold text-slate-800 tracking-wide">Position Details</h4>
            </div>

            <div className="space-y-6">
              {/* Title & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">Job Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead QA Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                    <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">Company Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazon India"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                    <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Location & Compensation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">Location Model</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bangalore (Hybrid)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-emerald-600 transition-colors">Compensation (LPA)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="12.5"
                      value={salary}
                      onChange={(e) => setSalary(Number(e.target.value))}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-bold"
                    />
                    <DollarSign className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 group pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">Description & Requirements</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Outline the day-to-day responsibilities, tech stack, and what makes this role unique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-2xl text-sm bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Filters & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl -z-10"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-sm">2</span>
              <h4 className="text-lg font-bold tracking-wide">Eligibility Engine</h4>
            </div>

            <div className="space-y-8">
              
              {/* CGPA */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Minimum Academic Score</label>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">{cgpaScale}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={minCGPA}
                    onChange={(e) => setMinCGPA(Number(e.target.value))}
                    placeholder={`e.g. 7.5`}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-bold"
                  />
                  <select
                    value={cgpaScale}
                    onChange={(e) => setCgpaScale(e.target.value)}
                    className="px-4 py-3 rounded-xl text-sm font-bold bg-slate-800 border border-slate-700 text-indigo-300 focus:border-indigo-500 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <option value="10.0">10.0 Scale</option>
                    <option value="9.0">9.0 Scale</option>
                    <option value="4.0">4.0 Scale</option>
                    <option value="100%">100% (Percentage)</option>
                  </select>
                </div>
              </div>

              {/* Branches */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Departments</label>
                <div className="flex flex-wrap gap-2">
                  {['MCA', 'B.Tech CSE', 'ECE', 'Mechanical', 'Electrical'].map(branchOption => {
                    const active = branches.includes(branchOption);
                    return (
                      <button
                        key={branchOption}
                        type="button"
                        onClick={() => handleBranchToggle(branchOption)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                          active 
                            ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white scale-105' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {branchOption}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Technical Skills</label>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, AWS"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 px-4 py-3 rounded-xl text-sm bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center group"
                  >
                    <PlusCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2 mt-3 min-h-[40px] p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-500 italic py-1 px-2">No specific skills mandated yet.</span>
                  ) : (
                    skills.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-2 group animate-fade-in">
                        {s}
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="text-indigo-400/50 hover:text-rose-400 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-violet-600 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-3xl text-sm font-black tracking-wide uppercase transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <div className="relative py-5 px-6 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing Campaign...</span>
                </>
              ) : (
                <>
                  <span>Deploy Job Campaign</span>
                  <Award className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </div>
          </button>
        </div>

      </form>
    </div>
  );
};
