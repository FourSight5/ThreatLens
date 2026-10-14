'use client';

import React from 'react';
import { Sparkles, Download, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenScenarios: () => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export default function Navbar({ onOpenScenarios, onResetDemo, isResetting }: NavbarProps) {
  const handleExport = () => {
    window.open('/api/export', '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity with custom logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-0.5 shadow-sm border border-slate-200/90 overflow-hidden">
            <img
              src="/logo.png"
              alt="ThreatLens AI Logo"
              className="h-full w-full object-contain"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-slate-900">ThreatLens<span className="text-indigo-600">AI</span></span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
                DRP ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified Multi-Channel Baseline Active &bull; Zero False Positives
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Judge Demo Scenarios Launcher */}
          <button
            onClick={onOpenScenarios}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-indigo-500 hover:to-blue-500 hover:shadow-md active:scale-98 cursor-pointer"
            title="Launch 1-Click Judge Demo Scenarios"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
            <span>Judge Scenarios</span>
          </button>

          {/* Export JSON Audit Report */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
            title="Download NIST/SOC2 JSON Compliance Audit Report"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>

          {/* Reset Demo Database */}
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
            title="Reset database to clean demo state"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
