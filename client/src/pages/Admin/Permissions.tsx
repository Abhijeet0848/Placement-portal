import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Users, Briefcase, FileCheck, Database, Save, Check } from 'lucide-react';
import { api } from '../../services/api';

interface RolePermission {
  role: string;
  color: string;
  icon: any;
  flags: { id: string, label: string, enabled: boolean }[];
}

export const PermissionsPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Default structure
  const [roles, setRoles] = useState<RolePermission[]>([
    { 
      role: 'Student', 
      color: 'indigo',
      icon: Users,
      flags: [
        { id: 'canApplyJobs', label: 'Apply for Jobs', enabled: false },
        { id: 'canViewProfile', label: 'View Profile', enabled: false },
        { id: 'canUseForum', label: 'Participate in Forum', enabled: false }
      ]
    },
    { 
      role: 'Recruiter', 
      color: 'purple',
      icon: Briefcase,
      flags: [
        { id: 'canCreateJobs', label: 'Create Job Postings', enabled: false },
        { id: 'canViewCandidates', label: 'View Candidates', enabled: false },
        { id: 'canSendEmails', label: 'Send Candidate Emails', enabled: false }
      ]
    },
    { 
      role: 'PlacementOfficer', 
      color: 'amber',
      icon: FileCheck,
      flags: [
        { id: 'canVerifyDocs', label: 'Verify Documents', enabled: false },
        { id: 'canManageRules', label: 'Manage Eligibility Rules', enabled: false },
        { id: 'canViewReports', label: 'View Analytics Reports', enabled: false }
      ]
    },
    { 
      role: 'Admin', 
      color: 'rose',
      icon: Database,
      flags: [
        { id: 'canManageUsers', label: 'Full User Management', enabled: false },
        { id: 'canViewLogs', label: 'View System Logs', enabled: false },
        { id: 'canBackupDb', label: 'Backup Database', enabled: false }
      ]
    }
  ]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/permissions');
      if (res.permissions) {
        // Merge fetched data into our state structure
        setRoles(prevRoles => prevRoles.map(r => {
          const fetchedRole = res.permissions.find((p: any) => p.role === r.role);
          if (fetchedRole && fetchedRole.permissions) {
            return {
              ...r,
              flags: r.flags.map(f => ({
                ...f,
                enabled: fetchedRole.permissions[f.id] === true
              }))
            };
          }
          return r;
        }));
      }
    } catch (err) {
      console.error('Failed to fetch permissions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (roleName: string, flagId: string) => {
    setRoles(prev => prev.map(r => {
      if (r.role !== roleName) return r;
      return {
        ...r,
        flags: r.flags.map(f => f.id === flagId ? { ...f, enabled: !f.enabled } : f)
      };
    }));
  };

  const handleSave = async (roleName: string) => {
    try {
      setSaving(true);
      const roleObj = roles.find(r => r.role === roleName);
      if (!roleObj) return;

      const permPayload: Record<string, boolean> = {};
      roleObj.flags.forEach(f => {
        permPayload[f.id] = f.enabled;
      });

      await api.put(`/admin/permissions/${roleName}`, { permissions: permPayload });
      setMessage(`${roleName} permissions saved successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Failed to save ${roleName} permissions.`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo': return 'from-indigo-50 to-blue-50 border-indigo-200 text-indigo-700';
      case 'purple': return 'from-purple-50 to-pink-50 border-purple-200 text-purple-700';
      case 'amber': return 'from-amber-50 to-orange-50 border-amber-200 text-amber-700';
      case 'rose': return 'from-rose-50 to-red-50 border-rose-200 text-rose-700';
      default: return 'from-slate-50 to-gray-50 border-slate-200 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full "></div>
        <p className="text-sm text-slate-400 font-semibold">Loading permissions data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-bold text-center  flex items-center justify-center gap-2 shadow-sm">
          <Check className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Permission Management</h1>
            <p className="text-sm text-slate-600 mt-2 font-medium">Configure and verify role-based access control (RBAC) across the platform.</p>
          </div>
          <div className="self-start md:self-auto p-4 rounded-xl border-2 border-indigo-200 bg-white text-indigo-600 shadow-md">
            <KeyRound className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((roleObj) => {
          const Icon = roleObj.icon;
          const colorClasses = getColorClasses(roleObj.color);
          
          return (
            <div 
              key={roleObj.role} 
              className={`relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-6 shadow-xl ${colorClasses}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-40 pointer-events-none"></div>
              
              <div className="relative z-10 flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-wide">{roleObj.role}</h3>
                </div>
                <button
                  onClick={() => handleSave(roleObj.role)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md  font-bold text-sm  active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>

              <div className="relative z-10 space-y-3 bg-white/60 p-4 rounded-2xl border border-white/50">
                {roleObj.flags.map((flag) => (
                  <label key={flag.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-300 ">
                    <span className="text-sm font-bold text-slate-700">{flag.label}</span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={flag.enabled}
                        onChange={() => handleToggle(roleObj.role, flag.id)}
                      />
                      <div className={`block w-10 h-6 rounded-full  ${flag.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full  ${flag.enabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Permissions = PermissionsPanel;
