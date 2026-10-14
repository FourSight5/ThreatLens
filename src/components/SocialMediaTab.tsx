'use client';

import React, { useState } from 'react';
import {
  Share2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Users,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Filter,
} from 'lucide-react';

interface Finding {
  id: string;
  type: string;
  platform: string | null;
  displayName: string;
  handle?: string | null;
  riskScore: number;
  riskLevel: string;
  status: string;
  description: string | null;
  sourceUrl: string | null;
  riskSignals: { id: string; signalType: string; description: string; weight: number; isPositive: boolean }[];
  metadata?: any;
}

interface SocialMediaTabProps {
  findings: Finding[];
  onUpdateStatus: (id: string, status: string) => void;
  onPromoteToCase: (finding: Finding) => void;
  onSelectFinding: (finding: Finding) => void;
}

export default function SocialMediaTab({
  findings,
  onUpdateStatus,
  onPromoteToCase,
  onSelectFinding,
}: SocialMediaTabProps) {
  const [platformFilter, setPlatformFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const socialFindings = findings.filter(f => f.type === 'social_profile');

  const filtered = socialFindings.filter(f => {
    if (platformFilter !== 'all' && f.platform !== platformFilter) return false;
    if (riskFilter !== 'all' && f.riskLevel !== riskFilter) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/30 to-blue-50/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Share2 className="h-3.5 w-3.5 text-indigo-600" />
              <span>30% EVALUATION CATEGORY &bull; CROSS-PLATFORM DEFENSE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Social Media Impersonation Monitoring
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Real-time detection of unauthorized executive personas, counterfeit customer care bots, and credential-harvesting promotional campaigns across X/Twitter, LinkedIn, Instagram, and Telegram.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2 text-right">
              <div className="text-2xl font-extrabold text-indigo-700">{socialFindings.length}</div>
              <div className="text-[11px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Social Incidents</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1 font-semibold">
            <Filter className="h-3.5 w-3.5 text-indigo-600" />
            <span>Filter By:</span>
          </div>

          {/* Platform Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Platforms' },
              { id: 'x', label: 'X / Twitter' },
              { id: 'linkedin', label: 'LinkedIn' },
              { id: 'instagram', label: 'Instagram' },
              { id: 'telegram', label: 'Telegram' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPlatformFilter(tab.id)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  platformFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Severity Filter */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (&ge;90)</option>
            <option value="high">High (70-89)</option>
            <option value="medium">Medium (40-69)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="all">All Statuses</option>
            <option value="new">New Candidate</option>
            <option value="confirmed">Confirmed Threat</option>
            <option value="false_positive">False Positive</option>
          </select>
        </div>
      </div>

      {/* Candidate Finding Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(f => {
          const isCritical = f.riskLevel === 'critical' || f.riskScore >= 90;
          const isHigh = f.riskLevel === 'high' || (f.riskScore >= 70 && f.riskScore < 90);
          const badgeClass = isCritical
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : isHigh
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-slate-100 text-slate-600 border-slate-200';

          return (
            <div
              key={f.id}
              className="saas-card saas-card-hover rounded-2xl p-5 border-slate-200/90 bg-white flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onSelectFinding(f)}>
                        {f.displayName}
                      </span>
                      {f.platform && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">
                          {f.platform}
                        </span>
                      )}
                    </div>
                    {f.handle && (
                      <div className="text-xs text-indigo-600 font-mono mt-0.5 font-medium">{f.handle}</div>
                    )}
                  </div>

                  <span className={`rounded-md border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shrink-0 ${badgeClass}`}>
                    {f.riskScore} / 100 • {f.riskLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>

                {/* Metadata Box (Followers, Bio, Flagged Quote) */}
                {f.metadata && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 space-y-2 text-xs">
                    {f.metadata.followers !== undefined && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Observed Followers: <strong className="text-slate-900">{f.metadata.followers.toLocaleString()}</strong></span>
                        {f.metadata.observedDate && (
                          <span className="text-slate-400 font-mono">&bull; {f.metadata.observedDate}</span>
                        )}
                      </div>
                    )}

                    {f.metadata.bio && (
                      <div className="text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200/60">
                        "{f.metadata.bio}"
                      </div>
                    )}

                    {f.metadata.flaggedContent && (
                      <div className="text-[11px] text-rose-800 font-mono bg-rose-50 p-2 rounded-lg border border-rose-200">
                        {f.metadata.flaggedContent}
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
                    <span>Confirm</span>
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
                    <span>False Positive</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPromoteToCase(f)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>Promote to Case</span>
                  </button>

                  {f.sourceUrl && (
                    <a
                      href={f.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Inspect Source Link"
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
