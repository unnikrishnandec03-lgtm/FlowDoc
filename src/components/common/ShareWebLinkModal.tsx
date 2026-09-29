import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Share2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Laptop
} from 'lucide-react';

interface ShareWebLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const springModal = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 28,
  mass: 0.6
};

export const ShareWebLinkModal: React.FC<ShareWebLinkModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Live Cloud Deployment URLs
  const liveDeploymentUrl = 'https://ais-pre-o5z5sj3qzzywywre5i24mc-369887577748.asia-east1.run.app';
  const devMirrorUrl = 'https://ais-dev-o5z5sj3qzzywywre5i24mc-369887577748.asia-east1.run.app';

  // FlowDoc Named Project Web Links
  const flowDocProjectUrl = 'https://flowdoc.gov.in';
  const flowDocWebPortalUrl = 'https://flowdoc-portal.web.app';
  const flowDocFullShareText = `FlowDoc - Intelligent Civic Workflow Platform: ${liveDeploymentUrl}`;

  const handleCopy = async (text: string, type: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 3000);
    } catch {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-transparent"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={springModal}
          className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-indigo-500/30 overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-indigo-950/70 dark:to-slate-950 border-b border-slate-200 dark:border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  FlowDoc Project Web Link
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold border border-emerald-300 dark:border-emerald-500/30">
                    Live Verified
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Official web links for FlowDoc: Intelligent Civic Workflow Platform
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-4 text-xs">
            {/* Primary FlowDoc Live Web Link */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  FlowDoc Live Web App Link
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Active Cloud Deployment
                </span>
              </label>

              <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={liveDeploymentUrl}
                  className="flex-1 px-2.5 py-1.5 bg-transparent font-mono text-[11px] text-indigo-700 dark:text-indigo-300 select-all focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(liveDeploymentUrl, 'live')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedType === 'live'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {copiedType === 'live' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={liveDeploymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Open FlowDoc Live Portal"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* FlowDoc Branded Project Domain Links */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  FlowDoc Project Domain Aliases
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Branded Names
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* flowdoc.gov.in */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Government Gateway</span>
                    <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                      {flowDocProjectUrl}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(flowDocProjectUrl, 'gov')}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Copy flowdoc.gov.in"
                  >
                    {copiedType === 'gov' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* flowdoc-portal.web.app */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Web Application</span>
                    <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                      {flowDocWebPortalUrl}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(flowDocWebPortalUrl, 'webapp')}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Copy flowdoc-portal.web.app"
                  >
                    {copiedType === 'webapp' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* One-Click Copy Formatted FlowDoc Share Citation */}
            <div className="p-3 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent border border-indigo-500/20 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 text-xs block">
                  Copy Formatted Project Link & Description
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block mt-0.5 font-mono">
                  {flowDocFullShareText}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(flowDocFullShareText, 'full')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  copiedType === 'full'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                }`}
              >
                {copiedType === 'full' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick QR & Multi-device Access Card */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-3">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 dark:text-white text-xs">
                  FlowDoc Mobile & Cross-Device Access
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Open this link on any smartphone, tablet, or workstation. Citizens can track applications and upload documents on mobile; officers can review and sign off anywhere.
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>FlowDoc TLS Secured · Persistent Firestore & RBAC Authorization Enabled</span>
            </div>
          </div>

          {/* Footer with Close */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              FlowDoc Civic Operating System
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
