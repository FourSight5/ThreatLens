'use client';

import React, { useState } from 'react';
import {
  X,
  FolderLock,
  FileCheck2,
  FileText,
  User,
  Clock,
  Hash,
  Send,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface CaseDetailModalProps {
  investigation: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function CaseDetailModal({
  investigation,
  isOpen,
  onClose,
  onRefresh,
}: CaseDetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [status, setStatus] = useState(investigation?.status || 'under_review');
  const [severity, setSeverity] = useState(investigation?.severity || 'high');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!isOpen || !investigation) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/investigations/${investigation.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote.trim() }),
      });
      if (res.ok) {
        setNewNote('');
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setStatus(newStatus);
    setUpdatingStatus(true);
    try {
      await fetch(`/api/investigations/${investigation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateSeverity = async (newSev: string) => {
    setSeverity(newSev);
    try {
      await fetch(`/api/investigations/${investigation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ severity: newSev }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update severity:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="saas-card w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                {investigation.caseNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Case Opened: {new Date(investigation.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{investigation.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Triage Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
              Investigation Status
            </label>
            <select
              value={status}
              onChange={e => handleUpdateStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
            >
              <option value="under_review">Under Active Review</option>
              <option value="confirmed_suspicious">Confirmed Suspicious (Takedown Active)</option>
              <option value="resolved">Resolved / Takedown Complete</option>
              <option value="false_positive">Closed as False Positive</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={e => handleUpdateSeverity(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {investigation.description}
        </p>

        {/* Linked Findings List */}
        {investigation.findings && investigation.findings.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Attached Threat Findings ({investigation.findings.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {investigation.findings.map((f: any) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">
                      {f.displayName}
                    </span>
                    <span className="rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 text-[10px] font-mono font-bold">
                      {f.riskScore} / 100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Vault */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <FileCheck2 className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Evidence Locker & Cryptographic Hashes
            </h3>
          </div>

          <div className="space-y-2">
            {investigation.evidence?.map((ev: any) => (
              <div
                key={ev.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {ev.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 pt-1">{ev.description}</h4>
                  </div>
                  {ev.source && (
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[250px]">
                      Source: {ev.source}
                    </span>
                  )}
                </div>

                {ev.contentHash && (
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2 font-mono text-[11px] text-slate-600 border border-slate-200">
                    <Hash className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">SHA-256: {ev.contentHash}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Analyst Notes Timeline */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <FileText className="h-4 w-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Analyst Case Notes & Triage Actions
            </h3>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {investigation.analystNotes?.map((note: any) => (
              <div
                key={note.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800">
                    {note.author?.name || 'Lead Analyst'}
                  </span>
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>

          {/* Add note composer */}
          <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add investigator note or takedown progress..."
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
            <button
              type="submit"
              disabled={addingNote || !newNote.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Post Note</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
