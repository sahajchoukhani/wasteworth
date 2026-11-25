'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

const FORM_PRODUCTS = [
  'Recycled-Material Nameplates',
  'Upcycled Plastic Planters',
  'Small Decorative Vases',
  'Recycled-Plastic Trophies',
  'Custom Wall Installations',
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
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [logoPath, setLogoPath] = useState<string | undefined>(undefined);
  const [logoName, setLogoName] = useState<string | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Logo must be JPG, PNG, or WEBP.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Logo file must be under 4 MB.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'logos');
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Logo upload failed.');
      setLogoPath(data.storagePath);
      setLogoName(file.name);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Logo upload failed.');
    } finally {
      e.target.value = '';
    }
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
          logoPath,
          logoName,
          colourPreferences,
          designPreferences,
          budgetRange,
          specialInstructions,
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
      className="py-20 lg:py-28 bg-teal-abyss text-ivory border-b border-gold/25"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold-light">
                Institutional &amp; Décor Studio
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-ivory leading-[1.06]">
                WasteWorth Form —{' '}
                <span className="italic text-gold-light font-normal">
                  Custom Décor
                </span>
              </h2>
              <p className="text-ivory/75 leading-relaxed">
                For universities, studios, and events seeking recycled-material
                nameplates, planters, vases, and custom installations.
              </p>
            </div>

            <div className="relative aspect-[4/3] border border-gold/30 overflow-hidden">
              <Image
                src="/images/real/product-vase.jpg"
                alt="Reclaimed vessel and planter crafted from recycled materials"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 border border-gold/35 bg-ivory text-ink p-6 sm:p-10">
            {referenceNumber ? (
              <div className="py-10 text-center space-y-5">
                <div className="w-12 h-12 mx-auto bg-teal-deep text-gold-light flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-dark">
                  Décor Enquiry Saved
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
                  Our studio desk will review your quantity, logo, and design
                  preferences and respond with a tailored quote.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceNumber(null);
                    setOrganizationName('');
                    setApproximateQuantity('');
                    setDesignPreferences('');
                    setSpecialInstructions('');
                  }}
                  className="border border-teal-deep px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-teal-deep hover:bg-teal-deep hover:text-ivory"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-gold/25 pb-4">
                  <h3 className="font-serif text-3xl text-teal-abyss">
                    Request a Custom Décor Quote
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="orgName"
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      Organization / Institution *
                    </label>
                    <input
                      id="orgName"
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="National Institute of Design"
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="formProductType"
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      Product Type *
                    </label>
                    <select
                      id="formProductType"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
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
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      Quantity *
                    </label>
                    <input
                      id="approxQty"
                      type="text"
                      value={approximateQuantity}
                      onChange={(e) => setApproximateQuantity(e.target.value)}
                      placeholder="e.g., 25 units"
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="budgetRange"
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      Budget Range (Optional)
                    </label>
                    <input
                      id="budgetRange"
                      type="text"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      placeholder="e.g., ₹25,000 – ₹60,000"
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="designPrefForm"
                    className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                  >
                    Design &amp; Colour Preferences
                  </label>
                  <input
                    id="designPrefForm"
                    type="text"
                    value={designPreferences}
                    onChange={(e) => setDesignPreferences(e.target.value)}
                    placeholder={colourPreferences}
                    className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="specialInstForm"
                    className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                  >
                    Special Instructions
                  </label>
                  <textarea
                    id="specialInstForm"
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Dimensions, delivery timeline, engraving notes..."
                    className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                    Logo Upload (Optional, stored privately)
                  </span>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 border border-teal-deep/35 bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] cursor-pointer hover:bg-travertine">
                      <Upload className="w-3.5 h-3.5" />
                      {logoName ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
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
                            setLogoPath(undefined);
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
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      Customer Name *
                    </label>
                    <input
                      id="formContactName"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formEmail"
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      Email *
                    </label>
                    <input
                      id="formEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formPhone"
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      Phone *
                    </label>
                    <input
                      id="formPhone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formCity"
                      className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                    >
                      City
                    </label>
                    <input
                      id="formCity"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-teal-deep/25 bg-cream px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 border border-red-700/30 bg-red-50 px-3.5 py-2.5 text-xs text-red-900"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-deep text-ivory py-4 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors disabled:opacity-60"
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
