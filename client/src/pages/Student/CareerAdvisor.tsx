import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Sparkles, FileText, Compass, Copy, CheckSquare, ListTodo } from 'lucide-react';

export const CareerAdvisor: React.FC = () => {
  const { user } = useAuth();

  // Cover letter states
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Roadmap states
  const [interests, setInterests] = useState('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');

  if (!user) return null;

  // Generate Cover Letter
  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company) return;

    setGeneratingLetter(true);
    setErrorMsg('');
    setCoverLetter('');
    setCopiedLetter(false);

    try {
      const data = await api.post('/ai/cover-letter', {
        skills: user.profile.skills || [],
        jobTitle,
        company
      });
      setCoverLetter(data.coverLetter);
    } catch (err: any) {
      setErrorMsg('Failed to generate cover letter.');
    } finally {
      setGeneratingLetter(false);
    }
  };

  // Copy Cover letter to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  // Generate Career roadmap suggestions
  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interests.trim()) return;

    setGeneratingRoadmap(true);
    setErrorMsg('');
    setRoadmap(null);

    try {
      const interestArr = interests.split(',').map(i => i.trim());
      const data = await api.post('/ai/career-roadmap', {
        skills: user.profile.skills || [],
        cgpa: user.profile.cgpa || 8.0,
        interests: interestArr
      });
      setRoadmap(data.recommendations);
    } catch (err: any) {
      setErrorMsg('Failed to generate roadmap suggestions.');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Compass className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Career Guidance</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Get personalized career advice, cover letters, and roadmap guidance powered by AI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl text-sm text-rose-700 font-bold text-center shadow-lg">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cover Letter Generator Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <FileText className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">AI Cover Letter Generator</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter target role credentials to generate a personalized cover letter utilizing your active profile skills.
            </p>

            <form onSubmit={handleGenerateCoverLetter} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backend Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={generatingLetter}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-lg   hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5 " />
                <span>{generatingLetter ? 'Generating Letter...' : 'Generate Cover Letter'}</span>
              </button>
            </form>
          </div>

          {/* Letter results box */}
          {coverLetter && (
            <div className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Generated Letter</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200  flex items-center gap-1.5 border-2 border-slate-200"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{copiedLetter ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-xs text-slate-700 leading-relaxed overflow-x-auto whitespace-pre-wrap p-3 bg-white border-2 border-slate-200 rounded-xl font-mono">
                {coverLetter}
              </pre>
            </div>
          )}
        </div>

        {/* Career Advisor Roadmap suggestions */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Compass className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">AI Career Roadmap Guidance</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provide your domains of interest. Gemini AI will cross-reference your CGPA and skill lists to return career roles and roadmap roadmaps.
            </p>

            <form onSubmit={handleGenerateRoadmap} className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Areas of Interest</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems, Machine Learning, Web Performance"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={generatingRoadmap}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-lg   hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>{generatingRoadmap ? 'Generating Recommendations...' : 'Generate Roadmap'}</span>
              </button>
            </form>
          </div>

          {/* Roadmap results box */}
          {roadmap && (
            <div className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Recommended Career Paths</span>
                <div className="flex flex-wrap gap-2">
                  {roadmap.roles?.map((role: string) => (
                    <span key={role} className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300 text-indigo-700 rounded-lg text-xs font-bold">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roadmap Steps */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4 text-indigo-600" />
                  <span>Actionable Roadmap Tasks</span>
                </span>
                <div className="space-y-2 pl-1">
                  {roadmap.roadmap?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2.5 text-sm">
                      <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 leading-relaxed font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Resources */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-indigo-600" />
                  <span>Recommended Certifications & Tech</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {roadmap.learningResources?.map((res: string) => (
                    <span key={res} className="px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 text-cyan-700 rounded-lg text-xs font-bold">
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
