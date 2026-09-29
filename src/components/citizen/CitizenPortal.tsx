import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCivic } from '../../context/CivicContext';
import { translations } from '../../utils/translations';
import { Application, TimelineStep, ApplicationDocument } from '../../types/civic';
import { sendOtpToPhone, verifyOtpCode, verifyOtpCodeAsync } from '../../services/twilioOtpService';
import { DocumentViewerModal } from '../officer/DocumentViewerModal';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Smartphone,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  Eye,
  Maximize2
} from 'lucide-react';

const springCard = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 26,
  mass: 0.6
};

export const CitizenPortal: React.FC = () => {
  const {
    currentUser,
    applications,
    selectedAppId,
    setSelectedAppId,
    reuploadDocument,
    currentLanguage,
    signOutUser
  } = useCivic();

  const t = translations[currentLanguage];

  // Citizen's applications
  const myApplications = applications.filter(
    (app) => app.applicantId === currentUser.id || app.applicantName === currentUser.name
  );

  const activeApp: Application =
    applications.find((app) => app.id === selectedAppId) ||
    myApplications[0] ||
    applications[0];

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);
  const [showOtpDemoModal, setShowOtpDemoModal] = useState(false);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<ApplicationDocument | null>(null);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(true);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsFeedback, setSmsFeedback] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSendCitizenOtp = async () => {
    setIsSendingSms(true);
    setOtpError(null);
    try {
      const res = await sendOtpToPhone('+91 90807 65819');
      setSmsFeedback(res.message);
      setDispatchedCode(res.code);
      setOtpInput(res.code);
    } catch (err: any) {
      setOtpError('Failed to send SMS: ' + err.message);
    } finally {
      setIsSendingSms(false);
    }
  };

  // Stepper state derived from activeApp
  const getStepperStatus = (stepIndex: number): TimelineStep['status'] => {
    if (activeApp.status === 'ISSUE_FLAGGED') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'completed';
      if (stepIndex === 2) return 'flagged'; // Issue flagged at officer desk
      return 'upcoming';
    }

    if (activeApp.status === 'RESOLVED_APPROVED') {
      return 'completed';
    }

    if (activeApp.status === 'OFFICER_REVIEW' || activeApp.status === 'REDIRECTED') {
      if (stepIndex <= 1) return 'completed';
      if (stepIndex === 2) return 'current';
      return 'upcoming';
    }

    if (activeApp.status === 'AI_PARSED') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'current';
      return 'upcoming';
    }

    // UPLOADED
    if (stepIndex === 0) return 'current';
    return 'upcoming';
  };

  const steps = [
    {
      id: 'step_1',
      title: t.step1Title,
      desc: t.step1Desc,
      status: getStepperStatus(0),
      timestamp: new Date(activeApp.submittedAt).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    {
      id: 'step_2',
      title: t.step2Title,
      desc: t.step2Desc,
      status: getStepperStatus(1),
      timestamp: activeApp.status !== 'UPLOADED' ? 'AI OCR Verified' : 'Pending'
    },
    {
      id: 'step_3',
      title: t.step3Title,
      desc:
        activeApp.status === 'ISSUE_FLAGGED'
          ? `Discrepancy: ${activeApp.flagReason || 'Document illegible'}`
          : activeApp.status === 'REDIRECTED'
          ? `Redirected: ${activeApp.departmentName}`
          : t.step3Desc,
      status: getStepperStatus(2),
      timestamp: activeApp.assignedOfficerName
    },
    {
      id: 'step_4',
      title: t.step4Title,
      desc: t.step4Desc,
      status: getStepperStatus(3),
      timestamp: activeApp.status === 'RESOLVED_APPROVED' ? 'Issued with Digital Seal' : 'Pending'
    }
  ];

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSimulatedSubmit = () => {
    if (!selectedFile && activeApp.status !== 'ISSUE_FLAGGED') return;

    setIsProcessing(true);
    setParsingProgress(15);

    const fileName = selectedFile
      ? selectedFile.name
      : 'EB_Consumer_Bill_August_2026_Certified.pdf';
    const fileSize = selectedFile
      ? `${(selectedFile.size / 1024).toFixed(1)} KB`
      : '1.4 MB';
    const fileType = selectedFile ? selectedFile.type || 'application/pdf' : 'application/pdf';

    const triggerUploadCompletion = (previewDataUrl?: string) => {
      const interval = setInterval(() => {
        setParsingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            setTimeout(() => {
              setIsProcessing(false);
              reuploadDocument(
                activeApp.id,
                fileName,
                {
                  meterNo: '04-118-092-4112 (AI OCR 99.4%)',
                  billDate: '18-Aug-2026 (Valid 37 days ago)'
                },
                previewDataUrl,
                fileSize,
                fileType
              );
              setSelectedFile(null);
              setUploadSuccessAlert(true);
              setTimeout(() => setUploadSuccessAlert(false), 5000);
            }, 400);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        triggerUploadCompletion(dataUrl);
      };
      reader.onerror = () => {
        triggerUploadCompletion(undefined);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      triggerUploadCompletion(undefined);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Aadhaar / Mobile OTP Authentication Bar */}
      <div className="mb-6 bg-slate-900/90 border border-indigo-500/25 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl backdrop-blur-xl text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{t.authBadgeTitle}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Citizen: <span className="font-semibold text-slate-200">{currentUser.name}</span> | Aadhaar: <span className="font-mono text-indigo-300 font-bold">{currentUser.aadhaarMasked || 'XXXX-XXXX-4589'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOtpDemoModal(true)}
            className="text-xs text-slate-200 hover:text-white font-semibold px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 transition-colors shrink-0 cursor-pointer"
          >
            Verify Mobile OTP
          </button>
          <button
            onClick={() => signOutUser()}
            className="text-xs text-rose-300 hover:text-rose-200 font-semibold px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-950/60 hover:bg-rose-900 transition-colors shrink-0 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Title & Application Selector with Spring Interaction */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {t.citizenPortalTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.citizenPortalSubtitle}
          </p>
        </div>

        {/* Application switcher to test multiple states */}
        {myApplications.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Switch Case:</span>
            <div className="flex gap-1.5 p-1 bg-slate-900/90 border border-indigo-500/25 rounded-xl shadow-md backdrop-blur-sm">
              {myApplications.map((app) => (
                <motion.button
                  key={app.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                    activeApp.id === app.id
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80 font-medium'
                  }`}
                >
                  <span className="font-mono">{app.applicationNumber}</span>
                  <span className={`ml-1.5 text-[10px] ${activeApp.id === app.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                    ({app.status === 'ISSUE_FLAGGED' ? 'Flagged' : app.status === 'RESOLVED_APPROVED' ? 'Approved' : 'In Review'})
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Single-Column Wizard Card */}
      <motion.div
        layout
        transition={springCard}
        className="bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/25 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden text-slate-100"
      >
        {/* Active Application Header Banner with Rich Oceanic Civic Gradient */}
        <div className="relative p-6 border-b border-indigo-500/20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
          {/* Subtle iridescent glow overlay */}
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wide text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                  {activeApp.applicationNumber}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300 font-medium">{activeApp.departmentName}</span>
              </div>
              <h2 className="text-base font-bold mt-1.5 text-white tracking-tight">{activeApp.title}</h2>
            </div>

            {/* Status Indicator with harmonic gradient pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {activeApp.status === 'ISSUE_FLAGGED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500/25 to-amber-500/20 text-rose-200 border border-rose-400/40 shadow-xs shadow-rose-950/40">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  {t.statusIssueFlagged}
                </span>
              ) : activeApp.status === 'RESOLVED_APPROVED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500/25 to-teal-500/20 text-emerald-200 border border-emerald-400/40 shadow-xs shadow-emerald-950/40">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {t.statusResolvedApproved}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/25 to-cyan-500/20 text-indigo-200 border border-indigo-400/40 shadow-xs shadow-indigo-950/40">
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  {t.statusOfficerReview}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic AI Alert Box (Simulated AI Explanation if Flagged/Paused) */}
        <AnimatePresence>
          {activeApp.status === 'ISSUE_FLAGGED' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={springCard}
              className="p-6 bg-gradient-to-r from-amber-950/80 via-orange-950/50 to-slate-950 border-b border-amber-500/40 shadow-inner overflow-hidden text-amber-200"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {t.aiDiagnosisTitle}
                    </h3>
                    <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/40 shadow-xs">
                      {t.actionRequiredTitle}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/90 mt-1.5 leading-relaxed font-sans font-medium">
                    {activeApp.aiExplanation ||
                      'The uploaded utility bill is illegible. The AI OCR recency detector identified bill billing date as October 14, 2021, breaching the mandatory 90-day validity rule. Please re-upload a recent electricity bill.'}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-200 bg-amber-950/70 p-2.5 rounded-xl border border-amber-500/30">
                    <span className="font-bold text-amber-400">Officer Instruction:</span>
                    <span className="font-normal text-amber-200">
                      {activeApp.flagReason || 'Please upload recent 2026 EB bill or property tax receipt.'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Success Feedback Banner */}
        <AnimatePresence>
          {uploadSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={springCard}
              className="p-4 bg-gradient-to-r from-emerald-950/80 via-teal-950/50 to-slate-950 border-b border-emerald-500/40 flex items-center gap-3 overflow-hidden text-emerald-200"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-white">{t.reuploadSuccess}</span>
                <p className="text-[11px] text-emerald-300 mt-0.5">
                  The application SLA timer has resumed and routed back to Senior Revenue Inspector Rajesh Kumar.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column (5 cols): Vertical Stepper DFD Component */}
          <div className="md:col-span-5 border-r border-slate-800 pr-0 md:pr-6">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.dfdTitle}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.dfdSubtitle}
              </p>
            </div>

            {/* Vertical Stepper like a high-precision package delivery tracker */}
            <div className="relative pl-6 space-y-7 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
              {steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                const isFlagged = step.status === 'flagged';

                return (
                  <div key={step.id} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-950/80'
                          : isFlagged
                          ? 'bg-rose-500 text-white ring-4 ring-rose-950/80 animate-pulse'
                          : isCurrent
                          ? 'bg-indigo-500 text-white ring-4 ring-indigo-950/80'
                          : 'bg-slate-800 border-2 border-slate-700 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : isFlagged ? (
                        <AlertCircle className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isFlagged
                              ? 'text-rose-400'
                              : isCurrent
                              ? 'text-indigo-300'
                              : isCompleted
                              ? 'text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500 block mt-1">
                        {step.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Approved Certificate Download (if completed) */}
            {activeApp.status === 'RESOLVED_APPROVED' && (
              <div className="mt-8 p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">Statutory Certificate Issued</p>
                    <p className="text-[11px] text-emerald-300">Digital Seal & QR Encrypted</p>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Certificate ${activeApp.applicationNumber} downloaded with digital cryptographic signature.`)}
                  className="mt-3 w-full py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md cursor-pointer"
                >
                  Download Sealed Certificate
                </button>
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Document Upload / Correction & OCR Extracted Details */}
          <div className="md:col-span-7 space-y-6">
            {/* Drag & Drop Upload Zone (Prominent for Problem Solving) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {activeApp.status === 'ISSUE_FLAGGED' ? t.uploadNewDoc : 'Attached Application Documents'}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activeApp.documents.length} files attached
                </span>
              </div>

              {/* Drag and Drop Box with Spring Physics and Gradient Highlights */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-950/60 shadow-xl shadow-indigo-500/20'
                    : activeApp.status === 'ISSUE_FLAGGED'
                    ? 'border-amber-400/60 bg-gradient-to-br from-amber-950/40 via-orange-950/20 to-slate-950 hover:border-amber-400'
                    : 'border-indigo-500/30 hover:border-indigo-400 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 shadow-xs flex items-center justify-center mx-auto mb-2 text-indigo-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-white">
                  {selectedFile ? selectedFile.name : t.dragDropText}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t.docSupported}
                </p>

                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
                  <motion.label
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors shadow-xs"
                  >
                    <span>{t.browseFiles}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                  </motion.label>

                  {/* One-Click Demo Sample File Button */}
                  {activeApp.status === 'ISSUE_FLAGGED' && !selectedFile && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedFile(new File(['sample'], 'EB_Receipt_Aug_2026_Certified.pdf', { type: 'application/pdf' }));
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-500/40 rounded-xl hover:bg-indigo-900 transition-colors shadow-xs cursor-pointer"
                    >
                      Use Demo Valid EB Bill (2026)
                    </motion.button>
                  )}
                </div>

                {/* Submit / Re-upload Button with Radiant Gradient */}
                {(selectedFile || activeApp.status === 'ISSUE_FLAGGED') && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isProcessing}
                      onClick={handleSimulatedSubmit}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>AI Parsing & Verifying Document ({parsingProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{t.reuploadDocument}</span>
                        </>
                      )}
                    </motion.button>

                    {isProcessing && (
                      <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${parsingProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Current Files List */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                Uploaded Records in Archive:
              </h4>
              <div className="space-y-2">
                {activeApp.documents.map((doc) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={doc.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      doc.status === 'illegible'
                        ? 'bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-slate-950 border-rose-500/40'
                        : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/40 shadow-xs text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText
                        className={`w-4 h-4 shrink-0 ${
                          doc.status === 'illegible' ? 'text-rose-400' : 'text-indigo-400'
                        }`}
                      />
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{doc.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {doc.size} · Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {doc.status === 'illegible' ? (
                        <span className="text-[10px] font-semibold text-rose-300 bg-rose-950/70 border border-rose-500/40 px-2 py-0.5 rounded-md">
                          Illegible / Flagged
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                          AI Verified
                        </span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          setSelectedDocForViewer(doc);
                          setIsDocViewerOpen(true);
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Extracted Schema Fields Preview */}
            <div className="p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 rounded-2xl border border-indigo-500/20 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Extracted Metadata
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                  OCR Engine v3.8 Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activeApp.extractedFields.map((field) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={field.key}
                    className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 shadow-xs"
                  >
                    <span className="text-[10px] text-slate-400 block font-medium">{field.label}</span>
                    <span className={`font-semibold text-xs block truncate mt-0.5 ${field.verified ? 'text-white' : 'text-rose-400'}`}>
                      {field.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* OTP Sandbox Modal with Spring Physics */}
      <AnimatePresence>
        {showOtpDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpDemoModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={springCard}
              className="relative z-10 bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Aadhaar e-KYC Verification</h3>
                </div>
                <button
                  onClick={() => setShowOtpDemoModal(false)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  A 6-digit one-time passcode is sent to the citizen mobile number{' '}
                  <span className="font-mono font-bold text-slate-800">+91 90807 65819</span> via Twilio SMS Gateway.
                </p>

                <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Twilio SMS Dispatch</span>
                    <span className="font-mono font-bold text-indigo-900">+91 90807 65819</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleSendCitizenOtp}
                    disabled={isSendingSms}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isSendingSms ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending SMS...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Send Twilio SMS</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {smsFeedback && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <span className="font-bold">SMS Status:</span> {smsFeedback}
                  </div>
                )}

                {otpError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                    {otpError}
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Enter 6-Digit Mobile OTP:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="e.g. 749210"
                      className="flex-1 font-mono text-center tracking-widest text-base font-bold px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (dispatchedCode) {
                          setOtpInput(dispatchedCode);
                        } else {
                          handleSendCitizenOtp();
                        }
                      }}
                      className="px-3 py-1 text-[11px] text-indigo-600 bg-indigo-50/90 border border-indigo-200/60 rounded-xl hover:bg-indigo-100 font-semibold shrink-0 transition-colors"
                    >
                      {dispatchedCode ? 'Fill Dynamic OTP' : 'Send & Fill'}
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowOtpDemoModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    try {
                      const result = await verifyOtpCodeAsync('+91 90807 65819', otpInput);
                      if (result.valid) {
                        setOtpVerified(true);
                        setShowOtpDemoModal(false);
                        setOtpError(null);
                      } else {
                        setOtpError(result.message || 'Invalid OTP code. Please enter the 6-digit code received on your phone.');
                      }
                    } catch (e: any) {
                      const valid = verifyOtpCode('+91 90807 65819', otpInput);
                      if (valid) {
                        setOtpVerified(true);
                        setShowOtpDemoModal(false);
                        setOtpError(null);
                      } else {
                        setOtpError('Invalid OTP code. Please enter the code sent or 824190.');
                      }
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-xs transition-all"
                >
                  Confirm Authentication
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Document Viewer Modal for Citizen Inspection */}
      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        document={selectedDocForViewer}
        application={activeApp}
        onClose={() => setIsDocViewerOpen(false)}
      />
    </div>
  );
};
