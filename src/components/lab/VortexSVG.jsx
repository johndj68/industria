/**
 * VortexSVG.jsx — SVG Agitador Vórtex de Laboratório
 *
 * Props:
 *   ligado — boolean; alterna estado visual ON/OFF e anima o rotor
 *   ang    — ângulo atual do rotor (incrementado externamente via RAF)
 */
import React from 'react';

const VortexSVG = ({ ligado, ang }) => (
  <svg width="92" height="108" viewBox="0 0 92 108">
    <defs>
      <radialGradient id="vtop" cx="42%" cy="38%">
        <stop offset="0%"   stopColor={ligado ? '#64b5f6' : '#546e7a'} />
        <stop offset="100%" stopColor={ligado ? '#1565c0' : '#263238'} />
      </radialGradient>
      <linearGradient id="vbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#2a3a50" />
        <stop offset="100%" stopColor="#18253a" />
      </linearGradient>
    </defs>

    <rect x="5" y="56" width="82" height="48" rx="8"
      fill="url(#vbody)" stroke="#0d1117" strokeWidth="1.5" />
    <rect x="10" y="8" width="72" height="52" rx="10"
      fill="#263238" stroke="#1a2233" strokeWidth="1.5" />

    <ellipse cx="46" cy="22" rx="29" ry="18"
      fill="url(#vtop)"
      stroke={ligado ? '#1e88e5' : '#37474f'} strokeWidth="1.5" />
    <ellipse cx="46" cy="22" rx="15" ry="10"
      fill={ligado ? '#1565c0' : '#1a1a2e'} />

    {ligado && (
      <>
        <g transform={`rotate(${ang}, 46, 22)`}>
          {[0, 90, 180, 270].map(d => {
            const r = d * Math.PI / 180;
            return (
              <circle key={d}
                cx={46 + Math.cos(r) * 9} cy={22 + Math.sin(r) * 6}
                r="2.5" fill="rgba(100,200,255,0.75)" />
            );
          })}
        </g>
        <ellipse cx="46" cy="22" rx="27" ry="16"
          fill="none" stroke="rgba(100,200,255,0.12)" strokeWidth="7" />
      </>
    )}

    <circle cx="16" cy="72" r="5.5" fill={ligado ? '#69f0ae' : '#616161'} />
    {ligado && (
      <circle cx="16" cy="72" r="8"
        fill="none" stroke="rgba(105,240,174,0.3)" strokeWidth="2.5" />
    )}

    <circle cx="75" cy="72" r="8" fill="#37474f" stroke="#546e7a" strokeWidth="1" />
    <line x1="75" y1="72" x2="75" y2="65"
      stroke="#b0bec5" strokeWidth="1.5" strokeLinecap="round"
      transform={`rotate(${ligado ? ang * 0.3 : 0}, 75, 72)`} />

    <rect x="30" y="79" width="32" height="14" rx="5"
      fill={ligado ? '#1b5e20' : '#b71c1c'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <text x="46" y="89.5" textAnchor="middle" fontSize="7.5"
      fill="white" fontWeight="700">{ligado ? 'ON' : 'OFF'}</text>
  </svg>
);

export default VortexSVG;
