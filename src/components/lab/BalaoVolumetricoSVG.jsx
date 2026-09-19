/**
 * BalaoVolumetricoSVG.jsx — Balão Volumétrico 10 mL
 *
 * Props:
 *   nivel — 0–100, nível de líquido destilado (%)
 *   id    — sufixo para IDs SVG únicos (obrigatório quando múltiplos na página)
 */
import React from 'react';

const BalaoVolumetricoSVG = ({ nivel = 0, id = 'bv' }) => {
  const CX = 35;
  // Flask path: thin neck + spherical body (bezier shoulders)
  const fp = `M 32,6 L 38,6 L 38,50 Q 45,58 57,75 A 22,22,0,0,1,13,75 Q 25,58 32,50 Z`;
  const bodyBottom = 97;  // y=75+22
  const calibY     = 18;  // calibration mark
  const liqRange   = bodyBottom - calibY;
  const liqY       = bodyBottom - (nivel / 100) * liqRange;

  return (
    <svg width="72" height="110" viewBox="0 0 72 110">
      <defs>
        <clipPath id={`bvClip${id}`}><path d={fp} /></clipPath>
        <linearGradient id={`bvGlass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.52)" />
          <stop offset="20%"  stopColor="rgba(215,238,255,0.14)" />
          <stop offset="72%"  stopColor="rgba(210,235,255,0.07)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.40)" />
        </linearGradient>
      </defs>

      <ellipse cx={CX} cy={104} rx={20} ry={4} fill="rgba(0,0,0,0.16)" />

      {/* Líquido destilado */}
      <g clipPath={`url(#bvClip${id})`}>
        {nivel > 0 && (
          <>
            <rect x={10} y={liqY} width={50} height={bodyBottom - liqY + 2}
              fill="rgba(140,210,245,0.68)" />
            <rect x={28} y={liqY} width={14} height={2.5} rx="1.2"
              fill="rgba(255,255,255,0.22)" />
          </>
        )}
      </g>

      {/* Vidro */}
      <path d={fp} fill={`url(#bvGlass${id})`} stroke="#8ac4dc" strokeWidth="1.8" />

      {/* Reflexo esquerdo */}
      <line x1="32.5" y1="9" x2="32.5" y2="48"
        stroke="rgba(255,255,255,0.40)" strokeWidth="2" strokeLinecap="round" />

      {/* Borda superior (abertura) */}
      <ellipse cx={CX} cy="6" rx="6" ry="2.5"
        fill="rgba(185,228,255,0.40)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* Marca de calibração */}
      <line x1="28" y1={calibY} x2="42" y2={calibY}
        stroke="rgba(6,32,85,0.75)" strokeWidth="1.4" />
      <text x="46" y={calibY + 3.5} fontSize="5.5" fill="rgba(6,32,85,0.55)"
        fontFamily="monospace">10mL</text>

      {/* Rótulo no corpo */}
      <rect x="17" y="80" width="36" height="11" rx="2"
        fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
      <text x={CX} y="88.5" textAnchor="middle" fontSize="6.5"
        fill="#0d2137" fontFamily="monospace" fontWeight="700">10 mL</text>
    </svg>
  );
};

export default BalaoVolumetricoSVG;
