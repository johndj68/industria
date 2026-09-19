/**
 * TuboEnsaioVazio.jsx — SVG Tubo de Diluição (Proveta) 100 mL
 *
 * Forma quase cilíndrica (proveta), escala 0–100 mL.
 * Suporta animação de vórtex via props `animando` e `vortexAng`.
 */
import React from 'react';

const TuboEnsaioVazio = ({ cor = 'rgba(80,200,120,0.72)', nivel = 50, id = 'tubo2', animando = false, vortexAng = 0 }) => {
  const CX     = 44;    // eixo central
  const topY   = 30;    // topo da boca — mais alto para corpo mais longo
  const botY   = 185;   // centro da calota inferior — mais baixo para mais altura
  const topW   = 16;    // meia-largura externa no topo — mais estreito (proveta)
  const botW   = 14;    // meia-largura externa na base — quase cilíndrica
  const wall   = 2.5;   // espessura da parede de vidro
  const coneH  = botY - topY - 12; // altura da região cônica

  const topWi  = topW - wall;
  const botWi  = botW - wall;

  const xLo = (y) => CX - (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xRo = (y) => CX + (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xLi = (y) => CX - (topWi - (topWi - botWi) * (y - topY) / coneH);
  const xRi = (y) => CX + (topWi - (topWi - botWi) * (y - topY) / coneH);

  // Escala para 100 mL — marcas de 10 em 10
  const yOf  = (ml) => topY + coneH * (1 - ml / 100);

  const liqY = yOf(nivel);

  // Marcas de 10 em 10 mL (proveta 100 mL)
  const marcas = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Submarcas de 5 em 5 mL
  const submarcas = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];

  const vortexDepth = animando
    ? 10 + Math.sin(vortexAng * 0.1) * 2
    : 0;

  return (
    <svg width="96" height="220" viewBox="0 0 96 220">
      <defs>
        <linearGradient id={`tvBody${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(180,215,245,0.55)" />
          <stop offset="18%"  stopColor="rgba(220,240,255,0.20)" />
          <stop offset="50%"  stopColor="rgba(200,230,255,0.08)" />
          <stop offset="82%"  stopColor="rgba(220,240,255,0.15)" />
          <stop offset="100%" stopColor="rgba(180,215,245,0.40)" />
        </linearGradient>
        <linearGradient id={`tvShL${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={`tvShR${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
        </linearGradient>
        <clipPath id={`tvLiq${id}`}>
          <path d={`
            M ${xLi(topY)} ${topY}
            L ${xLi(botY - 12)} ${botY - 12}
            Q ${CX} ${botY + 9} ${xRi(botY - 12)} ${botY - 12}
            L ${xRi(topY)} ${topY}
            Z
          `} />
        </clipPath>
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

      {/* Sombra base */}
      <ellipse cx={CX} cy={botY + 12} rx={botW + 6} ry="5"
        fill="rgba(0,0,0,0.22)" />

      {/* Base plana da proveta — suporte */}
      <rect x={CX - botW - 5} y={botY + 8} width={(botW + 5) * 2} height="6" rx="3"
        fill="rgba(160,200,230,0.30)" stroke="#8fb8d8" strokeWidth="1.2" />

      {/* Corpo principal */}
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

      {/* Líquido */}
      <g clipPath={`url(#tvLiq${id})`}>
        <g>
          <path
            d={`
              M ${xLi(liqY)} ${liqY}
              L ${xLi(botY - 12)} ${botY - 12}
              Q ${CX} ${botY + 9} ${xRi(botY - 12)} ${botY - 12}
              L ${xRi(liqY)} ${liqY}
              Z
            `}
            fill={cor} opacity="0.86" />

          {animando && (
            <ellipse
              cx={CX}
              cy={liqY + 10}
              rx={6 + Math.sin(vortexAng * 0.15) * 2}
              ry="3"
              fill="rgba(255,255,255,0.25)"
            />
          )}

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

      {/* Reflexo esquerdo */}
      <g clipPath={`url(#tvExt${id})`}>
        <path
          d={`
            M ${xLo(topY) + 1}   ${topY + 2}
            L ${xLo(botY - 14) + 1} ${botY - 14}
            L ${xLo(botY - 14) + 5} ${botY - 14}
            L ${xLo(topY) + 6}   ${topY + 2}
            Z
          `}
          fill={`url(#tvShL${id})`} opacity="0.80"
        />
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

      {/* Reflexo direito */}
      <g clipPath={`url(#tvExt${id})`}>
        <path
          d={`
            M ${xRo(topY) - 5}   ${topY + 2}
            L ${xRo(botY - 14) - 3} ${botY - 14}
            L ${xRo(botY - 14)}  ${botY - 14}
            L ${xRo(topY) - 1}   ${topY + 2}
            Z
          `}
          fill={`url(#tvShR${id})`} opacity="0.55"
        />
      </g>

      {/* Boca da proveta — mais estreita e com bico */}
      {/* Pescoço */}
      <rect x={CX - topW} y={topY - 18} width={topW * 2} height={20} rx="2"
        fill="rgba(200,228,248,0.22)" stroke="#8fb8d8" strokeWidth="1.6" />
      <rect x={CX - topWi + 1} y={topY - 17} width={(topWi - 1) * 2} height={18} rx="1.5"
        fill="rgba(10,20,40,0.35)" />
      {/* Anel de reforço no topo */}
      <rect x={CX - topW - 1} y={topY - 1} width={topW * 2 + 2} height="4" rx="1.5"
        fill="rgba(160,200,230,0.35)" stroke="#8fb8d8" strokeWidth="1" />
      {/* Reflexo pescoço */}
      <rect x={CX - topW + 2} y={topY - 16} width={topW - 4} height="3" rx="1.5"
        fill="rgba(255,255,255,0.30)" />

      {/* Marcas principais — 10 em 10 mL */}
      {marcas.map(ml => {
        const y     = yOf(ml);
        const lx    = xLo(y);
        const rx    = xRo(y);
        const tickL = 8;
        const tickR = 8;
        return (
          <g key={ml}>
            <line x1={lx} y1={y} x2={lx + tickL} y2={y}
              stroke="rgba(14,50,140,0.85)"
              strokeWidth="1.2" />
            <line x1={rx} y1={y} x2={rx - tickR} y2={y}
              stroke="rgba(14,50,140,0.85)"
              strokeWidth="1.2" />
            {/* Rótulo apenas à direita, fora do corpo */}
            <text x={rx + 3} y={y + 3.5} textAnchor="start" fontSize="7"
              fill="rgba(200,225,255,0.75)" fontFamily="monospace" fontWeight="700">{ml}</text>
          </g>
        );
      })}

      {/* Submarcas — 5 em 5 mL */}
      {submarcas.map(ml => {
        const y  = yOf(ml);
        const lx = xLo(y);
        const rx = xRo(y);
        return (
          <g key={`sub-${ml}`}>
            <line x1={lx} y1={y} x2={lx + 5} y2={y}
              stroke="rgba(14,50,140,0.45)"
              strokeWidth="0.7" />
            <line x1={rx} y1={y} x2={rx - 5} y2={y}
              stroke="rgba(14,50,140,0.45)"
              strokeWidth="0.7" />
          </g>
        );
      })}

      {/* Unidade no topo */}
      <text x={CX} y={yOf(100) - 6} textAnchor="middle" fontSize="6.5"
        fill="rgba(12,45,130,0.65)" fontFamily="sans-serif" fontWeight="700">mL</text>
    </svg>
  );
};

export default TuboEnsaioVazio;
