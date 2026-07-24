import React, { useMemo, useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export const EligibilityChecker: React.FC = () => {
  const [form, setForm] = useState({ cgpa: '8.2', cgpaScale: '10.0', branch: 'MCA', skills: 'React, Node.js, MongoDB' });
  const [result, setResult] = useState<any>(null);

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCgpa = Number(form.cgpa);
    const scaleMax = form.cgpaScale === '9.0' ? 9 : form.cgpaScale === '4.0' ? 4 : form.cgpaScale === '100%' ? 100 : 10;
    
    // Normalize CGPA score to a 10.0 equivalent scale
    const normalizedCGPA = (rawCgpa / scaleMax) * 10;
    const skillList = form.skills.split(',').map((item) => item.trim()).filter(Boolean);
    const reasons: string[] = [];

    if (normalizedCGPA < 7.0) {
      reasons.push(`CGPA (${rawCgpa} on ${form.cgpaScale} scale = ${normalizedCGPA.toFixed(2)}/10.0) is below required cutoff of 7.0/10.0`);
    }
    if (!['MCA', 'CSE', 'ECE', 'B.Tech CSE'].includes(form.branch)) {
      reasons.push('Selected branch is not eligible for this drive');
    }
    if (!skillList.includes('React') || !skillList.includes('Node.js') || !skillList.includes('MongoDB')) {
      reasons.push('Required skills React, Node.js, and MongoDB are missing');
    }

    setResult({ eligible: reasons.length === 0, reasons, normalizedCGPA: normalizedCGPA.toFixed(2) });
  };

  const summary = useMemo(() => {
    if (!result) return null;
    return result.eligible ? 'Eligible for the company drive.' : 'Not eligible for the company drive.';
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Smart Eligibility Checker</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Check whether you qualify for a company's placement requirement automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Form Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10">
            <form onSubmit={checkEligibility} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">CGPA Score</label>
                  <span className="text-[11px] font-semibold text-indigo-600">Scale: {form.cgpaScale}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    value={form.cgpa}
                    onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                    placeholder={`Score in ${form.cgpaScale}`}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                  <select
                    value={form.cgpaScale}
                    onChange={(e) => setForm({ ...form, cgpaScale: e.target.value })}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 border-2 border-indigo-200 text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    <option value="10.0">10.0 Scale</option>
                    <option value="9.0">9.0 Scale</option>
                    <option value="4.0">4.0 Scale</option>
                    <option value="100%">100% (Percentage)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Branch</label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                >
                  <option value="MCA">MCA</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skills</label>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg   hover:shadow-xl"
              >
                <ShieldCheck className="h-5 w-5 inline mr-2" />
                Check Eligibility
              </button>
            </form>
          </div>
        </div>

        {/* Result Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10">
            {!result ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShieldCheck className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-sm font-semibold text-slate-700">Complete the form to get a real-time eligibility verdict.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <TrendingUp className="h-5 w-5" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Eligibility Result</h4>
                </div>

                {/* Status Card */}
                <div className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl ${
                  result.eligible
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50'
                    : 'border-rose-300 bg-gradient-to-br from-rose-50 to-red-50'
                }`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      {result.eligible ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-rose-600" />
                      )}
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Status</p>
                    </div>
                    <p className={`text-lg font-black ${result.eligible ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {summary}
                    </p>
                  </div>
                </div>

                {/* Reasons */}
                {result.reasons.length > 0 && (
                  <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-md">
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Reasons</p>
                    <ul className="space-y-2.5">
                      {result.reasons.map((reason: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
