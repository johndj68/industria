/**
 * BequerSVG.jsx — Béquer de Laboratório (400 mL ou 150 mL)
 *
 * Props:
 *   ml                  — 400 ou 150 (define tamanho e graduações)
 *   nivel               — 0–100, nível do líquido (%)
 *   cor                 — cor CSS do líquido
 *   id                  — sufixo para IDs SVG únicos
 *   funilAcoplado       — exibe funil no topo + elonga viewBox
 *   algodaoVisible      — reservado para futura visualização do algodão
 *   filtrando           — gotas animadas entrando pelo funil
 *   vidroRelogioAcoplado — tampa de vidro relógio no topo
 *   gotasFenol          — 3 gotas de fenolftaleína caindo
 *   titulando           — redemoinhos de agitação NaOH
 */
import React from 'react';

const BequerSVG = ({
  ml = 150, nivel = 0,
  cor = 'rgba(220,235,255,0.06)',
  id = 'bq',
  funilAcoplado = false,
  algodaoVisible = false,
  filtrando = false,
  vidroRelogioAcoplado = false,
  gotasFenol = false,
  titulando = false,
}) => {
  const grande = ml === 400;
  const W = grande ? 80 : 62,  H = grande ? 96 : 76;
  const bx = 6, bw = W - 12;
  const lH = (nivel / 100) * (H - 10), lY = H - lH;

  return (
    <svg width={W + 16} height={H + (funilAcoplado ? 80 : 30)} viewBox={`0 0 ${W + 16} ${H + (funilAcoplado ? 80 : 30)}`}>
      <defs>
        <clipPath id={`bqClip${id}`}>
          <rect x={bx + 8} y={4} width={bw - 8} height={H - 4} />
        </clipPath>
        <linearGradient id={`bqGlass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.50)" />
          <stop offset="20%"  stopColor="rgba(215,238,255,0.12)" />
          <stop offset="72%"  stopColor="rgba(210,235,255,0.06)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.38)" />
        </linearGradient>
      </defs>

      <g transform={`translate(8, ${funilAcoplado ? 80 : 0})`}>
        {/* Sombra */}
        <ellipse cx={W / 2} cy={H + 8} rx={W / 2 - 4} ry={4} fill="rgba(0,0,0,0.15)" />

        {/* Líquido */}
        <g clipPath={`url(#bqClip${id})`}>
          {nivel > 0 && (
            <>
              <rect x={bx + 8} y={lY} width={bw - 8} height={lH + 3} fill={cor} />
              {nivel > 5 && <rect x={bx + 10} y={lY + 1} width={bw - 18} height={2} rx="1" fill="rgba(255,255,255,0.22)" />}
            </>
          )}
          {/* Gotas de filtração (amostra entrando pelo funil) */}
          {filtrando && [0,1,2].map(i => (
            <circle key={i} cx={W/2 + (i-1)*6} cy={lY} r={2} fill={cor || 'rgba(220,190,100,0.70)'}>
              <animate attributeName="cy" from={4} to={lY} dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0" to="1" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* 3 gotas de fenolftaleína caindo — CSS animation, 1× cada, sequencial */}
          {gotasFenol && [0,1,2].map(v => (
            <circle
              key={`f${v}`}
              cx={W/2 + (v-1)*5}
              cy={4}
              r={2.5}
              fill="rgba(255,80,170,0.92)"
              style={{ animation: `arrtDropFall 0.62s ${v * 0.66}s linear both` }}
            />
          ))}

          {/* Animação de titulação — redemoinhos ao adicionar NaOH */}
          {titulando && nivel > 0 && (
            <>
              <ellipse cx={W/2} cy={lY + lH * 0.50} rx={7} ry={2.5}
                fill="none" stroke="rgba(255,180,180,0.58)" strokeWidth="1.4">
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 ${W/2} ${lY + lH * 0.50}`} to={`360 ${W/2} ${lY + lH * 0.50}`}
                  dur="0.65s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx={W/2} cy={lY + lH * 0.26} rx={4} ry={1.8}
                fill="none" stroke="rgba(255,210,210,0.42)" strokeWidth="1.0">
                <animateTransform attributeName="transform" type="rotate"
                  from={`360 ${W/2} ${lY + lH * 0.26}`} to={`0 ${W/2} ${lY + lH * 0.26}`}
                  dur="0.45s" repeatCount="indefinite" />
              </ellipse>
            </>
          )}
        </g>

        {/* Vidro relógio acoplado no topo */}
        {vidroRelogioAcoplado && (
          <>
            <path d={`M${bx + 4},2 Q${W/2},${-8} ${bx + bw - 4},2`}
              fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.5" />
            <path d={`M${bx + 4},2 Q${W/2},${8} ${bx + bw - 4},2`}
              fill="rgba(185,228,255,0.18)" stroke="#8ac4dc" strokeWidth="1.0" />
          </>
        )}

        {/* Corpo de vidro */}
        <rect x={bx + 8} y={0} width={bw - 8} height={H} rx="2"
          fill={`url(#bqGlass${id})`} stroke="#8ac4dc" strokeWidth="1.6" />
        {/* Borda superior com bico */}
        <path d={`M${bx},0 L${bx + bw},0 L${bx + bw + 4},${-8} L${bx + bw - 4},${-14} L${bx + 8},${-14} L${bx + 4},${-8} Z`}
          fill="rgba(185,228,255,0.38)" stroke="#8ac4dc" strokeWidth="1.3" />
        {/* Reflexo */}
        <rect x={bx + 10} y={8} width={3} height={H - 16} rx="1.5" fill="rgba(255,255,255,0.38)" />

        {/* Linhas de graduação */}
        {(grande ? [100,200,300,400] : [50,100,150]).map((v) => {
          const yg = H - (v / ml) * (H - 10);
          return (
            <g key={v}>
              <line x1={bx + bw - 4} y1={yg} x2={bx + bw + 8} y2={yg} stroke="rgba(6,32,85,0.55)" strokeWidth="0.9" />
              <text x={bx + bw + 10} y={yg + 3.5} fontSize="6.5" fill="rgba(6,32,85,0.60)" fontFamily="monospace">{v}</text>
            </g>
          );
        })}
        <text x={bx + bw + 10} y={10} fontSize="6" fill="rgba(6,32,85,0.50)" fontFamily="monospace">mL</text>

        {/* Rótulo de volume */}
        <rect x={bx + 10} y={H - 18} width={bw - 16} height={11} rx="2"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="6.5"
          fill="#0d2137" fontFamily="monospace" fontWeight="700">{ml} mL</text>
      </g>

      {/* Funil com algodão (acoplado ao topo) */}
      {funilAcoplado && (
        <g transform="translate(8,0)">
          {/* Haste do funil */}
          <rect x={W/2 - 3} y={60} width={6} height={22} rx="1.5"
            fill="rgba(185,228,255,0.38)" stroke="#8ac4dc" strokeWidth="1.2" />
          {/* Cone do funil */}
          <path d={`M${W/2 - 18},18 L${W/2 + 18},18 L${W/2 + 3},60 L${W/2 - 3},60 Z`}
            fill="rgba(185,228,255,0.32)" stroke="#8ac4dc" strokeWidth="1.4" />
          {/* Líquido da amostra no funil durante filtração */}
          {filtrando && (
            <path d={`M${W/2 - 15},22 L${W/2 + 15},22 L${W/2 + 2},57 L${W/2 - 2},57 Z`}
              fill="rgba(210,175,78,0.66)" />
          )}
          {/* Borda superior do funil */}
          <ellipse cx={W/2} cy={18} rx={18} ry={4}
            fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.2" />
          {/* Algodão */}
          {algodaoVisible && (
            <>
              <ellipse cx={W/2 - 5} cy={44} rx={6} ry={5} fill="rgba(248,248,248,0.90)" />
              <ellipse cx={W/2 + 4} cy={42} rx={5} ry={4} fill="rgba(248,248,248,0.85)" />
              <ellipse cx={W/2}     cy={47} rx={7} ry={4} fill="rgba(240,240,240,0.88)" />
            </>
          )}
        </g>
      )}
    </svg>
  );
};

export default BequerSVG;
