'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Smartphone,
  Share2,
  Globe,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  ExternalLink,
  Info,
  Clock,
  Lightbulb,
  Check,
  Copy,
  Camera,
} from 'lucide-react';

interface Finding {
  id: string;
  type: string;
  platform: string | null;
  displayName: string;
  riskScore: number;
  riskLevel: string;
  status: string;
  description: string | null;
  sourceUrl: string | null;
  riskSignals: { id: string; signalType: string; description: string; weight: number; isPositive: boolean }[];
  metadata?: any;
  createdAt?: string;
}

interface OverviewTabProps {
  findings: Finding[];
  officialAssetsCount: number;
  onNavigateTab: (tab: string) => void;
  onSelectFinding: (finding: Finding) => void;
  onQuickScan?: (query: string) => void;
}

export default function OverviewTab({
  findings,
  officialAssetsCount,
  onNavigateTab,
  onSelectFinding,
  onQuickScan,
}: OverviewTabProps) {
  const [quickInput, setQuickInput] = useState('');
  const [copiedTip, setCopiedTip] = useState(false);

  const totalFindings = findings.length;
  const criticalCount = findings.filter((f) => f.riskScore >= 70 || f.riskLevel === 'critical').length;
  const suspiciousCount = findings.filter((f) => f.riskScore > 0 && f.riskScore < 70).length;
  const lowRiskCount = findings.filter((f) => f.riskScore === 0 || f.riskLevel === 'low').length;
  const confirmedCount = findings.filter((f) => f.status === 'confirmed').length;

  const socialCount = findings.filter((f) => f.type === 'social_profile').length;
  const appCount = findings.filter((f) => f.type === 'app_listing').length;
  const domainCount = findings.filter((f) => f.type === 'domain').length;

  // Threat distribution percentages
  const critPct = totalFindings > 0 ? Math.round((criticalCount / totalFindings) * 100) : 0;
  const suspPct = totalFindings > 0 ? Math.round((suspiciousCount / totalFindings) * 100) : 0;
  const lowPct = totalFindings > 0 ? Math.round((lowRiskCount / totalFindings) * 100) : 0;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    if (onQuickScan) {
      onQuickScan(quickInput.trim());
    } else {
      onNavigateTab('scanner');
    }
  };

  const securityTips = [
    {
      title: 'Scrutinize Homoglyph Characters in Domain Names',
      desc: 'Attackers substitute letters with numbers (e.g., "0" for "o" or "1" for "l") to register lookalikes that appear authentic in mobile fonts.',
    },
    {
      title: 'Enforce Verified Multi-Channel Baseline Exclusions',
      desc: 'Register all authorized domains, social handles, and app package IDs to prevent false-positive alarms on legitimate corporate communications.',
    },
    {
      title: 'Verify Support Handles via Official Directory',
      desc: 'Legitimate customer support representatives will never solicit passwords, private keys, or 2FA codes through social media direct messages.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner - Light SaaS Theme */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/40 to-cyan-50/30 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm border border-slate-200/90 overflow-hidden">
              <img
                src="/logo.png"
                alt="ThreatLens AI Official Logo"
                className="h-full w-full object-contain"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                SOC RADAR ACTIVE &bull; DIGITAL RISK PROTECTION PLATFORM
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Command Center & Threat Telemetry
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Continuous intelligence defending brand equity across web domains, social media handles, and app marketplaces.
                Registered corporate assets bypass threat scoring with guaranteed zero risk.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('scanner')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:from-indigo-500 hover:to-blue-500 hover:shadow-md active:scale-95 cursor-pointer"
            >
              <Activity className="h-4 w-4" />
              <span>Launch Quick Threat Scanner</span>
            </button>
            <button
              onClick={() => onNavigateTab('screenshot')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:from-cyan-500 hover:to-indigo-500 hover:shadow-md active:scale-95 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              <span>Screenshot Threat Scanner</span>
            </button>
            <button
              onClick={() => onNavigateTab('brand')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300 shadow-2xs cursor-pointer"
            >
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>View Baseline ({officialAssetsCount} Protected)</span>
            </button>
          </div>
        </div>

        {/* Quick URL Scan Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Quick Scan: Paste any suspicious URL, domain, or handle to evaluate..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-2xs transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              <span>Scan Target</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* KPI Cards Grid with Animated Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total URLs Scanned */}
        <div className="saas-card saas-card-hover rounded-2xl p-4.5 bg-white border-slate-200/90">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scanned</span>
            <Activity className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalFindings}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3 text-indigo-600" />
            <span>Telemetry records</span>
          </div>
        </div>

        {/* Dangerous URLs Detected */}
        <div className="saas-card saas-card-hover rounded-2xl p-4.5 bg-rose-50/40 border-rose-200">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Dangerous URLs</span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600">{criticalCount}</div>
          <div className="text-[11px] text-rose-700/80 mt-1 font-medium">Score &ge; 70 (Avoid Opening)</div>
        </div>

        {/* Suspicious URLs Detected */}
        <div className="saas-card saas-card-hover rounded-2xl p-4.5 bg-amber-50/40 border-amber-200">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Suspicious URLs</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{suspiciousCount}</div>
          <div className="text-[11px] text-amber-700/80 mt-1 font-medium">Score 15–69 (Needs Review)</div>
        </div>

        {/* Low-Risk URLs Analysed */}
        <div className="saas-card saas-card-hover rounded-2xl p-4.5 bg-emerald-50/40 border-emerald-200">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low-Risk URLs</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{lowRiskCount}</div>
          <div className="text-[11px] text-emerald-700/80 mt-1 font-medium">No major threats found</div>
        </div>

        {/* Confirmed Incidents */}
        <div className="saas-card saas-card-hover rounded-2xl p-4.5 bg-white border-slate-200/90 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Cases</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{confirmedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Takedown investigations</div>
        </div>
      </div>

      {/* Threat Distribution Chart & Channel Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Distribution Visual Bar (5 cols) */}
        <div className="lg:col-span-5 saas-card rounded-2xl p-5 border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Threat Distribution Breakdown</h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Severity segmentation of all evaluated URL and candidate telemetry records.
          </p>

          {/* Stacked Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-2xs">
              <div
                style={{ width: `${critPct}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Dangerous: ${critPct}%`}
              />
              <div
                style={{ width: `${suspPct}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Suspicious: ${suspPct}%`}
              />
              <div
                style={{ width: `${lowPct}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Low Risk: ${lowPct}%`}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Dangerous ({critPct}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Suspicious ({suspPct}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low Risk ({lowPct}%)
              </span>
            </div>
          </div>

          {/* Statistical Breakdown list */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 border border-rose-100">
              <span className="font-semibold text-rose-800">Critical / Dangerous Links:</span>
              <span className="font-bold text-rose-700">{criticalCount} flagged</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 border border-amber-100">
              <span className="font-semibold text-amber-800">Suspicious Candidates:</span>
              <span className="font-bold text-amber-700">{suspiciousCount} under triage</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <span className="font-semibold text-emerald-800">Baseline Verified / Low Risk:</span>
              <span className="font-bold text-emerald-700">{lowRiskCount} protected</span>
            </div>
          </div>
        </div>

        {/* Monitoring Channel Pillars (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Social Media Column */}
          <div
            onClick={() => onNavigateTab('social')}
            className="group cursor-pointer saas-card saas-card-hover rounded-2xl p-4.5 border-slate-200/90 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <Share2 className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">30%</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Social Media Threats</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                VIP executive impersonation, rogue support bots on X, LinkedIn & Instagram.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-3">
              <span>{socialCount} Candidates</span>
              <ArrowRight className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* App Store Column */}
          <div
            onClick={() => onNavigateTab('apps')}
            className="group cursor-pointer saas-card saas-card-hover rounded-2xl p-4.5 border-slate-200/90 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600">
                  <Smartphone className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded font-bold">30%</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">App Store Defense</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Namespace squatting (com.threatlens.*) and sideloaded trojan APKs.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-3">
              <span>{appCount} Packages</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Domain Impersonation Column */}
          <div
            onClick={() => onNavigateTab('domains')}
            className="group cursor-pointer saas-card saas-card-hover rounded-2xl p-4.5 border-slate-200/90 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <Globe className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Web</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Domain & Lookalikes</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Homoglyphs (threatl3ns.io), typosquats, and phishing SSO portals.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-3">
              <span>{domainCount} Flagged</span>
              <ArrowRight className="h-3.5 w-3.5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scan History & Live Alerts Feed */}
      <div className="saas-card rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-sm font-bold text-slate-900">Recent Scan History & Active Alerts</h2>
            <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 font-mono">
              Deterministic Heuristics
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('cases')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Open SOC Investigation Vault</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {findings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active threat records found. Run a scan above to ingest target telemetry.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {findings.slice(0, 6).map((f) => {
              const isExcluded = f.riskScore === 0;
              const isDangerous = f.riskScore >= 70;
              const isSuspicious = f.riskScore > 0 && f.riskScore < 70;

              return (
                <div
                  key={f.id}
                  onClick={() => onSelectFinding(f)}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {f.displayName}
                      </span>

                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          isExcluded
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isDangerous
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isSuspicious
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isExcluded ? 'EXCLUDED BASELINE (0 RISK)' : `${f.riskScore} / 100 • ${f.riskLevel}`}
                      </span>

                      {f.platform && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">
                          {f.platform}
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 capitalize">
                        Status: <strong className="text-slate-600">{f.status}</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">{f.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-700">
                        {f.riskSignals?.length || 0} Risk Signals
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {isExcluded ? '100% Authoritative' : `${f.riskScore}% Threat Risk`}
                      </div>
                    </div>
                    <button className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors group-hover:border-indigo-300 group-hover:bg-indigo-50 group-hover:text-indigo-700 shadow-2xs">
                      Inspect &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Tips Section */}
      <div className="saas-card rounded-2xl p-5 border-slate-200/90 bg-white shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm">Security Best Practices & Incident Guidance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {securityTips.map((tip, idx) => (
            <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-1">
              <h4 className="font-bold text-xs text-slate-800">{tip.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
