import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Users, Award, Eye, Trash2, Mail, X, Building2, CheckCircle2, XCircle, QrCode } from 'lucide-react';

export const Verify: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Companies' | 'Students'>('Companies');

  // Student State
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Recruiter/Company State
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');

  const fetchStudents = async () => {
    try {
      const data = await api.get('/auth/students');
      setStudents(data.students || []);
    } catch (err) {
      setErrorMsg('Failed to sync student registers.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const data = await api.get('/admin/users');
      // Filter out only recruiters
      const recruiterUsers = (data.users || []).filter((u: any) => u.role === 'Recruiter');
      setRecruiters(recruiterUsers);
    } catch (err: any) {
      if (err.message === 'Forbidden: Insufficient permissions') {
        setErrorMsg('You do not have permission to view recruiters. Ensure the backend is updated with the latest PlacementOfficer permissions.');
      } else {
        setErrorMsg(err.message || 'Failed to fetch recruiters.');
      }
    } finally {
      setLoadingRecruiters(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchRecruiters();
  }, []);

  const handleVerifyCertificate = async (studentId: string, certIndex: number, verify: boolean) => {
    setErrorMsg('');
    setMessage('');
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const updatedCerts = [...(student.profile.certificates || [])];
      updatedCerts[certIndex] = { ...updatedCerts[certIndex], verified: verify };

      await api.put(`/auth/students/${studentId}/profile`, { certificates: updatedCerts });
      setMessage(`Certificate ${verify ? 'approved' : 'revoked'} successfully.`);
      fetchStudents();
    } catch (err: any) {
      setErrorMsg('Failed to update certificate verification status.');
    }
  };

  const handleDeleteCertificate = async (studentId: string, certIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    setErrorMsg('');
    setMessage('');
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const updatedCerts = [...(student.profile.certificates || [])];
      updatedCerts.splice(certIndex, 1);

      await api.put(`/auth/students/${studentId}/profile`, { certificates: updatedCerts });
      setMessage('Certificate deleted successfully.');
      fetchStudents();
    } catch (err: any) {
      setErrorMsg('Failed to delete certificate.');
    }
  };

  const handleRecruiterApproval = async (recruiterId: string, status: string) => {
    setErrorMsg('');
    setMessage('');
    try {
      await api.put(`/admin/users/${recruiterId}/status`, { status });
      setRecruiters(recruiters.map(r => r.id === recruiterId ? { ...r, status } : r));
      setMessage(`Company ${status} successfully.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setErrorMsg('Failed to update recruiter status.');
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold text-center ">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold text-center">
          {errorMsg}
        </div>
      )}

      <div className="bg-white shadow-sm p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Verification Center</h3>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            Approve incoming recruiter accounts and audit student placement certificates.
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('Companies')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'Companies' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Approve Recruiters
          </button>
          <button 
            onClick={() => setActiveTab('Students')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'Students' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Audit Certificates
          </button>
        </div>
      </div>

      {activeTab === 'Companies' && (
        <div className="space-y-4 animate-in fade-in">
          {loadingRecruiters ? (
            <div className="text-center py-20 text-slate-500">Loading recruiters...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recruiters.map((recruiter) => (
                <div key={recruiter.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{recruiter.profile?.company || recruiter.name || 'Recruiter Account'}</h4>
                        <p className="text-xs text-slate-500">{recruiter.name}</p>
                      </div>
                    </div>
                    {recruiter.status === 'Active' ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase">Approved</span>
                    ) : recruiter.status === 'Blocked' ? (
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md uppercase">Rejected</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md uppercase">Pending</span>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-600 space-y-1">
                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/> {recruiter.email}</p>
                    {recruiter.profile?.website && (
                      <p className="text-indigo-600 hover:underline cursor-pointer text-xs">{recruiter.profile.website}</p>
                    )}
                  </div>

                  {(!recruiter.status || recruiter.status === 'Pending') && (
                    <div className="flex items-center gap-3 mt-2 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => handleRecruiterApproval(recruiter.id, 'Active')}
                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4"/> Approve
                      </button>
                      <button 
                        onClick={() => handleRecruiterApproval(recruiter.id, 'Blocked')}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4"/> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Students' && (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden animate-in fade-in">
          {loadingStudents ? (
            <div className="text-center py-20 text-slate-500">Loading certificates...</div>
          ) : students.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No students registered on the platform.</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="p-4">Name</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Certificate Uploads</th>
                  <th className="p-4">Audit Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {students.map((stud) => {
                  const certs = stud.profile?.certificates || [];
                  return (
                    <tr key={stud.id} className="border-b border-slate-100 hover:bg-slate-50 ">
                      <td className="p-4 font-bold text-slate-900">{stud.name}</td>
                      <td className="p-4">{stud.profile?.branch || 'Not specified'}</td>
                      <td className="p-4 font-bold text-slate-700">{stud.profile?.cgpa || 'N/A'}</td>
                      <td className="p-4">
                        {certs.length === 0 ? (
                          <span className="text-[10px] text-slate-400 italic">No certificates uploaded</span>
                        ) : (
                          certs.map((c: any, cIdx: number) => (
                            <div key={cIdx} className="flex items-center space-x-2 py-0.5">
                              <Award className="h-3.5 w-3.5 text-indigo-500" />
                              <button onClick={() => {
                                setPreviewUrl(c.url);
                                setPreviewName(c.name);
                              }} className="underline hover:text-indigo-600 text-slate-700 truncate max-w-xs text-left">
                                {c.name}
                              </button>
                              {c.verified ? (
                                <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1 border border-emerald-200 rounded font-bold">APPROVED</span>
                              ) : (
                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1 border border-amber-200 rounded font-bold">PENDING</span>
                              )}
                            </div>
                          ))
                        )}
                      </td>
                      <td className="p-4">
                        {certs.map((c: any, cIdx: number) => (
                          <div key={cIdx} className="flex flex-wrap items-center gap-2 mb-1">
                            <button
                              onClick={() => handleVerifyCertificate(stud.id, cIdx, !c.verified)}
                              className={`px-3 py-1 rounded-lg text-[9px] font-bold border  ${
                                c.verified 
                                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                                  : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {c.verified ? 'Revoke Approval' : 'Approve Certificate'}
                            </button>
                            
                            {c.verified && (
                              <button
                                className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                title="View Verification QR Code"
                              >
                                <QrCode className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setPreviewUrl(c.url);
                                setPreviewName(c.name);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 "
                              title="Preview Certificate"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            
                            <a
                              href={`mailto:${stud.email}?subject=Query regarding your certificate: ${c.name}`}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 "
                              title="Send Query"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </a>
  
                            <button
                              onClick={() => handleDeleteCertificate(stud.id, cIdx)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 "
                              title="Delete Certificate"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{previewName || 'Certificate Preview'}</h3>
              <button onClick={() => setPreviewUrl(null)} className="p-1 rounded-lg hover:bg-slate-100 ">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 bg-slate-50 p-4 overflow-auto flex flex-col items-center justify-center min-h-[50vh]">
              {(() => {
                const url = previewUrl.toLowerCase();
                const isPdf = url.endsWith('.pdf') || url.startsWith('data:application/pdf');
                const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/) || url.startsWith('data:image/');

                if (isPdf) {
                  return (
                    <object data={previewUrl} type="application/pdf" className="w-full h-[70vh] rounded border border-slate-200" title={previewName}>
                      <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <p className="text-slate-500 mb-4">Your browser (e.g. Brave) may block inline PDF previews.</p>
                        <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">Open Document</a>
                      </div>
                    </object>
                  );
                } else if (isImage) {
                  return <img src={previewUrl} alt={previewName} className="max-w-full max-h-[70vh] object-contain rounded border border-slate-200 shadow-sm" />;
                } else {
                  return (
                    <div className="text-center p-8">
                      <Award className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
                      <p className="text-slate-600 mb-6">This certificate is an external link and cannot be previewed directly.</p>
                      <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 ">
                        Open in New Tab
                      </a>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
