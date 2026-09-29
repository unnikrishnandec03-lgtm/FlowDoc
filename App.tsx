import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { Header } from './components/Header';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { OfficerDesk } from './components/officer/OfficerDesk';
import { CommandCenter } from './components/admin/CommandCenter';
import { ActivityLog } from './components/activity/ActivityLog';
import { AuthPortal } from './components/auth/AuthPortal';
import { translations } from './utils/translations';
import { Shield, Sparkles, Database, CheckCircle2, Lock, LogOut, Share2 } from 'lucide-react';
import { ShareWebLinkModal } from './components/common/ShareWebLinkModal';

const springTransition = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 26,
  mass: 0.6
};

const MainContent: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    currentLanguage,
    signOutUser,
    theme,
    toggleTheme
  } = useCivic();

  const [showShareModal, setShowShareModal] = useState(false);

  const [activeTab, setActiveTab] = useState<'portal' | 'desk' | 'admin' | 'logs'>(
    currentUser.role === 'citizen'
      ? 'portal'
      : currentUser.role === 'officer'
      ? 'desk'
      : 'admin'
  );

  const t = translations[currentLanguage];

  // Sync tab with user role upon login
  React.useEffect(() => {
    if (currentUser.role === 'citizen') setActiveTab('portal');
    else if (currentUser.role === 'officer') setActiveTab('desk');
    else if (currentUser.role === 'admin') setActiveTab('admin');
  }, [currentUser.role]);

  // FIRST INTERFACE: If user is not authenticated, show login UI first!
  // No internal application details are exposed without authenticating.
  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="auth-portal"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={springTransition}
        >
          <AuthPortal
            onLoginSuccess={(role) => {
              if (role === 'citizen') setActiveTab('portal');
              else if (role === 'officer') setActiveTab('desk');
              else if (role === 'admin') setActiveTab('admin');
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white'
          : 'bg-slate-50 text-slate-900 selection:bg-indigo-200 selection:text-indigo-950'
      }`}
    >
      {/* Dynamic Ambient Background Gradients & Color Composition Mesh */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 select-none">
        {isDark ? (
          <>
            {/* Top-center indigo/cyan luminous aurora glow */}
            <div className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full bg-gradient-to-b from-indigo-600/25 via-violet-600/15 to-cyan-500/0 blur-[130px]" />
            
            {/* Top-right vibrant violet orb */}
            <div className="absolute top-[10%] right-[-120px] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-600/20 via-indigo-500/10 to-transparent blur-[110px]" />
            
            {/* Mid-left cyan / emerald aura */}
            <div className="absolute top-[45%] -left-[140px] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-transparent blur-[120px]" />

            {/* Bottom-right warm amber/rose ambient light */}
            <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[400px] rounded-full bg-gradient-to-tl from-indigo-500/15 via-rose-500/10 to-transparent blur-[130px]" />

            {/* Subtle geometric dot grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `radial-gradient(#818cf8 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />
          </>
        ) : (
          <>
            {/* Light mode soft ambient glow */}
            <div className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full bg-gradient-to-b from-indigo-200/50 via-purple-100/35 to-transparent blur-[110px]" />
            
            <div className="absolute top-[10%] right-[-120px] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-blue-100/50 via-indigo-50/40 to-transparent blur-[100px]" />
            
            <div className="absolute top-[45%] -left-[140px] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-transparent blur-[110px]" />

            <div className="absolute bottom-[-100px] right-[10%] w-[600px] h-[400px] rounded-full bg-gradient-to-tl from-rose-100/40 via-amber-50/30 to-transparent blur-[120px]" />

            <div 
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />
          </>
        )}
      </div>

      {/* Top Header strictly locked to role */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport Content strictly locked to authenticated user role with spring transitions */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {currentUser.role === 'citizen' && (
            <motion.div
              key={`citizen-${activeTab}`}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.985 }}
              transition={springTransition}
            >
              {activeTab === 'logs' ? <ActivityLog /> : <CitizenPortal />}
            </motion.div>
          )}

          {currentUser.role === 'officer' && (
            <motion.div
              key={`officer-${activeTab}`}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.985 }}
              transition={springTransition}
            >
              {activeTab === 'logs' ? <ActivityLog /> : <OfficerDesk />}
            </motion.div>
          )}

          {currentUser.role === 'admin' && (
            <motion.div
              key={`admin-${activeTab}`}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.985 }}
              transition={springTransition}
            >
              {activeTab === 'logs' ? <ActivityLog /> : <CommandCenter />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Status Bar */}
      <footer className="border-t border-slate-200 dark:border-indigo-500/20 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 dark:text-slate-400 relative z-20 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-300 dark:via-indigo-200 dark:to-indigo-100 bg-clip-text text-transparent">{t.appName}</span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span>{t.tagline}</span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Strict Role Access Active
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Footer FlowDoc Web Link Share Button */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>FlowDoc Web Link</span>
            </button>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

            <span>
              Session: <strong className="text-slate-900 dark:text-white font-semibold">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOutUser()}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </div>
      </footer>

      {/* Share Web Link Modal */}
      <ShareWebLinkModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CivicProvider>
      <MainContent />
    </CivicProvider>
  );
}
