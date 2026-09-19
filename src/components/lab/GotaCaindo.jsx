/**
 * GotaCaindo.jsx — Gota animada caindo (bureta → erlenmeyer)
 *
 * Props:
 *   offsetX   — deslocamento horizontal em px relativo ao centro (50%)
 *   animKey   — key única para forçar re-mount da animação
 *   animName  — nome do @keyframe CSS a usar
 *   delay     — delay em ms antes da animação iniciar
 */
import React from 'react';

const GotaCaindo = ({ offsetX = 0, animKey = 'a', animName = 'alcDropFall', delay = 0 }) => (
  <div
    key={animKey}
    style={{
      position: 'absolute',
      left: `calc(50% + ${offsetX}px)`,
      top: 4,
      width: 10,
      height: 22,
      pointerEvents: 'none',
      zIndex: 30,
      animationName: animName,
      animationDuration: '0.52s',
      animationDelay: `${delay}ms`,
      animationFillMode: 'forwards',
      animationTimingFunction: 'ease-in',
    }}
  >
    <svg width="10" height="22" viewBox="0 0 10 22">
      {/* Risco/cauda da gota */}
      <line x1="5" y1="1" x2="5" y2="9" stroke="rgba(215,55,42,0.60)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Corpo arredondado */}
      <ellipse cx="5" cy="16" rx="4" ry="5.5" fill="rgba(215,55,42,0.88)" />
      {/* Brilho */}
      <ellipse cx="3.5" cy="13.5" rx="1.2" ry="1.8" fill="rgba(255,180,170,0.45)" />
    </svg>
  </div>
);

export default GotaCaindo;
