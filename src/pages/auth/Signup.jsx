import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Crown,
  Briefcase,
  UserCheck,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/constants';
import { registerNativePasskey, checkPasskeySupport } from '../../utils/passkey';
import BiometricModal from '../../components/common/BiometricModal';
import ThemeToggle from '../../components/common/ThemeToggle';

export const Signup = () => {
  const { signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Active Auth Tab: 'password' | 'passkey'
  const [authMethod, setAuthMethod] = useState('password');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.EMPLOYEE,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Biometric state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [passkeySupport, setPasskeySupport] = useState({
    supported: true,
    platformAuthenticator: true,
  });

  useEffect(() => {
    checkPasskeySupport().then((support) => {
      setPasskeySupport(support);
    });
  }, []);

  const validateCommon = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'At least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Corporate email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email format required';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role tier';
    }

    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = validateCommon();

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const newUser = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      success(`Welcome to the team, ${newUser.name}! Your account is ready.`, 'Registered');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error(err.message || 'Registration could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPasskeySignup = (e) => {
    e.preventDefault();
    const commonErrors = validateCommon();
    if (Object.keys(commonErrors).length > 0) {
      setErrors(commonErrors);
      return;
    }
    setErrors({});
    setIsBiometricModalOpen(true);
  };

  const handleExecuteNativeRegistration = async () => {
    return await registerNativePasskey({
      userName: formData.email,
      userDisplayName: formData.name,
    });
  };

  const handlePasskeySuccess = async (passkeyResult) => {
    setIsLoading(true);
    try {
      const newUser = await signup({
        name: formData.name,
        email: formData.email,
        password: 'PasskeyDefault123!',
        role: formData.role,
        passkeyData: passkeyResult,
      });

      success(
        `Biometric passkey linked with ${passkeyResult.authenticatorType || 'your device'}! Welcome, ${newUser.name}.`,
        'Registered'
      );
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error(err.message || 'Could not complete passkey enrollment.');
    } finally {
      setIsLoading(false);
    }
  };

  const rolesConfig = [
    {
      role: ROLES.ADMIN,
      title: 'Administrator',
      icon: Crown,
      color: 'text-purple-400',
    },
    {
      role: ROLES.MANAGER,
      title: 'Manager',
      icon: Briefcase,
      color: 'text-blue-400',
    },
    {
      role: ROLES.EMPLOYEE,
      title: 'Specialist',
      icon: UserCheck,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col justify-center items-center py-10 px-4 relative overflow-hidden font-sans select-none">
      {/* Brick Wall Background Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="signup-brick-pattern" width="70" height="34" patternUnits="userSpaceOnUse">
            <path
              d="M 0 0 L 70 0 M 0 17 L 70 17 M 0 34 L 70 34 M 0 0 L 0 17 M 35 17 L 35 34 M 70 0 L 70 17"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#signup-brick-pattern)" />
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
      <div className="relative z-20 w-full max-w-[390px] sm:max-w-[420px]">
        <div className="backdrop-blur-xl bg-white/[0.08] dark:bg-slate-900/[0.45] border border-white/[0.22] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-[28px] p-7 sm:p-8 text-white relative overflow-hidden transition-all">
          {/* Subtle card top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-amber-200/20 blur-xl pointer-events-none" />

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white tracking-wide mb-5">
            Register
          </h2>

          {/* Auth Method Switcher Tabs (Password vs Passkey) */}
          <div className="grid grid-cols-2 p-1 bg-white/[0.07] border border-white/10 rounded-2xl mb-4 text-xs font-semibold">
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

          {/* Role Tier Selection */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Select Your Role Tier
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {rolesConfig.map((item) => {
                const isSelected = formData.role === item.role;
                const RoleIcon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: item.role })}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-white text-slate-950 font-bold border-white shadow-md'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-slate-200'
                    }`}
                  >
                    <RoleIcon className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? 'text-slate-950' : item.color}`} />
                    <span className="text-[11px] font-semibold">{item.title}</span>
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.role}</p>
            )}
          </div>

          {/* TAB 1: PASSWORD REGISTRATION */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.name}</p>
                )}
              </div>

              {/* Corporate Email */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Corporate Email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    autoComplete="username"
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
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
                    autoComplete="new-password"
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
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

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    autoComplete="new-password"
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Big White Rounded Pill Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-3.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-[0.99] text-sm tracking-wide disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? <span>Registering...</span> : <span>Register</span>}
              </button>
            </form>
          )}

          {/* TAB 2: PASSKEY ENROLLMENT */}
          {authMethod === 'passkey' && (
            <form onSubmit={handleStartPasskeySignup} className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-center">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white mx-auto mb-2 shadow-xs">
                  <ScanFace className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-white">
                  Biometric Passkey Registration
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Link your <strong>Windows Hello Face</strong> or <strong>Touch ID</strong> for passwordless access.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.name}</p>
                )}
              </div>

              {/* Corporate Email */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Corporate Email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    autoComplete="username webauthn"
                    className="w-full bg-white/[0.08] border border-white/20 focus:border-white focus:bg-white/[0.12] focus:ring-2 focus:ring-white/20 rounded-2xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-slate-300/70 outline-none transition-all shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-300 font-medium pl-1">{errors.email}</p>
                )}
              </div>

              {/* Big White Rounded Pill Passkey Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-3.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-[0.99] text-sm tracking-wide flex items-center justify-center gap-2"
              >
                <ScanFace className="w-4 h-4 text-slate-950" />
                <span>Enroll & Register Passkey</span>
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
            </form>
          )}

          {/* Footer Link: Already have an account? Login */}
          <div className="mt-5 text-center text-xs text-slate-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white font-bold hover:underline ml-1 inline-flex items-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Biometric Enrollment Modal */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={handlePasskeySuccess}
        mode="register"
        userName={formData.name || formData.email || 'User'}
        isNativeAvailable={passkeySupport.supported}
        onTriggerNative={handleExecuteNativeRegistration}
      />
    </div>
  );
};

export default Signup;
