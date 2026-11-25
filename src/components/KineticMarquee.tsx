'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const MARQUEE_ITEMS = [
  'TRASH → TRANSFORMATION → TREASURE',
  'UPCYCLED HANDCRAFTED JEWELLERY',
  'WASTEWORTH FORM ARCHITECTURAL DÉCOR',
  'DEEP OCEAN TEAL · CHAMPAGNE GOLD · TRAVERTINE IVORY',
  'YOUR WASTE. YOUR DESIGN.',
];

export function KineticMarquee() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-teal-abyss text-gold-light border-y border-gold/30 py-3.5 select-none">
      <motion.div
        className="flex whitespace-nowrap gap-12"
        animate={prefersReduced ? undefined : { x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 28,
        }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, idx) => (
          <span
            key={`${text}-${idx}`}
            className="inline-flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.32em]"
          >
            <span>{text}</span>
            <span className="text-gold/60" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
