import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Sparkles, Download, Printer, Wand2 } from 'lucide-react';

export const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    summary: 'Motivated computer applications student with strong web development and problem-solving skills.',
    skills: 'React, Node.js, MongoDB, TypeScript',
    experience: 'Built full-stack campus placement portal using React, Node.js, and MongoDB.\nDeveloped feature-rich dashboards for students, recruiters, and placement officers.',
    education: 'MCA • XYZ University • 2024-2026\nBCA • ABC College • 2021-2024',
    projects: 'Smart Placement Portal • Full-stack placement management system\nE-commerce Dashboard • React + Node + MongoDB'
  });
  const [preview, setPreview] = useState<string>('');

  const skillList = useMemo(() => form.skills.split(',').map(item => item.trim()).filter(Boolean), [form.skills]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const html = `<!doctype html>
      <html>
        <head><meta charset="utf-8" /><title>${form.name} Resume</title>
        <style>
          body{font-family:Arial,sans-serif;color:#111827;line-height:1.4;padding:24px;max-width:900px;margin:auto}
          h1{font-size:24px;margin:0 0 4px}
          .meta{color:#4b5563;font-size:13px;margin-bottom:12px}
          .section{margin-top:16px}
          .section h2{font-size:15px;border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-bottom:8px}
          ul{margin:0;padding-left:20px}
          li{margin-bottom:4px}
        </style></head>
        <body>
          <h1>${form.name}</h1>
          <div class="meta">${form.email} • ${form.phone}</div>
          <div class="section"><h2>Professional Summary</h2><p>${form.summary}</p></div>
          <div class="section"><h2>Skills</h2><ul>${skillList.map(skill => `<li>${skill}</li>`).join('')}</ul></div>
          <div class="section"><h2>Experience</h2><p>${form.experience.replace(/\n/g, '<br/>')}</p></div>
          <div class="section"><h2>Education</h2><p>${form.education.replace(/\n/g, '<br/>')}</p></div>
          <div class="section"><h2>Projects</h2><p>${form.projects.replace(/\n/g, '<br/>')}</p></div>
        </body>
      </html>`;
    setPreview(html);
  };

  const handlePrint = () => {
    if (!preview) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;
    printWindow.document.write(preview);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleDownload = () => {
    if (!preview) return;
    const blob = new Blob([preview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(form.name || 'resume').replace(/\s+/g, '-').toLowerCase()}-resume.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume Builder</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Create an ATS-friendly resume profile using a guided form.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Form Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skills</label>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Professional Summary</label>
              <textarea
                rows={3}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience</label>
              <textarea
                rows={4}
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Education</label>
              <textarea
                rows={3}
                value={form.education}
                onChange={(e) => setForm({ ...form, education: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Projects</label>
              <textarea
                rows={3}
                value={form.projects}
                onChange={(e) => setForm({ ...form, projects: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Wand2 className="h-5 w-5 inline mr-2" />
              Generate Resume
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Preview</h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Printer className="h-4 w-4" />
                  Print/PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            {!preview ? (
              <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-sm text-slate-500 text-center">
                Your ATS-friendly resume preview will appear here.
              </div>
            ) : (
              <div
                className="rounded-xl border-2 border-slate-200 bg-white p-6 text-slate-800 shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: preview.replace(/<!doctype html>|<html>|<head>.*?<title>.*?<\/title>.*?<\/head>|<body>|<\/body>|<\/html>/gs, '').replace(/<style>.*?<\/style>/gs, '')
                }}
              >
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};