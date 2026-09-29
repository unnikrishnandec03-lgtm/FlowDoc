import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCivic } from '../../context/CivicContext';
import { translations } from '../../utils/translations';
import {
  TrendingUp,
  Clock,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Zap,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

const springMetric = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 26,
  mass: 0.6
};

export const CommandCenter: React.FC = () => {
  const {
    currentUser,
    applications,
    departments,
    slaExtensions,
    auditLogs,
    reviewSlaExtension,
    currentLanguage,
    signOutUser
  } = useCivic();

  const t = translations[currentLanguage];

  const [auditFilter, setAuditFilter] = useState<'ALL' | 'TRIGGERS_ONLY'>('ALL');

  // Compute metrics
  const totalApps = applications.length;
  const breachedCount = applications.filter((a) => a.urgency === 'breached').length;
  const approvedCount = applications.filter((a) => a.status === 'RESOLVED_APPROVED').length;
  const compliantCount = applications.filter((a) => a.urgency !== 'breached').length;
  const slaComplianceRate = totalApps > 0 ? Math.round((compliantCount / totalApps) * 100) : 94;

  const pendingExtensionRequests = slaExtensions.filter((r) => r.status === 'PENDING');

  const filteredAudits = auditLogs.filter((log) => {
    if (auditFilter === 'TRIGGERS_ONLY') {
      return log.triggerSource === 'PL_SQL_TRIGGER_EVENT';
    }
    return true;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner with Rich Radial Gradient Aura */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle accent light */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono uppercase text-indigo-700 bg-gradient-to-r from-indigo-50 to-violet-50 px-2.5 py-0.5 rounded-md border border-indigo-200/70 shadow-2xs">
              Executive Governance
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">District Collectorate HQ</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent mt-1">
            {t.commandCenterTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.commandCenterSubtitle}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 block">{currentUser.name}</span>
            <span className="text-[11px] text-slate-500 font-medium">District Collector & Magistrate</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md ring-1 ring-white/30">
            {currentUser.avatarText}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOutUser()}
            className="text-xs text-rose-800 bg-rose-50 hover:bg-rose-100 font-bold px-3 py-1.5 rounded-xl border border-rose-200/80 transition-colors shadow-xs"
          >
            Sign Out
          </motion.button>
        </div>
      </div>

      {/* Top Metric Cards with Radiant Gradients and Spring Micro-Interactions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: SLA Compliance */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={springMetric}
          className="p-5 bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.1)] transition-shadow"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900/80">{t.metricSlaCompliance}</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent tabular-nums">
              {slaComplianceRate}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              +3.2% vs last week
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Target threshold: 92.0% statutory standard
          </p>
        </motion.div>

        {/* Card 2: Average Resolution Time */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={springMetric}
          className="p-5 bg-gradient-to-br from-indigo-500/10 via-white to-sky-500/5 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.1)] transition-shadow"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900/80">{t.metricAvgResolution}</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent tabular-nums">
              18.4 hrs
            </span>
            <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-100/70 border border-indigo-200/60 px-2 py-0.5 rounded-full">
              -6.1 hrs improvement
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Across 5 municipal departments
          </p>
        </motion.div>

        {/* Card 3: Total Breached */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={springMetric}
          className="p-5 bg-gradient-to-br from-rose-500/10 via-white to-amber-500/5 border border-rose-500/20 hover:border-rose-500/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(244,63,94,0.1)] transition-shadow"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900/80">{t.metricTotalBreached}</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 to-amber-700 bg-clip-text text-transparent tabular-nums">
              {breachedCount}
            </span>
            <span className="text-[11px] font-semibold text-rose-800 bg-rose-100/70 border border-rose-200/60 px-2 py-0.5 rounded-full">
              Requires Intervention
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Building & Town Planning (CF-2026-8904)
          </p>
        </motion.div>

        {/* Card 4: Total Active Queue */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={springMetric}
          className="p-5 bg-gradient-to-br from-purple-500/10 via-white to-indigo-500/5 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(168,85,247,0.1)] transition-shadow"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900/80">{t.metricActiveQueue}</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent tabular-nums">
              {totalApps}
            </span>
            <span className="text-[11px] font-semibold text-purple-800 bg-purple-100/70 border border-purple-200/60 px-2 py-0.5 rounded-full">
              {approvedCount} Sanctioned
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Real-time multi-tier processing
          </p>
        </motion.div>
      </div>

      {/* SLA EXTENSION REQUESTS TABLE (Mandatory Feature) */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-[0_10px_35px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/80 to-indigo-50/20">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {t.slaExtensionsQueue}
              </h2>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 shadow-2xs">
                {pendingExtensionRequests.length} Pending Approval
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.slaExtensionsDesc}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">{t.colAppNumber}</th>
                <th className="py-3 px-4">{t.colRequestedBy}</th>
                <th className="py-3 px-4">{t.colDepartment}</th>
                <th className="py-3 px-4">{t.colExtensionHours}</th>
                <th className="py-3 px-4">{t.colJustification}</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs bg-white">
              {slaExtensions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No SLA extension requests logged.
                  </td>
                </tr>
              ) : (
                slaExtensions.map((req) => (
                  <tr key={req.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {req.applicationNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                        {req.applicationTitle}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {req.officerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {req.departmentName}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      +{req.requestedHours} Hours
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                        {req.reason}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => reviewSlaExtension(req.id, 'GRANTED')}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.btnGrant}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => reviewSlaExtension(req.id, 'DENIED')}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200/80 transition-all"
                          >
                            {t.btnDeny}
                          </motion.button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            req.status === 'GRANTED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {req.status} by {req.reviewedBy}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Department Bottlenecks & Event-Driven Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Department Performance & Velocity */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {t.deptBottlenecks}
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Live Dispatch Rate
            </span>
          </div>

          <div className="space-y-4">
            {departments.map((dept) => {
              const isBottleneck = dept.avgTurnaroundHours > dept.slaTargetHours * 0.7;

              return (
                <div key={dept.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate">
                      {dept.name}
                    </span>
                    <span className="font-mono text-slate-600 font-bold">
                      {dept.avgTurnaroundHours}h / {dept.slaTargetHours}h SLA
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isBottleneck 
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((dept.avgTurnaroundHours / dept.slaTargetHours) * 100))}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Head: {dept.headOfficial}</span>
                    <span>{dept.activeOfficersCount} Officers Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Event-Driven Audit & Simulated PL/SQL Trigger Stream */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {t.auditTrailTitle}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                  3NF Event Sourcing
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.auditTrailDesc}
              </p>
            </div>

            {/* Filter Toggle with Spring Pills */}
            <div className="flex gap-1 bg-slate-100/90 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAuditFilter('ALL')}
                className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  auditFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.allAudits}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAuditFilter('TRIGGERS_ONLY')}
                className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1 ${
                  auditFilter === 'TRIGGERS_ONLY'
                    ? 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Triggers Only</span>
              </motion.button>
            </div>
          </div>

          {/* Audit Stream List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredAudits.map((log) => {
              const isTrigger = log.triggerSource === 'PL_SQL_TRIGGER_EVENT';

              return (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  key={log.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    isTrigger
                      ? 'bg-gradient-to-r from-indigo-50/60 via-purple-50/30 to-indigo-50/40 border-indigo-200/80 shadow-xs'
                      : 'bg-white border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        {log.applicationNumber}
                      </span>
                      {isTrigger && (
                        <span className="text-[10px] font-mono font-bold bg-gradient-to-r from-indigo-950 to-slate-900 text-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                          <Zap className="w-2.5 h-2.5" />
                          {t.systemTriggerBadge}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800 text-xs">
                    {log.action}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {log.details}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Actor: <span className="font-semibold text-slate-700">{log.actorName}</span> ({log.actorRole})
                    </span>
                    <span className="font-mono">{log.eventType}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
