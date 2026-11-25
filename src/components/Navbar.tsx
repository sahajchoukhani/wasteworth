'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WasteWorthWordmark } from './WasteWorthEmblem';

const NAV_LINKS = [
  { label: 'Collection', href: '#collection' },
  { label: 'Your Waste', href: '#create' },
  { label: 'WasteWorth Form', href: '#form-decor' },
  { label: 'Process', href: '#process' },
  { label: 'Loop', href: '#loop' },
  { label: 'Our Story', href: '#story' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory/92 backdrop-blur-md border-b border-gold/25 py-3 shadow-[0_6px_30px_rgba(7,34,43,0.06)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between">
          <a
            href="#top"
            aria-label="WasteWorth Home"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <WasteWorthWordmark />
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-8"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[11px] uppercase tracking-[0.22em] font-medium text-teal-deep/85 hover:text-gold-dark transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/admin"
              className="text-[11px] uppercase tracking-[0.2em] text-slate hover:text-teal-deep transition-colors px-2 py-1"
            >
              Studio
            </Link>
            <a
              href="#create"
              className="inline-flex items-center gap-2 border border-teal-deep bg-teal-deep text-ivory px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-gold hover:border-gold hover:text-teal-abyss transition-colors duration-300"
            >
              Create Your Own
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 text-teal-deep border border-gold/35 bg-cream/80"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-50 bg-teal-abyss text-ivory flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between">
              <WasteWorthWordmark dark />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 border border-gold/40 text-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 my-auto">
              {NAV_LINKS.map((item, idx) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl tracking-wide text-ivory hover:text-gold-light transition-colors flex items-baseline gap-4"
                >
                  <span className="font-mono text-xs text-gold">
                    0{idx + 1}
                  </span>
                  {item.label}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-serif text-2xl text-gold-light/90 pt-4 border-t border-gold/20"
              >
                Studio Admin Dashboard →
              </Link>
            </nav>

            <div className="space-y-4">
              <a
                href="#create"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-gold text-teal-abyss py-4 text-xs uppercase tracking-[0.25em] font-semibold"
              >
                Create Your Own
              </a>
              <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/60 text-center">
                WASTEWORTH — TRASH → TREASURE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
