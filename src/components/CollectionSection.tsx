'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, X, Check } from 'lucide-react';
import { COLLECTION_CATEGORIES } from '@/lib/catalog';
import { ProductItem } from '@/types/wasteworth';

interface CollectionSectionProps {
  products: ProductItem[];
  onCustomizeProduct: (productType: string) => void;
}

function mapCategoryToWizardProduct(product: ProductItem): string {
  switch (product.category) {
    case 'Keychains':
      return 'Keychain';
    case 'Earrings':
      return 'Earrings';
    case 'Rings':
      return 'Ring';
    case 'Bangles':
      return 'Bangles';
    case 'Vases':
      return 'Planter';
    default:
      return 'Ring';
  }
}

export function CollectionSection({
  products,
  onCustomizeProduct,
}: CollectionSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );

  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const leadProduct = filteredProducts[0] || null;
  const restProducts = filteredProducts.slice(1);

  const openModal = (
    product: ProductItem,
    triggerEl: HTMLButtonElement | null
  ) => {
    lastTriggerRef.current = triggerEl;
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (!selectedProduct) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProduct]);

  const handleCustomize = (product: ProductItem) => {
    onCustomizeProduct(mapCategoryToWizardProduct(product));
    if (window.__wwScrollTo) {
      window.__wwScrollTo('create');
    } else {
      document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="collection"
      className="py-20 lg:py-28 bg-ivory text-ink border-b border-gold/25"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Header & Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gold/25">
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold-dark">
              Launch Collection
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-teal-abyss leading-[1.06]">
              Five Small-Batch{' '}
              <span className="italic text-gold-dark font-normal">
                Creations
              </span>
            </h2>
            <p className="text-slate text-base leading-relaxed">
              We are starting small with five core object families crafted from
              sorted bottles, caps, cans, and packaging. Prices shown are
              indicative starting estimates.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter collection by category"
            className="flex flex-wrap gap-2"
          >
            {COLLECTION_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-[0.18em] border transition-colors ${
                    isActive
                      ? 'bg-teal-deep text-ivory border-teal-deep font-semibold'
                      : 'bg-cream text-teal-deep border-gold/35 hover:border-teal-deep'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lead Asymmetrical Feature */}
        {leadProduct && (
          <article className="mt-12 grid grid-cols-1 lg:grid-cols-12 border border-gold/35 bg-cream group">
            <div className="lg:col-span-7 relative aspect-[4/3] lg:min-h-[440px] bg-travertine overflow-hidden">
              <Image
                src={leadProduct.image}
                alt={leadProduct.name}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {leadProduct.isConceptRender && (
                <span className="absolute bottom-3 left-3 bg-teal-abyss/85 text-ivory px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                  Studio Concept
                </span>
              )}
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dark">
                  {leadProduct.category}
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl text-teal-abyss">
                  {leadProduct.name}
                </h3>
                <p className="font-mono text-sm text-teal-deep">
                  {leadProduct.indicativePrice}
                </p>
                <p className="text-sm text-slate leading-relaxed">
                  {leadProduct.shortDescription}
                </p>
                <div className="pt-4 border-t border-gold/25 space-y-2 text-sm">
                  <p>
                    <span className="text-slate">Material:</span>{' '}
                    <span className="text-ink font-medium">
                      {leadProduct.materialUsed}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate">Customization:</span>{' '}
                    <span className="text-ink/85">
                      {leadProduct.customizationAvailable.join(' · ')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={(e) => openModal(leadProduct, e.currentTarget)}
                  className="flex-1 min-w-[130px] border border-teal-deep py-3 px-4 text-xs uppercase tracking-[0.18em] text-teal-deep hover:bg-teal-deep hover:text-ivory transition-colors"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomize(leadProduct)}
                  className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 bg-teal-deep text-ivory py-3 px-4 text-xs uppercase tracking-[0.18em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors"
                >
                  Request Customization
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Alternating Asymmetrical Grid */}
        {restProducts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {restProducts.map((product, idx) => {
              const rowPair = Math.floor(idx / 2);
              const isEvenRow = rowPair % 2 === 0;
              const isFirst = idx % 2 === 0;
              const colSpan = isEvenRow
                ? isFirst
                  ? 'lg:col-span-5'
                  : 'lg:col-span-7'
                : isFirst
                ? 'lg:col-span-7'
                : 'lg:col-span-5';

              return (
                <article
                  key={product.id}
                  className={`${colSpan} border border-gold/30 bg-cream flex flex-col justify-between group`}
                >
                  <div>
                    <div className="relative aspect-[16/11] bg-travertine overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                            {product.category}
                          </p>
                          <h3 className="font-serif text-2xl text-teal-abyss mt-0.5">
                            {product.name}
                          </h3>
                        </div>
                        <span className="font-mono text-xs text-teal-deep shrink-0 pt-1">
                          {product.indicativePrice}
                        </span>
                      </div>

                      <p className="text-sm text-slate leading-relaxed">
                        {product.shortDescription}
                      </p>

                      <p className="text-xs text-ink/80 pt-2 border-t border-gold/20">
                        <span className="text-slate">Material:</span>{' '}
                        {product.materialUsed}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => openModal(product, e.currentTarget)}
                      className="flex-1 border border-teal-deep/40 py-2.5 px-4 text-xs uppercase tracking-[0.18em] text-teal-deep hover:bg-teal-deep hover:text-ivory transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCustomize(product)}
                      className="inline-flex items-center justify-center gap-1.5 bg-teal-deep text-ivory py-2.5 px-5 text-xs uppercase tracking-[0.18em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors"
                    >
                      Request Customization
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ww-modal-title"
          className="fixed inset-0 z-50 bg-teal-abyss/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-ivory border border-gold/40 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="relative bg-travertine min-h-[300px]">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-dark">
                    {selectedProduct.category}
                  </span>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeModal}
                    aria-label="Close product dialog"
                    className="p-2 border border-teal-deep/25 text-teal-deep hover:bg-travertine"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3
                  id="ww-modal-title"
                  className="font-serif text-3xl text-teal-abyss"
                >
                  {selectedProduct.name}
                </h3>

                <p className="font-mono text-sm text-teal-deep">
                  {selectedProduct.indicativePrice}
                </p>

                <p className="text-sm text-slate leading-relaxed">
                  {selectedProduct.shortDescription}
                </p>

                <div className="border-t border-gold/25 pt-4 space-y-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                      Material Used
                    </p>
                    <p className="text-sm text-ink mt-0.5">
                      {selectedProduct.materialUsed}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark mb-1.5">
                      Customization Options
                    </p>
                    <ul className="space-y-1">
                      {selectedProduct.customizationAvailable.map((opt) => (
                        <li
                          key={opt}
                          className="flex items-center gap-2 text-sm text-ink/85"
                        >
                          <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gold/25">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedProduct;
                    closeModal();
                    handleCustomize(target);
                  }}
                  className="w-full bg-teal-deep text-ivory py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors"
                >
                  Request Customization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
