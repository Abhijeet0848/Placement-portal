import React, { useMemo, useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2, Award, TrendingUp, FileText, ChevronRight } from 'lucide-react';

const SECTIONS = ['Programming', 'Aptitude', 'Reasoning', 'English'] as const;
type Section = typeof SECTIONS[number];

const QUESTION_BANK: Record<Section, { prompt: string, options: string[], answer: number }[]> = {
  'Programming': [
    { prompt: 'What does React use to efficiently update the UI?', options: ['Virtual DOM', 'Database', 'HTTP', 'Shell'], answer: 0 },
    { prompt: 'Which command is used to install dependencies in Node.js projects?', options: ['npm install', 'mkdir', 'git clone', 'cp'], answer: 0 },
    { prompt: 'Which DB is document-oriented?', options: ['MongoDB', 'MySQL', 'Oracle', 'Postgres'], answer: 0 },
    { prompt: 'What is the time complexity of binary search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 1 },
    { prompt: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Tree', 'Graph', 'Stack'], answer: 3 },
  ],
  'Aptitude': [
    { prompt: 'If a train 120m long passes a telegraph pole in 6 seconds, what is its speed?', options: ['72 km/h', '60 km/h', '50 km/h', '80 km/h'], answer: 0 },
    { prompt: 'A can do a piece of work in 10 days and B in 15 days. How long will they take together?', options: ['6 days', '8 days', '12 days', '5 days'], answer: 0 },
    { prompt: 'What is the simple interest on $500 for 4 years at 5% per annum?', options: ['$100', '$120', '$80', '$150'], answer: 0 },
    { prompt: 'If the cost price of 20 articles is equal to the selling price of 15 articles, what is the profit percentage?', options: ['25%', '33.33%', '20%', '30%'], answer: 1 },
    { prompt: 'The average of 5 numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?', options: ['28', '24', '30', '26'], answer: 0 },
  ],
  'Reasoning': [
    { prompt: 'SCD, TEF, UGH, __, WKL. What comes next?', options: ['CMN', 'UJI', 'VIJ', 'IJT'], answer: 2 },
    { prompt: 'Look at this series: 2, 1, (1/2), (1/4)... What number should come next?', options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'], answer: 1 },
    { prompt: 'If A is the brother of B, B is the sister of C, and C is the father of D, how is D related to A?', options: ['Brother', 'Nephew/Niece', 'Cousin', 'Uncle'], answer: 1 },
    { prompt: 'Choose the odd one out:', options: ['Apple', 'Mango', 'Potato', 'Orange'], answer: 2 },
    { prompt: 'If "COMPUTER" is coded as "RFUVQNPC", how is "MEDICINE" coded?', options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'MFEDJJOE'], answer: 0 },
  ],
  'English': [
    { prompt: 'Choose the correct synonym for "ABUNDANT":', options: ['Scarce', 'Plentiful', 'Rare', 'Short'], answer: 1 },
    { prompt: 'Choose the correct antonym for "OBVIOUS":', options: ['Clear', 'Evident', 'Obscure', 'Plain'], answer: 2 },
    { prompt: 'Find the correctly spelt word:', options: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'], answer: 1 },
    { prompt: 'Fill in the blank: She is _____ university student.', options: ['a', 'an', 'the', 'none'], answer: 0 },
    { prompt: 'Which part of the sentence has an error: "He is one of the best player in the team."', options: ['He is', 'one of the best', 'player in the team', 'No error'], answer: 2 },
  ]
};

export const SkillAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);

  const currentSectionName = SECTIONS[sectionIndex];
  const currentQuestions = QUESTION_BANK[currentSectionName];

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted && !testCompleted) {
        setFullscreenWarning(true);
      } else {
        setFullscreenWarning(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!testStarted || testCompleted) return;
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
      if (testStarted && !testCompleted) e.preventDefault();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [testStarted, testCompleted]);

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setTestStarted(true);
    } catch (err) {
      alert("Failed to enter fullscreen. Please enable fullscreen permissions to take the test.");
    }
  };

  const resumeFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setFullscreenWarning(false);
    } catch (err) {
      alert("Please allow fullscreen to continue.");
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSectionIndex(0);
    setTestStarted(false);
    setTestCompleted(false);
  };

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [`${sectionIndex}-${questionIndex}`]: optionIndex }));
  };

  const handleNextSection = () => {
    if (sectionIndex < SECTIONS.length - 1) {
      setSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      setTestCompleted(true);
    }
  };

  const scores = useMemo(() => {
    const breakdown: Record<Section, { score: number, total: number }> = {
      'Programming': { score: 0, total: QUESTION_BANK['Programming'].length },
      'Aptitude': { score: 0, total: QUESTION_BANK['Aptitude'].length },
      'Reasoning': { score: 0, total: QUESTION_BANK['Reasoning'].length },
      'English': { score: 0, total: QUESTION_BANK['English'].length }
    };
    
    let totalScore = 0;
    let totalQuestions = 0;

    SECTIONS.forEach((section, sIdx) => {
      QUESTION_BANK[section].forEach((q, qIdx) => {
        const userAnswer = answers[`${sIdx}-${qIdx}`];
        if (userAnswer === q.answer) {
          breakdown[section].score++;
          totalScore++;
        }
        totalQuestions++;
      });
    });

    const overallPercentage = Math.round((totalScore / totalQuestions) * 100);

    return { breakdown, totalScore, totalQuestions, overallPercentage };
  }, [answers]);

  const getScoreColor = (percent: number) => {
    if (percent >= 80) return 'text-emerald-600';
    if (percent >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (percent: number) => {
    if (percent >= 80) return 'from-emerald-50 to-green-50';
    if (percent >= 50) return 'from-amber-50 to-yellow-50';
    return 'from-rose-50 to-red-50';
  };

  const isSectionComplete = currentQuestions.every((_, qIdx) => answers[`${sectionIndex}-${qIdx}`] !== undefined);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <BrainCircuit className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Skill Assessment Platform</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Complete all sections (Programming, Aptitude, Reasoning, English) to generate your comprehensive skill breakdown.
              </p>
            </div>
          </div>
        </div>
      </div>

      {fullscreenWarning && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
          <div className="bg-white p-8 rounded-3xl max-w-md text-center shadow-2xl">
            <h2 className="text-2xl font-black text-rose-600 mb-4">Warning: Fullscreen Exited</h2>
            <p className="text-slate-700 font-semibold mb-6">
              You must remain in fullscreen mode while taking this assessment. Exiting multiple times may automatically submit your test.
            </p>
            <button 
              onClick={resumeFullscreen} 
              className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg"
            >
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Questions Section */}
      {!testStarted ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-12 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto space-y-6">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Ready to begin?</h3>
            <div className="flex justify-center gap-2 flex-wrap mb-2">
              {SECTIONS.map(s => <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{s}</span>)}
            </div>
            <p className="text-slate-600 font-medium">
              This test consists of 4 distinct sections. It requires fullscreen mode. Please ensure you are in a distraction-free environment.
            </p>
            <button
              onClick={startTest}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Start Full Assessment
            </button>
          </div>
        </div>
      ) : !testCompleted ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          
          <div className="relative z-10">
            {/* Section Progress Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Section {sectionIndex + 1} of {SECTIONS.length}: <span className="text-indigo-600">{currentSectionName}</span>
              </h4>
              <div className="flex gap-2">
                {SECTIONS.map((sec, idx) => (
                  <div key={sec} className={`w-3 h-3 rounded-full ${idx === sectionIndex ? 'bg-indigo-600 ring-4 ring-indigo-100' : idx < sectionIndex ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {currentQuestions.map((question, qIdx) => (
                <div key={question.prompt} className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                  <div className="relative z-10">
                    <p className="text-sm font-bold text-slate-900 mb-3">{qIdx + 1}. {question.prompt}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {question.options.map((option, optIdx) => (
                        <label
                          key={option}
                          className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold cursor-pointer transition-all ${
                            answers[`${sectionIndex}-${qIdx}`] === optIdx
                              ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            checked={answers[`${sectionIndex}-${qIdx}`] === optIdx}
                            onChange={() => handleAnswer(qIdx, optIdx)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-between items-center">
              <p className="text-sm font-semibold text-slate-500">
                {currentQuestions.filter((_, idx) => answers[`${sectionIndex}-${idx}`] !== undefined).length} of {currentQuestions.length} answered
              </p>
              <button
                onClick={handleNextSection}
                disabled={!isSectionComplete}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sectionIndex < SECTIONS.length - 1 ? 'Next Section' : 'Submit Assessment'}
                {sectionIndex < SECTIONS.length - 1 && <ChevronRight className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative overflow-hidden rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-2xl bg-gradient-to-br ${getScoreBg(scores.overallPercentage)}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-black/5 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">Assessment Complete</p>
              </div>
              <h2 className="text-4xl font-black text-slate-900">Your Results Dashboard</h2>
              <p className="text-slate-600 font-medium mt-2 max-w-md">Based on your performance across all 4 categories, here is your skill breakdown.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center min-w-[200px] border border-slate-100">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Overall Score</span>
              <span className={`text-5xl font-black ${getScoreColor(scores.overallPercentage)}`}>{scores.overallPercentage}%</span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SECTIONS.map(section => {
              const secScore = scores.breakdown[section].score;
              const secTotal = scores.breakdown[section].total;
              const secPercent = Math.round((secScore / secTotal) * 100);
              return (
                <div key={section} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-800 text-lg">{section}</span>
                    <span className={`font-black text-xl ${getScoreColor(secPercent)}`}>{secPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${secPercent >= 80 ? 'bg-emerald-500' : secPercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${secPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-2 text-right">{secScore} / {secTotal} Correct</span>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-4 bg-white/50 p-6 rounded-2xl border border-white/50">
            <div className="flex items-center gap-3 text-slate-700">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              <p className="text-sm font-semibold max-w-md">Use these section metrics to identify your weak spots. Employers will value a balanced scorecard.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" /> Save PDF
              </button>
              <button
                onClick={handleRetake}
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm text-slate-700"
              >
                Retake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
