/**
 * EspatulaSVG.jsx — SVG Espátula Metálica de Laboratório
 *
 * Props:
 *   espatulaComPo — boolean; exibe círculo branco na pá quando true
 */
import React from 'react';

const EspatulaSVG = ({ espatulaComPo }) => (

  <svg width="28" height="130" viewBox="0 0 28 130">
    <defs>
      <linearGradient id="espMetal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#78909c" />
        <stop offset="30%"  stopColor="#b0bec5" />
        <stop offset="55%"  stopColor="#eceff1" />
        <stop offset="75%"  stopColor="#b0bec5" />
        <stop offset="100%" stopColor="#78909c" />
      </linearGradient>
      <linearGradient id="espPega" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#37474f" />
        <stop offset="40%"  stopColor="#546e7a" />
        <stop offset="60%"  stopColor="#607d8b" />
        <stop offset="100%" stopColor="#37474f" />
      </linearGradient>
      <linearGradient id="espReflexo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="rgba(255,255,255,0)"   />
        <stop offset="50%"  stopColor="rgba(255,255,255,0.45)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)"   />
      </linearGradient>
    </defs>

    {/* Haste principal */}
    <rect x="11" y="10" width="6" height="88" rx="3"
      fill="url(#espMetal)" />

    {/* Reflexo sutil na haste */}
    <rect x="13" y="12" width="2" height="84" rx="1"
      fill="url(#espReflexo)" opacity="0.6" />

    {/* Pá (lâmina achatada na ponta) */}
    <rect x="8" y="93" width="12" height="28" rx="2"
      fill="url(#espMetal)" />
      {espatulaComPo && (
            <circle
              cx="14"
              cy="105"
              r="5"
              fill="white"
            />
          )}

    {/* Reflexo sutil na pá */}
    <rect x="12" y="95" width="3" height="24" rx="1"
      fill="url(#espReflexo)" opacity="0.5" />

    {/* Borda inferior da pá levemente arredondada */}
    <rect x="8" y="118" width="12" height="4" rx="2"
      fill="#90a4ae" />

    {/* Cabo / empunhadura estriada */}
    <rect x="10" y="2" width="8" height="12" rx="3"
      fill="url(#espPega)" stroke="#263238" strokeWidth="0.8" />

    {/* Estrias do cabo */}
    {[4, 6, 8, 10].map(y => (
      <line key={y} x1="10" y1={y} x2="18" y2={y}
        stroke="rgba(0,0,0,0.25)" strokeWidth="0.7" />
    ))}

    {/* Anel de junção cabo-haste */}
    <rect x="9.5" y="12" width="9" height="4" rx="1.5"
      fill="#455a64" stroke="#263238" strokeWidth="0.7" />
  </svg>
);

export default EspatulaSVG;
