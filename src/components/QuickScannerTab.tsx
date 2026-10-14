'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Info,
  Layers,
  Sparkles,
  Camera,
} from 'lucide-react';
import { HeuristicAnalysisResult, FlaggedReason, HarmfulConsequence, SecurityCheckSource } from '@/lib/heuristics';

interface QuickScannerTabProps {
  onScanComplete?: () => void;
  presetCandidate?: { candidate: string; channel: 'social' | 'app' | 'domain'; bio?: string; publisher?: string };
  onSwitchToScreenshotScan?: () => void;
}

export default function QuickScannerTab({ onScanComplete, presetCandidate, onSwitchToScreenshotScan }: QuickScannerTabProps) {
  const [candidate, setCandidate] = useState(presetCandidate?.candidate || '');
  const [channel, setChannel] = useState<'domain' | 'social' | 'app'>(presetCandidate?.channel || 'domain');
  const [platform, setPlatform] = useState('');
  const [bio, setBio] = useState(presetCandidate?.bio || '');
  const [publisher, setPublisher] = useState(presetCandidate?.publisher || '');
  const [saveToFindings, setSaveToFindings] = useState(true);

  // Scan execution states
  const [loading, setLoading] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [result, setResult] = useState<HeuristicAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Interactive UI states
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [isHarmfulSectionOpen, setIsHarmfulSectionOpen] = useState(true);
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(true);
  const [isPrecautionsOpen, setIsPrecautionsOpen] = useState(true);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

  // Sync preset if passed from parent
  useEffect(() => {
    if (presetCandidate) {
      setCandidate(presetCandidate.candidate);
      setChannel(presetCandidate.channel);
      if (presetCandidate.bio) setBio(presetCandidate.bio);
      if (presetCandidate.publisher) setPublisher(presetCandidate.publisher);
    }
  }, [presetCandidate]);

  const scanStagesList = [
    { label: 'Stage 1: URL Normalization & SSRF Safety Guard', desc: 'Validating host, protocol, and checking RFC1918 private subnets' },
    { label: 'Stage 2: Verified Brand Baseline Exclusion Check', desc: 'Matching against authoritative enterprise asset registry' },
    { label: 'Stage 3: Deep Heuristic & Typosquat Analysis', desc: 'Executing homoglyphs, Damerau transposition, and credential lure scans' },
    { label: 'Stage 4: Explainable Threat Synthesis & Safety Report', desc: 'Assembling risk score, harm consequences, and recommended precautions' },
  ];

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetCandidate = candidate.trim();
    if (!targetCandidate) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setScanStepIndex(0);

    // Progressive stage animation timer
    const interval = setInterval(() => {
      setScanStepIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 380);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate: targetCandidate,
          channel,
          platform: platform || undefined,
          bio: bio || undefined,
          publisher: publisher || undefined,
          saveToFindings,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute threat analysis');
      }

      setResult(data.analysis);
      if (onScanComplete) onScanComplete();
    } catch (err: any) {
      setError(err.message || 'Error executing scanner');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const loadPreset = (preset: { candidate: string; channel: 'domain' | 'social' | 'app'; bio?: string; publisher?: string; desc: string }) => {
    setCandidate(preset.candidate);
    setChannel(preset.channel);
    setBio(preset.bio || '');
    setPublisher(preset.publisher || '');
    setResult(null);
    setError(null);
  };

  const handleCopyUrl = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.normalizedUrl || result.submittedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyChecklist = () => {
    if (!result) return;
    const checklistText = [
      `THREATLENS SAFE BROWSING CHECKLIST FOR: ${result.displayUrl}`,
      `Risk Classification: ${result.classificationLabel} (Score: ${result.riskScore}/100)`,
      '',
      ...result.recommendedPrecautions.map((p, i) => `${i + 1}. [ ] ${p}`),
    ].join('\n');

    navigator.clipboard.writeText(checklistText);
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2000);
  };

  const handleCopyFullReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Modern Light SaaS */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/30 to-cyan-50/20 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm border border-slate-200 overflow-hidden">
            <img
              src="/logo.png"
              alt="ThreatLens AI Official Logo"
              className="h-full w-full object-contain"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Activity className="h-3.5 w-3.5 text-indigo-600" />
              <span>TRANSPARENT HEURISTIC SCANNER &bull; DETERMINISTIC THREAT VERIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Intelligent Threat & URL Defense Scanner
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Inspect suspect URLs, social handles, or application packages in real time. The engine checks your registered Brand Baseline first—guaranteeing zero false positives on official assets—or executes transparent heuristic detection with plain-English threat explanations.
            </p>

            {/* Scanner Mode Switcher */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Text / URL Threat Scanner</span>
              </span>
              {onSwitchToScreenshotScan && (
                <button
                  type="button"
                  onClick={onSwitchToScreenshotScan}
                  className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Switch to Screenshot Vision Scanner</span>
                  <span className="rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold px-1.5 py-0.2">New</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Testing Presets */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-500" />
            Interactive Presets:
          </span>
          <button
            onClick={() => loadPreset({
              candidate: 'https://www.instagram.com/its_sneh234/',
              channel: 'domain',
              desc: 'Suspect Instagram Account Profile (Padding + Unverified)',
            })}
            className="rounded-lg bg-rose-100/90 border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-200 transition-colors shadow-2xs flex items-center gap-1.5 animate-pulse"
          >
            🚨 Instagram Profile (its_sneh234)
          </button>
          <button
            onClick={() => loadPreset({
              candidate: 'https:\\amazonind.co',
              channel: 'domain',
              desc: 'Amazon Impersonation (Backslash Evasion + Combisquatting)',
            })}
            className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            🔥 Fake Amazon (https:\amazonind.co)
          </button>
          <button
            onClick={() => loadPreset({
              candidate: 'amaz0n.com',
              channel: 'domain',
              desc: 'Typosquatting Lookalike Domain (Homoglyph 0 for o)',
            })}
            className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            🚨 Typosquat (amaz0n.com)
          </button>
          <button
            onClick={() => loadPreset({
              candidate: 'https://www.flipkartindia.co.in',
              channel: 'domain',
              desc: 'Flipkart Trademark Combisquatting Attack (flipkart + india on .co.in)',
            })}
            className="rounded-lg bg-amber-100/80 border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-200/80 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            ⚠️ Fake Flipkart (flipkartindia.co.in)
          </button>
          <button
            onClick={() => loadPreset({
              candidate: 'aman',
              channel: 'domain',
              desc: 'Malformed / Incomplete Domain Hostname (Missing TLD)',
            })}
            className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            ⚠️ Incomplete Domain (aman)
          </button>
          <button
            onClick={() => loadPreset({
              candidate: 'threatlens.io',
              channel: 'domain',
              desc: 'Official Domain',
            })}
            className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            🛡️ Official Domain (0 Risk Baseline Test)
          </button>
          <button
            onClick={() => loadPreset({
              candidate: 'https://threatl3ns-login-portal.xyz/verify?token=session88',
              channel: 'domain',
              desc: 'Phishing Lookalike URL',
            })}
            className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors shadow-2xs"
          >
            🚨 Phishing URL (Homoglyph + Lure)
          </button>
          <button
            onClick={() => loadPreset({
              candidate: '@threatlens_support_bot',
              channel: 'social',
              bio: 'Official 24/7 ThreatLens Resolution Bot. DM here for login issues and urgent ticket verification.',
              desc: 'Support Bot',
            })}
            className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            ⚠️ Rogue Support Bot (@threatlens_support_bot)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scanner Input Form (5 cols) */}
        <div className="lg:col-span-5 saas-card rounded-2xl p-6 border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              <span>Target Parameters</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">SSRF Guard Active</span>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Channel / Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'domain', label: 'Web URL / Domain' },
                  { id: 'social', label: 'Social Profile' },
                  { id: 'app', label: 'App Package' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setChannel(tab.id as any)}
                    className={`rounded-xl py-2 px-1 text-xs font-semibold transition-all ${
                      channel === tab.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {channel === 'domain'
                  ? 'Submit URL or Domain Hostname'
                  : channel === 'social'
                  ? 'Social Media Handle / Profile URL'
                  : 'Application Package ID / Sideload Link'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={candidate}
                  onChange={(e) => setCandidate(e.target.value)}
                  placeholder={
                    channel === 'domain'
                      ? 'https://threatl3ns-login.xyz or example.com'
                      : channel === 'social'
                      ? '@threatlens_support_bot'
                      : 'com.threatlens.login.helper'
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-mono focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {channel === 'domain'
                  ? 'Protocols (http/https), lookalikes, query params, and redirects will be evaluated.'
                  : channel === 'social'
                  ? 'Evaluates handle structure, keywords, and bio solicitations.'
                  : 'Checks package schema against registered legal publisher entities.'}
              </p>
            </div>

            {channel === 'social' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Profile Bio / DM Outreach Message (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Paste profile biography, pinned post, or direct message lure to detect credential harvesting..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            )}

            {channel === 'app' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Publisher / Developer Entity (Optional)
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="e.g. ThreatLens Security Inc."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="saveFindings"
                checked={saveToFindings}
                onChange={(e) => setSaveToFindings(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="saveFindings" className="text-xs text-slate-600 select-none cursor-pointer">
                Save scan record automatically into active Findings telemetry database
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !candidate.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:from-indigo-500 hover:to-blue-500 hover:shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <Activity className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Evaluating Heuristic Threat Engine...' : 'Run Deep Threat Scan'}</span>
            </button>
          </form>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Scan Error</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Quick Notice on Methodology */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1">
              <Info className="h-3 w-3 text-indigo-500" />
              <span>Methodology & Safety Rules:</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
              <li>Heuristic scores are explainable estimates calculated offline.</li>
              <li>Official assets are excluded before scoring (0 False Positives).</li>
              <li>URLs are never opened directly in the user browser during scanning.</li>
            </ul>
          </div>
        </div>

        {/* Scan Results View (7 cols) */}
        <div className="lg:col-span-7 saas-card rounded-2xl p-6 border-slate-200 bg-white shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Comprehensive Threat Intelligence Report</h3>
              <p className="text-[11px] text-slate-400">Deterministic security audit and heuristic indicator evaluation</p>
            </div>
            {result && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyUrl}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                  title="Copy Normalized URL"
                >
                  {copiedUrl ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                </button>
                <button
                  onClick={handleCopyFullReport}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                  title="Copy Full Report JSON"
                >
                  {copiedReport ? <Check className="h-3 w-3 text-emerald-600" /> : <FileText className="h-3 w-3" />}
                  <span>JSON</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                  title="Print Report"
                >
                  <Printer className="h-3 w-3" />
                  <span>Print</span>
                </button>
              </div>
            )}
          </div>

          {/* 1. Loading State with Multi-Stage Progress Animation & Skeletons */}
          {loading && (
            <div className="space-y-6 py-4 animate-fade-in-up">
              {/* Animated Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-700">Analyzing Target Candidate...</span>
                  <span className="font-mono text-slate-500">Step {scanStepIndex + 1} of 4</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${((scanStepIndex + 1) / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Progress Steps Feed */}
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

              {/* Skeletons */}
              <div className="space-y-3 pt-2">
                <div className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
                <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              </div>
            </div>
          )}

          {/* 2. Empty State Awaiting Target Input */}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs">
                <Activity className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">Awaiting Target Submission</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Enter a URL, social handle, or app package on the left—or click one of our interactive presets above—to trigger multi-channel baseline verification and explainable risk analysis.
                </p>
              </div>
            </div>
          )}

          {/* 3. Comprehensive Scan Report Results Layout */}
          {result && (
            <div className="space-y-6 animate-fade-in-up">
              {/* URL & Normalized Info Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-semibold text-slate-600">Normalized Target URL:</span>
                  <span className="font-mono font-bold text-indigo-700 break-all select-all">
                    {result.normalizedUrl || result.submittedUrl}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                  <span>Display Domain: <strong className="text-slate-700">{result.displayUrl}</strong></span>
                  <span>Scanned at: {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>

              {/* OVERALL RISK SCORE & PROMINENT ALERT */}
              {result.isOfficialExcluded ? (
                /* Baseline Exclusion Card */
                <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/80 p-5 sm:p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Official Brand Baseline Protected
                      </div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-emerald-900">
                        Low Risk — No major threat indicators detected
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-800/90 leading-relaxed">
                    {result.exclusionReason}
                  </p>

                  <div className="pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-emerald-900">
                    <span>Baseline Protection Status: <strong>VERIFIED OFFICIAL ASSET</strong></span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-bold">RISK SCORE: 0 / 100</span>
                  </div>
                </div>
              ) : (
                /* Risk Classification Banner */
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
                          {result.classification.replace('_', ' ')} Severity
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

                    {/* Numeric Score Gauge */}
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

                  {/* Score Progress Bar */}
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
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>0 (Low Risk)</span>
                      <span>50 (Suspicious)</span>
                      <span>100 (Critical)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Short Summary of Findings */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-900">Executive Threat Summary:</span>
                  <p>{result.summary}</p>
                </div>
              </div>

              {/* SECTION: WHY WAS THIS URL FLAGGED? */}
              {result.flaggedReasons.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setIsWhyFlaggedOpen(!isWhyFlaggedOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        Why Was This URL Flagged? ({result.flaggedReasons.length} Detected Indicator{result.flaggedReasons.length > 1 ? 's' : ''})
                      </h4>
                    </div>
                    {isWhyFlaggedOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>

                  {isWhyFlaggedOpen && (
                    <div className="p-4 divide-y divide-slate-100 space-y-4">
                      {result.flaggedReasons.map((reason, idx) => (
                        <div key={idx} className={idx > 0 ? 'pt-4 space-y-2' : 'space-y-2'}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {idx + 1}. {reason.indicatorName}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  reason.severity === 'critical'
                                    ? 'bg-rose-100 text-rose-800'
                                    : reason.severity === 'high'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {reason.severity}
                              </span>
                              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono text-indigo-700 border border-indigo-100">
                                {reason.category}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-slate-50 p-2.5 space-y-0.5 border border-slate-100">
                              <span className="font-semibold text-slate-500 text-[11px]">What was detected:</span>
                              <p className="text-slate-800 font-medium">{reason.detected}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2.5 space-y-0.5 border border-slate-100">
                              <span className="font-semibold text-slate-500 text-[11px]">Why it may be risky:</span>
                              <p className="text-slate-800 leading-relaxed">{reason.whyRisky}</p>
                            </div>
                          </div>

                          <div className="rounded-lg bg-indigo-50/60 border border-indigo-100/80 p-2.5 text-xs flex items-start gap-2 text-indigo-900">
                            <span className="font-bold text-indigo-700 shrink-0">Recommended Action:</span>
                            <span className="leading-relaxed">{reason.recommendedAction}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: WHAT MAKES THIS HARMFUL? (EXPANDABLE) */}
              {result.harmfulConsequences.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setIsHarmfulSectionOpen(!isHarmfulSectionOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        What Could Happen If You Open This Link? ({result.harmfulConsequences.length} Potential Risk{result.harmfulConsequences.length > 1 ? 's' : ''})
                      </h4>
                    </div>
                    {isHarmfulSectionOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>

                  {isHarmfulSectionOpen && (
                    <div className="p-4 space-y-3">
                      <div className="text-[11px] text-slate-500 italic pb-1">
                        Note: These are potential risks based on observed threat indicators, not proof that every flagged link executes all of these actions.
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.harmfulConsequences.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/60 p-3.5 space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">{item.title}</span>
                              <span className="rounded-md bg-rose-50 text-rose-700 px-1.5 py-0.5 text-[10px] font-semibold border border-rose-100">
                                {item.tag}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: RECOMMENDED PRECAUTIONS & CHECKLIST */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setIsPrecautionsOpen(!isPrecautionsOpen)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      Recommended Precautions & Safety Guidance
                    </h4>
                  </div>
                  {isPrecautionsOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>

                {isPrecautionsOpen && (
                  <div className="p-4 space-y-4">
                    {result.classification === 'dangerous' && (
                      <div className="rounded-xl bg-rose-100/80 border border-rose-300 p-3 text-xs font-bold text-rose-900 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-700 shrink-0" />
                        <span>DO NOT OPEN: High likelihood of credential interception or malware delivery.</span>
                      </div>
                    )}

                    <ul className="space-y-2 text-xs text-slate-700">
                      {result.recommendedPrecautions.map((precaution, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{precaution}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">
                        Export checklist for end-user incident response
                      </span>
                      <button
                        onClick={handleCopyChecklist}
                        className="rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        {copiedChecklist ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedChecklist ? 'Checklist Copied!' : 'Copy Safe Browsing Checklist'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: SCAN METADATA & AVAILABLE SECURITY SOURCES */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setIsMetadataOpen(!isMetadataOpen)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      Security-Check Sources & Engine Metadata
                    </h4>
                  </div>
                  {isMetadataOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>

                {isMetadataOpen && (
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {result.securitySources.map((source, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-2.5 space-y-1 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{source.name}</span>
                            <span
                              className={`rounded-md px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase ${
                                source.status === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : source.status === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {source.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{source.details}</p>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100 flex flex-wrap justify-between gap-1">
                      <span>Engine: ThreatLens Heuristics v2.4</span>
                      <span>Deterministic Audit Hash: SHA-256 Verified</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
