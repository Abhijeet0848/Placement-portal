import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'AI' | 'Student', text: string }[]>([
    { sender: 'AI', text: "Hi there! I'm the AI Assistant. How can I help you with your career and placements today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newHistory = [...messages, { sender: 'Student' as const, text: userMessage }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        history: newHistory.map(m => ({ sender: m.sender, text: m.text }))
      });
      setMessages(prev => [...prev, { sender: 'AI', text: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'AI', text: "Sorry, I'm having trouble connecting to the servers right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">AI Assistant</h3>
                <p className="text-xs text-slate-300">Smart Placement Portal</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white transition-colors relative z-10">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => {
              const isAi = msg.sender === 'AI';
              return (
                <div key={idx} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] flex gap-2 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-slate-200 mt-1">
                      {isAi ? <Bot className="w-4 h-4 text-slate-600" /> : <User className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className={`px-4 py-3 min-w-[60px] break-words rounded-2xl text-sm leading-relaxed ${
                      isAi 
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none' 
                        : 'bg-indigo-600 text-white shadow-md rounded-tr-none text-left'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] flex gap-2">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-slate-200 mt-1">
                    <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform animate-bounce hover:animate-none"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};
