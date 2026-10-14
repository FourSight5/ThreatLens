'use client';

import React, { useState } from 'react';
import { X, Plus, ShieldCheck } from 'lucide-react';

interface AddAssetModalProps {
  isOpen: boolean;
  initialType?: string;
  onClose: () => void;
  onAssetAdded: () => void;
}

export default function AddAssetModal({
  isOpen,
  initialType = 'domain',
  onClose,
  onAssetAdded,
}: AddAssetModalProps) {
  const [type, setType] = useState(initialType);
  const [platform, setPlatform] = useState('x');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          platform: type === 'social_handle' || type === 'app_package' ? platform : null,
          value: value.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add asset');

      setValue('');
      onAssetAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error adding asset to baseline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="saas-card w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Add Official Brand Asset</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Asset Category</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
            >
              <option value="domain">Official Corporate Domain</option>
              <option value="social_handle">Verified Social Media Handle</option>
              <option value="app_package">Official Mobile App Package ID</option>
              <option value="vip_roster">VIP Executive Leadership Persona</option>
            </select>
          </div>

          {(type === 'social_handle' || type === 'app_package') && (
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Platform / Store</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                {type === 'social_handle' ? (
                  <>
                    <option value="x">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="telegram">Telegram</option>
                    <option value="youtube">YouTube</option>
                  </>
                ) : (
                  <>
                    <option value="google_play">Google Play Store</option>
                    <option value="app_store">Apple App Store</option>
                  </>
                )}
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              {type === 'domain'
                ? 'Domain Name (e.g. corp.threatlens.io)'
                : type === 'social_handle'
                ? 'Handle (e.g. @threatlens_support_real)'
                : type === 'app_package'
                ? 'Package Bundle ID (e.g. com.threatlens.guard.ios)'
                : 'Executive Full Name & Title (e.g. Elena Rostova - CFO)'}
            </label>
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Enter verified asset..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono shadow-2xs"
              required
            />
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-[11px] text-emerald-800 leading-relaxed font-medium">
            🛡️ <strong>Exclusion Safeguard:</strong> Once registered, any monitored target matching this value will immediately bypass threat scoring with guaranteed 0 risk.
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !value.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{loading ? 'Adding...' : 'Add to Baseline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
