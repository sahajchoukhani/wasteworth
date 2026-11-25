'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  LogOut,
  ArrowLeft,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  CustomCreationRequest,
  DecorEnquiry,
  RequestStatus,
} from '@/types/wasteworth';
import { WasteWorthWordmark } from '@/components/WasteWorthEmblem';

const STATUS_OPTIONS: RequestStatus[] = [
  'New',
  'Under Review',
  'Accepted',
  'Rejected',
  'Completed',
];

function StatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    New: 'bg-teal-deep text-ivory border-teal-deep',
    'Under Review': 'bg-gold/25 text-gold-dark border-gold',
    Accepted: 'bg-emerald-900/15 text-emerald-900 border-emerald-700/40',
    Rejected: 'bg-red-900/10 text-red-900 border-red-700/30',
    Completed: 'bg-teal-abyss text-gold-light border-gold',
  };
  return (
    <span
      className={`px-2.5 py-1 border font-mono text-[10px] uppercase tracking-[0.18em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [tab, setTab] = useState<'requests' | 'decor'>('requests');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [requests, setRequests] = useState<CustomCreationRequest[]>([]);
  const [decorEnquiries, setDecorEnquiries] = useState<DecorEnquiry[]>([]);
  const [storageMode, setStorageMode] = useState<string>('local-file');
  const [loadingData, setLoadingData] = useState(false);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [selectedDecorId, setSelectedDecorId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<RequestStatus>('New');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [reqRes, decRes] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/decor-enquiries'),
      ]);
      if (reqRes.ok) {
        const d = await reqRes.json();
        setRequests(d.requests || []);
        if (d.storageMode) setStorageMode(d.storageMode);
      }
      if (decRes.ok) {
        const d = await decRes.json();
        setDecorEnquiries(d.enquiries || []);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => r.json())
      .then((d) => {
        setAuthenticated(Boolean(d.authenticated));
        if (d.authenticated) fetchData();
      })
      .catch(() => setAuthenticated(false));
  }, [fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (!res.ok) {
      setAuthError('Invalid studio passcode.');
      return;
    }
    setAuthenticated(true);
    setPasscode('');
    fetchData();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setRequests([]);
    setDecorEnquiries([]);
  };

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || null;
  const activeDecor =
    decorEnquiries.find((d) => d.id === selectedDecorId) || null;

  const selectRequestItem = (item: CustomCreationRequest) => {
    setSelectedRequestId(item.id);
    setEditStatus(item.status);
    setEditNotes(item.internalNotes || '');
    setSaveMessage(null);
  };

  const selectDecorItem = (item: DecorEnquiry) => {
    setSelectedDecorId(item.id);
    setEditStatus(item.status);
    setEditNotes(item.internalNotes || '');
    setSaveMessage(null);
  };

  const handleSaveUpdate = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      if (tab === 'requests' && activeRequest) {
        const res = await fetch(`/api/requests/${activeRequest.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: editStatus,
            internalNotes: editNotes,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setRequests((prev) =>
            prev.map((r) => (r.id === activeRequest.id ? data.request : r))
          );
          setSaveMessage('Request updated.');
        }
      } else if (tab === 'decor' && activeDecor) {
        const res = await fetch(`/api/decor-enquiries/${activeDecor.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: editStatus,
            internalNotes: editNotes,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setDecorEnquiries((prev) =>
            prev.map((d) => (d.id === activeDecor.id ? data.enquiry : d))
          );
          setSaveMessage('Enquiry updated.');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center font-mono text-xs uppercase tracking-[0.24em] text-teal-deep">
        Verifying Studio Session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md border border-gold/40 bg-cream p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <WasteWorthWordmark />
            <Lock className="w-4 h-4 text-gold-dark" />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-dark">
              Private Studio Portal
            </p>
            <h1 className="font-serif text-3xl text-teal-abyss mt-1">
              WasteWorth Admin
            </h1>
            <p className="text-sm text-slate mt-2">
              Customer submissions and uploaded material photos are private.
              Enter your studio passcode to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="studioPasscode"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-2"
              >
                Studio Passcode
              </label>
              <input
                id="studioPasscode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-red-800 bg-red-50 border border-red-200 px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-deep text-ivory py-3.5 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors"
            >
              Unlock Studio Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-gold/25 flex items-center justify-between text-xs text-slate">
            <Link href="/" className="hover:text-teal-deep inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Website
            </Link>
            <span className="font-mono text-[10px]">
              Demo Pass: WASTEWORTH2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  const filteredRequests =
    statusFilter === 'All'
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const filteredDecor =
    statusFilter === 'All'
      ? decorEnquiries
      : decorEnquiries.filter((d) => d.status === statusFilter);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-gold/30 bg-cream px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <WasteWorthWordmark />
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.24em] text-gold-dark border-l border-gold/35 pl-5">
            Studio Admin · {storageMode === 'tmp-ephemeral' ? 'Ephemeral Demo Store' : 'Persistent Local Store'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 border border-gold/40 bg-ivory px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-teal-deep hover:bg-travertine"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/"
            className="border border-gold/40 bg-ivory px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-teal-deep hover:bg-travertine"
          >
            Public Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-teal-deep text-ivory px-4 py-2 text-[11px] uppercase tracking-[0.18em] hover:bg-gold hover:text-teal-abyss"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 lg:px-10 py-10 space-y-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab('requests')}
              className={`px-5 py-2.5 border text-xs uppercase tracking-[0.2em] ${
                tab === 'requests'
                  ? 'bg-teal-deep text-ivory border-teal-deep'
                  : 'bg-cream text-teal-deep border-gold/35'
              }`}
            >
              Custom Creations ({requests.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('decor')}
              className={`px-5 py-2.5 border text-xs uppercase tracking-[0.2em] ${
                tab === 'decor'
                  ? 'bg-teal-deep text-ivory border-teal-deep'
                  : 'bg-cream text-teal-deep border-gold/35'
              }`}
            >
              WasteWorth Form ({decorEnquiries.length})
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['All', ...STATUS_OPTIONS].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 border font-mono text-[10px] uppercase tracking-[0.18em] ${
                  statusFilter === st
                    ? 'bg-gold/25 border-gold text-teal-abyss font-semibold'
                    : 'bg-cream border-gold/25 text-slate'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List */}
          <div className="lg:col-span-5 space-y-3">
            {tab === 'requests' ? (
              filteredRequests.length === 0 ? (
                <div className="border border-gold/30 bg-cream p-8 text-center text-sm text-slate">
                  No custom creation requests found for this filter.
                </div>
              ) : (
                filteredRequests.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectRequestItem(item)}
                    className={`w-full text-left p-5 border transition-colors ${
                      selectedRequestId === item.id
                        ? 'border-teal-deep bg-travertine'
                        : 'border-gold/30 bg-cream hover:border-teal-deep/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-teal-deep">
                        {item.referenceNumber}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="font-serif text-xl text-teal-abyss mt-2">
                      {item.productType} — {item.customer.fullName}
                    </p>
                    <p className="text-xs text-slate mt-1">
                      {item.materials.join(', ')} · {item.customer.city}
                    </p>
                  </button>
                ))
              )
            ) : filteredDecor.length === 0 ? (
              <div className="border border-gold/30 bg-cream p-8 text-center text-sm text-slate">
                No WasteWorth Form enquiries found for this filter.
              </div>
            ) : (
              filteredDecor.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectDecorItem(item)}
                  className={`w-full text-left p-5 border transition-colors ${
                    selectedDecorId === item.id
                      ? 'border-teal-deep bg-travertine'
                      : 'border-gold/30 bg-cream hover:border-teal-deep/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-teal-deep">
                      {item.referenceNumber}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="font-serif text-xl text-teal-abyss mt-2">
                    {item.organizationName}
                  </p>
                  <p className="text-xs text-slate mt-1">
                    {item.productType} · Qty: {item.approximateQuantity}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Detail Inspector */}
          <div className="lg:col-span-7 border border-gold/35 bg-cream p-6 sm:p-8">
            {tab === 'requests' && activeRequest ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/25 pb-4">
                  <div>
                    <p className="font-mono text-xs text-gold-dark">
                      {activeRequest.referenceNumber}
                    </p>
                    <h2 className="font-serif text-3xl text-teal-abyss">
                      {activeRequest.productType} for{' '}
                      {activeRequest.customer.fullName}
                    </h2>
                  </div>
                  <StatusBadge status={activeRequest.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                      Customer Contact
                    </p>
                    <p className="mt-1">{activeRequest.customer.email}</p>
                    <p>{activeRequest.customer.phone}</p>
                    <p>
                      {activeRequest.customer.city} (via{' '}
                      {activeRequest.customer.preferredContact})
                    </p>
                    {activeRequest.customer.deliveryAddress && (
                      <p className="text-slate mt-1">
                        {activeRequest.customer.deliveryAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                      Material &amp; Customization
                    </p>
                    <p className="mt-1">
                      <strong>Materials:</strong>{' '}
                      {[
                        ...activeRequest.materials,
                        activeRequest.customMaterial,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    <p>
                      <strong>Colour:</strong>{' '}
                      {activeRequest.customization.colourPreference}
                    </p>
                    <p>
                      <strong>Style / Pattern:</strong>{' '}
                      {activeRequest.customization.designStyle} ·{' '}
                      {activeRequest.customization.pattern}
                    </p>
                    <p>
                      <strong>Size:</strong> {activeRequest.customization.size}
                    </p>
                    {activeRequest.customization.personalText && (
                      <p>
                        <strong>Text:</strong>{' '}
                        {activeRequest.customization.personalText}
                      </p>
                    )}
                    {activeRequest.customization.specialInstructions && (
                      <p className="text-slate mt-1">
                        {activeRequest.customization.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Uploaded Images */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark mb-3">
                    Uploaded Material Photos ({activeRequest.uploadedImages.length})
                  </p>
                  {activeRequest.uploadedImages.length === 0 ? (
                    <p className="text-xs text-slate">
                      No material photos attached.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeRequest.uploadedImages.map((img) => (
                        <a
                          key={img.id}
                          href={img.dataUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-gold/30 bg-ivory p-1 block"
                        >
                          <img
                            src={img.dataUrl}
                            alt={img.name}
                            className="w-full aspect-square object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status & Notes Editor */}
                <div className="border-t border-gold/25 pt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5">
                        Update Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as RequestStatus)
                        }
                        className="w-full border border-gold/40 bg-ivory px-3.5 py-2.5 text-sm"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5">
                      Internal Studio Notes
                    </label>
                    <textarea
                      rows={3}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Feasibility notes, quote sent, material inspection..."
                      className="w-full border border-gold/40 bg-ivory px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleSaveUpdate}
                      disabled={saving}
                      className="inline-flex items-center gap-2 bg-teal-deep text-ivory px-6 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-teal-abyss"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? 'Saving...' : 'Save Studio Update'}
                    </button>
                    {saveMessage && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : tab === 'decor' && activeDecor ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/25 pb-4">
                  <div>
                    <p className="font-mono text-xs text-gold-dark">
                      {activeDecor.referenceNumber}
                    </p>
                    <h2 className="font-serif text-3xl text-teal-abyss">
                      {activeDecor.organizationName}
                    </h2>
                  </div>
                  <StatusBadge status={activeDecor.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                      Contact
                    </p>
                    <p className="mt-1">{activeDecor.contactName}</p>
                    <p>{activeDecor.email}</p>
                    <p>{activeDecor.phone}</p>
                    <p>{activeDecor.city}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                      Commission Specs
                    </p>
                    <p className="mt-1">
                      <strong>Product:</strong> {activeDecor.productType}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {activeDecor.approximateQuantity}
                    </p>
                    <p>
                      <strong>Budget:</strong> {activeDecor.budgetRange}
                    </p>
                    <p>
                      <strong>Colours:</strong> {activeDecor.colourPreferences}
                    </p>
                  </div>
                </div>

                {activeDecor.designPreferences && (
                  <p className="text-sm text-slate">
                    <strong>Design Notes:</strong> {activeDecor.designPreferences}
                  </p>
                )}

                {activeDecor.logoDataUrl && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark mb-2">
                      Uploaded Organization Logo
                    </p>
                    <img
                      src={activeDecor.logoDataUrl}
                      alt={activeDecor.logoName || 'Organization logo'}
                      className="h-24 w-auto border border-gold/30 bg-ivory p-2"
                    />
                  </div>
                )}

                <div className="border-t border-gold/25 pt-5 space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5">
                      Update Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value as RequestStatus)
                      }
                      className="w-full max-w-xs border border-gold/40 bg-ivory px-3.5 py-2.5 text-sm"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5">
                      Internal Studio Notes
                    </label>
                    <textarea
                      rows={3}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full border border-gold/40 bg-ivory px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleSaveUpdate}
                      disabled={saving}
                      className="inline-flex items-center gap-2 bg-teal-deep text-ivory px-6 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-teal-abyss"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? 'Saving...' : 'Save Studio Update'}
                    </button>
                    {saveMessage && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate text-sm">
                Select a submission from the left to inspect customer details,
                uploaded images, and update studio status.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
