import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Users, Award } from 'lucide-react';

export const Verify: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');

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

      await api.put(`/auth/profile`, {
        // Mock DB requires routing profile update details
        certificates: updatedCerts
      });

      setMessage(`Certificate ${verify ? 'approved' : 'revoked'} successfully.`);
      fetchStudents(); // Reload list
    } catch (err: any) {
      setErrorMsg('Failed to update certificate verification status.');
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-400 font-semibold text-center animate-pulse">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold text-center">
          {errorMsg}
        </div>
      )}

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Placement Certificate Auditor</h3>
          <p className="text-xs text-slate-400 mt-1 leading-normal">
            Verify candidate credentials (NPTEL, Coursera, Udemy) and mark verified status. Verification indices display instantly to recruiters.
          </p>
        </div>
        <Users className="h-6 w-6 text-indigo-400" />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : students.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-8">No students registered on the platform.</p>
      ) : (
        <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-850 text-slate-400 font-bold uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Branch</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Certificate Uploads</th>
                <th className="p-4">Audit Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-350">
              {students.map((stud) => {
                const certs = stud.profile?.certificates || [];
                return (
                  <tr key={stud.id} className="border-b border-slate-850/60 hover:bg-slate-900/10 transition-all">
                    <td className="p-4 font-bold text-white">{stud.name}</td>
                    <td className="p-4">{stud.profile?.branch}</td>
                    <td className="p-4 font-bold text-slate-300">{stud.profile?.cgpa}</td>
                    <td className="p-4">
                      {certs.length === 0 ? (
                        <span className="text-[10px] text-slate-500 italic">No certificates uploaded</span>
                      ) : (
                        certs.map((c: any, cIdx: number) => (
                          <div key={cIdx} className="flex items-center space-x-2 py-0.5">
                            <Award className="h-3.5 w-3.5 text-indigo-400" />
                            <a href={c.url} target="_blank" rel="noreferrer" className="underline hover:text-white truncate max-w-xs">{c.name}</a>
                            {c.verified ? (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 border border-emerald-500/20 rounded font-bold">VERIFIED</span>
                            ) : (
                              <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1 border border-amber-500/20 rounded font-bold">PENDING</span>
                            )}
                          </div>
                        ))
                      )}
                    </td>
                    <td className="p-4">
                      {certs.map((c: any, cIdx: number) => (
                        <button
                          key={cIdx}
                          onClick={() => handleVerifyCertificate(stud.id, cIdx, !c.verified)}
                          className={`px-3 py-1 rounded-lg text-[9px] font-bold border transition-all mr-2 ${
                            c.verified 
                              ? 'bg-rose-950/20 border-rose-950/30 text-rose-400 hover:bg-rose-900/10' 
                              : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {c.verified ? 'Revoke Approval' : 'Approve Certificate'}
                        </button>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
