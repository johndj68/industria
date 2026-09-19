/**
 * BuretaSVG.jsx — Bureta Graduada 50 mL
 *
 * Props:
 *   nivel     — 0–100, nível de líquido (%)
 *   gotejando — exibe gota animada na ponta
 *   ativo     — destaca torneira e habilita onClick
 *   onClick   — callback ao clicar (quando ativo=true)
 */
import React from 'react';

const BuretaSVG = ({ nivel = 0, gotejando = false, ativo = false, onClick }) => {
  const CX = 20, CW = 6, WALL = 2.5;
  const OW = CW + WALL * 2;
  const gL = CX - CW / 2 - WALL;
  const gR = CX + CW / 2 + WALL;
  const BT = 18, BB = 158, BH = BB - BT;
  const meniscusY = BT + (1 - Math.max(nivel, 0) / 100) * BH;
  const lH = Math.max(BB - meniscusY, 0);
  const marks = [];
  for (let v = 0; v <= 50; v += 5)
    marks.push({ v, ym: BT + (v / 50) * BH, major: v % 10 === 0 });
  const tapY = BB + 6;

  return (
    <svg width="60" height="215" viewBox="0 0 60 215"
      onClick={ativo ? onClick : undefined}
      style={{ cursor: ativo ? 'pointer' : 'default' }}
    >
      <defs>
        <clipPath id="burClipA"><rect x={CX - CW/2} y={BT} width={CW} height={BH} /></clipPath>
        <linearGradient id="burGlassA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.52)" />
          <stop offset="20%"  stopColor="rgba(215,238,255,0.12)" />
          <stop offset="68%"  stopColor="rgba(210,235,255,0.07)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.40)" />
        </linearGradient>
        <linearGradient id="burLiqA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(210,60,50,0.65)" />
          <stop offset="100%" stopColor="rgba(188,40,32,0.52)" />
        </linearGradient>
      </defs>

      {/* Abertura superior */}
      <path d={`M${gL - 2},${BT} L${gL - 5},${BT - 10} L${gR + 5},${BT - 10} L${gR + 2},${BT}`}
        fill="rgba(165,215,255,0.36)" stroke="#8ac4dc" strokeWidth="1.4" />
      <ellipse cx={CX} cy={BT - 10} rx={OW / 2 + 4} ry={3.5} fill="rgba(185,228,255,0.40)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* Líquido */}
      <g clipPath="url(#burClipA)">
        {lH > 0 && (
          <>
            <rect x={CX - CW/2} y={meniscusY} width={CW} height={lH} fill="url(#burLiqA)" />
            <path
              d={`M${CX - CW/2 + 0.3},${meniscusY} Q${CX},${meniscusY + 4.5} ${CX + CW/2 - 0.3},${meniscusY}`}
              fill="rgba(210,60,50,0.30)" stroke="rgba(180,35,28,0.58)" strokeWidth="0.8"
            />
            {lH > 10 && <rect x={CX - CW/2 + 1} y={meniscusY + 6} width={2} height={lH - 9} rx="1" fill="rgba(255,255,255,0.20)" />}
          </>
        )}
      </g>

      {/* Tubo de vidro */}
      <rect x={gL} y={BT} width={OW} height={BH + 3} rx="1.5" fill="url(#burGlassA)" stroke="#8ac4dc" strokeWidth="1.6" />
      <rect x={gL + 1.2} y={BT + 10} width={2} height={BH - 18} rx="1" fill="rgba(255,255,255,0.40)" />

      {/* Marcações */}
      {marks.map(({ v, ym, major }) =>
        major ? (
          <g key={v}>
            <line x1={gR} y1={ym} x2={gR + 9} y2={ym} stroke="rgba(6,32,85,0.68)" strokeWidth="1.0" />
            <text x={gR + 11} y={ym + 3} fontSize="7" fill="rgba(6,32,85,0.72)" fontFamily="monospace" fontWeight="700">{v}</text>
          </g>
        ) : (
          <line key={v} x1={gR} y1={ym} x2={gR + 5} y2={ym} stroke="rgba(6,32,85,0.38)" strokeWidth="0.8" />
        )
      )}
      <text x={gR + 11} y={BT - 4} fontSize="6.5" fill="rgba(6,32,85,0.55)" fontFamily="monospace">mL</text>

      {/* Afunilamento */}
      <path d={`M${gL},${BB + 3} L${CX - 3.5},${tapY + 12} L${CX + 3.5},${tapY + 12} L${gR},${BB + 3} Z`}
        fill="rgba(162,215,255,0.28)" stroke="#88bfd5" strokeWidth="1.2" />

      {/* Torneira — corpo */}
      <rect x={CX - 13} y={tapY + 10} width={26} height={7} rx="3.5"
        fill={ativo ? '#0f2a48' : '#1a2535'} stroke={ativo ? '#22d3ee' : '#2a4060'} strokeWidth={ativo ? 1.6 : 1.1} />

      {/* Torneira — cabo */}
      <rect x={CX - 3} y={tapY + 7} width={6} height={14} rx="3"
        fill={ativo ? '#c0392b' : '#7b241c'} stroke={ativo ? '#e74c3c' : '#5d1b15'} strokeWidth="1.1" />

      {/* Pulso quando ativo */}
      {ativo && (
        <rect x={CX - 3} y={tapY + 7} width={6} height={14} rx="3" fill="none"
          stroke="rgba(231,76,60,0.55)" strokeWidth="3.5">
          <animate attributeName="stroke-opacity" from="0.55" to="0" dur="1s" repeatCount="indefinite" />
        </rect>
      )}

      {/* Ponta */}
      <path d={`M${CX - 3.5},${tapY + 24} L${CX + 3.5},${tapY + 24} L${CX + 1.8},${tapY + 40} L${CX - 1.8},${tapY + 40} Z`}
        fill="rgba(162,215,255,0.28)" stroke="#88bfd5" strokeWidth="1.2" />

      {/* Gota na ponta da bureta */}
      {gotejando && (
        <ellipse cx={CX} cy={tapY + 44} rx={2} ry={2.8}
          fill="rgba(215,55,42,0.85)" stroke="rgba(160,28,18,0.45)" strokeWidth="0.5">
          <animate attributeName="cy"      from={tapY + 42} to={tapY + 56} dur="0.40s" fill="freeze" />
          <animate attributeName="opacity" from="1"         to="0"         dur="0.40s" fill="freeze" />
        </ellipse>
      )}
    </svg>
  );
};

export default BuretaSVG;
