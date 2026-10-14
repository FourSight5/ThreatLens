'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Info,
  Maximize2,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  FileCode,
  Sliders,
} from 'lucide-react';
import { SCREENSHOT_SAMPLES, ScreenshotSampleItem } from '@/lib/sampleScreenshots';
import { HeuristicAnalysisResult } from '@/lib/heuristics';

interface ScreenshotScannerTabProps {
  onScanComplete?: () => void;
  onPromoteToCase?: (findingData: any) => void;
}

export default function ScreenshotScannerTab({
  onScanComplete,
  onPromoteToCase,
}: ScreenshotScannerTabProps) {
  // Image state
  const [selectedImage, setSelectedImage] = useState<string>(SCREENSHOT_SAMPLES[0].dataUrl);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SCREENSHOT_SAMPLES[0].id);
  const [imageMeta, setImageMeta] = useState<{ name: string; size: string; type: string }>({
    name: SCREENSHOT_SAMPLES[0].title,
    size: 'Preset Sample',
    type: 'image/svg+xml',
  });
  const [isDragOver, setIsDragOver] = useState(false);

  // Analysis states
  const [loading, setLoading] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [result, setResult] = useState<HeuristicAnalysisResult | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);

  // Manual override states
  const [manualCandidate, setManualCandidate] = useState('');
  const [manualChannel, setManualChannel] = useState<'domain' | 'social' | 'app'>('domain');
  const [isRefining, setIsRefining] = useState(false);
  const [saveToFindings, setSaveToFindings] = useState(true);

  // Interactive copy states
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [copiedTakedown, setCopiedTakedown] = useState(false);

  // UI accordion toggles
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(true);
  const [isHarmfulSectionOpen, setIsHarmfulSectionOpen] = useState(true);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleFileUpload(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Process uploaded image file
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
      setSelectedSampleId('');
      setImageMeta({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
      });
      setResult(null);
      setExtractedData(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Run analysis pipeline
  const executeScan = async (sampleOverride?: string, customCandidateInput?: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setExtractedData(null);
    setScanStepIndex(0);

    const stagesTimer = setInterval(() => {
      setScanStepIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 400);

    try {
      const payload: any = {
        sampleId: sampleOverride !== undefined ? sampleOverride : selectedSampleId || undefined,
        image: selectedImage,
        saveToFindings,
      };

      if (customCandidateInput || manualCandidate) {
        payload.customCandidate = customCandidateInput || manualCandidate;
        payload.customChannel = manualChannel;
      }

      const res = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze screenshot');
      }

      setResult(data.analysis);
      setExtractedData(data.extracted);
      setManualCandidate(data.extracted.candidate);
      setManualChannel(data.extracted.channel);
      if (data.extracted.hotspots && data.extracted.hotspots.length > 0) {
        setSelectedHotspot(data.extracted.hotspots[0]);
      }

      if (onScanComplete) onScanComplete();
    } catch (err: any) {
      setError(err.message || 'Error executing screenshot scan');
    } finally {
      clearInterval(stagesTimer);
      setLoading(false);
    }
  };

  // Auto-scan first sample on initial render
  useEffect(() => {
    executeScan('sample_phishing_sso');
  }, []);

  const handleSelectSample = (sample: ScreenshotSampleItem) => {
    setSelectedImage(sample.dataUrl);
    setSelectedSampleId(sample.id);
    setImageMeta({
      name: sample.title,
      size: 'Interactive Preset',
      type: 'image/svg+xml',
    });
    setManualCandidate(sample.targetCandidate);
    executeScan(sample.id, sample.targetCandidate);
  };

  const scanStagesList = [
    { label: 'Step 1: Visual Asset Ingestion & Image Fingerprinting', desc: 'Validating aspect ratio, raster headers, and computing SHA-256 hash' },
    { label: 'Step 2: Optical Character Recognition (OCR) & Region Parsing', desc: 'Extracting address bar URLs, social profile bios, and developer tags' },
    { label: 'Step 3: Visual Spoof & Brand Baseline Correlation', desc: 'Matching against registered authoritative brand assets and logos' },
    { label: 'Step 4: Heuristic Threat Synthesis & Remediation Notice', desc: 'Synthesizing numeric risk score, harmful consequences, and takedown drafting' },
  ];

  const handleCopyTakedownNotice = () => {
    if (!result || !extractedData) return;
    const notice = [
      '========================================================================',
      'URGENT: DIGITAL RISK PROTECTION & TRADEMARK IMPERSONATION TAKEDOWN NOTICE',
      '========================================================================',
      `Date: ${new Date().toUTCString()}`,
      `Investigating Organization: ThreatLens AI Security Operations`,
      `Protected Brand: ${extractedData.detectedBrand || 'ThreatLens'}`,
      '',
      `OFFENDING TARGET IDENTIFIER: ${extractedData.candidate}`,
      `CHANNEL: ${extractedData.channel.toUpperCase()}`,
      `CALCULATED RISK SCORE: ${result.riskScore}/100 (${result.classificationLabel})`,
      '',
      'DETECTED THREAT INDICATORS & FORENSIC FINDINGS:',
      ...result.flaggedReasons.map((r, i) => `${i + 1}. [${r.severity.toUpperCase()}] ${r.indicatorName}: ${r.detected} (${r.whyRisky})`),
      '',
      'LEGAL CEASE & DESIST DIRECTIVE:',
      'This target demonstrates intentional deceptive mimicry of registered corporate marks and credentials.',
      'We request immediate suspension, de-indexing, and account termination in accordance with terms of service.',
      '========================================================================',
    ].join('\n');

    navigator.clipboard.writeText(notice);
    setCopiedTakedown(true);
    setTimeout(() => setCopiedTakedown(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Modern Light SaaS */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/40 to-cyan-50/30 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm border border-slate-200 overflow-hidden">
            <Camera className="h-8 w-8 text-indigo-600" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cyan-500 ring-2 ring-white" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>AI VISION &bull; OCR FORENSICS &bull; SCREENSHOT THREAT DETECTOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Screenshot Impersonation & Phishing Scanner
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Upload or paste (<kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs border border-slate-300">Ctrl+V</kbd>) any screenshot of a suspicious web login, Instagram account, X post, Telegram DM, or sideloaded APK portal. The vision scanner extracts candidate URLs, handles, and visual lure cues to compute transparent threat intelligence.
            </p>
          </div>
        </div>

        {/* Preset Sample Screenshots Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Camera className="h-3.5 w-3.5 text-indigo-500" />
            Interactive Screenshot Presets:
          </span>
          {SCREENSHOT_SAMPLES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span>{sample.badge.split(' ')[0]}</span>
                <span>{sample.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload Zone & Image Forensics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* File Upload & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`saas-card rounded-2xl p-5 border-2 border-dashed transition-all cursor-pointer ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center text-center space-y-2 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-2xs">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  Drop screenshot here or <span className="text-indigo-600 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports PNG, JPG, JPEG, WEBP or paste directly with <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] border">Ctrl+V</kbd>
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <span>Active Image: <strong className="text-slate-700">{imageMeta.name}</strong></span>
                <span>•</span>
                <span>{imageMeta.size}</span>
              </div>
            </div>
          </div>

          {/* Interactive Screenshot Viewer Card */}
          <div className="saas-card rounded-2xl p-4 border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-indigo-600" />
                <span>Forensic Image Inspection</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {extractedData?.hotspots?.length || 0} Suspect Hotspots
              </span>
            </div>

            {/* High-Res Image Container with Radar Scan Animation */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <img
                src={selectedImage}
                alt="Suspicious Screenshot Target"
                className="w-full h-auto max-h-[380px] object-contain mx-auto"
              />

              {/* Scanning Laser Beam Effect when Loading */}
              {loading && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse absolute top-0 left-0 right-0 animate-bounce" />
                  <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Interactive Hotspot Markers */}
              {extractedData?.hotspots &&
                extractedData.hotspots.map((spot: any, idx: number) => {
                  const isSelected = selectedHotspot?.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspot(spot)}
                      style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 rounded-full font-bold text-[11px] shadow-md transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600 text-white ring-4 ring-rose-300 scale-125 z-20'
                          : spot.severity === 'critical'
                          ? 'bg-rose-500 text-white animate-alert-pulse ring-2 ring-white z-10'
                          : 'bg-amber-500 text-white ring-2 ring-white z-10'
                      }`}
                      title={`${spot.label}: ${spot.detail}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
            </div>

            {/* Selected Hotspot Detail Card */}
            {selectedHotspot && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span>{selectedHotspot.label}</span>
                  </span>
                  <span className="rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                    {selectedHotspot.severity}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedHotspot.detail}</p>
              </div>
            )}

            {/* Manual Refine Trigger */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsRefining(!isRefining)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{isRefining ? 'Hide Parameter Override' : 'Refine Extracted Target'}</span>
              </button>
              <button
                type="button"
                onClick={() => executeScan()}
                disabled={loading}
                className="text-xs rounded-lg bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Re-Analyze</span>
              </button>
            </div>

            {/* Refinement Drawer */}
            {isRefining && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-2.5 text-xs animate-fade-in-up">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Extracted Target String (URL / Handle / Package)
                  </label>
                  <input
                    type="text"
                    value={manualCandidate}
                    onChange={(e) => setManualCandidate(e.target.value)}
                    placeholder="e.g. https://threatl3ns-login-portal.xyz"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['domain', 'social', 'app'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setManualChannel(ch)}
                      className={`rounded-lg py-1.5 text-xs font-semibold uppercase ${
                        manualChannel === ch
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => executeScan(undefined, manualCandidate)}
                  disabled={loading || !manualCandidate.trim()}
                  className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
                >
                  Apply Refined Target Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Threat Intelligence Results (7 cols) */}
        <div className="lg:col-span-7 saas-card rounded-2xl p-6 border-slate-200 bg-white shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Camera className="h-4 w-4 text-indigo-600" />
                <span>Forensic Vision Analysis Findings</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Multi-channel optical extraction and deterministic heuristic correlation
              </p>
            </div>
            {result && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyTakedownNotice}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Generate Takedown Notice"
                >
                  {copiedTakedown ? <Check className="h-3 w-3 text-emerald-600" /> : <FileText className="h-3 w-3 text-rose-600" />}
                  <span>{copiedTakedown ? 'Copied' : 'Takedown Notice'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Print Report"
                >
                  <Printer className="h-3 w-3" />
                  <span>Print</span>
                </button>
              </div>
            )}
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="space-y-6 py-4 animate-fade-in-up">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-700">Decompiling Screenshot Forensics...</span>
                  <span className="font-mono text-slate-500">Step {scanStepIndex + 1} of 4</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600 transition-all duration-300"
                    style={{ width: `${((scanStepIndex + 1) / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                {scanStagesList.map((step, idx) => {
                  const isDone = idx < scanStepIndex;
                  const isCurrent = idx === scanStepIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 rounded-xl p-3 border transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50/60 border-indigo-200 text-indigo-900'
                          : isDone
                          ? 'bg-emerald-50/40 border-emerald-100 text-slate-700'
                          : 'bg-slate-50/50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <Activity className="h-4 w-4 text-indigo-600 animate-spin" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold">{step.label}</div>
                        <div className="text-[11px] text-slate-500">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result Presentation */}
          {result && extractedData && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Extracted Indicators Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-semibold text-slate-500">Optical Target Extracted:</span>
                  <span className="font-mono font-bold text-indigo-700 break-all select-all">
                    {extractedData.candidate}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Channel:</span>
                    <strong className="text-slate-700 uppercase font-mono">{extractedData.channel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Monitored Brand:</span>
                    <strong className="text-slate-700">{extractedData.detectedBrand}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Detected Lures:</span>
                    <span className="text-rose-600 font-semibold font-mono">
                      {extractedData.lureKeywords?.length > 0
                        ? extractedData.lureKeywords.join(', ')
                        : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              {/* OVERALL RISK SCORE BANNER */}
              {result.isOfficialExcluded ? (
                <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/80 p-5 sm:p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Official Brand Baseline Verified
                      </div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-emerald-900">
                        Low Risk — Authoritative Asset Confirmed
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-800/90 leading-relaxed">
                    {result.exclusionReason}
                  </p>
                  <div className="pt-3 border-t border-emerald-200 flex items-center justify-between text-xs font-mono text-emerald-900">
                    <span>STATUS: <strong>VERIFIED LEGITIMATE</strong></span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-bold">RISK SCORE: 0 / 100</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm transition-all ${
                    result.classification === 'dangerous'
                      ? 'border-rose-400 bg-rose-50/90 animate-alert-pulse'
                      : result.classification === 'suspicious'
                      ? 'border-amber-400 bg-amber-50/90'
                      : 'border-emerald-300 bg-emerald-50/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                          result.classification === 'dangerous'
                            ? 'bg-rose-100 text-rose-700 ring-4 ring-rose-50'
                            : result.classification === 'suspicious'
                            ? 'bg-amber-100 text-amber-700 ring-4 ring-amber-50'
                            : 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50'
                        }`}
                      >
                        {result.classification === 'dangerous' ? (
                          <ShieldAlert className="h-8 w-8" />
                        ) : result.classification === 'suspicious' ? (
                          <AlertTriangle className="h-8 w-8" />
                        ) : (
                          <ShieldCheck className="h-8 w-8" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                            result.classification === 'dangerous'
                              ? 'bg-rose-200/80 text-rose-800'
                              : result.classification === 'suspicious'
                              ? 'bg-amber-200/80 text-amber-800'
                              : 'bg-emerald-200/80 text-emerald-800'
                          }`}
                        >
                          {result.classification.replace('_', ' ')} Threat
                        </span>
                        <h4
                          className={`text-lg sm:text-xl font-extrabold ${
                            result.classification === 'dangerous'
                              ? 'text-rose-900'
                              : result.classification === 'suspicious'
                              ? 'text-amber-900'
                              : 'text-emerald-900'
                          }`}
                        >
                          {result.classificationLabel}
                        </h4>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Risk Score
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-4xl font-extrabold ${
                            result.classification === 'dangerous'
                              ? 'text-rose-600'
                              : result.classification === 'suspicious'
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {result.riskScore}
                        </span>
                        <span className="text-sm font-semibold text-slate-400">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1">
                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          result.classification === 'dangerous'
                            ? 'bg-rose-600'
                            : result.classification === 'suspicious'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${result.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Visual Spoof Signals Section */}
              {extractedData.visualSpoofSignals?.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Visual Impersonation &amp; Spoofing Red Flags</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {extractedData.visualSpoofSignals.map((sig: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex items-start gap-3"
                      >
                        <span
                          className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            sig.severity === 'critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : sig.severity === 'high'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {sig.severity}
                        </span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-slate-900">{sig.title}</span>
                          <p className="text-xs text-slate-600 leading-relaxed">{sig.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accordion: Why was this screenshot flagged? */}
              {result.flaggedReasons?.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setIsWhyFlaggedOpen(!isWhyFlaggedOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        Why Was This Flagged? ({result.flaggedReasons.length} Threat Indicators)
                      </h4>
                    </div>
                    {isWhyFlaggedOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>

                  {isWhyFlaggedOpen && (
                    <div className="p-4 divide-y divide-slate-100 space-y-4">
                      {result.flaggedReasons.map((reason, idx) => (
                        <div key={idx} className={idx > 0 ? 'pt-4 space-y-2' : 'space-y-2'}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {idx + 1}. {reason.indicatorName}
                            </span>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                                reason.severity === 'critical'
                                  ? 'bg-rose-100 text-rose-800'
                                  : reason.severity === 'high'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {reason.severity}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                              <span className="font-semibold text-slate-500 text-[11px] block">Observed:</span>
                              <p className="text-slate-800 font-medium">{reason.detected}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                              <span className="font-semibold text-slate-500 text-[11px] block">Risk:</span>
                              <p className="text-slate-800 leading-relaxed">{reason.whyRisky}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion: What makes this harmful? */}
              {result.harmfulConsequences?.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setIsHarmfulSectionOpen(!isHarmfulSectionOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        Consequences of Interacting With This Account / Link
                      </h4>
                    </div>
                    {isHarmfulSectionOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>

                  {isHarmfulSectionOpen && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.harmfulConsequences.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{item.title}</span>
                            <span className="rounded bg-rose-50 text-rose-700 px-1.5 py-0.2 text-[10px] font-semibold border border-rose-100">
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* OCR Text Transcript Drawer */}
              {extractedData.ocrTranscript && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left text-xs"
                  >
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-indigo-600" />
                      <span>OCR Optical Text Extraction Transcript</span>
                    </span>
                    {isTranscriptOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-500" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-500" />}
                  </button>
                  {isTranscriptOpen && (
                    <div className="p-3 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed max-h-36 overflow-y-auto">
                      {extractedData.ocrTranscript}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyTakedownNotice}
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:from-rose-500 hover:to-red-500 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>{copiedTakedown ? 'Takedown Notice Copied!' : 'Copy Official Takedown Notice'}</span>
                </button>

                {onPromoteToCase && (
                  <button
                    onClick={() =>
                      onPromoteToCase({
                        displayName: `[Screenshot Flag] ${extractedData.candidate}`,
                        description: `Detected via Screenshot Forensics. ${result.summary}`,
                        riskLevel: result.riskLevel,
                        id: `fnd_scr_${Date.now()}`,
                      })
                    }
                    className="rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="h-4 w-4 text-indigo-600" />
                    <span>Promote to SOC Investigation Case</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
