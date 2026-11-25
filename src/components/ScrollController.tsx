'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __wwScrollTo?: (target: string | HTMLElement) => void;
  }
}

export function ScrollController() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let lenis: Lenis | null = null;
    let tickHandler: ((time: number) => void) | null = null;

    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.0,
        prevent: (node) =>
          Boolean(
            node.closest(
              '[role="dialog"], textarea, input, select, [data-lenis-prevent]'
            )
          ),
      });

      lenis.on('scroll', ScrollTrigger.update);

      tickHandler = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickHandler);
      gsap.ticker.lagSmoothing(0);
    }

    const scrollToTarget = (target: string | HTMLElement) => {
      const el =
        typeof target === 'string'
          ? document.getElementById(target.replace(/^#/, ''))
          : target;
      if (!el) return;
      if (lenis && !prefersReduced) {
        lenis.scrollTo(el, { offset: -64 });
      } else {
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    };

    window.__wwScrollTo = scrollToTarget;

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => scrollToTarget(id));
    }

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetEl = document.getElementById(href.slice(1));
      if (!targetEl) return;

      e.preventDefault();
      if (window.location.hash !== href) {
        window.history.pushState(null, '', href);
      }
      scrollToTarget(targetEl);
    };

    const handleHashOrPop = () => {
      if (window.location.hash) {
        scrollToTarget(window.location.hash.slice(1));
      } else if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0 });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('hashchange', handleHashOrPop);
    window.addEventListener('popstate', handleHashOrPop);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', handleHashOrPop);
      window.removeEventListener('popstate', handleHashOrPop);
      delete window.__wwScrollTo;
      if (tickHandler) gsap.ticker.remove(tickHandler);
      lenis?.destroy();
    };
  }, []);

  return null;
}
