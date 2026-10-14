'use client';

import React, { useState } from 'react';
import {
  FolderLock,
  FileCheck2,
  FileText,
  Clock,
  User,
  Plus,
  ArrowRight,
  ShieldAlert,
  Hash,
  MessageSquare,
} from 'lucide-react';

interface Investigation {
  id: string;
  caseNumber: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  assignee?: { id: string; name: string; email: string } | null;
  findings: any[];
  evidence: any[];
  analystNotes: any[];
  auditLogs: any[];
  createdAt: string;
}

interface InvestigationsTabProps {
  investigations: Investigation[];
  onOpenCase: (inv: Investigation) => void;
  onCreateCase: () => void;
}

export default function InvestigationsTab({
  investigations,
  onOpenCase,
  onCreateCase,
}: InvestigationsTabProps) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = investigations.filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/30 to-blue-50/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700">
              <FolderLock className="h-3.5 w-3.5 text-indigo-600" />
              <span>INCIDENT TRIAGE &bull; NIST/SOC2 COMPLIANT AUDIT TRAIL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              SOC Investigation Case Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Triage active brand impersonation campaigns, archive cryptographic evidence with SHA-256 hashes, maintain analyst notes, and log tamper-evident audit trails.
            </p>
          </div>

          <button
            onClick={onCreateCase}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-500 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Case</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          {[
            { id: 'all', label: 'All Investigations' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'confirmed_suspicious', label: 'Confirmed Suspicious' },
            { id: 'resolved', label: 'Resolved' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map(inv => {
          const isCritical = inv.severity === 'critical';
          const isHigh = inv.severity === 'high';
          const sevColor = isCritical
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : isHigh
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-blue-50 text-blue-700 border-blue-200';

          const statusBadge =
            inv.status === 'confirmed_suspicious'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : inv.status === 'under_review'
              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200';

          return (
            <div
              key={inv.id}
              onClick={() => onOpenCase(inv)}
              className="saas-card saas-card-hover rounded-2xl p-5 border-slate-200/90 bg-white cursor-pointer transition-all hover:border-indigo-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    {inv.caseNumber}
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${sevColor}`}>
                    {inv.severity} Severity
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusBadge}`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                  {inv.assignee && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>{inv.assignee.name}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors">
                  {inv.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{inv.description}</p>
              </div>

              {/* Case Stats Counters */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-center">
                  <div className="text-base font-extrabold text-slate-900">{inv.findings?.length || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Linked Findings</div>
                </div>

                <div className="text-center">
                  <div className="text-base font-extrabold text-slate-900">{inv.evidence?.length || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Evidence Files</div>
                </div>

                <div className="text-center">
                  <div className="text-base font-extrabold text-slate-900">{inv.analystNotes?.length || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Analyst Notes</div>
                </div>

                <button className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-2xs">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
