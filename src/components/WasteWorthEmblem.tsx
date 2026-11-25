import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export function WasteWorthLeafMark({ className = '', size = 36 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wwTealLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1F758D" />
          <stop offset="55%" stopColor="#0D3F50" />
          <stop offset="100%" stopColor="#06222C" />
        </linearGradient>
        <linearGradient id="wwGoldLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1D794" />
          <stop offset="45%" stopColor="#C69D52" />
          <stop offset="100%" stopColor="#8A6424" />
        </linearGradient>
      </defs>
      {/* Left lower teal petal */}
      <path
        d="M57 128 C25 112 8 82 14 48 C34 58 50 86 57 128 Z"
        fill="url(#wwTealLeaf)"
        stroke="url(#wwGoldLeaf)"
        strokeWidth="1.8"
      />
      {/* Left middle teal petal */}
      <path
        d="M58 122 C35 90 28 52 44 26 C55 46 60 80 58 122 Z"
        fill="url(#wwTealLeaf)"
        stroke="url(#wwGoldLeaf)"
        strokeWidth="1.8"
      />
      {/* Right lower teal-gold petal */}
      <path
        d="M63 128 C96 112 112 80 104 44 C84 58 68 88 63 128 Z"
        fill="url(#wwTealLeaf)"
        stroke="url(#wwGoldLeaf)"
        strokeWidth="1.8"
      />
      {/* Center-right champagne gold main leaf */}
      <path
        d="M60 8 C82 32 88 74 60 128 C44 92 44 44 60 8 Z"
        fill="url(#wwGoldLeaf)"
        stroke="#F5E2AC"
        strokeWidth="1.2"
      />
      {/* Central vein */}
      <line
        x1="60"
        y1="14"
        x2="60"
        y2="128"
        stroke="#07222B"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function WasteWorthWordmark({
  dark = false,
  className = '',
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <WasteWorthLeafMark size={30} />
      <span className="font-serif text-2xl tracking-tight leading-none font-semibold">
        <span className={dark ? 'text-ivory' : 'text-teal-deep'}>Waste</span>
        <span className="text-gold">Worth</span>
      </span>
    </span>
  );
}
