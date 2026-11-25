'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight } from 'lucide-react';
import { ProductItem } from '@/types/wasteworth';

gsap.registerPlugin(ScrollTrigger);

interface WorthTunnelSectionProps {
  products: ProductItem[];
}

const WASTE_FRAMES = [
  {
    src: '/images/real/waste-bottles.jpg',
    label: 'Discarded PET Bottles',
    pos: 'top-[8%] left-[4%] w-[36vw] max-w-[340px] aspect-[4/3]',
  },
  {
    src: '/images/real/waste-cans.jpg',
    label: 'Crushed Aluminium Cans',
    pos: 'top-[14%] right-[5%] w-[34vw] max-w-[320px] aspect-[4/3]',
  },
  {
    src: '/images/real/waste-denim.jpg',
    label: 'Old Blue Denim',
    pos: 'bottom-[14%] left-[7%] w-[32vw] max-w-[300px] aspect-[4/3]',
  },
  {
    src: '/images/real/waste-caps.jpg',
    label: 'Sorted Bottle Caps',
    pos: 'bottom-[10%] right-[6%] w-[34vw] max-w-[320px] aspect-[4/3]',
  },
];

export function WorthTunnelSection({ products }: WorthTunnelSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const scene5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 4.2)}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });

        // Scene 1 (0 -> 0.22): Fly forward through dimensional waste frames
        tl.to(
          '.ww-tunnel-plate',
          {
            scale: 2.3,
            opacity: 0,
            z: 420,
            stagger: 0.03,
            ease: 'power2.in',
          },
          0
        )
          .to(
            scene1Ref.current,
            {
              opacity: 0,
              scale: 1.08,
              pointerEvents: 'none',
              duration: 0.16,
            },
            0.14
          )
          // Scene 2 (0.20 -> 0.44): Transformation
          .fromTo(
            scene2Ref.current,
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1, duration: 0.14 },
            0.18
          )
          .to(
            '.ww-transform-ring',
            { rotation: 140, scale: 1.15, duration: 0.24 },
            0.22
          )
          .to(
            scene2Ref.current,
            { opacity: 0, scale: 1.12, pointerEvents: 'none', duration: 0.12 },
            0.40
          )
          // Scene 3 (0.44 -> 0.72): Product World horizontal glide
          .fromTo(
            scene3Ref.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.12 },
            0.44
          )
          .to(
            horizontalTrackRef.current,
            { xPercent: -42, ease: 'none', duration: 0.24 },
            0.48
          )
          .to(
            scene3Ref.current,
            { opacity: 0, pointerEvents: 'none', duration: 0.1 },
            0.72
          )
          // Scene 4 (0.74 -> 0.88): Make It Yours
          .fromTo(
            scene4Ref.current,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.1 },
            0.74
          )
          .to(
            scene4Ref.current,
            { opacity: 0, pointerEvents: 'none', duration: 0.08 },
            0.86
          )
          // Scene 5 (0.88 -> 1.00): Circular Future
          .fromTo(
            scene5Ref.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.1 },
            0.88
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative bg-teal-abyss text-ivory overflow-hidden border-b border-gold/25"
    >
      {/* DESKTOP CINEMATIC PINNED WORTH TUNNEL (lg+) */}
      <div className="hidden lg:block relative h-screen w-full [perspective:1200px]">
        {/* SCENE 1: THE WASTE WORLD */}
        <div
          ref={scene1Ref}
          className="absolute inset-0 flex items-center justify-center"
        >
          {WASTE_FRAMES.map((frame) => (
            <div
              key={frame.src}
              className={`ww-tunnel-plate absolute ${frame.pos} border border-gold/30 shadow-2xl overflow-hidden opacity-75`}
            >
              <Image
                src={frame.src}
                alt={frame.label}
                fill
                priority
                sizes="35vw"
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-teal-abyss/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-light">
                {frame.label}
              </span>
            </div>
          ))}

          <div className="relative z-10 max-w-3xl mx-auto text-center px-8 py-10 bg-teal-abyss/80 backdrop-blur-sm border border-gold/30 space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-light">
              THE WORTH TUNNEL · SCENE 01
            </p>
            <h1 className="font-serif text-5xl xl:text-6xl leading-[1.04] text-ivory">
              WE SEE WHAT OTHERS THROW AWAY.
            </h1>
            <p className="text-ivory/80 text-base max-w-xl mx-auto leading-relaxed">
              Your discarded plastic bottles, cans, denim, and packaging—our
              creative imagination. Scroll to travel through the transformation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#create"
                className="inline-flex items-center gap-2 bg-gold text-teal-abyss px-7 py-3.5 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-ivory transition-colors"
              >
                Create Your Own
                <ArrowDownRight className="w-4 h-4" />
              </a>
              <a
                href="#collection"
                className="inline-flex items-center gap-2 border border-ivory/40 text-ivory px-7 py-3.5 text-xs uppercase tracking-[0.22em] font-semibold hover:border-gold hover:text-gold-light transition-colors"
              >
                Explore Our Creations
              </a>
            </div>
          </div>
        </div>

        {/* SCENE 2: THE TRANSFORMATION */}
        <div
          ref={scene2Ref}
          className="absolute inset-0 opacity-0 pointer-events-none flex items-center justify-center"
        >
          <div className="ww-transform-ring relative w-[520px] h-[520px] rounded-full border border-gold/40 flex items-center justify-center">
            <div className="relative w-80 h-80 rounded-full overflow-hidden border-2 border-gold/60">
              <Image
                src="/images/real/waste-sorted.jpg"
                alt="Sorted recyclable materials in transformation"
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute z-10 text-center max-w-2xl px-6 bg-teal-abyss/80 py-6 border border-gold/30">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-light">
              SCENE 02 · THE TRANSFORMATION
            </p>
            <h2 className="font-serif text-5xl text-ivory mt-2">
              EVERY MATERIAL HAS ANOTHER STORY.
            </h2>
          </div>
        </div>

        {/* SCENE 3: THE PRODUCT WORLD (Horizontal Gallery) */}
        <div
          ref={scene3Ref}
          className="absolute inset-0 opacity-0 pointer-events-none flex flex-col justify-center px-12"
        >
          <div className="mb-8 flex items-end justify-between max-w-7xl w-full mx-auto">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold-light">
                SCENE 03 · THE PRODUCT WORLD
              </p>
              <h2 className="font-serif text-4xl text-ivory mt-1">
                From Reclaimed Feedstock to Launch Collection
              </h2>
            </div>
            <a
              href="#collection"
              className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light border-b border-gold pb-1"
            >
              View Full Catalogue →
            </a>
          </div>

          <div
            ref={horizontalTrackRef}
            className="flex gap-6 w-max pl-12"
          >
            {products.map((prod) => (
              <div
                key={prod.id}
                className="w-[340px] shrink-0 border border-gold/30 bg-[#0B232B] overflow-hidden"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-light">
                    {prod.category}
                  </p>
                  <h3 className="font-serif text-2xl text-ivory">{prod.name}</h3>
                  <p className="font-mono text-xs text-ivory/75">
                    {prod.indicativePrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCENE 4: MAKE IT YOURS */}
        <div
          ref={scene4Ref}
          className="absolute inset-0 opacity-0 pointer-events-none flex items-center justify-center px-8"
        >
          <div className="max-w-3xl text-center space-y-6 border border-gold/40 bg-[#0A2229] p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-light">
              SCENE 04 · MAKE IT YOURS
            </p>
            <h2 className="font-serif text-5xl text-ivory leading-tight">
              WHAT WOULD YOU MAKE FROM YOUR WASTE?
            </h2>
            <p className="text-ivory/80 max-w-xl mx-auto">
              Send us your discarded plastic bottles, caps, cans, or fabrics and
              co-create a one-of-one piece.
            </p>
            <a
              href="#create"
              className="inline-flex items-center gap-2 bg-gold text-teal-abyss px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-ivory transition-colors"
            >
              CREATE YOUR OWN
              <ArrowDownRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* SCENE 5: A CIRCULAR FUTURE */}
        <div
          ref={scene5Ref}
          className="absolute inset-0 opacity-0 pointer-events-none flex items-center justify-center px-8"
        >
          <div className="relative w-[560px] h-[560px] rounded-full border border-gold/45 flex flex-col items-center justify-center text-center p-12 bg-[#081E25]/90">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-light">
              SCENE 05 · A CIRCULAR FUTURE
            </p>
            <h2 className="font-serif text-4xl xl:text-5xl text-ivory mt-4 leading-tight">
              NOT THE END OF A MATERIAL. THE BEGINNING OF SOMETHING ELSE.
            </h2>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET RESPONSIVE SEQUENCE (< lg) */}
      <div className="lg:hidden px-5 pt-24 pb-16 space-y-10">
        <div className="space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold-light">
            THE WORTH TUNNEL · TRASH → TREASURE
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] text-ivory">
            WE SEE WHAT OTHERS THROW AWAY.
          </h1>
          <p className="text-ivory/80 text-base leading-relaxed">
            Your discarded materials. Our creative imagination. Together,
            something worth keeping.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="#create"
              className="inline-flex items-center gap-2 bg-gold text-teal-abyss px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Create Your Own
              <ArrowDownRight className="w-4 h-4" />
            </a>
            <a
              href="#collection"
              className="inline-flex items-center gap-2 border border-ivory/40 text-ivory px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Explore Creations
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {WASTE_FRAMES.map((frame) => (
            <div
              key={frame.src}
              className="relative aspect-[4/3] border border-gold/25 overflow-hidden"
            >
              <Image
                src={frame.src}
                alt={frame.label}
                fill
                sizes="50vw"
                className="object-cover"
              />
              <span className="absolute bottom-1.5 left-1.5 bg-teal-abyss/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-gold-light">
                {frame.label}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gold/25 pt-6 space-y-2 text-center">
          <p className="font-serif italic text-2xl text-gold-light">
            &ldquo;Not the end of a material. The beginning of something else.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
