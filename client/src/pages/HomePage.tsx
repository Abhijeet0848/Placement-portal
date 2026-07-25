import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, ChevronDown, FileText, Brain, Target, Compass } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Hero3DScene = () => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#38bdf8" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#818cf8" />
      <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color="#0284c7"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const features = [
  {
    title: 'AI Resume Analysis',
    description: 'Upload resumes and receive ATS-style feedback, score predictions, and skill suggestions.',
    icon: FileText,
    link: '/resume-analyzer'
  },
  {
    title: 'AI Career Coach',
    description: 'Get personalized career roadmaps and intelligent cover letter generation tailored to your profile.',
    icon: Compass,
    link: '/career-roadmap'
  },
  {
    title: 'Mock Interviews',
    description: 'Run AI-guided interview simulations and improve communication and technical accuracy.',
    icon: Brain,
    link: '/mock-interview'
  },
  {
    title: 'Placement Tracking',
    description: 'Track job applications, recruiter updates, and your placement readiness in one view.',
    icon: Target,
    link: '/dashboard'
  },
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    latestJob: null
  });

  useEffect(() => {
    api.get('/public/home-stats')
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch home stats', err));
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans text-slate-200 flex flex-col overflow-x-hidden selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-900/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/30 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-900/10 blur-[100px]" />
        
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-[1] hidden md:block opacity-60">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Hero3DScene />
          </Canvas>
        </div>
      </div>

      {/* Floating Glass Header */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-12 py-5 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            SmartPortal<span className="text-sky-500">.</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link to="#features" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
            Features
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="px-6 py-2.5 rounded-full bg-white text-slate-950 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" state={{ isRegister: true }} className="hidden sm:block px-6 py-2.5 rounded-full border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors">
                Sign Up
              </Link>
              <Link to="/login" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:scale-105 transition-all">
                Login
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 pt-40 pb-20 px-6 lg:px-12 w-full max-w-7xl mx-auto">
        
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sky-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            AI-Powered Placement Platform
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8 drop-shadow-2xl">
            Supercharge Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 animate-gradient-x">Campus Placement</span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-light">
            Build your professional story with intelligent resume scoring, dynamic mock interviews, and automated job matching perfectly tailored to your profile.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to={user ? "/dashboard" : "/login"} className="group flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all hover:scale-105 w-full sm:w-auto">
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="#features" className="group flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all w-full sm:w-auto backdrop-blur-md">
              Explore Features
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-500/50 hover:bg-white/[0.07] transition-all duration-300 backdrop-blur-md overflow-hidden hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
