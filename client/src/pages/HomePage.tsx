import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(236,72,153,0.15),_transparent_50%),linear-gradient(135deg,_#667eea_0%,_#764ba2_100%)]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 font-bold text-white shadow-lg shadow-cyan-500/50 animate-pulse">
              S
            </div>
            <div>
              <p className="text-lg font-bold text-white">Smart Placement Portal</p>
              <p className="text-sm text-white/80">AI-driven campus recruitment</p>
            </div>
          </div>
          <Link to="/login" className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-xl">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </header>

        {/* Hero Section */}
        <main className="flex flex-1 flex-col justify-center py-16 lg:py-24">
          <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-8">
              <div className="inline-flex items-center space-x-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm animate-fade-in">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>Placement intelligence for students and recruiters</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
                  Build your placement story with{' '}
                  <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                    AI guidance.
                  </span>
                </h1>
                <p className="max-w-2xl text-lg text-white/90 leading-relaxed">
                  From profile completion and resume scoring to mock interviews and job tracking, the Smart Placement Portal helps every student move from preparation to placement faster.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/login" className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl">
                  Start your journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50">
                  Explore features
                </a>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="h-5 w-5 text-cyan-300" />
                        <p className="text-3xl font-black text-white">{stat.value}</p>
                      </div>
                      <p className="text-sm text-white/80 font-medium">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Feature Preview Card */}
            <section className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-cyan-300">Portal overview</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Built for modern campus hiring</h2>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-white">
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
                  <div key={idx} className="flex items-start rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-102">
                    <div className="mt-0.5 mr-3 h-3 w-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 shadow-lg"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="border-t border-white/20 bg-white/5 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-300 mb-4">Core capabilities</p>
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
                    className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/20 hover:shadow-2xl"
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

                      <div className="mt-6 flex items-center text-sm font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors">
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
        <section className="border-t border-white/20 bg-white/5 py-16 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black text-white mb-4">Ready to accelerate your placement journey?</h2>
            <p className="text-lg text-white/80 mb-8">
              Join thousands of students who have already transformed their careers with AI-powered guidance
            </p>
            <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-2xl">
              Get Started Now
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