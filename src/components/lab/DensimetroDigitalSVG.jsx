/**
 * DensimetroDigitalSVG.jsx — Densímetro Digital (leitura ÷ 5 = °GL)
 *
 * Props:
 *   balaoPresente — amostra inserida no funil de entrada
 *   lendo         — leitura em andamento (barra de progresso animada)
 *   resultado     — string com °GL calculado, ou null
 *   leituraRaw    — string com leitura bruta (% álcool antes da divisão), ou null
 */
import React from 'react';

const DensimetroDigitalSVG = ({
  balaoPresente = false,
  lendo         = false,
  resultado     = null,
  leituraRaw    = null,
}) => (
  <svg width="148" height="185" viewBox="0 0 148 185">
    <defs>
      <linearGradient id="dmBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#374151" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
      <linearGradient id="dmScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001830" />
        <stop offset="100%" stopColor="#000e20" />
      </linearGradient>
      <linearGradient id="dmFunil" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="rgba(185,225,255,0.52)" />
        <stop offset="20%"  stopColor="rgba(215,238,255,0.14)" />
        <stop offset="80%"  stopColor="rgba(210,235,255,0.08)" />
        <stop offset="100%" stopColor="rgba(170,215,252,0.42)" />
      </linearGradient>
      <clipPath id="dmFunilClip">
        <path d="M 38,4 L 66,4 L 56,36 L 48,36 Z" />
      </clipPath>
      <filter id="dmSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".4" /></filter>
    </defs>

    {/* ── FUNIL DE ENTRADA DA AMOSTRA ── */}
    {/* Corpo do funil (trapézio) */}
    <path d="M 38,4 L 66,4 L 56,36 L 48,36 Z"
      fill="url(#dmFunil)" stroke="#8ac4dc" strokeWidth="1.4" />
    {/* Líquido no funil quando amostra presente */}
    {balaoPresente && (
      <path d="M 42,12 L 62,12 L 55,36 L 49,36 Z"
        fill="rgba(140,210,245,0.62)"
        clipPath="url(#dmFunilClip)" />
    )}
    {/* Borda superior do funil (abertura) */}
    <ellipse cx={52} cy={4} rx={14} ry={3.5}
      fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.2" />
    {/* Reflexo funil */}
    <line x1={41} y1={7} x2={47} y2={34}
      stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Haste do funil conectando ao U-tube */}
    <rect x={49} y={35} width={7} height={8} rx={1}
      fill="rgba(165,215,255,0.32)" stroke="#8ac4dc" strokeWidth="1.0" />
    <text x={52} y={2} textAnchor="middle" fontSize="5.5" fill="#60a5fa" fontFamily="sans-serif">↑ AMOSTRA</text>

    {/* ── CORPO DO EQUIPAMENTO ── */}
    <g filter="url(#dmSh)">
      <rect x={4} y={28} width={140} height={145} rx={10}
        fill="url(#dmBody)" stroke="#111827" strokeWidth="1.8" />
      <rect x={6} y={28} width={136} height={9} rx={6}
        fill="rgba(255,255,255,0.05)" />
    </g>

    {/* Título */}
    <text x={74} y={40} textAnchor="middle" fontSize="7" fill="#60a5fa"
      fontFamily="monospace" fontWeight="700">DENSÍMETRO DIGITAL</text>

    {/* U-tube integrado (tubo em U da amostra) */}
    <text x={74} y={50} textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="sans-serif">
      ENTRADA DE AMOSTRA
    </text>
    <path d="M 52,53 L 52,65 Q 52,73 60,73 L 88,73 Q 96,73 96,65 L 96,53"
      fill="none" stroke="#4b5563" strokeWidth="2.8" strokeLinecap="round" />
    {balaoPresente && (
      <path d="M 53.5,53 L 53.5,65 Q 53.5,71.5 60,71.5 L 88,71.5 Q 94.5,71.5 94.5,65 L 94.5,53"
        fill="none" stroke="rgba(140,210,245,0.82)" strokeWidth="1.8" />
    )}

    {/* Display */}
    <rect x={12} y={78} width={124} height={66} rx={5}
      fill="url(#dmScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x={14} y={80} width={120} height={62} rx={4}
      fill="rgba(0,40,80,0.38)" />

    {resultado ? (
      <>
        <text x={74} y={95} textAnchor="middle" fontSize="6.5" fill="#2a6a9a" fontFamily="monospace">
          °GL TEOR ALCOÓLICO
        </text>
        <line x1={20} y1={99} x2={128} y2={99} stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />
        <text x={74} y={121} textAnchor="middle" fontSize="24"
          fill="#00ff88" fontFamily="monospace" fontWeight="700">
          {resultado}
        </text>
        <text x={74} y={134} textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">°GL</text>
        {leituraRaw && (
          <text x={74} y={142} textAnchor="middle" fontSize="6" fill="#16a34a" fontFamily="sans-serif">
            leitura {leituraRaw}% ÷ 5
          </text>
        )}
      </>
    ) : lendo ? (
      <>
        <text x={74} y={98} textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x={22} y={106} width={104} height={5} rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x={22} y={106} width={0}   height={5} rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="104" dur="3.5s" fill="freeze" />
        </rect>
        <text x={74} y={125} textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">
          analisando amostra...
        </text>
      </>
    ) : balaoPresente ? (
      <>
        <text x={74} y={100} textAnchor="middle" fontSize="9" fill="#0ea5e9" fontFamily="monospace">PRONTO</text>
        <text x={74} y={115} textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="sans-serif">Amostra inserida ✓</text>
        <text x={74} y={130} textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Clique START para ler</text>
      </>
    ) : (
      <>
        <text x={74} y={100} textAnchor="middle" fontSize="9" fill="#3a5a6a" fontFamily="monospace">AGUARDANDO</text>
        <text x={74} y={115} textAnchor="middle" fontSize="7.5" fill="#2a4060" fontFamily="sans-serif">insira amostra destilada</text>
      </>
    )}

    {/* Botões */}
    {['ON', 'START', 'EJECT', 'MENU'].map((lbl, i) => {
      const isStart = lbl === 'START';
      const active  = isStart && balaoPresente && !lendo && !resultado;
      return (
        <g key={lbl}>
          <rect x={10 + i * 32} y={152} width={28} height={14} rx={4}
            fill={active ? '#0f2a48' : '#0f1e30'}
            stroke={active ? '#22d3ee' : '#1e3a5f'}
            strokeWidth={active ? 1.8 : 1} />
          <text x={24 + i * 32} y={161.5} textAnchor="middle" fontSize="5.5"
            fill={active ? '#22d3ee' : '#60a5fa'} fontFamily="monospace"
            fontWeight={active ? '700' : '400'}>{lbl}</text>
        </g>
      );
    })}

    {/* LED power */}
    <circle cx={126} cy={38} r={5}
      fill={resultado ? '#22c55e' : lendo ? '#f59e0b' : balaoPresente ? '#3b82f6' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    {lendo && (
      <circle cx={126} cy={38} r={9} fill="none"
        stroke="rgba(245,158,11,0.38)" strokeWidth="2">
        <animate attributeName="r"       from="5" to="11" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0"  dur="0.9s" repeatCount="indefinite" />
      </circle>
    )}

    <text x={74} y={177} textAnchor="middle" fontSize="5.5" fill="#2a4060" fontFamily="sans-serif">
      Densímetro Digital · Leitura ÷ 5 = °GL
    </text>
  </svg>
);

export default DensimetroDigitalSVG;
