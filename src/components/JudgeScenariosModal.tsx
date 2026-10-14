'use client';

import React from 'react';
import {
  X,
  Sparkles,
  Share2,
  Smartphone,
  Globe,
  ShieldCheck,
  ArrowRight,
  Download,
  Camera,
} from 'lucide-react';

interface JudgeScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: {
    candidate: string;
    channel: 'social' | 'app' | 'domain';
    bio?: string;
    publisher?: string;
    desc: string;
  }) => void;
}

export default function JudgeScenariosModal({
  isOpen,
  onClose,
  onSelectScenario,
}: JudgeScenariosModalProps) {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'scen-1',
      title: 'Scenario A: VIP Executive Leadership Impersonation',
      category: 'Social Media (30% Weight)',
      icon: Share2,
      candidate: 'sarah-chen-threatlens-invest',
      channel: 'social' as const,
      bio: 'Chief Executive Officer at ThreatLens Inc. Connecting with strategic early-stage cybersecurity angel investors.',
      desc: 'Lookalike executive profile targeting company partners with unauthorized private equity seed inquiries.',
      expectedOutput: 'Score 82+ (High Risk) &bull; VIP Impersonation (+30), Financial Lure (+25), Work History Anomaly (+15)',
    },
    {
      id: 'scen-2',
      title: 'Scenario B: Trojanized 2FA Mobile Application',
      category: 'App Store Monitoring (30% Weight)',
      icon: Smartphone,
      candidate: 'com.threatlens.login.helper',
      channel: 'app' as const,
      publisher: 'ThreatLens Dev Studio',
      desc: 'Trojanized 2FA helper APK on Google Play requesting SMS interception and Accessibility access.',
      expectedOutput: 'Score 85+ (High Risk) &bull; Namespace Squatting (+30), Trojan Modifier (+25), Publisher Mismatch (+15)',
    },
    {
      id: 'scen-3',
      title: 'Scenario C: Rogue Customer Support Bot Phishing',
      category: 'Social Media Monitoring (30% Weight)',
      icon: Share2,
      candidate: '@threatlens_support_bot',
      channel: 'social' as const,
      bio: 'Official 24/7 ThreatLens Resolution Bot. DM here for login issues and urgent ticket verification.',
      desc: 'Impersonator handle on X soliciting master pass and recovery phrases via DM.',
      expectedOutput: 'Score 88+ (High Risk) &bull; Support Lure (+30), Brand Stem (+25), Credential Request (+25)',
    },
    {
      id: 'scen-4',
      title: 'Scenario D: Authoritative Baseline Exclusion Safeguard',
      category: 'Brand Profile Baseline (15% Weight)',
      icon: ShieldCheck,
      candidate: 'threatlens.io',
      channel: 'domain' as const,
      desc: 'Authoritative primary enterprise domain submitted to threat evaluation pipeline.',
      expectedOutput: 'Score 0 / 100 (Zero False Positive) &bull; EXCLUDED BEFORE THREAT SCORING notice triggered',
    },
    {
      id: 'scen-5',
      title: 'Scenario E: Protocol Backslash Evasion & Brand Combisquatting',
      category: 'Web URL Defense (Backslash + Combisquat)',
      icon: Globe,
      candidate: 'https:\\amazonind.co',
      channel: 'domain' as const,
      desc: 'Adversary uses backslash evasion (https:\\) combined with Amazon trademark combisquatting (amazon + ind) on non-authoritative TLD (.co).',
      expectedOutput: 'Score 100 / 100 (Critical Risk) &bull; Brand Impersonation (+45), Backslash Evasion (+30), Combisquatting (+25), TLD Mismatch (+20)',
    },
    {
      id: 'scen-6',
      title: 'Scenario F: Screenshot Forensics & Vision Threat Extraction',
      category: 'AI Vision & Screenshot Forensics',
      icon: Camera,
      candidate: 'https://threatl3ns-login-portal.xyz/auth?step=verify',
      channel: 'domain' as const,
      desc: 'Screenshot image of spoofed SSO corporate portal containing address bar homoglyph (threatl3ns.xyz), cloned logo mark, and credential harvest form.',
      expectedOutput: 'Score 89+ (High/Critical) &bull; Optical URL Extraction (+35), Address Bar Homoglyph (+30), Cloned SSO Layout (+25)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="saas-card w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Judge 1-Click Evaluation Scenarios</h2>
              <p className="text-xs text-slate-500">
                Instant proof of heuristic math, multi-channel defense, and zero false positives.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {scenarios.map(scen => {
            const Icon = scen.icon;
            return (
              <div
                key={scen.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4.5 hover:border-indigo-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      {scen.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{scen.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{scen.desc}</p>

                  <div className="text-[11px] font-mono text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                    <strong className="text-slate-800">Expected Heuristic Result:</strong>{' '}
                    <span dangerouslySetInnerHTML={{ __html: scen.expectedOutput }} />
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectScenario(scen);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-500 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Launch Scenario</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>All evaluations run locally using deterministic rules.</span>
          <button
            onClick={() => window.open('/api/export', '_blank')}
            className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Formatted JSON Compliance Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
