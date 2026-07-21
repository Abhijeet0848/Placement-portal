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
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.15),_transparent_50%)]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 font-bold text-white shadow-lg shadow-emerald-500/20 animate-pulse">
              S
            </div>
            <div>
              <p className="text-lg font-bold text-white">Smart Placement Portal</p>
              <p className="text-sm text-white/60">AI-driven campus recruitment</p>
            </div>
          </div>
          <Link to={user ? "/dashboard" : "/login"} className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-emerald-500/40">
            <span className="relative z-10">{user ? 'Go to Dashboard' : 'Get Started'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </header>

        {/* Hero Section */}
        <main className="flex flex-1 flex-col justify-center py-16 lg:py-24">
          <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-8">
              <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-sm animate-fade-in">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Placement intelligence for students and recruiters</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
                  Build your placement story with{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                    AI guidance.
                  </span>
                </h1>
                <p className="max-w-2xl text-lg text-white/90 leading-relaxed">
                  From profile completion and resume scoring to mock interviews and job tracking, the Smart Placement Portal helps every student move from preparation to placement faster.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={user ? "/dashboard" : "/login"} className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-emerald-500/40">
                  {user ? 'Continue to Dashboard' : 'Start your journey'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="flex items-center justify-center rounded-xl border-2 border-white/10 bg-white/5 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
                  Explore features
                </a>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 hover:border-emerald-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="h-5 w-5 text-emerald-400" />
                        <p className="text-3xl font-black text-white">{stat.value}</p>
                      </div>
                      <p className="text-sm text-white/60 font-medium">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Feature Preview Card */}
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-emerald-400">Portal overview</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Built for modern campus hiring</h2>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  'Complete student profile and upload documents',
                  'Apply to jobs with eligibility checks',
                  'Use AI mock interviews and career guidance',
                  'Track recruiter feedback and placement progress',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-white/90 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-emerald-500/30 hover:scale-102">
                    <div className="mt-0.5 mr-3 h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/50"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="border-t border-white/10 bg-[#040b16] py-20 relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4">Core capabilities</p>
              <h2 className="text-4xl font-black text-white mb-4">Everything a student needs to prepare and perform</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Comprehensive tools designed to accelerate your placement journey
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-8 shadow-xl backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-emerald-500/10"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity`}></div>

                    <div className="relative z-10">
                      <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${feature.color} p-4 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-sm text-white/80 leading-relaxed">{feature.description}</p>

                      <div className="mt-6 flex items-center text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-white/10 bg-[#020617] py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full"></div>
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">Ready to accelerate your placement journey?</h2>
            <p className="text-lg text-white/60 mb-8">
              Join thousands of students who have already transformed their careers with AI-powered guidance
            </p>
            <Link to={user ? "/dashboard" : "/login"} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-emerald-500/40">
              {user ? 'Go to Dashboard' : 'Get Started Now'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};