'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ImagePlus,
} from 'lucide-react';
import { UploadedImageItem } from '@/types/wasteworth';

interface WasteWizardSectionProps {
  preselectedProduct?: string | null;
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
    note: 'Specify your material below for studio review',
  },
];

const PRODUCT_OPTIONS = [
  'Ring',
  'Earrings',
  'Bangles',
  'Keychain',
  'Necklace / pendant',
  'Decorative item',
  'Nameplate',
  'Wall art',
  'Planter',
  'Something else',
];

const COLOUR_SWATCHES = [
  { name: 'Deep Ocean Teal', hex: '#0E4456' },
  { name: 'Champagne Gold', hex: '#C69D52' },
  { name: 'Warm Travertine Ivory', hex: '#E8DEC9' },
  { name: 'Marbled Teal & Gold', hex: '#14586D' },
  { name: 'Abyssal Charcoal', hex: '#141D21' },
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function WasteWizardSection({
  preselectedProduct,
}: WasteWizardSectionProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [materials, setMaterials] = useState<string[]>(['Plastic bottles']);
  const [customMaterial, setCustomMaterial] = useState('');

  // Step 2
  const [productType, setProductType] = useState('Ring');
  const [prevPreselected, setPrevPreselected] = useState<string | null | undefined>(
    preselectedProduct
  );

  if (preselectedProduct !== prevPreselected) {
    setPrevPreselected(preselectedProduct);
    if (preselectedProduct && PRODUCT_OPTIONS.includes(preselectedProduct)) {
      setProductType(preselectedProduct);
    }
  }

  // Step 3
  const [colourPreference, setColourPreference] = useState('Deep Ocean Teal');
  const [colourHex, setColourHex] = useState('#0E4456');
  const [designStyle, setDesignStyle] = useState('Marbled Atelier');
  const [pattern, setPattern] = useState('Organic Vein');
  const [size, setSize] = useState('Standard');
  const [personalText, setPersonalText] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);
  const [logoName, setLogoName] = useState<string | undefined>(undefined);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Step 4
  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([]);

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
  const [storageMode, setStorageMode] = useState<string>('local-file');

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

    const remainingSlots = 6 - uploadedImages.length;
    const batch = files.slice(0, remainingSlots);

    const newItems: UploadedImageItem[] = [];
    for (const file of batch) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files (JPG, PNG, WEBP) are supported.');
        continue;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds 4 MB. Please choose a smaller photo.`);
        continue;
      }
      const dataUrl = await readFileAsDataUrl(file);
      newItems.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        dataUrl,
      });
    }

    setUploadedImages((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Logo file must be under 3 MB.');
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setLogoDataUrl(dataUrl);
    setLogoName(file.name);
    e.target.value = '';
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
          logoDataUrl,
          logoName,
          specialInstructions: specialInstructions.trim(),
        },
        uploadedImages,
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
      setStorageMode(data.storageMode || 'local-file');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not submit request. Please try again.'
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

  return (
    <section
      id="create"
      className="py-24 lg:py-32 bg-ivory border-b border-gold/25"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-dark">
            02 // Custom Commission Studio
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-teal-abyss leading-[1.06]">
            YOUR WASTE.{' '}
            <span className="italic text-gold-dark font-normal">
              YOUR DESIGN.
            </span>
          </h2>
          <p className="text-slate text-base sm:text-lg leading-relaxed">
            Have something you no longer use? Don&apos;t throw it away. Send it
            to us, and let&apos;s transform it into something uniquely yours.
          </p>
        </div>

        {/* Main Studio Frame */}
        <div className="border border-gold/35 bg-cream shadow-[0_20px_60px_rgba(7,34,43,0.06)]">
          {/* Step Progress Bar */}
          {!submittedRef && (
            <div className="border-b border-gold/25 px-6 py-5 bg-travertine/55">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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
                        className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
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
                              : 'border-gold/30 text-slate/60'
                          }`}
                        >
                          {done ? <Check className="w-3 h-3" /> : `0${num}`}
                        </span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                  Step 0{step} / 06
                </span>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-6 sm:p-10 lg:p-12">
            {submittedRef ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto text-center space-y-6 py-6"
              >
                <div className="w-14 h-14 mx-auto border border-gold bg-teal-deep text-gold-light flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-dark">
                  Creation Request Received
                </p>
                <h3 className="font-serif text-4xl text-teal-abyss">
                  Thank you, {fullName}.
                </h3>
                <div className="inline-block border border-gold/45 bg-ivory px-6 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate">
                    Reference Number
                  </p>
                  <p className="font-mono text-xl font-bold text-teal-deep mt-1">
                    {submittedRef}
                  </p>
                </div>
                <p className="text-slate leading-relaxed">
                  Our studio team will inspect your submitted material photos
                  and preferences for suitability, then reach out via{' '}
                  <strong className="text-teal-deep">{preferredContact}</strong>{' '}
                  with feasibility, pricing, and dispatch instructions.
                </p>

                <div className="text-left border border-gold/30 bg-ivory p-6 space-y-2 text-sm">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-dark mb-3">
                    Submission Summary
                  </p>
                  <p>
                    <span className="text-slate">Materials:</span>{' '}
                    <strong className="text-teal-deep">
                      {[...materials, customMaterial].filter(Boolean).join(', ')}
                    </strong>
                  </p>
                  <p>
                    <span className="text-slate">Desired Creation:</span>{' '}
                    <strong className="text-teal-deep">{productType}</strong>
                  </p>
                  <p>
                    <span className="text-slate">Style &amp; Colour:</span>{' '}
                    <strong className="text-teal-deep">
                      {colourPreference} · {designStyle} · {pattern}
                    </strong>
                  </p>
                  <p>
                    <span className="text-slate">Photos Attached:</span>{' '}
                    <strong className="text-teal-deep">
                      {uploadedImages.length} image(s)
                    </strong>
                  </p>
                  {storageMode === 'tmp-ephemeral' && (
                    <p className="text-xs text-gold-dark pt-2">
                      Note: Running in ephemeral demo storage mode on this
                      serverless instance.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={resetWizard}
                  className="border border-teal-deep px-8 py-3 text-xs uppercase tracking-[0.22em] text-teal-deep hover:bg-teal-deep hover:text-ivory transition-colors"
                >
                  Start Another Request
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-dark">
                          Step 01 // Feedstock Selection
                        </p>
                        <h3 className="font-serif text-3xl text-teal-abyss mt-1">
                          What Material Do You Have?
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          Select one or more discarded materials you&apos;d like
                          to transform.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MATERIAL_OPTIONS.map((item) => {
                          const selected = materials.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleMaterial(item.id)}
                              className={`text-left p-5 border transition-all ${
                                selected
                                  ? 'border-teal-deep bg-teal-deep text-ivory'
                                  : 'border-gold/30 bg-ivory hover:border-teal-deep/60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-serif text-xl">
                                  {item.label}
                                </span>
                                <span
                                  className={`w-5 h-5 border flex items-center justify-center ${
                                    selected
                                      ? 'border-gold bg-gold text-teal-abyss'
                                      : 'border-gold/40'
                                  }`}
                                >
                                  {selected && <Check className="w-3.5 h-3.5" />}
                                </span>
                              </div>
                              <p
                                className={`text-xs mt-2 leading-relaxed ${
                                  selected ? 'text-ivory/80' : 'text-slate'
                                }`}
                              >
                                {item.note}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="max-w-xl">
                        <label
                          htmlFor="customMaterial"
                          className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                        >
                          Custom Material Type (Optional / If Other)
                        </label>
                        <input
                          id="customMaterial"
                          type="text"
                          value={customMaterial}
                          onChange={(e) => setCustomMaterial(e.target.value)}
                          placeholder="e.g., Broken terracotta pot, old denim, acrylic offcuts..."
                          className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-dark">
                          Step 02 // Silhouette &amp; Object
                        </p>
                        <h3 className="font-serif text-3xl text-teal-abyss mt-1">
                          What Would You Like To Create?
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                        {PRODUCT_OPTIONS.map((option) => {
                          const selected = productType === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setProductType(option)}
                              className={`p-4 border text-left transition-all ${
                                selected
                                  ? 'border-teal-deep bg-teal-deep text-ivory'
                                  : 'border-gold/30 bg-ivory hover:border-teal-deep/60 text-teal-abyss'
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                      <div className="lg:col-span-7 space-y-6">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-dark">
                            Step 03 // Aesthetic Direction
                          </p>
                          <h3 className="font-serif text-3xl text-teal-abyss mt-1">
                            Customize Your {productType}
                          </h3>
                        </div>

                        {/* Colours */}
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-3">
                            Colour Preference
                          </p>
                          <div className="flex flex-wrap gap-3">
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
                                  className={`flex items-center gap-2.5 px-3.5 py-2 border text-xs transition-all ${
                                    active
                                      ? 'border-teal-deep bg-travertine font-semibold'
                                      : 'border-gold/30 bg-ivory'
                                  }`}
                                >
                                  <span
                                    className="w-4 h-4 rounded-full border border-gold/50"
                                    style={{ backgroundColor: swatch.hex }}
                                  />
                                  {swatch.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Design Style & Pattern */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="designStyle"
                              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                            >
                              Design Style
                            </label>
                            <select
                              id="designStyle"
                              value={designStyle}
                              onChange={(e) => setDesignStyle(e.target.value)}
                              className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
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
                              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                            >
                              Surface Pattern
                            </label>
                            <select
                              id="patternSelect"
                              value={pattern}
                              onChange={(e) => setPattern(e.target.value)}
                              className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                            >
                              {PATTERNS.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Size & Initials */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="sizeSelect"
                              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                            >
                              Size / Scale
                            </label>
                            <select
                              id="sizeSelect"
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                              className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
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
                              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                            >
                              Personal Text / Initials
                            </label>
                            <input
                              id="personalText"
                              type="text"
                              maxLength={24}
                              value={personalText}
                              onChange={(e) => setPersonalText(e.target.value)}
                              placeholder="e.g., S.K. or 2026"
                              className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                            />
                          </div>
                        </div>

                        {/* Optional Logo Upload */}
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2">
                            Optional Crest / Logo Upload
                          </p>
                          <div className="flex items-center gap-4">
                            <label className="inline-flex items-center gap-2 border border-teal-deep/40 bg-ivory px-4 py-2.5 text-xs uppercase tracking-[0.18em] cursor-pointer hover:bg-travertine">
                              <Upload className="w-3.5 h-3.5" />
                              {logoName ? 'Replace Logo' : 'Upload Logo'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                            </label>
                            {logoName && (
                              <div className="flex items-center gap-2 text-xs text-teal-deep">
                                <span className="truncate max-w-[180px]">
                                  {logoName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLogoDataUrl(undefined);
                                    setLogoName(undefined);
                                  }}
                                  aria-label="Remove logo"
                                  className="text-slate hover:text-ink"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="specialInstructions"
                            className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                          >
                            Special Instructions
                          </label>
                          <textarea
                            id="specialInstructions"
                            rows={3}
                            value={specialInstructions}
                            onChange={(e) =>
                              setSpecialInstructions(e.target.value)
                            }
                            placeholder="Share ring size, wrist measurement, or sentimental story behind your material..."
                            className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                          />
                        </div>
                      </div>

                      {/* Live Conceptual Preview */}
                      <div className="lg:col-span-5 border border-gold/35 bg-ivory p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-dark flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Conceptual Studio Preview
                          </span>
                          <span className="font-mono text-[10px] text-slate">
                            {productType}
                          </span>
                        </div>

                        <div className="aspect-square bg-travertine border border-gold/25 flex items-center justify-center relative overflow-hidden p-6">
                          {/* Dynamic SVG Preview */}
                          <svg
                            viewBox="0 0 260 260"
                            className="w-full h-full max-w-[230px]"
                          >
                            <defs>
                              <linearGradient
                                id="previewGrad"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                              >
                                <stop offset="0%" stopColor={colourHex} />
                                <stop
                                  offset="100%"
                                  stopColor="#07222B"
                                />
                              </linearGradient>
                            </defs>

                            {productType === 'Ring' && (
                              <g>
                                <circle
                                  cx="130"
                                  cy="130"
                                  r="74"
                                  fill="url(#previewGrad)"
                                  stroke="#C69D52"
                                  strokeWidth="5"
                                />
                                <circle
                                  cx="130"
                                  cy="130"
                                  r="42"
                                  fill="#EDE5D7"
                                  stroke="#C69D52"
                                  strokeWidth="3"
                                />
                              </g>
                            )}

                            {productType === 'Earrings' && (
                              <g>
                                <path
                                  d="M90 55 C120 95 125 160 90 205 C55 160 60 95 90 55 Z"
                                  fill="url(#previewGrad)"
                                  stroke="#C69D52"
                                  strokeWidth="3.5"
                                />
                                <path
                                  d="M170 70 C200 110 205 175 170 220 C135 175 140 110 170 70 Z"
                                  fill="url(#previewGrad)"
                                  stroke="#C69D52"
                                  strokeWidth="3.5"
                                />
                              </g>
                            )}

                            {productType === 'Bangles' && (
                              <g>
                                <rect
                                  x="45"
                                  y="85"
                                  width="170"
                                  height="90"
                                  rx="44"
                                  fill="url(#previewGrad)"
                                  stroke="#C69D52"
                                  strokeWidth="5"
                                />
                                <ellipse
                                  cx="130"
                                  cy="102"
                                  rx="64"
                                  ry="20"
                                  fill="#EDE5D7"
                                  stroke="#C69D52"
                                  strokeWidth="3"
                                />
                              </g>
                            )}

                            {productType !== 'Ring' &&
                              productType !== 'Earrings' &&
                              productType !== 'Bangles' && (
                                <g>
                                  <path
                                    d="M130 35 C185 80 198 155 130 225 C62 155 75 80 130 35 Z"
                                    fill="url(#previewGrad)"
                                    stroke="#C69D52"
                                    strokeWidth="4"
                                  />
                                </g>
                              )}

                            {/* Pattern overlay */}
                            {pattern === 'Organic Vein' && (
                              <path
                                d="M70 125 Q130 95 190 145"
                                stroke="#E2C37D"
                                strokeWidth="2.5"
                                strokeOpacity="0.65"
                                fill="none"
                              />
                            )}
                            {pattern === 'Fluted Ridge' && (
                              <g stroke="#E2C37D" strokeOpacity="0.35">
                                <line x1="95" y1="75" x2="95" y2="185" />
                                <line x1="130" y1="65" x2="130" y2="195" />
                                <line x1="165" y1="75" x2="165" y2="185" />
                              </g>
                            )}

                            {personalText && (
                              <text
                                x="130"
                                y="136"
                                textAnchor="middle"
                                fill="#F6F1E7"
                                fontSize="14"
                                fontFamily="serif"
                                letterSpacing="3"
                              >
                                {personalText}
                              </text>
                            )}
                          </svg>

                          {logoDataUrl && (
                            <img
                              src={logoDataUrl}
                              alt="Uploaded logo preview"
                              className="w-10 h-10 object-contain absolute bottom-3 right-3 border border-gold/40 bg-ivory p-1"
                            />
                          )}
                        </div>

                        <p className="text-xs text-slate leading-relaxed">
                          <strong>Honest Atelier Note:</strong> This interactive
                          mockup visualizes your colour and silhouette
                          direction. Every finished handmade piece carries
                          natural, unrepeatable marbling unique to your rescued
                          material.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-dark">
                          Step 04 // Material Inspection
                        </p>
                        <h3 className="font-serif text-3xl text-teal-abyss mt-1">
                          Upload Photos of Your Material
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          Upload up to 6 clear photos of your bottles, cans, or
                          items so our studio can assess suitability.
                        </p>
                      </div>

                      <label className="flex flex-col items-center justify-center border border-dashed border-gold/60 bg-ivory p-10 text-center cursor-pointer hover:bg-travertine/40 transition-colors">
                        <ImagePlus className="w-8 h-8 text-teal-deep mb-3" />
                        <span className="font-serif text-xl text-teal-abyss">
                          Click to select material photographs
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate mt-1.5">
                          JPG, PNG, WEBP · Up to 4 MB each · Max 6 photos
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMaterialImages}
                          className="hidden"
                        />
                      </label>

                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                          {uploadedImages.map((img) => (
                            <div
                              key={img.id}
                              className="relative border border-gold/35 bg-ivory p-1.5 group"
                            >
                              <img
                                src={img.dataUrl}
                                alt={img.name}
                                className="w-full aspect-square object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setUploadedImages((prev) =>
                                    prev.filter((i) => i.id !== img.id)
                                  )
                                }
                                aria-label={`Remove ${img.name}`}
                                className="absolute top-2 right-2 bg-teal-abyss/85 text-ivory p-1 hover:bg-gold hover:text-teal-abyss"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <p className="text-[10px] truncate text-slate mt-1 px-0.5">
                                {img.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5 */}
                  {step === 5 && (
                    <div className="space-y-6 max-w-3xl">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-dark">
                          Step 05 // Studio Contact
                        </p>
                        <h3 className="font-serif text-3xl text-teal-abyss mt-1">
                          Your Details
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          Your details remain private and are used solely by our
                          studio to review feasibility and coordinate next
                          steps.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="wwFullName"
                            className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                          >
                            Full Name *
                          </label>
                          <input
                            id="wwFullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Aarav Mehta"
                            className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wwEmail"
                            className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                          >
                            Email Address *
                          </label>
                          <input
                            id="wwEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="aarav@example.com"
                            className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wwPhone"
                            className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                          >
                            Phone / WhatsApp *
                          </label>
                          <input
                            id="wwPhone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98XXX XXXXX"
                            className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wwCity"
                            className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                          >
                            City *
                          </label>
                          <input
                            id="wwCity"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Bengaluru"
                            className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="wwAddress"
                          className="block font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2"
                        >
                          Delivery Address (Optional at initial enquiry stage)
                        </label>
                        <input
                          id="wwAddress"
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Street, apartment, postal code"
                          className="w-full border border-gold/40 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-teal-deep"
                        />
                      </div>

                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-deep mb-2">
                          Preferred Contact Method
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {(['WhatsApp', 'Email', 'Phone'] as const).map(
                            (method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setPreferredContact(method)}
                                className={`px-5 py-2.5 border text-xs uppercase tracking-[0.18em] ${
                                  preferredContact === method
                                    ? 'bg-teal-deep text-ivory border-teal-deep'
                                    : 'bg-ivory border-gold/35 text-teal-deep'
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
                    <div className="space-y-6">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-dark">
                          Step 06 // Final Review
                        </p>
                        <h3 className="font-serif text-3xl text-teal-abyss mt-1">
                          Review &amp; Submit Your Creation Request
                        </h3>
                        <p className="text-sm text-slate mt-1">
                          This is a bespoke request—no payment is taken now. Our
                          studio will confirm material feasibility and quote
                          first.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gold/30 bg-ivory p-6 text-sm">
                        <div className="space-y-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-dark">
                            Material &amp; Design
                          </p>
                          <p>
                            <span className="text-slate">Materials:</span>{' '}
                            <strong>
                              {[...materials, customMaterial]
                                .filter(Boolean)
                                .join(', ')}
                            </strong>
                          </p>
                          <p>
                            <span className="text-slate">Product:</span>{' '}
                            <strong>{productType}</strong>
                          </p>
                          <p>
                            <span className="text-slate">Colour:</span>{' '}
                            <strong>{colourPreference}</strong>
                          </p>
                          <p>
                            <span className="text-slate">Style &amp; Pattern:</span>{' '}
                            <strong>
                              {designStyle} · {pattern}
                            </strong>
                          </p>
                          <p>
                            <span className="text-slate">Size:</span>{' '}
                            <strong>{size}</strong>
                          </p>
                          {personalText && (
                            <p>
                              <span className="text-slate">Inscription:</span>{' '}
                              <strong>{personalText}</strong>
                            </p>
                          )}
                          {specialInstructions && (
                            <p>
                              <span className="text-slate">Notes:</span>{' '}
                              {specialInstructions}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-dark">
                            Customer &amp; Uploads
                          </p>
                          <p>
                            <span className="text-slate">Name:</span>{' '}
                            <strong>{fullName}</strong>
                          </p>
                          <p>
                            <span className="text-slate">Email:</span>{' '}
                            <strong>{email}</strong>
                          </p>
                          <p>
                            <span className="text-slate">Phone:</span>{' '}
                            <strong>{phone}</strong>
                          </p>
                          <p>
                            <span className="text-slate">City:</span>{' '}
                            <strong>{city}</strong>
                          </p>
                          <p>
                            <span className="text-slate">Preferred Contact:</span>{' '}
                            <strong>{preferredContact}</strong>
                          </p>
                          <p>
                            <span className="text-slate">Material Photos:</span>{' '}
                            <strong>{uploadedImages.length} attached</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Banner */}
                  {errorMsg && (
                    <div
                      role="alert"
                      className="flex items-center gap-2.5 border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-900"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="pt-6 border-t border-gold/25 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1 || submitting}
                      className={`inline-flex items-center gap-2 px-5 py-3 border text-xs uppercase tracking-[0.2em] ${
                        step === 1
                          ? 'opacity-40 cursor-not-allowed border-gold/20 text-slate'
                          : 'border-teal-deep/40 text-teal-deep hover:bg-travertine'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    {step < 6 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 bg-teal-deep text-ivory px-7 py-3.5 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 bg-gold text-teal-abyss px-8 py-4 text-xs uppercase tracking-[0.24em] font-semibold hover:bg-teal-deep hover:text-ivory transition-colors disabled:opacity-60"
                      >
                        {submitting
                          ? 'Submitting Request...'
                          : 'SUBMIT MY CREATION REQUEST'}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
