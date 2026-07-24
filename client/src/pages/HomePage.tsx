import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Briefcase, GraduationCap, Sparkles, ChevronRight, ChevronLeft, ChevronDown, CheckCircle, Search, Clock, FileText, Brain, TrendingUp, Users, Target } from 'lucide-react';

const features = [
  {
    title: 'AI Resume Analysis',
    description: 'Upload resumes and receive ATS-style feedback, score predictions, and skill suggestions.',
    icon: FileText,
  },
  {
    title: 'Skill Assessments',
    description: 'Practice coding labs and MCQs that align with modern placement drives.',
    icon: GraduationCap,
  },
  {
    title: 'Mock Interviews',
    description: 'Run AI-guided interview simulations and improve communication and technical accuracy.',
    icon: Brain,
  },
  {
    title: 'Placement Tracking',
    description: 'Track job applications, recruiter updates, and your placement readiness in one view.',
    icon: Target,
  },
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-[#fffdfa] font-sans text-slate-900 flex flex-col">
      {/* The Split Background Panel (Fixed to top viewport) */}
      <div className="absolute right-0 top-0 h-[110vh] w-full lg:w-[58%] bg-[#111315] lg:rounded-bl-[200px] z-0 transition-all duration-700 pointer-events-none hidden lg:block shadow-2xl" />
      <div className="absolute left-0 right-0 bottom-0 top-[40vh] h-[60vh] bg-[#111315] z-0 lg:hidden pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C061] font-bold text-[#111315]">
            S
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 lg:text-slate-900">
            SmartPortal<span className="text-[#F5C061]">.</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="pl-9 pr-4 py-1.5 bg-white/50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#F5C061] w-48 text-slate-900"
            />
          </div>
          <Link to="#" className="text-slate-400 hover:text-slate-900 transition-colors">Why Us?</Link>
          <div className="flex flex-col items-center">
            <Link to="#" className="text-slate-900 font-bold">About</Link>
            <div className="w-4 h-0.5 bg-slate-900 rounded-full mt-1" />
          </div>
          <Link to="#" className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
            Features <ChevronDown className="h-3 w-3" />
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="px-6 py-2.5 rounded-full bg-[#F5C061] text-[#111315] text-sm font-bold shadow-lg shadow-[#F5C061]/20 hover:scale-105 transition-transform">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2.5 rounded-full border border-slate-700 lg:border-white/20 text-slate-900 lg:text-white text-sm font-bold hover:bg-slate-100 lg:hover:bg-white/10 transition-colors">
                Sign In
              </Link>
              <Link to="/login" className="px-6 py-2.5 rounded-full bg-[#F5C061] text-[#111315] text-sm font-bold shadow-lg shadow-[#F5C061]/20 hover:scale-105 transition-transform">
                Login
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 flex flex-col lg:flex-row flex-1 px-6 lg:px-12 pb-12">
        
        {/* Left Side (White/Light area) */}
        <div className="flex-1 flex flex-col justify-center pt-10 pb-20 lg:py-0 lg:pr-12 relative">
          
          {/* Decorative squiggles */}
          <div className="absolute left-0 top-1/4 opacity-40 hidden sm:block">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#cbd5e1" strokeWidth="2">
              <path d="M0 20 Q 10 10 20 20 T 40 20" />
              <path d="M0 30 Q 10 20 20 30 T 40 30" />
            </svg>
          </div>

          <div className="max-w-xl relative">
            <h2 className="text-2xl sm:text-3xl font-medium text-slate-500 mb-2 font-serif">Campus Placement</h2>
            <h1 className="text-5xl sm:text-7xl font-black text-[#111315] tracking-tight leading-[1.1] mb-6">
              With AI-Driven <br />
              <span className="text-[#111315]">Guidance</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm mb-10">
              Build your placement story with intelligent resume scoring, mock interviews, and automated job matching perfectly tailored to your profile.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium line-through">Offline</span>
                <span className="text-3xl font-black text-slate-900">Portal</span>
              </div>
              <Link to={user ? "/dashboard" : "/login"} className="group flex items-center gap-4 bg-[#111315] hover:bg-black text-white px-6 py-3.5 rounded-full font-bold shadow-xl transition-all hover:pr-4">
                <div className="bg-[#F5C061] text-[#111315] p-1.5 rounded-full">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <span>Start your journey</span>
              </Link>
            </div>
          </div>

          {/* Bottom Left Expert Tip */}
          <div className="mt-auto pt-16 sm:absolute sm:bottom-0 sm:left-0 flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full border border-dashed border-slate-300 animate-[spin_10s_linear_infinite]" />
              <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md relative z-10 flex items-center justify-center">
                {/* Fallback avatar icon instead of image */}
                <div className="bg-[#F5C061] h-full w-full flex items-center justify-center text-[#111315] font-black text-xl">
                  R
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Recruiter's Recommendation</p>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1 cursor-pointer hover:text-[#F5C061] transition-colors">
                View top interview tips <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (Dark area) */}
        <div className="flex-1 flex flex-col justify-center items-center relative pt-20 lg:pt-0">
          
          {/* Central Floating Elements */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            
            {/* The main abstract graphic or floating elements */}
            <div className="absolute inset-0 flex items-center justify-center animate-[bounce_10s_ease-in-out_infinite]">
              <div className="h-64 w-64 rounded-full bg-gradient-to-tr from-[#F5C061]/20 to-[#F5C061]/5 blur-3xl absolute" />
              <div className="h-48 w-48 rounded-full border border-[#F5C061]/20 absolute animate-[spin_20s_linear_infinite]" />
              <div className="h-72 w-72 rounded-full border border-dashed border-white/10 absolute animate-[spin_30s_linear_infinite_reverse]" />
              
              <Briefcase className="h-32 w-32 text-[#F5C061] drop-shadow-[0_0_30px_rgba(245,192,97,0.3)] relative z-10" strokeWidth={1} />
            </div>

            {/* Floating Orbs & Icons */}
            <div className="absolute top-10 left-10 h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <div className="absolute bottom-20 right-10 h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
            <div className="absolute top-1/4 right-0 text-white/50 animate-pulse">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="absolute bottom-1/4 left-0 text-white/50 animate-[bounce_6s_ease-in-out_infinite]">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div className="absolute top-1/2 left-1/4 h-2 w-2 rounded-full bg-[#F5C061]" />
          </div>

          {/* Bottom Right Widget (Discount Coupon style) */}
          <div className="w-full max-w-sm mt-12 lg:absolute lg:bottom-0 lg:right-0">
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 backdrop-blur-md p-5 text-white shadow-2xl relative overflow-hidden group hover:border-white/40 transition-colors">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs text-white/60">Featured Opportunity</span>
                <div className="flex items-center gap-2 text-[10px] text-white/60 uppercase">
                  <span>Prev</span>
                  <button className="h-4 w-4 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                    <ChevronRight className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#111315] flex items-center justify-center border border-white/10 shadow-inner">
                    <span className="font-black text-[#F5C061] text-lg">G</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Google SWE</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Sparkles className="h-3 w-3 text-rose-500" />
                      <span className="text-[10px] text-white/60 font-semibold uppercase">Top Rated</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-[10px] text-white/40 line-through">12 LPA</div>
                  <div className="text-xl font-black text-white tracking-tighter">18 LPA</div>
                </div>
              </div>

              {/* Apply Pill */}
              <div className="absolute bottom-5 right-5 z-10">
                <div className="bg-[#F5C061] text-[#111315] px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg shadow-[#F5C061]/20 cursor-pointer hover:scale-105 transition-transform">
                  <Clock className="h-3 w-3" />
                  12 Days Left
                </div>
              </div>

              {/* Decorative swooshes matching the design */}
              <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full border-[0.5px] border-white/10" />
              <div className="absolute right-0 top-1/2 w-48 h-48 rounded-full border-[0.5px] border-white/5 -translate-y-1/2 translate-x-1/4" />
            </div>
          </div>
        </div>

      </main>

      {/* Stats Section */}
      <section className="relative z-10 bg-[#111315] py-20 lg:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/10">
            {[
              { label: 'Placement Rate', value: '95%', icon: TrendingUp },
              { label: 'Active Recruiters', value: '500+', icon: Users },
              { label: 'Students Placed', value: '10k+', icon: GraduationCap },
              { label: 'Average CTC', value: '14 LPA', icon: Briefcase },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-[#F5C061] mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-white/50 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-[#fffdfa] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[#F5C061] font-bold tracking-widest uppercase text-sm mb-4">Core Capabilities</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-[#111315] leading-tight">Everything you need to <span className="text-[#F5C061]">succeed.</span></h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-8 lg:p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="h-16 w-16 rounded-2xl bg-[#111315] text-[#F5C061] flex items-center justify-center mb-8 group-hover:-translate-y-2 transition-transform duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-500 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="relative z-10 bg-[#111315] py-24 overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C061]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5C061]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
            Ready to accelerate your <br/> placement journey?
          </h2>
          <Link to={user ? "/dashboard" : "/login"} className="inline-flex items-center gap-4 bg-[#F5C061] hover:bg-[#e3af53] text-[#111315] px-10 py-5 rounded-full font-black text-lg shadow-xl shadow-[#F5C061]/20 transition-all hover:scale-105">
            {user ? 'Go to Dashboard' : 'Get Started Now'}
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </footer>
    </div>
  );
};
