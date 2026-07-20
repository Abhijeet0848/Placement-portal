import React, { useMemo, useState } from 'react';
import { BrainCircuit, CheckCircle2, Award, TrendingUp } from 'lucide-react';

export const SkillAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const questions = [
    { prompt: 'What does React use to efficiently update the UI?', options: ['Virtual DOM', 'Database', 'HTTP', 'Shell'] },
    { prompt: 'Which command is used to install dependencies in Node.js projects?', options: ['npm install', 'mkdir', 'git clone', 'cp'] },
    { prompt: 'Which DB is document-oriented?', options: ['MongoDB', 'MySQL', 'Oracle', 'Postgres'] }
  ];

  const score = useMemo(() => {
    const correct = [0, 0, 0];
    const userAnswers = Object.values(answers);
    return userAnswers.reduce((total, answer, index) => total + (answer === correct[index] ? 1 : 0), 0);
  }, [answers]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const getScoreColor = (score: number) => {
    if (score === 3) return 'from-emerald-500 to-green-500';
    if (score >= 2) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score === 3) return 'from-emerald-50 to-green-50';
    if (score >= 2) return 'from-amber-50 to-yellow-50';
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

      {/* Questions Section */}
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
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold cursor-pointer transition-all ${
                        answers[index] === optionIndex
                          ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={answers[index] === optionIndex}
                        onChange={() => handleAnswer(index, optionIndex)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Score Display */}
          <div className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl bg-gradient-to-br ${getScoreBg(score)}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-indigo-600" />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skill Score</p>
              </div>
              <p className={`text-4xl font-black bg-clip-text text-transparent`} style={{
                backgroundImage: `linear-gradient(to right, ${getScoreColor(score)})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}>
                {score}/3
              </p>
              <div className="mt-3 flex items-center gap-2 text-slate-700">
                <TrendingUp className="h-4 w-4" />
                <p className="text-sm font-medium">Use this score to track your readiness for placement rounds and interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
