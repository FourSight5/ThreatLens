'use client';

import React, { useState } from 'react';
import {
  Globe,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Server,
  FolderPlus,
  CheckCircle2,
  Lock,
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

interface DomainTabProps {
  findings: Finding[];
  onPromoteToCase: (finding: Finding) => void;
  onSelectFinding: (finding: Finding) => void;
}

export default function DomainTab({
  findings,
  onPromoteToCase,
  onSelectFinding,
}: DomainTabProps) {
  const [filter, setFilter] = useState('all');

  const domainFindings = findings.filter(f => f.type === 'domain');

  const filtered = domainFindings.filter(f => {
    if (filter === 'threats' && f.riskScore === 0) return false;
    if (filter === 'excluded' && f.riskScore > 0) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-purple-50/30 to-indigo-50/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-3 py-1 text-xs font-semibold text-purple-800">
              <Globe className="h-3.5 w-3.5 text-purple-600" />
              <span>WEB INFRASTRUCTURE &bull; TYPOSQUATTING & HOMOGLYPH DEFENSE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Domain & SSO Impersonation Defense
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Detect typosquatting, character swaps (Damerau-Levenshtein), leetspeak homoglyphs (<code className="text-purple-700 font-mono font-bold">threatl3ns.io</code>), and counterfeit enterprise single-sign-on gateways.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Hosts ({domainFindings.length})
            </button>
            <button
              onClick={() => setFilter('threats')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === 'threats'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Active Threats
            </button>
            <button
              onClick={() => setFilter('excluded')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === 'excluded'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Official Baseline (0 Risk)
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(f => {
          const isExcluded = f.riskScore === 0;
          const badgeClass = isExcluded
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : f.riskLevel === 'critical'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-amber-50 text-amber-700 border-amber-200';

          return (
            <div
              key={f.id}
              className={`saas-card saas-card-hover rounded-2xl p-5 border-slate-200/90 bg-white flex flex-col justify-between space-y-4 ${
                isExcluded ? 'border-emerald-300 bg-emerald-50/20' : ''
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      onClick={() => onSelectFinding(f)}
                      className="font-bold text-slate-900 text-base hover:text-purple-700 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span>{f.displayName}</span>
                      {isExcluded && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {f.sourceUrl}
                    </div>
                  </div>

                  <span className={`rounded-md border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shrink-0 ${badgeClass}`}>
                    {isExcluded ? 'BASELINE EXCLUDED • 0 RISK' : `${f.riskScore} / 100 • ${f.riskLevel}`}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>

                {/* Metadata Box */}
                {f.metadata && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 space-y-1.5 text-xs font-mono">
                    {f.metadata.registrar && (
                      <div className="text-slate-600">
                        Registrar: <strong className="text-slate-900">{f.metadata.registrar}</strong>
                      </div>
                    )}
                    {f.metadata.ip && (
                      <div className="text-slate-600">
                        IP Address: <strong className="text-slate-900">{f.metadata.ip}</strong>
                      </div>
                    )}
                    {f.metadata.homoglyph && (
                      <div className="text-purple-700 font-bold">
                        Homoglyph Technique: {f.metadata.homoglyph}
                      </div>
                    )}
                    {f.metadata.exclusionReason && (
                      <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{f.metadata.exclusionReason}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Signals */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isExcluded ? 'Exclusion Audit Trail:' : 'Heuristic Risk Weights:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {f.riskSignals?.map(s => (
                      <span
                        key={s.id}
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] border ${
                          s.isPositive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className={`font-bold ${s.isPositive ? 'text-emerald-700' : 'text-amber-600'}`}>
                          {s.isPositive ? 'PROTECTED' : `+${s.weight}`}
                        </span>
                        <span className="truncate max-w-[220px]">{s.description}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <div>
                  {isExcluded ? (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Exclusion Safeguard Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onPromoteToCase(f)}
                      className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-purple-500 transition-colors cursor-pointer"
                    >
                      <FolderPlus className="h-3.5 w-3.5" />
                      <span>Initiate Domain Takedown</span>
                    </button>
                  )}
                </div>

                {f.sourceUrl && (
                  <a
                    href={f.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
