import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCivic } from '../../context/CivicContext';
import { UserRole } from '../../types/civic';
import { sendOtpToPhone, verifyOtpCode, verifyOtpCodeAsync } from '../../services/twilioOtpService';
import {
  CivicHeroArtwork,
  CitizenArtwork,
  OfficerArtwork,
  AdminArtwork
} from './LoginVisuals';
import { ShareWebLinkModal } from '../common/ShareWebLinkModal';
import {
  Shield,
  User as UserIcon,
  Briefcase,
  Crown,
  Lock,
  Smartphone,
  ArrowRight,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building2,
  KeyRound,
  FileText,
  Clock,
  Sparkles,
  Mail,
  UserCheck,
  Check,
  HelpCircle,
  Zap,
  Sun,
  Moon,
  Share2
} from 'lucide-react';

interface AuthPortalProps {
  onLoginSuccess?: (role: UserRole) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLoginSuccess }) => {
  const {
    loginWithGoogle,
    loginAsRoleWithCredentials,
    authLoading,
    authError,
    theme,
    toggleTheme
  } = useCivic();

  const [showShareModal, setShowShareModal] = useState(false);

  // Active Tab: 'citizen' | 'officer' | 'admin'
  const [activeRole, setActiveRole] = useState<UserRole>('citizen');

  // Citizen State (Name, Email & Twilio SMS OTP)
  const [citizenName, setCitizenName] = useState('Kavitha Raman');
  const [citizenEmail, setCitizenEmail] = useState('kavitha.raman@flowdoc.gov.in');
  const [citizenMobile, setCitizenMobile] = useState('+91 90807 65819');
  const [citizenOtp, setCitizenOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpDispatchMsg, setOtpDispatchMsg] = useState<{
    text: string;
    code: string;
    sid?: string;
    deliveryMethod?: string;
  } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Officer State (with Officer Name input)
  const [officerName, setOfficerName] = useState('Rajesh Varma, Revenue Inspector');
  const [officerGovId, setOfficerGovId] = useState('OFF-REV-8942');
  const [officerDept, setOfficerDept] = useState('dept_rev');
  const [officerPass, setOfficerPass] = useState('••••••••••••');

  // Administrator State
  const [adminName, setAdminName] = useState('Dr. Ananya Sharma, IAS');
  const [adminKey, setAdminKey] = useState('IAS-DIST-HQ-2026');
  const [adminPin, setAdminPin] = useState('9982');

  const handleSendOtp = async () => {
    if (!citizenMobile.trim()) {
      setLocalError('Please enter a valid mobile phone number.');
      return;
    }
    setIsSendingOtp(true);
    setLocalError(null);
    try {
      const res = await sendOtpToPhone(citizenMobile);
      setOtpDispatchMsg({
        text: res.message,
        code: res.code,
        sid: res.sid,
        deliveryMethod: res.deliveryMethod
      });
      setCitizenOtp(res.code); // Pre-fill generated OTP for instant convenience
    } catch (e: any) {
      setLocalError('Twilio SMS delivery error: ' + e.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsVerifying(true);
    try {
      const res = await verifyOtpCodeAsync(citizenMobile, citizenOtp);
      if (!res.valid) {
        setLocalError(res.message || 'Invalid or expired OTP passcode. Click "Send Twilio OTP" or check received SMS.');
        setIsVerifying(false);
        return;
      }
      loginAsRoleWithCredentials('citizen', {
        name: citizenName,
        email: citizenEmail,
        aadhaarOrMobile: citizenMobile,
        otp: citizenOtp
      });
      if (onLoginSuccess) onLoginSuccess('citizen');
    } catch (err: any) {
      // Fallback to sync validator
      const valid = verifyOtpCode(citizenMobile, citizenOtp);
      if (valid) {
        loginAsRoleWithCredentials('citizen', {
          name: citizenName,
          email: citizenEmail,
          aadhaarOrMobile: citizenMobile,
          otp: citizenOtp
        });
        if (onLoginSuccess) onLoginSuccess('citizen');
      } else {
        setLocalError('OTP verification failed: ' + err.message);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    loginAsRoleWithCredentials('officer', {
      name: officerName,
      govId: officerGovId,
      departmentId: officerDept
    });
    if (onLoginSuccess) onLoginSuccess('officer');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    loginAsRoleWithCredentials('admin', {
      name: adminName,
      adminKey,
      pin: adminPin
    });
    if (onLoginSuccess) onLoginSuccess('admin');
  };

  const handleGoogleAuth = async () => {
    await loginWithGoogle(activeRole);
    if (onLoginSuccess) onLoginSuccess(activeRole);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-[#0a1226] to-[#0d1b3e] text-slate-100 selection:bg-indigo-500 selection:text-white'
          : 'bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900'
      }`}
    >
      {/* Dynamic Ambient Background Glows */}
      {isDark ? (
        <>
          <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-6 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-8 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-6 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-8 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Top Banner Navigation */}
      <header
        className={`border-b px-6 py-4 relative z-10 transition-colors ${
          isDark
            ? 'border-indigo-500/20 bg-slate-900/80 backdrop-blur-md shadow-lg shadow-black/25'
            : 'border-slate-200 bg-white/90 backdrop-blur-md shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
              <Shield className="w-6 h-6 text-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-black tracking-tight block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  FlowDoc
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                    isDark
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  v3.2 Gov
                </span>
              </div>
              <span className={`text-[11px] font-mono font-medium block ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                Intelligent Civic Workflow & Statutory SLA Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Share FlowDoc Web Link Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowShareModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer ${
                isDark
                  ? 'text-indigo-200 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40'
                  : 'text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
              }`}
              title="FlowDoc Project Web Link"
            >
              <Share2 className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className="hidden sm:inline">FlowDoc Web Link</span>
            </motion.button>

            {/* Light / Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors shadow-xs cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-white bg-slate-900/90 border-slate-700/80 hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-100'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </motion.button>

            <div
              className={`hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border shadow-xs ${
                isDark
                  ? 'text-emerald-300 bg-emerald-950/70 border-emerald-500/30'
                  : 'text-emerald-800 bg-emerald-50 border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold">Gateway Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Viewport */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        {/* RICH HIGH-IMPACT CIVIC CARD */}
        <div
          className={`w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors ${
            isDark
              ? 'bg-[#0d162e]/95 backdrop-blur-xl text-slate-100 shadow-indigo-950/80 border-indigo-500/30'
              : 'bg-white backdrop-blur-xl text-slate-900 shadow-slate-300/50 border-slate-200'
          }`}
        >
          {/* Eye-catching Hero Artwork Banner inside Login UI */}
          <div className="p-4 sm:p-6 bg-gradient-to-b from-indigo-950/20 to-transparent border-b border-indigo-500/20">
            <CivicHeroArtwork />
          </div>

          {/* Card Title & Instruction Header */}
          <div className="px-6 pt-5 pb-3 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-[10px] font-mono text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              Secure Role Authentication
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sign In to FlowDoc
            </h1>
            <p className={`text-xs mt-1 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Select your official designation below to authenticate with verified credentials.
            </p>
          </div>

          {/* 3-User Role Navigation Index (Rich Vibrant Segmented Tabs with Spring Feedback) */}
          <div className="px-6 py-2">
            <div
              className={`grid grid-cols-3 p-1.5 rounded-2xl gap-1.5 text-xs font-semibold border shadow-inner transition-colors ${
                isDark
                  ? 'bg-slate-950/90 border-indigo-500/25'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              {/* Tab 1: Citizen */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setActiveRole('citizen');
                  setLocalError(null);
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRole === 'citizen'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/30 border border-emerald-400/40'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeRole === 'citizen' ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-emerald-600'}`}>
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="block leading-tight">1. Citizen</span>
                  <span className={`text-[10px] hidden sm:block font-normal ${activeRole === 'citizen' ? 'text-emerald-100' : 'text-slate-500'}`}>Aadhaar / OTP</span>
                </div>
              </motion.button>

              {/* Tab 2: Officer Desk */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setActiveRole('officer');
                  setLocalError(null);
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRole === 'officer'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30 border border-blue-400/40'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeRole === 'officer' ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-blue-400' : 'bg-slate-200 text-blue-600'}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="block leading-tight">2. Officer</span>
                  <span className={`text-[10px] hidden sm:block font-normal ${activeRole === 'officer' ? 'text-blue-100' : 'text-slate-500'}`}>Desk & Name</span>
                </div>
              </motion.button>

              {/* Tab 3: Administrator */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setActiveRole('admin');
                  setLocalError(null);
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-lg shadow-amber-600/30 border border-amber-400/40'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeRole === 'admin' ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-amber-600'}`}>
                  <Crown className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="block leading-tight">3. District IAS</span>
                  <span className={`text-[10px] hidden sm:block font-normal ${activeRole === 'admin' ? 'text-amber-100' : 'text-slate-500'}`}>HQ Command</span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Dynamic Visual Role Banner (Vibrant Jewel-Tone Artworks) */}
            {activeRole === 'citizen' && <CitizenArtwork />}
            {activeRole === 'officer' && <OfficerArtwork />}
            {activeRole === 'admin' && <AdminArtwork />}

            {/* Error Banners */}
            {(authError || localError) && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in shadow-lg">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-rose-300">Authentication Error:</span>{' '}
                  {localError || authError}
                </div>
              </div>
            )}

            {/* Google Authentication Option */}
            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-100 shadow-md flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.15C3.27 21.37 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.26A7.13 7.13 0 0 1 4.9 12c0-.79.14-1.57.38-2.26V6.59H1.26A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.26 5.41l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.63 1.26 6.59l4.02 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                  />
                </svg>
                <span>Continue with Google as {activeRole.toUpperCase()}</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/60" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-[#0d162e] px-2.5">or sign in with credentials</span>
                </div>
              </div>
            </div>

            {/* SECTION 1: CITIZEN LOGIN (TWILIO SMS OTP) */}
            {activeRole === 'citizen' && (
              <form onSubmit={handleCitizenLogin} className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-slate-900 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-2.5 text-xs text-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Live <strong className="text-white">Twilio SMS Gateway</strong> authentication (+17372508034).
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-400/40 shrink-0">
                    Twilio REST
                  </span>
                </div>

                {/* Citizen Full Name */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Kavitha Raman"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 font-medium text-white placeholder-slate-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Citizen Email Address */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="e.g. kavitha.raman@flowdoc.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 font-medium text-white placeholder-slate-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Citizen Mobile Phone with Twilio Dispatch Button */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200">
                      Mobile Phone Number (E.164)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Twilio Verified: +919080765819
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={citizenMobile}
                      onChange={(e) => setCitizenMobile(e.target.value)}
                      placeholder="+91 90807 65819"
                      className="flex-1 p-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 font-mono font-medium text-white placeholder-slate-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Twilio SMS OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Twilio dispatches an authentic SMS from <span className="font-mono font-semibold text-emerald-300">+1 (737) 250-8034</span> directly to your phone.
                  </p>
                </div>

                {/* Twilio SMS Live Notification Feedback Banner */}
                {otpDispatchMsg && (
                  <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 space-y-1.5 animate-in fade-in shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-bold text-white">{otpDispatchMsg.text}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                        {otpDispatchMsg.deliveryMethod === 'twilio_live_sms' ? 'Carrier Dispatched' : 'Dynamic Verified'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-emerald-500/20 text-[11px] font-mono">
                      <div>
                        <span className="text-emerald-400 text-[10px] block">Sender (Twilio):</span>
                        <span className="font-bold text-white">+17372508034</span>
                      </div>
                      <div>
                        <span className="text-emerald-400 text-[10px] block">Destination:</span>
                        <span className="font-bold text-white">{citizenMobile}</span>
                      </div>
                      {otpDispatchMsg.sid && (
                        <div className="col-span-2 truncate">
                          <span className="text-emerald-400 text-[10px] block">Twilio Message SID:</span>
                          <span className="font-bold text-[10px] text-emerald-300">{otpDispatchMsg.sid}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                      <span className="text-xs text-emerald-200 font-medium">
                        Dynamic 6-Digit SMS Code:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-mono font-black text-xs tracking-widest rounded-lg shadow-md shadow-emerald-500/30">
                          {otpDispatchMsg.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCitizenOtp(otpDispatchMsg.code)}
                          className="text-[10px] text-emerald-300 hover:text-white font-bold underline cursor-pointer"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6-Digit Passcode Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200">
                      6-Digit Passcode (From SMS)
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[10px] text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      Resend SMS
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={citizenOtp}
                      onChange={(e) => setCitizenOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 p-2.5 text-xs text-center font-mono font-bold tracking-widest bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 text-white placeholder-slate-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (otpDispatchMsg?.code) {
                          setCitizenOtp(otpDispatchMsg.code);
                        } else {
                          handleSendOtp();
                        }
                      }}
                      className="px-3.5 py-2 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 rounded-xl border border-emerald-500/40 shrink-0 cursor-pointer transition-colors"
                    >
                      {otpDispatchMsg?.code ? 'Fill Code' : 'Send & Fill'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter the dynamic 6-digit OTP received on your phone or click Fill Code.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={authLoading || isVerifying}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Passcode...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate & Open Citizen Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* SECTION 2: OFFICER DESK LOGIN (WITH OFFICER NAME INPUT) */}
            {activeRole === 'officer' && (
              <form onSubmit={handleOfficerLogin} className="space-y-4">
                {/* Officer Full Name Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200 block">
                      Officer Full Name / Designated Name
                    </label>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                      Official Identity
                    </span>
                  </div>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      placeholder="e.g. Rajesh Varma, Revenue Inspector"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 font-medium text-white placeholder-slate-500 transition-all"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    This designated officer name will appear on application approvals, audit logs, and citizen responses.
                  </p>
                </div>

                {/* Government Officer ID */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    Government Officer ID / Badge Number
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={officerGovId}
                      onChange={(e) => setOfficerGovId(e.target.value)}
                      placeholder="e.g. OFF-REV-8942"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 font-mono font-medium text-white placeholder-slate-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Assigned Municipal Department */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    Assigned Municipal Department
                  </label>
                  <select
                    value={officerDept}
                    onChange={(e) => setOfficerDept(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 font-medium text-white"
                  >
                    <option value="dept_rev" className="bg-slate-900 text-white">Revenue & Land Records (Inspectorate)</option>
                    <option value="dept_twn" className="bg-slate-900 text-white">Building & Town Planning Sanctions</option>
                    <option value="dept_wtr" className="bg-slate-900 text-white">Municipal Water & Sanitation NOC</option>
                    <option value="dept_fcs" className="bg-slate-900 text-white">Civil Supplies & Food Welfare</option>
                  </select>
                </div>

                {/* Officer Access Password */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    Officer Access Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={officerPass}
                      onChange={(e) => setOfficerPass(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-white placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>Authorize & Open Officer Desk (as {officerName.split(',')[0] || 'Officer'})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* SECTION 3: ADMINISTRATOR / IAS LOGIN */}
            {activeRole === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                {/* Administrator Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200 block">
                      District Executive Name
                    </label>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      IAS Magistrate
                    </span>
                  </div>
                  <div className="relative">
                    <Crown className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Dr. Ananya Sharma, IAS"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-medium text-white placeholder-slate-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* District Magistrate Credential Key */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    District Magistrate Credential Key
                  </label>
                  <input
                    type="text"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="IAS-DIST-HQ-2026"
                    className="w-full p-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-mono font-medium text-white placeholder-slate-500"
                    required
                  />
                </div>

                {/* Executive Security PIN */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    Executive Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="••••"
                    className="w-full p-2.5 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-mono text-center tracking-widest text-white placeholder-slate-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>Authorize & Open District Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Rich Card Footer */}
          <div className="p-3.5 bg-slate-950/80 border-t border-slate-800/80 text-center text-[11px] text-slate-400 font-mono">
            FlowDoc Civic Platform · Real-time Firestore & Twilio SMS Active
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer
        className={`border-t py-4 px-6 text-center text-xs relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto w-full transition-colors ${
          isDark
            ? 'border-indigo-500/20 bg-slate-900/80 backdrop-blur-md text-slate-400'
            : 'border-slate-200 bg-white/90 backdrop-blur-md text-slate-600'
        }`}
      >
        <p>Protected by FlowDoc 3NF Relational RBAC Security · All rights reserved.</p>
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className={`text-xs font-semibold underline flex items-center gap-1 cursor-pointer ${
            isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <Share2 className="w-3 h-3" />
          <span>Copy FlowDoc Web Link</span>
        </button>
      </footer>

      {/* Share Web Link Modal */}
      <ShareWebLinkModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};
