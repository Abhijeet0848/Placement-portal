import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User, Mail, Phone, MapPin, GraduationCap, Code2, 
  Briefcase, FileBadge, Award, ExternalLink
} from 'lucide-react';

export const ProfileDetail: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="saas-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 gap-6 mb-6">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-lg text-4xl sm:text-5xl font-black text-slate-800 uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h1>
              <p className="text-slate-600 font-medium text-lg">{user.profile.branch || 'Student'}</p>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-xl text-sm shadow-sm">
                Active Student
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium truncate">{user.email}</span>
            </div>
            {user.profile.phone && (
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium truncate">{user.profile.phone}</span>
              </div>
            )}
            {user.profile.address && (
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium truncate">{user.profile.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Academic Profile */}
          <div className="saas-card p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              Academic Info
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Branch / Major</p>
                <p className="font-semibold text-slate-800">{user.profile.branch || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CGPA Score</p>
                <p className="font-semibold text-slate-800 flex items-baseline gap-1">
                  <span className="text-xl">{user.profile.cgpa || 'N/A'}</span>
                  {user.profile.cgpaScale && <span className="text-xs text-slate-500 font-medium">/ {user.profile.cgpaScale}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="saas-card p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Code2 className="h-4 w-4 text-purple-500" />
              Top Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.profile.skills && user.profile.skills.length > 0 ? (
                user.profile.skills.map((skill: string, index: number) => (
                  <span key={index} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No skills added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience */}
          <div className="saas-card p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-amber-500" />
              Experience & Projects
            </h3>
            <div className="space-y-3">
              {user.profile.experience && user.profile.experience.length > 0 ? (
                user.profile.experience.map((exp: string, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">{exp}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">No experience or projects added yet.</p>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="saas-card p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <FileBadge className="h-4 w-4 text-emerald-500" />
              Verified Certificates
            </h3>
            <div className="space-y-3">
              {user.profile.certificates && user.profile.certificates.length > 0 ? (
                user.profile.certificates.map((cert: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-white rounded-lg shadow-sm shrink-0 border border-slate-100">
                        <Award className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{cert.name || cert.title || 'Certificate'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Uploaded on {cert.uploadedAt ? new Date(cert.uploadedAt).toLocaleDateString() : 'Unknown Date'}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4">
                      {cert.verified ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black tracking-wider uppercase rounded-lg border border-emerald-200">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black tracking-wider uppercase rounded-lg border border-amber-200">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">No certificates uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Resume */}
          {user.profile.resumeUrl && (
            <div className="saas-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">Attached Resume</h3>
                <p className="text-xs text-slate-500">The primary resume document for applications.</p>
              </div>
              <a 
                href={user.profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="saas-button-secondary px-5 py-2.5 text-sm font-bold flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
              >
                View Document <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
