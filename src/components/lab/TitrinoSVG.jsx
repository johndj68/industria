/**
 * TitrinoSVG.jsx — Titrino Plus (METROHM) — Titulador Potenciométrico
 *
 * Props:
 *   bequerPresente — amostra no porta-amostra
 *   lendo          — titulação em andamento (curva animada)
 *   resultado      — string com %ARRT ou null
 *   ativo          — botão DORNA destacado (clicável)
 */
import React from 'react';

const TitrinoSVG = ({
  bequerPresente = false,
  lendo          = false,
  resultado      = null,
  ativo          = false,
}) => (
  <svg width="190" height="220" viewBox="0 0 190 220">
    <defs>
      <linearGradient id="ttBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#3d3d3d" />
        <stop offset="100%" stopColor="#1e1e1e" />
      </linearGradient>
      <linearGradient id="ttScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001428" />
        <stop offset="100%" stopColor="#000b18" />
      </linearGradient>
      <filter id="ttSh"><feDropShadow dx="3" dy="5" stdDeviation="6" floodOpacity=".4" /></filter>
    </defs>

    <g filter="url(#ttSh)">
      <rect x={4} y={8} width={182} height={204} rx={10} fill="url(#ttBody)" stroke="#111" strokeWidth="1.8" />
    </g>

    {/* Topo com branding */}
    <rect x={4} y={8} width={182} height={18} rx={10} fill="rgba(255,255,255,0.06)" />
    <text x={94} y={20} textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="monospace" fontWeight="700">
      METROHM · TITRINO PLUS
    </text>

    {/* LCD screen */}
    <rect x={12} y={30} width={132} height={80} rx={5} fill="url(#ttScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x={14} y={32} width={128} height={76} rx={4} fill="rgba(0,30,60,0.42)" />

    {/* Conteúdo da tela */}
    {resultado ? (
      <>
        <text x={78} y={48} textAnchor="middle" fontSize="7" fill="#2a6a9a" fontFamily="monospace">ARRT DORNA</text>
        <line x1={18} y1={52} x2={138} y2={52} stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />
        {/* Graph drawn */}
        <line x1={20} y1={98} x2={20} y2={56} stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />
        <line x1={20} y1={98} x2={136} y2={98} stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />
        <path d="M22,96 C30,95 38,90 48,82 C58,72 62,64 68,60 C74,57 78,55 85,54 C92,53 100,53 108,53"
          stroke="#22d3ee" strokeWidth="1.8" fill="none" />
        <line x1={68} y1={56} x2={68} y2={98} stroke="rgba(239,68,68,0.55)" strokeWidth="1.0" strokeDasharray="3,2" />
        <text x={78} y={108} textAnchor="middle" fontSize="22" fill="#00ff88" fontFamily="monospace" fontWeight="700"
          style={{ animation: 'arrtFadeIn 0.5s ease forwards' }}>
          {resultado}
        </text>
      </>
    ) : lendo ? (
      <>
        <text x={78} y={48} textAnchor="middle" fontSize="7.5" fill="#fbbf24" fontFamily="monospace">TITULANDO...</text>
        <line x1={20} y1={96} x2={20} y2={56} stroke="rgba(34,211,238,0.28)" strokeWidth="0.8" />
        <line x1={20} y1={96} x2={136} y2={96} stroke="rgba(34,211,238,0.28)" strokeWidth="0.8" />
        {/* Curva animada via CSS — não reinicia em re-renders do React */}
        <path d="M22,94 C30,93 38,88 48,80 C58,70 62,62 68,58 C74,55 78,53 85,52 C92,51 100,51 108,51"
          stroke="#22d3ee" strokeWidth="1.8" fill="none"
          style={{ strokeDasharray: '180', strokeDashoffset: '180', animation: 'drawARRTCurve 3.8s linear forwards' }}
        />
        <text x={78} y={102} textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">
          analisando...
        </text>
      </>
    ) : bequerPresente ? (
      <>
        <text x={78} y={62} textAnchor="middle" fontSize="9" fill="#0ea5e9" fontFamily="monospace">PRONTO</text>
        <text x={78} y={77} textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="sans-serif">Amostra inserida ✓</text>
        <text x={78} y={92} textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Clique DORNA para ler</text>
      </>
    ) : (
      <>
        <text x={78} y={62} textAnchor="middle" fontSize="9" fill="#2a4060" fontFamily="monospace">STANDBY</text>
        <text x={78} y={78} textAnchor="middle" fontSize="7" fill="#1a3050" fontFamily="sans-serif">aguardando amostra</text>
      </>
    )}

    {/* Eletrodo/bureta assembly (direita) */}
    <rect x={150} y={30} width={28} height={80} rx={4} fill="#0a1520" stroke="#1e3a5f" strokeWidth="1.0" />
    <rect x={156} y={34} width={6} height={68} rx={2} fill="rgba(140,195,225,0.30)" stroke="rgba(140,195,225,0.50)" strokeWidth="0.8" />
    <rect x={160} y={34} width={2} height={68} rx="1" fill="rgba(255,255,255,0.20)" />
    <ellipse cx={159} cy={106} rx={5} ry={3} fill="#374151" stroke="#1e3a5f" strokeWidth="1.0" />
    <line x1={159} y1={109} x2={159} y2={120} stroke="#8ac4dc" strokeWidth="3" strokeLinecap="round" />
    <text x={164} y={36} fontSize="5" fill="#3a5a7a" fontFamily="monospace">BURETTE</text>

    {/* Botões */}
    {['START', 'DORNA', 'STOP', 'PRINT'].map((lbl, i) => {
      const isDorna = lbl === 'DORNA';
      const active  = isDorna && ativo;
      return (
        <g key={lbl}>
          <rect x={12 + i * 32} y={118} width={28} height={16} rx={4}
            fill={active ? '#052e16' : '#0f1e30'}
            stroke={active ? '#22c55e' : '#1e3a5f'}
            strokeWidth={active ? 1.8 : 1} />
          <text x={26 + i * 32} y={129} textAnchor="middle" fontSize="5.5"
            fill={active ? '#22c55e' : '#60a5fa'} fontFamily="monospace"
            fontWeight={active ? '700' : '400'}>{lbl}</text>
        </g>
      );
    })}

    {/* Porta-amostra (béquer) */}
    <rect x={12} y={142} width={90} height={46} rx={5}
      fill="#0a1018" stroke={bequerPresente ? '#22c55e' : '#1e3a5f'}
      strokeWidth={bequerPresente ? 1.5 : 1} />
    <text x={57} y={157} textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="monospace">SAMPLE CUP</text>
    {bequerPresente ? (
      <>
        <rect x={30} y={155} width={38} height={28} rx="1.5"
          fill="rgba(185,228,255,0.20)" stroke="rgba(140,195,225,0.55)" strokeWidth="1.2" />
        <rect x={34} y={167} width={30} height={10} rx="0.8"
          fill="rgba(90,25,5,0.85)" />
        <text x={49} y={188} textAnchor="middle" fontSize="5.5" fill="#22c55e" fontFamily="sans-serif">✓ inserido</text>
      </>
    ) : (
      <rect x={28} y={156} width={42} height={28} rx="2"
        fill="rgba(0,0,0,0.3)" stroke="#1e3a5f" strokeWidth="0.8" strokeDasharray="4,3" />
    )}

    {/* LED + etiqueta modelo */}
    <circle cx={165} cy={130} r={5}
      fill={resultado ? '#22c55e' : lendo ? '#f59e0b' : bequerPresente ? '#3b82f6' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    {lendo && (
      <circle cx={165} cy={130} r={9} fill="none" stroke="rgba(245,158,11,0.38)" strokeWidth="2">
        <animate attributeName="r"       from="5"  to="11" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1"  to="0"  dur="0.8s" repeatCount="indefinite" />
      </circle>
    )}

    <text x={94} y={210} textAnchor="middle" fontSize="5.5" fill="#2a4060" fontFamily="sans-serif">
      Titrino Plus · Potentiometric Titrator
    </text>
  </svg>
);

export default TitrinoSVG;
