'use client';

import React from 'react';
import {
  ShieldCheck,
  Globe,
  Share2,
  Smartphone,
  UserCheck,
  Tag,
  Plus,
  Trash2,
  Lock,
  Sparkles,
} from 'lucide-react';

interface OfficialAsset {
  id: string;
  type: string;
  platform: string | null;
  value: string;
  verified: boolean;
}

interface BrandProfileTabProps {
  brand: any;
  onOpenAddModal: (type: string) => void;
  onDeleteAsset: (id: string) => void;
}

export default function BrandProfileTab({
  brand,
  onOpenAddModal,
  onDeleteAsset,
}: BrandProfileTabProps) {
  if (!brand) return null;

  const assets: OfficialAsset[] = brand.officialAssets || [];
  const domains = assets.filter(a => a.type === 'domain');
  const socialHandles = assets.filter(a => a.type === 'social_handle');
  const mobileApps = assets.filter(a => a.type === 'app_package');
  const vips = assets.filter(a => a.type === 'vip_roster');
  const keywords: string[] = brand.keywords || [];

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="saas-card rounded-2xl p-6 sm:p-7 border-slate-200/90 bg-gradient-to-r from-white via-emerald-50/30 to-teal-50/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>15% EVALUATION CATEGORY &bull; MULTI-CHANNEL ASSET BASELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Brand Profile & Zero-Risk Exclusion Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Establishes authoritative corporate identity across web domains, social handles, mobile application packages, VIP leadership rosters, and monitored keywords. Registered assets are systematically excluded prior to risk scoring with guaranteed 0 / 100 risk.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-center shrink-0 self-start md:self-auto shadow-2xs">
            <div className="text-3xl font-extrabold text-emerald-700">{assets.length}</div>
            <div className="text-[11px] text-emerald-800 font-mono uppercase tracking-wider font-bold">
              Protected Baseline Assets
            </div>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Official Corporate Domains */}
        <div className="saas-card rounded-2xl p-5 border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Official Web Domains</h3>
                <span className="text-[11px] text-slate-400">Bypasses domain lookalike scoring</span>
              </div>
            </div>
            <button
              onClick={() => onOpenAddModal('domain')}
              className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              <span>Add Domain</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <span
                key={d.id}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-50/60 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-900 font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-mono">{d.value}</span>
                <button
                  onClick={() => onDeleteAsset(d.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove Asset"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
            {domains.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2">No official domains configured.</div>
            )}
          </div>
        </div>

        {/* Section 2: Official Social Media Handles */}
        <div className="saas-card rounded-2xl p-5 border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Verified Social Handles</h3>
                <span className="text-[11px] text-slate-400">Bypasses handle impersonation alarms</span>
              </div>
            </div>
            <button
              onClick={() => onOpenAddModal('social_handle')}
              className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-600" />
              <span>Add Handle</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {socialHandles.map(s => (
              <span
                key={s.id}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50/60 border border-indigo-200 px-3 py-1.5 text-xs text-indigo-900 font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span className="font-mono">{s.value}</span>
                {s.platform && (
                  <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold uppercase text-indigo-700">
                    {s.platform}
                  </span>
                )}
                <button
                  onClick={() => onDeleteAsset(s.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove Asset"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
            {socialHandles.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2">No official handles configured.</div>
            )}
          </div>
        </div>

        {/* Section 3: Official Mobile App Packages */}
        <div className="saas-card rounded-2xl p-5 border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Official Mobile Application IDs</h3>
                <span className="text-[11px] text-slate-400">Authorized store package namespaces</span>
              </div>
            </div>
            <button
              onClick={() => onOpenAddModal('app_package')}
              className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-cyan-600" />
              <span>Add Package</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {mobileApps.map(app => (
              <span
                key={app.id}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-50/60 border border-cyan-200 px-3 py-1.5 text-xs text-cyan-900 font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" />
                <span className="font-mono">{app.value}</span>
                <button
                  onClick={() => onDeleteAsset(app.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove Asset"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
            {mobileApps.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2">No official packages configured.</div>
            )}
          </div>
        </div>

        {/* Section 4: VIP Executives & Monitored Leadership */}
        <div className="saas-card rounded-2xl p-5 border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">VIP Executive Leadership Roster</h3>
                <span className="text-[11px] text-slate-400">Protected leadership personas against BEC</span>
              </div>
            </div>
            <button
              onClick={() => onOpenAddModal('vip_roster')}
              className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-amber-600" />
              <span>Add VIP</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {vips.map(vip => (
              <span
                key={vip.id}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-50/60 border border-amber-200 px-3 py-1.5 text-xs text-amber-900 font-medium"
              >
                <UserCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>{vip.value}</span>
                <button
                  onClick={() => onDeleteAsset(vip.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove Asset"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
            {vips.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2">No VIP personas registered.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
