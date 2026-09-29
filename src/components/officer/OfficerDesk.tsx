import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCivic } from '../../context/CivicContext';
import { translations } from '../../utils/translations';
import { Application, SlUrgency, ApplicationDocument } from '../../types/civic';
import { DocumentViewerModal } from './DocumentViewerModal';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Share2,
  X,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Building,
  User,
  Zap,
  Sparkles,
  ShieldAlert,
  Send,
  Calendar,
  Hourglass,
  Layers,
  FileCheck,
  Maximize2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const springPanel = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 27,
  mass: 0.6
};

export const OfficerDesk: React.FC = () => {
  const {
    currentUser,
    applications,
    departments,
    approveApplication,
    redirectDepartment,
    flagApplicationIssue,
    requestSlaExtension,
    verifyDocument,
    currentLanguage,
    signOutUser
  } = useCivic();

  const t = translations[currentLanguage];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState<string>('ALL');
  const [activeAppId, setActiveAppId] = useState<string>(applications[0]?.id || 'app_01');

  // Dynamic activeApp always in sync with latest applications array in context
  const activeApp: Application | null =
    applications.find((app) => app.id === activeAppId) || applications[0] || null;

  const setActiveApp = (app: Application | null) => {
    if (app) setActiveAppId(app.id);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<'preview' | 'json' | 'history'>('preview');

  // Interactive Document Viewer State
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<ApplicationDocument | null>(null);
  const [selectedPreviewDocId, setSelectedPreviewDocId] = useState<string>('');

  const handleOpenDocViewer = (doc: ApplicationDocument) => {
    setSelectedDocForViewer(doc);
    setIsDocViewerOpen(true);
  };

  // Modals for Actions
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveOfficerNotes, setApproveOfficerNotes] = useState('');
  
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState(departments[1]?.id || 'dept_twn');
  const [redirectReason, setRedirectReason] = useState('Jurisdictional requirement: Needs structural and town planning setback clearance before title mutation.');

  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('Uploaded utility bill illegible and exceeds 90-day statutory recency rule.');
  const [aiExplanationDraft, setAiExplanationDraft] = useState('The uploaded utility bill is illegible. The AI OCR recency detector identified bill date as 2021, breaching the mandatory 90-day validity rule. Please re-upload a recent bill.');

  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionHours, setExtensionHours] = useState(24);
  const [extensionReason, setExtensionReason] = useState('Physical on-site storm drain setback inspection required due to heavy rainfall.');

  // Filtered & Sorted by SLA Urgency
  const urgencyWeight: Record<SlUrgency, number> = {
    breached: 0,
    warning: 1,
    healthy: 2
  };

  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDeptFilter === 'ALL' || app.departmentId === selectedDeptFilter;
      const matchesUrgency = selectedUrgencyFilter === 'ALL' || app.urgency === selectedUrgencyFilter;
      return matchesSearch && matchesDept && matchesUrgency;
    })
    .sort((a, b) => {
      // Sort by urgency weight, then remaining hours
      if (urgencyWeight[a.urgency] !== urgencyWeight[b.urgency]) {
        return urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
      }
      return a.slaRemainingHours - b.slaRemainingHours;
    });

  const getUrgencyBadge = (urgency: SlUrgency, remainingHours: number) => {
    switch (urgency) {
      case 'breached':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
            <span className="font-bold">{t.slaBreached}</span>
            <span className="font-mono text-[11px] text-rose-600">
              ({Math.abs(remainingHours)}h {t.overdueBy})
            </span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="font-bold">{t.slaWarning}</span>
            <span className="font-mono text-[11px] text-amber-700">
              ({remainingHours}h {t.hoursRemaining})
            </span>
          </span>
        );
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-bold">{t.slaHealthy}</span>
            <span className="font-mono text-[11px] text-emerald-700">
              ({remainingHours}h {t.hoursRemaining})
            </span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'ISSUE_FLAGGED':
        return (
          <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded border border-rose-500/40">
            {t.statusIssueFlagged}
          </span>
        );
      case 'RESOLVED_APPROVED':
        return (
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40">
            {t.statusResolvedApproved}
          </span>
        );
      case 'REDIRECTED':
        return (
          <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-500/40">
            {t.statusRedirected}
          </span>
        );
      case 'OFFICER_REVIEW':
        return (
          <span className="text-[11px] font-semibold text-blue-300 bg-blue-950/70 px-2 py-0.5 rounded border border-blue-500/40">
            {t.statusOfficerReview}
          </span>
        );
      case 'AI_PARSED':
        return (
          <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-500/40">
            {t.statusAiParsed}
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {t.statusUploaded}
          </span>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-4.1rem)] overflow-hidden bg-slate-950/90 text-slate-100">
      {/* Persistent Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/90 border-r border-indigo-500/20 flex flex-col shrink-0 hidden lg:flex backdrop-blur-xl">
        {/* Officer Profile Badge */}
        <div className="p-4 border-b border-indigo-500/20 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/30 shrink-0">
                {currentUser.avatarText}
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-white truncate">{currentUser.name}</h2>
                <p className="text-[10px] text-indigo-300 truncate">{currentUser.departmentName || 'Revenue Inspector'}</p>
              </div>
            </div>
            <button
              onClick={() => signOutUser()}
              className="text-[10px] text-rose-300 bg-rose-950/60 hover:bg-rose-900 font-bold px-2 py-1 rounded-lg border border-rose-500/40 shrink-0 cursor-pointer transition-colors"
              title="Sign out officer session"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* SLA Status Filter Counters */}
        <div className="p-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Queue Triage by Urgency
          </p>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedUrgencyFilter('ALL')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedUrgencyFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span>{t.allUrgencies}</span>
              <span className="font-mono text-xs px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedUrgencyFilter('breached')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedUrgencyFilter === 'breached'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                  : 'text-rose-400 hover:bg-rose-950/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>{t.slaBreached} (Red)</span>
              </div>
              <span className="font-mono text-xs px-1.5 py-0.2 bg-rose-950 text-rose-300 rounded border border-rose-500/40 font-bold">
                {applications.filter((a) => a.urgency === 'breached').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedUrgencyFilter('warning')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedUrgencyFilter === 'warning'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950'
                  : 'text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{t.slaWarning} (Amber)</span>
              </div>
              <span className="font-mono text-xs px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded border border-amber-500/40 font-bold">
                {applications.filter((a) => a.urgency === 'warning').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedUrgencyFilter('healthy')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedUrgencyFilter === 'healthy'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-emerald-400 hover:bg-emerald-950/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{t.slaHealthy} (Green)</span>
              </div>
              <span className="font-mono text-xs px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-500/40 font-bold">
                {applications.filter((a) => a.urgency === 'healthy').length}
              </span>
            </button>
          </div>
        </div>

        {/* Department Filters */}
        <div className="p-3 border-t border-slate-800 flex-1 overflow-y-auto">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Civic Departments
          </p>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedDeptFilter('ALL')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                selectedDeptFilter === 'ALL'
                  ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {t.allDepartments}
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition-colors truncate cursor-pointer ${
                  selectedDeptFilter === dept.id
                    ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 font-mono">
          <span>Active Service Level Target: 24h-72h</span>
        </div>
      </aside>

      {/* Main Queue View */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900/80">
        {/* Controls Bar: Search & Quick Filters */}
        <div className="p-4 bg-slate-950/80 border-b border-indigo-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-white">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans text-white placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              Showing <span className="font-bold text-white font-mono">{filteredApplications.length}</span> cases
            </span>
          </div>
        </div>

        {/* Queue Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-indigo-500/20">
              <tr>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  {t.colAppNumber}
                </th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  {t.colApplicant}
                </th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-indigo-300 hidden md:table-cell">
                  {t.colDepartment}
                </th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  {t.colStatus}
                </th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  {t.colSlaTime}
                </th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-indigo-300 text-right">
                  {t.colAction}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/70 text-slate-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    No applications match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const isSelected = activeApp?.id === app.id && isDrawerOpen;
                  return (
                    <tr
                      key={app.id}
                      onClick={() => {
                        setActiveApp(app);
                        setIsDrawerOpen(true);
                      }}
                      className={`hover:bg-indigo-950/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-950/70 border-l-2 border-indigo-500' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-bold text-white block">
                          {app.applicationNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                          {app.title}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        <span className="font-semibold text-white block truncate">
                          {app.applicantName}
                        </span>
                        <span className="font-mono text-[11px] text-indigo-400">
                          {app.applicantAadhaar}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-300 hidden md:table-cell">
                        {app.departmentName}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(app.status)}
                      </td>

                      <td className="py-3 px-4 tabular-nums">
                        {getUrgencyBadge(app.urgency, app.slaRemainingHours)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveApp(app);
                              if (app.documents[0]) {
                                handleOpenDocViewer(app.documents[0]);
                              } else {
                                setIsDrawerOpen(true);
                              }
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            title="Open and View Uploaded Documents"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Docs ({app.documents.length})</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveApp(app);
                              setIsDrawerOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                          >
                            {t.viewDrawer}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Slide-Out Action Drawer (Split-Screen / Side-Panel Architecture) with Spring Motion */}
      <AnimatePresence>
        {isDrawerOpen && activeApp && (
          <motion.aside
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={springPanel}
            className="w-full sm:w-[480px] xl:w-[540px] bg-white/95 backdrop-blur-xl border-l border-slate-200/90 flex flex-col shadow-2xl z-30 shrink-0"
          >
            {/* Drawer Header with Rich Obsidian-Indigo Gradient */}
            <div className="p-4 border-b border-indigo-500/20 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                    {activeApp.applicationNumber}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300 truncate">
                    {activeApp.departmentName}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white truncate mt-1">
                  {activeApp.title}
                </h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

          {/* Drawer Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-4 text-xs font-semibold">
            <button
              onClick={() => setDrawerTab('preview')}
              className={`py-2.5 border-b-2 transition-colors ${
                drawerTab === 'preview'
                  ? 'border-indigo-600 text-indigo-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.docPreviewTab}
            </button>
            <button
              onClick={() => setDrawerTab('json')}
              className={`py-2.5 border-b-2 transition-colors ${
                drawerTab === 'json'
                  ? 'border-indigo-600 text-indigo-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.extractedJsonTab}
            </button>
            <button
              onClick={() => setDrawerTab('history')}
              className={`py-2.5 border-b-2 transition-colors ${
                drawerTab === 'history'
                  ? 'border-indigo-600 text-indigo-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.timelineTab}
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB 1: Interactive Document Preview & Case Documents */}
            {drawerTab === 'preview' && (() => {
              const currentDoc = activeApp.documents.find((d) => d.id === selectedPreviewDocId) || activeApp.documents[0];
              return (
                <div className="space-y-4">
                  {/* Document Switcher Carousel/Pills */}
                  {activeApp.documents.length > 1 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Select Document to Inspect:
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {activeApp.documents.length} attached
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {activeApp.documents.map((doc) => {
                          const isSelected = (selectedPreviewDocId ? selectedPreviewDocId === doc.id : doc.id === activeApp.documents[0]?.id);
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => setSelectedPreviewDocId(doc.id)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[130px]">{doc.name}</span>
                              {doc.status === 'illegible' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Primary Document Card */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {currentDoc ? currentDoc.name : 'Application_File.pdf'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {currentDoc?.size || '1.8 MB'} · {currentDoc ? new Date(currentDoc.uploadedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      {currentDoc && (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={() => handleOpenDocViewer(currentDoc)}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open Document</span>
                        </motion.button>
                      )}
                    </div>

                    {/* Interactive Document Preview Canvas */}
                    <div
                      onClick={() => currentDoc && handleOpenDocViewer(currentDoc)}
                      className="bg-white rounded-lg border border-slate-200 shadow-inner p-4 min-h-[220px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-indigo-400 transition-colors"
                    >
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            OFFICIAL CIVIC RECORD · {currentDoc?.status === 'illegible' ? 'FLAGGED' : 'VERIFIED'}
                          </div>
                          <div className="text-xs font-bold text-slate-900 mt-0.5 truncate max-w-xs">
                            {currentDoc?.name || activeApp.title}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                          PREVIEW
                        </span>
                      </div>

                      <div className="py-3 text-xs space-y-1.5 font-mono text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">APPLICANT:</span>
                          <span className="font-bold text-slate-900">{activeApp.applicantName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">IDENTITY_REF:</span>
                          <span className="text-slate-800">{activeApp.applicantAadhaar}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">DEPT_CODE:</span>
                          <span className="text-slate-800">{activeApp.departmentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">UPLOADED:</span>
                          <span className="text-slate-800">
                            {currentDoc ? new Date(currentDoc.uploadedAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </div>

                      {/* Watermark / Status Stamp */}
                      {currentDoc?.status === 'illegible' ? (
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded text-center text-xs font-bold text-rose-700">
                          DISCREPANCY DETECTED / PENDING CORRECTION
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          DIGITALLY VERIFIED BY AI OPTICAL RECOGNIZER
                        </div>
                      )}

                      {/* Hover Overlay to click to inspect */}
                      <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <span className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Click to View Full Document
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attached Files List with Direct View Action */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Case Documents ({activeApp.documents.length})
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Click 'View' to Inspect
                      </span>
                    </div>
                    <div className="space-y-2">
                      {activeApp.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            (selectedPreviewDocId ? selectedPreviewDocId === doc.id : doc.id === activeApp.documents[0]?.id)
                              ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-400'
                              : doc.status === 'illegible'
                              ? 'bg-rose-50/70 border-rose-200'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div
                            onClick={() => setSelectedPreviewDocId(doc.id)}
                            className="flex items-center gap-2.5 truncate flex-1 min-w-0 cursor-pointer"
                          >
                            <FileText
                              className={`w-4 h-4 shrink-0 ${
                                doc.status === 'illegible' ? 'text-rose-500' : 'text-indigo-600'
                              }`}
                            />
                            <div className="truncate">
                              <span className="truncate font-semibold text-slate-800 block">
                                {doc.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {doc.size} · Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                doc.status === 'illegible'
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {doc.status === 'illegible' ? 'Illegible' : 'Verified'}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDocViewer(doc);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                              title="Open and Inspect Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TAB 2: AI Extracted JSON Fields */}
            {drawerTab === 'json' && (
              <div className="space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>{t.confidenceScore}: 94.2%</span>
                  </div>
                  <p className="text-[11px] text-indigo-800/80 mt-1">
                    Automated OCR parser extracted structural parameters directly from submitted scans.
                  </p>
                </div>

                <div className="space-y-2">
                  {activeApp.extractedFields.map((field) => (
                    <div
                      key={field.key}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          {field.label}
                        </span>
                        <span className={`text-xs font-semibold ${field.verified ? 'text-slate-900' : 'text-rose-600'}`}>
                          {field.value}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-slate-700 block">
                          {Math.round(field.confidence * 100)}%
                        </span>
                        <span className="text-[10px] text-slate-400">Confidence</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Raw JSON View */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">Raw Parsed JSON Schema</h4>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40">
                    {JSON.stringify(
                      {
                        applicationId: activeApp.applicationNumber,
                        applicant: activeApp.applicantName,
                        department: activeApp.departmentId,
                        extractedMetadata: activeApp.extractedFields.reduce(
                          (acc, f) => ({ ...acc, [f.key]: f.value }),
                          {}
                        )
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: History & Audit Timeline */}
            {drawerTab === 'history' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Case Activity Log
                </h4>
                <div className="space-y-3 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeApp.history.map((hist) => (
                    <div key={hist.id} className="relative">
                      <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{hist.action}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{hist.details}</p>
                        <span className="text-[10px] text-slate-400 italic">
                          Actor: {hist.actorName} ({hist.actorRole})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Toolbar (Persistent on Bottom of Drawer) with Radiant Gradients */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/90 backdrop-blur-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Button 1: Update Progress / Approve with Radiant Emerald Gradient */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowApproveModal(true)}
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.btnUpdateProgress}</span>
              </motion.button>

              {/* Button 2: Redirect Department with Radiant Indigo Gradient */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRedirectModal(true)}
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25"
              >
                <Share2 className="w-4 h-4" />
                <span>{t.btnRedirectDept}</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Button 3: Inform Issue (Flag) with Radiant Rose-Amber Gradient */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFlagModal(true)}
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{t.btnInformIssue}</span>
              </motion.button>

              {/* Button 4: Request SLA Extension */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExtensionModal(true)}
                className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{t.btnRequestExtension}</span>
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>

      {/* MODAL 1: Approve Application with Spring Animation */}
      <AnimatePresence>
        {showApproveModal && activeApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApproveModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={springPanel}
              className="relative z-10 bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.approveConfirmTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.approveConfirmDesc}
              </p>

              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Official Sanction Notes (Optional):
                </label>
                <textarea
                  value={approveOfficerNotes}
                  onChange={(e) => setApproveOfficerNotes(e.target.value)}
                  rows={3}
                  placeholder="All statutory field inspections complete. Sanction granted under Section 42."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  {t.cancelAction}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    approveApplication(activeApp.id, approveOfficerNotes);
                    setShowApproveModal(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-xs transition-all"
                >
                  {t.submitAction}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Redirect Department with Spring Animation */}
      <AnimatePresence>
        {showRedirectModal && activeApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRedirectModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={springPanel}
              className="relative z-10 bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.redirectModalTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Case will be transferred with full audit history and recomputed SLA clock.
              </p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t.selectTargetDept}:
                  </label>
                  <select
                    value={targetDeptId}
                    onChange={(e) => setTargetDeptId(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {departments
                      .filter((d) => d.id !== activeApp.departmentId)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} (SLA: {d.slaTargetHours}h)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t.redirectReasonLabel}:
                  </label>
                  <textarea
                    value={redirectReason}
                    onChange={(e) => setRedirectReason(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRedirectModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  {t.cancelAction}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    redirectDepartment(activeApp.id, targetDeptId, redirectReason);
                    setShowRedirectModal(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-xs transition-all"
                >
                  {t.submitAction}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Inform Issue (Flag with Automated Trigger) with Spring Animation */}
      <AnimatePresence>
        {showFlagModal && activeApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFlagModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={springPanel}
              className="relative z-10 bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.informIssueTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.informIssueDesc}
              </p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Officer Finding / Discrepancy:
                  </label>
                  <input
                    type="text"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t.aiSuggestedNotice}
                  </label>
                  <textarea
                    value={aiExplanationDraft}
                    onChange={(e) => setAiExplanationDraft(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-amber-50/50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono text-slate-400">
                  Executes: TRG_APP_STATUS_CHANGE
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFlagModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    {t.cancelAction}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      flagApplicationIssue(activeApp.id, flagReason, aiExplanationDraft);
                      setShowFlagModal(false);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-xl shadow-xs transition-all"
                  >
                    {t.submitAction}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Request SLA Extension with Spring Animation */}
      <AnimatePresence>
        {showExtensionModal && activeApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExtensionModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={springPanel}
              className="relative z-10 bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.requestExtensionTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Requires justification for the District Collector (Higher Official) review.
              </p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t.additionalHours}:
                  </label>
                  <select
                    value={extensionHours}
                    onChange={(e) => setExtensionHours(Number(e.target.value))}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={12}>+12 Hours (Minor field check)</option>
                    <option value={24}>+24 Hours (Full day site survey)</option>
                    <option value={48}>+48 Hours (Multi-department joint survey)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t.extensionReason}:
                  </label>
                  <textarea
                    value={extensionReason}
                    onChange={(e) => setExtensionReason(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowExtensionModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  {t.cancelAction}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    requestSlaExtension(activeApp.id, extensionHours, extensionReason);
                    setShowExtensionModal(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all"
                >
                  Forward to Collector
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Statutory Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        document={selectedDocForViewer}
        application={activeApp}
        onClose={() => setIsDocViewerOpen(false)}
        onVerifyDocument={(docId) => {
          if (activeApp) {
            verifyDocument(activeApp.id, docId);
          }
          setIsDocViewerOpen(false);
        }}
        onFlagDocument={() => {
          setIsDocViewerOpen(false);
          setShowFlagModal(true);
        }}
      />
    </div>
  );
};
