/**
 * TuboConicoSVG.jsx — SVG Tubo de Ensaio Cônico Graduado 10 mL (base)
 *
 * Componente base compartilhado por TuboEnsaio (id='main') e
 * TuboEnsaioFinal (id='tubo3'). O prop `id` é obrigatório para garantir
 * IDs SVG únicos quando múltiplos tubos aparecem na mesma página.
 *
 * Forma: largo no topo, afunila para base arredondada.
 * Paredes com espessura visível, graduações na frente do vidro.
 * Suporta animação de vórtex via props `animando` e `vortexAng`.
 */
import React from 'react';

const TuboConicoSVG = ({ cor = 'rgba(80,200,120,0.72)', nivel = 50, id, animando = false, vortexAng = 0 }) => {
  const CX     = 44;    // eixo central
  const topY   = 44;    // topo da boca
  const botY   = 168;   // centro da calota inferior
  const topW   = 28;    // meia-largura externa no topo
  const botW   = 9;     // meia-largura externa na base do cone
  const wall   = 3;     // espessura da parede de vidro
  const coneH  = botY - topY - 12; // altura da região cônica

  // Largura interna = externa - parede em cada lado
  const topWi  = topW - wall;
  const botWi  = botW - wall;

  // x da parede externa (L/R) em dado y
  const xLo = (y) => CX - (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xRo = (y) => CX + (topW  - (topW  - botW)  * (y - topY) / coneH);
  // x da parede interna (L/R) em dado y
  const xLi = (y) => CX - (topWi - (topWi - botWi) * (y - topY) / coneH);
  const xRi = (y) => CX + (topWi - (topWi - botWi) * (y - topY) / coneH);

  // y de uma marca em mL (10 = topo, 0 = base)
  const yOf  = (ml) => topY + coneH * (1 - ml / 10);

  // Y da superfície do líquido (nivel 0..100 → 0..10 mL)
  const liqY = yOf(nivel / 10);

  const marcas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const vortexDepth = animando
  ? 10 + Math.sin(vortexAng * 0.1) * 2
  : 0;

  return (
    <svg width="96" height="200" viewBox="0 0 96 200">
      <defs>

        {/* Gradiente corpo do vidro */}
        <linearGradient id={`tvBody${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(180,215,245,0.55)" />
          <stop offset="18%"  stopColor="rgba(220,240,255,0.20)" />
          <stop offset="50%"  stopColor="rgba(200,230,255,0.08)" />
          <stop offset="82%"  stopColor="rgba(220,240,255,0.15)" />
          <stop offset="100%" stopColor="rgba(180,215,245,0.40)" />
        </linearGradient>

        {/* Brilho linear esquerdo (faixa de luz) */}
        <linearGradient id={`tvShL${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Reflexo direito sutil */}
        <linearGradient id={`tvShR${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
        </linearGradient>

        {/* Clip interno (para conter o líquido dentro das paredes) */}
        <clipPath id={`tvLiq${id}`}>
          <path d={`
            M ${xLi(topY)} ${topY}
            L ${xLi(botY - 12)} ${botY - 12}
            Q ${CX} ${botY + 9} ${xRi(botY - 12)} ${botY - 12}
            L ${xRi(topY)} ${topY}
            Z
          `} />
        </clipPath>

        {/* Clip total externo (para brilhos não vazarem) */}
        <clipPath id={`tvExt${id}`}>
          <path d={`
            M ${xLo(topY)} ${topY}
            L ${xLo(botY - 12)} ${botY - 12}
            Q ${CX} ${botY + 9} ${xRo(botY - 12)} ${botY - 12}
            L ${xRo(topY)} ${topY}
            Z
          `} />
        </clipPath>

      </defs>

      {/* ── SOMBRA PROJETADA (elipse embaixo) ── */}
      <ellipse cx={CX} cy={botY + 12} rx={botW + 4} ry="4"
        fill="rgba(0,0,0,0.18)" />

      {/* ── CORPO EXTERNO — VIDRO ── */}
      <path
        d={`
          M ${xLo(topY)} ${topY}
          L ${xLo(botY - 12)} ${botY - 12}
          Q ${CX} ${botY + 9} ${xRo(botY - 12)} ${botY - 12}
          L ${xRo(topY)} ${topY}
          Z
        `}
        fill={`url(#tvBody${id})`}
        stroke="#8fb8d8" strokeWidth="1.8"
      />

      {/* ── LÍQUIDO (clipado dentro das paredes internas) ── */}
      <g clipPath={`url(#tvLiq${id})`}>
        <g>
        {/* Corpo do líquido */}
        <path
          d={`
            M ${xLi(liqY)} ${liqY}
            L ${xLi(botY - 12)} ${botY - 12}
            Q ${CX} ${botY + 9} ${xRi(botY - 12)} ${botY - 12}
            L ${xRi(liqY)} ${liqY}
            Z
          `}
          fill={cor} opacity="0.86"
        />
       {animando && (
          <ellipse
            cx={CX}
            cy={liqY + 10}
            rx={6 + Math.sin(vortexAng * 0.15) * 2}
            ry="3"
            fill="rgba(255,255,255,0.25)"
          />
        )}
         {/* Menisco no topo do líquido */}
         {nivel > 1 && nivel < 99 && (
          <path
            d={`
              M ${xLi(liqY)} ${liqY}
              Q ${CX - 6} ${liqY + vortexDepth}
                ${CX}
                ${liqY + vortexDepth + 2}
              Q ${CX + 6} ${liqY + vortexDepth}
                ${xRi(liqY)} ${liqY}
            `}
            fill="none"
            stroke={cor}
            strokeWidth="1.5"
          />
        )}
      </g>
      </g>


      {/* ── BRILHO ESQUERDO (faixa de luz na parede) ── */}
      <g clipPath={`url(#tvExt${id})`}>
        <path
          d={`
            M ${xLo(topY) + 1}   ${topY + 2}
            L ${xLo(botY - 14) + 1} ${botY - 14}
            L ${xLo(botY - 14) + 7} ${botY - 14}
            L ${xLo(topY) + 8}   ${topY + 2}
            Z
          `}
          fill={`url(#tvShL${id})`} opacity="0.80"
        />
        {/* Brilho fino extra (especular) */}
        <path
          d={`
            M ${xLo(topY) + 2}   ${topY + 4}
            L ${xLo(botY - 20) + 2} ${botY - 20}
            L ${xLo(botY - 20) + 3.5} ${botY - 20}
            L ${xLo(topY) + 3.5} ${topY + 4}
            Z
          `}
          fill="rgba(255,255,255,0.65)"
        />
      </g>

      {/* ── BRILHO DIREITO (sutil) ── */}
      <g clipPath={`url(#tvExt${id})`}>
        <path
          d={`
            M ${xRo(topY) - 7}   ${topY + 2}
            L ${xRo(botY - 14) - 4} ${botY - 14}
            L ${xRo(botY - 14)}  ${botY - 14}
            L ${xRo(topY) - 1}   ${topY + 2}
            Z
          `}
          fill={`url(#tvShR${id})`} opacity="0.55"
        />
      </g>

      {/* ── BOCA DO TUBO — anel superior ── */}
      {/* Parede externa da boca */}
      <rect
        x={CX - topW} y={topY - 10}
        width={topW * 2} height={12}
        rx="3"
        fill="rgba(200,228,248,0.22)"
        stroke="#8fb8d8" strokeWidth="1.6"
      />
      {/* Parede interna da boca (buraco) */}
      <rect
        x={CX - topWi + 1} y={topY - 9}
        width={(topWi - 1) * 2} height={10}
        rx="2"
        fill="rgba(10,20,40,0.35)"
      />
      {/* Anel de reforço superior */}
      <rect
        x={CX - topW - 1} y={topY - 1}
        width={topW * 2 + 2} height="4"
        rx="1.5"
        fill="rgba(160,200,230,0.35)"
        stroke="#8fb8d8" strokeWidth="1"
      />
      {/* Reflexo no anel */}
      <rect
        x={CX - topW + 3} y={topY - 9}
        width={topW - 6} height="3"
        rx="1.5"
        fill="rgba(255,255,255,0.30)"
      />

      {/* ── GRADUAÇÕES ── */}
      {marcas.map(ml => {
        const y       = yOf(ml);
        const isMaj   = ml % 2 === 0;
        const lx      = xLo(y);   // parede esquerda externa
        const rx      = xRo(y);   // parede direita externa
        const tickL   = isMaj ? 9 : 5;
        const tickR   = isMaj ? 9 : 5;

        return (
          <g key={ml}>
            {/* Traço esquerdo (cruza a parede, parte externa→interna) */}
            <line
              x1={lx} y1={y} x2={lx + tickL} y2={y}
              stroke={isMaj ? 'rgba(14,50,140,0.80)' : 'rgba(14,50,140,0.42)'}
              strokeWidth={isMaj ? 1.2 : 0.7}
            />
            {/* Traço direito */}
            <line
              x1={rx} y1={y} x2={rx - tickR} y2={y}
              stroke={isMaj ? 'rgba(14,50,140,0.80)' : 'rgba(14,50,140,0.42)'}
              strokeWidth={isMaj ? 1.2 : 0.7}
            />
            {/* Número — centralizado, sobre o vidro, simulando gravação */}
            {isMaj && (
              <>
                {/* Sombra do número para dar efeito gravado */}
                <text
                  x={CX} y={y + 4.5}
                  textAnchor="middle" fontSize="8.5"
                  fill="rgba(255,255,255,0.30)"
                  fontFamily="monospace" fontWeight="700"
                  dx="0.5" dy="0.5"
                >{ml}</text>
                {/* Número principal */}
                <text
                  x={CX} y={y + 4.5}
                  textAnchor="middle" fontSize="8.5"
                  fill="rgba(12,45,130,0.82)"
                  fontFamily="monospace" fontWeight="700"
                >{ml}</text>
              </>
            )}
          </g>
        );
      })}

      {/* Unidade "mL" centralizada, acima da marca de 10 */}
      <text
        x={CX} y={yOf(10) - 4}
        textAnchor="middle" fontSize="6.5"
        fill="rgba(12,45,130,0.65)"
        fontFamily="sans-serif" fontWeight="700"
      >mL</text>

    </svg>
  );
};

export default TuboConicoSVG;
