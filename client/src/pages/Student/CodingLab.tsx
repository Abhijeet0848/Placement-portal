import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Code2, Play, ChevronRight, CheckCircle2, XCircle, HelpCircle, Award, TrendingUp } from 'lucide-react';

export const CodingLab: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Exam States
  const [activeExam, setActiveExam] = useState<any>(null);
  const [, setLoadingExam] = useState(false);

  // Form selections
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<string, string>>({});

  // Submission Results
  const [results, setResults] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all exams
  const fetchExams = async () => {
    try {
      const data = await api.get('/exams');
      setExams(data.exams || []);
    } catch (err) {
      setErrorMsg('Failed to fetch coding assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Load specific exam
  const handleSelectExam = async (examId: string) => {
    setLoadingExam(true);
    setErrorMsg('');
    setResults(null);
    setMcqAnswers({});
    setCodingAnswers({});

    try {
      const data = await api.get(`/exams/${examId}`);
      setActiveExam(data.exam);

      // Seed starter codes
      const codes: Record<string, string> = {};
      data.exam.codingChallenges?.forEach((c: any) => {
        codes[c._id] = c.starterCode;
      });
      setCodingAnswers(codes);
    } catch (err) {
      setErrorMsg('Failed to load assessment details.');
    } finally {
      setLoadingExam(false);
    }
  };

  // Submit test to backend
  const handleSubmit = async () => {
    if (!activeExam) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const response = await api.post(`/exams/${activeExam._id}/submit`, {
        mcqAnswers,
        codingAnswers
      });
      setResults(response);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl text-sm text-rose-700 font-bold text-center shadow-lg">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-slate-700">Loading coding lab assessments...</p>
        </div>
      ) : !activeExam ? (
        <>
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Code2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Placement Skill Assessments</h3>
                  <p className="text-base text-slate-700 leading-relaxed mt-1">
                    Recruiters require assessment clears. Run online mock coding tests and MCQs. Scores auto-synchronize to your recruiters dashboards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exam List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((ex) => (
              <div
                key={ex._id}
                className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl hover:shadow-xl transition-all cursor-pointer hover:scale-102"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                <div className="relative z-10">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 leading-snug">{ex.title}</h4>
                    <div className="flex space-x-2 mt-3">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-gray-100 border-2 border-slate-300 text-slate-700 rounded-lg text-[10px] font-bold">
                        Domain: {ex.domain}
                      </span>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-blue-100 border-2 border-indigo-300 text-indigo-700 rounded-lg text-[10px] font-bold">
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4">
                    <span className="text-[10px] text-slate-600 font-semibold">
                      {ex.questionsCount} MCQs • {ex.codingChallengesCount} Coding Challenge
                    </span>
                    <button
                      onClick={() => handleSelectExam(ex._id)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center space-x-1"
                    >
                      <span>Start Test</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : !results ? (
        // ACTIVE TEST INTERFACE
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide">{activeExam.title}</h3>
                <p className="text-sm text-slate-600 mt-1">Time limit: None • Evaluation Sandbox Enabled</p>
              </div>
              <button
                onClick={() => {
                  setActiveExam(null);
                  setResults(null);
                }}
                className="px-4 py-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all"
              >
                Back to lab
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: MCQs */}
            <div className="lg:col-span-5 relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10 space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-indigo-600" />
                  <span>Aptitude & DBMS MCQs</span>
                </h4>

                {activeExam.questions?.map((q: any, qIdx: number) => (
                  <div key={q._id} className="space-y-3 border-b border-slate-200 pb-4 last:border-b-0">
                    <p className="text-sm font-bold text-slate-900 leading-normal">
                      Q{qIdx + 1}. {q.questionText}
                    </p>
                    <div className="space-y-2 pl-1">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isChecked = mcqAnswers[q._id] === optIdx;
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              isChecked
                                ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q._id}
                              checked={isChecked}
                              onChange={() => setMcqAnswers({ ...mcqAnswers, [q._id]: optIdx })}
                              className="h-4 w-4 text-indigo-600"
                            />
                            <span className="text-sm font-medium">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Code Editor */}
            <div className="lg:col-span-7 relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Code2 className="h-5 w-5 text-indigo-600" />
                  <span>HackerRank Coding Sandbox</span>
                </h4>

                {activeExam.codingChallenges?.map((c: any) => (
                  <div key={c._id} className="space-y-3">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{c.title}</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed p-3 bg-slate-50 border-2 border-slate-200 rounded-xl">
                        {c.description}
                      </p>
                    </div>

                    {/* Codearea editor */}
                    <div className="relative border-2 border-slate-800 rounded-xl overflow-hidden bg-slate-950 font-mono text-xs">
                      <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase flex justify-between items-center">
                        <span>JavaScript Execution Context</span>
                        <span className="text-indigo-400">read-write</span>
                      </div>
                      <textarea
                        rows={10}
                        value={codingAnswers[c._id]}
                        onChange={(e) => setCodingAnswers({ ...codingAnswers, [c._id]: e.target.value })}
                        className="w-full bg-slate-950 p-4 text-emerald-400 border-none outline-none focus:ring-0 leading-normal font-mono resize-y"
                      />
                    </div>
                  </div>
                ))}

                <div className="border-t border-slate-200 pt-4 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>{submitting ? 'Grading Submission...' : 'Submit Assessment'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // SUBMISSION REPORT CARDS
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-6">
            <div className="text-center space-y-3 border-b border-slate-200 pb-4">
              <h4 className="text-2xl font-black text-slate-900">Graded Assessment Report</h4>
              <div className="inline-flex space-x-8 py-3">
                <div className="text-center">
                  <span className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Aggregate score</span>
                  <span className={`text-3xl font-black bg-clip-text text-transparent`} style={{
                    backgroundImage: `linear-gradient(to right, ${getScoreColor(results.score)})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}>
                    {results.score}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-600 uppercase font-bold block mb-1">MCQ Score</span>
                  <span className="text-3xl font-black text-slate-900">{results.mcqScore}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Coding Score</span>
                  <span className="text-3xl font-black text-emerald-600">{results.codingScore}%</span>
                </div>
              </div>
            </div>

            {/* Coding test cases validation lists */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Test Cases Validation Run</h5>
              {results.codingResults?.map((cRes: any) => (
                <div key={cRes.challengeId} className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 border-2 border-slate-200 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h6 className="text-sm font-bold text-slate-900">{cRes.challengeTitle}</h6>
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${
                      cRes.passed
                        ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-2 border-emerald-300'
                        : 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border-2 border-rose-300'
                    }`}>
                      {cRes.passed ? 'PASSED' : 'FAILED'} ({cRes.testCasesPassed}/{cRes.totalTestCases} Test cases)
                    </span>
                  </div>

                  {/* Steppers */}
                  <div className="space-y-2">
                    {cRes.reports?.map((rep: any, repIdx: number) => (
                      <div key={repIdx} className="flex justify-between items-center text-xs p-3 bg-white border-2 border-slate-200 rounded-xl">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-600 font-bold block uppercase">TEST {repIdx + 1}</span>
                          <p className="text-slate-700">Arguments: <code className="text-indigo-600 font-mono font-bold">{rep.input}</code></p>
                          <p className="text-slate-700">Returned value: <code className="text-slate-900 font-mono font-bold">{rep.actual}</code></p>
                        </div>

                        <div className="text-right">
                          {rep.passed ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-600 text-xs font-bold">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Passed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-rose-600 text-xs font-bold">
                              <XCircle className="h-4 w-4" />
                              <span>Failed (Expected: {rep.expected})</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center border-t border-slate-200 pt-4">
              <button
                onClick={() => {
                  setActiveExam(null);
                  setResults(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Return to Coding Lab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};