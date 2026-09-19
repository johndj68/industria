/**
 * CopoTransparenteSVG.jsx — Copo de Béquer Transparente (Branco ou Amostra)
 *
 * Props:
 *   nivel — 0–100, nível de líquido (%)
 *   cor   — cor CSS do líquido
 *   id    — sufixo para IDs SVG únicos (obrigatório quando múltiplos na página)
 */
import React from 'react';

const CopoTransparenteSVG = ({ nivel = 0, cor = 'rgba(100,180,255,0.4)', id = 'g1' }) => {
  const W = 64, H = 88, bx = 6, by = 8, bw = W - 12, bh = H - 14;
  const lH = (nivel / 100) * bh, lY = by + bh - lH;
  return (
    <svg width={W + 16} height={H + 22} viewBox={`0 0 ${W + 16} ${H + 22}`}>
      <defs>
        <clipPath id={`gc${id}`}>
          <path d={`M${bx + 8},${by} L${bx},${by + bh} L${bx + bw},${by + bh} L${bx + bw - 8},${by} Z`} />
        </clipPath>
        <linearGradient id={`gg${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,230,255,0.36)" />
          <stop offset="20%"  stopColor="rgba(220,240,255,0.1)" />
          <stop offset="80%"  stopColor="rgba(220,240,255,0.07)" />
          <stop offset="100%" stopColor="rgba(200,230,255,0.26)" />
        </linearGradient>
      </defs>
      <g transform="translate(8,6)">
        <ellipse cx={W / 2} cy={H + 8} rx={W / 2 - 4} ry="4" fill="rgba(0,0,0,0.18)" />
        <path d={`M${bx + bw - 8},${by} Q${bx + bw + 4},${by - 6} ${bx + bw + 4},${by}`}
          fill="none" stroke="#9ab8d0" strokeWidth="1.5" />
        <g clipPath={`url(#gc${id})`}>
          <rect x={bx} y={lY} width={bw} height={lH + 4} fill={cor} />
        </g>
        <path d={`M${bx + 8},${by} L${bx},${by + bh} L${bx + bw},${by + bh} L${bx + bw - 8},${by} Z`}
          fill={`url(#gg${id})`} stroke="#9ab8d0" strokeWidth="1.6" />
        <path d={`M${bx + 8},${by} L${bx},${by + bh} L${bx + 3},${by + bh} L${bx + 10.5},${by} Z`}
          fill="rgba(255,255,255,0.22)" />
        <path d={`M${bx + 6},${by - 2} L${bx + bw - 6},${by - 2}`}
          stroke="#9ab8d0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {[25, 50, 75].map(p => {
          const y = by + bh * (1 - p / 100);
          return (
            <g key={p}>
              <line x1={bx + 2} y1={y} x2={bx + 9} y2={y} stroke="rgba(14,50,140,0.55)" strokeWidth="0.9" />
              <text x={bx + 11} y={y + 3.5} fontSize="6" fill="rgba(14,50,140,0.5)" fontFamily="monospace">{p}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default CopoTransparenteSVG;
