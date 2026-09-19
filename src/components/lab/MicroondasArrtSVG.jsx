/**
 * MicroondasArrtSVG.jsx — Micro-ondas de Laboratório (ARRT)
 *
 * Props:
 *   aquecendo    — aquecimento ativo (glow, contador, vapor, prato girando)
 *   bequerDentro — béquer visível dentro da câmara com bolhas
 */
import React from 'react';

const MicroondasArrtSVG = ({ aquecendo = false, bequerDentro = false }) => (
  <svg width="175" height="140" viewBox="0 0 175 140">
    <defs>
      <linearGradient id="mwBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#d4c8a8" />
        <stop offset="100%" stopColor="#bfb08c" />
      </linearGradient>
      <radialGradient id="mwGlow" cx="50%" cy="60%" r="55%">
        <stop offset="0%"   stopColor={aquecendo ? 'rgba(245,158,11,0.55)' : 'rgba(0,0,0,0)'} />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
    </defs>

    <ellipse cx={88} cy={134} rx={70} ry={5} fill="rgba(0,0,0,0.14)" />

    {/* Corpo */}
    <rect x={4} y={8} width={167} height={122} rx={8}
      fill="url(#mwBody)" stroke="#a8956a" strokeWidth="1.8" />

    {/* Porta (janela) */}
    <rect x={10} y={14} width={110} height={98} rx={6}
      fill="#2d2518" stroke="#8b6e45" strokeWidth="1.5" />

    {/* Interior com glow */}
    <rect x={14} y={18} width={102} height={90} rx={4}
      fill={aquecendo ? 'rgba(50,30,10,0.95)' : 'rgba(30,20,8,0.95)'} />
    <rect x={14} y={18} width={102} height={90} rx={4}
      fill="url(#mwGlow)" />

    {/* Prato giratório — elipse estática + marcador orbital (sem deformar) */}
    <ellipse cx={65} cy={95} rx={28} ry={5}
      fill="rgba(200,185,150,0.20)" stroke="rgba(200,185,150,0.32)" strokeWidth="1" />
    {aquecendo && (
      <circle cx={90} cy={95} r={3.5} fill="rgba(200,185,150,0.60)">
        <animateTransform attributeName="transform" type="rotate"
          from="0 65 95" to="360 65 95" dur="1.8s" repeatCount="indefinite" />
      </circle>
    )}

    {/* Béquer dentro do microondas */}
    {bequerDentro && (
      <g transform="translate(48,45)">
        <rect x={0} y={0} width={28} height={36} rx="1.5"
          fill="rgba(185,228,255,0.25)" stroke="rgba(140,195,225,0.55)" strokeWidth="1.2" />
        <rect x={4} y={24} width={20} height={8} rx="0.8"
          fill="rgba(50,8,8,0.85)" />
        {aquecendo && [0,1,2,3].map(i => (
          <ellipse key={i} cx={8 + i*6} cy={22} rx={2} ry={1.5} fill="rgba(255,255,255,0.50)">
            <animate attributeName="cy" from="22" to="10" dur={`${0.7 + i*0.15}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.7" to="0" dur={`${0.7 + i*0.15}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
      </g>
    )}

    {/* Vapor */}
    {aquecendo && (
      <>
        <path d="M30,16 C25,8 35,4 30,-2" stroke="rgba(200,200,200,0.38)" strokeWidth="2" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
        </path>
        <path d="M65,16 C60,6 70,2 65,-4" stroke="rgba(200,200,200,0.32)" strokeWidth="2" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
        </path>
      </>
    )}

    {/* Painel de controle */}
    <rect x={124} y={14} width={44} height={98} rx={4}
      fill="#1e1810" stroke="#4a3e28" strokeWidth="1.2" />

    {/* Display timer */}
    <rect x={128} y={20} width={36} height={22} rx={3}
      fill="#0a0f00" stroke="#22c55e" strokeWidth="0.8" />
    <text x={146} y={30} textAnchor="middle" fontSize="6" fill="#3a5a7a" fontFamily="monospace">TEMPO</text>
    <text x={146} y={39} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700"
      fill={aquecendo ? '#22c55e' : '#4b5563'}>
      {aquecendo ? '0:30' : '0:00'}
    </text>

    {/* Botões */}
    {['START', 'STOP', '+30s', 'CLR'].map((lbl, i) => (
      <g key={lbl}>
        <rect x={128} y={50 + i * 15} width={36} height={11} rx={2.5}
          fill={lbl === 'START' && aquecendo ? '#052e16' : '#1a1508'}
          stroke={lbl === 'START' && aquecendo ? '#22c55e' : '#4a3e28'} strokeWidth="0.8" />
        <text x={146} y={58.5 + i * 15} textAnchor="middle" fontSize="5.5" fontFamily="monospace"
          fill={lbl === 'START' && aquecendo ? '#22c55e' : '#6b5e3a'}>{lbl}</text>
      </g>
    ))}

    {/* LED status */}
    <circle cx={138} cy={112} r={4}
      fill={aquecendo ? '#22c55e' : '#374151'} stroke="#1f2937" strokeWidth="0.8">
      {aquecendo && (
        <animate attributeName="opacity" from="1" to="0.3" dur="0.6s" repeatCount="indefinite" />
      )}
    </circle>
    <text x={150} y={115} fontSize="6" fill="#6b5e3a" fontFamily="monospace">PWR</text>

    {/* Label */}
    <text x={65} y={125} textAnchor="middle" fontSize="6" fill="#6b5e3a" fontFamily="monospace">
      {aquecendo ? '⚡ AQUECENDO...' : 'Micro-ondas Lab'}
    </text>
  </svg>
);

export default MicroondasArrtSVG;
