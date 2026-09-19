/**
 * ErlenmeyerSVG.jsx — Erlenmeyer 250 mL
 *
 * Props:
 *   nivel — 0–100, nível de líquido (%)
 *   cor   — cor CSS do líquido
 *   id    — sufixo para IDs SVG únicos (obrigatório quando múltiplos na página)
 */
import React from 'react';

const ErlenmeyerSVG = ({ nivel = 0, cor = 'rgba(220,235,255,0.08)', id = 'erl' }) => {
  const CX = 46, nW = 9, bW = 42;
  const nTop = 10, nBot = 44, bBot = 96;
  const lH = (nivel / 100) * (bBot - nTop);
  const lY = bBot - lH;
  const fp = `M${CX-nW},${nTop} L${CX+nW},${nTop} L${CX+nW},${nBot} L${CX+bW},${bBot} L${CX-bW},${bBot} L${CX-nW},${nBot} Z`;

  return (
    <svg width="92" height="120" viewBox="0 0 92 120">
      <defs>
        <clipPath id={`erlClip${id}`}><path d={fp} /></clipPath>
        <linearGradient id={`erlGlass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.52)" />
          <stop offset="18%"  stopColor="rgba(215,238,255,0.14)" />
          <stop offset="72%"  stopColor="rgba(210,235,255,0.07)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.40)" />
        </linearGradient>
      </defs>
      <ellipse cx={CX} cy={110} rx={38} ry={5} fill="rgba(0,0,0,0.16)" />
      <g clipPath={`url(#erlClip${id})`}>
        {nivel > 0 && (
          <>
            <rect x={CX - bW} y={lY} width={bW * 2} height={lH + 2} fill={cor} />
            <rect x={CX - 5} y={lY} width={10} height={2.5} rx="1.2" fill="rgba(255,255,255,0.20)" />
          </>
        )}
      </g>
      <path d={fp} fill={`url(#erlGlass${id})`} stroke="#8ac4dc" strokeWidth="1.8" />
      <line x1={CX - nW + 2} y1={nTop + 6}  x2={CX - nW + 2} y2={nBot - 4}  stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={CX - nW + 2} y1={nBot}       x2={CX - bW + 6} y2={bBot - 6}  stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx={CX} cy={nTop} rx={nW + 2.5} ry={3.5} fill="rgba(185,228,255,0.40)" stroke="#8ac4dc" strokeWidth="1.3" />
      <ellipse cx={CX} cy={nTop} rx={nW - 1}   ry={1.8} fill="none" stroke="rgba(100,170,222,0.28)" strokeWidth="0.7" />
      <line x1={CX - bW + 5} y1={bBot} x2={CX + bW - 5} y2={bBot} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x={CX - 18} y={bBot - 30} width={36} height={14} rx="3" fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
      <text x={CX} y={bBot - 20} textAnchor="middle" fontSize="6.5" fill="#0d2137" fontFamily="monospace" fontWeight="700">250 mL</text>
    </svg>
  );
};

export default ErlenmeyerSVG;
