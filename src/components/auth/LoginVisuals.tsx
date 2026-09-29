import React from 'react';
import { Shield, Sparkles, CheckCircle2, Lock, Award, Building, FileCheck, Smartphone, Clock, ArrowRight, Zap, Check } from 'lucide-react';

/**
 * High-fidelity, vibrant vector-based civic artwork specifically for the Login UI.
 * Provides striking, professional, richly-colored visuals for Citizen, Officer, and Administrator views.
 */

export const CivicHeroArtwork: React.FC = () => {
  return (
    <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 shadow-2xl flex items-center justify-between px-6 py-4 border border-indigo-500/30">
      {/* Background Architectural & Grid Vector Pattern with Ambient Glowing Orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="civic-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#6366f1" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#civic-grid)" />
        <circle cx="85%" cy="30%" r="90" fill="#3b82f6" filter="blur(40px)" opacity="0.4" />
        <circle cx="20%" cy="80%" r="70" fill="#6366f1" filter="blur(30px)" opacity="0.3" />
      </svg>

      {/* Left text & badge */}
      <div className="relative z-10 max-w-sm text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[10px] font-mono text-indigo-200 font-bold uppercase tracking-wider mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Municipal Governance Gateway</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 tracking-tight leading-tight">
          FlowDoc Civic Platform
        </h2>
        <p className="text-xs text-indigo-200/90 mt-1 line-clamp-2">
          Statutory SLA Tracking · Twilio SMS Authentication · 3-Tier Role Governance
        </p>

        {/* Micro tags */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Twilio Active
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
            Official Seal
          </span>
        </div>
      </div>

      {/* Right Graphic: Illustrated 3D Civic Crest & Identity Badge */}
      <div className="relative z-10 shrink-0 hidden sm:block">
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-b from-indigo-900/60 to-slate-900/80 backdrop-blur-md border border-indigo-400/30 p-2.5 shadow-2xl flex flex-col items-center justify-center relative transform hover:scale-105 transition-transform group">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-1.5">
            <Shield className="w-7 h-7 text-white drop-shadow-md" />
          </div>
          <span className="text-[10px] font-mono font-bold text-indigo-100 uppercase tracking-wider">
            Verified Gov
          </span>
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CitizenArtwork: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-900 border border-emerald-500/40 shadow-xl shadow-emerald-950/40 flex items-center gap-4 text-white">
      {/* Visual illustration box */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 relative">
        <Smartphone className="w-7 h-7 text-white" />
        <span className="absolute -bottom-1 -right-1 bg-emerald-900 text-emerald-200 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-emerald-400 shadow-xs">
          OTP
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-100 tracking-wide">
            Citizen Digital e-Sign Portal
          </span>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
            SMS Live
          </span>
        </div>
        <p className="text-[11px] text-emerald-200/90 mt-1 leading-snug">
          Enter your legal name, email, and mobile phone to receive an authentic, dynamic 6-digit SMS verification code dispatched via Twilio REST gateway.
        </p>
      </div>
    </div>
  );
};

export const OfficerArtwork: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-900 border border-blue-500/40 shadow-xl shadow-blue-950/40 flex items-center gap-4 text-white">
      {/* Visual illustration box */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 relative">
        <Award className="w-7 h-7 text-amber-300" />
        <span className="absolute -bottom-1 -right-1 bg-blue-900 text-blue-200 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-blue-400 shadow-xs">
          DESK
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-100 tracking-wide">
            Officer Duty Station & SLA Queue
          </span>
          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-400/40">
            Scrutiny Desk
          </span>
        </div>
        <p className="text-[11px] text-blue-200/90 mt-1 leading-snug">
          Input your designated officer name and official ID to inspect citizen grievances, approve documents, and maintain automated statutory SLA timers.
        </p>
      </div>
    </div>
  );
};

export const AdminArtwork: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-slate-900 border border-amber-500/40 shadow-xl shadow-amber-950/40 flex items-center gap-4 text-white">
      {/* Visual illustration box */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 relative">
        <Building className="w-7 h-7 text-white" />
        <span className="absolute -bottom-1 -right-1 bg-amber-900 text-amber-200 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-amber-400 shadow-xs">
          IAS
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-100 tracking-wide">
            District Magistrate Command Center
          </span>
          <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/40">
            Executive HQ
          </span>
        </div>
        <p className="text-[11px] text-amber-200/90 mt-1 leading-snug">
          District Collector & executive magistrates oversee district-wide departmental metrics, statutory extension sanctions, and inter-departmental telemetry.
        </p>
      </div>
    </div>
  );
};
