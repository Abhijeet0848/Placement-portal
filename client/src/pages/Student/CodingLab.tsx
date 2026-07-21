import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../services/api';
import { Code2, Play, ChevronRight, CheckCircle2, XCircle, HelpCircle, Award, TrendingUp, Clock, AlertTriangle, Flag, ArrowLeft, ArrowRight, BrainCircuit, Target, CheckSquare, Maximize } from 'lucide-react';

export const CodingLab: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Exam States
  const [activeExam, setActiveExam] = useState<any>(null);
  const [loadingExam, setLoadingExam] = useState(false);

  // Form selections & Test Logic
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<string, string>>({});
  
  // New Test States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(1800); // Default 30 mins
  
  // Anti-cheating
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Timer Ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const examContainerRef = useRef<HTMLDivElement>(null);

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

  // Timer & Anti-cheating Effect
  useEffect(() => {
    if (activeExam && !results) {
      // 1. Timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit(); // Auto-submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Tab Switch Detection
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          setTabSwitches(prev => prev + 1);
          alert('Warning: Tab switching is prohibited! Multiple violations may result in auto-submission.');
        }
      };
      
      // 3. Copy-Paste Protection
      const handleCopyPaste = (e: ClipboardEvent) => {
        e.preventDefault();
        alert('Copy/Paste is disabled during assessments.');
      };

      // 4. Anti-Screenshot & Shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          navigator.clipboard.writeText('');
          alert('Screenshots are disabled during the assessment.');
        }
        if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
          e.preventDefault();
          alert('Screenshots are disabled during the assessment.');
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
          e.preventDefault();
        }
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('copy', handleCopyPaste);
      document.addEventListener('paste', handleCopyPaste);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('copy', handleCopyPaste);
        document.removeEventListener('paste', handleCopyPaste);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [activeExam, results]);

  const requestFullscreen = () => {
    if (!document.fullscreenElement && examContainerRef.current) {
      examContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else if (!document.fullscreenElement) {
      // Fallback
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    }
  };

  const handleSelectExam = async (examId: string) => {
    setLoadingExam(true);
    setErrorMsg('');
    setResults(null);
    setMcqAnswers({});
    setCodingAnswers({});
    setFlaggedQuestions(new Set());
    setCurrentQuestionIndex(0);
    setTabSwitches(0);

    try {
      const data = await api.get(`/exams/${examId}`);
      setActiveExam(data.exam);
      setTimeLeft((data.exam.durationInMinutes || 30) * 60);
      
      const codes: Record<string, string> = {};
      data.exam.codingChallenges?.forEach((c: any) => {
        codes[c._id] = c.starterCode;
      });
      setCodingAnswers(codes);

      setTimeout(() => {
        requestFullscreen();
      }, 100);
    } catch (err) {
      setErrorMsg('Failed to load assessment details.');
    } finally {
      setLoadingExam(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeExam) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const response = await api.post(`/exams/${activeExam._id}/submit`, {
        mcqAnswers,
        codingAnswers,
        timeTakenMinutes: Math.floor(((activeExam.durationInMinutes || 30) * 60 - timeLeft) / 60)
      });
      setResults(response);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const toggleFlag = (index: number) => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(index)) newFlags.delete(index);
    else newFlags.add(index);
    setFlaggedQuestions(newFlags);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalQuestions = (activeExam?.questions?.length || 0) + (activeExam?.codingChallenges?.length || 0);
  const progressPercent = Math.round((Object.keys(mcqAnswers).length / (activeExam?.questions?.length || 1)) * 100);

  const renderExamCard = (ex: any) => {
    let status = 'available';
    const now = new Date();
    let statusText = '';
    
    if (ex.startTime && new Date(ex.startTime) > now) {
      status = 'locked';
      statusText = `Starts: ${new Date(ex.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`;
    } else if (ex.endTime && new Date(ex.endTime) < now) {
      status = 'expired';
      statusText = 'Expired';
    }

    return (
    <div
      key={ex._id}
      onClick={() => {
        if (status === 'available') handleSelectExam(ex._id);
      }}
      className={`glass-card group relative overflow-hidden rounded-3xl p-6 flex flex-col h-full transition-all ${
        status === 'available' ? 'cursor-pointer hover:shadow-lg' : 'opacity-75 cursor-not-allowed grayscale-[0.2]'
      }`}
    >
      {status === 'available' && <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl group-hover:bg-indigo-400/20 transition-all duration-500"></div>}
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className={`text-xl font-bold text-slate-900 leading-tight ${status === 'available' ? 'group-hover:text-indigo-600 transition-colors' : ''}`}>{ex.title}</h4>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold shadow-sm">
            {ex.domain}
          </span>
          <span className={`px-3 py-1 border rounded-lg text-xs font-bold shadow-sm ${
            ex.difficulty === 'Easy' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            ex.difficulty === 'Hard' ? 'bg-rose-50 border-rose-200 text-rose-700' :
            'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            {ex.difficulty}
          </span>
          {ex.durationInMinutes && (
             <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                <Clock className="w-3 h-3" /> {ex.durationInMinutes}m
             </span>
          )}
        </div>

        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Format</span>
            <span className="text-xs text-slate-700 font-semibold mt-0.5">
              {ex.questionsCount} MCQs • {ex.codingChallengesCount} Coding
            </span>
          </div>
          
          {status === 'available' ? (
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-indigo-500/30">
              <Play className="h-4 w-4 ml-0.5" />
            </div>
          ) : (
            <div className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${status === 'locked' ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-rose-50 border-rose-200 text-rose-500'}`}>
              {status === 'locked' ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {statusText}
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-700 font-bold flex items-center justify-center gap-2 animate-pulse-subtle">
          <XCircle className="h-5 w-5" />
          {errorMsg}
        </div>
      )}

      {loading || loadingExam ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Initializing Lab Environment...</p>
        </div>
      ) : !activeExam ? (
        <>
          {/* Premium Hero Header */}
          <div className="glass-card-dark relative overflow-hidden rounded-[2rem] p-10 lg:p-12 border border-slate-700/50">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse-subtle"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                  Skill Assessment Platform
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                  Placement <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Coding Lab</span>
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                  Execute mock coding challenges and aptitude MCQs in an isolated sandbox. Your performance metrics automatically sync with recruiter dashboards for fast-track shortlisting.
                </p>
              </div>
              
              <div className="hidden lg:flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 backdrop-blur-md shadow-2xl animate-float">
                <Code2 className="h-14 w-14 text-indigo-300" />
              </div>
            </div>
          </div>

          {/* Exam Grid */}
          <div className="space-y-12">
            
            {/* Private Screening Tests Section */}
            {exams.filter(ex => ex.isPrivateScreening).length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Target className="h-6 w-6 text-emerald-600" />
                    Company Screening Tests
                  </h4>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full animate-pulse-subtle">
                    Action Required
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams.filter(ex => ex.isPrivateScreening).map(renderExamCard)}
                </div>
              </div>
            )}

            {/* Public Assessments Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Award className="h-6 w-6 text-indigo-600" />
                  Practice Assessments
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.filter(ex => !ex.isPrivateScreening).map(renderExamCard)}
              </div>
            </div>
          </div>
        </>
      ) : !results ? (
        // ACTIVE TEST INTERFACE
        <div ref={examContainerRef} className="min-h-screen bg-slate-50 overflow-y-auto pt-8 px-4 sm:px-8">
          {/* Active Top Bar */}
          <div className="glass-card sticky top-4 z-50 rounded-2xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-200 shadow-xl shadow-slate-200/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{activeExam.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-bold">Progress:</span>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{progressPercent}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {tabSwitches > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold">
                  <AlertTriangle className="h-4 w-4" /> Tab Switches: {tabSwitches}
                </div>
              )}
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono font-bold text-lg ${
                timeLeft < 300 ? 'bg-rose-50 border-rose-500 text-rose-600 animate-pulse' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <Clock className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
            {/* Left Nav Panel */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-3xl border border-slate-200 p-6 sticky top-28 shadow-lg">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-indigo-500" /> Assessment Navigator
                </h4>
                
                <div className="grid grid-cols-4 gap-3">
                  {/* MCQ Buttons */}
                  {activeExam.questions?.map((q: any, i: number) => {
                    const isAttempted = mcqAnswers[q._id] !== undefined;
                    const isFlagged = flaggedQuestions.has(i);
                    const isActive = currentQuestionIndex === i;

                    return (
                      <button
                        key={q._id}
                        onClick={() => setCurrentQuestionIndex(i)}
                        className={`h-10 w-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                          isActive
                            ? 'ring-4 ring-indigo-500/30 bg-indigo-600 text-white shadow-lg'
                            : isFlagged
                            ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                            : isAttempted
                            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                            : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                  
                  {/* Coding Buttons */}
                  {activeExam.codingChallenges?.map((c: any, cIdx: number) => {
                    const actualIndex = activeExam.questions.length + cIdx;
                    const isActive = currentQuestionIndex === actualIndex;
                    return (
                      <button
                        key={c._id}
                        onClick={() => setCurrentQuestionIndex(actualIndex)}
                        className={`h-10 w-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                          isActive
                            ? 'ring-4 ring-purple-500/30 bg-purple-600 text-white shadow-lg'
                            : 'bg-slate-800 text-white border-2 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Coding Challenge"
                      >
                        <Code2 className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-3 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></div> Attempted</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-white border border-slate-300"></div> Unattempted</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300"></div> Flagged for Review</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-slate-800"></div> Coding Sandbox</div>
                </div>
              </div>
            </div>

            {/* Right Pane: Question / Code Area */}
            <div className="lg:col-span-9 flex flex-col min-h-[600px]">
              
              {currentQuestionIndex < activeExam.questions.length ? (
                // MCQ VIEW
                <div className="glass-card rounded-3xl p-8 border border-slate-200 shadow-xl flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold shadow-sm">
                        Category: {activeExam.questions[currentQuestionIndex].category}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                        <Target className="h-3 w-3" /> +{activeExam.questions[currentQuestionIndex].marks} | -{activeExam.questions[currentQuestionIndex].negativeMarks}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFlag(currentQuestionIndex)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                        flaggedQuestions.has(currentQuestionIndex)
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <Flag className={`h-4 w-4 ${flaggedQuestions.has(currentQuestionIndex) ? 'fill-amber-500' : ''}`} />
                      {flaggedQuestions.has(currentQuestionIndex) ? 'Flagged' : 'Mark for Review'}
                    </button>
                  </div>

                  <p className="text-xl font-bold text-slate-900 leading-relaxed mb-8">
                    {activeExam.questions[currentQuestionIndex].questionText}
                  </p>

                  <div className="space-y-4 flex-1">
                    {activeExam.questions[currentQuestionIndex].options?.map((opt: string, optIdx: number) => {
                      const isChecked = mcqAnswers[activeExam.questions[currentQuestionIndex]._id] === optIdx;
                      return (
                        <label
                          key={optIdx}
                          onClick={() => setMcqAnswers(prev => ({ ...prev, [activeExam.questions[currentQuestionIndex]._id]: optIdx }))}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md transform scale-[1.01]'
                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                            isChecked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                          </div>
                          <span className={`text-base font-semibold ${isChecked ? 'text-indigo-950' : 'text-slate-700'}`}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // CODING VIEW
                <div className="glass-card-dark rounded-3xl flex flex-col shadow-2xl ring-1 ring-white/10 flex-1 overflow-hidden">
                  {(() => {
                    const cIdx = currentQuestionIndex - activeExam.questions.length;
                    const c = activeExam.codingChallenges[cIdx];
                    return (
                      <>
                        <div className="bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Code2 className="h-5 w-5 text-indigo-400" />
                            <h4 className="text-base font-bold text-white font-mono">{c.title}</h4>
                          </div>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-bold font-mono">
                            JavaScript Sandbox
                          </span>
                        </div>
                        
                        <div className="bg-slate-800/50 p-6 border-b border-slate-800">
                          <p className="text-sm text-slate-300 font-mono leading-relaxed">
                            {c.description}
                          </p>
                        </div>

                        <div className="flex-1 relative">
                           <textarea
                            value={codingAnswers[c._id]}
                            onChange={(e) => setCodingAnswers({ ...codingAnswers, [c._id]: e.target.value })}
                            spellCheck="false"
                            className="absolute inset-0 w-full h-full bg-[#0b1121] p-6 text-emerald-400 text-sm font-mono border-none outline-none focus:ring-0 leading-loose resize-none placeholder-slate-700"
                            placeholder="// Write your logic here..."
                          />
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

              {/* Prev / Next Controls */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" /> Previous
                </button>

                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
                >
                  Next <ArrowRight className="h-5 w-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      ) : (
        // SUBMISSION REPORT CARDS (Enterprise Analytics View)
        <div className="max-w-6xl mx-auto space-y-8 animate-float" style={{ animationDuration: '6s' }}>
          
          {/* Main Score Header */}
          <div className="glass-card-dark relative overflow-hidden rounded-[2rem] p-10 border border-slate-700/50 shadow-2xl">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <CheckCircle2 className="h-4 w-4" /> Assessment Completed successfully
                </div>
                <h4 className="text-4xl md:text-5xl font-black text-white tracking-tight">AI Diagnostic Report</h4>
                <p className="text-sm text-slate-400 mt-3 max-w-xl">
                  Your results have been processed using advanced AI evaluation. Review your company readiness and skill breakdown below.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-6 text-center min-w-[120px] shadow-inner">
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-2">Skill Score</span>
                  <span className="text-4xl font-black text-white">{results.score}</span><span className="text-lg text-slate-500">/100</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-6 text-center min-w-[120px] shadow-inner">
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-2">Percentile</span>
                  <span className="text-4xl font-black text-indigo-400">{results.percentile}</span><span className="text-lg text-slate-500">%ile</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Skill Analysis (Bar Charts) */}
            <div className="glass-card rounded-[2rem] p-8 border border-slate-200 shadow-xl">
              <h5 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BrainCircuit className="h-6 w-6 text-indigo-600" /> AI Skill Analysis
              </h5>
              
              <div className="space-y-5">
                {results.aiFeedback && Object.entries(results.aiFeedback.skillAnalysis).map(([topic, score]: [string, any]) => (
                  <div key={topic}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-slate-700">{topic}</span>
                      <span className="text-sm font-black text-slate-900">{score}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full rounded-full ${score > 75 ? 'bg-emerald-500' : score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
                <h6 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Recommended Learning Path</h6>
                <ul className="space-y-2">
                  {results.aiFeedback?.learningPath?.map((path: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-indigo-900 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      {path}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Company Readiness */}
            <div className="glass-card rounded-[2rem] p-8 border border-slate-200 shadow-xl">
              <h5 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Award className="h-6 w-6 text-indigo-600" /> Company Readiness
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.aiFeedback && Object.entries(results.aiFeedback.companyReadiness).map(([company, status]: [string, any]) => (
                  <div key={company} className="p-4 rounded-xl border-2 border-slate-100 bg-white shadow-sm flex items-center justify-between">
                    <span className="font-bold text-slate-800">{company}</span>
                    {status === 'Ready' && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><CheckCircle2 className="h-3 w-3" /> Ready</span>}
                    {status === 'Needs Practice' && <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md"><AlertTriangle className="h-3 w-3" /> Practice</span>}
                    {status === 'Not Ready' && <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md"><XCircle className="h-3 w-3" /> Not Ready</span>}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Scoring Breakdown</h5>
                <div className="flex justify-around items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-center">
                    <span className="text-xs text-slate-500 font-bold block mb-1">Theoretical MCQ</span>
                    <span className="text-2xl font-black text-slate-900">{results.mcqScore}%</span>
                  </div>
                  <div className="h-10 w-px bg-slate-300"></div>
                  <div className="text-center">
                    <span className="text-xs text-slate-500 font-bold block mb-1">Practical Coding</span>
                    <span className="text-2xl font-black text-indigo-600">{results.codingScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review (Instant Explanation) */}
          <div className="glass-card rounded-[2rem] p-8 border border-slate-200 shadow-xl">
            <h5 className="text-xl font-bold text-slate-900 mb-6">Detailed Answer Review</h5>
            <div className="space-y-6">
              {results.mcqResults?.map((res: any, idx: number) => {
                const question = activeExam.questions.find((q: any) => q._id === res.questionId);
                return (
                  <div key={res.questionId} className={`p-6 rounded-2xl border-2 ${res.isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <p className="font-bold text-slate-900 text-lg">
                        <span className="text-indigo-500 mr-2">Q{idx + 1}.</span> 
                        {question?.questionText}
                      </p>
                      <span className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 ${res.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {res.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {res.marksObtained > 0 ? `+${res.marksObtained}` : res.marksObtained} Marks
                      </span>
                    </div>

                    <div className="space-y-3 pl-7">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-slate-500 w-24">Your Answer:</span>
                        <span className={res.isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                          {res.submittedAnswer !== undefined && res.submittedAnswer !== null ? question?.options[res.submittedAnswer] : 'Unattempted'}
                        </span>
                      </div>
                      {!res.isCorrect && (
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <span className="text-slate-500 w-24">Correct Answer:</span>
                          <span className="text-emerald-700">{question?.options[res.correctAnswer]}</span>
                        </div>
                      )}
                      
                      <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-wider block mb-1 flex items-center gap-1"><BrainCircuit className="h-3 w-3" /> Explanation</span>
                        <p className="text-sm text-slate-700 leading-relaxed">{res.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-8 pb-10">
            <button
              onClick={() => { setActiveExam(null); setResults(null); }}
              className="px-8 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
            >
              Back to Laboratory Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};