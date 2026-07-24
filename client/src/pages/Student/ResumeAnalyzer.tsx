import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FileText, Sparkles, Download, TrendingUp, Award, AlertCircle, CheckCircle } from 'lucide-react';

export const ResumeAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('resume', selected);
    try {
      const data = await api.post('/ai/analyze-resume', formData);
      setResult(data);
      setMessage('Resume analyzed successfully.');
    } catch {
      setMessage('Resume analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-emerald-50 to-green-50';
    if (score >= 60) return 'from-amber-50 to-yellow-50';
    return 'from-rose-50 to-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume Analyzer</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Upload a resume and receive a detailed score, skill gaps, grammar suggestions, and ATS compatibility outlook.
              </p>
            </div>
          </div>

          <label className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg   hover:shadow-xl">
            <Sparkles className="h-5 w-5" />
            {loading ? 'Analyzing...' : 'Upload Resume'}
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
          </label>
          {file && <p className="mt-3 text-sm text-slate-700 font-medium">Selected file: {file.name}</p>}
          {message && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-100 border-2 border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-700">
              <CheckCircle className="h-4 w-4" />
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <>
          {/* Score Cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className={`relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br ${getScoreBg(result.analysis?.score ?? 0)} p-6 shadow-xl`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Resume Score</p>
                </div>
                <p className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${getScoreColor(result.analysis?.score ?? 0)}`}>
                  {result.analysis?.score ?? 0}/100
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Missing Skills</p>
                </div>
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {result.analysis?.missingSkills?.slice(0, 4).join(', ') || 'None'}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Grammar Issues</p>
                </div>
                <p className="text-3xl font-black text-purple-600">{result.analysis?.grammarErrors ?? 0}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-cyan-600" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">ATS Compatibility</p>
                </div>
                <p className="text-3xl font-black text-cyan-600">{result.analysis?.atsCompatibility ?? 0}%</p>
              </div>
            </div>
          </div>

          {/* Suggestions Section */}
          {result?.analysis?.suggestions?.length > 0 && (
            <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <Download className="h-5 w-5" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Resume Strength & Recommendations</h4>
                </div>

                {result.analysis.resumeStrength && (
                  <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-xl">
                    <p className="text-sm font-bold text-slate-900 mb-1">Overall Assessment:</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{result.analysis.resumeStrength}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Actionable Suggestions:</p>
                  <ul className="space-y-2">
                    {result.analysis.suggestions.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-slate-700 leading-relaxed font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
