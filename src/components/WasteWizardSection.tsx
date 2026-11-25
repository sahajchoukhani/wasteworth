'use client';

import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  RotateCcw,
} from 'lucide-react';
import { UploadedImageItem } from '@/types/wasteworth';

export interface PreselectedProductTrigger {
  product: string;
  seq: number;
}

interface WasteWizardSectionProps {
  preselected?: PreselectedProductTrigger | null;
}

const MATERIAL_OPTIONS = [
  {
    id: 'Plastic bottles',
    label: 'Plastic Bottles',
    note: 'PET beverage & water bottles (clear, teal, or tinted)',
  },
  {
    id: 'Plastic containers',
    label: 'Plastic Containers',
    note: 'HDPE/PP tubs, lids, cosmetic jars & caps',
  },
  {
    id: 'Plastic packaging',
    label: 'Plastic Packaging',
    note: 'Clean rigid trays, sleeves & colourful wrappers',
  },
  {
    id: 'Aluminium cans',
    label: 'Aluminium Cans',
    note: 'Beverage cans for brushed metallic inlays & cores',
  },
  {
    id: 'Old accessories',
    label: 'Old Accessories',
    note: 'Broken chains, clasps, beads & unworn hardware',
  },
  {
    id: 'Other reusable materials',
    label: 'Other Reusable Materials',
    note: 'Old denim, cotton fabric, or specify below',
  },
];

const PRODUCT_OPTIONS = [
  'Keychain',
  'Earrings',
  'Ring',
  'Bangles',
  'Necklace / pendant',
  'Planter',
  'Decorative item',
  'Nameplate',
  'Wall art',
  'Something else',
];

const COLOUR_SWATCHES = [
  { name: 'Deep Ocean Teal', hex: '#0E4456' },
  { name: 'Champagne Gold', hex: '#C29B52' },
  { name: 'Warm Travertine Ivory', hex: '#EAE2D3' },
  { name: 'Marbled Teal & Gold', hex: '#14586D' },
  { name: 'Abyssal Charcoal', hex: '#111A1E' },
];

const DESIGN_STYLES = [
  'Marbled Atelier',
  'Minimalist Architectural',
  'Leaf-Veined Organic',
  'Raw Terrazzo Speckle',
];

const PATTERNS = ['Organic Vein', 'Fluted Ridge', 'Smooth Satin', 'Hammered Edge'];
const SIZES = ['Petite / Delicate', 'Standard', 'Statement / Bold', 'Custom Fit'];

const STEP_TITLES = [
  'Material',
  'Product',
  'Customize',
  'Upload',
  'Details',
  'Review',
];

export function WasteWizardSection({ preselected }: WasteWizardSectionProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [materials, setMaterials] = useState<string[]>(['Plastic bottles']);
  const [customMaterial, setCustomMaterial] = useState('');

  // Step 2
  const [productType, setProductType] = useState('Keychain');
  const [lastTriggerSeq, setLastTriggerSeq] = useState<number>(0);

  if (preselected && preselected.seq !== lastTriggerSeq) {
    setLastTriggerSeq(preselected.seq);
    if (PRODUCT_OPTIONS.includes(preselected.product)) {
      setProductType(preselected.product);
      setStep(1);
    }
  }

  // Step 3
  const [colourPreference, setColourPreference] = useState('Deep Ocean Teal');
  const [colourHex, setColourHex] = useState('#0E4456');
  const [designStyle, setDesignStyle] = useState('Marbled Atelier');
  const [pattern, setPattern] = useState('Organic Vein');
  const [size, setSize] = useState('Standard');
  const [personalText, setPersonalText] = useState('');
  const [logoPath, setLogoPath] = useState<string | undefined>(undefined);
  const [logoName, setLogoName] = useState<string | undefined>(undefined);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Step 4 — Private storage uploads
  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Step 5
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredContact, setPreferredContact] = useState<
    'WhatsApp' | 'Email' | 'Phone'
  >('WhatsApp');

  // Submission State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [backendMode, setBackendMode] = useState<string>('supabase');

  const toggleMaterial = (mat: string) => {
    setErrorMsg(null);
    setMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleMaterialImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setErrorMsg(null);
    setUploadingFiles(true);

    try {
      const remainingSlots = 6 - uploadedImages.length;
      const batch = files.slice(0, remainingSlots);
      const uploadedItems: UploadedImageItem[] = [];

      for (const file of batch) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          setErrorMsg('Only JPG, PNG, and WEBP images are supported.');
          continue;
        }
        if (file.size > 4 * 1024 * 1024) {
          setErrorMsg(`"${file.name}" exceeds 4 MB.`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'materials');

        const res = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        const previewUrl = URL.createObjectURL(file);
        uploadedItems.push({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: file.size,
          storagePath: data.storagePath,
          dataUrl: previewUrl,
        });
      }

      setUploadedImages((prev) => [...prev, ...uploadedItems]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Image upload failed. Please retry.'
      );
    } finally {
      setUploadingFiles(false);
      e.target.value = '';
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (materials.length === 0 && !customMaterial.trim()) {
        setErrorMsg('Please select at least one material or enter your own.');
        return false;
      }
      if (
        materials.includes('Other reusable materials') &&
        !customMaterial.trim()
      ) {
        setErrorMsg('Please describe your other reusable material.');
        return false;
      }
    }
    if (step === 2 && !productType) {
      setErrorMsg('Please choose what you would like to create.');
      return false;
    }
    if (step === 5) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
      if (phone.trim().length < 7) {
        setErrorMsg('Please enter a valid phone or WhatsApp number.');
        return false;
      }
      if (!city.trim()) {
        setErrorMsg('Please enter your city.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(6, s + 1));
  };

  const prevStep = () => {
    setErrorMsg(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const uploadedImagePaths = uploadedImages
        .map((img) => img.storagePath)
        .filter((p): p is string => Boolean(p));

      const payload = {
        materials,
        customMaterial: customMaterial.trim(),
        productType,
        customization: {
          colourPreference,
          colourHex,
          designStyle,
          pattern,
          size,
          personalText: personalText.trim(),
          logoPath,
          logoName,
          specialInstructions: specialInstructions.trim(),
        },
        uploadedImagePaths,
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          deliveryAddress: deliveryAddress.trim(),
          preferredContact,
        },
      };

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed.');
      }

      setSubmittedRef(data.referenceNumber);
      setBackendMode(data.backendMode || 'supabase');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not submit request. Your entered values are preserved—please retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetWizard = () => {
    setSubmittedRef(null);
    setStep(1);
    setUploadedImages([]);
    setPersonalText('');
    setSpecialInstructions('');
    setErrorMsg(null);
  };

  const materialSummaryText = [...materials, customMaterial.trim()]
    .filter(Boolean)
    .join(', ');

  return (
    <section
      id="create"
      className="py-20 lg:py-28 bg-travertine/55 text-ink border-b border-gold/25"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="max-w-3xl space-y-3 mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold-dark">
            Custom Commission Studio
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-teal-abyss leading-[1.06]">
            YOUR WASTE.{' '}
            <span className="italic text-gold-dark font-normal">
              YOUR DESIGN.
            </span>
          </h2>
          <p className="text-slate text-base leading-relaxed">
            Have something you no longer use? Don&apos;t throw it away. Send it
            to us, and let&apos;s transform it into something uniquely yours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Active Form */}
          <div className="lg:col-span-8 border border-teal-deep/20 bg-cream">
            {!submittedRef && (
              <div className="border-b border-teal-deep/15 px-5 sm:px-8 py-4 bg-ivory flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {STEP_TITLES.map((label, idx) => {
                    const num = idx + 1;
                    const active = step === num;
                    const done = step > num;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          if (num < step) setStep(num);
                        }}
                        disabled={num > step}
                        className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] ${
                          active
                            ? 'text-teal-deep font-semibold'
                            : done
                            ? 'text-gold-dark cursor-pointer'
                            : 'text-slate/55 cursor-not-allowed'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 flex items-center justify-center border font-mono text-[10px] ${
                            active
                              ? 'bg-teal-deep text-ivory border-teal-deep'
                              : done
                              ? 'bg-gold/20 border-gold text-gold-dark'
                              : 'border-teal-deep/20 text-slate/60'
                          }`}
                        >
                          {done ? <Check className="w-3 h-3" /> : `0${num}`}
                        </span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                  Step 0{step} / 06
                </span>
              </div>
            )}

            <div className="p-5 sm:p-8 lg:p-10">
              {submittedRef ? (
                <div className="max-w-xl mx-auto text-center space-y-6 py-4">
                  <div className="w-12 h-12 mx-auto border border-gold bg-teal-deep text-gold-light flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-dark">
                    Creation Request Saved
                  </p>
                  <h3 className="font-serif text-3xl sm:text-4xl text-teal-abyss">
                    Thank you, {fullName}.
                  </h3>
                  <div className="inline-block border border-gold/50 bg-ivory px-6 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
                      Reference Number
                    </p>
                    <p className="font-mono text-xl font-bold text-teal-deep mt-1">
                      {submittedRef}
                    </p>
                  </div>
                  <p className="text-sm text-slate leading-relaxed">
                    Our studio team will review your submitted material photos
                    and preferences for suitability, then reach out via{' '}
                    <strong className="text-teal-deep">{preferredContact}</strong>{' '}
                    with feasibility, pricing, and next steps.
                  </p>
                  {backendMode !== 'supabase' && (
                    <p className="text-xs text-gold-dark">
                      Stored via local studio storage fallback (configure
                      Supabase env vars for PostgreSQL &amp; private bucket).
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={resetWizard}
                    className="border border-teal-deep px-7 py-3 text-xs uppercase tracking-[0.2em] text-teal-deep hover:bg-teal-deep hover:text-ivory transition-colors"
                  >
                    Start Another Request
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-3xl text-teal-abyss">
                          What Material Do You Have?
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          Select one or more discarded materials you&apos;d like
                          to transform.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {MATERIAL_OPTIONS.map((item) => {
                          const selected = materials.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleMaterial(item.id)}
                              className={`text-left p-4 border transition-colors ${
                                selected
                                  ? 'border-teal-deep bg-teal-deep text-ivory'
                                  : 'border-teal-deep/20 bg-ivory hover:border-teal-deep'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-serif text-xl">
                                  {item.label}
                                </span>
                                <span
                                  className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                                    selected
                                      ? 'border-gold bg-gold text-teal-abyss'
                                      : 'border-teal-deep/30'
                                  }`}
                                >
                                  {selected && <Check className="w-3.5 h-3.5" />}
                                </span>
                              </div>
                              <p
                                className={`text-xs mt-1.5 leading-relaxed ${
                                  selected ? 'text-ivory/80' : 'text-slate'
                                }`}
                              >
                                {item.note}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <div>
                        <label
                          htmlFor="customMaterial"
                          className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-2"
                        >
                          Custom Material Description (Optional / If Other)
                        </label>
                        <input
                          id="customMaterial"
                          type="text"
                          value={customMaterial}
                          onChange={(e) => setCustomMaterial(e.target.value)}
                          placeholder="e.g., Old blue denim jeans, cotton fabric scraps, tinted bottles..."
                          className="w-full border border-teal-deep/25 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-3xl text-teal-abyss">
                          What Would You Like To Create?
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {PRODUCT_OPTIONS.map((option) => {
                          const selected = productType === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setProductType(option)}
                              className={`p-4 border text-left transition-colors ${
                                selected
                                  ? 'border-teal-deep bg-teal-deep text-ivory'
                                  : 'border-teal-deep/20 bg-ivory hover:border-teal-deep text-teal-abyss'
                              }`}
                            >
                              <span className="font-serif text-xl block">
                                {option}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-3xl text-teal-abyss">
                          Customize Your {productType}
                        </h3>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-2.5">
                          Colour Preference
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {COLOUR_SWATCHES.map((swatch) => {
                            const active = colourPreference === swatch.name;
                            return (
                              <button
                                key={swatch.name}
                                type="button"
                                onClick={() => {
                                  setColourPreference(swatch.name);
                                  setColourHex(swatch.hex);
                                }}
                                className={`flex items-center gap-2 px-3.5 py-2 border text-xs ${
                                  active
                                    ? 'border-teal-deep bg-travertine font-semibold'
                                    : 'border-teal-deep/20 bg-ivory'
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-teal-deep/30"
                                  style={{ backgroundColor: swatch.hex }}
                                />
                                {swatch.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="designStyle"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            Design Style
                          </label>
                          <select
                            id="designStyle"
                            value={designStyle}
                            onChange={(e) => setDesignStyle(e.target.value)}
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          >
                            {DESIGN_STYLES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="patternSelect"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            Surface Pattern
                          </label>
                          <select
                            id="patternSelect"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          >
                            {PATTERNS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="sizeSelect"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            Size / Scale
                          </label>
                          <select
                            id="sizeSelect"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          >
                            {SIZES.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="personalText"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            Personalization Text / Initials
                          </label>
                          <input
                            id="personalText"
                            type="text"
                            maxLength={24}
                            value={personalText}
                            onChange={(e) => setPersonalText(e.target.value)}
                            placeholder="e.g., S.K. or 2026"
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5">
                          Optional Crest / Logo Upload
                        </span>
                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center gap-2 border border-teal-deep/35 bg-ivory px-4 py-2.5 text-xs uppercase tracking-[0.16em] cursor-pointer hover:bg-travertine">
                            <Upload className="w-3.5 h-3.5" />
                            {logoName ? 'Replace Logo' : 'Upload Logo'}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleLogoUpload}
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
                                aria-label="Remove logo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="specialInstructions"
                          className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                        >
                          Special Instructions
                        </label>
                        <textarea
                          id="specialInstructions"
                          rows={2}
                          value={specialInstructions}
                          onChange={(e) =>
                            setSpecialInstructions(e.target.value)
                          }
                          placeholder="Share ring size, wrist measurement, or story behind your material..."
                          className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-3xl text-teal-abyss">
                          Upload Photos of Your Material
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          Uploaded photos are stored in a private bucket and
                          reviewed only by authorized WasteWorth staff.
                        </p>
                      </div>

                      <label className="flex flex-col items-center justify-center border border-dashed border-teal-deep/40 bg-ivory p-8 text-center cursor-pointer hover:bg-travertine/50 transition-colors">
                        <ImagePlus className="w-7 h-7 text-teal-deep mb-2.5" />
                        <span className="font-serif text-xl text-teal-abyss">
                          {uploadingFiles
                            ? 'Uploading securely...'
                            : 'Select material photographs'}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate mt-1">
                          JPG, PNG, WEBP · Max 4 MB each · Up to 6 photos
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          disabled={uploadingFiles}
                          onChange={handleMaterialImages}
                          className="hidden"
                        />
                      </label>

                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                          {uploadedImages.map((img) => (
                            <div
                              key={img.id}
                              className="relative border border-teal-deep/20 bg-ivory p-1.5"
                            >
                              {img.dataUrl && (
                                <img
                                  src={img.dataUrl}
                                  alt={img.name}
                                  className="w-full aspect-square object-cover"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setUploadedImages((prev) =>
                                    prev.filter((i) => i.id !== img.id)
                                  )
                                }
                                aria-label={`Remove ${img.name}`}
                                className="absolute top-2 right-2 bg-teal-abyss/90 text-ivory p-1.5 hover:bg-gold hover:text-teal-abyss"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5 */}
                  {step === 5 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-serif text-3xl text-teal-abyss">
                          Customer Details
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          Your contact details remain private and are never
                          shared publicly.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="wwFullName"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            Full Name *
                          </label>
                          <input
                            id="wwFullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Aarav Mehta"
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wwEmail"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            Email Address *
                          </label>
                          <input
                            id="wwEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="aarav@example.com"
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wwPhone"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            Phone / WhatsApp *
                          </label>
                          <input
                            id="wwPhone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98XXX XXXXX"
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wwCity"
                            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                          >
                            City *
                          </label>
                          <input
                            id="wwCity"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Bengaluru"
                            className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="wwAddress"
                          className="block font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-1.5"
                        >
                          Address (Optional)
                        </label>
                        <input
                          id="wwAddress"
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Street, apartment, postal code"
                          className="w-full border border-teal-deep/25 bg-ivory px-3.5 py-2.5 text-sm"
                        />
                      </div>

                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-deep mb-2">
                          Preferred Contact Method
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {(['WhatsApp', 'Email', 'Phone'] as const).map(
                            (method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setPreferredContact(method)}
                                className={`px-4 py-2 border text-xs uppercase tracking-[0.16em] ${
                                  preferredContact === method
                                    ? 'bg-teal-deep text-ivory border-teal-deep'
                                    : 'bg-ivory border-teal-deep/25 text-teal-deep'
                                }`}
                              >
                                {method}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6 */}
                  {step === 6 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-serif text-3xl text-teal-abyss">
                          Review &amp; Submit
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          This is a bespoke request—no payment is taken now. Our
                          studio will confirm material feasibility and quote
                          first.
                        </p>
                      </div>

                      <div className="border border-teal-deep/20 bg-ivory p-5 space-y-2 text-sm">
                        <p>
                          <span className="text-slate">Materials:</span>{' '}
                          <strong>{materialSummaryText}</strong>
                        </p>
                        <p>
                          <span className="text-slate">Product:</span>{' '}
                          <strong>{productType}</strong>
                        </p>
                        <p>
                          <span className="text-slate">Customization:</span>{' '}
                          <strong>
                            {colourPreference} · {designStyle} · {pattern} ·{' '}
                            {size}
                          </strong>
                        </p>
                        {personalText && (
                          <p>
                            <span className="text-slate">Text / Initials:</span>{' '}
                            <strong>{personalText}</strong>
                          </p>
                        )}
                        <p>
                          <span className="text-slate">Uploaded Photos:</span>{' '}
                          <strong>{uploadedImages.length} stored</strong>
                        </p>
                        <p>
                          <span className="text-slate">Customer:</span>{' '}
                          <strong>
                            {fullName} ({email}, {phone}, {city})
                          </strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div
                      role="alert"
                      className="flex flex-wrap items-center justify-between gap-3 border border-red-700/35 bg-red-50 px-4 py-3 text-sm text-red-900"
                    >
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errorMsg}
                      </span>
                      {step === 6 && (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] border border-red-800/40 px-3 py-1 hover:bg-red-100"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Retry
                        </button>
                      )}
                    </div>
                  )}

                  <div className="pt-5 border-t border-teal-deep/15 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1 || submitting}
                      className={`inline-flex items-center gap-2 px-5 py-3 border text-xs uppercase tracking-[0.18em] ${
                        step === 1
                          ? 'opacity-40 cursor-not-allowed border-teal-deep/15 text-slate'
                          : 'border-teal-deep/35 text-teal-deep hover:bg-travertine'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    {step < 6 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={uploadingFiles}
                        className="inline-flex items-center gap-2 bg-teal-deep text-ivory px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors disabled:opacity-50"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 bg-gold text-teal-abyss px-7 py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-teal-deep hover:text-ivory transition-colors disabled:opacity-60"
                      >
                        {submitting
                          ? 'Submitting Request...'
                          : 'SUBMIT MY CREATION REQUEST'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Order Sheet Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 border border-teal-deep/20 bg-ivory p-5 sm:p-6 space-y-5">
            <div className="border-b border-teal-deep/15 pb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                Studio Order Sheet
              </span>
              <span className="font-mono text-[10px] text-slate">
                Request-Based
              </span>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-teal-deep/10 pb-2">
                <dt className="text-slate">Materials</dt>
                <dd className="text-right font-medium text-teal-abyss">
                  {materialSummaryText || 'Not selected'}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-teal-deep/10 pb-2">
                <dt className="text-slate">Product</dt>
                <dd className="text-right font-medium text-teal-abyss">
                  {productType}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-teal-deep/10 pb-2">
                <dt className="text-slate">Colour</dt>
                <dd className="text-right font-medium text-teal-abyss">
                  {colourPreference}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-teal-deep/10 pb-2">
                <dt className="text-slate">Style / Pattern</dt>
                <dd className="text-right font-medium text-teal-abyss">
                  {designStyle} · {pattern}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-teal-deep/10 pb-2">
                <dt className="text-slate">Photos</dt>
                <dd className="text-right font-medium text-teal-abyss">
                  {uploadedImages.length} uploaded
                </dd>
              </div>
              {fullName && (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate">Client</dt>
                  <dd className="text-right font-medium text-teal-abyss">
                    {fullName}
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
