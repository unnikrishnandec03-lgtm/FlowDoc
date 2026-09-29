import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Application, ApplicationDocument } from '../../types/civic';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Building,
  Printer,
  Calendar,
  User,
  Hash,
  Layers,
  Eye,
  ExternalLink,
  QrCode
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: ApplicationDocument | null;
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onVerifyDocument?: (docId: string) => void;
  onFlagDocument?: (docId: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  application,
  isOpen,
  onClose,
  onVerifyDocument,
  onFlagDocument
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showOcrOverlay, setShowOcrOverlay] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'ocr' | 'compliance'>('preview');

  if (!isOpen || !document || !application) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 180));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const isImage = document.previewUrl?.startsWith('data:image/') ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(document.name);

  const isPdfData = document.previewUrl?.startsWith('data:application/pdf');

  // Determine realistic simulated document layout based on filename
  const isEbBill = /eb|electricity|bill|utility/i.test(document.name);
  const isSaleDeed = /sale|deed|mutation|land|registry/i.test(document.name);
  const isAadhaar = /aadhaar|ekyc|id|identity/i.test(document.name);
  const isBlueprint = /blueprint|plan|cad|building|architect/i.test(document.name);

  const handleDownload = () => {
    if (document.previewUrl) {
      const link = window.document.createElement('a');
      link.href = document.previewUrl;
      link.download = document.name;
      link.click();
    } else {
      // Mock download
      const content = `FlowDoc Verified Statutory Record: ${document.name}\nApplication: ${application.applicationNumber}\nApplicant: ${application.applicantName}\nVerified At: ${document.uploadedAt}\nCryptographic Digest: SHA256-FD-8942-VERIFIED`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name.replace(/\.[^/.]+$/, "") + "_Official_Copy.txt";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        {/* Animated Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Top Control Header with Rich Gradient and Glassmorphism */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
                    {document.name}
                  </h3>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      document.status === 'illegible'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {document.status === 'illegible' ? 'Discrepancy / Illegible' : 'AI Verified'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  App Ref: <span className="text-indigo-300 font-bold">{application.applicationNumber}</span> · Size: {document.size} · Uploaded: {new Date(document.uploadedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Quick Actions & Zoom Toolbar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950/80 border border-slate-700/80 rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-[11px] font-mono text-slate-300 font-bold min-w-[50px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Reset Zoom"
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer border-l border-slate-800 ml-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle OCR Overlay */}
              <button
                type="button"
                onClick={() => setShowOcrOverlay(!showOcrOverlay)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showOcrOverlay
                    ? 'bg-indigo-600/30 border-indigo-400/50 text-indigo-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">OCR Layer</span>
              </button>

              {/* Download Official File */}
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>

              {/* Close Modal */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:border-rose-500/40 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Inspection Body: Document Canvas + AI Sidebar */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column (8 cols): Document Viewport Canvas */}
            <div className="lg:col-span-8 bg-slate-950/90 overflow-auto p-4 sm:p-6 flex items-center justify-center relative">
              {/* Document Scale Container */}
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative min-h-[580px] font-sans select-none"
              >
                {/* 1. Real Uploaded Image Display */}
                {isImage && document.previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={document.previewUrl}
                      alt={document.name}
                      className="max-w-full h-auto rounded-lg shadow-md border border-slate-200"
                    />
                    <div className="mt-3 text-center text-xs text-slate-500 font-mono">
                      Real Uploaded Image · Processed via Optical Recognizer
                    </div>
                  </div>
                ) : isPdfData && document.previewUrl ? (
                  /* 2. Real Uploaded PDF Embed */
                  <iframe
                    src={document.previewUrl}
                    title={document.name}
                    className="w-full h-[520px] rounded-lg border border-slate-200"
                  />
                ) : isEbBill ? (
                  /* 3. Realistic Electricity Board (TANGEDCO / DISCOM) Utility Bill Canvas */
                  <div className="space-y-4 text-xs font-mono">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            ⚡
                          </div>
                          <div>
                            <h2 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
                              STATE ELECTRICITY DISTRIBUTION CORP (DISCOM)
                            </h2>
                            <p className="text-[10px] text-slate-600">
                              HIGH TENSION & LOW TENSION CONSUMER BILLING INVOICE
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">
                          TAX INVOICE / RECEIPT
                        </span>
                        <p className="text-[10px] text-slate-600 mt-1">LT TARIFF 1A (DOM/COMM)</p>
                      </div>
                    </div>

                    {/* Consumer & Address Block */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px] block">CONSUMER NAME:</span>
                        <span className="font-bold text-slate-900 text-xs">{application.applicantName}</span>
                        <span className="text-slate-500 text-[10px] block mt-2">SUPPLY ADDRESS:</span>
                        <span className="text-slate-800">
                          Plot 214/3B, Ward 12, Revenue District Sector 4
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">CONSUMER ID:</span>
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded ${
                              document.status === 'illegible'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {document.status === 'illegible'
                              ? '04-118-092-? (Low Clarity)'
                              : '04-118-092-4112'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">BILLING DATE:</span>
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded ${
                              document.status === 'illegible'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {document.status === 'illegible'
                              ? '14-OCT-2021 (EXPIRED >90D)'
                              : '18-AUG-2026 (VALID RECENCY)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">METER NO:</span>
                          <span className="font-bold text-slate-800">EL-89410-X2</span>
                        </div>
                      </div>
                    </div>

                    {/* Meter Readings & Consumption Grid */}
                    <table className="w-full border-collapse border border-slate-300 text-[10px] text-center">
                      <thead className="bg-slate-100 font-bold">
                        <tr>
                          <th className="border border-slate-300 p-1.5">PREV READING</th>
                          <th className="border border-slate-300 p-1.5">CURR READING</th>
                          <th className="border border-slate-300 p-1.5">UNITS (kWh)</th>
                          <th className="border border-slate-300 p-1.5">FIXED CHARGES</th>
                          <th className="border border-slate-300 p-1.5">NET PAYABLE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-1.5">14,210</td>
                          <td className="border border-slate-300 p-1.5">14,635</td>
                          <td className="border border-slate-300 p-1.5 font-bold">425</td>
                          <td className="border border-slate-300 p-1.5">₹ 140.00</td>
                          <td className="border border-slate-300 p-1.5 font-bold text-slate-900">₹ 2,840.00</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Barcode & Security Stamp */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <div>
                        <div className="font-mono tracking-widest text-[9px] text-slate-500">
                          ||||||| | ||||| |||||| |||||||| ||||| |||||
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">
                          REF: 041180924112-2026-DISCOM-EB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 border border-slate-300 rounded p-0.5">
                          <QrCode className="w-full h-full text-slate-800" />
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-emerald-700 font-bold block">
                            PAID & RECORDED
                          </span>
                          <span className="text-[8px] text-slate-400">SBI e-PAY 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* OCR Bounding Boxes Visual Layer */}
                    {showOcrOverlay && (
                      <div className="absolute inset-0 pointer-events-none p-6">
                        <div className="border-2 border-indigo-500/80 rounded-sm bg-indigo-500/10 p-1 absolute top-[110px] right-[40px] text-[9px] font-bold text-indigo-700">
                          [AI OCR] Consumer No: 99.4%
                        </div>
                        <div
                          className={`border-2 rounded-sm p-1 absolute top-[138px] right-[40px] text-[9px] font-bold ${
                            document.status === 'illegible'
                              ? 'border-rose-500 bg-rose-500/10 text-rose-700'
                              : 'border-emerald-500 bg-emerald-500/10 text-emerald-700'
                          }`}
                        >
                          {document.status === 'illegible'
                            ? '[AI OCR] Non-Compliant Date (>90d)'
                            : '[AI OCR] Valid Bill Date (37d)'}
                        </div>
                      </div>
                    )}
                  </div>
                ) : isSaleDeed ? (
                  /* 4. Realistic Registered Sale Deed Canvas */
                  <div className="space-y-4 text-xs font-serif">
                    {/* Stamp Paper Crest */}
                    <div className="border-4 border-double border-amber-800/80 p-3 rounded text-center bg-amber-50/40">
                      <div className="text-[10px] font-sans uppercase font-bold text-amber-900 tracking-widest">
                        GOVERNMENT OF INDIA · NON-JUDICIAL STAMP PAPER
                      </div>
                      <div className="text-base font-bold text-amber-950 font-serif my-1">
                        ONE HUNDRED RUPEES (₹ 100)
                      </div>
                      <div className="text-[9px] font-sans font-mono text-amber-800">
                        CERTIFICATE OF TITLE & DEED REGISTRATION · BOOK I / VOL 104
                      </div>
                    </div>

                    <div className="space-y-2 text-slate-800 leading-relaxed text-justify">
                      <p>
                        This <strong>DEED OF ABSOLUTE SALE & TITLE CONVEYANCE</strong> is executed on this
                        twenty-second day of July, Two Thousand Twenty-Four, between the Transferor and the
                        Transferee:
                      </p>
                      <p>
                        <strong>Transferee / Purchaser:</strong> {application.applicantName}, Aadhaar Ref:{' '}
                        {application.applicantAadhaar}, residing at Sector 4 Municipal Revenue Circle.
                      </p>
                      <p>
                        <strong>Schedule of Property:</strong> All that piece and parcel of vacant residential
                        plot bearing <strong>Survey No. 214/3B, Ward 12</strong>, measuring an extent of 2,400
                        square feet, bounded on the North by 30ft Road and South by Public Reserve.
                      </p>
                    </div>

                    {/* Official Registration Stamp & Seal */}
                    <div className="pt-4 border-t-2 border-slate-300 flex items-center justify-between">
                      <div className="border-2 border-dashed border-indigo-700 p-2 rounded text-center bg-indigo-50/50">
                        <span className="text-[9px] font-sans font-bold text-indigo-900 block">
                          SUB-REGISTRAR OFFICE
                        </span>
                        <span className="text-[8px] font-mono text-indigo-700">
                          SEALED & REGISTERED: #4892/2024
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono block text-slate-500">DIGITALLY SIGNED</span>
                        <span className="font-bold text-slate-800 text-xs">K. V. Sundaram, SRO</span>
                      </div>
                    </div>
                  </div>
                ) : isAadhaar ? (
                  /* 5. Aadhaar eKYC Card Canvas */
                  <div className="space-y-4 text-xs font-sans">
                    <div className="border-b-2 border-orange-500 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                          🇮🇳
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs">
                            UNIQUE IDENTIFICATION AUTHORITY OF INDIA
                          </h3>
                          <p className="text-[9px] text-slate-500 font-mono">e-KYC VERIFICATION CERTIFICATE</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        AUTHENTICATED
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="w-20 h-24 bg-slate-200 rounded border border-slate-300 flex items-center justify-center text-slate-400">
                        <User className="w-8 h-8" />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-xs font-bold text-slate-900">{application.applicantName}</p>
                        <p className="text-[10px] text-slate-600 font-mono">DOB: 14/08/1992 · Female</p>
                        <p className="text-[10px] text-slate-700">
                          Plot 214/3B, Ward 12, Revenue District 4
                        </p>
                        <p className="text-xs font-mono font-bold text-indigo-900 tracking-wider pt-2">
                          {application.applicantAadhaar}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>CRYPTOGRAPHIC SIGNATURE VALID</span>
                      </div>
                      <span className="text-slate-400">UIDAI-AUTH-2026-Q99</span>
                    </div>
                  </div>
                ) : isBlueprint ? (
                  /* 6. Blueprint Canvas */
                  <div className="space-y-4 text-xs font-mono bg-slate-900 text-cyan-300 p-6 rounded-lg border-2 border-cyan-500/50">
                    <div className="flex justify-between border-b border-cyan-500/40 pb-2">
                      <span className="font-bold uppercase tracking-wider text-white">
                        TOWN PLANNING ARCHITECTURAL CAD SCHEMATIC
                      </span>
                      <span className="text-cyan-400">SCALE: 1:100</span>
                    </div>
                    <div className="h-44 border border-dashed border-cyan-400/40 rounded flex flex-col items-center justify-center p-3 text-center space-y-2">
                      <Building className="w-10 h-10 text-cyan-400 opacity-60" />
                      <p className="text-[11px] text-cyan-200">
                        FRONT SETBACK: 3.05m (COMPLIANT WITH MASTER PLAN MIN 3.0m)
                      </p>
                      <p className="text-[10px] text-cyan-400/80">
                        G+2 RESIDENTIAL · TOTAL BUILT-UP: 4,120 SQ.FT
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-cyan-500/40 text-[10px]">
                      <span>APPROVED ARCHITECT: COA/2018/98214</span>
                      <span className="text-emerald-400 font-bold">MUNICIPAL CAD PARSER: VALID</span>
                    </div>
                  </div>
                ) : (
                  /* 7. Generic Official Government Record Canvas */
                  <div className="space-y-4 text-xs font-mono">
                    <div className="border-b-2 border-slate-900 pb-2 flex justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{document.name}</h3>
                        <p className="text-[10px] text-slate-500">MUNICIPAL ADMINISTRATIVE RECORD ARCHIVE</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold">
                        {document.type}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">APPLICANT:</span>
                        <span className="font-bold text-slate-900">{application.applicantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">APPLICATION NO:</span>
                        <span className="font-mono text-indigo-900 font-bold">{application.applicationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">DEPARTMENT:</span>
                        <span className="text-slate-800">{application.departmentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">DIGITAL HASH:</span>
                        <span className="font-mono text-[10px] text-slate-600 truncate max-w-[200px]">
                          SHA256-{document.id}-VERIFIED-SECURE
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statutory Seal / Cryptographic Watermark */}
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-20 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-900 flex items-center justify-center font-black text-xs">
                    SEAL
                  </div>
                  <span className="text-[8px] font-mono mt-0.5">GOVT SEAL</span>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): AI OCR Inspector & Official Officer Controls */}
            <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    AI OCR Inspection
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                    Engine v3.8
                  </span>
                </div>

                {/* Status Card */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    document.status === 'illegible'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {document.status === 'illegible' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-bold text-xs">
                      {document.status === 'illegible'
                        ? 'Discrepancy Detected'
                        : 'Statutory Verification Complete'}
                    </span>
                  </div>
                  {document.illegibleReason ? (
                    <p className="text-[11px] text-rose-300/90 mt-1.5 leading-relaxed font-mono">
                      {document.illegibleReason}
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-300/90 mt-1.5 leading-relaxed">
                      All security features, optical parameters, recency requirements, and legal name hashes verified.
                    </p>
                  )}
                </div>

                {/* Extracted Metadata Key-Values */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Extracted OCR Data Fields
                  </h4>
                  <div className="space-y-2">
                    {application.extractedFields.slice(0, 4).map((field) => (
                      <div
                        key={field.key}
                        className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex justify-between items-center"
                      >
                        <div>
                          <span className="text-[10px] text-slate-400 block">{field.label}</span>
                          <span className="font-bold text-white font-mono text-[11px]">
                            {field.value}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            field.confidence > 0.9
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : 'bg-amber-500/20 text-amber-300 font-bold'
                          }`}
                        >
                          {Math.round(field.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Checklist */}
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Statutory Rule Engine Checks
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Mandatory 90-Day Recency:</span>
                      <span
                        className={`font-mono font-bold ${
                          document.status === 'illegible' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {document.status === 'illegible' ? 'FAILED (2021)' : 'PASSED (Aug 2026)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Name Match (vs Aadhaar):</span>
                      <span className="font-mono font-bold text-emerald-400">PASSED (100%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Cryptographic Seal / Barcode:</span>
                      <span className="font-mono font-bold text-emerald-400">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Officer Decision Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                {document.status === 'illegible' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onVerifyDocument) onVerifyDocument(document.id);
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Override & Mark Document Verified</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onFlagDocument) onFlagDocument(document.id);
                    }}
                    className="w-full py-2 px-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Flag Document as Illegible / Discrepant</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Return to Officer Desk
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
