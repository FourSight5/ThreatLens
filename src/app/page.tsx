'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import OverviewTab from '@/components/OverviewTab';
import SocialMediaTab from '@/components/SocialMediaTab';
import AppStoreTab from '@/components/AppStoreTab';
import DomainTab from '@/components/DomainTab';
import InvestigationsTab from '@/components/InvestigationsTab';
import BrandProfileTab from '@/components/BrandProfileTab';
import QuickScannerTab from '@/components/QuickScannerTab';
import JudgeScenariosModal from '@/components/JudgeScenariosModal';
import CaseDetailModal from '@/components/CaseDetailModal';
import AddAssetModal from '@/components/AddAssetModal';

import {
  LayoutDashboard,
  Share2,
  Smartphone,
  Globe,
  FolderLock,
  ShieldCheck,
  Activity,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');

  // Backend state
  const [brand, setBrand] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Modals state
  const [showScenariosModal, setShowScenariosModal] = useState(false);
  const [showCaseDetailModal, setShowCaseDetailModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [addAssetType, setAddAssetType] = useState('domain');
  const [scannerPreset, setScannerPreset] = useState<any>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [brandRes, findingsRes, invRes] = await Promise.all([
        fetch('/api/brand'),
        fetch('/api/findings'),
        fetch('/api/investigations'),
      ]);

      if (brandRes.ok) {
        const b = await brandRes.json();
        setBrand(b.brand);
      }
      if (findingsRes.ok) {
        const f = await findingsRes.json();
        setFindings(f.findings);
      }
      if (invRes.ok) {
        const i = await invRes.json();
        setInvestigations(i.investigations);
      }
    } catch (err) {
      console.error('Error loading ThreatLens data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update finding status
  const handleUpdateFindingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/findings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Promote finding to investigation case
  const handlePromoteToCase = async (finding: any) => {
    try {
      const title = `Impersonation Incident: ${finding.displayName}`;
      const description = `Promoted from active candidate telemetry. ${finding.description || ''}`;
      const res = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          severity: finding.riskLevel || 'high',
          findingIds: [finding.id],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        await fetchData();
        setSelectedCase(data.investigation);
        setShowCaseDetailModal(true);
      }
    } catch (err) {
      console.error('Failed to promote to case:', err);
    }
  };

  // Reset demo
  const handleResetDemo = async () => {
    if (!confirm('Reset ThreatLens database to factory demo state? This will restore sample threats and baseline assets.')) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        await fetchData();
        setActiveTab('overview');
      }
    } catch (err) {
      console.error('Error resetting demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  // Delete official asset
  const handleDeleteAsset = async (id: string) => {
    try {
      const res = await fetch(`/api/brand?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete asset:', err);
    }
  };

  // Scenario Launcher
  const handleSelectScenario = (scenario: any) => {
    setScannerPreset(scenario);
    setActiveTab('scanner');
  };

  const handleQuickScan = (query: string) => {
    setScannerPreset({
      candidate: query,
      channel: query.startsWith('@') ? 'social' : query.startsWith('com.') ? 'app' : 'domain',
    });
    setActiveTab('scanner');
  };

  const socialCount = findings.filter(f => f.type === 'social_profile').length;
  const appCount = findings.filter(f => f.type === 'app_listing').length;
  const domainCount = findings.filter(f => f.type === 'domain').length;
  const casesCount = investigations.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onOpenScenarios={() => setShowScenariosModal(true)}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Tab Navigation Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
            { id: 'scanner', label: 'URL Threat Scanner', icon: Activity, badge: 'Live' },
            { id: 'social', label: 'Social Media', count: socialCount, icon: Share2, weight: '30%' },
            { id: 'apps', label: 'App Stores', count: appCount, icon: Smartphone, weight: '30%' },
            { id: 'domains', label: 'Domain Defense', count: domainCount, icon: Globe },
            { id: 'cases', label: 'SOC Investigations', count: casesCount, icon: FolderLock },
            { id: 'brand', label: 'Brand Baseline', count: brand?.officialAssets?.length || 0, icon: ShieldCheck, weight: '15%' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {tab.count !== undefined && (
                  <span
                    className={`rounded-md px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-indigo-700/80 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}

                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}

                {tab.weight && (
                  <span className={`hidden xl:inline text-[9px] font-mono px-1 rounded ${
                    isActive ? 'bg-indigo-700 text-indigo-100' : 'text-indigo-600 bg-indigo-50'
                  }`}>
                    {tab.weight}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-ping" />
              <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-xs text-slate-500 font-mono tracking-wider uppercase font-semibold">
              Connecting ThreatLens Security Telemetry Feeds...
            </p>
          </div>
        )}

        {/* Active Tab View */}
        {!loading && (
          <div>
            {activeTab === 'overview' && (
              <OverviewTab
                findings={findings}
                officialAssetsCount={brand?.officialAssets?.length || 0}
                onNavigateTab={tab => setActiveTab(tab)}
                onSelectFinding={f => {
                  if (f.type === 'social_profile') setActiveTab('social');
                  else if (f.type === 'app_listing') setActiveTab('apps');
                  else setActiveTab('domains');
                }}
                onQuickScan={handleQuickScan}
              />
            )}

            {activeTab === 'scanner' && (
              <QuickScannerTab
                onScanComplete={fetchData}
                presetCandidate={scannerPreset}
              />
            )}

            {activeTab === 'social' && (
              <SocialMediaTab
                findings={findings}
                onUpdateStatus={handleUpdateFindingStatus}
                onPromoteToCase={handlePromoteToCase}
                onSelectFinding={() => {}}
              />
            )}

            {activeTab === 'apps' && (
              <AppStoreTab
                findings={findings}
                onUpdateStatus={handleUpdateFindingStatus}
                onPromoteToCase={handlePromoteToCase}
                onSelectFinding={() => {}}
              />
            )}

            {activeTab === 'domains' && (
              <DomainTab
                findings={findings}
                onPromoteToCase={handlePromoteToCase}
                onSelectFinding={() => {}}
              />
            )}

            {activeTab === 'cases' && (
              <InvestigationsTab
                investigations={investigations}
                onOpenCase={inv => {
                  setSelectedCase(inv);
                  setShowCaseDetailModal(true);
                }}
                onCreateCase={() => {
                  if (findings.length > 0) {
                    handlePromoteToCase(findings[0]);
                  }
                }}
              />
            )}

            {activeTab === 'brand' && (
              <BrandProfileTab
                brand={brand}
                onOpenAddModal={type => {
                  setAddAssetType(type);
                  setShowAddAssetModal(true);
                }}
                onDeleteAsset={handleDeleteAsset}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ThreatLens AI</span>
            <span>&bull;</span>
            <span>Modern Digital Risk Protection & Threat Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span>Deterministic Heuristic Rules</span>
            <span>&bull;</span>
            <span>Offline Audit Compliant</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-bold">Zero False Positive Baseline</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JudgeScenariosModal
        isOpen={showScenariosModal}
        onClose={() => setShowScenariosModal(false)}
        onSelectScenario={handleSelectScenario}
      />

      <CaseDetailModal
        investigation={selectedCase}
        isOpen={showCaseDetailModal}
        onClose={() => {
          setShowCaseDetailModal(false);
          setSelectedCase(null);
        }}
        onRefresh={() => {
          fetchData();
          if (selectedCase) {
            fetch(`/api/investigations/${selectedCase.id}`)
              .then(r => r.json())
              .then(d => setSelectedCase(d.investigation))
              .catch(() => {});
          }
        }}
      />

      <AddAssetModal
        isOpen={showAddAssetModal}
        initialType={addAssetType}
        onClose={() => setShowAddAssetModal(false)}
        onAssetAdded={fetchData}
      />
    </div>
  );
}
