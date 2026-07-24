import React, { useMemo, useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2, Award, TrendingUp, FileText } from 'lucide-react';

export const SkillAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const questions = [
    { prompt: 'What does React use to efficiently update the UI?', options: ['Virtual DOM', 'Database', 'HTTP', 'Shell'] },
    { prompt: 'Which command is used to install dependencies in Node.js projects?', options: ['npm install', 'mkdir', 'git clone', 'cp'] },
    { prompt: 'Which DB is document-oriented?', options: ['MongoDB', 'MySQL', 'Oracle', 'Postgres'] },
    { prompt: 'What is the time complexity of binary search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'] },
    { prompt: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Tree', 'Graph', 'Stack'] },
    { prompt: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Question Language', 'Standard Query Logic', 'System Query Language'] },
    { prompt: 'Which protocol is used for secure communication over a computer network?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'] },
    { prompt: 'In Git, how do you save your changes locally?', options: ['git push', 'git commit', 'git pull', 'git fetch'] },
    { prompt: 'What is the purpose of Docker?', options: ['Database design', 'UI styling', 'Containerization', 'Machine Learning'] },
    { prompt: 'Which HTTP method is typically used to update an existing resource?', options: ['GET', 'POST', 'PUT', 'DELETE'] }
  ];

  const score = useMemo(() => {
    const correct = [0, 0, 0, 1, 3, 0, 2, 1, 2, 2];
    const userAnswers = Object.values(answers);
    return userAnswers.reduce((total, answer, index) => total + (answer === correct[index] ? 1 : 0), 0);
  }, [answers]);

  const handleRetake = () => {
    setAnswers({});
    setTestStarted(false);
    setTestCompleted(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };

  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted) {
        setFullscreenWarning(true);
      } else {
        setFullscreenWarning(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!testStarted) return;
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText(''); // Clear clipboard
        alert('Screenshots are disabled during the assessment.');
      }
      // Block Mac screenshot shortcuts (Meta + Shift + 3/4/5)
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault();
        alert('Screenshots are disabled during the assessment.');
      }
      // Block Print/Save
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (testStarted) e.preventDefault();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [testStarted]);

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

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'from-emerald-500 to-green-500';
    if (score >= 5) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'from-emerald-50 to-green-50';
    if (score >= 5) return 'from-amber-50 to-yellow-50';
    return 'from-rose-50 to-red-50';
  };

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
                Quick MCQs on programming, DBMS, and OS concepts generate a skill score.
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
            <p className="text-slate-600 font-medium">
              This screening test requires fullscreen mode. Please ensure you have a stable connection and are in a distraction-free environment.
            </p>
            <button
              onClick={startTest}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] "
            >
              Start Assessment Now
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
          {questions.map((question, index) => (
            <div key={question.prompt} className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-md">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-slate-900 mb-3">{index + 1}. {question.prompt}</p>
                <div className="grid gap-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold cursor-pointer  ${
                        answers[index] === optionIndex
                          ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <input
                        type="radio"
                        disabled={testCompleted}
                        checked={answers[index] === optionIndex}
                        onChange={() => handleAnswer(index, optionIndex)}
                        className="h-4 w-4 text-indigo-600 disabled:opacity-50"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {!testCompleted ? (
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setTestCompleted(true)}
                disabled={Object.keys(answers).length < questions.length}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Assessment
              </button>
            </div>
          ) : (
            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl bg-gradient-to-br ${getScoreBg(score)} mt-8`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skill Score</p>
                </div>
                <p className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${getScoreColor(score)}`}>
                  {score}/10
                </p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <TrendingUp className="h-4 w-4" />
                    <p className="text-sm font-medium">Use this score to track your readiness for placement rounds and interviews.</p>
                  </div>
                  <div className="flex gap-2 print:hidden">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500  shadow-sm flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" /> Download PDF
                    </button>
                    <button
                      onClick={handleRetake}
                      className="px-4 py-2 text-sm font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50  shadow-sm"
                    >
                      Retake Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
};
