import React, { useState } from 'react';
import { Microscope, Award, Star, CheckCircle } from 'lucide-react';


/* ═══════════════════════════════════════════════════════════
   SVG — FRASCO DE REAGENTE
═══════════════════════════════════════════════════════════ */
const FrascoReagente = ({ cor, label, sub, nivel = 70, w = 54, h = 80 }) => {
  const uid = label.replace(/\s/g, '');
  const nH  = 26;
  const bx  = 4;
  const by  = nH + 4;
  const bh  = h - by - 2;

  return (
    <svg width={w} height={h + 18} viewBox={`0 0 ${w} ${h + 18}`}>
      <defs>
        <linearGradient id={`fg${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id={`fc${uid}`}>
          <rect x={bx} y={by} width={w - bx * 2} height={bh} rx="6" />
        </clipPath>
      </defs>

      {/* Tampa */}
      <rect x={w / 2 - 11} y="0" width="22" height="10" rx="4"
        fill="#455a64" stroke="#37474f" strokeWidth="1" />

      {/* Gargalo */}
      <rect x={w / 2 - 8} y="8" width="16" height={nH}
        fill="rgba(200,235,255,0.14)" stroke="#94a3b8" strokeWidth="1.4" />

      {/* Corpo */}
      <rect x={bx} y={by} width={w - bx * 2} height={bh} rx="6"
        fill="rgba(200,235,255,0.10)" stroke="#94a3b8" strokeWidth="1.4" />

      {/* Líquido */}
      <g clipPath={`url(#fc${uid})`}>
        <rect x={bx} y={by + bh * (1 - nivel / 100)}
          width={w - bx * 2} height={bh * (nivel / 100)}
          fill={cor} opacity="0.88" />
      </g>

      {/* Brilho */}
      <rect x={bx + 6} y={by + 8} width="5" height={bh * 0.55} rx="2.5"
        fill={`url(#fg${uid})`} />

      {/* Rótulo */}
      <rect x={bx + 4} y={by + bh * 0.44} width={w - bx * 2 - 8} height="24" rx="3"
        fill="rgba(255,255,255,0.92)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
      <text x={w / 2} y={by + bh * 0.585}
        textAnchor="middle" fontSize="7.2" fontWeight="700" fill="#0d2137"
        fontFamily="monospace">{label}</text>
      {sub && (
        <text x={w / 2} y={by + bh * 0.72}
          textAnchor="middle" fontSize="5.8" fill="#1a3a5e"
          fontFamily="sans-serif">{sub}</text>
      )}
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — TUBO DE ENSAIO CÔNICO GRADUADO 10 mL
═══════════════════════════════════════════════════════════ */
const TuboEnsaio = ({ cor = 'rgba(80,200,120,0.72)', nivel = 50, id = 'main', animando = false, vortexAng = 0 }) => {
  const CX    = 44;
  const topY  = 44;
  const botY  = 168;
  const topW  = 28;
  const botW  = 9;
  const wall  = 3;
  const coneH = botY - topY - 12;
  const topWi = topW - wall;
  const botWi = botW - wall;
  const xLo = (y) => CX - (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xRo = (y) => CX + (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xLi = (y) => CX - (topWi - (topWi - botWi) * (y - topY) / coneH);
  const xRi = (y) => CX + (topWi - (topWi - botWi) * (y - topY) / coneH);
  const yOf  = (ml) => topY + coneH * (1 - ml / 10);
  const liqY = yOf(nivel / 10);
  const marcas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const vortexDepth = animando ? 10 + Math.sin(vortexAng * 0.1) * 2 : 0;

  return (
    <svg width="96" height="200" viewBox="0 0 96 200">
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
          <path d={`M ${xLi(topY)} ${topY} L ${xLi(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRi(botY-12)} ${botY-12} L ${xRi(topY)} ${topY} Z`} />
        </clipPath>
        <clipPath id={`tvExt${id}`}>
          <path d={`M ${xLo(topY)} ${topY} L ${xLo(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRo(botY-12)} ${botY-12} L ${xRo(topY)} ${topY} Z`} />
        </clipPath>
      </defs>
      <ellipse cx={CX} cy={botY+12} rx={botW+4} ry="4" fill="rgba(0,0,0,0.18)" />
      <path d={`M ${xLo(topY)} ${topY} L ${xLo(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRo(botY-12)} ${botY-12} L ${xRo(topY)} ${topY} Z`}
        fill={`url(#tvBody${id})`} stroke="#8fb8d8" strokeWidth="1.8" />
      <g clipPath={`url(#tvLiq${id})`}>
        <g>
          <path d={`M ${xLi(liqY)} ${liqY} L ${xLi(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRi(botY-12)} ${botY-12} L ${xRi(liqY)} ${liqY} Z`}
            fill={cor} opacity="0.86" />
          {animando && <ellipse cx={CX} cy={liqY+10} rx={6+Math.sin(vortexAng*0.15)*2} ry="3" fill="rgba(255,255,255,0.25)" />}
          {nivel > 1 && nivel < 99 && (
            <path d={`M ${xLi(liqY)} ${liqY} Q ${CX-6} ${liqY+vortexDepth} ${CX} ${liqY+vortexDepth+2} Q ${CX+6} ${liqY+vortexDepth} ${xRi(liqY)} ${liqY}`}
              fill="none" stroke={cor} strokeWidth="1.5" />
          )}
        </g>
      </g>
      <g clipPath={`url(#tvExt${id})`}>
        <path d={`M ${xLo(topY)+1} ${topY+2} L ${xLo(botY-14)+1} ${botY-14} L ${xLo(botY-14)+7} ${botY-14} L ${xLo(topY)+8} ${topY+2} Z`}
          fill={`url(#tvShL${id})`} opacity="0.80" />
        <path d={`M ${xLo(topY)+2} ${topY+4} L ${xLo(botY-20)+2} ${botY-20} L ${xLo(botY-20)+3.5} ${botY-20} L ${xLo(topY)+3.5} ${topY+4} Z`}
          fill="rgba(255,255,255,0.65)" />
      </g>
      <g clipPath={`url(#tvExt${id})`}>
        <path d={`M ${xRo(topY)-7} ${topY+2} L ${xRo(botY-14)-4} ${botY-14} L ${xRo(botY-14)} ${botY-14} L ${xRo(topY)-1} ${topY+2} Z`}
          fill={`url(#tvShR${id})`} opacity="0.55" />
      </g>
      <rect x={CX-topW} y={topY-10} width={topW*2} height={12} rx="3"
        fill="rgba(200,228,248,0.22)" stroke="#8fb8d8" strokeWidth="1.6" />
      <rect x={CX-topWi+1} y={topY-9} width={(topWi-1)*2} height={10} rx="2"
        fill="rgba(10,20,40,0.35)" />
      <rect x={CX-topW-1} y={topY-1} width={topW*2+2} height="4" rx="1.5"
        fill="rgba(160,200,230,0.35)" stroke="#8fb8d8" strokeWidth="1" />
      <rect x={CX-topW+3} y={topY-9} width={topW-6} height="3" rx="1.5"
        fill="rgba(255,255,255,0.30)" />
      {marcas.map(ml => {
        const y = yOf(ml); const isMaj = ml % 2 === 0;
        const lx = xLo(y); const rx = xRo(y);
        const tickL = isMaj ? 9 : 5; const tickR = isMaj ? 9 : 5;
        return (
          <g key={ml}>
            <line x1={lx} y1={y} x2={lx+tickL} y2={y}
              stroke={isMaj ? 'rgba(14,50,140,0.80)' : 'rgba(14,50,140,0.42)'}
              strokeWidth={isMaj ? 1.2 : 0.7} />
            <line x1={rx} y1={y} x2={rx-tickR} y2={y}
              stroke={isMaj ? 'rgba(14,50,140,0.80)' : 'rgba(14,50,140,0.42)'}
              strokeWidth={isMaj ? 1.2 : 0.7} />
            {isMaj && (<>
              <text x={CX} y={y+4.5} textAnchor="middle" fontSize="8.5"
                fill="rgba(255,255,255,0.30)" fontFamily="monospace" fontWeight="700" dx="0.5" dy="0.5">{ml}</text>
              <text x={CX} y={y+4.5} textAnchor="middle" fontSize="8.5"
                fill="rgba(12,45,130,0.82)" fontFamily="monospace" fontWeight="700">{ml}</text>
            </>)}
          </g>
        );
      })}
      <text x={CX} y={yOf(10)-4} textAnchor="middle" fontSize="6.5"
        fill="rgba(12,45,130,0.65)" fontFamily="sans-serif" fontWeight="700">mL</text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — TUBO DE ENSAIO VAZIO
═══════════════════════════════════════════════════════════ */
const TuboEnsaioVazio = ({ cor = 'rgba(80,200,120,0.72)', nivel = 50, id = 'tubo2', animando = false, vortexAng = 0 }) => {
  const CX    = 44; const topY = 44; const botY = 168;
  const topW  = 28; const botW = 9;  const wall = 3;
  const coneH = botY - topY - 12;
  const topWi = topW - wall; const botWi = botW - wall;
  const xLo = (y) => CX - (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xRo = (y) => CX + (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xLi = (y) => CX - (topWi - (topWi - botWi) * (y - topY) / coneH);
  const xRi = (y) => CX + (topWi - (topWi - botWi) * (y - topY) / coneH);
  const yOf  = (ml) => topY + coneH * (1 - ml / 10);
  const liqY = yOf(nivel / 10);
  const marcas = [1,2,3,4,5,6,7,8,9,10];
  const vortexDepth = animando ? 10 + Math.sin(vortexAng * 0.1) * 2 : 0;
  return (
    <svg width="96" height="200" viewBox="0 0 96 200">
      <defs>
        <linearGradient id={`tvBody${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(180,215,245,0.55)" /><stop offset="18%"  stopColor="rgba(220,240,255,0.20)" />
          <stop offset="50%"  stopColor="rgba(200,230,255,0.08)" /><stop offset="82%"  stopColor="rgba(220,240,255,0.15)" />
          <stop offset="100%" stopColor="rgba(180,215,245,0.40)" />
        </linearGradient>
        <linearGradient id={`tvShL${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={`tvShR${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)" /><stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
        </linearGradient>
        <clipPath id={`tvLiq${id}`}>
          <path d={`M ${xLi(topY)} ${topY} L ${xLi(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRi(botY-12)} ${botY-12} L ${xRi(topY)} ${topY} Z`} />
        </clipPath>
        <clipPath id={`tvExt${id}`}>
          <path d={`M ${xLo(topY)} ${topY} L ${xLo(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRo(botY-12)} ${botY-12} L ${xRo(topY)} ${topY} Z`} />
        </clipPath>
      </defs>
      <ellipse cx={CX} cy={botY+12} rx={botW+4} ry="4" fill="rgba(0,0,0,0.18)" />
      <path d={`M ${xLo(topY)} ${topY} L ${xLo(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRo(botY-12)} ${botY-12} L ${xRo(topY)} ${topY} Z`}
        fill={`url(#tvBody${id})`} stroke="#8fb8d8" strokeWidth="1.8" />
      <g clipPath={`url(#tvLiq${id})`}>
        <g>
          <path d={`M ${xLi(liqY)} ${liqY} L ${xLi(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRi(botY-12)} ${botY-12} L ${xRi(liqY)} ${liqY} Z`}
            fill={cor} opacity="0.86" />
          {animando && <ellipse cx={CX} cy={liqY+10} rx={6+Math.sin(vortexAng*0.15)*2} ry="3" fill="rgba(255,255,255,0.25)" />}
          {nivel > 1 && nivel < 99 && (
            <path d={`M ${xLi(liqY)} ${liqY} Q ${CX-6} ${liqY+vortexDepth} ${CX} ${liqY+vortexDepth+2} Q ${CX+6} ${liqY+vortexDepth} ${xRi(liqY)} ${liqY}`}
              fill="none" stroke={cor} strokeWidth="1.5" />
          )}
        </g>
      </g>
      <g clipPath={`url(#tvExt${id})`}>
        <path d={`M ${xLo(topY)+1} ${topY+2} L ${xLo(botY-14)+1} ${botY-14} L ${xLo(botY-14)+7} ${botY-14} L ${xLo(topY)+8} ${topY+2} Z`}
          fill={`url(#tvShL${id})`} opacity="0.80" />
        <path d={`M ${xLo(topY)+2} ${topY+4} L ${xLo(botY-20)+2} ${botY-20} L ${xLo(botY-20)+3.5} ${botY-20} L ${xLo(topY)+3.5} ${topY+4} Z`}
          fill="rgba(255,255,255,0.65)" />
      </g>
      <g clipPath={`url(#tvExt${id})`}>
        <path d={`M ${xRo(topY)-7} ${topY+2} L ${xRo(botY-14)-4} ${botY-14} L ${xRo(botY-14)} ${botY-14} L ${xRo(topY)-1} ${topY+2} Z`}
          fill={`url(#tvShR${id})`} opacity="0.55" />
      </g>
      <rect x={CX-topW} y={topY-10} width={topW*2} height={12} rx="3" fill="rgba(200,228,248,0.22)" stroke="#8fb8d8" strokeWidth="1.6" />
      <rect x={CX-topWi+1} y={topY-9} width={(topWi-1)*2} height={10} rx="2" fill="rgba(10,20,40,0.35)" />
      <rect x={CX-topW-1} y={topY-1} width={topW*2+2} height="4" rx="1.5" fill="rgba(160,200,230,0.35)" stroke="#8fb8d8" strokeWidth="1" />
      <rect x={CX-topW+3} y={topY-9} width={topW-6} height="3" rx="1.5" fill="rgba(255,255,255,0.30)" />
      {marcas.map(ml => {
        const y = yOf(ml); const isMaj = ml % 2 === 0;
        const lx = xLo(y); const rx = xRo(y);
        return (
          <g key={ml}>
            <line x1={lx} y1={y} x2={lx+(isMaj?9:5)} y2={y} stroke={isMaj?'rgba(14,50,140,0.80)':'rgba(14,50,140,0.42)'} strokeWidth={isMaj?1.2:0.7} />
            <line x1={rx} y1={y} x2={rx-(isMaj?9:5)} y2={y} stroke={isMaj?'rgba(14,50,140,0.80)':'rgba(14,50,140,0.42)'} strokeWidth={isMaj?1.2:0.7} />
            {isMaj && (<>
              <text x={CX} y={y+4.5} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.30)" fontFamily="monospace" fontWeight="700" dx="0.5" dy="0.5">{ml}</text>
              <text x={CX} y={y+4.5} textAnchor="middle" fontSize="8.5" fill="rgba(12,45,130,0.82)" fontFamily="monospace" fontWeight="700">{ml}</text>
            </>)}
          </g>
        );
      })}
      <text x={CX} y={yOf(10)-4} textAnchor="middle" fontSize="6.5" fill="rgba(12,45,130,0.65)" fontFamily="sans-serif" fontWeight="700">mL</text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — TUBO DE ENSAIO FINAL
═══════════════════════════════════════════════════════════ */
const TuboEnsaioFinal = ({ cor = 'rgba(80,200,120,0.72)', nivel = 50, id = 'tubo3', animando = false, vortexAng = 0 }) => {
  const CX    = 44; const topY = 44; const botY = 168;
  const topW  = 28; const botW = 9;  const wall = 3;
  const coneH = botY - topY - 12;
  const topWi = topW - wall; const botWi = botW - wall;
  const xLo = (y) => CX - (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xRo = (y) => CX + (topW  - (topW  - botW)  * (y - topY) / coneH);
  const xLi = (y) => CX - (topWi - (topWi - botWi) * (y - topY) / coneH);
  const xRi = (y) => CX + (topWi - (topWi - botWi) * (y - topY) / coneH);
  const yOf  = (ml) => topY + coneH * (1 - ml / 10);
  const liqY = yOf(nivel / 10);
  const marcas = [1,2,3,4,5,6,7,8,9,10];
  const vortexDepth = animando ? 10 + Math.sin(vortexAng * 0.1) * 2 : 0;
  return (
    <svg width="96" height="200" viewBox="0 0 96 200">
      <defs>
        <linearGradient id={`tvBody${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(180,215,245,0.55)" /><stop offset="18%"  stopColor="rgba(220,240,255,0.20)" />
          <stop offset="50%"  stopColor="rgba(200,230,255,0.08)" /><stop offset="82%"  stopColor="rgba(220,240,255,0.15)" />
          <stop offset="100%" stopColor="rgba(180,215,245,0.40)" />
        </linearGradient>
        <linearGradient id={`tvShL${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={`tvShR${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)" /><stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
        </linearGradient>
        <clipPath id={`tvLiq${id}`}>
          <path d={`M ${xLi(topY)} ${topY} L ${xLi(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRi(botY-12)} ${botY-12} L ${xRi(topY)} ${topY} Z`} />
        </clipPath>
        <clipPath id={`tvExt${id}`}>
          <path d={`M ${xLo(topY)} ${topY} L ${xLo(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRo(botY-12)} ${botY-12} L ${xRo(topY)} ${topY} Z`} />
        </clipPath>
      </defs>
      <ellipse cx={CX} cy={botY+12} rx={botW+4} ry="4" fill="rgba(0,0,0,0.18)" />
      <path d={`M ${xLo(topY)} ${topY} L ${xLo(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRo(botY-12)} ${botY-12} L ${xRo(topY)} ${topY} Z`}
        fill={`url(#tvBody${id})`} stroke="#8fb8d8" strokeWidth="1.8" />
      <g clipPath={`url(#tvLiq${id})`}>
        <g>
          <path d={`M ${xLi(liqY)} ${liqY} L ${xLi(botY-12)} ${botY-12} Q ${CX} ${botY+9} ${xRi(botY-12)} ${botY-12} L ${xRi(liqY)} ${liqY} Z`}
            fill={cor} opacity="0.86" />
          {animando && <ellipse cx={CX} cy={liqY+10} rx={6+Math.sin(vortexAng*0.15)*2} ry="3" fill="rgba(255,255,255,0.25)" />}
          {nivel > 1 && nivel < 99 && (
            <path d={`M ${xLi(liqY)} ${liqY} Q ${CX-6} ${liqY+vortexDepth} ${CX} ${liqY+vortexDepth+2} Q ${CX+6} ${liqY+vortexDepth} ${xRi(liqY)} ${liqY}`}
              fill="none" stroke={cor} strokeWidth="1.5" />
          )}
        </g>
      </g>
      <g clipPath={`url(#tvExt${id})`}>
        <path d={`M ${xLo(topY)+1} ${topY+2} L ${xLo(botY-14)+1} ${botY-14} L ${xLo(botY-14)+7} ${botY-14} L ${xLo(topY)+8} ${topY+2} Z`}
          fill={`url(#tvShL${id})`} opacity="0.80" />
        <path d={`M ${xLo(topY)+2} ${topY+4} L ${xLo(botY-20)+2} ${botY-20} L ${xLo(botY-20)+3.5} ${botY-20} L ${xLo(topY)+3.5} ${topY+4} Z`}
          fill="rgba(255,255,255,0.65)" />
      </g>
      <g clipPath={`url(#tvExt${id})`}>
        <path d={`M ${xRo(topY)-7} ${topY+2} L ${xRo(botY-14)-4} ${botY-14} L ${xRo(botY-14)} ${botY-14} L ${xRo(topY)-1} ${topY+2} Z`}
          fill={`url(#tvShR${id})`} opacity="0.55" />
      </g>
      <rect x={CX-topW} y={topY-10} width={topW*2} height={12} rx="3" fill="rgba(200,228,248,0.22)" stroke="#8fb8d8" strokeWidth="1.6" />
      <rect x={CX-topWi+1} y={topY-9} width={(topWi-1)*2} height={10} rx="2" fill="rgba(10,20,40,0.35)" />
      <rect x={CX-topW-1} y={topY-1} width={topW*2+2} height="4" rx="1.5" fill="rgba(160,200,230,0.35)" stroke="#8fb8d8" strokeWidth="1" />
      <rect x={CX-topW+3} y={topY-9} width={topW-6} height="3" rx="1.5" fill="rgba(255,255,255,0.30)" />
      {marcas.map(ml => {
        const y = yOf(ml); const isMaj = ml % 2 === 0;
        const lx = xLo(y); const rx = xRo(y);
        return (
          <g key={ml}>
            <line x1={lx} y1={y} x2={lx+(isMaj?9:5)} y2={y} stroke={isMaj?'rgba(14,50,140,0.80)':'rgba(14,50,140,0.42)'} strokeWidth={isMaj?1.2:0.7} />
            <line x1={rx} y1={y} x2={rx-(isMaj?9:5)} y2={y} stroke={isMaj?'rgba(14,50,140,0.80)':'rgba(14,50,140,0.42)'} strokeWidth={isMaj?1.2:0.7} />
            {isMaj && (<>
              <text x={CX} y={y+4.5} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.30)" fontFamily="monospace" fontWeight="700" dx="0.5" dy="0.5">{ml}</text>
              <text x={CX} y={y+4.5} textAnchor="middle" fontSize="8.5" fill="rgba(12,45,130,0.82)" fontFamily="monospace" fontWeight="700">{ml}</text>
            </>)}
          </g>
        );
      })}
      <text x={CX} y={yOf(10)-4} textAnchor="middle" fontSize="6.5" fill="rgba(12,45,130,0.65)" fontFamily="sans-serif" fontWeight="700">mL</text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — RACK DE PONTEIRAS  P20 / P200 / P1000
═══════════════════════════════════════════════════════════ */
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
        <rect x="2" y="18" width={RW} height={RH} rx="6"
          fill="url(#rackGrad)" stroke="#2d1b11" strokeWidth="1.5" />
        <rect x="4" y="20" width={RW - 4} height="6" rx="3"
          fill="rgba(255,255,255,0.07)" />
        {tipDef.map((t, c) => (
          <text key={c} x={2 + 9 + c * GX + GX / 2} y="14"
            textAnchor="middle" fontSize="6.5" fill={t.cor}
            fontWeight="700" fontFamily="monospace">{t.label}</text>
        ))}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const idx = r * COLS + c;
            const tx  = 2 + 9 + c * GX + GX / 2;
            const ty  = 18 + 14 + r * GY;
            const def = tipDef[c];
            const has = tips[idx] !== false;
            return (
              <g key={idx} onClick={() => has && onTake(idx, c)}
                style={{ cursor: has ? 'pointer' : 'default' }}>
                <ellipse cx={tx} cy={ty} rx={def.rTip + 2} ry={3.5}
                  fill={has ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.55)'}
                  stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" />
                {has && (<>
                  <ellipse cx={tx} cy={ty - 1} rx={def.rTip} ry={def.capH * 0.4}
                    fill={def.cor} stroke="rgba(0,0,0,0.25)" strokeWidth="0.7" />
                  <polygon points={`${tx-def.rTip},${ty} ${tx+def.rTip},${ty} ${tx+1.5},${ty+def.altTip} ${tx-1.5},${ty+def.altTip}`}
                    fill={def.cor} opacity="0.72" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
                  <polygon points={`${tx-def.rTip+1},${ty} ${tx-def.rTip+3},${ty} ${tx-0.5},${ty+def.altTip} ${tx-1.5},${ty+def.altTip}`}
                    fill="rgba(255,255,255,0.3)" />
                </>)}
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


/* ═══════════════════════════════════════════════════════════
   SVG — ESPÁTULA METÁLICA
═══════════════════════════════════════════════════════════ */
const EspatulaSVG = ({ espatulaComPo }) => (
  <svg width="28" height="130" viewBox="0 0 28 130">
    <defs>
      <linearGradient id="espMetal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#78909c" /><stop offset="30%"  stopColor="#b0bec5" />
        <stop offset="55%"  stopColor="#eceff1" /><stop offset="75%"  stopColor="#b0bec5" />
        <stop offset="100%" stopColor="#78909c" />
      </linearGradient>
      <linearGradient id="espPega" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#37474f" /><stop offset="40%"  stopColor="#546e7a" />
        <stop offset="60%"  stopColor="#607d8b" /><stop offset="100%" stopColor="#37474f" />
      </linearGradient>
      <linearGradient id="espReflexo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="rgba(255,255,255,0)"   />
        <stop offset="50%"  stopColor="rgba(255,255,255,0.45)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)"   />
      </linearGradient>
    </defs>
    <rect x="11" y="10" width="6" height="88" rx="3" fill="url(#espMetal)" />
    <rect x="13" y="12" width="2" height="84" rx="1" fill="url(#espReflexo)" opacity="0.6" />
    <rect x="8" y="93" width="12" height="28" rx="2" fill="url(#espMetal)" />
    {espatulaComPo && <circle cx="14" cy="105" r="5" fill="white" />}
    <rect x="12" y="95" width="3" height="24" rx="1" fill="url(#espReflexo)" opacity="0.5" />
    <rect x="8" y="118" width="12" height="4" rx="2" fill="#90a4ae" />
    <rect x="10" y="2" width="8" height="12" rx="3" fill="url(#espPega)" stroke="#263238" strokeWidth="0.8" />
    {[4, 6, 8, 10].map(y => (
      <line key={y} x1="10" y1={y} x2="18" y2={y} stroke="rgba(0,0,0,0.25)" strokeWidth="0.7" />
    ))}
    <rect x="9.5" y="12" width="9" height="4" rx="1.5" fill="#455a64" stroke="#263238" strokeWidth="0.7" />
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — MICROPIPETA COM PONTEIRA MONTADA
═══════════════════════════════════════════════════════════ */
const MicropipetaSVG = ({ nivel = 0, corLiq = '#93c5fd', volume = 20, tipMounted = null }) => {
  const tipDefs = [
    { cor: '#c084fc', altTip: 18, rTip: 3.5 },
    { cor: '#4ade80', altTip: 24, rTip: 4.5 },
    { cor: '#fbbf24', altTip: 32, rTip: 5.5 },
  ];
  const tip = tipMounted !== null ? tipDefs[tipMounted] : null;
  return (
    <svg width="58" height={190 + (tip ? tip.altTip + 10 : 0)}
      viewBox={`0 0 58 ${190 + (tip ? tip.altTip + 10 : 0)}`}>
      <defs>
        <linearGradient id="pipB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1a78c2" /><stop offset="60%"  stopColor="#1565c0" />
          <stop offset="100%" stopColor="#0a2d6e" />
        </linearGradient>
        <linearGradient id="pipS" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="pipClip"><rect x="17" y="42" width="22" height="98" rx="7" /></clipPath>
      </defs>
      <ellipse cx="29" cy="11" rx="14" ry="10" fill="#ef5350" stroke="#b71c1c" strokeWidth="1.5" />
      <ellipse cx="29" cy="9" rx="10" ry="6.5" fill="rgba(255,160,160,0.35)" />
      <text x="29" y="12" textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,0.6)" fontFamily="sans-serif">▲</text>
      <rect x="14" y="20" width="30" height="135" rx="13" fill="url(#pipB)" stroke="#0a2d6e" strokeWidth="1.5" />
      <rect x="16" y="22" width="28" height="133" rx="12" fill="url(#pipS)" />
      <rect x="17" y="30" width="24" height="26" rx="4" fill="#091220" stroke="#00bcd4" strokeWidth="1.1" />
      <rect x="19" y="32" width="20" height="22" rx="3" fill="#001428" />
      <text x="29" y="46" textAnchor="middle" fontSize="9" fill="#00e5ff" fontFamily="monospace" fontWeight="700">{volume}</text>
      <text x="29" y="53.5" textAnchor="middle" fontSize="5" fill="rgba(0,229,255,0.55)" fontFamily="sans-serif">µL</text>
      {!tip && (
        <g clipPath="url(#pipClip)">
          <rect x="17" y={140 - nivel} width="22" height={nivel} fill={corLiq} opacity="0.85" />
        </g>
      )}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x="16" y={100 + i * 9} width="26" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
      ))}
      <rect x="18" y="140" width="22" height="13" rx="5" fill="#1a2f4f" stroke="#2196f3" strokeWidth="0.9" />
      <text x="29" y="149.5" textAnchor="middle" fontSize="5.5" fill="#64b5f6" fontFamily="sans-serif">EJECT</text>
      <rect x="24" y="152" width="10" height="12" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="26" y="162" width="6" height="5" rx="1.5" fill="#0f172a" />
      {tip && (
        <g>
          <polygon points={`${29-tip.rTip},167 ${29+tip.rTip},167 ${29+2},${167+tip.altTip} ${29-2},${167+tip.altTip}`}
            fill={tip.cor} opacity="0.75" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
          {nivel > 0 && (() => {
            const alturaLiquido = (nivel / 100) * tip.altTip;
            const yTopo = 167 + tip.altTip - alturaLiquido;
            return (
              <polygon points={`${29-tip.rTip+1},${yTopo} ${29+tip.rTip-1},${yTopo} ${29+1.5},${167+tip.altTip-1} ${29-1.5},${167+tip.altTip-1}`}
                fill={corLiq} opacity="0.85" />
            );
          })()}
          <polygon points={`${29-tip.rTip+1},167 ${29-tip.rTip+2.5},167 ${29-1.2},${167+tip.altTip} ${29-2},${167+tip.altTip}`}
            fill="rgba(255,255,255,0.28)" />
        </g>
      )}
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — MICROSCÓPIO ÓPTICO REALISTA
═══════════════════════════════════════════════════════════ */
const MicroscopioSVG = ({ ativo, lamina = false, foco = 50 }) => {
  const CX        = 95;
  const objCores  = ['#78909c', '#5c6bc0', '#26a69a', '#ef5350'];
  const objLabels = ['4×', '10×', '40×', '100×'];
  const objLens   = [14, 20, 28, 36];
  const activeObj = 2;
  return (
    <svg width="190" height="285" viewBox="0 0 190 285">
      <defs>
        <linearGradient id="mBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2e3b4e" /><stop offset="100%" stopColor="#18253a" />
        </linearGradient>
        <linearGradient id="mArm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1e2a38" /><stop offset="45%"  stopColor="#2e3f54" />
          <stop offset="100%" stopColor="#1e2a38" />
        </linearGradient>
        <linearGradient id="mTube" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#18253a" /><stop offset="50%"  stopColor="#243550" />
          <stop offset="100%" stopColor="#18253a" />
        </linearGradient>
        <linearGradient id="mKnob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#546e7a" /><stop offset="100%" stopColor="#263238" />
        </linearGradient>
        <radialGradient id="eyeGlow" cx="40%" cy="38%">
          <stop offset="0%"   stopColor="#1a3a5f" /><stop offset="100%" stopColor="#050d1a" />
        </radialGradient>
        <filter id="mShadow">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#mShadow)">
        <ellipse cx={CX} cy="264" rx="72" ry="16" fill="url(#mBase)" stroke="#0d1117" strokeWidth="2" />
        <ellipse cx={CX} cy="261" rx="66" ry="12" fill="#263238" stroke="#37474f" strokeWidth="1" />
      </g>
      <ellipse cx={CX} cy="256" rx="16" ry="6" fill={ativo ? 'rgba(255,255,180,0.3)' : 'rgba(255,255,180,0.08)'} />
      <ellipse cx={CX} cy="256" rx="9"  ry="4" fill={ativo ? 'rgba(255,255,180,0.55)' : 'rgba(255,255,180,0.12)'} />
      {ativo && <ellipse cx={CX} cy="256" rx="5" ry="2.5" fill="rgba(255,255,200,0.9)" />}
      <rect x={CX-12} y="78" width="24" height="180" rx="8" fill="url(#mArm)" stroke="#18253a" strokeWidth="1.8" />
      <rect x={CX-8}  y="82" width="6"  height="174" rx="3" fill="rgba(255,255,255,0.05)" />
      <rect x={CX-12} y="232" width="24" height="20" rx="4" fill="#263238" stroke="#37474f" strokeWidth="1" />
      <ellipse cx={CX} cy="232" rx="10" ry="4" fill="#1a253a" />
      <ellipse cx={CX} cy="252" rx="8"  ry="3" fill="#1a253a" />
      <rect x="24" y="142" width="142" height="20" rx="5" fill="#263238" stroke="#37474f" strokeWidth="1.6" />
      <rect x={CX-20} y="143" width="40" height="18" rx="3"
        fill={lamina ? 'rgba(180,220,255,0.25)' : 'rgba(180,220,255,0.10)'}
        stroke={lamina ? 'rgba(140,190,240,0.6)' : 'rgba(140,190,240,0.25)'} strokeWidth="1" />
      <rect x={CX-32} y="140" width="10" height="7" rx="2" fill="#546e7a" stroke="#37474f" strokeWidth="0.8" />
      <rect x={CX+22} y="140" width="10" height="7" rx="2" fill="#546e7a" stroke="#37474f" strokeWidth="0.8" />
      {lamina && (
        <g>
          <rect x={CX-22} y="143" width="44" height="16" rx="2"
            fill="rgba(200,235,255,0.30)" stroke="rgba(140,190,240,0.7)" strokeWidth="1" />
          {[0,1,2,3,4].map(i => (
            <line key={`lh${i}`} x1={CX-18} y1={145+i*3} x2={CX+18} y2={145+i*3}
              stroke="rgba(0,80,200,0.4)" strokeWidth="0.4" />
          ))}
          {[0,1,2,3,4].map(i => (
            <line key={`lv${i}`} x1={CX-18+i*9} y1="145" x2={CX-18+i*9} y2="158"
              stroke="rgba(0,80,200,0.4)" strokeWidth="0.4" />
          ))}
        </g>
      )}
      <circle cx="26"  cy="152" r="8" fill="url(#mKnob)" stroke="#37474f" strokeWidth="1" />
      <circle cx="26"  cy="152" r="5" fill="#1e293b" />
      <circle cx="164" cy="152" r="8" fill="url(#mKnob)" stroke="#37474f" strokeWidth="1" />
      <circle cx="164" cy="152" r="5" fill="#1e293b" />
      <ellipse cx="22" cy="184" rx="11" ry="18" fill="url(#mKnob)" stroke="#546e7a" strokeWidth="1.5" />
      <ellipse cx="22" cy="184" rx="7"  ry="12" fill="#1e293b" />
      {[-6,-3,0,3,6].map(dy => (
        <line key={dy} x1="14" y1={184+dy} x2="30" y2={184+dy} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
      ))}
      <ellipse cx="22" cy="202" rx="8" ry="11" fill="#37474f" stroke="#546e7a" strokeWidth="1" />
      <ellipse cx="22" cy="202" rx="5" ry="7"  fill="#1e293b" />
      <ellipse cx="168" cy="184" rx="11" ry="18" fill="url(#mKnob)" stroke="#546e7a" strokeWidth="1.5" />
      <ellipse cx="168" cy="184" rx="7"  ry="12" fill="#1e293b" />
      <ellipse cx="168" cy="202" rx="8"  ry="11" fill="#37474f" stroke="#546e7a" strokeWidth="1" />
      <ellipse cx="168" cy="202" rx="5"  ry="7"  fill="#1e293b" />
      <rect x="34" y="174" width="5" height="32" rx="2.5" fill="#0d1117" stroke="#37474f" strokeWidth="0.8" />
      <rect x="34" y={174+32*(1-foco/100)} width="5" height={32*foco/100} rx="2.5" fill="#00bcd4" />
      <circle cx={CX} cy="135" r="22" fill="#1e2d3d" stroke="#37474f" strokeWidth="1.8" />
      <circle cx={CX} cy="135" r="16" fill="#263238" stroke="#37474f" strokeWidth="1" />
      <circle cx={CX} cy="135" r="6"  fill="#1a1a2a" />
      {[0,1,2,3].map(i => {
        const ang = (i*90-30)*Math.PI/180;
        const ox = CX+Math.cos(ang)*14; const oy = 135+Math.sin(ang)*14;
        const active = i === activeObj; const len = objLens[i];
        const eaX = active ? ox : ox+Math.cos(ang)*4;
        const eaY = active ? oy+len : oy+Math.sin(ang)*4+8;
        return (
          <g key={i}>
            <circle cx={ox} cy={oy} r={active?5.5:4}
              fill={active?objCores[i]:'#37474f'}
              stroke={active?'rgba(255,255,255,0.3)':'#263238'} strokeWidth="1" />
            <line x1={ox} y1={oy} x2={eaX} y2={eaY}
              stroke={active?objCores[i]:'#37474f'}
              strokeWidth={active?5.5:4} strokeLinecap="round" />
            {active && (<>
              <circle cx={eaX} cy={eaY} r="3" fill={objCores[i]} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <text x={ox+8} y={oy-4} fontSize="6" fill={objCores[i]} fontFamily="monospace" fontWeight="700">{objLabels[i]}</text>
            </>)}
          </g>
        );
      })}
      <rect x={CX-12} y="30" width="24" height="72" rx="6" fill="url(#mTube)" stroke="#18253a" strokeWidth="1.6" />
      <rect x={CX-8}  y="33" width="6"  height="66" rx="3" fill="rgba(255,255,255,0.065)" />
      <path d={`M ${CX} 76 Q ${CX-5} 90 ${CX} 110`} stroke="#1e2a38" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d={`M ${CX} 76 Q ${CX-5} 90 ${CX} 110`} stroke="#263238" strokeWidth="14" strokeLinecap="round" fill="none" />
      <rect x={CX-16} y="8" width="32" height="24" rx="7" fill="#18253a" stroke="#37474f" strokeWidth="1.6" />
      <ellipse cx={CX} cy="8" rx="11" ry="5.5" fill="#263238" stroke="#546e7a" strokeWidth="1.3" />
      <ellipse cx={CX} cy="8" rx="7.5" ry="3.8" fill="url(#eyeGlow)" />
      <ellipse cx={CX-3} cy="6.5" rx="2.5" ry="1.8" fill="rgba(100,180,255,0.22)" />
      <ellipse cx={CX+4} cy="9"   rx="1.2" ry="0.8" fill="rgba(100,180,255,0.14)" />
      <rect x={CX-14} y="18" width="28" height="6" rx="3" fill="#263238" stroke="#37474f" strokeWidth="0.9" />
      {[CX-8,CX-3,CX+2,CX+7].map((xx,i) => (
        <line key={i} x1={xx} y1="18" x2={xx} y2="24" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {ativo && <ellipse cx={CX} cy="200" rx="5" ry="55" fill="rgba(255,255,200,0.05)" className="focus-beam" />}
      <rect x={CX+20} y="95" width="48" height="20" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <text x={CX+44} y="103.5" textAnchor="middle" fontSize="5.5" fill="#60a5fa" fontWeight="700" fontFamily="monospace">OLYMPUS</text>
      <text x={CX+44} y="111.5" textAnchor="middle" fontSize="5"   fill="#64748b" fontFamily="sans-serif">CX23</text>
      {ativo && (
        <g>
          <circle cx="158" cy="30" r="4" fill="#22c55e" />
          <circle cx="158" cy="30" r="6" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="2" className="focus-beam" />
          <text x="153" y="44" textAnchor="middle" fontSize="5.5" fill="#4ade80" fontFamily="sans-serif">ON</text>
        </g>
      )}
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — VÓRTEX
═══════════════════════════════════════════════════════════ */
const VortexSVG = ({ ligado, ang }) => (
  <svg width="92" height="108" viewBox="0 0 92 108">
    <defs>
      <radialGradient id="vtop" cx="42%" cy="38%">
        <stop offset="0%"   stopColor={ligado ? '#64b5f6' : '#546e7a'} />
        <stop offset="100%" stopColor={ligado ? '#1565c0' : '#263238'} />
      </radialGradient>
      <linearGradient id="vbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#2a3a50" /><stop offset="100%" stopColor="#18253a" />
      </linearGradient>
    </defs>
    <rect x="5" y="56" width="82" height="48" rx="8" fill="url(#vbody)" stroke="#0d1117" strokeWidth="1.5" />
    <rect x="10" y="8" width="72" height="52" rx="10" fill="#263238" stroke="#1a2233" strokeWidth="1.5" />
    <ellipse cx="46" cy="22" rx="29" ry="18" fill="url(#vtop)" stroke={ligado ? '#1e88e5' : '#37474f'} strokeWidth="1.5" />
    <ellipse cx="46" cy="22" rx="15" ry="10" fill={ligado ? '#1565c0' : '#1a1a2e'} />
    {ligado && (<>
      <g transform={`rotate(${ang}, 46, 22)`}>
        {[0,90,180,270].map(d => {
          const r = d * Math.PI / 180;
          return <circle key={d} cx={46+Math.cos(r)*9} cy={22+Math.sin(r)*6} r="2.5" fill="rgba(100,200,255,0.75)" />;
        })}
      </g>
      <ellipse cx="46" cy="22" rx="27" ry="16" fill="none" stroke="rgba(100,200,255,0.12)" strokeWidth="7" />
    </>)}
    <circle cx="16" cy="72" r="5.5" fill={ligado ? '#69f0ae' : '#616161'} />
    {ligado && <circle cx="16" cy="72" r="8" fill="none" stroke="rgba(105,240,174,0.3)" strokeWidth="2.5" />}
    <circle cx="75" cy="72" r="8" fill="#37474f" stroke="#546e7a" strokeWidth="1" />
    <line x1="75" y1="72" x2="75" y2="65" stroke="#b0bec5" strokeWidth="1.5" strokeLinecap="round"
      transform={`rotate(${ligado ? ang * 0.3 : 0}, 75, 72)`} />
    <rect x="30" y="79" width="32" height="14" rx="5" fill={ligado ? '#1b5e20' : '#b71c1c'} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <text x="46" y="89.5" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="700">{ligado ? 'ON' : 'OFF'}</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — CÂMARA DE NEUBAUER
═══════════════════════════════════════════════════════════ */
const NeubauerSVG = ({ carregada = false, comOleo = false }) => {
  const gw = 58, gh = 58, cell = 58/5, ox = 21, oy = 12;
  return (
    <svg width="100" height="85" viewBox="0 0 100 85">
      <rect x="2" y="4" width="96" height="70" rx="3"
        fill="rgba(210,238,255,0.12)" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x={ox-6} y={oy-5} width={gw+12} height={gh+10} rx="2"
        fill={carregada ? 'rgba(180,220,255,0.20)' : 'rgba(180,220,255,0.08)'}
        stroke="rgba(140,190,240,0.4)" strokeWidth="1" />
      {Array.from({length:6}).map((_,i) => (
        <g key={i}>
          <line x1={ox+i*cell} y1={oy} x2={ox+i*cell} y2={oy+gh}
            stroke="rgba(0,50,160,0.65)"
            strokeWidth={i===0||i===5?1.8:i===2||i===3?0.4:0.75} />
          <line x1={ox} y1={oy+i*cell} x2={ox+gw} y2={oy+i*cell}
            stroke="rgba(0,50,160,0.65)"
            strokeWidth={i===0||i===5?1.8:i===2||i===3?0.4:0.75} />
        </g>
      ))}
      {Array.from({length:5}).map((_,i) =>
        Array.from({length:5}).map((_,j) => (
          <g key={`${i}-${j}`}>
            <line x1={ox+cell+i*(cell/5)} y1={oy+cell}   x2={ox+cell+i*(cell/5)} y2={oy+cell*2} stroke="rgba(0,60,160,0.22)" strokeWidth="0.3" />
            <line x1={ox+cell} y1={oy+cell+j*(cell/5)} x2={ox+cell*2} y2={oy+cell+j*(cell/5)} stroke="rgba(0,60,160,0.22)" strokeWidth="0.3" />
          </g>
        ))
      )}
      {carregada && <rect x={ox+cell} y={oy+cell} width={cell} height={cell} fill="rgba(200,100,160,0.35)" />}
      {comOleo && <ellipse cx="80" cy="55" rx="10" ry="6" fill="rgba(215,190,45,0.4)" stroke="rgba(180,155,30,0.5)" strokeWidth="1" />}
      <rect x="5" y="7" width="90" height="4" rx="2" fill="rgba(255,255,255,0.17)" />
      <text x="50" y="81" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="sans-serif">Câmara de Neubauer</text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — ERLENMEYER DE DESCARTE
═══════════════════════════════════════════════════════════ */
const BalaoBancada = ({ nivel = 20, cor = 'rgba(150,200,255,0.3)' }) => (
  <svg width="80" height="110" viewBox="0 0 80 110">
    <defs>
      <clipPath id="balClip">
        <path d="M25,28 L6,88 Q6,98,16,98 L64,98 Q74,98,74,88 L55,28 Z" />
      </clipPath>
    </defs>
    <rect x="33" y="0" width="14" height="30" fill="rgba(200,235,255,0.12)" stroke="#94a3b8" strokeWidth="1.4" />
    <rect x="29" y="-2" width="22" height="8" rx="3" fill="#455a64" stroke="#37474f" strokeWidth="1" />
    <path d="M25,28 L6,88 Q6,98,16,98 L64,98 Q74,98,74,88 L55,28 Z"
      fill="rgba(200,235,255,0.09)" stroke="#94a3b8" strokeWidth="1.4" />
    <g clipPath="url(#balClip)">
      <rect x="6" y={98-nivel*0.65} width="68" height={nivel*0.65} fill={cor} opacity="0.88" />
    </g>
    <path d="M12,34 L9,82" stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" fill="none" />
    <text x="40" y="106" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="sans-serif">Descarte</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   ETAPA 20 — INTERFACE DE MICROSCÓPIO DE VIABILIDADE CELULAR
   Câmara de Neubauer realista + células aleatórias + zoom +
   foco + movimento + painel educativo + campos de contagem
═══════════════════════════════════════════════════════════ */
const MicroscopioViabilidade = ({ onConcluir }) => {

  // ── Estado interno ────────────────────────────────────
  const [zoom,       setZoom]       = React.useState(1);
  const [panX,       setPanX]       = React.useState(0);
  const [panY,       setPanY]       = React.useState(0);
  const [focado,     setFocado]     = React.useState(false);
  const [focando,    setFocando]    = React.useState(false);
  const [contVivas,  setContVivas]  = React.useState('');
  const [contMortas, setContMortas] = React.useState('');
  const [contBroto,  setContBroto]  = React.useState('');
  const [enviado,    setEnviado]    = React.useState(false);

  // ── Células geradas uma única vez ─────────────────────
  const [celulas] = React.useState(() => {
    const arr = [];
    const rand = (min, max) => Math.random() * (max - min) + min;
    const GX = 50, GY = 50, GW = 200, GH = 200;
    for (let i = 0; i < 40; i++) arr.push({ tipo:'viva',  x:rand(GX+8,GX+GW-8), y:rand(GY+8,GY+GH-8), r:rand(5,9),  opac:rand(0.55,0.85) });
    for (let i = 0; i < 18; i++) arr.push({ tipo:'morta', x:rand(GX+8,GX+GW-8), y:rand(GY+8,GY+GH-8), r:rand(4.5,8),opac:rand(0.70,0.92) });
    for (let i = 0; i < 8;  i++) {
      const x=rand(GX+14,GX+GW-14), y=rand(GY+14,GY+GH-14), r=rand(6,10), ang=rand(0,Math.PI*2);
      arr.push({ tipo:'broto', x, y, r, bx:x+Math.cos(ang)*(r+rand(3,6)), by:y+Math.sin(ang)*(r+rand(3,6)), br:rand(3,5.5), opac:rand(0.60,0.85) });
    }
    return arr;
  });

  // ── Controles ─────────────────────────────────────────
  const zoomIn  = () => setZoom(z => Math.min(z + 0.35, 4.0));
  const zoomOut = () => setZoom(z => Math.max(z - 0.35, 0.6));
  const STEP = 24;
  const moverCima  = () => setPanY(y => y - STEP);
  const moverBaixo = () => setPanY(y => y + STEP);
  const moverEsq   = () => setPanX(x => x - STEP);
  const moverDir   = () => setPanX(x => x + STEP);

  const handleFocar = () => {
    if (focado || focando) return;
    setFocando(true);
    setTimeout(() => { setFocado(true); setFocando(false); }, 1400);
  };
  const handleDesfocar = () => setFocado(false);

  const handleEnviar = () => {
    if (!contVivas && !contMortas && !contBroto) return;
    setEnviado(true);
    setTimeout(() => onConcluir(contVivas, contMortas, contBroto), 1200);
  };

  // ── Renderização das células ───────────────────────────
  const renderCelulas = () => celulas.map((c, i) => {
    if (c.tipo === 'viva') return (
      <g key={i}>
        <circle cx={c.x+1} cy={c.y+1} r={c.r} fill="rgba(0,0,0,0.10)" />
        <circle cx={c.x} cy={c.y} r={c.r} fill="rgba(210,235,210,0.22)" stroke="rgba(60,160,60,0.82)" strokeWidth="1.1" opacity={c.opac} />
        <circle cx={c.x} cy={c.y} r={c.r*0.38} fill="rgba(80,180,80,0.38)" />
        <circle cx={c.x-c.r*0.30} cy={c.y-c.r*0.30} r={c.r*0.22} fill="rgba(255,255,255,0.45)" />
      </g>
    );
    if (c.tipo === 'morta') return (
      <g key={i}>
        <circle cx={c.x+1} cy={c.y+1} r={c.r} fill="rgba(0,0,0,0.10)" />
        <circle cx={c.x} cy={c.y} r={c.r} fill="rgba(235,70,100,0.72)" stroke="rgba(180,30,60,0.85)" strokeWidth="1.0" opacity={c.opac} />
        <circle cx={c.x} cy={c.y} r={c.r*0.42} fill="rgba(160,20,50,0.50)" />
        <circle cx={c.x-c.r*0.28} cy={c.y-c.r*0.28} r={c.r*0.18} fill="rgba(255,180,180,0.50)" />
      </g>
    );
    if (c.tipo === 'broto') return (
      <g key={i}>
        <circle cx={c.x+1} cy={c.y+1} r={c.r} fill="rgba(0,0,0,0.10)" />
        <circle cx={c.x} cy={c.y} r={c.r} fill="rgba(200,230,200,0.25)" stroke="rgba(60,160,60,0.80)" strokeWidth="1.2" opacity={c.opac} />
        <circle cx={c.x} cy={c.y} r={c.r*0.35} fill="rgba(80,180,80,0.32)" />
        <line x1={c.x} y1={c.y} x2={c.bx} y2={c.by} stroke="rgba(60,160,60,0.45)" strokeWidth="2" />
        <circle cx={c.bx} cy={c.by} r={c.br} fill="rgba(210,240,210,0.30)" stroke="rgba(60,160,60,0.75)" strokeWidth="0.9" opacity={c.opac} />
        <circle cx={c.bx-c.br*0.28} cy={c.by-c.br*0.28} r={c.br*0.25} fill="rgba(255,255,255,0.42)" />
      </g>
    );
    return null;
  });

  // ── Grade de Neubauer SVG fiel ao real ────────────────
  const renderNeubauer = () => {
    const OX=50, OY=50, GW=200, GH=200, Q=GW/3, sq=Q/4;
    const linhas = [];
    // Bordas externas com linha tripla (característica do hemocitômetro)
    [OY, OY+GH].forEach(y => {
      [-1.4,0,1.4].forEach(dy => linhas.push(
        <line key={`th${y}${dy}`} x1={OX-2} y1={y+dy} x2={OX+GW+2} y2={y+dy} stroke="rgba(0,40,140,0.90)" strokeWidth="0.9" />
      ));
    });
    [OX, OX+GW].forEach(x => {
      [-1.4,0,1.4].forEach(dx => linhas.push(
        <line key={`tv${x}${dx}`} x1={x+dx} y1={OY-2} x2={x+dx} y2={OY+GH+2} stroke="rgba(0,40,140,0.90)" strokeWidth="0.9" />
      ));
    });
    // Grade 3×3 dos quadrantes
    for (let i=1; i<=2; i++) {
      linhas.push(<line key={`qh${i}`} x1={OX} y1={OY+Q*i} x2={OX+GW} y2={OY+Q*i} stroke="rgba(0,40,140,0.75)" strokeWidth="1.5" />);
      linhas.push(<line key={`qv${i}`} x1={OX+Q*i} y1={OY} x2={OX+Q*i} y2={OY+GH} stroke="rgba(0,40,140,0.75)" strokeWidth="1.5" />);
    }
    // Sub-grade quadrante central
    const cx0=OX+Q, cy0=OY+Q;
    for (let i=1; i<=3; i++) {
      linhas.push(<line key={`iqh${i}`} x1={cx0} y1={cy0+sq*i} x2={cx0+Q} y2={cy0+sq*i} stroke="rgba(0,50,170,0.65)" strokeWidth="0.9" />);
      linhas.push(<line key={`iqv${i}`} x1={cx0+sq*i} y1={cy0} x2={cx0+sq*i} y2={cy0+Q} stroke="rgba(0,50,170,0.65)" strokeWidth="0.9" />);
    }
    // Micro-grade interna do quadrante central
    const micro=sq/4;
    for (let qi=0; qi<4; qi++) for (let qj=0; qj<4; qj++) {
      const bx=cx0+qi*sq, by=cy0+qj*sq;
      for (let m=1; m<=3; m++) {
        linhas.push(<line key={`mh${qi}${qj}${m}`} x1={bx} y1={by+micro*m} x2={bx+sq} y2={by+micro*m} stroke="rgba(0,60,180,0.28)" strokeWidth="0.4" />);
        linhas.push(<line key={`mv${qi}${qj}${m}`} x1={bx+micro*m} y1={by} x2={bx+micro*m} y2={by+sq} stroke="rgba(0,60,180,0.28)" strokeWidth="0.4" />);
      }
    }
    // Grade 4×4 nos cantos
    [[0,0],[2,0],[0,2],[2,2]].forEach(([qi,qj]) => {
      const bx=OX+qi*Q, by=OY+qj*Q, s4=Q/4;
      for (let m=1; m<=3; m++) {
        linhas.push(<line key={`ch${qi}${qj}${m}`} x1={bx} y1={by+s4*m} x2={bx+Q} y2={by+s4*m} stroke="rgba(0,50,160,0.38)" strokeWidth="0.55" />);
        linhas.push(<line key={`cv${qi}${qj}${m}`} x1={bx+s4*m} y1={by} x2={bx+s4*m} y2={by+Q} stroke="rgba(0,50,160,0.38)" strokeWidth="0.55" />);
      }
    });
    // Rótulos dos quadrantes
    [{label:'A',x:OX+4,y:OY+13},{label:'B',x:OX+Q*2+4,y:OY+13},
     {label:'C',x:OX+Q+4,y:OY+Q+13},{label:'D',x:OX+4,y:OY+Q*2+13},{label:'E',x:OX+Q*2+4,y:OY+Q*2+13}]
    .forEach(({label,x,y}) => linhas.push(
      <text key={`lbl${label}`} x={x} y={y} fontSize="9" fontWeight="700" fill="rgba(0,50,160,0.55)" fontFamily="monospace">{label}</text>
    ));
    return linhas;
  };

  // ── Estilos reutilizáveis ──────────────────────────────
  const btnCtrl = {
    background: 'rgba(14,165,233,0.22)', border: '1px solid rgba(14,165,233,0.45)',
    color: '#7dd3fc', borderRadius: 8, padding: '6px 14px',
    fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s',
  };
  const inputNum = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(100,200,255,0.30)',
    borderRadius: 8, color: '#e2e8f0', padding: '7px 10px',
    width: 64, fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none',
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:80,
      fontFamily:"'Segoe UI', sans-serif" }}>
      <div style={{ background:'linear-gradient(160deg,#0d1a2e,#0a1628,#091220)',
        border:'2px solid rgba(0,229,255,0.35)', borderRadius:24,
        boxShadow:'0 32px 80px rgba(0,0,0,0.75)',
        width:'96vw', maxWidth:1100, maxHeight:'95vh', overflow:'auto', padding:0 }}>

        {/* ── Barra superior ── */}
        <div style={{ background:'linear-gradient(90deg,#0c3a5e,#1a1f6e)',
          borderRadius:'22px 22px 0 0', padding:'14px 24px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom:'1px solid rgba(0,200,255,0.20)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ background:'rgba(0,200,255,0.15)', borderRadius:10, padding:'6px 10px', fontSize:20 }}>🔬</div>
            <div>
              <div style={{ color:'#00e5ff', fontWeight:900, fontSize:16 }}>Microscópio de Viabilidade — Câmara de Neubauer</div>
              <div style={{ color:'#64748b', fontSize:11 }}>Etapa 20 · Análise de Viabilidade Celular por Exclusão com Eritrosina</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:'50%',
              background: focado ? '#22c55e' : focando ? '#f59e0b' : '#ef4444' }} />
            <span style={{ color:'#94a3b8', fontSize:11 }}>
              {focado ? 'Focalizado' : focando ? 'Focando...' : 'Sem foco'}
            </span>
          </div>
        </div>

        {/* ── Corpo principal ── */}
        <div style={{ display:'flex', gap:0 }}>

          {/* ══ COLUNA ESQUERDA — Lente + Controles ══ */}
          <div style={{ flex:1, padding:'18px 16px 18px 20px', display:'flex', flexDirection:'column', gap:14 }}>

            {/* Lente circular */}
            <div style={{ display:'flex', justifyContent:'center' }}>
              <div style={{ width:340, height:340, borderRadius:'50%',
                background:'radial-gradient(circle at 38% 32%, #1a2e1a 0%, #0a150a 60%, #030808 100%)',
                border:'8px solid #1a2035',
                boxShadow:'0 0 0 4px #0d1525, 0 0 40px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.7)',
                overflow:'hidden', position:'relative', cursor:'crosshair' }}>
                {/* Reflexo da lente */}
                <div style={{ position:'absolute', top:14, left:22, width:60, height:18,
                  borderRadius:'50%', background:'rgba(255,255,255,0.06)',
                  transform:'rotate(-25deg)', pointerEvents:'none', zIndex:10 }} />
                {/* Campo de visão */}
                <div style={{ width:'100%', height:'100%', overflow:'hidden', position:'relative',
                  filter: focado ? 'blur(0px)' : focando ? 'blur(2.5px)' : 'blur(5px)',
                  transition:'filter 1.2s ease' }}>
                  <div style={{ transform:`scale(${zoom}) translate(${panX/zoom}px, ${panY/zoom}px)`,
                    transformOrigin:'center center', transition:'transform 0.22s ease',
                    width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="300" height="300" viewBox="0 0 300 300">
                      <defs>
                        <radialGradient id="bgMic" cx="50%" cy="50%">
                          <stop offset="0%"   stopColor="rgba(210,235,200,0.22)" />
                          <stop offset="70%"  stopColor="rgba(170,205,165,0.12)" />
                          <stop offset="100%" stopColor="rgba(130,170,130,0.06)" />
                        </radialGradient>
                        <radialGradient id="bgLens" cx="50%" cy="50%">
                          <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
                          <stop offset="85%"  stopColor="rgba(0,0,0,0)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="300" height="300" fill="url(#bgMic)" />
                      {renderNeubauer()}
                      {renderCelulas()}
                      <circle cx="150" cy="150" r="150" fill="url(#bgLens)" />
                    </svg>
                  </div>
                </div>
                {/* Retículo central */}
                {focado && (
                  <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:9 }}>
                    <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
                      <line x1="170" y1="145" x2="170" y2="195" stroke="rgba(0,229,255,0.30)" strokeWidth="0.8" />
                      <line x1="145" y1="170" x2="195" y2="170" stroke="rgba(0,229,255,0.30)" strokeWidth="0.8" />
                      <circle cx="170" cy="170" r="12" fill="none" stroke="rgba(0,229,255,0.20)" strokeWidth="0.8" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de foco */}
            <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
              <button style={{ ...btnCtrl, background: focado ? 'rgba(34,197,94,0.22)' : btnCtrl.background,
                borderColor: focado ? '#22c55e' : 'rgba(14,165,233,0.45)' }} onClick={handleFocar}>
                🔍 Focar
              </button>
              <button style={{ ...btnCtrl, background:'rgba(239,68,68,0.15)',
                borderColor:'rgba(239,68,68,0.40)', color:'#f87171' }} onClick={handleDesfocar}>
                💧 Desfocar
              </button>
            </div>

            {/* Controle de zoom */}
            <div>
              <div style={{ color:'#64748b', fontSize:10, textAlign:'center', marginBottom:6 }}>
                ZOOM — {zoom.toFixed(1)}×
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'center', alignItems:'center' }}>
                <button style={btnCtrl} onClick={zoomOut}>− Zoom</button>
                <div style={{ width:90, height:6, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${((zoom-0.6)/3.4)*100}%`,
                    background:'linear-gradient(90deg,#0ea5e9,#6366f1)', borderRadius:4, transition:'width 0.2s' }} />
                </div>
                <button style={btnCtrl} onClick={zoomIn}>+ Zoom</button>
              </div>
            </div>

            {/* Navegação da lâmina */}
            <div>
              <div style={{ color:'#64748b', fontSize:10, textAlign:'center', marginBottom:6 }}>MOVER LÂMINA</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5, width:130, margin:'0 auto' }}>
                <div /><button style={{ ...btnCtrl, padding:'5px 0', textAlign:'center' }} onClick={moverCima}>⬆</button><div />
                <button style={{ ...btnCtrl, padding:'5px 0', textAlign:'center' }} onClick={moverEsq}>⬅</button>
                <button style={{ ...btnCtrl, padding:'5px 0', textAlign:'center', background:'rgba(255,255,255,0.05)', color:'#475569' }}
                  onClick={() => { setPanX(0); setPanY(0); }}>○</button>
                <button style={{ ...btnCtrl, padding:'5px 0', textAlign:'center' }} onClick={moverDir}>➡</button>
                <div /><button style={{ ...btnCtrl, padding:'5px 0', textAlign:'center' }} onClick={moverBaixo}>⬇</button><div />
              </div>
            </div>

          </div>

          {/* ══ COLUNA DIREITA — Painel educativo + Contagem ══ */}
          <div style={{ width:310, background:'rgba(0,0,0,0.28)',
            borderLeft:'1px solid rgba(0,200,255,0.12)', borderRadius:'0 0 22px 0',
            padding:'18px 16px', display:'flex', flexDirection:'column', gap:16 }}>

            {/* Legenda visual */}
            <div>
              <div style={{ color:'#00e5ff', fontSize:12, fontWeight:700, marginBottom:10,
                borderBottom:'1px solid rgba(0,229,255,0.15)', paddingBottom:6 }}>
                📚 Referência Visual
              </div>

              {/* Célula viva */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10,
                background:'rgba(34,197,94,0.07)', borderRadius:10, padding:'8px 10px',
                border:'1px solid rgba(34,197,94,0.18)' }}>
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="17" cy="17" r="12" fill="rgba(210,235,210,0.25)" stroke="rgba(60,160,60,0.85)" strokeWidth="1.5" />
                  <circle cx="17" cy="17" r="5"  fill="rgba(80,180,80,0.40)" />
                  <circle cx="12" cy="12" r="3"  fill="rgba(255,255,255,0.45)" />
                </svg>
                <div>
                  <div style={{ color:'#4ade80', fontWeight:700, fontSize:12 }}>Célula Viva</div>
                  <div style={{ color:'#64748b', fontSize:10, lineHeight:1.4 }}>Transparente, borda verde,<br/>núcleo visível</div>
                </div>
              </div>

              {/* Célula morta */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10,
                background:'rgba(239,68,68,0.07)', borderRadius:10, padding:'8px 10px',
                border:'1px solid rgba(239,68,68,0.18)' }}>
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="17" cy="17" r="12" fill="rgba(235,70,100,0.72)" stroke="rgba(180,30,60,0.85)" strokeWidth="1.5" />
                  <circle cx="17" cy="17" r="5"  fill="rgba(160,20,50,0.55)" />
                  <circle cx="12" cy="12" r="3"  fill="rgba(255,180,180,0.50)" />
                </svg>
                <div>
                  <div style={{ color:'#f87171', fontWeight:700, fontSize:12 }}>Célula Morta</div>
                  <div style={{ color:'#64748b', fontSize:10, lineHeight:1.4 }}>Eritrosina incorporada,<br/>cor rosa/avermelhada</div>
                </div>
              </div>

              {/* Brotamento */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4,
                background:'rgba(99,102,241,0.07)', borderRadius:10, padding:'8px 10px',
                border:'1px solid rgba(99,102,241,0.18)' }}>
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="15" cy="18" r="9"  fill="rgba(200,230,200,0.28)" stroke="rgba(60,160,60,0.82)" strokeWidth="1.3" />
                  <line x1="22" y1="14" x2="26" y2="11" stroke="rgba(60,160,60,0.45)" strokeWidth="2" />
                  <circle cx="27" cy="10" r="5"  fill="rgba(210,240,210,0.32)" stroke="rgba(60,160,60,0.78)" strokeWidth="1.1" />
                  <circle cx="11" cy="14" r="3"  fill="rgba(255,255,255,0.42)" />
                </svg>
                <div>
                  <div style={{ color:'#a78bfa', fontWeight:700, fontSize:12 }}>Brotamento Celular</div>
                  <div style={{ color:'#64748b', fontSize:10, lineHeight:1.4 }}>Célula-mãe + célula-filha<br/>ligadas (levedura em divisão)</div>
                </div>
              </div>
            </div>

            {/* Campos de contagem */}
            <div>
              <div style={{ color:'#00e5ff', fontSize:12, fontWeight:700, marginBottom:10,
                borderBottom:'1px solid rgba(0,229,255,0.15)', paddingBottom:6 }}>
                🧮 Contagem Observada
              </div>
              {[
                { label:'Células Vivas',         icon:'🟢', val:contVivas,  set:setContVivas  },
                { label:'Células Mortas',         icon:'🔴', val:contMortas, set:setContMortas },
                { label:'Células com Brotamento', icon:'🟣', val:contBroto,  set:setContBroto  },
              ].map(({ label, icon, val, set }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ color:'#94a3b8', fontSize:11 }}>{icon} {label}</div>
                  <input type="number" min="0" value={val} onChange={e => set(e.target.value)}
                    placeholder="0" style={inputNum} disabled={enviado} />
                </div>
              ))}
              {/* Viabilidade calculada ao vivo */}
              {(contVivas || contMortas) && (
                <div style={{ background:'rgba(0,229,255,0.07)', border:'1px solid rgba(0,229,255,0.22)',
                  borderRadius:10, padding:'10px 12px', marginTop:8 }}>
                  <div style={{ color:'#64748b', fontSize:9, marginBottom:4 }}>VIABILIDADE CALCULADA</div>
                  <div style={{ color:'#00e5ff', fontSize:22, fontWeight:900, fontFamily:'monospace' }}>
                    {(() => {
                      const v = parseInt(contVivas) || 0, m = parseInt(contMortas) || 0;
                      const total = v + m;
                      return total === 0 ? '—' : `${((v/total)*100).toFixed(1)}%`;
                    })()}
                  </div>
                  <div style={{ color:'#475569', fontSize:9 }}>Vivas / (Vivas + Mortas) × 100</div>
                </div>
              )}
            </div>

            {/* Princípio do método */}
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px',
              border:'1px solid rgba(255,255,255,0.07)', fontSize:10, color:'#64748b', lineHeight:1.6 }}>
              <div style={{ color:'#94a3b8', fontWeight:700, marginBottom:4 }}>📖 Princípio do Método</div>
              A eritrosina penetra apenas em células mortas (membrana comprometida), corando-as de rosa/vermelho.
              Células vivas excluem o corante e permanecem transparentes.
              A câmara de Neubauer possui volume definido (0,1 mm³ por quadrante).
            </div>

            {/* Botão concluir */}
            <button onClick={handleEnviar} disabled={enviado}
              style={{ background: enviado ? 'rgba(34,197,94,0.25)' : 'linear-gradient(90deg,#059669,#0ea5e9)',
                color:'white', border: enviado ? '1px solid #22c55e' : 'none',
                borderRadius:12, padding:'12px 0', fontSize:14, fontWeight:700,
                cursor: enviado ? 'default' : 'pointer', width:'100%', transition:'all 0.2s' }}>
              {enviado ? '✅ Análise Registrada!' : '📋 Registrar Contagem'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════
   ETAPAS DO PROTOCOLO
═══════════════════════════════════════════════════════════ */
const etapas = [
  { id: 0,  titulo:'levar a amostra ate o tubo de ensaio',                        descricao:'Arraste a amostra até o tubo de ensaio para transferir 5 mL da amostra',                                       item:'amostra',  alvo:'tubo'        },
  { id: 1,  titulo:'coletar 5g de Papaina',                                        descricao:'arraste a espatula ate a papaina para pegar 5g do reagente.',                                                    item:'espatula', alvo:'papaina'     },
  { id: 2,  titulo:'Adicionar 5g de Papaina no tubo de ensaio',                    descricao:'arraste a espatula ate o tubo de ensaio.',                                                                       item:'espatula', alvo:'tubo'        },
  { id: 3,  titulo:'Homogeneizar no Vórtex',                                       descricao:'Arraste o Tubo de Ensaio até o Agitador Vórtex.',                                                               item:'tubo',     alvo:'vortex'      },
  { id: 4,  titulo:'Selecionar Ponteira P1000',                                    descricao:'Clique em uma ponteira P1000 (Amarela) no rack para acoplá-la à micropipeta.',                                  item:'rack',     alvo:'rack'        },
  { id: 5,  titulo:'Carregar com Amostra omogenizada',                             descricao:'Arraste a micropipeta até o tubo de ensaio para aspirar 200 µL.',                                               item:'pipeta',   alvo:'tubo'        },
  { id: 6,  titulo:'Transferir Amostra omogenizada para o Tubo de ensaio 2',       descricao:'Arraste a micropipeta carregada até o Tubo de Ensaio 2.',                                                       item:'pipeta',   alvo:'tubovazio'   },
  { id: 7,  titulo:'carregar com agua desmineralizada',                            descricao:'Arraste a micropipeta até a agua desmineralizada.',                                                              item:'pipeta',   alvo:'agua'        },
  { id: 8,  titulo:'Transferir agua desmineralizada para o Tubo de ensaio 2',      descricao:'Arraste a micropipeta carregada até o Tubo de Ensaio 2.',                                                       item:'pipeta',   alvo:'tubovazio'   },
  { id: 9,  titulo:'Homogeneizar no Vórtex',                                       descricao:'Arraste o Tubo de Ensaio 2 até o Agitador Vórtex.',                                                             item:'tubovazio',alvo:'vortex'      },
  { id: 10, titulo:'Carregar Amostra diluida para o Tubo de ensaio 2',             descricao:'Arraste a micropipeta até o Tubo de Ensaio 2.',                                                                 item:'pipeta',   alvo:'tubovazio'   },
  { id: 11, titulo:'Transferir Amostra diluida para o Tubo de ensaio 3',           descricao:'Arraste a micropipeta carregada até o Tubo de Ensaio 3.',                                                       item:'pipeta',   alvo:'tubofinal'   },
  { id: 12, titulo:'Selecionar Ponteira P20',                                      descricao:'Clique em uma ponteira P20 (roxa) no rack para acoplá-la à micropipeta',                                        item:'rack',     alvo:'rack'        },
  { id: 13, titulo:'Carregar a Micropipeta com Eritrosina 0,1%',                   descricao:'Arraste a micropipeta até a Eritrosina 0,1%',                                                                   item:'pipeta',   alvo:'eritrosina'  },
  { id: 14, titulo:'Transferir Eritrosina 0,1% para o Tubo de ensaio 3',           descricao:'Arraste a micropipeta carregada de Eritrosina 0,1% até o Tubo de Ensaio 3.',                                    item:'pipeta',   alvo:'tubofinal'   },
  { id: 15, titulo:'Homogeneizar no Vórtex',                                       descricao:'Arraste o Tubo de Ensaio 3 até o Agitador Vórtex.',                                                             item:'tubofinal',alvo:'vortex'      },
  { id: 16, titulo:'Coletar da Amostra Preparada com Eritrosina 0,1%',             descricao:'Arraste a micropipeta até o Tubo 3 para coletar amostra com Eritrosina 0,1% e homogeneizada.',                 item:'pipeta',   alvo:'tubofinal'   },
  { id: 17, titulo:'Preencher Câmara',                                             descricao:'Arraste a micropipeta até a Câmara de Neubauer para preencher.',                                                item:'pipeta',   alvo:'neubauer'    },
  { id: 18, titulo:'Aplicar Óleo de Imersão',                                      descricao:'Arraste o frasco de Óleo até a Câmara de Neubauer.',                                                            item:'oil',      alvo:'neubauer'    },
  { id: 19, titulo:'Posicionar no Microscópio',                                    descricao:'Arraste a Câmara de Neubauer para a platina do Microscópio.',                                                   item:'neubauer', alvo:'microscopio' },
  { id: 20, titulo:'Iniciar Contagem Celular',                                     descricao:'Clique no Microscópio para focalizar e realizar a contagem.',                                                   item:null,       alvo:'microscopio' },
  // 🔹 ETAPA 21 — NOVA (análise de viabilidade interativa)
  { id: 21, titulo:'Análise de Viabilidade Celular',                               descricao:'Clique no Microscópio para abrir a interface de contagem de viabilidade celular.',                             item:null,       alvo:'microscopio' },
];


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorMicrobiologico = () => {

  // ── Funções do jogo ───────────────────────────────────
  const celebrarAcerto = (bonus = 100) => {
    setPontuacao(p => p + bonus);
    setMostrarParabens(true);
    setTimeout(() => setMostrarParabens(false), 2200);
  };

  const proximaEtapa = () => {
    setEtapaAtual(e => {
      if (e >= etapas.length - 1) { setConcluido(true); return e; }
      return e + 1;
    });
  };

  // ── Jogo ──────────────────────────────────────────────
  const [pontuacao,       setPontuacao]       = useState(0);
  const [etapaAtual,      setEtapaAtual]      = useState(0);
  const [itemSegurado,    setItemSegurado]    = useState(null);
  const [mostrarParabens, setMostrarParabens] = useState(false);
  const [concluido,       setConcluido]       = useState(false);
  const [espatulaComPo,   setEspatulaComPo]   = useState(false);

  // ── Micropipeta ───────────────────────────────────────
  const [nivelPipeta,  setNivelPipeta]  = useState(0);
  const [corPipeta,    setCorPipeta]    = useState('#93c5fd');
  const [pipetaCheia,  setPipetaCheia]  = useState(false);
  const [volumePipeta, setVolumePipeta] = useState(20);
  const [tipIdx,       setTipIdx]       = useState(null);

  // ── Rack de ponteiras ─────────────────────────────────
  const [tips, setTips] = useState(Array(12).fill(true));

  // ── Tubos de ensaio ───────────────────────────────────
  const [nivelTubo,  setNivelTubo]  = useState(0);
  const [corTubo,    setCorTubo]    = useState('rgba(80,200,120,0.72)');
  const [nivelVazio, setNivelVazio] = useState(0);
  const [corVazio,   setCorVazio]   = useState('rgba(80,200,120,0.72)');
  const [nivelFinal, setNivelFinal] = useState(0);
  const [corFinal,   setCorFinal]   = useState('rgba(80,200,120,0.72)');
  const [tuboPrep,   setTuboPrep]   = useState(false);

  // ── Amostra ───────────────────────────────────────────
  const [nivelAmostra, setNivelAmostra] = useState(80);

  // ── Vórtex ────────────────────────────────────────────
  const [vortexLigado,   setVortexLigado]   = useState(false);
  const [vortexAng,      setVortexAng]      = useState(0);
  const [homogeneizado,  setHomogeneizado]  = useState(false);
  const [tuboNoVortex,   setTuboNoVortex]   = useState(false);
  const [tipoTuboVortex, setTipoTuboVortex] = useState(null);

  // ── Câmara de Neubauer ────────────────────────────────
  const [neuCarreg,   setNeuCarreg]   = useState(false);
  const [oilAplicado, setOilAplicado] = useState(false);
  const [laminaNaMic, setLaminaNaMic] = useState(false);

  // ── Microscópio ───────────────────────────────────────
  const [microscopioOn, setMicroscopioOn] = useState(false);
  const [foco,          setFoco]          = useState(50);
  const [contagem,      setContagem]      = useState(null);

  // ── Etapa 21 — Interface de viabilidade ───────────────
  const [mostrarViabilidade, setMostrarViabilidade] = useState(false);
  const [viabilidadeConc,    setViabilidadeConc]    = useState(null);

  const etapasPonteiraCorreta = { 4: 2, 12: 0 };

  // ── Estrelas (parabéns) ───────────────────────────────
  const [estrelas] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id:    i,
      left:  `${Math.random() * 100}%`,
      top:   `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
    }))
  );


  // ── Girar vórtex ──────────────────────────────────────
  React.useEffect(() => {
    if (!vortexLigado) return;
    let id;
    const tick = () => { setVortexAng(a => a + 18); id = requestAnimationFrame(tick); };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [vortexLigado]);

  // ── Preencher pipeta progressivamente ─────────────────
  React.useEffect(() => {
    if (!pipetaCheia) return;
    let v = 0;
    const intervalo = setInterval(() => {
      v += 5;
      setNivelPipeta(Math.min(v, 100));
      if (v >= 100) clearInterval(intervalo);
    }, 70);
    return () => clearInterval(intervalo);
  }, [pipetaCheia]);

  // ── Foco do microscópio ───────────────────────────────
  React.useEffect(() => {
    if (!microscopioOn || contagem) return;
    let f = 0;
    const intervalo = setInterval(() => {
      f += 2;
      setFoco(Math.min(f, 100));
      if (f >= 100) {
        clearInterval(intervalo);
        const val = (Math.random() * 3 + 4).toFixed(2);
        setContagem(val);
        celebrarAcerto(200);
        proximaEtapa();
      }
    }, 50);
    return () => clearInterval(intervalo);
  }, [microscopioOn]);


  // ── Drag handlers ─────────────────────────────────────
  const handleDragStart = (item, e) => {
    if (!isItem(item)) return;
    setItemSegurado(item);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd  = () => setItemSegurado(null);
  const handleDragOver = (e) => e.preventDefault();


  // ── Clique no rack — acoplagem de ponteira ─────────────
  const handlePickTip = (idx, col) => {
    if (tipIdx !== null) return;
    const colEsperada = etapasPonteiraCorreta[etapaAtual];
    if (colEsperada === undefined) return;
    if (col !== colEsperada) return;
    setTips(t => { const n = [...t]; n[idx] = false; return n; });
    setTipIdx(col);
    const vols = [20, 200, 1000];
    setVolumePipeta(vols[col]);
    celebrarAcerto();
    proximaEtapa();
  };


  // ── Clique no microscópio ─────────────────────────────
  const handleClicaMicroscopio = () => {
    // ETAPA 20 — focaliza
    if (etapaAtual === 20 && laminaNaMic && !microscopioOn) {
      setMicroscopioOn(true);
    }
    // 🔹 ETAPA 21 — abre interface de viabilidade
    if (etapaAtual === 21 && contagem && !mostrarViabilidade) {
      setMostrarViabilidade(true);
    }
  };


  // ── Conclusão da Etapa 21 ─────────────────────────────
  const handleViabilidadeConcluida = (vivas, mortas, broto) => {
    setViabilidadeConc({ vivas, mortas, broto });
    setMostrarViabilidade(false);
    celebrarAcerto(300);
    proximaEtapa();
  };


  // ── Drop handler ──────────────────────────────────────
  const handleDrop = (alvo, e) => {
    e.preventDefault();

    // 🔹 ETAPA 0 — AMOSTRA → TUBO
    if (itemSegurado === 'amostra' && alvo === 'tubo' && etapaAtual === 0) {
      setNivelAmostra(a => Math.max(a - 20, 0));
      setNivelTubo(50);
      setTuboPrep(true);
      celebrarAcerto();
      proximaEtapa();
    }

    // 🔹 ETAPA 1 — ESPÁTULA → PAPAÍNA
    if (itemSegurado === 'espatula' && alvo === 'papaina' && etapaAtual === 1) {
      setEspatulaComPo(true);
      celebrarAcerto();
      proximaEtapa();
    }

    // 🔹 ETAPA 2 — ESPÁTULA → TUBO
    if (itemSegurado === 'espatula' && alvo === 'tubo' && etapaAtual === 2) {
      setEspatulaComPo(false);
      setNivelTubo(53);
      setCorTubo('#ce1818');
      celebrarAcerto();
      proximaEtapa();
    }

    // 🔹 ETAPA 3 — TUBO → VÓRTEX
    if (itemSegurado === 'tubo' && alvo === 'vortex' && etapaAtual === 3) {
      setTipoTuboVortex('tubo');
      setTuboNoVortex(true);
      setVortexLigado(true);
      setTimeout(() => {
        setVortexLigado(false); setHomogeneizado(true);
        setCorTubo('rgba(200,90,170,0.75)');
        setTuboNoVortex(false); setTipoTuboVortex(null);
        celebrarAcerto(); proximaEtapa();
      }, 3000);
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 5 — PIPETA → TUBO
    if (itemSegurado === 'pipeta' && alvo === 'tubo' && etapaAtual === 5 && tipIdx !== null && !pipetaCheia) {
      setCorPipeta('#f472b6'); setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 6 — PIPETA → TUBOVAZIO
    if (itemSegurado === 'pipeta' && alvo === 'tubovazio' && etapaAtual === 6 && pipetaCheia) {
      setCorVazio('rgba(185, 107, 18, 0.98)');
      setNivelVazio(t => Math.min((t || 0) + 28, 100));
      setNivelPipeta(0); setPipetaCheia(false);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 7 — PIPETA → ÁGUA
    if (itemSegurado === 'pipeta' && alvo === 'agua' && etapaAtual === 7 && tipIdx !== null && !pipetaCheia) {
      setCorPipeta('#7abbe0'); setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 8 — PIPETA → TUBOVAZIO
    if (itemSegurado === 'pipeta' && alvo === 'tubovazio' && etapaAtual === 8 && pipetaCheia) {
      setCorVazio('rgba(185, 107, 18, 0.98)');
      setNivelVazio(t => Math.min((t || 0) + 29, 100));
      setNivelPipeta(0); setPipetaCheia(false);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 9 — TUBOVAZIO → VÓRTEX
    if (itemSegurado === 'tubovazio' && alvo === 'vortex' && etapaAtual === 9) {
      setTipoTuboVortex('tubovazio');
      setTuboNoVortex(true); setVortexLigado(true);
      setTimeout(() => {
        setVortexLigado(false); setHomogeneizado(true);
        setCorVazio('rgba(170, 143, 85, 0.75)');
        setTuboNoVortex(false); setTipoTuboVortex(null);
        celebrarAcerto(); proximaEtapa();
      }, 3000);
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 10 — PIPETA → TUBOVAZIO
    if (itemSegurado === 'pipeta' && alvo === 'tubovazio' && etapaAtual === 10 && tipIdx !== null && !pipetaCheia) {
      setCorPipeta('#00c42a'); setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 11 — PIPETA → TUBOFINAL
    if (itemSegurado === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 11 && pipetaCheia) {
      setCorFinal('rgba(175, 136, 92, 0.98)');
      setNivelFinal(t => Math.min((t || 0) + 28, 100));
      setNivelPipeta(0); setPipetaCheia(false); setTipIdx(null);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 13 — PIPETA → ERITROSINA
    if (itemSegurado === 'pipeta' && alvo === 'eritrosina' && etapaAtual === 13 && tipIdx !== null && !pipetaCheia) {
      setCorPipeta('#ff0000'); setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 14 — PIPETA → TUBOFINAL
    if (itemSegurado === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 14 && pipetaCheia) {
      setCorFinal('rgba(211, 103, 103, 0.98)');
      setNivelFinal(t => Math.min((t || 0) + 29, 100));
      setNivelPipeta(0); setPipetaCheia(false);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 15 — TUBOFINAL → VÓRTEX
    if (itemSegurado === 'tubofinal' && alvo === 'vortex' && etapaAtual === 15) {
      setTipoTuboVortex('tubofinal');
      setTuboNoVortex(true); setVortexLigado(true);
      setTimeout(() => {
        setVortexLigado(false); setHomogeneizado(true);
        setCorFinal('rgba(255, 108, 108, 0.75)');
        setTuboNoVortex(false); setTipoTuboVortex(null);
        celebrarAcerto(); proximaEtapa();
      }, 3000);
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 16 — PIPETA → TUBOFINAL
    if (itemSegurado === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 16 && tipIdx !== null && !pipetaCheia) {
      setCorPipeta('#e46d6d'); setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 17 — PIPETA → CÂMARA DE NEUBAUER
    if (itemSegurado === 'pipeta' && alvo === 'neubauer' && etapaAtual === 17 && pipetaCheia) {
      setNeuCarreg(true);
      setNivelPipeta(0); setPipetaCheia(false);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 18 — ÓLEO → CÂMARA DE NEUBAUER
    if (itemSegurado === 'oil' && alvo === 'neubauer' && etapaAtual === 18) {
      setOilAplicado(true);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }

    // 🔹 ETAPA 19 — CÂMARA → MICROSCÓPIO
    if (itemSegurado === 'neubauer' && alvo === 'microscopio' && etapaAtual === 19) {
      setLaminaNaMic(true);
      celebrarAcerto(); proximaEtapa();
      setItemSegurado(null); return;
    }
  };


  // ── Helpers de classe ─────────────────────────────────
  const isAlvo  = (id) => etapas[etapaAtual]?.alvo === id;
  const isItem  = (id) => etapas[etapaAtual]?.item === id;
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';
  const itemCls = (id) => isItem(id) ? 'pulse-item'  : '';


  // ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding:16, fontFamily:"'Segoe UI', sans-serif" }}>

      <style>{`
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,0.5)} 50%{box-shadow:0 0 0 12px rgba(34,211,238,0)} }
        @keyframes vibrar     { 0%,100%{transform:translateX(0) rotate(0deg)} 20%{transform:translateX(-4px) rotate(-1.5deg)} 40%{transform:translateX(4px) rotate(1.5deg)} 60%{transform:translateX(-3px) rotate(-1deg)} 80%{transform:translateX(3px) rotate(1deg)} }
        @keyframes ping-slow  { 0%{transform:scale(1);opacity:0.9} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
        @keyframes focusBeam  { 0%,100%{opacity:0.15} 50%{opacity:0.35} }
        .pulse-item { animation:pulse-glow 1.1s ease-in-out infinite; border-radius:14px; }
        .vibrar     { animation:vibrar 0.11s linear infinite; }
        .focus-beam { animation:focusBeam 1.8s ease-in-out infinite; }
        .item-drag              { cursor:grab; transition:transform 0.14s,filter 0.14s; }
        .item-drag:hover        { transform:scale(1.07) translateY(-2px); filter:brightness(1.1); }
        .item-drag:active       { cursor:grabbing; opacity:0.6; }
        .drop-target { filter:brightness(1.2); transform:scale(1.06); outline:3px solid #22d3ee; outline-offset:4px; border-radius:12px; }
        .badge-etapa { background:linear-gradient(135deg,#0ea5e9,#6366f1); border-radius:50%; width:54px; height:54px; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:white; box-shadow:0 4px 18px rgba(99,102,241,0.5); flex-shrink:0; }
      `}</style>


      {/* ── OVERLAY PARABÉNS ── */}
      {mostrarParabens && (
        <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)', color:'white', padding:'28px 52px', borderRadius:28, boxShadow:'0 24px 60px rgba(0,0,0,0.55)', border:'3px solid white', textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <Star size={48} fill="currentColor" />
              <div>
                <h3 style={{ fontSize:28, fontWeight:900, margin:0 }}>Parabéns!</h3>
                <p  style={{ fontSize:18, margin:0 }}>+100 pontos</p>
              </div>
              <CheckCircle size={48} />
            </div>
          </div>
          <div style={{ position:'absolute', inset:0 }}>
            {estrelas.map(s => (
              <Star key={s.id} style={{ position:'absolute', left:s.left, top:s.top, width:20, color:'#fbbf24', animationDelay:s.delay, animation:'ping-slow 0.9s ease-out forwards' }} fill="currentColor" />
            ))}
          </div>
        </div>
      )}


      {/* ── MODAL VIABILIDADE CELULAR (ETAPA 21) ── */}
      {mostrarViabilidade && (
        <MicroscopioViabilidade onConcluir={handleViabilidadeConcluida} />
      )}


      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.80)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:70 }}>
          <div style={{ background:'linear-gradient(135deg,#1e3a5f,#0d2137)', border:'2px solid #00e5ff', borderRadius:24, padding:'48px 64px', textAlign:'center', color:'white' }}>
            <div style={{ fontSize:72 }}>🔬</div>
            <h2 style={{ fontSize:32, fontWeight:900, color:'#00e5ff', margin:'12px 0' }}>Análise Concluída!</h2>

            {contagem && (
              <div style={{ background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.3)', borderRadius:14, padding:'16px 36px', marginBottom:16 }}>
                <div style={{ fontSize:13, color:'#94a3b8', marginBottom:4 }}>Concentração Celular</div>
                <div style={{ fontSize:48, fontWeight:900, color:'#00e5ff', fontFamily:'monospace' }}>{contagem}</div>
                <div style={{ fontSize:14, color:'#67e8f9' }}>× 10⁶ células / mL</div>
              </div>
            )}

            {viabilidadeConc && (
              <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.28)', borderRadius:14, padding:'14px 28px', marginBottom:24 }}>
                <div style={{ fontSize:12, color:'#94a3b8', marginBottom:8 }}>Contagem de Viabilidade (Etapa 21)</div>
                <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:900, color:'#4ade80' }}>{viabilidadeConc.vivas || 0}</div>
                    <div style={{ fontSize:10, color:'#64748b' }}>🟢 Vivas</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:900, color:'#f87171' }}>{viabilidadeConc.mortas || 0}</div>
                    <div style={{ fontSize:10, color:'#64748b' }}>🔴 Mortas</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:900, color:'#a78bfa' }}>{viabilidadeConc.broto || 0}</div>
                    <div style={{ fontSize:10, color:'#64748b' }}>🟣 Brotamento</div>
                  </div>
                  {(parseInt(viabilidadeConc.vivas)||0) + (parseInt(viabilidadeConc.mortas)||0) > 0 && (
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:22, fontWeight:900, color:'#00e5ff' }}>
                        {(((parseInt(viabilidadeConc.vivas)||0) / ((parseInt(viabilidadeConc.vivas)||0)+(parseInt(viabilidadeConc.mortas)||0)))*100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize:10, color:'#64748b' }}>📊 Viabilidade</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ fontSize:20, color:'#fbbf24', fontWeight:700, marginBottom:24 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>
            <button onClick={() => window.location.reload()}
              style={{ background:'linear-gradient(90deg,#0ea5e9,#6366f1)', color:'white', border:'none', borderRadius:14, padding:'14px 40px', fontSize:16, fontWeight:700, cursor:'pointer' }}>
              🔄 Recomeçar
            </button>
          </div>
        </div>
      )}


      <div style={{ maxWidth:1380, margin:'0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ background:'linear-gradient(90deg,#0ea5e9,#6366f1,#8b5cf6)', borderRadius:22, padding:'20px 28px', marginBottom:16,
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12,
          boxShadow:'0 8px 32px rgba(99,102,241,0.3)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ background:'rgba(255,255,255,0.2)', padding:10, borderRadius:14 }}>
              <Microscope size={36} color="white" />
            </div>
            <div>
              <h1 style={{ color:'white', fontSize:21, fontWeight:900, margin:0 }}>Análise Microbiológica</h1>
              <p  style={{ color:'rgba(255,255,255,0.72)', fontSize:11, margin:0 }}>Contagem de Viabilidade Celular — Câmara de Neubauer</p>
            </div>
          </div>
          <div style={{ background:'#fbbf24', padding:'10px 22px', borderRadius:14, display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(251,191,36,0.4)' }}>
            <Award size={22} color="#78350f" />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:24, fontWeight:900, color:'#78350f' }}>{pontuacao}</div>
              <p    style={{ fontSize:9,  color:'#92400e', margin:0 }}>pontos</p>
            </div>
          </div>
        </div>


        {/* ── BANNER ETAPA ATUAL ── */}
        <div style={{ background:'linear-gradient(90deg,#059669,#0d9488)', borderRadius:18, padding:'16px 24px', marginBottom:12,
          border:'3px solid #34d399', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
          boxShadow:'0 4px 20px rgba(5,150,105,0.3)' }}>
          <div className="badge-etapa">{etapaAtual + 1}</div>
          <div style={{ flex:1 }}>
            <h2 style={{ color:'white', fontSize:18, fontWeight:900, margin:'0 0 4px' }}>{etapas[etapaAtual]?.titulo}</h2>
            <p  style={{ color:'rgba(255,255,255,0.82)', fontSize:13, margin:0 }}>{etapas[etapaAtual]?.descricao}</p>
          </div>
          <div style={{ textAlign:'right', color:'white' }}>
            <p style={{ fontSize:11, opacity:0.7, margin:0 }}>Progresso</p>
            <p style={{ fontSize:28, fontWeight:900, margin:0 }}>{etapaAtual}/{etapas.length}</p>
          </div>
        </div>


        {/* ── BARRA DE PROGRESSO ── */}
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, height:8, marginBottom:16, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${Math.round((etapaAtual / etapas.length) * 100)}%`,
            background:'linear-gradient(90deg,#00e5ff,#6366f1)', borderRadius:8, transition:'width 0.5s ease' }} />
        </div>


        {/* ── BANCADA DO LABORATÓRIO ── */}
        <div style={{ background:'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius:28, padding:'28px 24px',
          border:'8px solid #8b6e45', boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }}>
          <h2 style={{ textAlign:'center', color:'#4a3010', fontSize:18, fontWeight:900, marginBottom:24, letterSpacing:1 }}>
            🔬 Bancada do Laboratório de Microbiologia
          </h2>

          <div style={{ background:'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius:22, padding:'28px 24px',
            border:'4px solid #292524', minHeight:600, boxShadow:'inset 0 6px 28px rgba(0,0,0,0.4)', position:'relative' }}>

            {/* ══ LINHA SUPERIOR: Equipamentos grandes ══ */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:28, marginBottom:36, alignItems:'end' }}>

              {/* ── VÓRTEX ── */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
                onDrop={e => handleDrop('vortex', e)} onDragOver={handleDragOver}>
                <div className={`${dropCls('vortex')}`} style={{ position:'relative', background:'rgba(0,0,0,0.2)', borderRadius:14, padding:8 }}>
                  <VortexSVG ligado={vortexLigado} ang={vortexAng} />
                  {tuboNoVortex && (
                    <div style={{ position:'absolute', top:'-100px', left:'50%', transform:'translateX(-50%) scale(0.90)' }}>
                      {tipoTuboVortex === 'tubo'      && <TuboEnsaio      cor={corTubo}  nivel={nivelTubo}  animando={vortexLigado} vortexAng={vortexAng} />}
                      {tipoTuboVortex === 'tubovazio' && <TuboEnsaioVazio cor={corVazio} nivel={nivelVazio} animando={vortexLigado} vortexAng={vortexAng} />}
                      {tipoTuboVortex === 'tubofinal' && <TuboEnsaioFinal cor={corFinal} nivel={nivelFinal} animando={vortexLigado} vortexAng={vortexAng} />}
                    </div>
                  )}
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:'#e7e5e4' }}>Agitador Vórtex</span>
                {vortexLigado  && <span style={{ fontSize:9, color:'#34d399', fontWeight:700 }}>⚡ Agitando...</span>}
                {homogeneizado && <span style={{ fontSize:9, color:'#6ee7b7', fontWeight:700 }}>✓ Homogeneizado</span>}
              </div>

              {/* ── ESPÁTULA METÁLICA ── */}
              <div className={`item-drag ${itemCls('espatula')}`}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}
                draggable onDragStart={e => handleDragStart('espatula', e)} onDragEnd={handleDragEnd}>
                <EspatulaSVG espatulaComPo={espatulaComPo} />
                <span style={{ fontSize:10, fontWeight:700, color:'#e7e5e4' }}>Espátula</span>
              </div>

              {/* ── CÂMARA DE NEUBAUER ── */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
                onDrop={e => handleDrop('neubauer', e)} onDragOver={handleDragOver}>
                <div className={`item-drag ${itemCls('neubauer')} ${dropCls('neubauer')}`}
                  style={{ background:'rgba(0,0,0,0.2)', borderRadius:14, padding:10, position:'relative', display:'inline-block' }}
                  draggable={etapaAtual === 19}
                  onDragStart={e => handleDragStart('neubauer', e)} onDragEnd={handleDragEnd}>
                  <NeubauerSVG carregada={neuCarreg} comOleo={oilAplicado} />
                  {neuCarreg   && <div style={{ position:'absolute', top:6,    right:6, background:'#22c55e', borderRadius:99,