import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ScanFace,
  Fingerprint,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Crown,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, DEMO_USERS } from '../../utils/constants';
import { authenticateNativePasskey, checkPasskeySupport } from '../../utils/passkey';
import BiometricModal from '../../components/common/BiometricModal';
import ThemeToggle from '../../components/common/ThemeToggle';

export const Login = () => {
  const { login, loginWithPasskey, users, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Auth Tab: 'password' | 'passkey'
  const [authMethod, setAuthMethod] = useState('password');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Passkey modal state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [passkeySupport, setPasskeySupport] = useState({
    supported: true,
    platformAuthenticator: true,
  });

  const targetRoute = location.state?.from?.pathname;
  const redirectPath = (!targetRoute || targetRoute === '/' || targetRoute === '/login') ? '/dashboard' : targetRoute;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    checkPasskeySupport().then((support) => {
      setPasskeySupport(support);
    });
  }, []);

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Username or email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      success(`Welcome back, ${user.name}! Access granted.`, 'Signed In');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      error(err.message || 'We could not sign you in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerPasskey = (e) => {
    if (e) e.preventDefault();
    if (!formData.email.trim()) {
      setErrors({ email: 'Please enter your username/email or choose a demo account below' });
      return;
    }
    setErrors({});
    setIsBiometricModalOpen(true);
  };

  const handleExecuteNativePasskey = async () => {
    const matched = users.find(
      (u) => u.email.toLowerCase().trim() === formData.email.toLowerCase().trim()
    );
    const credentialIds = matched?.passkeys?.map((p) => p.id) || [];
    return await authenticateNativePasskey({ credentialIds });
  };

  const handlePasskeySuccess = async (passkeyResult) => {
    try {
      const user = await loginWithPasskey(formData.email, passkeyResult);
      success(
        `Welcome back, ${user.name}! Verified using ${passkeyResult.authenticatorType || 'Passkey'}.`,
        'Identity Verified'
      );
      navigate(redirectPath, { replace: true });
    } catch (err) {
      error(err.message || 'Passkey verification failed.');
    }
  };

  const handleQuickLogin = (demoUser) => {
    setFormData({
      email: demoUser.email,
      password: demoUser.password,
    });
    setAuthMethod('password');
    setErrors({});
    info(`Loaded credentials for ${demoUser.name} (${demoUser.role})`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col justify-center items-center py-10 px-4 relative overflow-hidden font-sans select-none">
      {/* Brick Wall Background Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="brick-wall-pattern" width="70" height="34" patternUnits="userSpaceOnUse">
            <path
              d="M 0 0 L 70 0 M 0 17 L 70 17 M 0 34 L 70 34 M 0 0 L 0 17 M 35 17 L 35 34 M 70 0 L 70 17"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brick-wall-pattern)" />
      </svg>

      {/* Ambient gradient vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0a0f1d]/60 to-[#060a14] pointer-events-none" />

      {/* Floating Theme Toggle (top right) */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle size="md" />
      </div>

      {/* Wall Lamp Fixture casting warm spotlight */}
      <div className="relative z-20 flex flex-col items-center mb-[-12px]">
        {/* Lamp Fixture Body */}
        <div className="w-24 h-7 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-900 rounded-t-lg border-t border-slate-500 shadow-xl relative z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-500/50 rounded-full" />
        </div>
        {/* Lamp Bulb / Warm Light Emitter */}
        <div className="w-20 h-2 bg-amber-100 rounded-b shadow-[0_0_45px_20px_rgba(253,224,71,0.55)] relative z-20" />
        {/* Downward Conic Warm Light Cone */}
        <div className="absolute top-5 w-[440px] h-[480px] bg-[radial-gradient(ellipse_at_top,_rgba(254,240,138,0.28)_0%,_rgba(251,191,36,0.14)_38%,_transparent_72%)] pointer-events-none z-10" />
      </div>

      {/* Frosted Glassmorphism Card */}
      <div className="relative z-20 w-full max-w-[380px] sm:max-w-[400px]">
        <div className="backdrop-blur-xl bg-white/[0.08] dark:bg-slate-900/[0.45] border border-white/[0.22] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-[28px] p-7 sm:p-8 text-white relative overflow-hidden transition-all">
          {/* Subtle card top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-amber-200/20 blur-xl pointer-events-none" />

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white tracking-wide mb-5">
            Login
          </h2>

          {/* Auth Method Switcher Tabs (Password vs Passkey) */}
          <div className="grid grid-cols-2 p-1 bg-white/[0.07] border border-white/10 rounded-2xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                authMethod === 'password'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod('passkey')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                authMethod === 'passkey'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ScanFace className="w-3.5 h-3.5" />
              <span>Passkey</span>
            </button>
          </div>

          {/* TAB 1: PASSWORD LOGIN FORM */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Username Input Field */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="email"
                    placeholder="Username"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    autoComplete="username"
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    autoComplete="current-password"
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-300 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.password}</p>
                )}
              </div>

              {/* Remember me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs text-slate-200 pt-0.5 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border border-white/40 bg-white/10 text-slate-900 focus:ring-0 cursor-pointer accent-white"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => info('For demo accounts, use password: Password123!')}
                  className="text-slate-300 hover:text-white transition-colors text-xs hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Big White Rounded Pill Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-3.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-[0.99] text-sm tracking-wide disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: PASSKEY / BIOMETRIC LOGIN */}
          {authMethod === 'passkey' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-center">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white mx-auto mb-2 shadow-xs">
                  <ScanFace className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-white">
                  Passwordless Biometrics
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Sign in with <strong>Windows Hello</strong>, <strong>Touch ID</strong>, or <strong>Passkey</strong>.
                </p>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="email"
                    placeholder="Username or Corporate Email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    autoComplete="username webauthn"
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.email}</p>
                )}
              </div>

              {/* Big White Rounded Pill Passkey Button */}
              <button
                type="button"
                onClick={handleTriggerPasskey}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-3.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-[0.99] text-sm tracking-wide flex items-center justify-center gap-2"
              >
                <ScanFace className="w-4 h-4 text-slate-950" />
                <span>Sign In with Passkey</span>
              </button>

              <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <ScanFace className="w-3.5 h-3.5" /> Face ID
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Fingerprint className="w-3.5 h-3.5" /> Fingerprint Touch
                </span>
              </div>
            </div>
          )}

          {/* 1-Click Demo Accounts Pill Bar */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              Quick 1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {DEMO_USERS.map((demo) => {
                const isSelected = formData.email === demo.email;
                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleQuickLogin(demo)}
                    className={`py-1.5 px-2 rounded-xl text-center border transition-all text-xs flex flex-col items-center ${
                      isSelected
                        ? 'bg-white text-slate-950 font-bold border-white shadow-md'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-slate-200'
                    }`}
                  >
                    <span className="truncate w-full font-bold text-[11px]">
                      {demo.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] opacity-75 truncate w-full">
                      {demo.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Link: Don't have an account? Register */}
          <div className="mt-5 text-center text-xs text-slate-300">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-white font-bold hover:underline ml-1 inline-flex items-center"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Biometric Verification Modal */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={handlePasskeySuccess}
        mode="login"
        userName={formData.email || 'User'}
        isNativeAvailable={passkeySupport.supported}
        onTriggerNative={handleExecuteNativePasskey}
      />
    </div>
  );
};

export default Login;
