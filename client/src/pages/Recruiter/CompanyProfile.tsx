import React from 'react';
import { Building2, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

export const CompanyProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Company Profile</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">TalentHub Technologies</h2>
            <p className="mt-2 text-sm text-slate-600">Global product engineering company hiring for full-stack, data, and AI roles.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
            <Sparkles className="h-4 w-4" />
            Verified Partner
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
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-800">Hiring focus</p>
              <p className="mt-1">Frontend, backend, data engineering, and AI product roles.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-800">Preferred candidate profile</p>
              <p className="mt-1">Strong coding skills, practical projects, and strong communication.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Contact & location</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span>recruiting@talenthub.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-indigo-600" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>Bangalore, India • Hybrid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
