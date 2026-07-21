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
    projects: 'Smart Placement Portal • Full-stack placement management system\nE-commerce Dashboard • React + Node + MongoDB',
    certifications: '',
    achievements: '',
    links: 'github.com/johndoe • linkedin.com/in/johndoe'
  });
  const [preview, setPreview] = useState<string>('');

  const skillList = useMemo(() => form.skills.split(',').map(item => item.trim()).filter(Boolean), [form.skills]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const resumeContent = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @page {
          margin: 0; /* This removes the browser's default headers and footers (date, URL, title) */
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
          }
          .resume-container {
            padding: 20mm !important; /* Restore margins for the printed page */
            max-width: 100% !important;
          }
        }

        .resume-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #111827;
          line-height: 1.6;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          background-color: #ffffff;
          text-align: left;
        }
        .resume-container .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .resume-container .header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          color: #111827;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          line-height: 1.1;
        }
        .resume-container .meta {
          color: #4b5563;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .resume-container .section {
          margin-top: 1.5rem;
        }
        .resume-container .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.25rem;
          margin-bottom: 0.75rem;
        }
        .resume-container .content-text {
          font-size: 0.95rem;
          color: #374151;
          white-space: pre-wrap;
        }
        .resume-container .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .resume-container .skills-list li {
          font-size: 0.85rem;
          font-weight: 600;
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
        }
      </style>
      <div class="resume-container">
        <div class="header">
          <h1>${form.name}</h1>
          <div class="meta">
            ${form.email ? `<span>${form.email}</span>` : ''}
            ${form.phone ? `&nbsp;•&nbsp; <span>${form.phone}</span>` : ''}
            ${form.links ? `&nbsp;•&nbsp; <span>${form.links}</span>` : ''}
          </div>
        </div>
        ${form.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="content-text">${form.summary}</div>
        </div>` : ''}
        ${form.skills ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <ul class="skills-list">
            ${skillList.map(skill => `<li>${skill}</li>`).join('')}
          </ul>
        </div>` : ''}
        ${form.experience ? `
        <div class="section">
          <div class="section-title">Experience</div>
          <div class="content-text">${form.experience}</div>
        </div>` : ''}
        ${form.education ? `
        <div class="section">
          <div class="section-title">Education</div>
          <div class="content-text">${form.education}</div>
        </div>` : ''}
        ${form.projects ? `
        <div class="section">
          <div class="section-title">Projects</div>
          <div class="content-text">${form.projects}</div>
        </div>` : ''}
        ${form.certifications ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          <div class="content-text">${form.certifications}</div>
        </div>` : ''}
        ${form.achievements ? `
        <div class="section">
          <div class="section-title">Achievements</div>
          <div class="content-text">${form.achievements}</div>
        </div>` : ''}
      </div>
    `;

    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${form.name} Resume</title>
        </head>
        <body>
          ${resumeContent}
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Links (GitHub/LinkedIn)</label>
                <input
                  value={form.links}
                  onChange={(e) => setForm({ ...form, links: e.target.value })}
                  placeholder="github.com/username • linkedin.com/in/username"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skills</label>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Node.js, MongoDB (comma separated)"
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

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Certifications (Optional)</label>
              <textarea
                rows={2}
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                placeholder="AWS Certified Solutions Architect&#10;Google Data Analytics Professional"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Achievements (Optional)</label>
              <textarea
                rows={2}
                value={form.achievements}
                onChange={(e) => setForm({ ...form, achievements: e.target.value })}
                placeholder="1st Place in Global Hackathon 2025&#10;Dean's List 2023-2024"
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
                  __html: preview.replace(/<!doctype html>|<html>|<head>.*?<\/head>|<body>|<\/body>|<\/html>/gs, '')
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