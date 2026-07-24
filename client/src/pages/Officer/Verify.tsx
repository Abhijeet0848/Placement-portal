import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Users, Award, Eye, Trash2, Mail, X } from 'lucide-react';

export const Verify: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const data = await api.get('/auth/students');
      setStudents(data.students || []);
    } catch (err) {
      setErrorMsg('Failed to sync student registers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update verified status for a student certificate
  const handleVerifyCertificate = async (studentId: string, certIndex: number, verify: boolean) => {
    setErrorMsg('');
    setMessage('');
    
    try {
      // Find candidate profile
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const updatedCerts = [...(student.profile.certificates || [])];
      updatedCerts[certIndex] = {
        ...updatedCerts[certIndex],
        verified: verify
      };

      await api.put(`/auth/students/${studentId}/profile`, {
        certificates: updatedCerts
      });

      setMessage(`Certificate ${verify ? 'approved' : 'revoked'} successfully.`);
      fetchStudents(); // Reload list
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

      await api.put(`/auth/students/${studentId}/profile`, {
        certificates: updatedCerts
      });

      setMessage('Certificate deleted successfully.');
      fetchStudents();
    } catch (err: any) {
      setErrorMsg('Failed to delete certificate.');
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

      <div className="bg-white shadow-sm p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Placement Certificate Auditor</h3>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            Verify candidate credentials (NPTEL, Coursera, Udemy) and mark verified status. Verification indices display instantly to recruiters.
          </p>
        </div>
        <Users className="h-6 w-6 text-indigo-500" />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full  mx-auto"></div>
        </div>
      ) : students.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-8">No students registered on the platform.</p>
      ) : (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
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
                  return <iframe src={previewUrl} className="w-full h-[70vh] rounded border border-slate-200" title={previewName} />;
                } else if (isImage) {
                  return <img src={previewUrl} alt={previewName} className="max-w-full max-h-[70vh] object-contain rounded border border-slate-200 shadow-sm" />;
                } else {
                  return (
                    <div className="text-center p-8">
                      <Award className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
                      <p className="text-slate-600 mb-6">This certificate is an external link (e.g. Coursera, Udemy) and cannot be previewed directly in the window.</p>
                      <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 ">
                        Open Certificate in New Tab
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
