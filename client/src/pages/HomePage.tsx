import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Brain, Briefcase, FileText, GraduationCap, Sparkles, Users, TrendingUp, Award, Zap } from 'lucide-react';

const features = [
  {
    title: 'AI Resume Analysis',
    description: 'Upload resumes and receive ATS-style feedback, score predictions, and skill suggestions.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Skill Assessments',
    description: 'Practice coding labs and MCQs that align with modern placement drives.',
    icon: GraduationCap,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Mock Interviews',
    description: 'Run AI-guided interview simulations and improve communication and technical accuracy.',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Placement Tracking',
    description: 'Track job applications, recruiter updates, and your placement readiness in one view.',
    icon: Briefcase,
    color: 'from-green-500 to-emerald-500',
  },
];

const stats = [
  { value: '95%', label: 'Placement Rate', icon: TrendingUp },
  { value: '24/7', label: 'AI Support', icon: Zap },
  { value: '500+', label: 'Partner Companies', icon: Briefcase },
  { value: '10k+', label: 'Students Placed', icon: Award },
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 sm:px-6 py-4 shadow-sm gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 text-center sm:text-left w-full sm:w-auto">
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white mx-auto sm:mx-0">
              S
            </div>
            <div className="flex-1">
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Smart Placement Portal</p>
              <p className="text-xs sm:text-sm text-slate-500">AI-driven campus recruitment</p>
            </div>
          </div>
          <Link to={user ? "/dashboard" : "/login"} className="saas-button-primary px-6 py-2 w-full sm:w-auto text-center">
            <span>{user ? 'Go to Dashboard' : 'Get Started'}</span>
          </Link>
        </header>

        {/* Hero Section */}
        <main className="flex flex-1 flex-col justify-center py-16 lg:py-24">
          <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-8">
              <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Placement intelligence for students and recruiters</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-tight">
                  Build your placement story with{' '}
                  <span className="text-emerald-600">
                    AI guidance.
                  </span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                  From profile completion and resume scoring to mock interviews and job tracking, the Smart Placement Portal helps every student move from preparation to placement faster.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={user ? "/dashboard" : "/login"} className="saas-button-primary px-8 py-3.5 flex items-center justify-center">
                  {user ? 'Continue to Dashboard' : 'Start your journey'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="#features" className="saas-button-secondary px-8 py-3.5 flex items-center justify-center">
                  Explore features
                </a>
              </div>


            </section>

            {/* Feature Preview Card */}
            <section className="saas-card p-8">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Portal overview</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">Built for modern campus hiring</h2>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-emerald-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 space-y-3 relative z-10">
                {[
                  'Complete student profile and upload documents',
                  'Apply to jobs with eligibility checks',
                  'Use AI mock interviews and career guidance',
                  'Track recruiter feedback and placement progress',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="mt-0.5 mr-3 h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="border-t border-slate-200 bg-white py-20 relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-4">Core capabilities</p>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Everything a student needs to prepare and perform</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Comprehensive tools designed to accelerate your placement journey
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="saas-card p-8 saas-card-interactive flex flex-col h-full"
                  >
                    <div className="relative z-10 flex-1">
                      <div className="mb-6 inline-flex rounded-xl bg-slate-100 p-4 text-emerald-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-slate-200 bg-slate-50 py-16 relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Ready to accelerate your placement journey?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of students who have already transformed their careers with AI-powered guidance
            </p>
            <Link to={user ? "/dashboard" : "/login"} className="saas-button-primary px-8 py-4 inline-flex items-center">
              {user ? 'Go to Dashboard' : 'Get Started Now'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
