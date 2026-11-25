'use client';

import React, { useEffect, useState } from 'react';
import { WasteWorthLeafMark } from './WasteWorthEmblem';

export function AtelierPreloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) {
      const id = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(id);
    }

    const t1 = setTimeout(() => setFading(true), 800);
    const t2 = setTimeout(() => setVisible(false), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-teal-abyss text-ivory flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-5 text-center">
        <WasteWorthLeafMark size={64} />
        <div className="space-y-1">
          <p className="font-serif text-3xl tracking-tight">
            <span className="text-ivory">Waste</span>
            <span className="text-gold">Worth</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-gold-light/85">
            TRASH → TREASURE
          </p>
        </div>
      </div>
    </div>
  );
}
