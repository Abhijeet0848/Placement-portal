import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MessageSquare, Calendar, User, MessageCircle, Send, Sparkles, Edit2, Trash2, X } from 'lucide-react';

export const Forum: React.FC = () => {
  const { user } = useAuth();
  
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // New Thread inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'General' | 'Interview' | 'Job' | 'Official'>('General');

  // Reply inputs
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Forum Threads
  const fetchThreads = async () => {
    try {
      const data = await api.get('/forum');
      setThreads(data.discussions || []);
    } catch (err) {
      setErrorMsg('Failed to load discussions thread.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  if (!user) return null;

  // Post Thread
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setErrorMsg('');
    try {
      await api.post('/forum', { title, content, category });
      setTitle('');
      setContent('');
      fetchThreads();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Add Reply
  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || submittingReply || !selectedThread) return;

    setSubmittingReply(true);
    setErrorMsg('');
    try {
      const data = await api.post(`/forum/${selectedThread._id}/reply`, { content: replyContent });
      setReplyContent('');
      setSelectedThread(data.thread);
      fetchThreads();
    } catch (err: any) {
      setErrorMsg('Failed to submit reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEditThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedThread) return;

    setErrorMsg('');
    try {
      const data = await api.put(`/forum/${selectedThread._id}`, { title, content, category });
      setSelectedThread(data.thread);
      setIsEditing(false);
      fetchThreads();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to edit thread.');
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!window.confirm('Are you sure you want to delete this thread?')) return;
    try {
      await api.delete(`/forum/${threadId}`);
      if (selectedThread && selectedThread._id === threadId) {
        setSelectedThread(null);
      }
      fetchThreads();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete thread.');
    }
  };

  const handleStartEdit = (thread: any) => {
    setSelectedThread(thread);
    setTitle(thread.title);
    setContent(thread.content);
    setCategory(thread.category);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle('');
    setContent('');
    setCategory('General');
  };

  const handleSelectThread = (t: any) => {
    setSelectedThread(t);
    setIsEditing(false);
    setTitle('');
    setContent('');
    setCategory('General');
  };



  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Official': return 'from-rose-100 to-red-100 border-rose-300 text-rose-700';
      case 'Interview': return 'from-amber-100 to-yellow-100 border-amber-300 text-amber-700';
      case 'Job': return 'from-emerald-100 to-green-100 border-emerald-300 text-emerald-700';
      default: return 'from-slate-100 to-gray-100 border-slate-300 text-slate-700';
    }
  };

  return (
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
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Discussion Forum</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Ask doubts, share interview reviews, and coordinate prep strategies. Official cell notices are pinned here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl text-sm text-rose-700 font-bold text-center shadow-lg">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Thread Listings */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-semibold text-slate-700">Loading discussions...</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-12 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10 text-center">
                <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-700">No discussions active yet. Start one!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map((t) => (
                <div 
                  key={t._id}
                  onClick={() => handleSelectThread(t)}
                  className={`relative overflow-hidden rounded-2xl border-2 p-5 shadow-md hover:shadow-xl transition-all cursor-pointer ${
                    selectedThread?._id === t._id 
                      ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50' 
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-2 bg-gradient-to-r ${getCategoryColor(t.category)}`}>
                        {t.category}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-start mt-2">
                      <h4 className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-all leading-snug pr-4">
                        {t.title}
                      </h4>
                      {(t.authorId === user?.id || user?.role === 'Admin' || user?.role === 'PlacementOfficer' || t.authorName === user?.name) && (
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleStartEdit(t); }} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteThread(t._id); }} className="text-slate-400 hover:text-rose-600 transition-colors p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-200 mt-3 pt-2.5 text-[10px] text-slate-600">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{t.authorName} ({t.authorRole})</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{t.replies?.length || 0} replies</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Pane */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Thread Detail View or Form */}
          {selectedThread && !isEditing ? (
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10 space-y-4 flex flex-col h-full">
                <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-normal pr-4">{selectedThread.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{selectedThread.authorName} &bull; {new Date(selectedThread.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedThread(null)} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border-2 border-slate-100 whitespace-pre-wrap">
                  {selectedThread.content}
                </p>

                {/* Reply list */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mt-2">
                  {selectedThread.replies?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No replies yet.</p>
                  ) : (
                    selectedThread.replies?.map((rep: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white rounded-xl text-xs leading-relaxed border-2 border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center text-[10px] text-indigo-700 font-bold mb-1.5">
                          <span>{rep.authorName} ({rep.authorRole})</span>
                          <span className="text-slate-400 font-normal">{new Date(rep.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap">{rep.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add reply Form */}
                <form onSubmit={handleAddReply} className="flex space-x-2 border-t border-slate-200 pt-4 mt-auto">
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    disabled={submittingReply}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 border-2 border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={submittingReply}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-1.5"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            // Create/Edit Thread Form
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center text-indigo-600 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    {isEditing ? <Edit2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    <h4 className="text-sm font-bold uppercase tracking-wider">{isEditing ? 'Edit Thread' : 'Create New Thread'}</h4>
                  </div>
                  {isEditing && (
                    <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <form onSubmit={isEditing ? handleEditThread : handleCreateThread} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary question"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    >
                      <option value="General">General Doubts</option>
                      <option value="Interview">Interview Prep experience</option>
                      <option value="Job">Job Bulletins</option>
                      {user.role !== 'Student' && <option value="Official">Official notice</option>}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Discussion Context</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Provide details about the thread topic..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    {isEditing ? 'Save Changes' : 'Post Discussion Thread'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};