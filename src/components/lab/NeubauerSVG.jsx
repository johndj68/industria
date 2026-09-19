/**
 * NeubauerSVG.jsx — SVG Câmara de Neubauer (visão superior)
 *
 * Props:
 *   carregada — boolean; destaca a área de contagem quando carregada
 *   comOleo   — boolean; exibe gota de óleo de imersão
 */
import React from 'react';

const NeubauerSVG = ({ carregada = false, comOleo = false }) => {
  const gw   = 58, gh = 58;
  const cell = gw / 5;
  const ox   = 21, oy = 12;

  return (
    <svg width="100" height="85" viewBox="0 0 100 85">
      <rect x="2" y="4" width="96" height="70" rx="3"
        fill="rgba(210,238,255,0.12)" stroke="#94a3b8" strokeWidth="1.5" />

      <rect x={ox - 6} y={oy - 5} width={gw + 12} height={gh + 10} rx="2"
        fill={carregada ? 'rgba(180,220,255,0.20)' : 'rgba(180,220,255,0.08)'}
        stroke="rgba(140,190,240,0.4)" strokeWidth="1" />

      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <line
            x1={ox + i * cell} y1={oy}
            x2={ox + i * cell} y2={oy + gh}
            stroke="rgba(0,50,160,0.65)"
            strokeWidth={i === 0 || i === 5 ? 1.8 : i === 2 || i === 3 ? 0.4 : 0.75} />
          <line
            x1={ox} y1={oy + i * cell}
            x2={ox + gw} y2={oy + i * cell}
            stroke="rgba(0,50,160,0.65)"
            strokeWidth={i === 0 || i === 5 ? 1.8 : i === 2 || i === 3 ? 0.4 : 0.75} />
        </g>
      ))}

      {Array.from({ length: 5 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => (
          <g key={`${i}-${j}`}>
            <line
              x1={ox + cell + i * (cell / 5)} y1={oy + cell}
              x2={ox + cell + i * (cell / 5)} y2={oy + cell * 2}
              stroke="rgba(0,60,160,0.22)" strokeWidth="0.3" />
            <line
              x1={ox + cell} y1={oy + cell + j * (cell / 5)}
              x2={ox + cell * 2} y2={oy + cell + j * (cell / 5)}
              stroke="rgba(0,60,160,0.22)" strokeWidth="0.3" />
          </g>
        ))
      )}

      {carregada && (
        <rect x={ox + cell} y={oy + cell} width={cell} height={cell}
          fill="rgba(200,100,160,0.35)" />
      )}

      {comOleo && (
        <ellipse cx="80" cy="55" rx="10" ry="6"
          fill="rgba(215,190,45,0.4)"
          stroke="rgba(180,155,30,0.5)" strokeWidth="1" />
      )}

      <rect x="5" y="7" width="90" height="4" rx="2"
        fill="rgba(255,255,255,0.17)" />

      <text x="50" y="81" textAnchor="middle" fontSize="7"
        fill="#64748b" fontFamily="sans-serif">Câmara de Neubauer</text>
    </svg>
  );
};

export default NeubauerSVG;
