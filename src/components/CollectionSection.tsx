'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, X, Check } from 'lucide-react';
import { COLLECTION_CATEGORIES, PRODUCT_CATALOG } from '@/lib/catalog';
import { ProductItem } from '@/types/wasteworth';

interface CollectionSectionProps {
  onCustomizeProduct: (productType: string) => void;
}

function mapCategoryToWizardProduct(product: ProductItem): string {
  switch (product.category) {
    case 'Rings':
      return 'Ring';
    case 'Earrings':
      return 'Earrings';
    case 'Bangles':
      return 'Bangles';
    case 'Keychains':
      return 'Keychain';
    case 'WasteWorth Form':
      return product.name.toLowerCase().includes('trophy')
        ? 'Decorative item'
        : 'Nameplate';
    default:
      return 'Ring';
  }
}

export function CollectionSection({
  onCustomizeProduct,
}: CollectionSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );

  const filteredProducts =
    activeCategory === 'All'
      ? PRODUCT_CATALOG
      : PRODUCT_CATALOG.filter((p) => p.category === activeCategory);

  return (
    <section
      id="collection"
      className="py-24 lg:py-32 border-b border-gold/25 bg-cream/60"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-gold/25">
          <div className="space-y-4 max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-dark">
              01 // The Collection
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-teal-abyss leading-[1.06]">
              Artifacts of{' '}
              <span className="italic text-gold-dark font-normal">
                Reclaimed Matter
              </span>
            </h2>
            <p className="text-slate text-base leading-relaxed">
              Handcrafted in small batches from sorted post-consumer plastics
              and reclaimed metals. All listed prices are indicative starting
              estimates—final pricing depends on customization and material
              preparation.
            </p>
          </div>

          {/* Category Filters */}
          <div
            role="tablist"
            aria-label="Product categories"
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
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border ${
                    isActive
                      ? 'bg-teal-deep text-ivory border-teal-deep'
                      : 'bg-ivory/80 text-teal-deep border-gold/30 hover:border-teal-deep'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <motion.div
          layout
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => {
              const colSpan =
                product.featuredSpan === 'wide'
                  ? 'lg:col-span-7'
                  : product.featuredSpan === 'tall'
                  ? 'lg:col-span-5'
                  : index % 3 === 0
                  ? 'lg:col-span-4'
                  : 'lg:col-span-4';

              return (
                <motion.article
                  layout
                  key={product.id}
                  initial={{
                    opacity: 0,
                    y: 28,
                    clipPath: 'inset(10% 0 0 0)',
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    clipPath: 'inset(0% 0 0 0)',
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileHover={{ y: -5 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`${colSpan} group border border-gold/30 bg-ivory flex flex-col justify-between overflow-hidden hover:border-gold hover:shadow-[0_22px_50px_rgba(7,34,43,0.1)] transition-all duration-500`}
                >
                  <div>
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="relative aspect-[4/4.2] overflow-hidden bg-travertine cursor-pointer"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="bg-ivory/92 backdrop-blur-sm border border-gold/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-teal-deep">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-teal-abyss/85 text-gold-light px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
                          {product.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-serif text-2xl text-teal-abyss group-hover:text-gold-dark transition-colors">
                          {product.name}
                        </h3>
                        <span className="font-mono text-xs text-teal-deep shrink-0 pt-1">
                          {product.indicativePrice}
                        </span>
                      </div>

                      <p className="text-sm text-slate leading-relaxed">
                        {product.shortDescription}
                      </p>

                      <div className="pt-2 border-t border-gold/20 space-y-1.5">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-gold-dark font-medium">
                          Material:{' '}
                          <span className="normal-case tracking-normal text-ink/80 font-normal">
                            {product.materialUsed}
                          </span>
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate">
                          Customizable:{' '}
                          <span className="normal-case tracking-normal text-ink/75">
                            {product.customizationAvailable.join(' · ')}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 border border-teal-deep/35 py-2.5 px-4 text-[11px] uppercase tracking-[0.2em] text-teal-deep hover:bg-teal-deep hover:text-ivory transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (product.category === 'WasteWorth Form') {
                          document
                            .getElementById('form-decor')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          onCustomizeProduct(mapCategoryToWizardProduct(product));
                          document
                            .getElementById('create')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 bg-teal-deep text-ivory py-2.5 px-4 text-[11px] uppercase tracking-[0.2em] hover:bg-gold hover:text-teal-abyss transition-colors"
                    >
                      {product.isQuoteOnly ? 'Request Quote' : 'Customize'}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-teal-abyss/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory border border-gold/40 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="relative aspect-square md:aspect-auto bg-travertine min-h-[300px]">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-dark">
                      {selectedProduct.category} {'//'} {selectedProduct.tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      aria-label="Close product modal"
                      className="p-1.5 border border-gold/30 text-teal-deep hover:bg-travertine"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-serif text-3xl text-teal-abyss">
                    {selectedProduct.name}
                  </h3>

                  <p className="font-mono text-sm text-teal-deep">
                    {selectedProduct.indicativePrice}
                  </p>

                  <p className="text-sm text-slate leading-relaxed">
                    {selectedProduct.editorialNote}
                  </p>

                  <div className="border-t border-gold/25 pt-4 space-y-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                        Primary Material
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
                            <Check className="w-3.5 h-3.5 text-gold-dark" />
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gold/25 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const target = selectedProduct;
                      setSelectedProduct(null);
                      if (target.category === 'WasteWorth Form') {
                        document
                          .getElementById('form-decor')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onCustomizeProduct(mapCategoryToWizardProduct(target));
                        document
                          .getElementById('create')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-deep text-ivory py-3.5 px-6 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {selectedProduct.isQuoteOnly
                      ? 'Enquire via WasteWorth Form'
                      : 'Customize This Piece'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
