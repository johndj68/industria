/**
 * MicropipetaSVG.jsx — SVG Micropipeta com Ponteira Montada
 *
 * Props:
 *   nivel      — 0–100, nível de líquido na ponteira/câmara
 *   corLiq     — cor CSS do líquido aspirado
 *   volume     — valor exibido no display LCD (µL)
 *   tipMounted — índice da ponteira montada (0=P20, 1=P200, 2=P1000) ou null
 */
import React from 'react';

const MicropipetaSVG = ({ nivel = 0, corLiq = '#93c5fd', volume = 20, tipMounted = null }) => {
  const tipDefs = [
    { cor: '#c084fc', altTip: 18, rTip: 3.5 },
    { cor: '#4ade80', altTip: 24, rTip: 4.5 },
    { cor: '#fbbf24', altTip: 32, rTip: 5.5 },
  ];
  const tip = tipMounted !== null ? tipDefs[tipMounted] : null;

  return (
    <svg
      width="58"
      height={190 + (tip ? tip.altTip + 10 : 0)}
      viewBox={`0 0 58 ${190 + (tip ? tip.altTip + 10 : 0)}`}>

      <defs>
        <linearGradient id="pipB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1a78c2" />
          <stop offset="60%"  stopColor="#1565c0" />
          <stop offset="100%" stopColor="#0a2d6e" />
        </linearGradient>
        <linearGradient id="pipS" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="pipClip">
          <rect x="17" y="42" width="22" height="98" rx="7" />
        </clipPath>
      </defs>

      {/* Botão plunger */}
      <ellipse cx="29" cy="11" rx="14" ry="10"
        fill="#ef5350" stroke="#b71c1c" strokeWidth="1.5" />
      <ellipse cx="29" cy="9" rx="10" ry="6.5"
        fill="rgba(255,160,160,0.35)" />
      <text x="29" y="12" textAnchor="middle" fontSize="5.5"
        fill="rgba(255,255,255,0.6)" fontFamily="sans-serif">▲</text>

      {/* Corpo */}
      <rect x="14" y="20" width="30" height="135" rx="13"
        fill="url(#pipB)" stroke="#0a2d6e" strokeWidth="1.5" />
      <rect x="16" y="22" width="28" height="133" rx="12"
        fill="url(#pipS)" />

      {/* Display LCD */}
      <rect x="17" y="30" width="24" height="26" rx="4"
        fill="#091220" stroke="#00bcd4" strokeWidth="1.1" />
      <rect x="19" y="32" width="20" height="22" rx="3"
        fill="#001428" />
      <text x="29" y="46" textAnchor="middle" fontSize="9"
        fill="#00e5ff" fontFamily="monospace" fontWeight="700">{volume}</text>
      <text x="29" y="53.5" textAnchor="middle" fontSize="5"
        fill="rgba(0,229,255,0.55)" fontFamily="sans-serif">µL</text>

      {/* Líquido */}
      {!tip && (
      <g clipPath="url(#pipClip)">
        <rect x="17" y={140 - nivel} width="22" height={nivel}
          fill={corLiq} opacity="0.85" />
      </g>
      )}

      {/* Nervuras de grip */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x="16" y={100 + i * 9} width="26" height="4" rx="2"
          fill="rgba(255,255,255,0.06)" />
      ))}

      {/* Botão ejetar */}
      <rect x="18" y="140" width="22" height="13" rx="5"
        fill="#1a2f4f" stroke="#2196f3" strokeWidth="0.9" />
      <text x="29" y="149.5" textAnchor="middle" fontSize="5.5"
        fill="#64b5f6" fontFamily="sans-serif">EJECT</text>

      {/* Nozzle */}
      <rect x="24" y="152" width="10" height="12" rx="3"
        fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="26" y="162" width="6" height="5" rx="1.5"
        fill="#0f172a" />

      {/* Ponteira montada */}
      {tip && (
        <g>
          <polygon
            points={`
              ${29 - tip.rTip},167 ${29 + tip.rTip},167
              ${29 + 2},${167 + tip.altTip}
              ${29 - 2},${167 + tip.altTip}
            `}
            fill={tip.cor} opacity="0.75"
            stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />

          {nivel > 0 && (
          (() => {
            const yBase = 167;
            const alturaLiquido = (nivel / 100) * tip.altTip;
            const yTopo = yBase + tip.altTip - alturaLiquido;

            return (
              <polygon
                points={`
                  ${29 - tip.rTip + 1},${yTopo}
                  ${29 + tip.rTip - 1},${yTopo}
                  ${29 + 1.5},${167 + tip.altTip - 1}
                  ${29 - 1.5},${167 + tip.altTip - 1}
                `}
                fill={corLiq}
                opacity="0.85"
              />
            );
          })()
        )}

          <polygon
            points={`
              ${29 - tip.rTip + 1},167
              ${29 - tip.rTip + 2.5},167
              ${29 - 1.2},${167 + tip.altTip}
              ${29 - 2},${167 + tip.altTip}
            `}
            fill="rgba(255,255,255,0.28)" />
        </g>
      )}
    </svg>
  );
};

export default MicropipetaSVG;
