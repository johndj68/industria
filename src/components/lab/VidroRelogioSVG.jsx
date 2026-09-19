/**
 * VidroRelogioSVG.jsx — Vidro Relógio (tampa côncava de laboratório)
 */
import React from 'react';

const VidroRelogioSVG = () => (
  <svg width="70" height="30" viewBox="0 0 70 30">
    <defs>
      <linearGradient id="vrGlass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="rgba(185,225,255,0.52)" />
        <stop offset="20%"  stopColor="rgba(215,238,255,0.14)" />
        <stop offset="80%"  stopColor="rgba(215,238,255,0.10)" />
        <stop offset="100%" stopColor="rgba(170,215,252,0.42)" />
      </linearGradient>
    </defs>
    <ellipse cx={35} cy={26} rx={28} ry={4} fill="rgba(0,0,0,0.12)" />
    <path d="M5,22 Q35,-6 65,22" fill="url(#vrGlass)" stroke="#8ac4dc" strokeWidth="1.5" />
    <path d="M5,22 Q35,10 65,22" fill="rgba(185,228,255,0.14)" stroke="none" />
    <line x1={10} y1={20} x2={22} y2={10} stroke="rgba(255,255,255,0.38)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default VidroRelogioSVG;
