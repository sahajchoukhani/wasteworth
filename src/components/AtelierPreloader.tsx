'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function AtelierPreloader() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(!prefersReduced);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;

    const start = performance.now();
    const duration = 1650;
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        frameId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 220);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ww-preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[100] bg-teal-abyss text-ivory flex flex-col justify-between p-8 sm:p-12 overflow-hidden"
        >
          {/* Ambient radial glow matching logo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(198,157,82,0.22), transparent 58%)',
            }}
          />

          <div className="relative flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-light">
              WasteWorth Atelier // Est. 2026
            </span>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-ivory/65 hover:text-gold-light border border-gold/30 px-3 py-1 transition-colors"
            >
              Skip Intro
            </button>
          </div>

          <div className="relative my-auto flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-72 sm:w-96 aspect-[16/10] overflow-hidden border border-gold/45 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
            >
              <Image
                src="/images/wasteworth-logo.jpg"
                alt="WasteWorth — Trash to Treasure"
                fill
                priority
                className="object-cover"
              />
              {/* Soft vignette blending edges into the abyssal frame */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 38px rgba(7,34,43,0.45)',
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-mono text-[11px] uppercase tracking-[0.36em] text-gold-light"
            >
              TRASH → TRANSFORMATION → TREASURE
            </motion.p>
          </div>

          <div className="relative space-y-3">
            <div className="flex items-end justify-between">
              <span className="font-serif italic text-xl text-ivory/80">
                Reimagining discarded matter...
              </span>
              <span className="font-mono text-2xl sm:text-3xl text-gold-light tabular-nums">
                {String(progress).padStart(2, '0')}%
              </span>
            </div>
            <div className="h-[2px] w-full bg-ivory/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-dark via-gold-light to-gold transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
