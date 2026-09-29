import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCivic } from '../context/CivicContext';
import { translations } from '../utils/translations';
import { LanguageCode } from '../types/civic';
import { ShareWebLinkModal } from './common/ShareWebLinkModal';
import {
  Bell,
  Globe,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  Zap,
  LogOut,
  Sun,
  Moon,
  Share2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'portal' | 'desk' | 'admin' | 'logs';
  setActiveTab: (tab: 'portal' | 'desk' | 'admin' | 'logs') => void;
}

const popoverSpring = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 28,
  mass: 0.6
};

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    currentLanguage,
    setCurrentLanguage,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    triggerFlash,
    signOutUser,
    theme,
    toggleTheme
  } = useCivic();

  const [showNotifsMenu, setShowNotifsMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const t = translations[currentLanguage];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ta', label: 'தமிழ்', flag: 'TA' },
    { code: 'hi', label: 'हिन्दी', flag: 'HI' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200 dark:border-indigo-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
      {/* Delicate luminous gradient border line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />

      {/* Real-time PL/SQL Trigger Execution Alert Bar (Event-Driven alert) with spring motion */}
      <AnimatePresence>
        {triggerFlash && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white text-xs px-4 py-2 border-b border-indigo-500/30 shadow-inner"
          >
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono text-amber-300 uppercase tracking-wider text-[11px] font-bold">
                Event Triggered:
              </span>
              <span className="text-slate-200 font-mono text-xs truncate">
                {triggerFlash}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar Contract (3 Zones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with spring hover */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-600/30 ring-1 ring-white/30 cursor-pointer"
            onClick={() => {
              if (currentUser.role === 'citizen') setActiveTab('portal');
              else if (currentUser.role === 'officer') setActiveTab('desk');
              else setActiveTab('admin');
            }}
          >
            <Shield className="w-5 h-5 text-indigo-100" />
          </motion.div>
          <div>
            <button
              onClick={() => {
                if (currentUser.role === 'citizen') setActiveTab('portal');
                else if (currentUser.role === 'officer') setActiveTab('desk');
                else setActiveTab('admin');
              }}
              className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent hover:opacity-85 transition-opacity flex items-center gap-1.5"
            >
              <span>{t.appName}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500/30 shadow-xs">
                Auth Active
              </span>
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation strictly locked to authenticated user role with spring tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
          {currentUser.role === 'citizen' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('portal')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'portal'
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.navCitizenPortal}
            </motion.button>
          )}

          {currentUser.role === 'officer' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('desk')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'desk'
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.navOfficerDesk}
            </motion.button>
          )}

          {currentUser.role === 'admin' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.navCommandCenter}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {currentUser.role === 'citizen'
                ? 'My Activity Log'
                : currentUser.role === 'officer'
                ? 'Department Audit Log'
                : 'District Audit Log'}
            </span>
          </motion.button>
        </nav>

        {/* Zone 3: Primary actions (Multilingual Toggle, Notifications, Authenticated Identity & Sign Out) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Share FlowDoc Web Link Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-200 hover:text-indigo-900 dark:hover:text-white bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-500/40 rounded-xl transition-all shadow-xs cursor-pointer"
            title="FlowDoc Project Web Link & Sharing"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">FlowDoc Web Link</span>
          </motion.button>

          {/* Light / Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 transition-colors shadow-xs cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </motion.button>

          {/* Multilingual Selector (EN | தமிழ் | हिन्दी) with Spring Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900/90 border border-slate-700/80 rounded-xl hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">{currentLanguage.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={popoverSpring}
                  className="absolute right-0 mt-2 w-40 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-indigo-500/30 py-1.5 z-50 overflow-hidden text-slate-200"
                >
                  {languages.map((lang) => (
                    <motion.button
                      whileHover={{ x: 2 }}
                      key={lang.code}
                      onClick={() => {
                        setCurrentLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        currentLanguage === lang.code
                          ? 'font-bold text-indigo-300 bg-indigo-950/70'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-semibold">
                        {lang.flag}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Popover with trigger alert */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowNotifsMenu(!showNotifsMenu)}
              className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 border border-slate-700/80 bg-slate-900/90 transition-colors shadow-xs cursor-pointer"
              title={t.notifications}
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-slate-900" />
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifsMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={popoverSpring}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-indigo-500/30 py-2 z-50 overflow-hidden text-slate-100"
                >
                  <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{t.notifications}</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full font-bold border border-rose-500/30">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                      >
                        {t.markAllRead}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        {t.noNotifications}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <motion.div
                          whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3.5 text-xs transition-colors cursor-pointer ${
                            !notif.read ? 'bg-indigo-950/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {notif.type === 'alert' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            ) : notif.type === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className="font-semibold text-white truncate">{notif.title}</p>
                                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                                {notif.message}
                              </p>
                              {notif.requiresAction && (
                                <span className="inline-block mt-1.5 text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">
                                  Immediate Action Required
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Locked Identity Badge (Strict RBAC - No in-app role switching) */}
          <div className="flex items-center gap-2 pl-2.5 pr-2 py-1 bg-slate-900/90 rounded-xl border border-indigo-500/20 shadow-xs">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs ${
              currentUser.role === 'citizen'
                ? 'bg-gradient-to-br from-indigo-600 to-violet-600'
                : currentUser.role === 'officer'
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                : 'bg-gradient-to-br from-amber-600 to-amber-800'
            }`}>
              {currentUser.avatarText}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="font-bold text-white text-[11px] truncate max-w-[130px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium capitalize truncate max-w-[130px]">
                {currentUser.role === 'admin'
                  ? 'District Magistrate'
                  : currentUser.role === 'officer'
                  ? currentUser.departmentName || 'Revenue Officer'
                  : 'Citizen Account'}
              </span>
            </div>
            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
              currentUser.role === 'citizen'
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                : currentUser.role === 'officer'
                ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              {currentUser.role}
            </span>
          </div>

          {/* Explicit Sign Out Button (Must log in again to switch) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => signOutUser()}
            title="Sign out and return to FlowDoc Login Interface"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </div>

      {/* Share Web Link Modal */}
      <ShareWebLinkModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </header>
  );
};
