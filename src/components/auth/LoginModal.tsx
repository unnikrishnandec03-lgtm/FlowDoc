import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { UserRole } from '../../types/civic';
import { sendOtpToPhone, verifyOtpCode } from '../../services/twilioOtpService';
import {
  CitizenArtwork,
  OfficerArtwork,
  AdminArtwork
} from './LoginVisuals';
import {
  Shield,
  User as UserIcon,
  Briefcase,
  Crown,
  KeyRound,
  ArrowRight,
  Smartphone,
  Lock,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Send,
  RefreshCw,
  PhoneCall,
  Mail,
  UserCheck
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  defaultRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'citizen'
}) => {
  const {
    currentUser,
    users,
    switchUserById,
    loginWithGoogle,
    loginAsRoleWithCredentials,
    authLoading,
    authError,
    isAuthenticated
  } = useCivic();

  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  
  // Citizen form state with name, email and live Twilio OTP integration
  const [citizenName, setCitizenName] = useState('Kavitha Raman');
  const [citizenEmail, setCitizenEmail] = useState('kavitha.raman@flowdoc.gov.in');
  const [aadhaarOrMobile, setAadhaarOrMobile] = useState('+91 90807 65819');
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpDispatchStatus, setOtpDispatchStatus] = useState<{
    sent: boolean;
    message?: string;
    deliveryMethod?: string;
    code?: string;
  } | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Officer form state (with Officer Name input)
  const [officerName, setOfficerName] = useState('Rajesh Varma, Revenue Inspector');
  const [officerGovId, setOfficerGovId] = useState('OFF-REV-8942');
  const [officerPass, setOfficerPass] = useState('••••••••••••');
  const [officerZone, setOfficerZone] = useState('dept_rev');

  // Administrator form state
  const [adminName, setAdminName] = useState('Dr. Ananya Sharma, IAS');
  const [adminKey, setAdminKey] = useState('IAS-DIST-HQ-2026');
  const [securityPin, setSecurityPin] = useState('9982');

  if (!isOpen) return null;

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSendTwilioOtp = async () => {
    if (!aadhaarOrMobile.trim()) {
      setOtpError('Please enter a valid mobile number.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError(null);
    try {
      const result = await sendOtpToPhone(aadhaarOrMobile);
      setOtpDispatchStatus({
        sent: true,
        message: result.message,
        deliveryMethod: result.deliveryMethod,
        code: result.code
      });
      // Pre-fill input for quick convenience while also allowing manual typing
      setOtpInput(result.code);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to dispatch SMS OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    // Validate OTP code
    const isValid = verifyOtpCode(aadhaarOrMobile, otpInput);
    if (!isValid) {
      setOtpError('Invalid OTP code entered. Please click "Send OTP" or check received SMS.');
      return;
    }

    loginAsRoleWithCredentials('citizen', {
      name: citizenName,
      email: citizenEmail,
      aadhaarOrMobile,
      otp: otpInput
    });
    if (onClose) onClose();
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRoleWithCredentials('officer', {
      name: officerName,
      govId: officerGovId,
      departmentId: officerZone
    });
    if (onClose) onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRoleWithCredentials('admin', {
      name: adminName,
      adminKey,
      pin: securityPin
    });
    if (onClose) onClose();
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle(selectedRole);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* RICH HIGH-IMPACT MODAL CONTAINER */}
      <div className="bg-[#0d162e]/98 backdrop-blur-2xl rounded-3xl max-w-lg w-full shadow-2xl shadow-indigo-950/90 border border-indigo-500/30 overflow-hidden my-8 animate-in zoom-in-95 duration-150 text-slate-100">
        
        {/* Modal Top Header */}
        <div className="p-6 border-b border-indigo-500/20 text-center relative bg-gradient-to-b from-indigo-950/60 to-transparent">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-bold cursor-pointer"
              title="Close modal"
            >
              ✕
            </button>
          )}

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center mx-auto mb-2.5 text-white shadow-lg shadow-indigo-500/30">
            <Shield className="w-6 h-6 text-white drop-shadow" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            FlowDoc Authentication
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Official 3-tier civic workflow access control. Choose your role to sign in.
          </p>
        </div>

        {/* 3-Tier Role Selector Tabs (Rich Vibrant Segmented Controls) */}
        <div className="px-6 pt-3">
          <div className="grid grid-cols-3 bg-slate-950/90 p-1 rounded-2xl gap-1 text-xs font-semibold border border-indigo-500/25 shadow-inner">
            <button
              onClick={() => handleRoleTabChange('citizen')}
              className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'citizen'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/30 border border-emerald-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserIcon className="w-4 h-4 text-emerald-300" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => handleRoleTabChange('officer')}
              className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'officer'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30 border border-blue-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-300" />
              <span>Officer</span>
            </button>

            <button
              onClick={() => handleRoleTabChange('admin')}
              className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-lg shadow-amber-600/30 border border-amber-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Dynamic Visual Role Image (Images inside login UI only) */}
          {selectedRole === 'citizen' && <CitizenArtwork />}
          {selectedRole === 'officer' && <OfficerArtwork />}
          {selectedRole === 'admin' && <AdminArtwork />}

          {/* Error Message if any */}
          {(authError || otpError) && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 shadow-md">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-rose-300">Authentication Notice:</span> {authError || otpError}
              </div>
            </div>
          )}

          {/* Quick Google Sign-In with Firebase Auth */}
          <div>
            <button
              onClick={handleGoogleSignIn}
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
              <span>Continue with Google as {selectedRole.toUpperCase()}</span>
            </button>
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/60" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                <span className="bg-[#0d162e] px-2">or credentials</span>
              </div>
            </div>
          </div>

          {/* TAB 1: Citizen Login (Aadhaar / Twilio Live Mobile OTP) */}
          {selectedRole === 'citizen' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-3.5">
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
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 font-medium text-white placeholder-slate-500"
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
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 font-medium text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Citizen Mobile Phone */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Registered Mobile Phone or Aadhaar ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aadhaarOrMobile}
                    onChange={(e) => setAadhaarOrMobile(e.target.value)}
                    placeholder="+91 90807 65819"
                    className="flex-1 p-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 font-mono text-white placeholder-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendTwilioOtp}
                    disabled={isSendingOtp}
                    className="px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Twilio SMS Dispatch Feedback */}
              {otpDispatchStatus && (
                <div className="p-2.5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-start gap-2 animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-white">{otpDispatchStatus.message}</span>
                    <p className="text-[11px] text-emerald-300 mt-0.5 font-mono">
                      Dynamic Code: <strong className="text-white font-bold tracking-widest bg-emerald-500/30 px-1.5 py-0.5 rounded border border-emerald-400/40">{otpDispatchStatus.code}</strong> (pre-filled below)
                    </p>
                  </div>
                </div>
              )}

              {/* 6-Digit Passcode */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-200">
                    6-Digit Mobile OTP Passcode
                  </label>
                  <button
                    type="button"
                    onClick={handleSendTwilioOtp}
                    className="text-[10px] text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 p-2 text-xs text-center font-mono font-bold tracking-widest bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 text-white placeholder-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (otpDispatchStatus?.code) {
                        setOtpInput(otpDispatchStatus.code);
                      } else {
                        handleSendTwilioOtp();
                      }
                    }}
                    className="px-3 py-2 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 rounded-xl border border-emerald-500/40 shrink-0 cursor-pointer"
                  >
                    {otpDispatchStatus?.code ? 'Fill OTP' : 'Send & Fill'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>Verify OTP & Enter Citizen Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* TAB 2: Officer Desk Login (Now with Officer Name Input) */}
          {selectedRole === 'officer' && (
            <form onSubmit={handleOfficerSubmit} className="space-y-3.5">
              {/* Officer Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Officer Full Name / Designated Name
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="e.g. Rajesh Varma, Revenue Inspector"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 font-medium text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Government Employee ID */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Government Employee ID / Badge No.
                </label>
                <input
                  type="text"
                  value={officerGovId}
                  onChange={(e) => setOfficerGovId(e.target.value)}
                  placeholder="e.g. OFF-REV-8942"
                  className="w-full p-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 font-mono text-white placeholder-slate-500"
                  required
                />
              </div>

              {/* Departmental Branch */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Departmental Branch
                </label>
                <select
                  value={officerZone}
                  onChange={(e) => setOfficerZone(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-white font-medium"
                >
                  <option value="dept_rev" className="bg-slate-900 text-white">Revenue & Land Records (Inspectorate)</option>
                  <option value="dept_twn" className="bg-slate-900 text-white">Building & Town Planning Sanctions</option>
                  <option value="dept_wtr" className="bg-slate-900 text-white">Municipal Water & Sanitation NOC</option>
                  <option value="dept_fcs" className="bg-slate-900 text-white">Civil Supplies & Food Welfare</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Officer Security Token / Password
                </label>
                <input
                  type="password"
                  value={officerPass}
                  onChange={(e) => setOfficerPass(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-white placeholder-slate-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>Authorize & Open Officer Desk (as {officerName.split(',')[0] || 'Officer'})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* TAB 3: Administrator / District Collector Login */}
          {selectedRole === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              {/* Administrator Name */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  District Executive Name
                </label>
                <div className="relative">
                  <Crown className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sharma, IAS"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-medium text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  District Collector Credential Key
                </label>
                <input
                  type="text"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="IAS-DIST-HQ-2026"
                  className="w-full p-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-mono text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Executive Security PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="••••"
                  className="w-full p-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 font-mono text-center tracking-widest text-white placeholder-slate-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>Authorize & Open District Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Pre-fill helpers with distinct colors */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('citizen');
                  setCitizenName('Priya Sharma');
                  setCitizenEmail('priya.sharma@flowdoc.gov.in');
                  setAadhaarOrMobile('+91 90807 65819');
                  setOtpInput('824190');
                }}
                className={`p-2 text-left rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedRole === 'citizen'
                    ? 'border-emerald-500/60 bg-emerald-950/60 shadow-md shadow-emerald-950/40'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850'
                }`}
              >
                <span className="font-bold text-white block truncate">Priya Sharma</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('officer');
                  setOfficerName('Rajesh Varma, Revenue Inspector');
                  setOfficerGovId('OFF-REV-8942');
                  setOfficerZone('dept_rev');
                }}
                className={`p-2 text-left rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedRole === 'officer'
                    ? 'border-blue-500/60 bg-blue-950/60 shadow-md shadow-blue-950/40'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850'
                }`}
              >
                <span className="font-bold text-white block truncate">Rajesh Varma</span>
                <span className="text-[10px] text-blue-400 font-semibold">Officer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setAdminName('Dr. Ananya Sharma, IAS');
                  setAdminKey('IAS-DIST-HQ-2026');
                  setSecurityPin('9982');
                }}
                className={`p-2 text-left rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedRole === 'admin'
                    ? 'border-amber-500/60 bg-amber-950/60 shadow-md shadow-amber-950/40'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850'
                }`}
              >
                <span className="font-bold text-white block truncate">Dr. Ananya</span>
                <span className="text-[10px] text-amber-400 font-semibold">District IAS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 text-center text-[10px] text-slate-400 font-mono">
          FlowDoc Civic Platform · All logins authenticated via strict RBAC
        </div>
      </div>
    </div>
  );
};
