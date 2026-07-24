import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2, Calendar, Clock, BookOpen, Code2, Save, XCircle, CheckCircle2, Upload, Loader2 } from 'lucide-react';

export const ExamCreator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Frontend');
  const [difficulty, setDifficulty] = useState('Medium');
  const [durationInMinutes, setDurationInMinutes] = useState(30);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isPrivateScreening, setIsPrivateScreening] = useState(false);
  const [jobId, setJobId] = useState('');

  const [questions, setQuestions] = useState<any[]>([]);
  const [codingChallenges, setCodingChallenges] = useState<any[]>([]);

  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setParsingPdf(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('exam', file);

    try {
      const res = await api.post('/ai/parse-exam', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.questions && Array.isArray(res.questions)) {
        setQuestions(prev => [...prev, ...res.questions]);
        setStatus({ type: 'success', msg: `Successfully parsed ${res.questions.length} questions from PDF!` });
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to parse PDF.' });
    } finally {
      setParsingPdf(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    // Fetch jobs for dropdown
    const fetchJobs = async () => {
      try {
        const data = await api.get('/jobs');
        setJobs(data.jobs || []);
      } catch (e) {
        console.error('Failed to load jobs');
      }
    };
    fetchJobs();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        category: 'General',
        difficulty: 'Medium',
        marks: 2,
        negativeMarks: 0.5,
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleAddCodingChallenge = () => {
    setCodingChallenges([
      ...codingChallenges,
      {
        title: '',
        description: '',
        starterCode: '',
        testCases: [{ input: '', output: '' }]
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      const payload = {
        title,
        domain,
        difficulty,
        durationInMinutes,
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
        isPrivateScreening: isPrivateScreening && !!jobId,
        jobId: isPrivateScreening ? jobId : undefined,
        questions,
        codingChallenges
      };

      await api.post('/exams', payload);
      setStatus({ type: 'success', msg: 'Exam created successfully!' });
      
      // Reset form
      setTitle('');
      setQuestions([]);
      setCodingChallenges([]);
      setStartTime('');
      setEndTime('');
      setIsPrivateScreening(false);
      setJobId('');
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to create exam.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" /> Exam & Assessment Creator
          </h2>
          <p className="text-sm text-slate-500 mt-1">Design and schedule new assessments for students.</p>
        </div>
      </div>

      {status.msg && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">1. Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Exam Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Weekly Full Stack Challenge" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Domain</label>
              <select value={domain} onChange={e => setDomain(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500">
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="System Design">System Design</option>
                <option value="Aptitude">Aptitude</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock className="h-3 w-3"/> Duration (Mins)</label>
              <input type="number" min="5" value={durationInMinutes} onChange={e => setDurationInMinutes(Number(e.target.value))} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        {/* Scheduling */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-500"/> 2. Scheduling & Access</h3>
          <p className="text-sm text-slate-500 mb-4">Leave blank for on-demand assessments. If scheduled, students cannot access the test outside of this window.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Start Time</label>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">End Time</label>
              <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          
          <div className="pt-4 border-t mt-4 space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPrivateScreening} onChange={e => setIsPrivateScreening(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm font-bold text-slate-700">Make this a Private Screening Test</span>
            </label>
            {isPrivateScreening && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Link to Job Posting</label>
                <select value={jobId} onChange={e => setJobId(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select a job...</option>
                  {jobs.map(job => (
                    <option key={job._id} value={job._id}>{job.title} at {job.company}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">Only students who are Shortlisted for this job will be able to see and take this test.</p>
              </div>
            )}
          </div>
        </div>

        {/* MCQs */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/> 3. Multiple Choice Questions</h3>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-100 cursor-pointer  relative">
                {parsingPdf ? <Loader2 className="h-4 w-4 " /> : <Upload className="h-4 w-4" />}
                {parsingPdf ? 'Parsing...' : 'Upload PDF'}
                <input type="file" accept=".pdf" className="hidden" onChange={handlePDFUpload} disabled={parsingPdf} />
              </label>
              <button type="button" onClick={handleAddQuestion} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100">
                <Plus className="h-4 w-4" /> Add MCQ
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 border rounded-xl bg-slate-50/50 space-y-4 relative">
                <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} className="absolute top-4 right-4 text-rose-500 hover:text-rose-700">
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="font-bold text-indigo-600 mb-2">Question {qIdx + 1}</div>
                
                <input type="text" placeholder="Question Text" value={q.questionText} required onChange={e => { const newQ = [...questions]; newQ[qIdx].questionText = e.target.value; setQuestions(newQ); }} className="w-full px-4 py-2 border rounded-xl" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="Category" value={q.category} onChange={e => { const newQ = [...questions]; newQ[qIdx].category = e.target.value; setQuestions(newQ); }} className="px-4 py-2 border rounded-xl text-sm" />
                  <select value={q.difficulty} onChange={e => { const newQ = [...questions]; newQ[qIdx].difficulty = e.target.value; setQuestions(newQ); }} className="px-4 py-2 border rounded-xl text-sm">
                    <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                  </select>
                  <input type="number" placeholder="Marks (+ve)" value={q.marks} onChange={e => { const newQ = [...questions]; newQ[qIdx].marks = Number(e.target.value); setQuestions(newQ); }} className="px-4 py-2 border rounded-xl text-sm" />
                  <input type="number" step="0.1" placeholder="Negative Marks" value={q.negativeMarks} onChange={e => { const newQ = [...questions]; newQ[qIdx].negativeMarks = Number(e.target.value); setQuestions(newQ); }} className="px-4 py-2 border rounded-xl text-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt: string, optIdx: number) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input type="radio" name={`correct-${qIdx}`} checked={q.correctAnswerIndex === optIdx} onChange={() => { const newQ = [...questions]; newQ[qIdx].correctAnswerIndex = optIdx; setQuestions(newQ); }} />
                      <input type="text" placeholder={`Option ${optIdx + 1}`} value={opt} required onChange={e => { const newQ = [...questions]; newQ[qIdx].options[optIdx] = e.target.value; setQuestions(newQ); }} className="flex-1 px-4 py-2 border rounded-xl text-sm" />
                    </div>
                  ))}
                </div>
                <textarea placeholder="Explanation (Shown after test)" value={q.explanation} onChange={e => { const newQ = [...questions]; newQ[qIdx].explanation = e.target.value; setQuestions(newQ); }} className="w-full px-4 py-2 border rounded-xl text-sm" rows={2} />
              </div>
            ))}
            {questions.length === 0 && <p className="text-sm text-slate-400 italic">No MCQs added yet.</p>}
          </div>
        </div>

        {/* Coding Challenges */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Code2 className="h-5 w-5 text-purple-500"/> 4. Coding Challenges</h3>
            <button type="button" onClick={handleAddCodingChallenge} className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-bold hover:bg-purple-100">
              <Plus className="h-4 w-4" /> Add Challenge
            </button>
          </div>

          <div className="space-y-6">
            {codingChallenges.map((c, cIdx) => (
              <div key={cIdx} className="p-4 border rounded-xl bg-slate-50/50 space-y-4 relative">
                <button type="button" onClick={() => setCodingChallenges(codingChallenges.filter((_, i) => i !== cIdx))} className="absolute top-4 right-4 text-rose-500 hover:text-rose-700">
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="font-bold text-purple-600 mb-2">Challenge {cIdx + 1}</div>
                
                <input type="text" placeholder="Challenge Title" required value={c.title} onChange={e => { const newC = [...codingChallenges]; newC[cIdx].title = e.target.value; setCodingChallenges(newC); }} className="w-full px-4 py-2 border rounded-xl" />
                <textarea placeholder="Description / Problem Statement" required value={c.description} onChange={e => { const newC = [...codingChallenges]; newC[cIdx].description = e.target.value; setCodingChallenges(newC); }} className="w-full px-4 py-2 border rounded-xl text-sm" rows={3} />
                <textarea placeholder="Starter Code" value={c.starterCode} onChange={e => { const newC = [...codingChallenges]; newC[cIdx].starterCode = e.target.value; setCodingChallenges(newC); }} className="w-full px-4 py-2 border rounded-xl text-sm font-mono bg-slate-900 text-emerald-400" rows={4} />

                {/* Test Cases simplified for UI */}
                <div className="text-sm font-bold text-slate-700">Test Cases</div>
                {c.testCases.map((tc: any, tcIdx: number) => (
                  <div key={tcIdx} className="flex items-center gap-2">
                    <input type="text" placeholder="Input (e.g. 123)" required value={tc.input} onChange={e => { const newC = [...codingChallenges]; newC[cIdx].testCases[tcIdx].input = e.target.value; setCodingChallenges(newC); }} className="flex-1 px-4 py-2 border rounded-xl text-sm font-mono" />
                    <input type="text" placeholder="Expected Output" required value={tc.output} onChange={e => { const newC = [...codingChallenges]; newC[cIdx].testCases[tcIdx].output = e.target.value; setCodingChallenges(newC); }} className="flex-1 px-4 py-2 border rounded-xl text-sm font-mono" />
                  </div>
                ))}
              </div>
            ))}
             {codingChallenges.length === 0 && <p className="text-sm text-slate-400 italic">No coding challenges added yet.</p>}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2  shadow-lg hover:shadow-indigo-500/30">
          <Save className="h-5 w-5" />
          {submitting ? 'Creating Assessment...' : 'Publish Assessment'}
        </button>
      </form>
    </div>
  );
}
