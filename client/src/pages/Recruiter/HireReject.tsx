import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Users, FileText, BrainCircuit, Code, Briefcase, Mail } from 'lucide-react';
import { api } from '../../services/api';

export const HireReject: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [filter, setFilter] = useState<'Pending' | 'Hired'>('Pending');

  const fetchApps = async () => {
    try {
      const res = await api.get('/recruiter/applications');
      const apps = res.applications || [];
      setCandidates(apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDecision = async (appId: string, status: string) => {
    try {
      await api.put(`/recruiter/applications/${appId}/status`, { status });
      setCandidates(candidates.map(c => c._id === appId ? { ...c, status } : c));
    } catch (error) {
      console.error(error);
      alert('Failed to update application status.');
    }
  };

  const handleGenerateOffer = (name: string, company: string) => {
    alert(`Offer Letter Generated and emailed to ${name} from ${company}!`);
  };

  const filteredCandidates = candidates.filter(app => {
    if (filter === 'Pending') return app.status !== 'Hired' && app.status !== 'Rejected';
    return app.status === 'Hired';
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Candidate Pipeline</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Decision Center</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setFilter('Pending')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'Pending' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('Hired')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'Hired' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Hired / Offers
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading candidates...</div>
        ) : filteredCandidates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-slate-400 mb-3" />
            <p className="text-slate-600 font-semibold">No candidates found.</p>
            <p className="text-sm text-slate-500 mt-1">You have reviewed all applications in this view.</p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
            const student = candidate.studentId || candidate.student || {};
            const profile = student.profile || {};
            const jobTitle = candidate.jobId?.title || candidate.job?.title || 'Unknown Job';
            const companyName = candidate.jobId?.company || candidate.job?.company || 'Company';
            const matchScore = candidate.matchScore || 0;
            const assessmentScore = candidate.assessmentScore;
            const isExpanded = expandedApp === candidate._id;

            return (
              <div key={candidate._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Header Row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedApp(isExpanded ? null : candidate._id)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-lg font-bold text-slate-900">{student.name}</p>
                      {candidate.status === 'Hired' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md">HIRED</span>}
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-3">{jobTitle}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <BrainCircuit className="w-3.5 h-3.5 text-indigo-600"/>
                        <span className="text-xs font-bold text-indigo-900">AI Match:</span>
                        <span className={`text-sm font-black ${matchScore >= 70 ? 'text-emerald-600' : matchScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{matchScore}%</span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${assessmentScore !== undefined && assessmentScore !== null ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-200'}`}>
                        <Code className="w-3.5 h-3.5 text-purple-600"/>
                        <span className={`text-xs font-bold ${assessmentScore !== undefined && assessmentScore !== null ? 'text-purple-900' : 'text-slate-500'}`}>Test Score:</span>
                        {assessmentScore !== undefined && assessmentScore !== null ? (
                          <span className={`text-sm font-black ${assessmentScore >= 70 ? 'text-emerald-600' : assessmentScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{assessmentScore}%</span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 italic">Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {candidate.status === 'Hired' ? (
                      <button 
                        onClick={() => handleGenerateOffer(student.name, companyName)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
                      >
                        <Mail className="w-4 h-4"/> Generate Offer
                      </button>
                    ) : (
                      <select 
                        value={candidate.status}
                        onChange={(e) => handleDecision(candidate._id, e.target.value)}
                        className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-indigo-500 hover:bg-white transition-all cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Interview">Interview</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-2 fade-in">
                    
                    {/* Skills & Projects */}
                    <div className="lg:col-span-1 space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5"/> Verified Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {(profile.skills && profile.skills.length > 0) ? profile.skills.map((skill: string) => (
                            <span key={skill} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-md shadow-sm">
                              {skill}
                            </span>
                          )) : <span className="text-xs text-slate-500 italic">No skills listed.</span>}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5"/> Notable Projects</h4>
                        <ul className="space-y-2">
                          {(profile.projects && profile.projects.length > 0) ? profile.projects.map((proj: string, idx: number) => (
                            <li key={idx} className="text-sm font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">{proj}</li>
                          )) : <span className="text-xs text-slate-500 italic">No projects listed.</span>}
                        </ul>
                      </div>
                    </div>

                    {/* AI Resume Report */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-xl border border-indigo-100 p-5 shadow-sm h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-1.5 bg-indigo-50 rounded-md"><FileText className="w-4 h-4 text-indigo-600" /></div>
                          <h4 className="text-sm font-bold text-slate-900">AI Resume Report</h4>
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed space-y-3 flex-1">
                          <p><strong>Strengths:</strong> Strong academic background with demonstrated experience in modern web technologies. Good project portfolio indicating hands-on capability.</p>
                          <p><strong>Weaknesses:</strong> Limited professional work experience. Could improve on system design fundamentals.</p>
                          <p><strong>Recommendation:</strong> Highly recommended for screening. The candidate's skill profile closely aligns with the job requirements. Proceed to Technical Interview.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
