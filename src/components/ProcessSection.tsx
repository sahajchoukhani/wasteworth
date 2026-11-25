'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PROCESS_STEPS = [
  {
    code: '01',
    title: 'COLLECT',
    subtitle: 'Gathering Suitable Discarded Materials',
    detail:
      'Clean post-consumer plastic bottles, HDPE caps, containers, packaging, and aluminium cans are sourced from individuals, studios, and campus drives.',
  },
  {
    code: '02',
    title: 'SEGREGATE & CLEAN',
    subtitle: 'Inspection, Sorting & Preparation',
    detail:
      'Every batch is hand-sorted by polymer grade, colour family, and structural integrity—then washed, dried, and stripped of labels or adhesives.',
  },
  {
    code: '03',
    title: 'CREATE',
    subtitle: 'Thermal Pressing & Sculptural Forming',
    detail:
      'Sorted flakes are heat-compressed, marbled, or cold-worked in small batches to produce dense, mineral-like sheets and cast forms.',
  },
  {
    code: '04',
    title: 'CUSTOMIZE',
    subtitle: 'Inlay, Engraving & Finishing',
    detail:
      'Each piece is shaped, sanded, flame-polished, and paired with champagne-brass hardware, monograms, or institutional crests.',
  },
  {
    code: '05',
    title: 'REUSE',
    subtitle: 'Delivered to Be Kept, Not Discarded',
    detail:
      'Finished jewellery, accessories, or WasteWorth Form architectural pieces are delivered with care notes—closing the emotional loop.',
  },
];

export function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="process"
      className="py-24 lg:py-32 border-b border-gold/25 bg-ivory"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl space-y-4 mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-dark">
            04 // Our Process
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-teal-abyss leading-[1.08]">
            COLLECT → CLEAN → CREATE →{' '}
            <span className="italic text-gold-dark font-normal">
              CUSTOMIZE → REUSE
            </span>
          </h2>
          <p className="text-slate text-base leading-relaxed">
            Every WasteWorth object begins as overlooked material and passes
            through five deliberate studio stages before reaching your hands.
          </p>
        </div>

        {/* Interactive Stage Selector Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 divide-y divide-gold/25 border-y border-gold/25">
            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <motion.button
                  key={step.code}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className={`w-full text-left py-6 px-4 transition-colors duration-300 flex items-start gap-6 ${
                    isSelected
                      ? 'bg-travertine/70'
                      : 'hover:bg-cream/80'
                  }`}
                >
                  <span
                    className={`font-mono text-xs pt-1.5 ${
                      isSelected ? 'text-gold-dark font-bold' : 'text-slate'
                    }`}
                  >
                    {step.code}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-serif text-2xl sm:text-3xl text-teal-abyss">
                        {step.title}
                      </h3>
                      <span
                        className={`h-2 w-2 rounded-full transition-colors ${
                          isSelected ? 'bg-gold' : 'bg-gold/25'
                        }`}
                      />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gold-dark mt-1">
                      {step.subtitle}
                    </p>
                    <p className="text-sm text-slate leading-relaxed mt-3">
                      {step.detail}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Sticky Editorial Spotlight Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 border border-gold/35 bg-teal-abyss text-ivory p-8 sm:p-10 space-y-6">
            <div className="flex items-center justify-between border-b border-gold/25 pb-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-light">
                Stage {PROCESS_STEPS[activeIndex].code} / 05
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
                Atelier Standard
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-4xl text-gold-light">
                {PROCESS_STEPS[activeIndex].title}
              </h3>
              <p className="text-sm uppercase tracking-[0.18em] text-ivory/80">
                {PROCESS_STEPS[activeIndex].subtitle}
              </p>
              <p className="text-ivory/80 leading-relaxed pt-2">
                {PROCESS_STEPS[activeIndex].detail}
              </p>
            </div>

            <div className="pt-4 border-t border-gold/25 flex items-center justify-between text-xs text-ivory/65">
              <span>Small-batch handcrafted workflow</span>
              <div className="flex gap-1.5">
                {PROCESS_STEPS.map((s, i) => (
                  <button
                    key={s.code}
                    type="button"
                    aria-label={`Select stage ${s.title}`}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 transition-all ${
                      i === activeIndex
                        ? 'w-6 bg-gold'
                        : 'w-2 bg-ivory/25 hover:bg-ivory/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
