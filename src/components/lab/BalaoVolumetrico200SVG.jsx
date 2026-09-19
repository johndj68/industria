/**
 * BalaoVolumetrico200SVG.jsx — Balão Volumétrico 200 mL
 *
 * Props:
 *   nivel — 0–100, nível de líquido (%)
 *   cor   — cor CSS do líquido
 *   id    — sufixo para IDs SVG únicos (obrigatório quando múltiplos na página)
 */
import React from 'react';

const BalaoVolumetrico200SVG = ({
  nivel = 0,
  cor   = 'rgba(140,210,245,0.68)',
  id    = 'b200',
}) => {
  const CX = 46;
  const fp = `M 42,6 L 50,6 L 50,58 Q 62,70 79,92 A 29,29,0,0,1,13,92 Q 30,70 42,58 Z`;
  const bodyBottom = 121;
  const calibY     = 24;
  const liqRange   = bodyBottom - calibY;
  const liqY       = bodyBottom - (nivel / 100) * liqRange;

  return (
    <svg width="94" height="140" viewBox="0 0 94 140">
      <defs>
        <clipPath id={`b200Clip${id}`}><path d={fp} /></clipPath>
        <linearGradient id={`b200Glass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.52)" />
          <stop offset="20%"  stopColor="rgba(215,238,255,0.14)" />
          <stop offset="72%"  stopColor="rgba(210,235,255,0.07)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.40)" />
        </linearGradient>
      </defs>

      <ellipse cx={CX} cy={133} rx={26} ry={5} fill="rgba(0,0,0,0.15)" />

      {/* Líquido */}
      <g clipPath={`url(#b200Clip${id})`}>
        {nivel > 0 && (
          <>
            <rect x={10} y={liqY} width={68} height={bodyBottom - liqY + 2} fill={cor} />
            <rect x={32} y={liqY} width={18} height={2.5} rx="1.2" fill="rgba(255,255,255,0.22)" />
          </>
        )}
      </g>

      {/* Vidro */}
      <path d={fp} fill={`url(#b200Glass${id})`} stroke="#8ac4dc" strokeWidth="1.8" />

      {/* Reflexo */}
      <line x1="42.5" y1="9" x2="42.5" y2="55"
        stroke="rgba(255,255,255,0.40)" strokeWidth="2" strokeLinecap="round" />

      {/* Abertura */}
      <ellipse cx={CX} cy="6" rx="8" ry="3"
        fill="rgba(185,228,255,0.40)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* Calibração */}
      <line x1="36" y1={calibY} x2="56" y2={calibY}
        stroke="rgba(6,32,85,0.75)" strokeWidth="1.4" />
      <text x="60" y={calibY + 3.5} fontSize="5.5" fill="rgba(6,32,85,0.55)"
        fontFamily="monospace">200mL</text>

      {/* Rótulo */}
      <rect x="22" y="100" width="48" height="12" rx="2"
        fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
      <text x={CX} y="109" textAnchor="middle" fontSize="6.5"
        fill="#0d2137" fontFamily="monospace" fontWeight="700">200 mL</text>
    </svg>
  );
};

export default BalaoVolumetrico200SVG;
