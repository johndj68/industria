/**
 * CubetaSVG.jsx — Cubeta de Vidro Quadrada 25 mm / 10 mL
 *
 * Props:
 *   cor   — cor CSS do líquido
 *   nivel — 0–100, nível de líquido (%)
 *   id    — sufixo para IDs SVG únicos (obrigatório quando múltiplas na página)
 */
import React from 'react';

const CubetaSVG = ({ cor = 'rgba(220,235,255,0.08)', nivel = 0, id = 'cv' }) => {
  const W = 56, H = 84, wall = 3.5;
  const iW = W - wall * 2, iH = H - wall * 2 - 4;
  const lH = (nivel / 100) * iH, lY = wall + iH - lH;
  return (
    <svg width={W + 24} height={H + 34} viewBox={`0 0 ${W + 24} ${H + 34}`}>
      <defs>
        <linearGradient id={`cg${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,230,255,0.44)" />
          <stop offset="30%"  stopColor="rgba(220,240,255,0.14)" />
          <stop offset="70%"  stopColor="rgba(220,240,255,0.08)" />
          <stop offset="100%" stopColor="rgba(200,230,255,0.36)" />
        </linearGradient>
        <clipPath id={`cc${id}`}>
          <rect x={wall} y={wall} width={iW} height={iH} />
        </clipPath>
      </defs>
      <g transform="translate(12,6)">
        <ellipse cx={W / 2} cy={H + 6} rx={W / 2 - 4} ry="4" fill="rgba(0,0,0,0.22)" />
        <g clipPath={`url(#cc${id})`}>
          <rect x={wall} y={lY} width={iW} height={lH} fill={cor}>
            {cor === 'rgba(25,90,198,0.80)' && (
              <animate attributeName="opacity" from="0.5" to="0.88" dur="1.5s" fill="freeze" />
            )}
          </rect>
          {nivel > 5 && (
            <rect x={wall + 2} y={lY + 1} width={iW - 4} height="2" rx="1" fill="rgba(255,255,255,0.22)" />
          )}
        </g>
        <rect x="0" y="0" width={W} height={H} rx="2"
          fill={`url(#cg${id})`} stroke="#a0c0da" strokeWidth="1.8" />
        <rect x="0" y="0" width={wall} height={H} rx="1" fill="rgba(255,255,255,0.28)" />
        <rect x={W - wall} y="0" width={wall} height={H} rx="1" fill="rgba(255,255,255,0.11)" />
        <rect x="0" y={H - wall} width={W} height={wall} rx="1" fill="rgba(200,225,245,0.32)" />
        <rect x="-2" y="-3" width={W + 4} height="6" rx="2"
          fill="rgba(180,215,240,0.26)" stroke="#9ab8d0" strokeWidth="1.1" />
        <rect x="6" y="10" width="4" height={H * 0.56} rx="2" fill="rgba(255,255,255,0.26)" />
        <rect x={W / 2 - 18} y={H - 22} width="36" height="18" rx="3"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.7" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="6.5"
          fill="#0d2137" fontFamily="monospace" fontWeight="700">10 mL</text>
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="5.2"
          fill="#1a3a5e" fontFamily="sans-serif">25 mm</text>
      </g>
    </svg>
  );
};

export default CubetaSVG;
