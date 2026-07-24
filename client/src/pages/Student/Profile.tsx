import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  FileText, Upload, Plus, Trash2, ExternalLink, Award,
  Phone, GraduationCap, Code2, Sparkles, User, X, Download, Eye
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.profile.phone || '');
  const [address, setAddress] = useState(user?.profile.address || '');
  const [cgpa, setCgpa] = useState(user?.profile.cgpa?.toString() || '');
  const [cgpaScale, setCgpaScale] = useState(user?.profile.cgpaScale || '10.0');
  const [branch, setBranch] = useState(user?.profile.branch || 'B.Tech CSE');
  const [skills, setSkills] = useState<string[]>(user?.profile.skills || []);
  const [experience, setExperience] = useState<string[]>(user?.profile.experience || []);
  const [newSkill, setNewSkill] = useState('');
  const [newExp, setNewExp] = useState('');

  // Resume upload state
  const [uploading, setUploading] = useState(false);
  const [parserResult, setParserResult] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });
  const [certificates, setCertificates] = useState<any[]>(user?.profile.certificates || []);
  const [uploadingCertificates, setUploadingCertificates] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string } | null>(null);

  const handleViewDocument = (dataUrl: string, filename = 'Document.pdf') => {
    if (dataUrl.startsWith('data:')) {
      try {
        const arr = dataUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], {type: mime});
        const url = URL.createObjectURL(blob);
        setPreviewDoc({ url, name: filename });
      } catch(e) {
        setPreviewDoc({ url: dataUrl, name: filename });
      }
    } else {
      setPreviewDoc({ url: dataUrl, name: filename });
    }
  };

  if (!user) return null;

  // Add/remove skills & experience
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddExp = () => {
    if (newExp.trim()) {
      setExperience([...experience, newExp.trim()]);
      setNewExp('');
    }
  };

  const handleRemoveExp = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Submit Profile Form
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage({ text: '', type: '' });
    setIsSaving(true);
    try {
      const updateData: any = {
        name,
        email,
        phone,
        address,
        cgpaScale,
        branch,
        skills,
        experience,
        certificates
      };

      // Only include cgpa if it has a value
      if (cgpa !== '' && cgpa !== undefined && cgpa !== null) {
        updateData.cgpa = Number(cgpa);
      }

      await updateUser(updateData);
      setSaveMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: any) {
      setSaveMessage({ text: `Update failed: ${err.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Resume PDF
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const data = await api.post('/ai/analyze-resume', formData);
      setParserResult(data);

      const parsedSkills = data.parsed?.skills || [];
      const nextSkills = Array.from(new Set([...skills, ...parsedSkills]));

      // Auto populate fields
      if (data.parsed.phone) setPhone(data.parsed.phone);
      if (parsedSkills.length > 0) {
        setSkills(nextSkills);
      }

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

      // Sync state back
      await updateUser({
        phone: data.parsed.phone || phone,
        skills: nextSkills,
        resumeScore: data.analysis?.score || 0,
        resumeUrl: dataUrl || `file://${file.name}`
      });

      setMessage('Resume parsed and analyzed successfully! Profile autofilled.');
    } catch (err: any) {
      setMessage(`Parsing failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCertificates(true);
    setMessage('');

    try {
      // Convert file to Data URL for instant viewing & backend persistence
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

      const certObj = {
        name: file.name,
        url: dataUrl || `file://${file.name}`,
        uploadedAt: new Date().toISOString(),
        issueDate: new Date().toISOString().split('T')[0],
        verified: false,
        type: file.type || 'application/pdf'
      };

      const nextCertificates = [certObj, ...certificates];

      setCertificates(nextCertificates);
      await updateUser({ certificates: nextCertificates });
      setMessage('Certificate uploaded successfully. It is pending verification.');
    } catch (err: any) {
      setMessage(`Certificate upload failed: ${err?.message || err}`);
    } finally {
      setUploadingCertificates(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resume Analyzer Header Box */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-indigo-50 p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume Upload & Parser</h3>
          </div>
          <p className="text-base text-slate-700 leading-relaxed max-w-3xl mb-6">
            Upload your resume PDF. The system will parse candidate details (name, phone, tech stack) using NLP, autofill your form, and give you an immediate ATS scorecard!
          </p>

          {/* Upload Button */}
          <div className="flex items-center space-x-4">
            <label className="group flex cursor-pointer items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <Upload className="h-5 w-5" />
              <span>{uploading ? 'Parsing PDF...' : 'Upload Resume PDF'}</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <span className="text-xs text-slate-600 font-medium">Supported Format: PDF (Max 5MB)</span>
          </div>

          {/* Parser ATS Metrics Card */}
          {parserResult && (
            <div className="mt-6 p-6 bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl space-y-4 shadow-xl">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">ATS Scoreboard & Recommendations</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border-2 border-emerald-200 text-center shadow-md">
                  <span className="text-[10px] font-bold text-slate-700 block uppercase mb-1">ATS Score</span>
                  <span className="text-2xl font-black text-emerald-600">{parserResult.analysis.score}/100</span>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border-2 border-indigo-200 text-center shadow-md">
                  <span className="text-[10px] font-bold text-slate-700 block uppercase mb-1">ATS Compatibility</span>
                  <span className="text-2xl font-black text-indigo-600">{parserResult.analysis.atsCompatibility}%</span>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200 text-center shadow-md">
                  <span className="text-[10px] font-bold text-slate-700 block uppercase mb-1">Grammar Issues</span>
                  <span className="text-2xl font-black text-purple-600">{parserResult.analysis.grammarErrors}</span>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border-2 border-cyan-200 text-center shadow-md">
                  <span className="text-[10px] font-bold text-slate-700 block uppercase mb-1">ATS Strength</span>
                  <span className="text-2xl font-black text-cyan-600">{parserResult.analysis.resumeStrength}</span>
                </div>
              </div>

              {/* Suggestions */}
              {parserResult.analysis.suggestions && (
                <div className="space-y-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                  <p className="text-sm font-bold text-indigo-700">Actionable ATS Suggestions:</p>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mt-2 leading-relaxed">
                    {parserResult.analysis.suggestions.map((s: string, idx: number) => (
                      <li key={idx} className="font-medium">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl text-sm text-emerald-700 font-bold text-center shadow-lg">
          {message}
        </div>
      )}

      {/* Render Uploaded Resume if exists */}
      {user.profile.resumeUrl && (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Your Uploaded Resume</h4>
              <p className="text-xs text-slate-500 mt-1">PDF Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewDocument(user.profile.resumeUrl!, 'Resume.pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Resume</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                await updateUser({ resumeUrl: '' });
                setMessage('Resume deleted successfully.');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-100 text-rose-700 text-sm font-bold rounded-xl shadow-md hover:bg-rose-200 transition-all border border-rose-200"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span>Certificates & Achievements</span>
              </h4>
              <p className="text-base text-slate-600 mt-2">Upload academic, course, and internship certificates to strengthen your placement profile.</p>
            </div>
            <label className="group flex cursor-pointer items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <Upload className="h-4 w-4" />
              <span>{uploadingCertificates ? 'Uploading...' : 'Upload Certificate'}</span>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleCertificateUpload} disabled={uploadingCertificates} className="hidden" />
            </label>
          </div>

          {certificates.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No certificates uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {certificates.map((certificate, index) => (
                <div key={`${certificate.name}-${index}`} className="flex items-center justify-between rounded-xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{certificate.name}</p>
                      <p className="text-xs text-slate-600">
                        Uploaded: {certificate.uploadedAt ? new Date(certificate.uploadedAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {certificate.url && (
                      <button
                        type="button"
                        onClick={() => handleViewDocument(certificate.url, certificate.name)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </button>
                    )}
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${certificate.verified ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-2 border-emerald-300' : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-2 border-amber-300'}`}>
                      {certificate.verified ? 'Verified' : 'Pending'}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const nextCerts = certificates.filter((_, i) => i !== index);
                        setCertificates(nextCerts);
                        await updateUser({ certificates: nextCerts });
                        setMessage('Certificate removed.');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"
                      title="Remove certificate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Info Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic & Contact Details */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          <div className="relative z-10">
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 mb-6">
              <span className="p-2 bg-indigo-100 rounded-xl"><User className="h-5 w-5 text-indigo-600" /></span>
              <span>Basic & Contact Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 99999 99999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Residential Address</label>
                <input
                  type="text"
                  placeholder="123 Tech Park, Bangalore, India"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core details */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
            <div className="relative z-10">
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 mb-6">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              <span>Academic Profile Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Branch/Major</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                >
                  <option value="MCA">MCA</option>
                  <option value="B.Tech CSE">B.Tech CSE</option>
                  <option value="M.Tech CSE">M.Tech CSE</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">CGPA Score</label>
                  <span className="text-[11px] font-semibold text-indigo-600">Scale: {cgpaScale}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={cgpaScale === '9.0' ? 9 : cgpaScale === '4.0' ? 4 : cgpaScale === '100%' ? 100 : 10}
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder={`Score in ${cgpaScale}`}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                  <select
                    value={cgpaScale}
                    onChange={(e) => setCgpaScale(e.target.value)}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 border-2 border-indigo-200 text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    title="Select Grading Scale"
                  >
                    <option value="10.0">10.0 Scale</option>
                    <option value="9.0">9.0 Scale</option>
                    <option value="4.0">4.0 Scale</option>
                    <option value="100%">100% (Percentage)</option>
                  </select>
                </div>
              </div>
            </div>

            </div>


          </div>
        </div>

        {/* Skills & Experience details */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          <div className="relative z-10">
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 mb-6">
              <Code2 className="h-5 w-5 text-purple-600" />
              <span>Tech Stack & Work Experience</span>
            </h4>

            {/* Skill lists */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Programming & Tech Skills</label>
              <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No skills listed yet.</span>
                ) : (
                  skills.map(s => (
                    <span key={s} className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300 text-indigo-700 rounded-lg text-xs font-bold shadow-sm">
                      <span>{s}</span>
                      <button type="button" onClick={() => handleRemoveSkill(s)} className="text-rose-600 hover:text-rose-700 font-extrabold ml-1">×</button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Docker, Python)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Experience list */}
            <div className="space-y-3 mt-6">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience & Projects</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {experience.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No items listed.</p>
                ) : (
                  experience.map((exp, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
                      <span className="text-sm font-semibold text-slate-900 leading-relaxed">{exp}</span>
                      <button type="button" onClick={() => handleRemoveExp(idx)} className="text-rose-600 hover:text-rose-700 flex-shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add project/experience (e.g. Intern at Google)"
                  value={newExp}
                  onChange={(e) => setNewExp(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAddExp}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full lg:w-1/2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-lg font-black shadow-xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>{isSaving ? 'Saving...' : 'Save Entire Profile'}</span>
          </button>
          {saveMessage.text && (
            <div className={`mt-4 w-full lg:w-1/2 p-4 rounded-xl text-sm font-bold text-center shadow-lg ${saveMessage.type === 'success' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 text-emerald-700' : 'bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 text-rose-700'}`}>
              {saveMessage.text}
            </div>
          )}
        </div>
      </form>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                {previewDoc.name}
              </h3>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-200 p-2">
              <iframe 
                src={previewDoc.url} 
                className="w-full h-full border-none rounded-xl bg-white shadow-inner"
                title="Document Preview"
              />
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end bg-slate-50 gap-3">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewDoc.url;
                  link.download = previewDoc.name;
                  link.click();
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};