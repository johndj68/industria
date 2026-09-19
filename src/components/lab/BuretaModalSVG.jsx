/**
 * BuretaModalSVG.jsx — Bureta volumétrica 50 mL para modal de resultado
 *
 * Props:
 *   volumeGasto — volume lido na titulação (ex: 48.3 mL)
 *                 Faixa esperada: 47.1 – 50.9 mL
 */
import React from 'react';

const BuretaModalSVG = ({ volumeGasto = 47.1 }) => {
  const normalizado   = Math.min(Math.max((volumeGasto - 47.1) / 3.8, 0), 1);
  const alturaLiquido = 58 + normalizado * 86;
  const yLiquido      = 184 - alturaLiquido;

  return (
    <svg width="128" height="238" viewBox="0 0 128 238" role="img" aria-label="Bureta volumétrica">
      <defs>
        <linearGradient id="bmGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"    stopColor="#e0f2fe" stopOpacity="0.14" />
          <stop offset="0.22" stopColor="#ffffff" stopOpacity="0.44" />
          <stop offset="0.50" stopColor="#7dd3fc" stopOpacity="0.10" />
          <stop offset="0.78" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1"    stopColor="#0891b2" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="bmLiquido" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0"    stopColor="#7dd3fc" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#0ea5e9" stopOpacity="0.88" />
          <stop offset="1"    stopColor="#0369a1" stopOpacity="0.92" />
        </linearGradient>
        <filter id="bmGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* haste de suporte */}
      <line x1="22" y1="14" x2="22" y2="218" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <rect x="12" y="34"  width="25" height="9" rx="3" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
      <rect x="12" y="144" width="25" height="9" rx="3" fill="#94a3b8" stroke="#334155" strokeWidth="1" />

      {/* tubo da bureta */}
      <rect x="48" y="12" width="27" height="172" rx="8" fill="url(#bmGlass)" stroke="#67e8f9" strokeWidth="2.3" />

      {/* líquido */}
      <rect
        x="50.6"
        y={yLiquido}
        width="21.8"
        height={alturaLiquido}
        fill="url(#bmLiquido)"
        opacity="0.82"
      />
      <path
        d={`M 51 ${yLiquido + 1.8} Q 61.5 ${yLiquido - 3.2} 72 ${yLiquido + 1.8}`}
        fill="none"
        stroke="#e0f2fe"
        strokeWidth="1.6"
        opacity="0.9"
      />

      {/* brilhos do vidro */}
      <rect x="53" y="18" width="4" height="158" rx="2" fill="#ffffff" opacity="0.30" />
      <rect x="67" y="22" width="2" height="150" rx="1" fill="#ffffff" opacity="0.18" />

      {/* graduações */}
      {Array.from({ length: 21 }, (_, i) => {
        const y     = 22 + i * 7.5;
        const major = i % 5 === 0;
        return (
          <g key={i}>
            <line
              x1={major ? 48 : 55}
              y1={y}
              x2="75"
              y2={y}
              stroke={major ? '#e0f2fe' : '#bae6fd'}
              strokeWidth={major ? 1.25 : 0.7}
              opacity={major ? 0.72 : 0.42}
            />
            {major && (
              <text x="82" y={y + 3} fill="#94a3b8" fontSize="7" fontFamily="monospace">
                {50 - i * 0.5}
              </text>
            )}
          </g>
        );
      })}

      {/* torneira */}
      <rect x="55" y="184" width="14" height="14" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
      <ellipse cx="62" cy="191" rx="20" ry="5" fill="#64748b" stroke="#334155" strokeWidth="1" />
      <circle cx="62" cy="191" r="3" fill="#0f172a" />

      {/* ponta fina */}
      <path d="M 58 198 L 66 198 L 64 224 Q 62 232 60 224 Z" fill="url(#bmGlass)" stroke="#67e8f9" strokeWidth="1.5" />
      <circle cx="62" cy="226" r="2.5" fill="#38bdf8" filter="url(#bmGlow)" />
    </svg>
  );
};

export default BuretaModalSVG;
