import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ShieldCheck, Mail, Lock, UserCheck, KeyRound, X, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';

export const Login: React.FC = () => {
  const { login, register, ssoLogin } = useAuth();
  const navigate = useNavigate();
  const { instance: msalInstance } = useMsal();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin'>('Student');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot / Reset Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);
    try {
      const data = await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMessage(data.message);
      if (data.resetCode) {
        setResetCodeInput(data.resetCode);
      }
      setForgotStep(2);
    } catch (err: any) {
      setForgotError(err?.message || 'Failed to request reset code.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);
    try {
      const data = await api.post('/auth/reset-password', {
        email: forgotEmail,
        code: resetCodeInput,
        newPassword: newPasswordInput,
        confirmPassword: confirmPasswordInput
      });
      setForgotMessage(data.message);
      setEmail(forgotEmail);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotEmail('');
        setResetCodeInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
      }, 1800);
    } catch (err: any) {
      setForgotError(err?.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Automated evaluator seed logic
  const handleAutofill = (selectedRole: 'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin') => {
    setIsRegister(false);
    setName('');
    setEmail('');
    setPassword('');
    setRole(selectedRole);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError('');
      setLoading(true);
      await ssoLogin('google', credentialResponse.credential, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["user.read"]
      });
      await ssoLogin('microsoft', loginResponse.accessToken, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Microsoft login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden py-10">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.08),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.08),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_50%,_#e2e8f0_100%)]" />
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-fuchsia-200/20 blur-3xl" />
      </div>
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Main card container */}
      <div className="w-full max-w-5xl z-10 grid md:grid-cols-[1fr_0.9fr] gap-6 bg-white/70 border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-[0_30px_100px_-24px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        
        {/* Left Column: Interactive Brand & Info Banner */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-8 relative overflow-hidden shadow-inner">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          {/* Banner Header */}
          <div className="space-y-4 z-10">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">Smart Placement Portal</h3>
              <p className="text-xs text-indigo-300 tracking-wider font-semibold uppercase mt-1">Jawaharlal University</p>
            </div>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Step into the future of campus hiring. Powered by AI resume review, analytics, skill tracking, and mock interviews to guide you to your dream offer.
            </p>
          </div>

          {/* Portal Stats Grid */}
          <div className="grid grid-cols-2 gap-4 my-8 z-10">
            {[
              { value: '2500+', label: 'Active Students' },
              { value: '150+', label: 'Hiring Partners' },
              { value: '92%', label: 'Placement Rate' },
              { value: '4200+', label: 'Job Offers' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10">
                <div className="text-xl font-black text-white tracking-tight">{stat.value}</div>
                <div className="text-xs font-medium text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Banner Footer */}
          <div className="z-10 text-xs text-slate-400 border-t border-white/10 pt-4 flex items-center justify-between">
            <span>© 2026 Smart Placement Portal</span>
            <span className="font-semibold text-indigo-400">AI-Powered Career Cell</span>
          </div>
        </div>

        {/* Right Column: Interactive Login Form */}
        <div className="flex flex-col justify-center p-2 sm:p-4 lg:p-8 space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-500">
              {isRegister 
                ? 'Sign up to get access to custom career resources.' 
                : 'Sign in to access your placement dashboard.'}
            </p>
          </div>

          {/* Quick Seeding Buttons */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
              Evaluation Quick Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'Student', label: '🎓 Student' },
                { key: 'Recruiter', label: '💼 Recruiter' },
                { key: 'PlacementOfficer', label: '🏛️ Officer' },
                { key: 'Admin', label: '🛡️ Admin' },
              ].map((option) => {
                const isSelected = role === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleAutofill(option.key as 'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin')}
                    className={`relative py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {isSelected && <span className="mr-1 text-indigo-600">✓</span>}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-600 font-semibold text-center animate-pulse-subtle">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  />
                  <UserCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                {!isRegister && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotStep(1);
                      setForgotError('');
                      setForgotMessage('');
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-all"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 p-0.5 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                >
                  <option value="Student">Student</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="PlacementOfficer">Placement Officer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {!isRegister && (
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or login with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          )}

          {!isRegister && (
            <div className="flex flex-col gap-3 max-w-[400px] mx-auto w-full">
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed.')}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="400"
                />
              </div>
              <button
                type="button"
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] w-full"
                style={{ height: '40px' }}
              >
                <img src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.svg" alt="Microsoft" className="h-5 w-5" />
                Sign in with Microsoft
              </button>
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-indigo-600 font-bold transition-all"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

      </div>

      {/* Forgot / Reset Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {forgotStep === 1 ? 'Enter your registered email address.' : 'Enter verification code & new password.'}
                </p>
              </div>
            </div>

            {forgotMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl p-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{forgotMessage}</span>
              </div>
            )}

            {forgotError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl p-3">
                {forgotError}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Get Reset Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">6-Digit Reset Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123456"
                    value={resetCodeInput}
                    onChange={(e) => setResetCodeInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-bold tracking-widest text-center border border-slate-200 bg-slate-50 text-indigo-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 p-0.5 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Repeat new password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 p-0.5 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    ← Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {forgotLoading ? 'Updating...' : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
