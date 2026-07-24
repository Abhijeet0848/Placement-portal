import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Sparkles, Briefcase, MapPin, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export const JobRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await api.get('/jobs/recommended');
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const getRecommendationColor = (rec: string) => {
    if (rec === 'Highly Recommended') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (rec === 'Recommended') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Job Recommendations</h3>
            <p className="text-sm text-slate-400">Personalized job matches based on your skills, CGPA, and profile.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full  mx-auto"></div>
          <p className="text-sm text-slate-400 mt-3">Analyzing your profile...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel rounded-2xl border border-slate-800 p-12 text-center">
          <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No recommended jobs found. Update your profile with skills to get better matches.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="glass-panel rounded-2xl border border-slate-800 p-5 hover:border-indigo-500/30 ">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{job.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{job.company} • <MapPin className="h-3 w-3 inline mr-1" />{job.location}</p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {job.matchedSkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-md text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> {skill}
                      </span>
                    ))}
                    {job.missingSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-md text-[10px] font-bold flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 md:min-w-[140px]">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Match Score</p>
                    <p className="text-2xl font-black text-white">{job.matchScore}%</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getRecommendationColor(job.recommendation)}`}>
                    {job.recommendation}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span className="font-semibold text-white">{job.salary} LPA</span>
                  </div>
                  <Link 
                    to={`/jobs`} 
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
