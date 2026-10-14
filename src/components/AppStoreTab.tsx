'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ExternalLink,
  Download,
  FolderPlus,
  CheckCircle2,
  XCircle,
  FileCode,
  Key,
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
}

interface AppStoreTabProps {
  findings: Finding[];
  onUpdateStatus: (id: string, status: string) => void;
  onPromoteToCase: (finding: Finding) => void;
  onSelectFinding: (finding: Finding) => void;
}

export default function AppStoreTab({
  findings,
  onUpdateStatus,
  onPromoteToCase,
  onSelectFinding,
}: AppStoreTabProps) {
  const [storeFilter, setStoreFilter] = useState('all');

  const appFindings = findings.filter(f => f.type === 'app_listing');

  const filtered = appFindings.filter(f => {
    if (storeFilter === 'google_play' && f.platform !== 'google_play') return false;
    if (storeFilter === 'app_store' && f.platform !== 'app_store') return false;
    if (storeFilter === 'third_party' && f.platform !== 'third_party') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-emerald-50/30 to-cyan-50/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
              <span>30% EVALUATION CATEGORY &bull; MOBILE ECOSYSTEM DEFENSE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              App Store & Rogue Package Monitoring
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Detect package namespace squatting (<code className="text-emerald-700 font-mono font-bold">com.threatlens.*</code>), publisher entity verification mismatches, trojanized modifiers ("Helper", "Plus", "Mod"), and predatory permission vectors across Google Play, Apple App Store, and sideloaded APK mirrors.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2 text-right self-start md:self-auto">
            <div className="text-2xl font-extrabold text-emerald-700">{appFindings.length}</div>
            <div className="text-[11px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Mobile Threats</div>
          </div>
        </div>

        {/* Store Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          {[
            { id: 'all', label: 'All App Marketplaces' },
            { id: 'google_play', label: 'Google Play Store' },
            { id: 'app_store', label: 'Apple App Store' },
            { id: 'third_party', label: 'Third-Party APK Mirrors' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStoreFilter(tab.id)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                storeFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(f => {
          const isCritical = f.riskLevel === 'critical' || f.riskScore >= 90;
          const badgeClass = isCritical
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-amber-50 text-amber-700 border-amber-200';

          return (
            <div
              key={f.id}
              className="saas-card saas-card-hover rounded-2xl p-5 border-slate-200/90 bg-white flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      onClick={() => onSelectFinding(f)}
                      className="font-bold text-slate-900 text-base hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {f.displayName}
                    </h3>
                    {f.metadata?.packageId && (
                      <div className="text-xs text-emerald-700 font-mono mt-0.5 flex items-center gap-1.5 font-medium">
                        <FileCode className="h-3 w-3" />
                        <span>{f.metadata.packageId}</span>
                      </div>
                    )}
                  </div>

                  <span className={`rounded-md border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shrink-0 ${badgeClass}`}>
                    {f.riskScore} / 100 • {f.riskLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>

                {/* App Package Inspection Box */}
                {f.metadata && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <span className="text-[11px] block text-slate-400 uppercase font-semibold">Publisher Name</span>
                        <strong className="text-slate-900">{f.metadata.publisher || 'Unverified Developer'}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] block text-slate-400 uppercase font-semibold">Distribution Store</span>
                        <strong className="text-slate-900">{f.metadata.store || f.platform}</strong>
                      </div>
                    </div>

                    {/* Predatory Permissions List */}
                    {f.metadata.permissions && Array.isArray(f.metadata.permissions) && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[11px] block text-rose-700 font-bold mb-1 flex items-center gap-1">
                          <Key className="h-3 w-3" />
                          <span>Flagged Malicious Permissions:</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {f.metadata.permissions.map((perm: string) => (
                            <span
                              key={perm}
                              className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] text-rose-800 font-mono font-medium"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Risk Signals List */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Explainable Heuristic Signals:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {f.riskSignals?.map(s => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 border border-slate-200"
                        title={s.description}
                      >
                        <span className="font-bold text-amber-600">+{s.weight}</span>
                        <span className="truncate max-w-[200px]">{s.description}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateStatus(f.id, 'confirmed')}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      f.status === 'confirmed'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Confirm Rogue</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(f.id, 'false_positive')}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      f.status === 'false_positive'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                    }`}
                  >
                    <XCircle className="h-3 w-3" />
                    <span>Ignore</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPromoteToCase(f)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-500 transition-colors cursor-pointer"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>File Takedown Case</span>
                  </button>

                  {f.sourceUrl && (
                    <a
                      href={f.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Inspect App Store Listing"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
