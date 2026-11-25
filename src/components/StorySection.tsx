'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WasteWorthLeafMark } from './WasteWorthEmblem';

export function StorySection() {
  return (
    <section
      id="story"
      className="py-24 lg:py-36 bg-ivory border-b border-gold/25"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <WasteWorthLeafMark size={44} />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-dark">
            06 // Why WasteWorth
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-teal-abyss leading-[1.08]">
            Sustainability Should Feel{' '}
            <span className="italic text-gold-dark font-normal">
              Desirable, Not Compromised.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-4">
          <div className="border-t border-gold/40 pt-5 space-y-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-dark">
              The Problem
            </p>
            <h3 className="font-serif text-2xl text-teal-deep">
              Everyday Discard
            </h3>
            <p className="text-sm text-slate leading-relaxed">
              Durable plastics and aluminium are engineered to last centuries,
              yet treated as single-use ephemera—discarded moments after
              serving their first purpose.
            </p>
          </div>

          <div className="border-t border-gold/40 pt-5 space-y-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-dark">
              The Potential
            </p>
            <h3 className="font-serif text-2xl text-teal-deep">
              Material Alchemies
            </h3>
            <p className="text-sm text-slate leading-relaxed">
              When sorted with care and worked with studio discipline, those
              same polymers reveal marble-like depth, translucency, and tactile
              permanence.
            </p>
          </div>

          <div className="border-t border-gold/40 pt-5 space-y-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-dark">
              Our Mission
            </p>
            <h3 className="font-serif text-2xl text-teal-deep">
              Circular Creative Economy
            </h3>
            <p className="text-sm text-slate leading-relaxed">
              Starting small through exhibitions, custom commissions, and direct
              studio craft, we prove that reclaimed matter belongs in heirloom
              design.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gold/25">
          <p className="font-serif italic text-3xl sm:text-4xl text-teal-abyss">
            &ldquo;Don&apos;t just throw it away. Reimagine it.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
