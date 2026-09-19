/**
 * PipetaLabSVG.jsx — Pipeta Volumétrica com Pêra de Sucção
 *
 * Pipeta de laboratório clássica (diferente da Micropipeta eletrônica).
 * Props:
 *   nivel — 0–100, nível de líquido no bulbo (%)
 *   cor   — cor CSS do líquido
 *   cheia — LED verde indicando pipeta carregada
 */
import React from 'react';

const PipetaLabSVG = ({ nivel = 0, cor = 'rgba(140,200,240,0.65)', cheia = false }) => {
  const CX = 16;
  return (
    <svg width="32" height="140" viewBox="0 0 32 140">
      <defs>
        <clipPath id="pipClip">
          <path d={`M${CX-3},8 L${CX+3},8 L${CX+3},50 L${CX+11},70 A11,11,0,0,1,${CX-11},70 L${CX-3},50 M${CX-3},90 A11,11,0,0,0,${CX+3},90 L${CX+3},130 L${CX+1},138 L${CX-1},138 L${CX-3},130 Z`} />
        </clipPath>
      </defs>

      {/* Corpo superior (fino) */}
      <rect x={CX-3} y={8} width={6} height={42} rx="1.5"
        fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* Bulbo */}
      <ellipse cx={CX} cy={70} rx={12} ry={22}
        fill="rgba(185,228,255,0.30)" stroke="#8ac4dc" strokeWidth="1.4" />

      {/* Líquido no bulbo */}
      {nivel > 0 && (
        <ellipse cx={CX} cy={70 + (1 - nivel/100) * 16}
          rx={Math.min(11, nivel/100 * 11 + 2)}
          ry={Math.min(18, nivel/100 * 18)}
          fill={cor} />
      )}

      {/* Corpo inferior (fino) */}
      <rect x={CX-3} y={91} width={6} height={38} rx="1.5"
        fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* Ponta */}
      <path d={`M${CX-2.5},129 L${CX+2.5},129 L${CX+1},138 L${CX-1},138 Z`}
        fill="rgba(165,215,255,0.32)" stroke="#8ac4dc" strokeWidth="1.0" />

      {/* Reflexo */}
      <rect x={CX-2} y={12} width={1.5} height={36} rx="0.8" fill="rgba(255,255,255,0.38)" />

      {/* Marca de calibração */}
      <line x1={CX-4} y1={30} x2={CX+4} y2={30} stroke="rgba(6,32,85,0.60)" strokeWidth="1.2" />
      <text x={CX+6} y={33.5} fontSize="5.5" fill="rgba(6,32,85,0.55)" fontFamily="monospace">mL</text>

      {/* Balão vermelho de borracha — renderizado POR ÚLTIMO para ficar à frente do vidro */}
      <ellipse cx={CX} cy={7} rx={7} ry={9}
        fill="rgba(215,28,28,0.92)" stroke="#7f1d1d" strokeWidth="1.2" />
      {/* Brilho no balão */}
      <ellipse cx={CX-2.5} cy={3.5} rx={2.5} ry={3.5}
        fill="rgba(255,130,130,0.38)" />
      {/* Conector borracha-vidro */}
      <rect x={CX-2.8} y={15} width={5.6} height={4} rx="1"
        fill="#4b5563" stroke="#374151" strokeWidth="0.8" />
      {/* Indicador de estado */}
      <circle cx={CX + 5} cy={4} r={2.5}
        fill={cheia ? '#22c55e' : '#374151'} stroke="#1f2937" strokeWidth="0.8" />
    </svg>
  );
};

export default PipetaLabSVG;
