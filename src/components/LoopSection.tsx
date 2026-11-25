'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const LOOP_NODES = [
  {
    step: '01',
    label: 'CAMPUS WASTE',
    desc: 'Everyday bottles, containers, and event materials generated across universities and studios.',
  },
  {
    step: '02',
    label: 'COLLECTION',
    desc: 'Planned dedicated drop points and curated campus collection drives.',
  },
  {
    step: '03',
    label: 'SEGREGATION',
    desc: 'Sorting by polymer type, colour palette, and clean reusability.',
  },
  {
    step: '04',
    label: 'PROCESSING',
    desc: 'Sanitizing, shredding, and pressing into studio-grade raw sheets.',
  },
  {
    step: '05',
    label: 'PRODUCT CREATION',
    desc: 'Crafting nameplates, trophies, planters, and wearable accessories.',
  },
  {
    step: '06',
    label: 'REUSE',
    desc: 'Returning finished objects directly back into the campus ecosystem.',
  },
  {
    step: '07',
    label: 'RECOVERY',
    desc: 'End-of-life take-back so WasteWorth pieces can be remolded again.',
  },
];

export function LoopSection() {
  const [selectedNode, setSelectedNode] = useState(0);

  return (
    <section
      id="loop"
      className="py-24 lg:py-32 border-b border-gold/25 bg-travertine/55"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 border border-gold/40 bg-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-teal-deep">
              <RefreshCw className="w-3 h-3 text-gold-dark" />
              Future Vision // Expanding Horizon
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-teal-abyss leading-[1.08]">
              BEYOND PRODUCTS.{' '}
              <span className="italic text-gold-dark font-normal">
                BUILDING A CIRCULAR FUTURE.
              </span>
            </h2>

            <p className="text-slate leading-relaxed">
              Today, we begin with focused, small-batch handcrafted jewellery,
              custom commissions, and WasteWorth Form décor. Our long-term
              horizon is <strong>WasteWorth Loop</strong>—a closed-loop campus
              sustainability system where institutional waste never leaves the
              community as trash, but returns as functional design.
            </p>

            <div className="border-l-2 border-gold pl-5 py-1 bg-ivory/60">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-dark">
                Active Loop Node // {LOOP_NODES[selectedNode].step}
              </p>
              <h3 className="font-serif text-2xl text-teal-deep mt-1">
                {LOOP_NODES[selectedNode].label}
              </h3>
              <p className="text-sm text-slate mt-1.5 leading-relaxed">
                {LOOP_NODES[selectedNode].desc}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-gold/35 bg-ivory p-6 sm:p-10">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-gold/20">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal-deep">
                  WasteWorth Loop Architecture
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">
                  Interactive Roadmap
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LOOP_NODES.map((node, idx) => {
                  const active = selectedNode === idx;
                  return (
                    <motion.button
                      key={node.step}
                      type="button"
                      onClick={() => setSelectedNode(idx)}
                      whileHover={{ y: -2 }}
                      className={`text-left p-4 border transition-all duration-300 ${
                        active
                          ? 'border-teal-deep bg-teal-deep text-ivory'
                          : 'border-gold/30 bg-cream/70 text-teal-abyss hover:border-gold'
                      } ${idx === LOOP_NODES.length - 1 ? 'sm:col-span-2' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-[10px] tracking-[0.22em] ${
                            active ? 'text-gold-light' : 'text-gold-dark'
                          }`}
                        >
                          STAGE {node.step}
                        </span>
                        <span
                          className={`text-[10px] font-mono ${
                            active ? 'text-ivory/75' : 'text-slate'
                          }`}
                        >
                          →
                        </span>
                      </div>
                      <p className="font-serif text-xl mt-1">{node.label}</p>
                      <p
                        className={`text-xs mt-1.5 leading-relaxed ${
                          active ? 'text-ivory/80' : 'text-slate'
                        }`}
                      >
                        {node.desc}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
