import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const SendEmails: React.FC = () => {
  const [to, setTo] = useState('shortlist@campusmail.com');
  const [subject, setSubject] = useState('Interview Invitation');
  const [message, setMessage] = useState('Hello, we would like to invite you for the next round of interviews. Please confirm your availability.');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSendEmail = async () => {
    if (!to || !subject || !message) {
      alert('Please fill out all fields.');
      return;
    }
    
    setStatus('sending');
    try {
      await api.post('/recruiter/send-email', {
        to,
        subject,
        message
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error(error);
      setStatus('error');
      alert('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Send Emails</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Reach shortlisted candidates</h2>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">To</label>
            <input 
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 " 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              placeholder="student@university.edu"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Subject</label>
            <input 
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 " 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Interview Invitation"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-700">Message</label>
          <textarea 
            rows={6} 
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 " 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button 
            onClick={handleSendEmail}
            disabled={status === 'sending'}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:bg-indigo-400"
          >
            <Send className="h-4 w-4" />
            {status === 'sending' ? 'Sending...' : 'Send Email'}
          </button>
          
          {status === 'success' && (
            <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Email sent successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
