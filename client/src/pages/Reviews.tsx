import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Star, DollarSign, Plus, Sparkles, Award, TrendingUp } from 'lucide-react';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // New Review Inputs
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [salary, setSalary] = useState(10);
  const [difficulty, setDifficulty] = useState(3);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [interviewProcess, setInterviewProcess] = useState('');
  const [tips, setTips] = useState('');

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const data = await api.get('/reviews');
      setReviews(data.reviews || []);
    } catch (err) {
      setErrorMsg('Failed to fetch company reviews feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Post Review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');

    try {
      await api.post('/reviews', {
        company,
        rating: Number(rating),
        salary: Number(salary),
        difficulty: Number(difficulty),
        title,
        content,
        interviewProcess,
        tips
      });
      
      // Reset
      setCompany('');
      setTitle('');
      setContent('');
      setInterviewProcess('');
      setTips('');
      setShowForm(false);
      setMessage('Review submitted successfully!');
      fetchReviews();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'from-emerald-500 to-green-500';
    if (rating >= 3) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-red-500';
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'from-emerald-500 to-green-500';
    if (level <= 3) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Award className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Company Reviews</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Explore real interview difficulties, salaries, and candidate advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl text-sm text-emerald-700 font-bold text-center shadow-lg">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl text-sm text-rose-700 font-bold text-center shadow-lg">
          {errorMsg}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Write Review</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-slate-700">Loading company reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 text-center">
            <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700">No corporate reviews uploaded yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r._id} className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 leading-snug">{r.title}</h4>
                    <p className="text-sm text-indigo-600 font-semibold mt-1">{r.company}</p>
                  </div>

                  {/* Overall rating badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${getRatingColor(r.rating)} text-white rounded-lg shadow-md`}>
                    <Star className="h-4 w-4 fill-white" />
                    <span className="text-sm font-bold">{r.rating}/5</span>
                  </div>
                </div>

                {/* Core stats grid */}
                <div className="grid grid-cols-3 gap-3 bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border-2 border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Salary</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-indigo-600" />
                      {r.salary} LPA
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Difficulty</span>
                    <span className={`text-sm font-bold bg-clip-text text-transparent`} style={{
                      backgroundImage: `linear-gradient(to right, ${getDifficultyColor(r.difficulty)})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text'
                    }}>
                      {r.difficulty}/5
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Reviewer</span>
                    <span className="text-sm font-bold text-indigo-600">Amit Sharma</span>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-3 border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-700 leading-relaxed">{r.content}</p>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-xl border-2 border-slate-200">
                    <p className="text-xs font-bold text-slate-700 mb-1">Interview Process:</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.interviewProcess}</p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border-2 border-indigo-200">
                    <p className="text-xs font-bold text-indigo-900 mb-1">Preparation Tips:</p>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{r.tips}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-xl relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles className="h-5 w-5" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Write Employer Review</h4>
                </div>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900 font-extrabold text-xl">×</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazon"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Offered Package (LPA)</label>
                    <input
                      type="number"
                      required
                      value={salary}
                      onChange={(e) => setSalary(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Interview Difficulty (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={difficulty}
                      onChange={(e) => setDifficulty(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Summary Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Challenging MCQ and Node performance rounds"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">General Review Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Summarize your experience working or interviewing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Interview rounds & questions</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. 1 coding exam round, 2 tech rounds, 1 HR manager round..."
                    value={interviewProcess}
                    onChange={(e) => setInterviewProcess(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preparation Tips for Juniors</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="What topics, sites, or roadmaps would you suggest they focus on?"
                    value={tips}
                    onChange={(e) => setTips(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};