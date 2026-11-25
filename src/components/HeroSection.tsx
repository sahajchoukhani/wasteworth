'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowDownRight, Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { WasteWorthLeafMark } from './WasteWorthEmblem';

const SEQUENCE_WORDS = ['TRASH', 'TRANSFORMATION', 'TREASURE'] as const;

export function HeroSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [morphProgress, setMorphProgress] = useState(68);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const logoY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const leafParallaxY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const leafRotate = useTransform(scrollYProgress, [0, 1], [12, 28]);

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % SEQUENCE_WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#EFE7DA] via-ivory to-ivory"
    >
      {/* Warm architectural sunlight diagonal beams matching the official logo lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 left-1/4 w-[520px] h-[140%] -rotate-[28deg] opacity-35"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,252,244,0.75) 50%, transparent 100%)',
          }}
        />
        <motion.div
          style={prefersReduced ? undefined : { y: leafParallaxY, rotate: leafRotate }}
          className="absolute top-20 right-[-5%] opacity-[0.07]"
        >
          <WasteWorthLeafMark size={460} />
        </motion.div>
        <div className="mx-auto max-w-7xl h-full border-x border-gold/15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Blended Official Logo Banner Seamlessly Integrated into Travertine */}
        <motion.div
          style={prefersReduced ? undefined : { y: logoY }}
          initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 lg:mb-12 flex flex-col items-center"
        >
          <div className="relative w-full max-w-2xl aspect-[16/9] overflow-hidden">
            <Image
              src="/images/wasteworth-logo.jpg"
              alt="WasteWorth — Trash to Treasure Official Brand Mark"
              fill
              priority
              className="object-cover scale-[1.03]"
              style={{
                maskImage:
                  'radial-gradient(ellipse 84% 78% at 50% 50%, black 52%, transparent 98%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 84% 78% at 50% 50%, black 52%, transparent 98%)',
              }}
            />
          </div>
          <div className="ww-hairline-gold w-full max-w-xl mt-2" />
        </motion.div>

        {/* Animated Sequence Pill */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
        >
          <span className="inline-flex items-center gap-2 border border-gold/45 bg-cream/85 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-teal-deep">
            <Sparkles className="w-3 h-3 text-gold" />
            Circular Atelier
          </span>
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.28em] font-medium">
            {SEQUENCE_WORDS.map((word, idx) => (
              <React.Fragment key={word}>
                <span
                  className={`transition-all duration-500 ${
                    activeStage === idx
                      ? 'text-teal-deep font-semibold border-b border-gold pb-0.5'
                      : 'text-slate/60'
                  }`}
                >
                  {word}
                </span>
                {idx < SEQUENCE_WORDS.length - 1 && (
                  <span className="text-gold" aria-hidden="true">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Editorial Column with Masked Kinetic Line Reveals */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4.1rem] leading-[1.03] tracking-[-0.01em] text-teal-abyss font-medium">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={prefersReduced ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                  WHAT THE WORLD
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={prefersReduced ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.85,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  THROWS AWAY,{' '}
                  <span className="italic font-normal text-gold-dark">
                    WE TURN
                  </span>
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block italic font-normal text-gold-dark"
                  initial={prefersReduced ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.85,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  INTO WORTH.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-xl text-base sm:text-lg leading-relaxed text-slate font-light"
            >
              Your discarded materials. Our creative imagination. Together,
              something worth keeping.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.38 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MagneticButton
                href="#create"
                className="inline-flex items-center gap-3 bg-teal-deep text-ivory px-8 py-4 text-xs uppercase tracking-[0.24em] font-semibold hover:bg-gold hover:text-teal-abyss transition-colors duration-300 shadow-[0_12px_30px_rgba(11,57,72,0.18)]"
              >
                Create Your Own
                <ArrowDownRight className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href="#collection"
                className="inline-flex items-center gap-3 border border-teal-deep/35 bg-cream/75 text-teal-deep px-8 py-4 text-xs uppercase tracking-[0.24em] font-semibold hover:border-gold hover:bg-travertine transition-colors duration-300"
              >
                Explore Our Creations
              </MagneticButton>
            </motion.div>

            {/* Studio Editorial Focus */}
            <div className="pt-8 border-t border-gold/25 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate">
                  Craft Model
                </p>
                <p className="font-serif text-lg text-teal-deep mt-1">
                  Small-Batch Handcrafted
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate">
                  Feedstock
                </p>
                <p className="font-serif text-lg text-teal-deep mt-1">
                  Bottles, Cans &amp; Packaging
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate">
                  Commission
                </p>
                <p className="font-serif text-lg text-teal-deep mt-1">
                  Bespoke &amp; Custom Décor
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Composition: Interactive Trash -> Treasure Morph Stage */}
          <motion.div
            initial={
              prefersReduced
                ? false
                : { opacity: 0, clipPath: 'inset(14% 0 0 0)' }
            }
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative border border-gold/40 bg-cream p-4 shadow-[0_24px_60px_rgba(7,34,43,0.12)]">
              <div className="relative aspect-[4/4.3] overflow-hidden bg-travertine">
                {/* Base Layer: Raw Discarded Material Texture */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 bg-[#E6DDD0]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-teal-deep/70">
                      RAW FEEDSTOCK {'//'} PET &amp; ALUM
                    </span>
                    <span className="font-mono text-[10px] text-slate">
                      STAGE 01
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 400 320"
                    className="w-full h-56 opacity-85"
                    aria-hidden="true"
                  >
                    <polygon
                      points="70,190 135,120 185,175 110,235"
                      fill="#165A6E"
                      fillOpacity="0.35"
                      stroke="#0B3948"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points="190,95 265,70 295,145 215,165"
                      fill="#9EB8BE"
                      fillOpacity="0.55"
                      stroke="#526066"
                      strokeWidth="1.2"
                    />
                    <polygon
                      points="155,210 245,190 275,260 175,270"
                      fill="#C69D52"
                      fillOpacity="0.28"
                      stroke="#8A6525"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M95 145 Q180 110 280 190"
                      stroke="#0B3948"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                      fill="none"
                    />
                  </svg>
                  <p className="font-serif italic text-lg text-teal-deep/80">
                    Discarded bottles, lids &amp; crushed aluminium before
                    studio transformation.
                  </p>
                </div>

                {/* Revealed Layer: Finished Upcycled Treasure */}
                <div
                  className="absolute inset-0 transition-[clip-path] duration-150 ease-out"
                  style={{
                    clipPath: `inset(0 ${100 - morphProgress}% 0 0)`,
                  }}
                >
                  <Image
                    src="/images/product-ring.svg"
                    alt="Handcrafted WasteWorth Abyssal Vein Signet Ring made from upcycled plastic"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-teal-abyss/85 via-teal-abyss/30 to-transparent p-5 text-ivory">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-light">
                      FINISHED TREASURE {'//'} HAND-PRESSED
                    </span>
                    <p className="font-serif text-xl mt-0.5">
                      Abyssal Vein Signet &amp; Gold Inlay
                    </p>
                  </div>
                </div>

                {/* Vertical divider line */}
                <div
                  className="absolute inset-y-0 w-px bg-gold shadow-[0_0_12px_rgba(198,157,82,0.9)] pointer-events-none"
                  style={{ left: `${morphProgress}%` }}
                />
              </div>

              {/* Interactive Slider Control */}
              <div className="mt-4 pt-3 border-t border-gold/20 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate shrink-0">
                  Trash
                </span>
                <input
                  type="range"
                  min={8}
                  max={96}
                  value={morphProgress}
                  onChange={(e) => setMorphProgress(Number(e.target.value))}
                  aria-label="Slide to reveal transformation from raw waste to finished jewellery"
                  className="w-full accent-teal-deep cursor-ew-resize"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark font-semibold shrink-0">
                  Treasure
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
