import React, { useState } from 'react';
import { Building2, Mail, MapPin, Phone, Sparkles, Edit2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const CompanyProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [overview, setOverview] = useState(user?.profile?.experience?.[0] || '');
  const [location, setLocation] = useState(user?.profile?.branch || 'Location not set');
  const [phone, setPhone] = useState(user?.profile?.phone || 'Phone not set');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        profile: {
          ...user?.profile,
          experience: [overview],
          branch: location,
          phone: phone
        }
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Company Profile</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {overview || "No company overview provided."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Verified Partner
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 "
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {isEditing ? (saving ? 'Saving...' : 'Save Details') : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Company overview</h3>
              <p className="text-sm text-slate-500">Core hiring profile and hiring goals</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-800 mb-2">Company Details</p>
              {isEditing ? (
                <textarea 
                  className="w-full p-3 border rounded-xl"
                  rows={4}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Describe your company and hiring goals..."
                />
              ) : (
                <p className="text-slate-600 leading-relaxed">
                  {overview || "Please click 'Edit Profile' to add your company overview and hiring goals."}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Contact & location</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span>{user.email}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-indigo-600" />
              {isEditing ? (
                <input 
                  type="text" 
                  className="p-1 border rounded"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              ) : (
                <span>{user.profile?.phone || phone}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-indigo-600" />
              {isEditing ? (
                <input 
                  type="text" 
                  className="p-1 border rounded w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, India"
                />
              ) : (
                <span>{user.profile?.branch || location}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
