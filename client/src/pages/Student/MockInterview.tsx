import React, { useState } from 'react';
import { api } from '../../services/api';
import { Sparkles, Award, Play, Send, Mic, MicOff, MessageSquare } from 'lucide-react';

interface ChatMessage {
  sender: 'AI' | 'Student';
  text: string;
  scores?: {
    confidence: number;
    communication: number;
    technicalAccuracy: number;
    feedback: string;
  };
}

export const MockInterview: React.FC = () => {
  const [domain, setDomain] = useState<'Frontend' | 'Backend' | 'Databases'>('Frontend');
  const [activeSession, setActiveSession] = useState(false);
  
  // Chat feed
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  // Voice toggle
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Speech Recognition setup
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Please use Google Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setCurrentInput(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Summary Report
  const [report, setReport] = useState<any>(null);

  // Seed domain-specific question to start session
  const handleStartSession = () => {
    setActiveSession(true);
    setReport(null);
    setChats([]);

    let startQuestion = '';
    if (domain === 'Frontend') {
      startQuestion = 'Can you explain the differences between the virtual DOM and the real DOM, and how React utilizes it to optimize rendering?';
    } else if (domain === 'Backend') {
      startQuestion = 'What are Node.js streams, and why would you use them over standard file system methods when reading large files?';
    } else if (domain === 'Databases') {
      startQuestion = 'What are indexes in databases, how do B-Trees optimize query runs, and when should you avoid creating them?';
    } else if (domain === 'System Design') {
      startQuestion = 'How would you design a scalable URL shortener service like TinyURL? Discuss the core components, load balancing, and database choices.';
    } else if (domain === 'DevOps') {
      startQuestion = 'Can you explain the concept of containerization using Docker, and how it differs from traditional virtual machines?';
    } else if (domain === 'Machine Learning') {
      startQuestion = 'What is the difference between supervised and unsupervised learning? Can you give a real-world use case for each?';
    } else if (domain === 'Java') {
      startQuestion = 'Can you explain the concept of Garbage Collection in Java and describe how the JVM decides when an object is eligible for garbage collection?';
    } else if (domain === 'Python') {
      startQuestion = 'What is the Global Interpreter Lock (GIL) in Python, and how does it affect multi-threading vs multi-processing?';
    } else if (domain === 'C++') {
      startQuestion = 'What are smart pointers in modern C++ (like std::unique_ptr and std::shared_ptr), and how do they solve memory leak issues?';
    } else if (domain === 'JavaScript') {
      startQuestion = 'Explain the concept of closures in JavaScript. How do they work, and what is a common practical use case for them?';
    } else {
      startQuestion = 'What are indexes in databases, how do B-Trees optimize query runs, and when should you avoid creating them?';
    }

    setChats([
      { sender: 'AI', text: startQuestion }
    ]);
  };

  // Submit Answer & Evaluate
  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || loadingReply) return;

    const answer = currentInput.trim();
    setCurrentInput('');
    
    // Append student answer to chat list
    const updatedChats = [...chats, { sender: 'Student' as const, text: answer }];
    setChats(updatedChats);
    setLoadingReply(true);

    try {
      const lastAiMessage = chats.filter(c => c.sender === 'AI').pop();
      const questionText = lastAiMessage ? lastAiMessage.text : 'Explain software engineering.';

      const response = await api.post('/ai/evaluate-interview', {
        questionText,
        studentAnswer: answer
      });

      const feedback = response.feedback;

      // Append AI reply with feedback scores
      setChats(prev => [
        ...prev,
        {
          sender: 'AI',
          text: feedback.followUpQuestion,
          scores: {
            confidence: feedback.confidence || 7,
            communication: feedback.communication || 7,
            technicalAccuracy: feedback.technicalAccuracy,
            feedback: feedback.feedback,
          }
        }
      ]);
    } catch (err) {
      setChats(prev => [
        ...prev,
        { sender: 'AI', text: 'Evaluation context lost. Let us move to the next question: Can you describe your system design experience?' }
      ]);
    } finally {
      setLoadingReply(false);
    }
  };

  // End interview and generate session feedback scores
  const handleEndSession = () => {
    // Collect all evaluated chat items
    const evaluatedTurns = chats.filter(c => c.sender === 'AI' && c.scores);
    
    if (evaluatedTurns.length === 0) {
      setActiveSession(false);
      return;
    }

    let totalConfidence = 0;
    let totalComm = 0;
    let totalTech = 0;

    evaluatedTurns.forEach(turn => {
      totalConfidence += turn.scores?.confidence || 0;
      totalComm += turn.scores?.communication || 0;
      totalTech += turn.scores?.technicalAccuracy || 0;
    });

    const turnsCount = evaluatedTurns.length;
    const finalReport = {
      avgConfidence: Math.round((totalConfidence / turnsCount) * 10), // out of 100
      avgCommunication: Math.round((totalComm / turnsCount) * 10),
      avgAccuracy: Math.round((totalTech / turnsCount) * 10),
      feedbackSummary: 'You have good conceptual foundations. Focus on providing structured real-world scenarios and avoid short code summaries. Communication and technical accuracy are ready for placements!'
    };

    setReport(finalReport);
    setActiveSession(false);
  };

  return (
    <div className="space-y-6">
      {!activeSession ? (
        // SELECT ZONE OR VIEW COMPLETED REPORTS
        <div className="space-y-6">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Mock Interview Room</h3>
                  <p className="text-base text-slate-700 leading-relaxed mt-1">
                    Test your engineering capabilities. Select a domain, start a voice/text session, and Google Geminis AI will ask questions, rate responses, and provide placement scorecards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start session settings */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Play className="h-5 w-5" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Setup Mock Drive</h4>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Interview Domain</label>
                  <select
                    value={domain}
                    onChange={(e: any) => setDomain(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  >
                    <option value="Frontend">Frontend Engineer (React/DOM)</option>
                    <option value="Backend">Backend Engineer (Node/Streams)</option>
                    <option value="Databases">Database Administrator (SQL/Indexing)</option>
                    <option value="System Design">System Architecture (Scalability/Microservices)</option>
                    <option value="DevOps">DevOps Engineer (Docker/CI-CD)</option>
                    <option value="Machine Learning">Data Scientist / ML (Supervised/Unsupervised)</option>
                    <option value="Java">Java Developer (JVM/Spring)</option>
                    <option value="Python">Python Developer (GIL/Data)</option>
                    <option value="C++">C++ Developer (Memory/Pointers)</option>
                    <option value="JavaScript">JavaScript Developer (Closures/Async)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 border-2 border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs text-indigo-600 font-bold block uppercase">Speech Mode</span>
                    <span className="text-xs text-slate-500 font-medium">Auto reading questions aloud</span>
                  </div>
                  <button
                    onClick={() => setVoiceMode(!voiceMode)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      voiceMode 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg' 
                        : 'border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {voiceMode ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                </div>

                <button
                  onClick={handleStartSession}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Mock Session</span>
                </button>
              </div>
            </div>

            {/* AI Evaluation Report Summary */}
            {report && (
              <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Award className="h-5 w-5" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Interview Session Scorecard</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 shadow-md">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                      <div className="relative z-10 text-center">
                        <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Confidence</span>
                        <span className="text-xl font-black text-indigo-600">{report.avgConfidence}%</span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-md">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                      <div className="relative z-10 text-center">
                        <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Comm Rate</span>
                        <span className="text-xl font-black text-purple-600">{report.avgCommunication}%</span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-md">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                      <div className="relative z-10 text-center">
                        <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Tech Accuracy</span>
                        <span className="text-xl font-black text-emerald-600">{report.avgAccuracy}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl">
                    <p className="text-xs font-bold text-indigo-900 mb-1">AI Placement Verdict:</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{report.feedbackSummary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ACTIVE MOCK CHAT PANEL
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 flex flex-col h-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">AI Corporate Assessor Room</span>
              </div>
              <button
                onClick={handleEndSession}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-105"
              >
                End Interview Session
              </button>
            </div>

            {/* Chats Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chats.map((chat, idx) => {
                const isAi = chat.sender === 'AI';
                return (
                  <div key={idx} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-2`}>
                    <div className={`p-4 rounded-2xl text-sm max-w-2xl leading-relaxed font-medium ${
                      isAi 
                        ? 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 border-2 border-slate-300' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    }`}>
                      {chat.text}
                    </div>

                    {/* Rating widget on AI Response */}
                    {isAi && chat.scores && (
                      <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl space-y-3 max-w-2xl">
                        <div className="flex space-x-6 justify-between text-xs font-bold text-slate-700">
                          <span>Confidence: <strong className="text-indigo-600">{chat.scores.confidence}/10</strong></span>
                          <span>Comm: <strong className="text-purple-600">{chat.scores.communication}/10</strong></span>
                          <span>Technical: <strong className="text-emerald-600">{chat.scores.technicalAccuracy}/10</strong></span>
                        </div>
                        <p className="text-xs text-slate-600 italic leading-relaxed border-t border-slate-200 pt-2">{chat.scores.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {loadingReply && (
                <div className="flex items-center space-x-3 text-sm text-slate-600 py-3">
                  <div className="flex space-x-1.5">
                    <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full animate-bounce"></span>
                    <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                  <span className="font-semibold">AI Evaluator grading answer...</span>
                </div>
              )}
            </div>

            {/* Form message input */}
            <form onSubmit={handleSendAnswer} className="flex space-x-3 p-6 border-t border-slate-200">
              {voiceMode && (
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-3 rounded-xl border-2 transition-all flex-shrink-0 ${
                    isListening 
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                  }`}
                  title="Click to dictate answer"
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
              <input
                type="text"
                placeholder={isListening ? "Listening... Speak now" : "Type your explanation answer here..."}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                disabled={loadingReply}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
              <button
                type="submit"
                disabled={loadingReply}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};