/**
 * BalaoBancada.jsx — SVG Erlenmeyer de Descarte
 *
 * Props:
 *   nivel — 0–100, nível de líquido no frasco
 *   cor   — cor CSS do líquido
 */
import React from 'react';

const BalaoBancada = ({ nivel = 20, cor = 'rgba(150,200,255,0.3)' }) => (
  <svg width="80" height="110" viewBox="0 0 80 110">
    <defs>
      <clipPath id="balClip">
        <path d="M25,28 L6,88 Q6,98,16,98 L64,98 Q74,98,74,88 L55,28 Z" />
      </clipPath>
    </defs>

    <rect x="33" y="0" width="14" height="30"
      fill="rgba(200,235,255,0.12)" stroke="#94a3b8" strokeWidth="1.4" />
    <rect x="29" y="-2" width="22" height="8" rx="3"
      fill="#455a64" stroke="#37474f" strokeWidth="1" />
    <path d="M25,28 L6,88 Q6,98,16,98 L64,98 Q74,98,74,88 L55,28 Z"
      fill="rgba(200,235,255,0.09)" stroke="#94a3b8" strokeWidth="1.4" />

    <g clipPath="url(#balClip)">
      <rect x="6" y={98 - nivel * 0.65} width="68" height={nivel * 0.65}
        fill={cor} opacity="0.88" />
    </g>

    <path d="M12,34 L9,82"
      stroke="rgba(255,255,255,0.2)" strokeWidth="5"
      strokeLinecap="round" fill="none" />

    <text x="40" y="106" textAnchor="middle" fontSize="7"
      fill="#94a3b8" fontFamily="sans-serif">Descarte</text>
  </svg>
);

export default BalaoBancada;
