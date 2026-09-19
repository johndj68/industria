/**
 * RackPonteiras.jsx — SVG Rack de Ponteiras P20 / P200 / P1000
 *
 * Props:
 *   tips   — array[12] de boolean; false = slot vazio
 *   onTake — callback(idx, col) disparado ao clicar numa ponteira disponível
 */
import React from 'react';

const RackPonteiras = ({ tips, onTake }) => {
  const COLS = 3, ROWS = 4;
  const GX   = 28, GY = 22;
  const RW   = COLS * GX + 18;
  const RH   = ROWS * GY + 26;

  const tipDef = [
    { label: 'P20',   cor: '#c084fc', altTip: 14, rTip: 3.5, capH: 5 },
    { label: 'P200',  cor: '#4ade80', altTip: 20, rTip: 4.5, capH: 6 },
    { label: 'P1000', cor: '#fbbf24', altTip: 28, rTip: 5.5, capH: 7 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={RW + 4} height={RH + 40} viewBox={`0 0 ${RW + 4} ${RH + 40}`}>
        <defs>
          <linearGradient id="rackGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4e342e" />
            <stop offset="100%" stopColor="#3e2723" />
          </linearGradient>
        </defs>

        {/* Corpo do rack */}
        <rect x="2" y="18" width={RW} height={RH} rx="6"
          fill="url(#rackGrad)" stroke="#2d1b11" strokeWidth="1.5" />
        <rect x="4" y="20" width={RW - 4} height="6" rx="3"
          fill="rgba(255,255,255,0.07)" />

        {/* Cabeçalho de colunas */}
        {tipDef.map((t, c) => (
          <text key={c}
            x={2 + 9 + c * GX + GX / 2} y="14"
            textAnchor="middle" fontSize="6.5" fill={t.cor}
            fontWeight="700" fontFamily="monospace">{t.label}</text>
        ))}

        {/* Ponteiras */}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const idx = r * COLS + c;
            const tx  = 2 + 9 + c * GX + GX / 2;
            const ty  = 18 + 14 + r * GY;
            const def = tipDef[c];
            const has = tips[idx] !== false;

            return (
              <g key={idx}
                onClick={() => has && onTake(idx, c)}
                style={{ cursor: has ? 'pointer' : 'default' }}>

                <ellipse cx={tx} cy={ty} rx={def.rTip + 2} ry={3.5}
                  fill={has ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.55)'}
                  stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" />

                {has && (
                  <>
                    <ellipse cx={tx} cy={ty - 1} rx={def.rTip} ry={def.capH * 0.4}
                      fill={def.cor} stroke="rgba(0,0,0,0.25)" strokeWidth="0.7" />
                    <polygon
                      points={`
                        ${tx - def.rTip},${ty}
                        ${tx + def.rTip},${ty}
                        ${tx + 1.5},${ty + def.altTip}
                        ${tx - 1.5},${ty + def.altTip}
                      `}
                      fill={def.cor} opacity="0.72"
                      stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
                    <polygon
                      points={`
                        ${tx - def.rTip + 1},${ty}
                        ${tx - def.rTip + 3},${ty}
                        ${tx - 0.5},${ty + def.altTip}
                        ${tx - 1.5},${ty + def.altTip}
                      `}
                      fill="rgba(255,255,255,0.3)" />
                  </>
                )}
              </g>
            );
          })
        )}
      </svg>

      <span style={{ fontSize: 10, fontWeight: 700, color: '#a8a29e' }}>Rack de Ponteiras</span>

      <div style={{ display: 'flex', gap: 10 }}>
        {[['P20', '#c084fc', 'Pequena'], ['P200', '#4ade80', 'Média'], ['P1000', '#fbbf24', 'Grande']].map(([l, c, d]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 9, background: c }} />
            <span style={{ fontSize: 8, color: '#94a3b8' }}>{l} {d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RackPonteiras;
