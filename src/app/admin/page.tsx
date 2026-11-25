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
  Search,
  Plus,
} from 'lucide-react';
import {
  CustomCreationRequest,
  DecorEnquiry,
  ProductCategory,
  ProductItem,
  RequestStatus,
} from '@/types/wasteworth';
import { WasteWorthWordmark } from '@/components/WasteWorthEmblem';

const STATUS_OPTIONS: RequestStatus[] = [
  'NEW',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'IN_PRODUCTION',
  'COMPLETED',
];

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Keychains',
  'Earrings',
  'Rings',
  'Bangles',
  'Vases',
];

function StatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    NEW: 'bg-teal-deep text-ivory border-teal-deep',
    UNDER_REVIEW: 'bg-gold/25 text-gold-dark border-gold',
    ACCEPTED: 'bg-emerald-900/15 text-emerald-900 border-emerald-700/40',
    REJECTED: 'bg-red-900/10 text-red-900 border-red-700/30',
    IN_PRODUCTION: 'bg-teal-mid/20 text-teal-deep border-teal-mid',
    COMPLETED: 'bg-teal-abyss text-gold-light border-gold',
  };
  return (
    <span
      className={`px-2.5 py-1 border font-mono text-[10px] uppercase tracking-[0.16em] ${
        styles[status] || styles.NEW
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [tab, setTab] = useState<'requests' | 'decor' | 'products'>('requests');
  const [searchRef, setSearchRef] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [materialFilter, setMaterialFilter] = useState<string>('All');

  const [requests, setRequests] = useState<CustomCreationRequest[]>([]);
  const [decorEnquiries, setDecorEnquiries] = useState<DecorEnquiry[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [backendMode, setBackendMode] = useState<string>('supabase');
  const [loadingData, setLoadingData] = useState(false);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [selectedDecorId, setSelectedDecorId] = useState<string | null>(null);

  // Request edit fields
  const [editStatus, setEditStatus] = useState<RequestStatus>('NEW');
  const [editNotes, setEditNotes] = useState('');
  const [editEstimatedPrice, setEditEstimatedPrice] = useState('');
  const [editFinalPrice, setEditFinalPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // New Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<ProductCategory>('Keychains');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMat, setNewProdMat] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImg, setNewProdImg] = useState('/images/real/product-keychain.jpg');

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [reqRes, decRes, prodRes] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/decor-enquiries'),
        fetch('/api/products?all=1'),
      ]);
      if (reqRes.ok) {
        const d = await reqRes.json();
        setRequests(d.requests || []);
        if (d.backendMode) setBackendMode(d.backendMode);
      }
      if (decRes.ok) {
        const d = await decRes.json();
        setDecorEnquiries(d.enquiries || []);
      }
      if (prodRes.ok) {
        const d = await prodRes.json();
        setProducts(d.products || []);
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
    setProducts([]);
  };

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || null;
  const activeDecor =
    decorEnquiries.find((d) => d.id === selectedDecorId) || null;

  const selectRequestItem = (item: CustomCreationRequest) => {
    setSelectedRequestId(item.id);
    setEditStatus(item.status);
    setEditNotes(item.adminNotes || '');
    setEditEstimatedPrice(
      item.estimatedPrice !== null && item.estimatedPrice !== undefined
        ? String(item.estimatedPrice)
        : ''
    );
    setEditFinalPrice(
      item.finalQuotedPrice !== null && item.finalQuotedPrice !== undefined
        ? String(item.finalQuotedPrice)
        : ''
    );
    setSaveMessage(null);
  };

  const selectDecorItem = (item: DecorEnquiry) => {
    setSelectedDecorId(item.id);
    setEditStatus(item.status);
    setEditNotes(item.adminNotes || '');
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
            adminNotes: editNotes,
            estimatedPrice: editEstimatedPrice || null,
            finalQuotedPrice: editFinalPrice || null,
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
            adminNotes: editNotes,
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdDesc.trim() || !newProdMat.trim()) return;
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newProdName,
        category: newProdCat,
        shortDescription: newProdDesc,
        materialUsed: newProdMat,
        indicativePrice: newProdPrice || 'Request a quote',
        image: newProdImg,
        isActive: true,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts((prev) => [...prev, data.product]);
      setNewProdName('');
      setNewProdDesc('');
      setNewProdMat('');
      setNewProdPrice('');
    }
  };

  const toggleProductActive = async (prod: ProductItem) => {
    const res = await fetch(`/api/products/${prod.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !prod.isActive }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? data.product : p))
      );
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
              Customer enquiries and uploaded waste photos are private. Enter
              your studio passcode to continue.
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
            <Link
              href="/"
              className="hover:text-teal-deep inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Website
            </Link>
            <span className="font-mono text-[10px]">
              Default: WASTEWORTH2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Metrics
  const totalEnquiries = requests.length + decorEnquiries.length;
  const newCount =
    requests.filter((r) => r.status === 'NEW').length +
    decorEnquiries.filter((d) => d.status === 'NEW').length;
  const underReviewCount =
    requests.filter((r) => r.status === 'UNDER_REVIEW').length +
    decorEnquiries.filter((d) => d.status === 'UNDER_REVIEW').length;
  const acceptedCount =
    requests.filter((r) => r.status === 'ACCEPTED').length +
    decorEnquiries.filter((d) => d.status === 'ACCEPTED').length;
  const completedCount =
    requests.filter((r) => r.status === 'COMPLETED').length +
    decorEnquiries.filter((d) => d.status === 'COMPLETED').length;

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && r.productType !== categoryFilter)
      return false;
    if (
      materialFilter !== 'All' &&
      !r.materials.some((m) =>
        m.toLowerCase().includes(materialFilter.toLowerCase())
      )
    )
      return false;
    if (
      searchRef.trim() &&
      !r.referenceNumber.toLowerCase().includes(searchRef.trim().toLowerCase())
    )
      return false;
    return true;
  });

  const filteredDecor = decorEnquiries.filter((d) => {
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (
      searchRef.trim() &&
      !d.referenceNumber.toLowerCase().includes(searchRef.trim().toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-gold/25 bg-teal-abyss text-ivory px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <WasteWorthWordmark dark />
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-gold-light border-l border-ivory/20 pl-5">
            Backend:{' '}
            {backendMode === 'supabase'
              ? 'Supabase PostgreSQL + Private Storage'
              : `Local Fallback (${backendMode})`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 border border-ivory/25 px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-ivory hover:border-gold"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          <Link
            href="/"
            className="border border-ivory/25 px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-ivory hover:border-gold"
          >
            Public Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-gold text-teal-abyss px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-ivory"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 lg:px-10 py-8 space-y-8">
        {/* Dashboard Overview KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Enquiries', value: totalEnquiries },
            { label: 'New', value: newCount },
            { label: 'Under Review', value: underReviewCount },
            { label: 'Accepted', value: acceptedCount },
            { label: 'Completed', value: completedCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-gold/30 bg-cream p-4 space-y-1"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate">
                {stat.label}
              </p>
              <p className="font-serif text-3xl text-teal-abyss">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs & Search/Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gold/25 pb-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab('requests')}
              className={`px-4 py-2.5 border text-xs uppercase tracking-[0.18em] ${
                tab === 'requests'
                  ? 'bg-teal-deep text-ivory border-teal-deep'
                  : 'bg-cream text-teal-deep border-gold/35'
              }`}
            >
              Customizations ({requests.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('decor')}
              className={`px-4 py-2.5 border text-xs uppercase tracking-[0.18em] ${
                tab === 'decor'
                  ? 'bg-teal-deep text-ivory border-teal-deep'
                  : 'bg-cream text-teal-deep border-gold/35'
              }`}
            >
              Décor Enquiries ({decorEnquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('products')}
              className={`px-4 py-2.5 border text-xs uppercase tracking-[0.18em] ${
                tab === 'products'
                  ? 'bg-teal-deep text-ivory border-teal-deep'
                  : 'bg-cream text-teal-deep border-gold/35'
              }`}
            >
              Products ({products.length})
            </button>
          </div>

          {tab !== 'products' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="Search reference..."
                  className="border border-gold/40 bg-cream pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-teal-deep"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="border border-gold/40 bg-cream px-3 py-2 text-xs"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {tab === 'requests' && (
                <>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter by product category"
                    className="border border-gold/40 bg-cream px-3 py-2 text-xs"
                  >
                    <option value="All">All Products</option>
                    <option value="Keychain">Keychain</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Ring">Ring</option>
                    <option value="Bangles">Bangles</option>
                    <option value="Planter">Planter / Vase</option>
                  </select>

                  <select
                    value={materialFilter}
                    onChange={(e) => setMaterialFilter(e.target.value)}
                    aria-label="Filter by material"
                    className="border border-gold/40 bg-cream px-3 py-2 text-xs"
                  >
                    <option value="All">All Materials</option>
                    <option value="Plastic bottles">Plastic Bottles</option>
                    <option value="Plastic containers">Containers</option>
                    <option value="Aluminium">Aluminium Cans</option>
                  </select>
                </>
              )}
            </div>
          )}
        </div>

        {/* PRODUCT MANAGEMENT TAB */}
        {tab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="border border-gold/30 bg-cream p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-dark">
                        {prod.category}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 border ${
                          prod.isActive
                            ? 'bg-emerald-900/10 text-emerald-900 border-emerald-700/30'
                            : 'bg-slate/10 text-slate border-slate/30'
                        }`}
                      >
                        {prod.isActive ? 'Published' : 'Unpublished'}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-teal-abyss">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate">
                      {prod.indicativePrice} · {prod.materialUsed}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleProductActive(prod)}
                    className="border border-teal-deep px-4 py-2 text-xs uppercase tracking-[0.16em] text-teal-deep hover:bg-teal-deep hover:text-ivory shrink-0"
                  >
                    {prod.isActive ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleCreateProduct}
              className="lg:col-span-5 border border-gold/35 bg-cream p-6 space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-gold/25 pb-3">
                <Plus className="w-4 h-4 text-gold-dark" />
                <h2 className="font-serif text-2xl text-teal-abyss">
                  Add New Product
                </h2>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1">
                  Category *
                </label>
                <select
                  value={newProdCat}
                  onChange={(e) =>
                    setNewProdCat(e.target.value as ProductCategory)
                  }
                  className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1">
                  Material Used *
                </label>
                <input
                  type="text"
                  required
                  value={newProdMat}
                  onChange={(e) => setNewProdMat(e.target.value)}
                  className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1">
                  Indicative Price
                </label>
                <input
                  type="text"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="From ₹650 (indicative)"
                  className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1">
                  Image Path
                </label>
                <input
                  type="text"
                  value={newProdImg}
                  onChange={(e) => setNewProdImg(e.target.value)}
                  className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-deep text-ivory py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-teal-abyss"
              >
                Create &amp; Publish Product
              </button>
            </form>
          </div>
        ) : (
          /* ENQUIRIES SPLIT VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              {tab === 'requests' ? (
                filteredRequests.length === 0 ? (
                  <div className="border border-gold/30 bg-cream p-8 text-center text-sm text-slate">
                    No customization requests match the current filters.
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
                  No décor enquiries match the current filters.
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
                      <p>{activeRequest.customer.city}</p>
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
                    </div>
                  </div>

                  {/* Signed-URL Private Material Photographs */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark mb-3">
                      Private Material Photos ({activeRequest.uploadedImages.length})
                    </p>
                    {activeRequest.uploadedImages.length === 0 ? (
                      <p className="text-xs text-slate">
                        No material photos attached.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activeRequest.uploadedImages.map((img) => {
                          const src = img.signedUrl || img.dataUrl;
                          return (
                            <div
                              key={img.id}
                              className="border border-gold/30 bg-ivory p-1"
                            >
                              {src ? (
                                <a href={src} target="_blank" rel="noreferrer">
                                  <img
                                    src={src}
                                    alt={img.name}
                                    className="w-full aspect-square object-cover"
                                  />
                                </a>
                              ) : (
                                <div className="aspect-square flex items-center justify-center text-[10px] text-slate p-2 text-center">
                                  {img.storagePath || img.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Status, Pricing & Notes */}
                  <div className="border-t border-gold/25 pt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                          Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(e.target.value as RequestStatus)
                          }
                          className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                          Estimated Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editEstimatedPrice}
                          onChange={(e) => setEditEstimatedPrice(e.target.value)}
                          placeholder="e.g. 750"
                          className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                          Final Quoted Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editFinalPrice}
                          onChange={(e) => setEditFinalPrice(e.target.value)}
                          placeholder="e.g. 900"
                          className="w-full border border-gold/40 bg-ivory px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                        Internal Admin Notes
                      </label>
                      <textarea
                        rows={3}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Material inspection, feasibility, quote notes..."
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
                        <strong>Quantity:</strong>{' '}
                        {activeDecor.approximateQuantity}
                      </p>
                      <p>
                        <strong>Budget:</strong> {activeDecor.budgetRange}
                      </p>
                      <p>
                        <strong>Design:</strong>{' '}
                        {activeDecor.designPreferences ||
                          activeDecor.colourPreferences}
                      </p>
                    </div>
                  </div>

                  {activeDecor.logoSignedUrl && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark mb-2">
                        Uploaded Organization Logo (Signed URL)
                      </p>
                      <img
                        src={activeDecor.logoSignedUrl}
                        alt={activeDecor.logoName || 'Organization logo'}
                        className="h-24 w-auto border border-gold/30 bg-ivory p-2"
                      />
                    </div>
                  )}

                  <div className="border-t border-gold/25 pt-5 space-y-4">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                        Status
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
                      <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                        Internal Admin Notes
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
                  Select an enquiry from the left to inspect details, view
                  private uploaded photos via signed URLs, and update status or
                  pricing.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
