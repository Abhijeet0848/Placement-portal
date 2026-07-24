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
        await login(email, password, role);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 relative py-10">
      
      {/* Decorative background arcs/lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-[800px] h-[800px] border-[1px] border-white rounded-full absolute" />
        <div className="w-[1200px] h-[1200px] border-[1px] border-white rounded-full absolute" />
      </div>

      {/* Main card container */}
      <div className="w-full max-w-[420px] z-10 bg-white/90 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 shadow-2xl shadow-sky-200/50 flex flex-col relative">
        
        {/* Floating Top Icon */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-slate-100 w-16 h-16 flex items-center justify-center">
          <div className="text-slate-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
        </div>

        <div className="text-center mt-8 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isRegister ? 'Create an account' : 'Sign in with email'}
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            {isRegister 
              ? 'Join the platform to kickstart your placement journey.' 
              : 'Make a new doc to bring your words, data, and teams together. For free'}
          </p>
        </div>

        {/* Quick Seeding Buttons (Minimized for this design) */}
        <div className="mb-6 flex justify-center gap-2 flex-wrap">
          {['Student', 'Recruiter', 'PlacementOfficer', 'Admin'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleAutofill(opt as any)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                role === opt ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {opt === 'PlacementOfficer' ? 'Officer' : opt}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-600 font-semibold text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-medium bg-slate-50 border-transparent text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-400 transition-all"
              />
              <UserCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-medium bg-slate-50 border-transparent text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-400 transition-all"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm font-medium bg-slate-50 border-transparent text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-400 transition-all"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 p-0.5 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {!isRegister && (
            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStep(1);
                  setForgotError('');
                  setForgotMessage('');
                  setShowForgotModal(true);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Forgot password?
              </button>
            </div>
          )}

          {isRegister && (
            <div className="relative pt-1">
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-sm font-medium bg-slate-50 border-transparent text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all"
              >
                <option value="Student">Student Role</option>
                <option value="Recruiter">Recruiter Role</option>
                <option value="PlacementOfficer">Placement Officer Role</option>
                <option value="Admin">Admin Role</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Get Started'}
          </button>
        </form>

        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-slate-100 border-dashed"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-semibold">
            Or sign in with
          </span>
          <div className="flex-grow border-t border-slate-100 border-dashed"></div>
        </div>

        <div className="flex items-center justify-center gap-3 w-full">
          {/* We wrap GoogleLogin so it matches the design loosely. Google restricts extreme styling of their iframe, but we can contain it */}
          <div className="flex-1 flex justify-center bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl py-1 overflow-hidden h-12 relative items-center">
            <div className="absolute inset-0 opacity-0 z-10">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google authentication failed.')}
                type="icon"
                shape="rectangular"
              />
            </div>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          </div>

          <button type="button" className="flex-1 flex justify-center items-center bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl h-12">
             <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
          </button>
          
          <button type="button" className="flex-1 flex justify-center items-center bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl h-12">
             <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5" alt="Apple" />
          </button>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>


      {/* Forgot / Reset Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 relative  fade-in zoom-in ">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 "
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="saas-button-primary px-5 py-2.5"
                  >
                    {forgotLoading ? 'Sending...' : 'Get Reset Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">6-Digit Reset Code</label>
                    <button 
                      type="button" 
                      onClick={handleRequestResetCode}
                      disabled={forgotLoading}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                    >
                      {forgotLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123456"
                    value={resetCodeInput}
                    onChange={(e) => setResetCodeInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-bold tracking-widest text-center border border-slate-200 bg-slate-50 text-emerald-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
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
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 p-0.5 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none "
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
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 p-0.5 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none "
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    ← Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="saas-button-primary px-5 py-2.5"
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
