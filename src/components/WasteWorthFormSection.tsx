'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

const FORM_PRODUCTS = [
  'Personalized University Nameplates',
  'Recycled-Plastic Trophies & Awards',
  'Architectural Wall Installations',
  'Custom Fluted Planters',
  'Branded Studio Merchandise',
];

export function WasteWorthFormSection() {
  const [organizationName, setOrganizationName] = useState('');
  const [productType, setProductType] = useState(FORM_PRODUCTS[0]);
  const [approximateQuantity, setApproximateQuantity] = useState('');
  const [colourPreferences, setColourPreferences] = useState(
    'Deep Ocean Teal & Champagne Gold'
  );
  const [designPreferences, setDesignPreferences] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);
  const [logoName, setLogoName] = useState<string | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Logo file must be under 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(String(reader.result));
      setLogoName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (
      !organizationName.trim() ||
      !approximateQuantity.trim() ||
      !contactName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setErrorMsg('Please fill in all required organization and contact fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/decor-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName,
          productType,
          approximateQuantity,
          logoDataUrl,
          logoName,
          colourPreferences,
          designPreferences,
          budgetRange,
          contactName,
          email,
          phone,
          city,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setReferenceNumber(data.referenceNumber);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to submit enquiry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="form-decor"
      className="py-24 lg:py-32 ww-marble-panel text-ivory border-b border-gold/25"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Studio Showcase */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border border-gold/40 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold-light">
                <Building2 className="w-3.5 h-3.5" />
                03 // B2B &amp; Institutional Studio
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-ivory leading-[1.06]">
                WASTEWORTH FORM —{' '}
                <span className="italic text-gold-light font-normal">
                  Custom Décor
                </span>
              </h2>
              <p className="text-ivory/75 leading-relaxed">
                Designed for universities, design studios, cultural festivals,
                and conscious institutions seeking custom architectural objects
                crafted from reclaimed polymers.
              </p>
            </div>

            <div className="relative aspect-[4/4.2] border border-gold/35 overflow-hidden bg-teal-abyss">
              <Image
                src="/images/product-decor-form.svg"
                alt="WasteWorth Form custom recycled plastic trophy, planter, and architectural nameplate"
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-ivory/80">
              {FORM_PRODUCTS.map((item) => (
                <div
                  key={item}
                  className="border border-gold/25 bg-teal-abyss/50 px-3.5 py-2.5"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Bulk Enquiry Form */}
          <div className="lg:col-span-7 border border-gold/35 bg-ivory text-ink p-6 sm:p-10">
            {referenceNumber ? (
              <div className="py-10 text-center space-y-5">
                <div className="w-12 h-12 mx-auto bg-teal-deep text-gold-light flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-dark">
                  WasteWorth Form Enquiry Logged
                </p>
                <h3 className="font-serif text-3xl text-teal-abyss">
                  Thank you, {organizationName}.
                </h3>
                <div className="inline-block border border-gold/45 bg-cream px-5 py-2.5">
                  <span className="font-mono text-xs text-slate block">
                    Reference
                  </span>
                  <span className="font-mono text-lg font-bold text-teal-deep">
                    {referenceNumber}
                  </span>
                </div>
                <p className="text-sm text-slate max-w-md mx-auto leading-relaxed">
                  Our B2B studio desk will review your quantity, logo, and
                  material direction and respond with a tailored proposal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceNumber(null);
                    setOrganizationName('');
                    setApproximateQuantity('');
                    setDesignPreferences('');
                  }}
                  className="border border-teal-deep px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-teal-deep hover:bg-teal-deep hover:text-ivory"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-gold/25 pb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold-dark">
                    Institutional &amp; Bulk Commission
                  </p>
                  <h3 className="font-serif text-3xl text-teal-abyss mt-1">
                    Request a WasteWorth Form Proposal
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="orgName"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      Organization / University *
                    </label>
                    <input
                      id="orgName"
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="National Institute of Design"
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="formProductType"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      Product Type *
                    </label>
                    <select
                      id="formProductType"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    >
                      {FORM_PRODUCTS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="approxQty"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      Approximate Quantity *
                    </label>
                    <input
                      id="approxQty"
                      type="text"
                      value={approximateQuantity}
                      onChange={(e) => setApproximateQuantity(e.target.value)}
                      placeholder="e.g., 25 units"
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="budgetRange"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      Budget Range (Optional)
                    </label>
                    <input
                      id="budgetRange"
                      type="text"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      placeholder="e.g., ₹25,000 – ₹60,000"
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="colourPrefForm"
                    className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                  >
                    Colour &amp; Material Preferences
                  </label>
                  <input
                    id="colourPrefForm"
                    type="text"
                    value={colourPreferences}
                    onChange={(e) => setColourPreferences(e.target.value)}
                    className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                  />
                </div>

                <div>
                  <label
                    htmlFor="designPrefForm"
                    className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                  >
                    Design Notes &amp; Dimensions
                  </label>
                  <textarea
                    id="designPrefForm"
                    rows={2}
                    value={designPreferences}
                    onChange={(e) => setDesignPreferences(e.target.value)}
                    placeholder="Event timeline, mounting requirements, engraving details..."
                    className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5">
                    Institution / Brand Logo (Optional)
                  </span>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 border border-teal-deep/40 bg-cream px-4 py-2 text-xs uppercase tracking-[0.18em] cursor-pointer hover:bg-travertine">
                      <Upload className="w-3.5 h-3.5" />
                      {logoName ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    {logoName && (
                      <span className="inline-flex items-center gap-2 text-xs text-teal-deep">
                        {logoName}
                        <button
                          type="button"
                          onClick={() => {
                            setLogoDataUrl(undefined);
                            setLogoName(undefined);
                          }}
                          aria-label="Remove organization logo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gold/25">
                  <div>
                    <label
                      htmlFor="formContactName"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      Contact Name *
                    </label>
                    <input
                      id="formContactName"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formEmail"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      Official Email *
                    </label>
                    <input
                      id="formEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formPhone"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      Phone *
                    </label>
                    <input
                      id="formPhone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formCity"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep mb-1.5"
                    >
                      City
                    </label>
                    <input
                      id="formCity"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gold/40 bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-deep"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 border border-red-700/30 bg-red-50 px-3.5 py-2.5 text-xs text-red-900">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-deep text-ivory py-4 text-xs uppercase tracking-[0.24em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors disabled:opacity-60"
                >
                  {submitting
                    ? 'Sending Enquiry...'
                    : 'SUBMIT WASTEWORTH FORM ENQUIRY'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
