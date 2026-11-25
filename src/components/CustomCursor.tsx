'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 28, stiffness: 320, mass: 0.4 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    if (prefersReduced) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, input, select, textarea, [data-cursor="interactive"]');
      setIsHoveringInteractive(Boolean(interactive));
    };

    const leave = () => setIsVisible(false);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, [prefersReduced, cursorX, cursorY]);

  if (prefersReduced || !isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70 mix-blend-difference hidden lg:block"
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        width: isHoveringInteractive ? 44 : 24,
        height: isHoveringInteractive ? 44 : 24,
        backgroundColor: isHoveringInteractive
          ? 'rgba(198, 157, 82, 0.16)'
          : 'transparent',
      }}
      transition={{ duration: 0.18 }}
    />
  );
}
