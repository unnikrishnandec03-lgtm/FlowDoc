import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCivic } from '../../context/CivicContext';
import { translations } from '../../utils/translations';
import { AuditLog, UserRole, Application } from '../../types/civic';
import {
  Zap,
  Shield,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Building,
  RefreshCw,
  Share2,
  FileCheck,
  FileText,
  Lock,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

const springModal = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 28,
  mass: 0.6
};

export const ActivityLog: React.FC = () => {
  const {
    currentUser,
    auditLogs,
    currentLanguage,
    departments,
    applications
  } = useCivic();

  const t = translations[currentLanguage];

  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
  const [triggerOnlyFilter, setTriggerOnlyFilter] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  /**
   * ROLE-BASED ACCESS CONTROL (RBAC) FILTERING LOGIC:
   *
   * 1. ADMINISTRATOR (District Collector / IAS):
   *    - Unrestricted access: Can view ALL audit logs across all municipal departments,
   *      officer discretionary actions, SLA overrides, and PL/SQL triggers.
   *
   * 2. OFFICER:
   *    - Scoped access: Can view events belonging to applications assigned to them,
   *      events within their department, or events authored by them.
   *
   * 3. CITIZEN:
   *    - Privacy-preserved access: Can ONLY view activity logs pertaining to their
   *      own submitted applications (e.g. where citizen is the applicant or target).
   */
  const accessibleLogs = useMemo(() => {
    return auditLogs.filter((log: AuditLog) => {
      // 1. Admin gets all
      if (currentUser.role === 'admin') {
        return true;
      }

      // 2. Officer filter
      if (currentUser.role === 'officer') {
        // If officer authored the event
        if (log.actorId === currentUser.id || log.actorName === currentUser.name) {
          return true;
        }

        // If the event relates to an application in the officer's department or queue
        const targetApp = applications.find(
          (a: Application) => a.id === log.applicationId || a.applicationNumber === log.applicationNumber
        );

        if (targetApp) {
          if (currentUser.departmentId && targetApp.departmentId === currentUser.departmentId) {
            return true;
          }
          if (targetApp.assignedOfficerId === currentUser.id) {
            return true;
          }
        }

        // System broadcast triggers
        if (log.triggerSource === 'PL_SQL_TRIGGER_EVENT') {
          return true;
        }

        return false;
      }

      // 3. Citizen filter: ONLY applicant's own applications
      if (currentUser.role === 'citizen') {
        const targetApp = applications.find(
          (a: Application) => a.id === log.applicationId || a.applicationNumber === log.applicationNumber
        );

        if (targetApp) {
          return (
            targetApp.applicantId === currentUser.id ||
            targetApp.applicantName.toLowerCase() === currentUser.name.toLowerCase()
          );
        }

        // Fallback check on log details
        return log.details.toLowerCase().includes(currentUser.name.toLowerCase());
      }

      return false;
    });
  }, [auditLogs, currentUser, applications]);

  // Apply search query and type filters
  const filteredLogs = useMemo(() => {
    return accessibleLogs.filter((log: AuditLog) => {
      const matchesSearch =
        log.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = eventTypeFilter === 'ALL' || log.eventType === eventTypeFilter;
      const matchesTrigger = !triggerOnlyFilter || log.triggerSource === 'PL_SQL_TRIGGER_EVENT';

      return matchesSearch && matchesType && matchesTrigger;
    });
  }, [accessibleLogs, searchQuery, eventTypeFilter, triggerOnlyFilter]);

  const getEventBadge = (eventType: AuditLog['eventType']) => {
    switch (eventType) {
      case 'ISSUE_FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Issue Flagged
          </span>
        );
      case 'APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Approved & Sealed
          </span>
        );
      case 'DEPARTMENT_REDIRECT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Share2 className="w-3 h-3" />
            Jurisdiction Redirect
          </span>
        );
      case 'SLA_EXTENSION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            SLA Extension
          </span>
        );
      case 'DOCUMENT_REUPLOAD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <FileCheck className="w-3 h-3" />
            Doc Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
            <FileText className="w-3 h-3" />
            Status Update
          </span>
        );
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & RBAC Permission Scope Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              Firestore Live Audit_Logs Collection
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Real-Time Event Bus</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Real-Time Activity & Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Streaming immutable audit records and automated database trigger telemetry directly from Firestore.
          </p>
        </div>

        {/* Current User Scope Badge */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            {currentUser.avatarText}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-bold uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>
                {currentUser.role === 'admin'
                  ? 'Full District Unrestricted Audit Access'
                  : currentUser.role === 'officer'
                  ? `Scoped to ${currentUser.departmentName || 'Assigned Department'}`
                  : 'Restricted: Applicant Records Only'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Application ID, action, details, or actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans"
          />
        </div>

        {/* Event Type & Trigger Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-700 font-medium"
            >
              <option value="ALL">All Event Types</option>
              <option value="ISSUE_FLAGGED">Issue Flagged</option>
              <option value="APPROVAL">Approvals & Seals</option>
              <option value="DEPARTMENT_REDIRECT">Department Redirects</option>
              <option value="SLA_EXTENSION">SLA Extensions</option>
              <option value="DOCUMENT_REUPLOAD">Document Corrections</option>
              <option value="STATUS_UPDATE">Status Transitions</option>
            </select>
          </div>

          <button
            onClick={() => setTriggerOnlyFilter(!triggerOnlyFilter)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              triggerOnlyFilter
                ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${triggerOnlyFilter ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>PL/SQL Triggers Only</span>
          </button>

          <span className="text-xs font-mono text-slate-500 pl-2">
            Showing <span className="font-bold text-slate-900">{filteredLogs.length}</span> of {accessibleLogs.length} events
          </span>
        </div>
      </div>

      {/* Main Activity Log Table / Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Trigger Mechanism</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-medium">No activity log entries found matching criteria.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {currentUser.role === 'citizen'
                        ? 'As a citizen, you only see events related to your personal submitted applications.'
                        : 'Try clearing the search query or event type filter.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLog) => {
                  const isTrigger = log.triggerSource === 'PL_SQL_TRIGGER_EVENT';
                  const isSelected = selectedLog?.id === log.id;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/60 font-medium' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <span className="block font-semibold text-slate-900">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Event Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getEventBadge(log.eventType)}
                      </td>

                      {/* Application Reference */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">
                          {log.applicationNumber}
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block">
                          {log.actorName}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {log.actorRole}
                        </span>
                      </td>

                      {/* Trigger Mechanism */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isTrigger ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-900 text-amber-300">
                            <Zap className="w-2.5 h-2.5" />
                            PL/SQL TRIGGER
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {log.triggerSource}
                          </span>
                        )}
                      </td>

                      {/* Action & Details */}
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="font-semibold text-slate-900 text-xs truncate">
                          {log.action}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {log.details}
                        </p>
                      </td>

                      {/* Inspect Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Audit Log Drawer / Detailed Inspector Modal with Spring Motion */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={springModal}
              className="relative z-10 bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Audit Record Inspector: {selectedLog.id}
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedLog(null)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-3.5 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Application ID</span>
                    <span className="font-mono font-bold text-slate-900">{selectedLog.applicationNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Event Type</span>
                    <span className="font-semibold text-slate-800">{selectedLog.eventType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Recorded At</span>
                    <span className="font-mono text-slate-700">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Trigger Mechanism</span>
                    <span className="font-mono text-indigo-700 font-bold">{selectedLog.triggerSource}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Action Summary</span>
                  <p className="text-xs font-bold text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200">
                    {selectedLog.action}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Full Telemetry Details</span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-sans">
                    {selectedLog.details}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Responsible Principal</span>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                      {selectedLog.actorName[0] || 'A'}
                    </div>
                    <span className="font-semibold text-slate-900">{selectedLog.actorName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({selectedLog.actorRole})</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 rounded-xl shadow-xs transition-all"
                >
                  Close Inspector
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
