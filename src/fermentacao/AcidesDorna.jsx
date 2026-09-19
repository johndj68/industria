/**
 * AcidesDorna.jsx — Determinação de Acidez Sulfúrica — Cubas e Dornas
 *
 * 15 etapas:
 *  Fase 1 (0-5):  Vinho → Proveta → Kitassato + Peixinho → Agitador
 *                 → Mangueira → Vácuo 25" Hg 5 min (CO₂ removido)
 *  Fase 2 (6-9):  Kitassato → Proveta (50 mL) → Béquer 100 mL
 *                 + Peixinho → Béquer → Agitador
 *  Fase 3 (10-14): Eletrodo → Béquer · NaOH → Bureta · Posicionar
 *                  → Ligar Agitador → Titular até pH 8,7
 *
 * Titulante: NaOH 1 mol/L · Ponto final: pH 8,7 · g H₂SO₄/L
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import BequerSVG from '../components/lab/BequerSVG';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import BuretaSVG from '../components/lab/BuretaSVG';
import GotaCaindo from '../components/lab/GotaCaindo';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragAcidesDorna } from '../hooks/useSimuladorDragAcidesDorna';
import { etapas } from './data/etapasAcidesDorna';


/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes adDropFall {
    0%  { transform:translateX(-50%) translateY(0);  opacity:0; }
    6%  { opacity:1; }
    65% { transform:translateX(-50%) translateY(48px); opacity:.90;}
    100%{ transform:translateX(-50%) translateY(68px); opacity:0; }
  }
  @keyframes adDropFall2 {
    0%  { transform:translateX(-50%) translateY(0);  opacity:0; }
    6%  { opacity:.85;}
    65% { transform:translateX(-50%) translateY(44px); opacity:.75;}
    100%{ transform:translateX(-50%) translateY(62px); opacity:0; }
  }
  @keyframes adDropFall3 {
    0%  { transform:translateX(-50%) translateY(0);  opacity:0; }
    6%  { opacity:.70;}
    65% { transform:translateX(-50%) translateY(52px); opacity:.60;}
    100%{ transform:translateX(-50%) translateY(72px); opacity:0; }
  }
  @keyframes adVibrar {
    0%,100%{ transform:translateX(0) rotate(0deg); }
    12%{ transform:translateX(-5px) rotate(-2deg); }
    25%{ transform:translateX(5px)  rotate(2deg); }
    38%{ transform:translateX(-3px) rotate(-1.2deg);}
    52%{ transform:translateX(3px)  rotate(1.2deg); }
    65%{ transform:translateX(-2px) rotate(-.6deg); }
    78%{ transform:translateX(2px)  rotate(.6deg);  }
    90%{ transform:translateX(-1px) rotate(-.2deg); }
  }
  @keyframes adTimerPulse {
    0%,100%{ opacity:.62; }
    50%    { opacity:1.00;}
  }
  @keyframes adAgitarAnel {
    from{ transform:rotate(0deg);   }
    to  { transform:rotate(360deg); }
  }
  .ad-vibrar{ animation:adVibrar .55s ease-in-out; transform-origin:center bottom; }
`;

/* ── pH durante titulação ── */
const calcPhTitracao = (v, vEp) => {
  if (v <= 0 || vEp <= 0) return 3.50;
  const r = v / vEp;
  if (r >= 1.10) return parseFloat(Math.min(11.5, 8.7 + (r - 1.0) * 5).toFixed(2));
  if (r >= 0.97)  return parseFloat((5.8 + (r - 0.97) / 0.13 * 2.9).toFixed(2));
  if (r >= 0.70)  return parseFloat((4.2 + (r - 0.70) / 0.27 * 1.6).toFixed(2));
  return parseFloat((3.5 + r / 0.70 * 0.7).toFixed(2));
};

const calcAcidez = (v) => parseFloat((v * 49 / 50).toFixed(3));


/* ═══════════════════════════════════════════════════════════
   SVG — PEIXINHO QUÍMICO (barra magnética)
═══════════════════════════════════════════════════════════ */
const PeixinhoSVG = ({ usado = false }) => (
  <svg width="56" height="32" viewBox="0 0 56 32" opacity={usado ? 0.35 : 1}>
    <defs>
      <linearGradient id="pxGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#d4d4d8" />
        <stop offset="50%"  stopColor="#a1a1aa" />
        <stop offset="100%" stopColor="#71717a" />
      </linearGradient>
    </defs>
    <ellipse cx={28} cy={29} rx={22} ry={3.5} fill="rgba(0,0,0,0.14)" />
    <ellipse cx={28} cy={14} rx={24} ry={10}
      fill="url(#pxGrad)" stroke="#71717a" strokeWidth="1.2" />
    <ellipse cx={20} cy={10.5} rx={6} ry={3.5}
      fill="rgba(255,255,255,0.32)" transform="rotate(-15 20 10.5)" />
    {/* Faixas brancas das extremidades */}
    <ellipse cx={6}  cy={14} rx={4} ry={8} fill="rgba(240,240,245,0.85)" />
    <ellipse cx={50} cy={14} rx={4} ry={8} fill="rgba(240,240,245,0.85)" />
    <text x={28} y={18} textAnchor="middle" fontSize="7"
      fill="#3f3f46" fontFamily="sans-serif" fontWeight="700">peixinho</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — MANGUEIRA DA BOMBA DE VÁCUO (item arrastável)
═══════════════════════════════════════════════════════════ */
const MangueiraItemSVG = ({ conectada = false }) => (
  <svg width="58" height="52" viewBox="0 0 58 52">
    <ellipse cx={29} cy={50} rx={22} ry={3} fill="rgba(0,0,0,0.10)" />
    {/* Mangueira */}
    <path d="M 8,10 Q 16,4 29,8 Q 42,12 50,22 Q 54,30 50,42"
      fill="none" stroke={conectada ? '#22c55e' : '#94a3b8'}
      strokeWidth="5.5" strokeLinecap="round" />
    {/* Destaque interno */}
    <path d="M 8,10 Q 16,4 29,8 Q 42,12 50,22 Q 54,30 50,42"
      fill="none" stroke="rgba(255,255,255,0.18)"
      strokeWidth="2" strokeLinecap="round" />
    {/* Conectores */}
    <circle cx={8} cy={10} r={5} fill={conectada ? '#16a34a' : '#475569'} stroke="#334155" strokeWidth="1" />
    <circle cx={50} cy={42} r={5} fill={conectada ? '#16a34a' : '#475569'} stroke="#334155" strokeWidth="1" />
    <text x={29} y={49} textAnchor="middle" fontSize="5.5"
      fill="#64748b" fontFamily="sans-serif">mangueira</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — BOMBA DE VÁCUO
═══════════════════════════════════════════════════════════ */
const BombaVacuoSVG = ({ ativa = false, vacuo = 0, conectada = false }) => (
  <svg width="110" height={conectada ? 108 : 90} viewBox={`0 0 110 ${conectada ? 108 : 90}`}>
    <defs>
      <linearGradient id="bvBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <filter id="bvSh"><feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity=".28" /></filter>
    </defs>

    {/* Mangueira saindo do topo da bomba (visível quando conectada) */}
    {conectada && (
      <g>
        {/* Tubo de entrada de vácuo no topo */}
        <rect x={48} y={0} width={14} height={14} rx={3}
          fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
        <rect x={50} y={1} width={6} height={10} rx={2}
          fill="rgba(255,255,255,0.22)" />
        {/* Conector metálico */}
        <rect x={46} y={12} width={18} height={6} rx={2}
          fill="#1a2535" stroke="#22c55e" strokeWidth="0.8" />
        {/* Indicador de pressão negativa */}
        <circle cx={55} cy={9} r={4} fill="none" stroke="rgba(34,197,94,0.50)" strokeWidth="1.5">
          <animate attributeName="r" from="3" to="6" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8" to="0" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </g>
    )}

    <g transform={conectada ? 'translate(0,18)' : ''}>
      <ellipse cx={55} cy={87} rx={45} ry={4} fill="rgba(0,0,0,0.14)" />
      <g filter="url(#bvSh)">
        <rect x={4} y={12} width={102} height={72} rx={9}
          fill="url(#bvBody)" stroke="#111827" strokeWidth="1.5" />
      </g>
      <rect x={10} y={18} width={56} height={42} rx={5}
        fill="#001428" stroke="#1e3a5f" strokeWidth="0.8" />
      <text x={38} y={32} textAnchor="middle" fontSize="6"
        fill="#4a9fd4" fontFamily="monospace">VÁCUO (Hg)</text>
      <text x={38} y={50} textAnchor="middle" fontSize="22"
        fill={ativa ? '#fbbf24' : '#475569'} fontFamily="'Courier New', monospace" fontWeight="700">
        {ativa ? vacuo.toString().padStart(2,'0') : '--'}
      </text>
      <text x={38} y={60} textAnchor="middle" fontSize="6"
        fill={ativa ? '#d97706' : conectada ? '#22c55e' : '#334155'} fontFamily="monospace">
        {ativa ? '" Hg · ATIVO' : conectada ? 'mangueira ok' : '-- desligada'}
      </text>
      <circle cx={83} cy={40} r={14} fill="#1e293b" stroke="#334155" strokeWidth="1.2" />
      <circle cx={83} cy={40} r={9}
        fill={ativa ? '#dc2626' : '#374151'} stroke={ativa ? '#b91c1c' : '#4b5563'} strokeWidth="0.8" />
      {ativa && (
        <circle cx={83} cy={40} r={13} fill="none" stroke="rgba(220,38,38,0.40)" strokeWidth="2">
          <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      <text x={83} y={43.5} textAnchor="middle" fontSize="9" fill="white" fontFamily="monospace">⏻</text>
      <text x={55} y={82} textAnchor="middle" fontSize="5.5"
        fill="#4b5563" fontFamily="monospace">Bomba de Vácuo</text>
    </g>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — KITASSATO (design realista — frasco de filtração a vácuo)
   Pescoço estreito → ombro curvo → corpo esférico → fundo redondo
═══════════════════════════════════════════════════════════ */
const KitassatoSVG = ({ nivel = 0, cor = 'rgba(140,45,20,0.70)',
  peixinho = false, mangueira = false, degaseificado = false }) => {

  // Corpo realista: pescoço (14px) → ombro em S-curve → corpo esférico (68px) → fundo redondo
  // viewBox 92×126; pescoço center x=46
  const BODY = [
    'M 39,6',                          // topo-esquerdo do pescoço
    'L 39,22',                          // desce pescoço esq.
    'C 33,22 10,40 10,60',             // curva ombro esq. → corpo esq.
    'L 10,88',                          // desce lado esq. do corpo
    'Q 10,116 46,118',                  // fundo arredondado esq.
    'Q 82,116 82,88',                   // fundo arredondado dir.
    'L 82,60',                          // sobe lado dir. do corpo
    'C 82,40 59,22 53,22',             // curva ombro dir. → pescoço dir.
    'L 53,6',                           // sobe pescoço dir.
    'Z',
  ].join(' ');

  const liqH = Math.max(0, nivel / 100 * 84);

  return (
    <svg width="82" height="110" viewBox="0 0 92 126">
      <defs>
        <linearGradient id="ktB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,228,248,0.50)" />
          <stop offset="15%"  stopColor="rgba(220,242,255,0.20)" />
          <stop offset="50%"  stopColor="rgba(200,228,248,0.07)" />
          <stop offset="85%"  stopColor="rgba(220,242,255,0.16)" />
          <stop offset="100%" stopColor="rgba(200,228,248,0.40)" />
        </linearGradient>
        <radialGradient id="ktBall" cx="35%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="rgba(230,245,255,0.22)" />
          <stop offset="100%" stopColor="rgba(180,215,240,0.08)" />
        </radialGradient>
        <clipPath id="ktCp">
          <path d={BODY} />
        </clipPath>
        <filter id="ktF"><feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity=".22" /></filter>
      </defs>

      {/* Sombra projetada */}
      <ellipse cx={46} cy={124} rx={36} ry={4} fill="rgba(0,0,0,0.15)" />

      {/* Líquido (clipado ao corpo) */}
      <g clipPath="url(#ktCp)">
        <rect x={6} y={118 - liqH} width={80} height={liqH} fill={cor} opacity="0.86" />
        {nivel > 2 && nivel < 97 && (
          <ellipse cx={46} cy={118 - liqH} rx={35} ry={2}
            fill={cor} opacity="0.30" />
        )}
      </g>

      {/* Corpo de vidro */}
      <g filter="url(#ktF)">
        <path d={BODY} fill="url(#ktB)" stroke="#8fb8d8" strokeWidth="1.6" />
      </g>

      {/* Efeito esférico no corpo — realça arredondamento */}
      <path d={BODY} fill="url(#ktBall)" clipPath="url(#ktCp)" />

      {/* Brilho esquerdo (faixa de luz) */}
      <path d="M 12,28 C 11,44 10,62 10,70 L 14,70 C 14,62 15,44 16,28 Z"
        fill="rgba(255,255,255,0.30)" clipPath="url(#ktCp)" />
      {/* Brilho especular no ombro esquerdo */}
      <ellipse cx={18} cy={46} rx={4} ry={8}
        fill="rgba(255,255,255,0.18)" clipPath="url(#ktCp)"
        transform="rotate(-30 18 46)" />

      {/* Peixinho magnético no fundo */}
      {peixinho && nivel > 5 && (
        <g transform={`translate(18,${118 - Math.min(liqH, 16)})`}>
          <ellipse cx={28} cy={7} rx={20} ry={5}
            fill="rgba(155,155,163,0.82)" stroke="#888" strokeWidth="0.8" />
          <ellipse cx={28} cy={6.5} rx={13} ry={3}
            fill="rgba(208,208,213,0.62)" />
          <ellipse cx={20} cy={6} rx={5} ry={3}
            fill="rgba(235,235,238,0.50)" />
          <ellipse cx={36} cy={5.5} rx={4} ry={2.5}
            fill="rgba(235,235,238,0.40)" />
        </g>
      )}

      {/* Pescoço — tubo estreito de vidro */}
      <rect x={39} y={6} width={14} height={18} rx={3}
        fill="rgba(200,228,248,0.32)" stroke="#8fb8d8" strokeWidth="1.2" />
      <rect x={41} y={7} width={4} height={15} rx={2} fill="rgba(255,255,255,0.18)" />

      {/* Boca / rolha */}
      <rect x={37} y={0} width={18} height={8} rx={3}
        fill={mangueira ? '#166534' : 'rgba(90,70,50,0.86)'}
        stroke="#1a1a1a" strokeWidth="0.8" />
      <rect x={39} y={1} width={8} height={3} rx={1.5}
        fill={mangueira ? 'rgba(34,197,94,0.40)' : 'rgba(255,255,255,0.12)'} />

      {/* Tubo lateral de vácuo (braço do kitassato) */}
      {/* Entra no ombro direito ~(80,52) e sai para cima-direita */}
      <path d="M 80,55 Q 86,48 88,36"
        fill="none" stroke={mangueira ? '#22c55e' : '#8fb8d8'}
        strokeWidth="4" strokeLinecap="round" />
      {/* Parede interna do tubo (realismo) */}
      <path d="M 80,55 Q 86,48 88,36"
        fill="none" stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.6" strokeLinecap="round" />
      {/* Conector de vácuo */}
      <circle cx={88} cy={34} r={4.5}
        fill={mangueira ? '#22c55e' : '#5a7898'}
        stroke={mangueira ? '#16a34a' : '#4a6880'} strokeWidth="1" />
      {mangueira && (
        <circle cx={88} cy={34} r={7} fill="none" stroke="rgba(34,197,94,0.35)" strokeWidth="1.5">
          <animate attributeName="opacity" from="0.8" to="0" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Rótulo graduação */}
      <line x1={10} y1={80} x2={15} y2={80} stroke="rgba(14,50,140,0.55)" strokeWidth="0.8" />
      <line x1={10} y1={68} x2={14} y2={68} stroke="rgba(14,50,140,0.38)" strokeWidth="0.6" />
      <line x1={10} y1={92} x2={14} y2={92} stroke="rgba(14,50,140,0.38)" strokeWidth="0.6" />

      {/* Status CO₂ removido */}
      {degaseificado && (
        <text x={46} y={108} textAnchor="middle" fontSize="6.5"
          fill="rgba(34,197,94,0.92)" fontFamily="monospace" fontWeight="700">✓ CO₂ removido</text>
      )}
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — AGITADOR MAGNÉTICO
═══════════════════════════════════════════════════════════ */
const AgitadorSVG = ({ ativo = false }) => (
  <svg width="150" height="66" viewBox="0 0 150 66">
    <defs>
      <linearGradient id="agBd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>
    <ellipse cx={75} cy={64} rx={62} ry={4} fill="rgba(0,0,0,0.16)" />
    <g><rect x={4} y={8} width={142} height={52} rx={8} fill="url(#agBd)" stroke="#111827" strokeWidth="1.4" /></g>
    <rect x={7} y={8} width={136} height={26} rx={6}
      fill={ativo ? '#1e2d20' : '#1a2535'} stroke="#0d1620" strokeWidth="1" />
    {ativo && (
      <>
        {/* Rastro circular do campo magnético (órbita horizontal) */}
        <ellipse cx={75} cy={21} rx={18} ry={6} fill="none"
          stroke="rgba(34,197,94,0.20)" strokeWidth="1.2" />
        {/* Barra do stir bar girando horizontalmente — vista de cima */}
        <g>
          <rect x={75-14} y={18.5} width={28} height={5} rx={2.5}
            fill="rgba(34,197,94,0.82)" stroke="rgba(34,197,94,0.50)" strokeWidth="0.8">
            <animateTransform attributeName="transform" type="rotate"
              from="0 75 21" to="360 75 21" dur="0.75s" repeatCount="indefinite" />
          </rect>
          {/* Highlight da barra */}
          <rect x={75-13} y={19.2} width={14} height={2} rx={1}
            fill="rgba(255,255,255,0.35)">
            <animateTransform attributeName="transform" type="rotate"
              from="0 75 21" to="360 75 21" dur="0.75s" repeatCount="indefinite" />
          </rect>
        </g>
        {/* Ponto central do eixo */}
        <circle cx={75} cy={21} r={2.5} fill="rgba(34,197,94,0.70)" />
        {/* Indicador de velocidade (linhas de movimento) */}
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <line key={angle}
            x1={75 + Math.cos(angle * Math.PI / 180) * 10}
            y1={21 + Math.sin(angle * Math.PI / 180) * 3.8}
            x2={75 + Math.cos(angle * Math.PI / 180) * 16}
            y2={21 + Math.sin(angle * Math.PI / 180) * 6}
            stroke="rgba(34,197,94,0.30)" strokeWidth="0.8" strokeLinecap="round">
            <animate attributeName="opacity" from="0.8" to="0"
              dur="0.75s" begin={`${angle / 360 * 0.75}s`} repeatCount="indefinite" />
          </line>
        ))}
      </>
    )}
    {!ativo && (
      <>
        {/* Barra estática (parada) */}
        <rect x={75-12} y={18.5} width={24} height={5} rx={2.5}
          fill="rgba(71,85,105,0.55)" stroke="rgba(100,116,139,0.30)" strokeWidth="0.8" />
        <circle cx={75} cy={21} r={2} fill="rgba(100,116,139,0.35)" />
      </>
    )}
    <rect x={9} y={38} width={132} height={16} rx={4}
      fill="#0f172a" stroke="#334155" strokeWidth="0.7" />
    <circle cx={24} cy={46} r={5}
      fill={ativo ? '#22c55e' : '#374151'} stroke={ativo ? '#16a34a' : '#4b5563'} strokeWidth="0.7" />
    {ativo && (
      <circle cx={24} cy={46} r={8} fill="none" stroke="rgba(34,197,94,0.35)" strokeWidth="1.5">
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
      </circle>
    )}
    <text x={24} y={49} textAnchor="middle" fontSize="8" fill={ativo ? 'white' : '#64748b'} fontFamily="monospace">⏻</text>
    <text x={85} y={49} textAnchor="middle" fontSize="6.5"
      fill={ativo ? '#86efac' : '#475569'} fontFamily="monospace">
      {ativo ? '200 RPM · AGITANDO' : 'AGITADOR MAGNÉTICO'}
    </text>
    {[16,66,116].map(x => <rect key={x} x={x} y={59} width={7} height={4} rx={1.5} fill="#0a0f1a" />)}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — ELETRODO DE pH (item arrastável)
═══════════════════════════════════════════════════════════ */
const EletrodoSVG = ({ imerso = false }) => (
  <svg width="44" height="126" viewBox="0 0 44 126" opacity={imerso ? 0.18 : 1}>
    <defs>
      <linearGradient id="elC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1c1c1c" />
        <stop offset="40%" stopColor="#303030" />
        <stop offset="100%" stopColor="#1c1c1c" />
      </linearGradient>
    </defs>
    <ellipse cx={22} cy={124} rx={9} ry={3} fill="rgba(0,0,0,0.14)" />
    <rect x={19} y={0} width={6} height={26} rx={3} fill="#1a1a1a" />
    {[3,7,11,15,19,23].map(y => (
      <rect key={y} x={18} y={y} width={8} height={2} rx={1.2} fill="rgba(0,0,0,0.50)" />
    ))}
    <rect x={13} y={25} width={18} height={10} rx={3.5} fill="#3d3d3d" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx={19.5} cy={30} r={1.3} fill="#707070" />
    <circle cx={24.5} cy={30} r={1.3} fill="#707070" />
    <rect x={16} y={35} width={12} height={5} rx={2.5} fill="#c0392b" stroke="#8b1a0e" strokeWidth="0.7" />
    <rect x={16} y={40} width={12} height={62} rx={3}
      fill="url(#elC)" stroke="#0d0d0d" strokeWidth="0.8" />
    <rect x={17} y={47} width={11} height={32} rx={1.5} fill="#f0f0f0" stroke="#c8c8c8" strokeWidth="0.4" />
    <rect x={17} y={47} width={11} height={4} rx={1.5} fill="#c0392b" />
    <text x={22} y={50} textAnchor="middle" fontSize="3" fill="white" fontFamily="Arial" fontWeight="700">HACH</text>
    <text x={22} y={57} textAnchor="middle" fontSize="3.5" fill="#1a1a1a" fontFamily="Arial" fontWeight="700">PHC101</text>
    <text x={22} y={64} textAnchor="middle" fontSize="3" fill="#333" fontFamily="Arial">pH 0–14</text>
    <text x={22} y={71} textAnchor="middle" fontSize="5" fill="#c0392b" fontFamily="Arial" fontWeight="900">pH</text>
    <rect x={14} y={102} width={16} height={4} rx={2} fill="#2a2a2a" stroke="#0d0d0d" strokeWidth="0.8" />
    <rect x={20.5} y={106} width={3} height={6} rx={0.8} fill="rgba(190,220,255,0.55)" stroke="#8fb8d8" strokeWidth="0.6" />
    <circle cx={22} cy={117} r={6} fill="rgba(195,230,255,0.72)" stroke="#8fb8d8" strokeWidth="1.3" />
    <circle cx={22} cy={117} r={4} fill="rgba(155,210,240,0.38)" />
    <ellipse cx={22} cy={114} rx={3} ry={1.4} fill="rgba(200,230,250,0.52)" />
    <ellipse cx={19.5} cy={112.5} rx={1.6} ry={2.5}
      fill="rgba(255,255,255,0.28)" transform="rotate(-20 19.5 112.5)" />
    <text x={22} y={125} textAnchor="middle" fontSize="5" fill="#5a5a5a" fontFamily="sans-serif">Eletrodo pH</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — DISPLAY pH
═══════════════════════════════════════════════════════════ */
const PhDisplaySVG = ({ pHAtual, pontoFinal, eletrodoImergido, volumeGasto }) => (
  <svg width="148" height="108" viewBox="0 0 148 108">
    <defs>
      <linearGradient id="pdBd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e2d3d" />
        <stop offset="100%" stopColor="#0a1628" />
      </linearGradient>
      <linearGradient id="pdLc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a1200" />
        <stop offset="100%" stopColor="#050900" />
      </linearGradient>
    </defs>
    <rect x={3} y={3} width={142} height={102} rx={9}
      fill="url(#pdBd)" stroke="#0d1e30" strokeWidth="1.4" />
    <text x={74} y={17} textAnchor="middle" fontSize="6"
      fill="#4a9fd4" fontFamily="monospace" fontWeight="700">pHMETRO · TITULAÇÃO</text>
    <circle cx={132} cy={11} r={4}
      fill={pontoFinal ? '#22c55e' : eletrodoImergido ? '#3b82f6' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
    {pontoFinal && (
      <circle cx={132} cy={11} r={7} fill="none" stroke="rgba(34,197,94,0.38)" strokeWidth="1.4">
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
      </circle>
    )}
    <rect x={8} y={24} width={132} height={66} rx={5}
      fill="url(#pdLc)" stroke="#006622" strokeWidth="0.9" />
    <rect x={10} y={26} width={128} height={62} rx={4} fill="rgba(5,15,0,0.38)" />
    {pontoFinal ? (
      <>
        <text x={74} y={44} textAnchor="middle" fontSize="7.5" fill="#22c55e" fontFamily="monospace">PONTO FINAL ✓</text>
        <text x={74} y={67} textAnchor="middle" fontSize="30"
          fill="#00ff55" fontFamily="'Courier New', monospace" fontWeight="700">{pHAtual.toFixed(2)}</text>
        <text x={74} y={79} textAnchor="middle" fontSize="7" fill="#16a34a" fontFamily="monospace">pH 8,7 atingido</text>
      </>
    ) : eletrodoImergido ? (
      <>
        <text x={12} y={37} fontSize="6" fill="#3a5a2a" fontFamily="monospace">CH1 · pH  ATC ✓</text>
        <text x={74} y={67} textAnchor="middle" fontSize="30"
          fill={pHAtual >= 8.2 ? '#fbbf24' : '#aaff00'}
          fontFamily="'Courier New', monospace" fontWeight="700">{pHAtual.toFixed(2)}</text>
        <text x={136} y={67} textAnchor="end" fontSize="8" fill="#66aa00" fontFamily="monospace">pH</text>
        <text x={12} y={80} fontSize="6.5"
          fill={pHAtual >= 8.2 ? '#f59e0b' : '#448800'} fontFamily="monospace">
          {pHAtual >= 8.2 ? '→ PRÓXIMO DO PONTO FINAL!' : `V NaOH: ${volumeGasto.toFixed(1)} mL`}
        </text>
      </>
    ) : (
      <>
        <text x={74} y={50} textAnchor="middle" fontSize="8" fill="#2a4a1a" fontFamily="monospace">AGUARDANDO</text>
        <text x={74} y={66} textAnchor="middle" fontSize="14" fill="#1a3010" fontFamily="'Courier New', monospace">-- . --</text>
        <text x={74} y={79} textAnchor="middle" fontSize="6.5" fill="#162c10" fontFamily="sans-serif">Imergir eletrodo</text>
      </>
    )}
    <text x={74} y={100} textAnchor="middle" fontSize="5.5"
      fill="#1e3a10" fontFamily="sans-serif">Ponto final: pH 8,7</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const AcidesDorna = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'ad-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid; tag.textContent = ESTILOS_ANIMACAO;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(sid); if (el) el.remove(); };
  }, []);

  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado, mostrarParabens,
    concluido, mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  // ── Fontes ────────────────────────────────────────────
  const [nivelVinho,    setNivelVinho]    = useState(88);
  const [nivelNaohFrasco,setNivelNaohFrasco]= useState(82);

  // ── Proveta ───────────────────────────────────────────
  const [nivelProveta,  setNivelProveta]  = useState(0);
  const [provetaCheia,  setProvetaCheia]  = useState(false);
  const [provetaCom50,  setProvetaCom50]  = useState(false);

  // ── Kitassato ─────────────────────────────────────────
  const [nivelKitassato,  setNivelKitassato]  = useState(0);
  const [vinhoNoKitassato,setVinhoNoKitassato]= useState(false);
  const [peixinhoANoKit,  setPeixinhoANoKit]  = useState(false);
  const [kitassatoNoAgi,  setKitassatoNoAgi]  = useState(false);
  const [mangueiraConectada,setMangueiraConectada]=useState(false);

  // ── Vácuo ─────────────────────────────────────────────
  const [vacuoAtivo,        setVacuoAtivo]        = useState(false);
  const [progressoVacuo,    setProgressoVacuo]    = useState(0);
  const [amostraDegasificada,setAmostraDegasificada]=useState(false);

  // ── Béquer 100 mL ─────────────────────────────────────
  const [nivelBequer,    setNivelBequer]    = useState(0);
  const [corBequer,      setCorBequer]      = useState('rgba(220,235,255,0.08)');
  const [amostraNoBequer,setAmostraNoBequer]= useState(false);
  const [peixinhoBNoBeq, setPeixinhoBNoBeq] = useState(false);
  const [bequerNoAgi,    setBequerNoAgi]    = useState(false);

  // ── Eletrodo / agitador ───────────────────────────────
  const [eletrodoImergido, setEletrodoImergido] = useState(false);
  const [agitando,         setAgitando]         = useState(false);

  // ── Bureta NaOH ───────────────────────────────────────
  const [nivelBureta,      setNivelBureta]      = useState(0);
  const [buretaPreenchida, setBuretaPreenchida] = useState(false);
  const [buretaPosicionada,setBuretaPosicionada]= useState(false);
  const [endpointVolume,   setEndpointVolume]   = useState(0);

  // ── Titulação ─────────────────────────────────────────
  const [volumeGasto, setVolumeGasto] = useState(0);
  const [pHAtual,     setPHAtual]     = useState(3.50);
  const [gotejando,   setGotejando]   = useState(false);
  const [pontoFinal,  setPontoFinal]  = useState(false);
  const [hitKey,      setHitKey]      = useState(0);

  // ── TIMER: Vácuo 5 min simulado (step 5) ─────────────
  useEffect(() => {
    if (!vacuoAtivo) return;
    setProgressoVacuo(0);
    let p = 0;
    const tick = setInterval(() => { p = Math.min(p + 2, 100); setProgressoVacuo(p); }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setVacuoAtivo(false);
      setAmostraDegasificada(true);
      setProgressoVacuo(100);
      setKitassatoNoAgi(false);       // kitassato retorna à bancada
      setMangueiraConectada(false);   // mangueira desconectada ao fim do vácuo
      celebrarAcerto(100);
      proximaEtapa(); // → step 6
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [vacuoAtivo]);

  // ── TIMER: auto-conclusão (step final após pH 8.7) ───
  useEffect(() => {
    if (etapaAtual !== 13 || !pontoFinal) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2500);
    return () => clearTimeout(id);
  }, [pontoFinal, etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragAcidesDorna(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelVinho, setNivelNaoh: () => {},
    setNivelProveta, setProvetaCheia, setProvetaCom50,
    setNivelKitassato, setVinhoNoKitassato,
    setPeixinhoANoKit, setKitassatoNoAgi, setMangueiraConectada,
    setNivelBequer, setCorBequer, setAmostraNoBequer,
    setPeixinhoBNoBeq, setBequerNoAgi,
    setEletrodoImergido,
    setNivelBureta, setBuretaPreenchida, setEndpointVolume,
    setBuretaPosicionada,
    setNivelNaohFrasco,
  });

  // ── Click: Ligar Vácuo + Agitador (step 5) ───────────
  const handleIniciarVacuo = () => {
    if (etapaAtual !== 5 || !kitassatoNoAgi || !mangueiraConectada || vacuoAtivo) return;
    setVacuoAtivo(true);
  };

  // ── Click: Ligar Agitador para titulação (step 13) ───
  const handleLigarAgitador = () => {
    if (etapaAtual !== 12 || !buretaPosicionada) return;
    setAgitando(true);
    celebrarAcerto();
    proximaEtapa(); // → step 14
  };

  // ── Click: Bureta — gota a gota (step 14) ────────────
  const handleClicarBureta = () => {
    if (etapaAtual !== 13 || !buretaPreenchida || !eletrodoImergido || pontoFinal) return;
    const novoVol = parseFloat((volumeGasto + 0.5).toFixed(1));
    setVolumeGasto(novoVol);
    setNivelBureta(n => Math.max(n - 5, 0));
    setGotejando(true);
    setHitKey(k => k + 1);
    const novoPH = calcPhTitracao(novoVol, endpointVolume);
    setPHAtual(novoPH);
    setTimeout(() => setGotejando(false), 400);
    if (novoPH >= 8.70 && !pontoFinal) {
      setPHAtual(8.70); // forçar 8,70 exato no display ao atingir ponto final
      setPontoFinal(true);
    }
  };

  const acidezSulfurica = pontoFinal ? calcAcidez(volumeGasto) : null;

  // Sem fases — todos os itens visíveis durante toda a análise

  // Indicadores
  const kitDraggable  = isItem('kitassato') && (vinhoNoKitassato || amostraDegasificada);
  const bqDraggable   = isItem('bequer') && amostraNoBequer && peixinhoBNoBeq;
  // bureta não é mais arrastável (posicionamento automático ao carregar NaOH)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── OVERLAYS ── */}
      {mostrarParabens && (
        <div style={{ position: 'fixed', top: 18, right: 24, zIndex: 60, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)', color: 'white', padding: '20px 36px', borderRadius: 22, boxShadow: '0 16px 40px rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.9)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Star size={30} fill="currentColor" />
              <div><h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Muito bem!</h3><p style={{ fontSize: 15, margin: 0 }}>+100 pontos</p></div>
              <CheckCircle size={30} />
            </div>
          </div>
        </div>
      )}

      {mostrarErroEtapa && (
        <div style={{ position: 'fixed', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 70, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)', color: 'white', padding: '14px 26px', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center', minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div><h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Ação incorreta</h3><p style={{ fontSize: 12, margin: 0 }}>{mensagemErroEtapa}</p></div>
            </div>
          </div>
        </div>
      )}

      {vacuoAtivo && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#164e63,#0e7490,#0891b2)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, animation: 'adTimerPulse 1s ease-in-out infinite' }}>
              💨 Vácuo 25" Hg + Agitação (5 min) — Removendo CO₂
            </div>
            <div style={{ marginTop: 8, height: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', minWidth: 220 }}>
              <div style={{ height: '100%', width: `${progressoVacuo}%`, background: 'rgba(56,189,248,0.85)', borderRadius: 5, transition: 'width 0.1s linear' }} />
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.75)' }}>{Math.floor(progressoVacuo)}%</div>
          </div>
        </div>
      )}

      {pontoFinal && etapaAtual >= 13 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#14532d,#166534,#16a34a)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>✅ Ponto Final · pH {pHAtual.toFixed(2)}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              NaOH: <strong>{volumeGasto.toFixed(1)} mL</strong> · Acidez: <strong>{acidezSulfurica} g H₂SO₄/L</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUSÃO ── */}
      {concluido && pontoFinal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #b45309', borderRadius: 24, padding: '44px 52px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🍷</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 20px' }}>
              Acidez Sulfúrica — Cubas e Dornas · NaOH 1 mol/L · pH 8,7
            </p>
            <div style={{ background: 'rgba(180,83,9,0.08)', border: '1px solid rgba(180,83,9,0.28)', borderRadius: 14, padding: '14px 22px', marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 8 }}>Dados da Titulação</div>
              <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Método',       val: 'Potenciométrico',    cor: '#fbbf24' },
                  { label: 'Titulante',    val: 'NaOH 1 mol/L',       cor: '#60a5fa' },
                  { label: 'Vol. amostra', val: '50 mL',              cor: '#a78bfa' },
                  { label: 'Ponto final',  val: 'pH 8,7',             cor: '#4ade80' },
                  { label: 'pH final',     val: `${pHAtual.toFixed(2)}`, cor: '#22c55e' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(180,83,9,0.12)', border: '1px solid rgba(180,83,9,0.38)', borderRadius: 14, padding: '14px 24px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Resultados</div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>NaOH gasto</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace', lineHeight: 1 }}>{volumeGasto.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700 }}>mL</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Acidez Sulfúrica</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', lineHeight: 1 }}>{acidezSulfurica}</div>
                  <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700 }}>g H₂SO₄/L</div>
                </div>
              </div>
              <div style={{ marginTop: 8, background: 'rgba(245,158,11,0.08)', borderRadius: 8, padding: '5px 12px', fontSize: 8, color: '#d97706' }}>
                Cálculo: Acidez = V(NaOH) × 49 / 50 · V amostra = 50 mL · NaOH 1 mol/L
              </div>
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 18 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#b45309,#92400e)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              🔄 Recomeçar
            </button>
          </div>
        </div>
      )}


      {/* ════════════════════════════════════════════════
         BANCADA
      ════════════════════════════════════════════════ */}
      <LayoutSimulador
        etapaAtual={etapaAtual} etapas={etapas} pontuacao={pontuacao}
        titulo="Acidez Sulfúrica — Dornas"
        subtitulo={"NaOH 1 mol/L · Ponto final pH 8,7\nCubas e Dornas · g H₂SO₄/L"}
        icone="🍷" badges={['🍷 FERMENTAÇÃO', '⚗️ TITULAÇÃO']} footerLabel="🍷 Acidez Sulfúrica"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 900 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🍷 Bancada — Acidez Sulfúrica (Cubas e Dornas) · NaOH 1 mol/L · pH 8,7
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: EQUIPAMENTOS (sempre visíveis) ════════ */}
            <div style={{ paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* ── Linha 1: Proveta · Kitassato · Bomba Vácuo · Agitador ── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginBottom: 12 }}>

                {/* Proveta */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                      style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: '5px 3px' }}
                      draggable={isItem('proveta') && provetaCheia}
                      onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                      <ProvetaSVG nivel={nivelProveta} />
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta</span>
                    <span style={{ fontSize: 7.5, color: provetaCheia ? '#60a5fa' : '#94a3b8' }}>
                      {provetaCom50 ? '50 mL amostra' : provetaCheia ? '100 mL' : 'Vazia'}
                    </span>
                  </ZonaDrop>
                </div>

                {/* Kitassato */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id="kitassato" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div className={`${dropCls('kitassato')} ${itemCls('kitassato')}`}
                      style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '6px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: kitassatoNoAgi ? 0.18 : 1, transition: 'opacity 0.3s' }}
                      draggable={kitDraggable && !kitassatoNoAgi}
                      onDragStart={e => handleDragStart('kitassato', e)} onDragEnd={handleDragEnd}>
                      <KitassatoSVG nivel={nivelKitassato} peixinho={peixinhoANoKit}
                        mangueira={mangueiraConectada} degaseificado={amostraDegasificada}
                        cor={amostraDegasificada ? 'rgba(130,40,15,0.75)' : 'rgba(140,45,20,0.70)'} />
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                      {kitDraggable && !kitassatoNoAgi ? '🖱️ ' : ''}Kitassato
                    </span>
                    <span style={{ fontSize: 7.5, color: amostraDegasificada ? '#34d399' : kitassatoNoAgi ? '#f59e0b' : vinhoNoKitassato ? '#f87171' : '#94a3b8' }}>
                      {amostraDegasificada ? '✓ CO₂ removido'
                        : kitassatoNoAgi ? '🔺 No agitador'
                        : mangueiraConectada ? '🔗 Mangueira ok'
                        : peixinhoANoKit ? '+ peixinho ✓'
                        : vinhoNoKitassato ? '🍷 ~100 mL'
                        : 'Vazio'}
                    </span>
                  </ZonaDrop>
                </div>

                {/* BÉQUER 100 mL — posição Row 1 */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id="bequer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div className={`${dropCls('bequer')} ${itemCls('bequer')}`}
                      style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: (bequerNoAgi || buretaPosicionada) ? 0.18 : 1, transition: 'opacity 0.3s' }}
                      draggable={bqDraggable && !bequerNoAgi}
                      onDragStart={e => handleDragStart('bequer', e)} onDragEnd={handleDragEnd}>
                      <BequerSVG nivel={nivelBequer} cor={corBequer} id="pr" ml={150} />
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                      {bqDraggable && !bequerNoAgi ? '🖱️ ' : ''}Béquer 100 mL
                    </span>
                    <span style={{ fontSize: 7.5, color: bequerNoAgi ? '#f59e0b' : peixinhoBNoBeq ? '#86efac' : amostraNoBequer ? '#f87171' : '#94a3b8' }}>
                      {bequerNoAgi ? '⚙ No agitador'
                        : peixinhoBNoBeq ? '🍷 + peixinho ✓'
                        : amostraNoBequer ? '🍷 50 mL'
                        : 'Vazio'}
                    </span>
                  </ZonaDrop>
                </div>

              </div>{/* fim linha 1 */}

              {/* ── Linha 2: Bureta+Plataforma · Hose (quando conectada) · Bomba · Eletrodo+pH ── */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>

                {/* BURETA + AREA_TITULACAO (padrão Alcalinidade) */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <ZonaDrop id="bureta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={`item-drag ${dropCls('bureta')} ${itemCls('bureta')}`}
                      style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.22))', borderRadius: 12, padding: '8px 14px 4px', border: '1px solid rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                      draggable={false}>
                      <span style={{ fontSize: 8.5, fontWeight: 700, color: nivelBureta > 0 ? '#f59e0b' : '#78716c', marginBottom: 2 }}>
                        {nivelBureta > 0 ? 'Bureta · NaOH 1 mol/L' : 'Bureta — vazia'}
                      </span>
                      <BuretaSVG nivel={nivelBureta} gotejando={gotejando}
                        ativo={etapaAtual === 13 && buretaPosicionada && !pontoFinal}
                        onClick={handleClicarBureta} />
                      {etapaAtual === 13 && buretaPosicionada && !pontoFinal && (
                        <div style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>↑ Clique na torneira</div>
                      )}
                      {etapaAtual === 11 && (
                        <div style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700, marginTop: 2 }}>↑ Arraste NaOH aqui</div>
                      )}
                    </div>
                  </ZonaDrop>

                  {/* Gotas caindo */}
                  <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                    {gotejando && (
                      <>
                        <GotaCaindo key={`d1-${hitKey}`} offsetX={-4} animName="adDropFall"  delay={0}   animKey={`d1-${hitKey}`} />
                        <GotaCaindo key={`d2-${hitKey}`} offsetX={0}  animName="adDropFall2" delay={110} animKey={`d2-${hitKey}`} />
                        <GotaCaindo key={`d3-${hitKey}`} offsetX={4}  animName="adDropFall3" delay={220} animKey={`d3-${hitKey}`} />
                      </>
                    )}
                  </div>

                  {/* Área de titulação */}
                  <ZonaDrop id="area_titulacao" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <div className={dropCls('area_titulacao')} style={{ minWidth: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '6px 10px', border: (kitassatoNoAgi || bequerNoAgi || buretaPosicionada) ? '1px solid rgba(245,158,11,0.30)' : '2px dashed rgba(255,255,255,0.15)' }}>

                      {/* Kitassato no agitador (steps 3-5) */}
                      {kitassatoNoAgi && !bequerNoAgi && (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <KitassatoSVG nivel={nivelKitassato} peixinho={peixinhoANoKit}
                            mangueira={mangueiraConectada} degaseificado={amostraDegasificada}
                            cor={amostraDegasificada ? 'rgba(130,40,15,0.75)' : 'rgba(140,45,20,0.70)'} />
                          {/* Vórtice no kitassato — stroke-dashoffset orbita horizontalmente */}
                          {vacuoAtivo && nivelKitassato > 5 && (
                            <svg width="82" height="110" viewBox="0 0 92 126"
                              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                              {/* 3 elipses planas com traço orbitando — parecem girar no plano horizontal */}
                              {/* Anel externo: perím≈88 → dasharray 22,66 */}
                              <ellipse cx="46" cy="60" rx="26" ry="5"
                                fill="none" stroke="rgba(200,90,30,0.45)" strokeWidth="2"
                                strokeDasharray="22,66" strokeLinecap="round">
                                <animate attributeName="stroke-dashoffset"
                                  from="0" to="-88" dur="1.3s" repeatCount="indefinite" />
                              </ellipse>
                              {/* Anel médio: perím≈56 → dasharray 14,42 */}
                              <ellipse cx="46" cy="62.5" rx="15" ry="3"
                                fill="none" stroke="rgba(200,90,30,0.35)" strokeWidth="1.5"
                                strokeDasharray="14,42" strokeLinecap="round">
                                <animate attributeName="stroke-dashoffset"
                                  from="0" to="56" dur="0.95s" repeatCount="indefinite" />
                              </ellipse>
                              {/* Anel interno: perím≈28 → dasharray 8,20 */}
                              <ellipse cx="46" cy="64.5" rx="7" ry="1.6"
                                fill="none" stroke="rgba(200,90,30,0.48)" strokeWidth="1.2"
                                strokeDasharray="8,20" strokeLinecap="round">
                                <animate attributeName="stroke-dashoffset"
                                  from="0" to="-28" dur="0.65s" repeatCount="indefinite" />
                              </ellipse>
                              {/* Centro do vórtice */}
                              <circle cx="46" cy="65" r="1.8" fill="rgba(150,50,15,0.35)" />
                            </svg>
                          )}
                        </div>
                      )}

                      {/* Béquer no agitador (steps 9-14) */}
                      {bequerNoAgi && (
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: -28, zIndex: 1 }}>
                          <BequerSVG nivel={nivelBequer} cor={corBequer} id="tit" ml={150} key={`bq-${hitKey}`} />
                          {/* Vórtice/redemoinho no béquer — stroke-dashoffset horizontal */}
                          {agitando && nivelBequer > 5 && (
                            <svg width="78" height="106" viewBox="0 0 78 106"
                              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                              {/* nivel≈55 → liqSurface y≈34; anel externo perím≈82 → dasharray 20,62 */}
                              <ellipse cx="39" cy="35" rx="18" ry="4"
                                fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2"
                                strokeDasharray="20,62" strokeLinecap="round">
                                <animate attributeName="stroke-dashoffset"
                                  from="0" to="-82" dur="1.2s" repeatCount="indefinite" />
                              </ellipse>
                              {/* Anel médio perím≈52 → dasharray 13,39 */}
                              <ellipse cx="39" cy="37.5" rx="11" ry="2.5"
                                fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4"
                                strokeDasharray="13,39" strokeLinecap="round">
                                <animate attributeName="stroke-dashoffset"
                                  from="0" to="52" dur="0.88s" repeatCount="indefinite" />
                              </ellipse>
                              {/* Anel interno perím≈24 → dasharray 7,17 */}
                              <ellipse cx="39" cy="39.5" rx="5.5" ry="1.3"
                                fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1"
                                strokeDasharray="7,17" strokeLinecap="round">
                                <animate attributeName="stroke-dashoffset"
                                  from="0" to="-24" dur="0.60s" repeatCount="indefinite" />
                              </ellipse>
                              {/* Centro do vórtice — depressão escura */}
                              <ellipse cx="39" cy="40.5" rx="2.5" ry="0.8"
                                fill="rgba(0,0,0,0.25)" />
                            </svg>
                          )}
                          {eletrodoImergido && (
                            <svg width="78" height="106" viewBox="0 0 78 106"
                              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                              <line x1="39" y1="0" x2="39" y2="18" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                              <rect x="33" y="18" width="12" height="5" rx="2" fill="#475569" stroke="#334155" strokeWidth="0.8" />
                              <rect x="35" y="23" width="8" height="3.5" rx="1.5" fill="#c0392b" />
                              <rect x="37" y="26.5" width="4" height="24" rx="1.5" fill="rgba(45,75,105,0.88)" stroke="#334155" strokeWidth="0.8" />
                              <circle cx="39" cy="62" r="6" fill="rgba(195,230,255,0.70)" stroke="#8fb8d8" strokeWidth="1.3" />
                              <circle cx="39" cy="62" r="4" fill="rgba(155,210,240,0.38)" />
                              <ellipse cx="39" cy="59" rx="3" ry="1.4" fill="rgba(200,230,250,0.52)" />
                            </svg>
                          )}
                        </div>
                      )}
                      {bequerNoAgi && volumeGasto > 0 && (
                        <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '3px 8px', fontSize: 8, color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700, marginBottom: 2 }}>
                          {volumeGasto.toFixed(1)} mL NaOH
                        </div>
                      )}

                      {/* AgitadorSVG — sempre visível na plataforma */}
                      <AgitadorSVG ativo={agitando || vacuoAtivo} />

                      {/* Hint quando vazia */}
                      {!kitassatoNoAgi && !bequerNoAgi && !buretaPosicionada && (
                        <div style={{ fontSize: 7.5, color: '#64748b', textAlign: 'center', marginTop: 3, lineHeight: 1.4 }}>
                          Agitador magnético<br />↑ arraste itens aqui
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#a8a29e' }}>
                      {agitando ? '⚙ Titulando'
                        : buretaPosicionada ? 'Pronto p/ titular'
                        : bequerNoAgi ? '⚙ Béquer no agitador'
                        : kitassatoNoAgi ? '⚙ Kitassato no agitador'
                        : 'Plataforma · Agitador'}
                    </span>
                  </ZonaDrop>

                  {/* Painel titulação (step 13) */}
                  {etapaAtual === 13 && buretaPosicionada && eletrodoImergido && (
                    <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.30)', borderRadius: 12, padding: '8px 12px', border: `1px solid ${pontoFinal ? 'rgba(34,197,94,0.40)' : 'rgba(245,158,11,0.30)'}`, textAlign: 'center', minWidth: 120 }}>
                      <div style={{ fontSize: 8, color: '#64748b', marginBottom: 3 }}>Vol. NaOH adicionado</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{volumeGasto.toFixed(1)} mL</div>
                      {!pontoFinal && (
                        <>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', margin: '4px 0 3px' }}>
                            <div style={{ height: '100%', width: `${Math.min((pHAtual - 3.5) / 5.2 * 100, 100)}%`, background: `linear-gradient(90deg,#f59e0b,${pHAtual > 7 ? '#ef4444' : '#d97706'})`, borderRadius: 2, transition: 'width 0.2s' }} />
                          </div>
                          {pHAtual > 7.5 && <div style={{ fontSize: 7.5, color: '#ef4444', fontWeight: 700 }}>⚠️ Próximo ao ponto!</div>}
                          <button onClick={handleClicarBureta}
                            style={{ marginTop: 6, background: 'linear-gradient(90deg,#b45309,#d97706)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                            + 0,5 mL NaOH
                          </button>
                        </>
                      )}
                      {pontoFinal && acidezSulfurica && (
                        <div style={{ marginTop: 5, fontSize: 10, color: '#22c55e', fontWeight: 700 }}>
                          {acidezSulfurica} g H₂SO₄/L
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* BOMBA DE VÁCUO */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <BombaVacuoSVG ativa={vacuoAtivo} vacuo={vacuoAtivo ? 25 : 0} conectada={mangueiraConectada} />
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: vacuoAtivo ? '#38bdf8' : '#a8a29e' }}>
                      {vacuoAtivo ? '💨 Ativa' : 'Bomba de Vácuo'}
                    </span>
                  </div>
                </div>

                {/* ELETRODO + pH DISPLAY */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'center' }}>
                  {/* Display pH */}
                  <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                    <PhDisplaySVG pHAtual={pHAtual} pontoFinal={pontoFinal}
                      eletrodoImergido={eletrodoImergido} volumeGasto={volumeGasto} />
                  </div>
                  {/* Eletrodo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div className={`item-drag ${itemCls('eletrodo')}`}
                      draggable={isItem('eletrodo') && !eletrodoImergido}
                      onDragStart={e => handleDragStart('eletrodo', e)} onDragEnd={handleDragEnd}
                      style={{ cursor: isItem('eletrodo') && !eletrodoImergido ? 'grab' : 'default' }}>
                      <EletrodoSVG imerso={eletrodoImergido} />
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: eletrodoImergido ? '#fbbf24' : '#e7e5e4' }}>
                      {isItem('eletrodo') && !eletrodoImergido ? '🖱️ ' : ''}Eletrodo pH
                    </span>
                    <span style={{ fontSize: 7.5, color: eletrodoImergido ? '#fbbf24' : '#94a3b8' }}>
                      {eletrodoImergido ? '⚗️ Imerso' : 'PHC101'}
                    </span>
                  </div>
                </div>

              </div>{/* fim linha 2 */}

            </div>{/* fim zona superior */}

            {/* ══ PAINEL DE AÇÃO (vácuo, agitador) ════════════════════ */}
            {((etapaAtual === 5 && kitassatoNoAgi && mangueiraConectada && !vacuoAtivo && !amostraDegasificada) ||
              vacuoAtivo ||
              (etapaAtual === 12 && buretaPosicionada)) && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '12px 18px', border: `1px solid ${vacuoAtivo ? 'rgba(56,189,248,0.38)' : 'rgba(34,211,238,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                {vacuoAtivo ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, animation: 'adTimerPulse 1s ease-in-out infinite' }}>💨 Vácuo 25" Hg + Agitação (5 min)...</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Eliminando CO₂ dissolvido no vinho.</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressoVacuo}%`, background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', borderRadius: 4, transition: 'width 0.1s linear' }} />
                      </div>
                      <div style={{ fontSize: 8, color: '#0ea5e9', marginTop: 3 }}>{Math.floor(progressoVacuo)}%</div>
                    </div>
                  </>
                ) : etapaAtual === 5 ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>💨 Ligar Vácuo 25" Hg e Agitador (5 min)</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Agitar sob vácuo para eliminar CO₂ antes da titulação.</div>
                    </div>
                    <button onClick={handleIniciarVacuo}
                      style={{ background: 'linear-gradient(90deg,#0891b2,#0ea5e9)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.35)', whiteSpace: 'nowrap' }}>
                      💨 Ligar Vácuo
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>⚙ Ligar o Agitador Magnético para a Titulação</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Iniciar agitação para homogeneizar durante a adição de NaOH.</div>
                    </div>
                    <button onClick={handleLigarAgitador}
                      style={{ background: 'linear-gradient(90deg,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.35)', whiteSpace: 'nowrap' }}>
                      ⚙ Ligar Agitador
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ══ ZONA INFERIOR: REAGENTES (sempre visíveis) ════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {/* VINHO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <ItemBancada id="vinho" className={itemCls('vinho')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(120,18,8,0.88)" label="Vinho" sub="Amostra" nivel={nivelVinho} />
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Frasco de Vinho</span>
                </ItemBancada>
              </div>

              {/* PEIXINHO A */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('peixinho_a')}`}
                  draggable={isItem('peixinho_a')} onDragStart={e => handleDragStart('peixinho_a', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <PeixinhoSVG usado={peixinhoANoKit} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('peixinho_a') ? '🖱️ ' : ''}Peixinho A</span>
                {peixinhoANoKit && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓ Kitassato</span>}
              </div>

              {/* MANGUEIRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('mangueira')}`}
                  draggable={isItem('mangueira')} onDragStart={e => handleDragStart('mangueira', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <MangueiraItemSVG conectada={mangueiraConectada} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('mangueira') ? '🖱️ ' : ''}Mangueira Vácuo</span>
                {mangueiraConectada && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓ Conectada</span>}
              </div>

              {/* PEIXINHO B */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('peixinho_b')}`}
                  draggable={isItem('peixinho_b')} onDragStart={e => handleDragStart('peixinho_b', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <PeixinhoSVG usado={peixinhoBNoBeq} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('peixinho_b') ? '🖱️ ' : ''}Peixinho B</span>
                {peixinhoBNoBeq && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓ Béquer</span>}
              </div>

              {/* NAOH */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('naoh')}`}
                  draggable={isItem('naoh')} onDragStart={e => handleDragStart('naoh', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(60,90,200,0.85)" label="NaOH" sub="1 mol/L" nivel={nivelNaohFrasco} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('naoh') ? '🖱️ ' : ''}NaOH 1 mol/L</span>
                {buretaPreenchida && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓ Na bureta</span>}
              </div>

            </div>

          </div>
        </div>

        {/* ── RODAPÉ — DICA ── */}
        <div style={{ marginTop: 14, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.30)', borderRadius: 14, padding: '12px 20px', textAlign: 'center' }}>
          <p style={{ color: '#7dd3fc', fontWeight: 600, fontSize: 13, margin: 0 }}>
            💡 Arraste os itens piscando para os locais destacados em Azul!
          </p>
        </div>
      </LayoutSimulador>
    </div>
  );
};

export default AcidesDorna;
