import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Mail, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';

export const Login: React.FC = () => {
  const { requestOtp, verifyOtp, ssoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { instance: msalInstance } = useMsal();

  const [isRegister, setIsRegister] = useState(location.state?.isRegister || false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin'>('Student');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await requestOtp(email, role, isRegister ? name : undefined);
      setOtpSent(true);
      setMessage('OTP sent successfully to your email.');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOtp(email, otp, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (selectedRole: 'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin') => {
    setIsRegister(false);
    setName('');
    setEmail('');
    setOtp('');
    setOtpSent(false);
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
      const loginResponse = await msalInstance.loginPopup({ scopes: ["user.read"] });
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-[800px] h-[800px] border-[1px] border-white rounded-full absolute" />
        <div className="w-[1200px] h-[1200px] border-[1px] border-white rounded-full absolute" />
      </div>

      <div className="w-full max-w-[420px] z-10 bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl sm:rounded-[32px] p-5 sm:p-8 shadow-2xl shadow-sky-200/50 flex flex-col relative overflow-hidden">
        <div className="text-center mt-8 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isRegister ? 'Create an account' : 'Sign in securely'}
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            {isRegister 
              ? 'Join the platform with OTP verification.' 
              : 'Welcome back. Sign in with OTP.'}
          </p>
        </div>

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

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-600 font-semibold text-center mb-4">
            {message}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="space-y-3">
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
              {loading ? 'Processing...' : 'Get OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold tracking-widest text-center bg-slate-50 border-transparent text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-400 transition-all"
              />
              <ShieldCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="flex justify-between pt-1">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
          </form>
        )}

        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-slate-100 border-dashed"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-semibold">
            Or sign in with
          </span>
          <div className="flex-grow border-t border-slate-100 border-dashed"></div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-center w-full overflow-hidden rounded-xl">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google authentication failed.')}
              use_fedcm_for_prompt={true}
              theme="outline"
              size="large"
              text={isRegister ? "signup_with" : "signin_with"}
              shape="rectangular"
            />
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setOtpSent(false);
              setOtp('');
              setMessage('');
            }}
            className="text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
