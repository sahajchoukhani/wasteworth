import React from 'react';
import Link from 'next/link';
import { WasteWorthWordmark } from './WasteWorthEmblem';

export function Footer() {
  return (
    <footer className="bg-teal-abyss text-ivory pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-gold/25">
          <div className="md:col-span-5 space-y-4">
            <WasteWorthWordmark dark />
            <p className="text-sm text-ivory/75 max-w-sm leading-relaxed">
              A creative sustainability studio transforming discarded bottles,
              cans, and reusable waste into wearable artifacts and bespoke
              architectural décor.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold-light pt-2">
              WASTEWORTH — TRASH → TREASURE
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold-light">
              Explore
            </p>
            <ul className="space-y-2 text-sm text-ivory/75">
              <li>
                <a href="#collection" className="hover:text-gold-light transition-colors">
                  The Collection
                </a>
              </li>
              <li>
                <a href="#create" className="hover:text-gold-light transition-colors">
                  Your Waste. Your Design.
                </a>
              </li>
              <li>
                <a href="#form-decor" className="hover:text-gold-light transition-colors">
                  WasteWorth Form
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-gold-light transition-colors">
                  Our Process
                </a>
              </li>
              <li>
                <a href="#loop" className="hover:text-gold-light transition-colors">
                  WasteWorth Loop
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold-light">
              Studio &amp; Exhibitions
            </p>
            <p className="text-sm text-ivory/75 leading-relaxed">
              Operating in small handcrafted batches through direct commissions,
              design exhibitions, and institutional collaborations.
            </p>
            <p className="text-sm text-ivory/90">
              Studio Desk: <span className="text-gold-light">studio@wasteworth.in</span>
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-block border border-gold/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-light hover:bg-gold hover:text-teal-abyss transition-colors"
              >
                Studio Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/55">
          <p>© {new Date().getFullYear()} WasteWorth Studio. All rights reserved.</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
            Don&apos;t just throw it away. Reimagine it.
          </p>
        </div>
      </div>
    </footer>
  );
}
