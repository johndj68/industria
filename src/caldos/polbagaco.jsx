/**
 * polbagaco.jsx — Determinação de Pol no Bagaço Residual
 *
 * Método extração aquosa + sacarimetria direta (Ventzke).
 * Norma CONSECANA · 100 g / 1000 mL H₂O · Digestor 15 min · 80 °C.
 *
 * Fluxo: Coletor → Balança (100 g) → Copo Digestor → Água (1 L)
 *        → Digestor (15 min) → Peneira (400 mL) → Béquer 200 mL
 *        → Clarificante → Funil Papel → Sacarímetro → %Pol
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import BequerSVG from '../components/lab/BequerSVG';
import EspatulaSVG from '../components/lab/EspatulaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { etapas } from './data/etapasPolBagaco';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const PBR_CSS = `
  @keyframes pbrPulseRed {
    0%,100% { opacity: 0.7; }
    50%     { opacity: 1; }
  }
  @keyframes pbrAquecer {
    0%,100% { opacity: 0.55; }
    50%     { opacity: 1; }
  }
  @keyframes pbrAgitar {
    0%,100% { transform: rotate(0deg) translateX(0); }
    15%     { transform: rotate(-5deg) translateX(-4px); }
    30%     { transform: rotate(5deg)  translateX(4px); }
    45%     { transform: rotate(-3deg) translateX(-2px); }
    60%     { transform: rotate(3deg)  translateX(2px); }
    75%     { transform: rotate(-1.5deg) translateX(-1px); }
    88%     { transform: rotate(1.5deg) translateX(1px); }
  }
  @keyframes pbrBlade {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .pbr-agitar { animation: pbrAgitar 0.5s ease-in-out infinite; transform-origin: center bottom; }
`;


/* ═══════════════════════════════════════════════════════════
   SVG — BALANÇA ANALÍTICA
═══════════════════════════════════════════════════════════ */
const BalancaPBRSVG = ({ pesando, peso, coletorPositionado, bagacoPesado }) => (
  <svg width="148" height="138" viewBox="0 -28 148 138">
    <defs>
      <linearGradient id="pbrBalBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#5a5e6a" />
        <stop offset="100%" stopColor="#3a3d46" />
      </linearGradient>
    </defs>
    <ellipse cx={74} cy={100} rx={60} ry={5} fill="rgba(0,0,0,0.18)" />
    <ellipse cx={74} cy={28} rx={52} ry={8} fill="rgba(200,200,210,0.85)" stroke="#9ca3af" strokeWidth="1.5" />
    <ellipse cx={74} cy={27} rx={50} ry={6} fill="rgba(220,220,230,0.92)" stroke="#9ca3af" strokeWidth="0.8" />
    <rect x={65} y={30} width={18} height={14} rx="2" fill="url(#pbrBalBody)" stroke="#374151" strokeWidth="1.2" />
    <rect x={10} y={42} width={128} height={44} rx="6" fill="url(#pbrBalBody)" stroke="#374151" strokeWidth="1.5" />
    <rect x={16} y={47} width={80} height={32} rx="4" fill="#0a1018" stroke="#22d3ee" strokeWidth="1.0" />
    <text x={56} y={60} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="monospace">
      {pesando ? 'PESANDO...' : bagacoPesado ? '✓ PESAGEM OK' : (coletorPositionado && !bagacoPesado) ? 'COLETOR ✓' : 'STANDBY'}
    </text>
    <text x={56} y={75} textAnchor="middle" fontSize="14"
      fill={pesando ? '#00ff88' : bagacoPesado ? '#22c55e' : (coletorPositionado && !bagacoPesado) ? '#22d3ee' : '#3a5a6a'}
      fontFamily="monospace" fontWeight="700">
      {pesando ? `${peso.toFixed(1)} g` : bagacoPesado ? '100,0 g' : (coletorPositionado && !bagacoPesado) ? '0,0 g' : '—'}
    </text>
    <circle cx={112} cy={63} r={5} fill={bagacoPesado ? '#22c55e' : pesando ? '#f59e0b' : coletorPositionado ? '#22c55e' : '#334155'} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <text x={74} y={98} textAnchor="middle" fontSize="6" fill="#4a3e28" fontFamily="monospace">Balança Analítica · 0,001 g</text>

    {/* ── Coletor (béquer 400 mL) sobre a bandeja ── */}
    {coletorPositionado && !bagacoPesado && (
      <g>
        {/* Bico */}
        <path d="M 62,-16 L 59,-24" fill="none" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round" />
        {/* Aba superior */}
        <rect x={60} y={-22} width={30} height={4} rx="2" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="0.9" />
        {/* Corpo */}
        <rect x={62} y={-18} width={26} height={39} rx="2.5"
          fill={bagacoPesado ? 'rgba(195,155,80,0.42)' : 'rgba(210,235,255,0.32)'}
          stroke="#93c5fd" strokeWidth="1.3" />
        {/* Bagaço — fibras crescem conforme pesagem */}
        {(pesando || bagacoPesado) && (() => {
          const frac = bagacoPesado ? 1 : peso / 100;
          const h    = Math.round(11 * frac);
          const top  = 19 - h;
          return (
            <g clipPath="url(#pbrBalClip)">
              <defs>
                <clipPath id="pbrBalClip">
                  <rect x={62} y={top} width={26} height={h} />
                </clipPath>
              </defs>
              <rect x={62} y={top} width={26} height={h} rx="1" fill="rgba(120,80,25,0.55)" />
              {[top+2, top+5, top+8].filter(y => y < 20).map((y,i) => (
                <line key={i} x1={63} y1={y} x2={63+24*(0.6+i*0.2)} y2={y+1}
                  stroke={i%2===0 ? '#d4a030' : '#c08828'} strokeWidth="1.4" strokeLinecap="round" />
              ))}
            </g>
          );
        })()}
        {/* Reflexo metálico */}
        <line x1={65} y1={-16} x2={65} y2={19} stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Borda inferior do béquer (assenta na bandeja) */}
        <rect x={62} y={18} width={26} height={3} rx="1.5" fill="rgba(148,197,250,0.50)" stroke="#60a5fa" strokeWidth="0.7" />
      </g>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — DIGESTOR DE BAGAÇO TE-0502 (TECNAL)
   Referência: W=300 × D=500 × H=760 mm · 90 kg
   Motor no topo · correia lateral · copo inox 304 acoplado abaixo
═══════════════════════════════════════════════════════════ */
const DigestorPBRSVG = ({ copoAcoplado, ligado, minutos, pronto }) => (
  <svg width="170" height="295" viewBox="0 0 170 295">
    <defs>
      {/* Pintura eletrostática — tom bege/creme industrial */}
      <linearGradient id="pbrDigPaint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#eae5d8" />
        <stop offset="45%"  stopColor="#d6d0be" />
        <stop offset="100%" stopColor="#c4bca8" />
      </linearGradient>
      {/* Aço inox escovado */}
      <linearGradient id="pbrDigSteel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#8d96a0" />
        <stop offset="24%"  stopColor="#dde1e5" />
        <stop offset="55%"  stopColor="#f4f6f8" />
        <stop offset="80%"  stopColor="#c8cdd3" />
        <stop offset="100%" stopColor="#8d96a0" />
      </linearGradient>
      {/* Tampa / cobertura da correia */}
      <linearGradient id="pbrBeltCov" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#2d3540" />
        <stop offset="50%"  stopColor="#404d5c" />
        <stop offset="100%" stopColor="#2d3540" />
      </linearGradient>
      <clipPath id="pbrCupLiqC">
        <path d="M 32,140 L 138,140 L 124,262 L 46,262 Z" />
      </clipPath>
    </defs>

    {/* ── SOMBRA ── */}
    <ellipse cx={85} cy={291} rx={68} ry={4} fill="rgba(0,0,0,0.20)" />

    {/* ─────────────────────────────────
        CORPO DO MOTOR (topo)
        Aço carbono com tinta eletrostática
    ───────────────────────────────── */}
    {/* Profundidade lateral direita */}
    <rect x={30} y={15} width={114} height={100} rx="9" fill="#ada89a" />
    {/* Face principal */}
    <rect x={26} y={11} width={114} height={100} rx="9"
      fill="url(#pbrDigPaint)" stroke="#9a9284" strokeWidth="1.5" />
    {/* Bevel superior (reflexo de topo) */}
    <rect x={28} y={11} width={110} height={6} rx="4"
      fill="rgba(255,255,255,0.40)" />
    {/* Sombra lateral direita da face */}
    <rect x={136} y={13} width={4} height={96} rx="2"
      fill="rgba(0,0,0,0.10)" />

    {/* ─────────────────────────────────
        COBERTURA DA CORREIA (esquerda)
        Proteção mecânica do sistema de transmissão
    ───────────────────────────────── */}
    <rect x={8} y={28} width={24} height={68} rx="8"
      fill="url(#pbrBeltCov)" stroke="#22262e" strokeWidth="1.3" />
    {/* Fendas de ventilação */}
    {[35,41,47,53,59,65,71,77,83,89].map(y => (
      <line key={y} x1={10} y1={y} x2={30} y2={y}
        stroke="rgba(0,0,0,0.32)" strokeWidth="1.0" />
    ))}
    {/* Tampas da cobertura */}
    <rect x={8} y={28} width={24} height={8} rx="4" fill="#383f4a" />
    <rect x={8} y={88} width={24} height={8} rx="4" fill="#383f4a" />
    {/* Parafusos da cobertura */}
    {[32, 92].map(y => (
      <circle key={y} cx={20} cy={y} r={2.5} fill="#22262e" stroke="#555f6e" strokeWidth="0.7" />
    ))}

    {/* ─────────────────────────────────
        PAINEL FRONTAL
    ───────────────────────────────── */}
    <rect x={33} y={17} width={101} height={88} rx="7"
      fill="rgba(0,0,0,0.09)" stroke="rgba(0,0,0,0.16)" strokeWidth="0.8" />

    {/* DISPLAY DIGITAL (MM:SS) */}
    <rect x={37} y={21} width={80} height={38} rx="5"
      fill="#05100e" stroke="#22d3ee" strokeWidth="1.3" />
    <rect x={38} y={22} width={78} height={36} rx="4"
      fill="rgba(34,211,238,0.035)" />
    {/* Header status */}
    <text x={77} y={33} textAnchor="middle" fontSize="5.5" fill="#3d6e72"
      fontFamily="monospace" letterSpacing="0.8">
      {pronto ? 'EXTRAÇÃO OK  ✓' : ligado ? 'EXTRAINDO · 80°C' : copoAcoplado ? 'PRONTO P/ LIGAR' : '■ TE-0502 ■'}
    </text>
    {/* Tempo MM:SS */}
    <text x={77} y={51} textAnchor="middle" fontSize="18"
      fill={pronto ? '#22c55e' : ligado ? '#f59e0b' : '#1a4044'}
      fontFamily="monospace" fontWeight="900" letterSpacing="3">
      {ligado || pronto ? `${String(minutos).padStart(2,'0')}:00` : '--:--'}
    </text>

    {/* LINHA DE CONTROLES */}
    {/* Botão POWER */}
    <circle cx={44} cy={76} r={9} fill={ligado ? '#14532d' : '#1a2820'} stroke="#0d1117" strokeWidth="1.3" />
    <circle cx={44} cy={76} r={6.5} fill={ligado ? '#22c55e' : '#166534'} />
    <circle cx={44} cy={76} r={3}   fill={ligado ? '#bbf7d0' : '#4ade80'} />
    <text x={44} y={90} textAnchor="middle" fontSize="4" fill="#6b7280" fontFamily="monospace">POWER</text>

    {/* LED TIMER */}
    <circle cx={66} cy={76} r={7} fill={pronto ? '#14532d' : ligado ? '#78350f' : '#1f2937'}
      stroke="#0d1117" strokeWidth="1"
      style={ligado && !pronto ? { animation: 'pbrPulseRed 0.9s ease-in-out infinite' } : {}} />
    <circle cx={66} cy={76} r={4.5}
      fill={pronto ? '#22c55e' : ligado ? '#f59e0b' : '#374151'} />
    <text x={66} y={90} textAnchor="middle" fontSize="4" fill="#6b7280" fontFamily="monospace">TIMER</text>

    {/* DISJUNTOR */}
    <rect x={80} y={68} width={18} height={18} rx="3.5"
      fill="#1a2540" stroke="#3b82f6" strokeWidth="1.1" />
    <rect x={84} y={71} width={10} height={6} rx="2"
      fill={ligado ? '#3b82f6' : '#1e3a8a'} />
    <rect x={86} y={77} width={6} height={6} rx="1"
      fill={ligado ? '#1d4ed8' : '#172554'} />
    <text x={89} y={91} textAnchor="middle" fontSize="4" fill="#6b7280" fontFamily="monospace">DISJ.</text>

    {/* PLAQUETA DA MARCA */}
    <rect x={103} y={66} width={26} height={22} rx="3"
      fill="rgba(255,255,255,0.92)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
    <text x={116} y={76} textAnchor="middle" fontSize="6"
      fill="#0d2137" fontFamily="sans-serif" fontWeight="900">TECNAL</text>
    <text x={116} y={84} textAnchor="middle" fontSize="5"
      fill="#1d4ed8" fontFamily="monospace" fontWeight="700">TE-0502</text>

    {/* ─────────────────────────────────
        PESCOÇO DE ACOPLAMENTO
        Une o motor ao copo via transmissão por correia
    ───────────────────────────────── */}
    {/* Carcaça do eixo */}
    <rect x={56} y={109} width={58} height={16} rx="5"
      fill="#5a6472" stroke="#414955" strokeWidth="1.3" />
    {/* Eixo central */}
    <rect x={72} y={123} width={26} height={12} rx="4"
      fill="#414955" stroke="#333a42" strokeWidth="1" />
    {/* Anel de trava */}
    <rect x={48} y={131} width={74} height={14} rx="5"
      fill={copoAcoplado ? '#2a2f38' : '#1c2028'} stroke={copoAcoplado ? '#22d3ee55' : '#333a42'} strokeWidth="1.3" />
    {/* Travas de engate rápido (latches) */}
    {[50, 108].map(x => (
      <rect key={x} x={x} y={129} width={12} height={10} rx="2.5"
        fill={copoAcoplado ? '#22d3ee' : '#2a3240'} stroke={copoAcoplado ? '#67e8f9' : '#3a4252'} strokeWidth="0.9" />
    ))}
    <text x={85} y={141} textAnchor="middle" fontSize="5" fill={copoAcoplado ? '#67e8f9' : '#4b5563'} fontFamily="monospace">
      {copoAcoplado ? '● COPO ACOPLADO' : 'encaixe livre'}
    </text>

    {/* ─────────────────────────────────
        COPO DE AÇO INOX 304
        (aparece apenas quando acoplado)
    ───────────────────────────────── */}
    {copoAcoplado ? (
      <g>
        {/* Aro superior do copo */}
        <rect x={28} y={141} width={114} height={8} rx="3"
          fill="#4e5864" stroke="#3e4550" strokeWidth="1.1" />

        {/* Corpo cônico do copo (mais largo no topo) */}
        <path d="M 32,149 L 138,149 L 124,262 L 46,262 Z"
          fill="url(#pbrDigSteel)" stroke="#8d96a0" strokeWidth="1.5" />

        {/* Sombra interna de profundidade */}
        <path d="M 36,149 L 134,149 L 121,260 L 49,260 Z"
          fill="rgba(0,0,0,0.04)" />

        {/* Reflexos metálicos verticais */}
        <line x1={52}  y1={151} x2={47}  y2={261} stroke="rgba(255,255,255,0.55)" strokeWidth="2.0" strokeLinecap="round" />
        <line x1={85}  y1={151} x2={85}  y2={262} stroke="rgba(255,255,255,0.26)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1={118} y1={151} x2={123} y2={261} stroke="rgba(255,255,255,0.20)" strokeWidth="1.0" strokeLinecap="round" />

        {/* Linhas de graduação horizontais */}
        {[172, 196, 220, 244].map(y => {
          const pct  = (y - 149) / (262 - 149);
          const x1g  = 32  + pct * 14;
          const x2g  = 138 - pct * 14;
          return (
            <line key={y}
              x1={x1g + 6} y1={y} x2={x2g - 6} y2={y}
              stroke="rgba(90,110,130,0.36)" strokeWidth="0.9" strokeDasharray="5,3" />
          );
        })}

        {/* ALÇA ESQUERDA — D-loop inox */}
        <path d="M 32,164 Q 8,164 8,186 Q 8,208 32,208"
          fill="none" stroke="#5a6472" strokeWidth="7" strokeLinecap="round" />
        <path d="M 32,164 Q 12,164 12,186 Q 12,206 32,208"
          fill="none" stroke="url(#pbrDigSteel)" strokeWidth="4" strokeLinecap="round" />
        <rect x={27} y={160} width={8} height={52} rx="3" fill="#4e5864" stroke="#3e4550" strokeWidth="1" />

        {/* ALÇA DIREITA — D-loop inox */}
        <path d="M 138,164 Q 162,164 162,186 Q 162,208 138,208"
          fill="none" stroke="#5a6472" strokeWidth="7" strokeLinecap="round" />
        <path d="M 138,164 Q 158,164 158,186 Q 158,206 138,208"
          fill="none" stroke="url(#pbrDigSteel)" strokeWidth="4" strokeLinecap="round" />
        <rect x={135} y={160} width={8} height={52} rx="3" fill="#4e5864" stroke="#3e4550" strokeWidth="1" />

        {/* PLAQUETA DO COPO */}
        <rect x={62} y={194} width={46} height={22} rx="3.5"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.7" />
        <text x={85} y={204} textAnchor="middle" fontSize="5.5" fill="#0d2137" fontFamily="monospace" fontWeight="700">1500 mL</text>
        <text x={85} y={212} textAnchor="middle" fontSize="4.5" fill="#1e3a5f" fontFamily="monospace">INOX 304</text>

        {/* FACAS RETANGULARES (3 × 36×85 mm) */}
        {ligado ? (
          <g style={{ animation: 'pbrBlade 0.10s linear infinite', transformOrigin: '85px 248px' }}>
            <rect x={65}  y={244} width={40} height={6} rx="1.5" fill="rgba(200,215,228,0.80)" />
            <rect x={82}  y={228} width={6}  height={38} rx="1.5" fill="rgba(200,215,228,0.80)" />
          </g>
        ) : (
          <>
            <rect x={66}  y={245} width={38} height={5} rx="1.5" fill="rgba(180,196,210,0.50)" />
            <rect x={83}  y={230} width={4}  height={35} rx="1.5" fill="rgba(180,196,210,0.50)" />
          </>
        )}

        {/* CONEXÕES DE MANGUEIRA (resfriamento) */}
        {[34, 128].map(x => (
          <rect key={x} x={x} y={236} width={8} height={14} rx="2.5"
            fill="#2d3540" stroke="#404d5c" strokeWidth="0.9" />
        ))}

        {/* Borda inferior do copo */}
        <ellipse cx={85} cy={262} rx={39} ry={5.5}
          fill="#4e5864" stroke="#3e4550" strokeWidth="1.3" />
      </g>
    ) : (
      /* Área de encaixe vazia */
      <g opacity={0.20}>
        <path d="M 55,152 L 115,152 L 110,182 L 60,182 Z"
          fill="#2a3240" stroke="#4b5563" strokeWidth="1" strokeDasharray="4,3" />
        <text x={85} y={170} textAnchor="middle" fontSize="6" fill="#4b5563" fontFamily="monospace">sem copo</text>
      </g>
    )}

    {/* ─────────────────────────────────
        BASE
    ───────────────────────────────── */}
    <rect x={12} y={264} width={146} height={22} rx="6"
      fill="#22262e" stroke="#1a1e24" strokeWidth="1.5" />
    {/* Pés de borracha */}
    {[26, 56, 114, 144].map(x => (
      <rect key={x} x={x - 8} y={283} width={16} height={9} rx="3.5"
        fill="#0d1117" stroke="#0a0d12" strokeWidth="0.8" />
    ))}
    <text x={85} y={277} textAnchor="middle" fontSize="5" fill="#4e5864" fontFamily="monospace">
      Digestor de Bagaço · CONSECANA
    </text>

    {/* ── DICA DE CLIQUE ── */}
    {copoAcoplado && !ligado && (
      <text x={85} y={7} textAnchor="middle" fontSize="6.5" fill="#22d3ee"
        fontFamily="monospace" fontWeight="700">↓ Clique para ligar</text>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — COPO DO DIGESTOR (standalone, zona de vidraria)
   Aço inox 304 · 1500 mL · alças D-loop · travas de engate
═══════════════════════════════════════════════════════════ */
const CopoDigestorSVG = ({ nivel = 0, cor = 'rgba(140,200,240,0.40)', comBagaco = false, comAgua = false }) => (
  <svg width="114" height="136" viewBox="-6 0 126 136">
    <defs>
      <linearGradient id="pbrCpSteel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#8d96a0" />
        <stop offset="24%"  stopColor="#dde1e5" />
        <stop offset="57%"  stopColor="#f4f6f8" />
        <stop offset="82%"  stopColor="#c8cdd3" />
        <stop offset="100%" stopColor="#8d96a0" />
      </linearGradient>
      <clipPath id="pbrCpLiqClip">
        <path d="M 8,24 L 106,24 L 94,120 L 20,120 Z" />
      </clipPath>
    </defs>

    {/* Aro superior */}
    <rect x={4} y={17} width={106} height={9} rx="3"
      fill="#4e5864" stroke="#3e4550" strokeWidth="1.1" />

    {/* Travas de engate rápido */}
    {[6, 92].map(x => (
      <rect key={x} x={x} y={13} width={14} height={9} rx="2.5"
        fill="#2a3240" stroke="#22d3ee44" strokeWidth="0.9" />
    ))}

    {/* Corpo cônico do copo */}
    <path d="M 8,24 L 106,24 L 94,120 L 20,120 Z"
      fill="url(#pbrCpSteel)" stroke="#8d96a0" strokeWidth="1.5" />

    {/* Líquido interno */}
    {nivel > 0 && (
      <g clipPath="url(#pbrCpLiqClip)">
        <rect x={8} y={24 + (96 - (nivel / 100) * 96)} width={98} height={(nivel / 100) * 96}
          fill={cor} opacity={0.88} />
        {/* Menisco */}
        <rect x={10} y={24 + (96 - (nivel / 100) * 96)} width={94} height={2}
          fill="rgba(255,255,255,0.22)" />
      </g>
    )}

    {/* Reflexos metálicos verticais */}
    <line x1={22}  y1={26} x2={20}  y2={118} stroke="rgba(255,255,255,0.56)" strokeWidth="2.0" strokeLinecap="round" />
    <line x1={57}  y1={26} x2={57}  y2={118} stroke="rgba(255,255,255,0.26)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1={92}  y1={26} x2={94}  y2={118} stroke="rgba(255,255,255,0.20)" strokeWidth="1.0" strokeLinecap="round" />

    {/* ALÇA ESQUERDA — D-loop */}
    <path d="M 8,40 Q -12,40 -12,62 Q -12,84 8,84"
      fill="none" stroke="#4e5864" strokeWidth="7" strokeLinecap="round" />
    <path d="M 8,40 Q -8,40 -8,62 Q -8,82 8,84"
      fill="none" stroke="url(#pbrCpSteel)" strokeWidth="4" strokeLinecap="round" />
    <rect x={4}  y={36} width={7} height={52} rx="2.5" fill="#4e5864" stroke="#3e4550" strokeWidth="0.9" />

    {/* ALÇA DIREITA — D-loop */}
    <path d="M 106,40 Q 126,40 126,62 Q 126,84 106,84"
      fill="none" stroke="#4e5864" strokeWidth="7" strokeLinecap="round" />
    <path d="M 106,40 Q 122,40 122,62 Q 122,82 106,84"
      fill="none" stroke="url(#pbrCpSteel)" strokeWidth="4" strokeLinecap="round" />
    <rect x={103} y={36} width={7} height={52} rx="2.5" fill="#4e5864" stroke="#3e4550" strokeWidth="0.9" />

    {/* Plaqueta */}
    <rect x={30} y={66} width={54} height={22} rx="3.5"
      fill="rgba(255,255,255,0.90)" stroke="rgba(0,0,0,0.09)" strokeWidth="0.7" />
    <text x={57} y={76} textAnchor="middle" fontSize="5.5" fill="#0d2137" fontFamily="monospace" fontWeight="700">1500 mL</text>
    <text x={57} y={84} textAnchor="middle" fontSize="4.5" fill="#1e3a5f" fontFamily="monospace">INOX 304</text>

    {/* Facas cruzadas */}
    <rect x={38} y={112} width={38} height={4} rx="1.5" fill="rgba(180,196,210,0.52)" />
    <rect x={55} y={101} width={4}  height={26} rx="1.5" fill="rgba(180,196,210,0.52)" />

    {/* Conexões de mangueira */}
    {[10, 94].map(x => (
      <rect key={x} x={x} y={100} width={7} height={11} rx="2"
        fill="#2d3540" stroke="#404d5c" strokeWidth="0.8" />
    ))}

    {/* Borda inferior */}
    <ellipse cx={57} cy={120} rx={37} ry={5} fill="#4e5864" stroke="#3e4550" strokeWidth="1.2" />

    {/* Status no topo */}
    <text x={57} y={11} textAnchor="middle" fontSize="5"
      fill={comAgua ? '#60a5fa' : comBagaco ? '#fbbf24' : '#4b5563'}
      fontFamily="monospace">
      {comAgua ? '● bagaço + 1000 mL H₂O' : comBagaco ? '● 100 g bagaço' : 'vazio'}
    </text>
    <text x={57} y={131} textAnchor="middle" fontSize="4.5" fill="#4b5563" fontFamily="monospace">
      Copo do Digestor
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — COLETOR 400 mL (béquer com bagaço integrado)
   Replica BequerSVG 400ml + palhas de bagaço num único SVG
═══════════════════════════════════════════════════════════ */
const ColetorPBRSVG = ({ nivel = 0, cor = 'rgba(195,160,90,0.55)', comBagaco = false }) => {
  const W = 80, H = 96;
  const bx = 6, bw = 68;
  const lH = (nivel / 100) * (H - 10);
  const lY  = H - lH;
  return (
    <svg width={W + 16} height={H + 30} viewBox={`0 0 ${W + 16} ${H + 30}`}>
      <defs>
        <clipPath id="pbrColLiq">
          <rect x={bx + 8} y={0} width={bw - 8} height={H - 4} />
        </clipPath>
        <linearGradient id="pbrColGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.50)" />
          <stop offset="20%"  stopColor="rgba(215,238,255,0.12)" />
          <stop offset="72%"  stopColor="rgba(210,235,255,0.06)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.38)" />
        </linearGradient>
      </defs>

      <g transform="translate(8,0)">
        {/* Sombra */}
        <ellipse cx={W/2} cy={H+8} rx={W/2-4} ry={4} fill="rgba(0,0,0,0.15)" />

        {/* Conteúdo (bagaço ou líquido) */}
        {nivel > 0 && (
          <g clipPath="url(#pbrColLiq)">
            <rect x={bx+8} y={lY} width={bw-8} height={lH+3} fill={cor} />
            {/* Textura de fibra dentro do béquer */}
            {comBagaco && [
              [bx+10, lY+4,  bx+28, lY+2,  '#b07830'],
              [bx+24, lY+8,  bx+46, lY+6,  '#c89030'],
              [bx+14, lY+13, bx+36, lY+11, '#a06820'],
              [bx+32, lY+4,  bx+56, lY+6,  '#b88028'],
              [bx+8,  lY+18, bx+30, lY+16, '#c09030'],
              [bx+42, lY+16, bx+62, lY+18, '#a07020'],
              [bx+18, lY+22, bx+40, lY+20, '#b87828'],
              [bx+36, lY+22, bx+58, lY+24, '#c08828'],
              [bx+10, lY+28, bx+32, lY+26, '#a06818'],
              [bx+44, lY+28, bx+64, lY+30, '#b07820'],
              [bx+20, lY+33, bx+42, lY+31, '#c08828'],
              [bx+8,  lY+38, bx+28, lY+36, '#a07020'],
              [bx+34, lY+36, bx+56, lY+38, '#b88030'],
              [bx+16, lY+42, bx+38, lY+40, '#c09028'],
              [bx+44, lY+44, bx+62, lY+42, '#a06820'],
            ].map(([x1,y1,x2,y2,c],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity={0.75} />
            ))}
            {nivel > 5 && (
              <rect x={bx+10} y={lY+1} width={bw-18} height={2} rx="1"
                fill="rgba(255,255,255,0.22)" />
            )}
          </g>
        )}

        {/* Corpo de vidro */}
        <rect x={bx+8} y={0} width={bw-8} height={H} rx="2"
          fill="url(#pbrColGlass)" stroke="#8ac4dc" strokeWidth="1.6" />

        {/* Borda superior com bico */}
        <path d={`M${bx},0 L${bx+bw},0 L${bx+bw+4},-8 L${bx+bw-4},-14 L${bx+8},-14 L${bx+4},-8 Z`}
          fill="rgba(185,228,255,0.38)" stroke="#8ac4dc" strokeWidth="1.3" />

        {/* Reflexo */}
        <rect x={bx+10} y={8} width={3} height={H-16} rx="1.5"
          fill="rgba(255,255,255,0.38)" />

        {/* Graduações */}
        {[100,200,300,400].map(v => {
          const yg = H - (v/400)*(H-10);
          return (
            <g key={v}>
              <line x1={bx+bw-4} y1={yg} x2={bx+bw+8} y2={yg}
                stroke="rgba(6,32,85,0.55)" strokeWidth="0.9" />
              <text x={bx+bw+10} y={yg+3.5} fontSize="6.5"
                fill="rgba(6,32,85,0.60)" fontFamily="monospace">{v}</text>
            </g>
          );
        })}
        <text x={bx+bw+10} y={10} fontSize="6" fill="rgba(6,32,85,0.50)" fontFamily="monospace">mL</text>

        {/* Rótulo */}
        <rect x={bx+10} y={H-18} width={bw-16} height={11} rx="2"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.6" />
        <text x={W/2} y={H-10} textAnchor="middle" fontSize="6.5"
          fill="#0d2137" fontFamily="monospace" fontWeight="700">400 mL</text>

      </g>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — PENEIRA / FUNIL DE TELA
═══════════════════════════════════════════════════════════ */
const PeneiraSVG = ({ filtrando, comFiltrado, acoplada }) => (
  <svg width="96" height="160" viewBox="0 0 96 160">
    {/* Cabo / suporte */}
    <rect x={43} y={2} width={10} height={22} rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
    {/* Estrutura da peneira (aro) */}
    <ellipse cx={48} cy={24} rx={40} ry={8} fill="rgba(185,225,255,0.30)" stroke="#9ca3af" strokeWidth="1.5" />
    {/* Corpo cônico da peneira */}
    <path d="M 8,24 L 88,24 L 68,74 L 28,74 Z" fill="rgba(180,200,220,0.20)" stroke="#9ca3af" strokeWidth="1.5" />
    {/* Malha da peneira — linhas horizontais */}
    {[30,37,44,51,58,65,72].map(y => {
      const spread = (y - 24) * 0.55;
      return (
        <line key={`h${y}`} x1={8 + spread} y1={y} x2={88 - spread} y2={y}
          stroke="rgba(148,163,184,0.50)" strokeWidth="0.8" />
      );
    })}
    {/* Malha — linhas verticais */}
    {[16,24,32,40,48,56,64,72,80].map(x => (
      <line key={`v${x}`} x1={x} y1={24} x2={x} y2={68} stroke="rgba(148,163,184,0.35)" strokeWidth="0.7" />
    ))}
    {/* Bico de escoamento */}
    <rect x={44} y={72} width={8} height={14} rx="2" fill="rgba(185,225,255,0.30)" stroke="#9ca3af" strokeWidth="1" />
    {/* Gotas filtrando — caem até o béquer abaixo */}
    {filtrando && (
      <ellipse cx={48} cy={90} rx={3} ry={4} fill="rgba(180,215,195,0.85)">
        <animate attributeName="cy" from={86} to={130} dur="0.65s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="0.65s" repeatCount="indefinite" />
      </ellipse>
    )}
    {/* ── BÉQUER COLETOR ACOPLADO (some ao liberar) ── */}
    {!comFiltrado && (
      <g>
        {/* Corpo do béquer 400mL acoplado */}
        <rect x={14} y={90} width={68} height={58} rx="3"
          fill="rgba(185,228,255,0.18)" stroke="#8ac4dc" strokeWidth="1.4" />
        {/* Rim / boca */}
        <rect x={10} y={87} width={76} height={6} rx="2"
          fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.1" />
        {/* Reflexo vidro */}
        <rect x={17} y={94} width={3} height={48} rx="1.5"
          fill="rgba(255,255,255,0.28)" />
        {/* Graduações */}
        <line x1={76} y1={108} x2={82} y2={108} stroke="rgba(6,32,85,0.40)" strokeWidth="0.8" />
        <line x1={76} y1={120} x2={82} y2={120} stroke="rgba(6,32,85,0.40)" strokeWidth="0.8" />
        <line x1={76} y1={132} x2={82} y2={132} stroke="rgba(6,32,85,0.40)" strokeWidth="0.8" />
        {/* Conteúdo filtrando */}
        {filtrando && (
          <rect x={15} y={124} width={66} height={23} rx="1"
            fill="rgba(180,220,195,0.30)" />
        )}
        {/* Label */}
        <text x={48} y={154} textAnchor="middle" fontSize="5" fill="#64748b" fontFamily="monospace">
          {filtrando ? '⏳ filtrando...' : '400 mL · vazio'}
        </text>
        {/* Sombra */}
        <ellipse cx={48} cy={149} rx={32} ry={3} fill="rgba(0,0,0,0.12)" />
      </g>
    )}
    {/* Indicador liberado */}
    {comFiltrado && (
      <text x={48} y={100} textAnchor="middle" fontSize="6" fill="#86efac" fontFamily="monospace">
        ✓ béquer liberado
      </text>
    )}
    <text x={48} y={6} textAnchor="middle" fontSize="5.5" fill="#94a3b8" fontFamily="monospace">Peneira / Funil de Tela</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — SACARÍMETRO  Anton Paar MCP Sucromat 5500
   Ref: 797×437×231 mm · câmara óptica horizontal · LED 589nm
   Touchscreen direita · barra Anton Paar no topo
═══════════════════════════════════════════════════════════ */
const SacarimetroSVG = ({ comAmostra }) => (
  <svg width="210" height="146" viewBox="0 -16 210 146">
    <defs>
      <linearGradient id="sacHousing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#e8ecf0" />
        <stop offset="50%"  stopColor="#d4dae0" />
        <stop offset="100%" stopColor="#bec6ce" />
      </linearGradient>
      <linearGradient id="sacPanelL" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#c8d0d8" />
        <stop offset="100%" stopColor="#d8e0e8" />
      </linearGradient>
      <linearGradient id="sacLED" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor={comAmostra ? '#fef08a' : '#2a3040'} />
        <stop offset="100%" stopColor={comAmostra ? '#f59e0b' : '#1a2030'} />
      </linearGradient>
      <linearGradient id="sacFunil" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#8d96a0" />
        <stop offset="24%"  stopColor="#dde1e5" />
        <stop offset="55%"  stopColor="#f4f6f8" />
        <stop offset="80%"  stopColor="#c8cdd3" />
        <stop offset="100%" stopColor="#8d96a0" />
      </linearGradient>
    </defs>

    {/* ── FUNIL METÁLICO (extremidade direita do instrumento) ── */}
    {/* Boca — aro externo */}
    <ellipse cx={160} cy={-10} rx={11} ry={2.5}
      fill="#7a8490" stroke="#606870" strokeWidth="0.8" />
    {/* Boca — interior escuro */}
    <ellipse cx={160} cy={-10} rx={9} ry={1.8}
      fill="#101820" />

    {/* Cone */}
    <path d="M 149,-8 L 171,-8 L 165,10 L 155,10 Z"
      fill="url(#sacFunil)" stroke="#8d96a0" strokeWidth="0.9" />

    {/* Reflexos no cone */}
    <line x1={152} y1={-7} x2={157} y2={9}  stroke="rgba(255,255,255,0.50)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1={160} y1={-8} x2={160} y2={10} stroke="rgba(255,255,255,0.20)" strokeWidth="0.7" strokeLinecap="round" />
    <line x1={168} y1={-7} x2={163} y2={9}  stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" strokeLinecap="round" />

    {/* Pescoço */}
    <rect x={156} y={10} width={8} height={8} rx="1.5"
      fill="url(#sacFunil)" stroke="#8d96a0" strokeWidth="0.8" />
    <rect x={157} y={11} width={2} height={6} rx="1"
      fill="rgba(255,255,255,0.36)" />

    {/* Anel de conexão no instrumento */}
    <rect x={153} y={17} width={14} height={4} rx="1.5"
      fill="#6d7880" stroke="#505860" strokeWidth="0.8" />

    {/* Líquido (quando amostra inserida) */}
    {comAmostra && (
      <>
        <path d="M 151,-6 L 169,-6 L 164,9 L 156,9 Z"
          fill="rgba(195,242,210,0.30)" />
        <ellipse cx={160} cy={22} rx={2.5} ry={3}
          fill="rgba(200,240,205,0.75)">
          <animate attributeName="cy" from={19} to={44} dur="0.9s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8" to="0" dur="0.9s" repeatCount="indefinite" />
        </ellipse>
      </>
    )}

    {/* Sombra */}
    <ellipse cx={105} cy={127} rx={96} ry={4} fill="rgba(0,0,0,0.20)" />

    {/* ── PROFUNDIDADE LATERAL ── */}
    <rect x={6} y={16} width={200} height={102} rx="9" fill="#9aa4ae" />

    {/* ── CORPO PRINCIPAL (pearl gray) ── */}
    <rect x={2} y={12} width={200} height={102} rx="9"
      fill="url(#sacHousing)" stroke="#8090a0" strokeWidth="1.4" />

    {/* ── BARRA SUPERIOR — ANTON PAAR ── */}
    <rect x={2} y={12} width={200} height={15} rx="9" fill="#2c3440" />
    <rect x={2} y={20} width={200} height={7}  rx="0"  fill="#2c3440" />
    <text x={105} y={22} textAnchor="middle" fontSize="5.8" fill="#8090a0"
      fontFamily="sans-serif" fontWeight="900" letterSpacing="1.5">
      ANTON PAAR · MCP SUCROMAT 5500
    </text>

    {/* ── PAINEL CENTRAL RECUADO ── */}
    <rect x={8} y={28} width={194} height={78} rx="6"
      fill="rgba(0,0,0,0.07)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.6" />

    {/* ══════════════════════════
        ESQUERDA — FONTE DE LUZ LED
    ══════════════════════════ */}
    <rect x={12} y={32} width={42} height={70} rx="5"
      fill="url(#sacPanelL)" stroke="#a8b4be" strokeWidth="0.9" />

    {/* Alojamento LED */}
    <circle cx={33} cy={50} r={14} fill="#1c2430" stroke="#384050" strokeWidth="1.2" />
    <circle cx={33} cy={50} r={10} fill="url(#sacLED)" />
    <circle cx={33} cy={50} r={5}
      fill={comAmostra ? 'rgba(255,255,200,0.90)' : 'rgba(20,30,50,0.80)'}
      style={comAmostra ? { animation: 'pbrAquecer 1.8s ease-in-out infinite' } : {}} />
    {/* Reflexo lente */}
    <circle cx={29} cy={46} r={2} fill="rgba(255,255,255,0.30)" />
    {/* Labels */}
    <text x={33} y={68} textAnchor="middle" fontSize="4.5" fill="#505a66"
      fontFamily="monospace" fontWeight="700">LED</text>
    <text x={33} y={74} textAnchor="middle" fontSize="4" fill="#505a66"
      fontFamily="monospace">589 nm</text>
    <text x={33} y={80} textAnchor="middle" fontSize="4" fill="#505a66"
      fontFamily="monospace">λ ICUMSA</text>
    {/* Status LED pequeno */}
    <circle cx={33} cy={90} r={4}
      fill={comAmostra ? '#22c55e' : '#1e3a2a'} stroke="#0d1a12" strokeWidth="0.7" />
    <text x={33} y={99} textAnchor="middle" fontSize="3.5" fill="#505a66" fontFamily="monospace">READY</text>

    {/* ══════════════════════════
        CENTRO — CÂMARA ÓPTICA
    ══════════════════════════ */}
    <rect x={58} y={32} width={94} height={70} rx="5"
      fill="#101820" stroke="#283040" strokeWidth="1.2" />
    <text x={105} y={41} textAnchor="middle" fontSize="4.5"
      fill="#3a5060" fontFamily="monospace" letterSpacing="0.5">CÂMARA ÓPTICA</text>

    {/* Slot do tubo de amostra */}
    <rect x={62} y={44} width={86} height={22} rx="4"
      fill="rgba(5,10,18,0.95)" stroke="#22d3ee" strokeWidth="0.9" />
    {/* Guias do tubo */}
    <rect x={62} y={43} width={86} height={4}  rx="1.5" fill="#283040" />
    <rect x={62} y={66} width={86} height={3}  rx="1.5" fill="#283040" />
    {/* Clips laterais de fixação */}
    <rect x={60} y={48} width={5}  height={14} rx="1.5" fill="#1e2e3e" stroke="#304050" strokeWidth="0.7" />
    <rect x={147} y={48} width={5} height={14} rx="1.5" fill="#1e2e3e" stroke="#304050" strokeWidth="0.7" />

    {/* Tubo de amostra quando inserido */}
    {comAmostra ? (
      <>
        <rect x={65} y={47} width={80} height={16} rx="8"
          fill="rgba(180,230,190,0.22)" stroke="rgba(160,220,175,0.55)" strokeWidth="0.9" />
        <rect x={67} y={49} width={76} height={12} rx="6"
          fill="rgba(220,248,215,0.35)" />
        <rect x={69} y={50} width={72} height={10} rx="5"
          fill="rgba(195,242,205,0.40)" />
        {/* Reflexo do tubo */}
        <rect x={69} y={50} width={72} height={3} rx="2.5"
          fill="rgba(255,255,255,0.18)" />
      </>
    ) : (
      /* Caminho óptico vazio */
      <line x1={65} y1={55} x2={145} y2={55}
        stroke="rgba(34,211,238,0.10)" strokeWidth="1.5" strokeDasharray="4,3" />
    )}

    {/* Beam indicator — seta do LED para câmara */}
    {comAmostra && (
      <line x1={50} y1={55} x2={62} y2={55}
        stroke="rgba(253,224,71,0.35)" strokeWidth="1.8" strokeLinecap="round" />
    )}

    {/* Janela de inspeção / câmera */}
    <rect x={86} y={72} width={38} height={22} rx="3"
      fill="#0a1420" stroke="#22d3ee" strokeWidth="0.8" />
    <ellipse cx={105} cy={83} rx={12} ry={8}
      fill={comAmostra ? 'rgba(34,180,80,0.18)' : 'rgba(10,20,30,0.80)'} />
    {comAmostra && (
      <ellipse cx={105} cy={83} rx={8} ry={5} fill="rgba(34,211,130,0.22)" />
    )}
    <text x={105} y={97} textAnchor="middle" fontSize="4" fill="#3a5060" fontFamily="monospace">CAM</text>

    {/* ══════════════════════════
        DIREITA — TOUCHSCREEN
    ══════════════════════════ */}
    <rect x={156} y={32} width={42} height={70} rx="5"
      fill="#070e16" stroke="#22d3ee" strokeWidth="1.1" />
    <rect x={157} y={33} width={40} height={68} rx="4.5"
      fill="#060c14" />

    {/* Header display */}
    <rect x={158} y={34} width={38} height={10} rx="2"
      fill="rgba(34,211,238,0.08)" />
    <text x={177} y={41} textAnchor="middle" fontSize="5" fill="#22d3ee"
      fontFamily="monospace" fontWeight="900" letterSpacing="0.5">SUCROMAT</text>

    {/* Separador */}
    <line x1={159} y1={45} x2={195} y2={45}
      stroke="#22d3ee" strokeWidth="0.5" opacity={0.35} />

    {/* Status label */}
    <text x={177} y={54} textAnchor="middle" fontSize="4" fill="#3a5a6a"
      fontFamily="monospace">
      {comAmostra ? 'MEDINDO' : 'AGUARDANDO'}
    </text>

    {/* Leitura principal °Z */}
    <text x={177} y={67} textAnchor="middle" fontSize="16"
      fill={comAmostra ? '#22d3ee' : '#1a4044'}
      fontFamily="monospace" fontWeight="900" letterSpacing="1">
      {comAmostra ? '--.-' : '--.-'}
    </text>
    <text x={177} y={75} textAnchor="middle" fontSize="5"
      fill={comAmostra ? '#86efac' : '#1a4044'} fontFamily="monospace">
      {comAmostra ? '°Z Ventzke' : '°Z'}
    </text>

    {/* Linha separadora */}
    <line x1={159} y1={79} x2={195} y2={79}
      stroke="#22d3ee" strokeWidth="0.4" opacity={0.25} />

    {/* Temp e LEDs de status */}
    <text x={177} y={86} textAnchor="middle" fontSize="3.8"
      fill={comAmostra ? '#60a5fa' : '#1e3a5a'} fontFamily="monospace">
      {comAmostra ? '20.0 °C' : 'T: --'}
    </text>
    <circle cx={165} cy={93} r={3.5}
      fill={comAmostra ? '#22c55e' : '#1e3a2a'} stroke="#0d1a12" strokeWidth="0.6" />
    <circle cx={178} cy={93} r={3.5}
      fill={comAmostra ? '#f59e0b' : '#1a2a1a'} stroke="#0d1a12" strokeWidth="0.6" />
    <circle cx={191} cy={93} r={3.5}
      fill="#1e2a3a" stroke="#0d1a12" strokeWidth="0.6" />
    <text x={177} y={100} textAnchor="middle" fontSize="3.5" fill="#283848" fontFamily="monospace">OK · RUN · ERR</text>

    {/* ── PORTAS USB (canto inferior centro) ── */}
    {[78, 90, 102].map((x,i) => (
      <rect key={i} x={x} y={103} width={8} height={5} rx="1"
        fill="#1a2028" stroke="#303840" strokeWidth="0.6" />
    ))}
    <text x={95} y={112} textAnchor="middle" fontSize="3.5" fill="#404850" fontFamily="monospace">USB · RS232 · ETH</text>

    {/* ── PÉS DE BORRACHA ── */}
    {[16, 52, 158, 194].map((x,i) => (
      <rect key={i} x={x-7} y={112} width={14} height={6} rx="3"
        fill="#111820" stroke="#0a1018" strokeWidth="0.7" />
    ))}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const PolBagaco = () => {
  useDragOverlay();

  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado,
    mostrarParabens, concluido,
    mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  // ── Pesagem ───────────────────────────────────────────
  const [coletorNaBalanca, setColetorNaBalanca] = useState(false);
  const [pesando,          setPesando]          = useState(false);
  const [peso,             setPeso]             = useState(0);
  const [bagacoPesado,     setBagacoPesado]     = useState(false);

  // ── Copo do digestor ──────────────────────────────────
  const [nivelCopoDigestor, setNivelCopoDigestor] = useState(0);
  const [corCopoDigestor,   setCorCopoDigestor]   = useState('rgba(140,200,240,0.35)');
  const [bagacoNoCopo,      setBagacoNoCopo]      = useState(false);
  const [aguaNoCopo,        setAguaNoCopo]        = useState(false);

  // ── Digestor ──────────────────────────────────────────
  const [copoAcoplado,   setCopoAcoplado]   = useState(false);
  const [digestorLigado, setDigestorLigado] = useState(false);
  const [tempoDigestor,  setTempoDigestor]  = useState(15);
  const [digestorPronto, setDigestorPronto] = useState(false);

  // ── Peneira ───────────────────────────────────────────
  const [filtrandoPeneira,  setFiltrandoPeneira]  = useState(false);
  const [nivelBqFiltrado,   setNivelBqFiltrado]   = useState(0);
  const [extratoDisponivel, setExtratoDisponivel] = useState(false);

  // ── Béquer 200 mL ─────────────────────────────────────
  const [nivelBequer200,      setNivelBequer200]      = useState(0);
  const [corBequer200,        setCorBequer200]        = useState('rgba(180,220,195,0.55)');
  const [agitandoClarificante, setAgitandoClarificante] = useState(false);
  const [clarificanteAdicionado, setClarificanteAdicionado] = useState(false);

  // ── Espátula ──────────────────────────────────────────
  const [espatulaComClarificante, setEspatulaComClarificante] = useState(false);

  // ── Filtração papel filtro ────────────────────────────
  const [filtrandoPapel, setFiltrandoPapel] = useState(false);
  const [filtradoFinal,  setFiltradoFinal]  = useState(false);

  // ── Béquer Leitura (200 mL — vai ao sacarímetro) ─────
  const [nivelBqLeitura, setNivelBqLeitura] = useState(0);

  // ── Sacarímetro ───────────────────────────────────────
  const [amostraNoSacarimetro, setAmostraNoSacarimetro] = useState(false);

  // ── Cálculo %Pol ─────────────────────────────────────
  const [campoL,      setCampoL]      = useState('');
  const [campoUb,     setCampoUb]     = useState('');
  const [campoQ,      setCampoQ]      = useState('');
  const [polResultado, setPolResultado] = useState(null);
  const [erroCalculo, setErroCalculo] = useState('');


  /* ── Timers ────────────────────────────────────────── */

  // Pesagem: 100 g em ~8 s (interval 80 ms, +1 g por tick)
  useEffect(() => {
    if (!pesando) return;
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setPeso(Math.min(v, 100));
      if (v >= 100) {
        clearInterval(id);
        setPesando(false);
        setBagacoPesado(true);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 25);
    return () => clearInterval(id);
  }, [pesando, celebrarAcerto, proximaEtapa]);

  // Digestor: 15 min simulados em 15 s (1 s real = 1 min)
  useEffect(() => {
    if (!digestorLigado || digestorPronto) return;
    let mins = 15;
    const id = setInterval(() => {
      mins -= 1;
      setTempoDigestor(mins);
      if (mins <= 0) {
        clearInterval(id);
        setDigestorPronto(true);
        setCopoAcoplado(false);
        celebrarAcerto(200);
        proximaEtapa();
      }
    }, 200);
    return () => clearInterval(id);
  }, [digestorLigado, digestorPronto, celebrarAcerto, proximaEtapa]);

  // Filtração peneira: 2,5 s
  useEffect(() => {
    if (!filtrandoPeneira) return;
    const id = setTimeout(() => {
      setFiltrandoPeneira(false);
      setNivelBqFiltrado(70);
      setExtratoDisponivel(true);
      celebrarAcerto(100);
      proximaEtapa();
    }, 2500);
    return () => clearTimeout(id);
  }, [filtrandoPeneira, celebrarAcerto, proximaEtapa]);

  // Agitação com clarificante: 2 s
  useEffect(() => {
    if (!agitandoClarificante) return;
    const id = setTimeout(() => {
      setAgitandoClarificante(false);
      setClarificanteAdicionado(true);
      setCorBequer200('rgba(220,235,200,0.60)');
      celebrarAcerto(100);
      proximaEtapa();
    }, 2000);
    return () => clearTimeout(id);
  }, [agitandoClarificante, celebrarAcerto, proximaEtapa]);

  // Filtração papel filtro: 2,5 s
  useEffect(() => {
    if (!filtrandoPapel) return;
    const id = setTimeout(() => {
      setFiltrandoPapel(false);
      setFiltradoFinal(true);
      setNivelBqLeitura(55);
      celebrarAcerto(100);
      proximaEtapa();
    }, 2500);
    return () => clearTimeout(id);
  }, [filtrandoPapel, celebrarAcerto, proximaEtapa]);


  /* ── Helpers de etapa ──────────────────────────────── */
  const isItem  = (id) => etapas[etapaAtual]?.itemNecessario === id;
  const isAlvo  = (id) => etapas[etapaAtual]?.alvo === id;
  const itemCls = (id) => isItem(id) ? 'pulse-item' : '';
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';


  /* ── Drag handlers ─────────────────────────────────── */
  const handleDragStart = (id) => setItemSegurado(id);
  const handleDragEnd   = ()   => setItemSegurado(null);
  const handleDragOver  = (e)  => e.preventDefault();


  /* ── Drop handler ──────────────────────────────────── */
  const handleDrop = (alvo, e) => {
    e.preventDefault();
    const item = itemSegurado;
    setItemSegurado(null);

    const etapa = etapas[etapaAtual];
    if (!etapa || etapa.itemNecessario !== item || etapa.alvo !== alvo) {
      mostrarErroAcao('Ação incorreta para esta etapa.');
      return;
    }

    // Etapa 0: coletor → balança
    if (etapaAtual === 0) {
      setColetorNaBalanca(true);
      celebrarAcerto(100);
      proximaEtapa();
      return;
    }

    // Etapa 1: bagaço → balança (inicia pesagem)
    if (etapaAtual === 1) {
      setPesando(true);
      return;
    }

    // Etapa 2: coletor → copo digestor
    if (etapaAtual === 2) {
      setBagacoNoCopo(true);
      setNivelCopoDigestor(20);
      setCorCopoDigestor('rgba(195,160,90,0.60)');
      setColetorNaBalanca(false);
      celebrarAcerto(100);
      proximaEtapa();
      return;
    }

    // Etapa 3: água → copo digestor
    if (etapaAtual === 3) {
      setAguaNoCopo(true);
      setNivelCopoDigestor(72);
      setCorCopoDigestor('rgba(160,200,225,0.62)');
      celebrarAcerto(100);
      proximaEtapa();
      return;
    }

    // Etapa 4: copo digestor → digestor
    if (etapaAtual === 4) {
      setCopoAcoplado(true);
      celebrarAcerto(100);
      proximaEtapa();
      return;
    }

    // Etapa 6: copo digestor → peneira
    if (etapaAtual === 6) {
      setCopoAcoplado(false);
      setBagacoNoCopo(false);
      setAguaNoCopo(false);
      setNivelCopoDigestor(0);
      setFiltrandoPeneira(true);
      return;
    }

    // Etapa 7: béquer filtrado → béquer 200 mL
    if (etapaAtual === 7) {
      setNivelBqFiltrado(0);
      setExtratoDisponivel(false);
      setNivelBequer200(60);
      setCorBequer200('rgba(180,220,195,0.55)');
      celebrarAcerto(100);
      proximaEtapa();
      return;
    }

    // Etapa 8: espátula → clarificante
    if (etapaAtual === 8) {
      setEspatulaComClarificante(true);
      celebrarAcerto(100);
      proximaEtapa();
      return;
    }

    // Etapa 9: espátula → béquer 200 mL (inicia agitação)
    if (etapaAtual === 9) {
      setEspatulaComClarificante(false);
      setAgitandoClarificante(true);
      return;
    }

    // Etapa 10: béquer 200 mL → funil papel filtro
    if (etapaAtual === 10) {
      setNivelBequer200(0);
      setFiltrandoPapel(true);
      return;
    }

    // Etapa 11: béquer leitura → sacarímetro
    if (etapaAtual === 11) {
      setAmostraNoSacarimetro(true);
      setNivelBqLeitura(0);
      setFiltradoFinal(false);
      celebrarAcerto(100);
      proximaEtapa();
      return;
    }
  };


  /* ── Click: ligar digestor (etapa 5) ──────────────── */
  const handleClicarDigestor = () => {
    if (etapaAtual !== 5 || !copoAcoplado || digestorLigado) return;
    setDigestorLigado(true);
  };


  /* ── Cálculo %Pol ──────────────────────────────────── */
  const calcularPol = () => {
    setErroCalculo('');
    setPolResultado(null);

    if (!campoL.trim() || !campoUb.trim() || !campoQ.trim()) {
      setErroCalculo('Preencha todos os campos antes de calcular.');
      return;
    }

    const L  = parseFloat(campoL.replace(',', '.'));
    const Ub = parseFloat(campoUb.replace(',', '.'));
    const Q  = parseFloat(campoQ.replace(',', '.'));

    if (isNaN(L) || isNaN(Ub) || isNaN(Q)) {
      setErroCalculo('Todos os valores devem ser numéricos.');
      return;
    }
    if (L <= 0) {
      setErroCalculo('A leitura L deve ser um valor positivo.');
      return;
    }
    if (Ub < 0) {
      setErroCalculo('A umidade Ub não pode ser negativa.');
      return;
    }
    if (Q === 0) {
      setErroCalculo('O valor de Q não pode ser zero.');
      return;
    }

    const numerador    = 2 * L * 26 * (1000 + Ub);
    const denominador  = 20000 - (2 * L * 26 * 100) / Q;

    if (denominador === 0) {
      setErroCalculo('Denominador igual a zero — verifique os valores inseridos.');
      return;
    }

    const resultado = numerador / denominador;

    if (!isFinite(resultado) || isNaN(resultado)) {
      setErroCalculo('Resultado inválido — verifique os valores inseridos.');
      return;
    }

    setPolResultado(resultado);
  };


  /* ── Draggability helpers ──────────────────────────── */
  const coletorArrastavel = (etapaAtual === 0 && !coletorNaBalanca) ||
                            (etapaAtual === 2 && bagacoPesado);
  const copoArrastavel    = (etapaAtual === 4 && bagacoNoCopo && aguaNoCopo) ||
                            (etapaAtual === 6 && digestorPronto);
  const bqFiltradoArrastavel = etapaAtual === 7 && extratoDisponivel;
  const espatulaArrastavel   = (etapaAtual === 8 && !espatulaComClarificante) ||
                               (etapaAtual === 9 && espatulaComClarificante);
  const bq200Arrastavel      = etapaAtual === 10 && clarificanteAdicionado;
  const bqLeituraArrastavel  = etapaAtual === 11 && filtradoFinal;
  const digestorClicavel     = etapaAtual === 5 && copoAcoplado && !digestorLigado;


  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding: 16, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <style>{PBR_CSS}</style>

      {/* ── OVERLAY PARABÉNS ── */}
      {mostrarParabens && (
        <div style={{ position: 'fixed', top: 18, right: 24, zIndex: 60, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#f59e0b,#22c55e,#06b6d4)', color: 'white', padding: '20px 36px', borderRadius: 22, boxShadow: '0 16px 40px rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.9)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Star size={30} fill="currentColor" />
              <div><h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Parabéns!</h3><p style={{ fontSize: 15, margin: 0 }}>+100 pontos</p></div>
              <CheckCircle size={30} />
            </div>
          </div>
        </div>
      )}

      {/* ── OVERLAY ERRO DE AÇÃO ── */}
      {mostrarErroEtapa && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c)', color: 'white', padding: '10px 24px', borderRadius: 14, border: '2px solid rgba(255,255,255,0.6)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>⚠️ {mensagemErroEtapa}</div>
          </div>
        </div>
      )}

      {/* ── BANNER: digestor aquecendo ── */}
      {digestorLigado && !digestorPronto && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#78350f,#b45309)', color: 'white', padding: '10px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.65)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>🔥 Digestor em funcionamento — {String(tempoDigestor).padStart(2,'0')}:00 restantes</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 16, overflowY: 'auto' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #22d3ee', borderRadius: 22, padding: '28px 34px', textAlign: 'center', color: 'white', maxWidth: 620, width: '100%', boxShadow: '0 0 42px rgba(34,211,238,0.22)' }}>
            <div style={{ fontSize: 48 }}>🌿</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#22d3ee', margin: '8px 0 4px' }}>Simulação Concluída!</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Insira os valores para calcular a %Pol do Bagaço Residual</p>

            {/* ─ FÓRMULA ─ */}
            <div style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.22)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: '#67e8f9', fontWeight: 700, marginBottom: 6 }}>Fórmula — %Pol do Bagaço (CONSECANA)</div>
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#e2e8f0', lineHeight: 1.8 }}>
                <div>%Pol = <span style={{ color: '#86efac' }}>( 2 × L × 26 × (1000 + Ub) )</span></div>
                <div style={{ paddingLeft: 44 }}>÷ <span style={{ color: '#fbbf24' }}>( 20000 − ((2 × L × 26 × 100) / Q) )</span></div>
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
                L = leitura sacarimétrica (°Z) · Ub = umidade do bagaço (%) · Q = parâmetro de qualidade
              </div>
            </div>

            {/* ─ CAMPOS ─ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'L — Leitura (°Z)', value: campoL, set: setCampoL, placeholder: 'ex: 14,2' },
                { label: 'Ub — Umidade (%)', value: campoUb, set: setCampoUb, placeholder: 'ex: 48,5' },
                { label: 'Q — Parâmetro',    value: campoQ, set: setCampoQ, placeholder: 'ex: 100' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'left' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>{label}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={ev => set(ev.target.value)}
                    placeholder={placeholder}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(34,211,238,0.30)', borderRadius: 10, padding: '8px 10px', color: '#e2e8f0', fontSize: 14, fontFamily: 'monospace', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    onFocus={ev => (ev.target.style.borderColor = '#22d3ee')}
                    onBlur={ev  => (ev.target.style.borderColor = 'rgba(34,211,238,0.30)')}
                  />
                </div>
              ))}
            </div>

            {/* ─ ERRO DE CÁLCULO ─ */}
            {erroCalculo && (
              <div style={{ background: 'rgba(127,29,29,0.50)', border: '1px solid rgba(248,113,113,0.40)', borderRadius: 10, padding: '8px 14px', marginBottom: 14, fontSize: 12, color: '#fca5a5', textAlign: 'left' }}>
                ⚠️ {erroCalculo}
              </div>
            )}

            {/* ─ BOTÃO CALCULAR ─ */}
            <button
              onClick={calcularPol}
              style={{ background: 'linear-gradient(90deg,#0ea5e9,#22c55e)', color: 'white', border: 'none', borderRadius: 14, padding: '11px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: polResultado !== null ? 20 : 0 }}
            >
              ⚗️ Calcular %Pol
            </button>

            {/* ─ RESULTADO ─ */}
            {polResultado !== null && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.30)', borderRadius: 16, padding: '18px 22px', marginTop: 4 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Pol do Bagaço Residual</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: '#86efac', fontFamily: 'monospace', lineHeight: 1 }}>
                  {polResultado.toFixed(2)}%
                </div>
                <div style={{ fontSize: 11, color: polResultado < 2.5 ? '#34d399' : polResultado < 4 ? '#fbbf24' : '#f87171', marginTop: 8, fontWeight: 700 }}>
                  {polResultado < 2.5
                    ? '✓ Extração eficiente · Pol dentro do padrão'
                    : polResultado < 4
                    ? '⚠️ Atenção · Pol ligeiramente elevado'
                    : '🔴 Pol elevado · Verificar eficiência de extração'}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>faixa esperada: &lt; 2,5% (extração eficiente)</div>
              </div>
            )}

            {/* ─ PONTUAÇÃO + RECOMEÇAR ─ */}
            <div style={{ marginTop: 18, fontSize: 15, color: '#fbbf24', fontWeight: 700 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 12, background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '9px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              🔄 Recomeçar
            </button>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════
         BANCADA
      ══════════════════════════════════════════════════ */}
      <LayoutSimulador
        etapaAtual={etapaAtual}
        etapas={etapas}
        pontuacao={pontuacao}
        titulo="Pol de Bagaço"
        subtitulo={"Determinação de Pol no Bagaço Residual\nMétodo Extração Aquosa · CONSECANA"}
        icone="🌿"
        badges={['🍬 CALDOS', '🌿 BAGAÇO']}
        footerLabel="🌿 Pol Bagaço"
      >
        {/* ── CARD BANCADA (madeira) ── */}
        <div style={{
          background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)',
          borderRadius: 26, padding: '22px 18px',
          border: '8px solid #8b6e45',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 860,
        }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            🌿 Bancada — Determinação de Pol no Bagaço Residual · Extração Aquosa / Sacarimetria · CONSECANA
          </h2>

          {/* ── PEDRA INTERNA ── */}
          <div style={{
            background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)',
            borderRadius: 20, padding: '18px 16px',
            border: '4px solid #292524',
            boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)',
          }}>

            {/* ══ ZONA 1: EQUIPAMENTOS GRANDES ════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* BALANÇA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={dropCls('balanca')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '6px 8px' }}
                  onDrop={e => handleDrop('balanca', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                >
                  <BalancaPBRSVG pesando={pesando} peso={peso} coletorPositionado={coletorNaBalanca} bagacoPesado={bagacoPesado} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Balança Analítica</span>
                {pesando && <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700 }}>⚖️ {peso.toFixed(1)} g</span>}
                {bagacoPesado && !pesando && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ 100 g pesados</span>}
              </div>

              {/* DIGESTOR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={dropCls('digestor')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 14, padding: '6px 8px', cursor: digestorClicavel ? 'pointer' : 'default' }}
                  onDrop={e => handleDrop('digestor', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onClick={handleClicarDigestor}
                >
                  <DigestorPBRSVG
                    copoAcoplado={copoAcoplado}
                    ligado={digestorLigado}
                    minutos={tempoDigestor}
                    pronto={digestorPronto}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Digestor</span>
                {digestorClicavel && <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique para ligar</span>}
                {digestorLigado && !digestorPronto && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚡ {String(tempoDigestor).padStart(2,'0')}:00</span>}
                {digestorPronto && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Extração concluída</span>}
              </div>

              {/* SACARÍMETRO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <ZonaDrop id="sacarimetro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}>
                  <div className={dropCls('sacarimetro')} style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '6px 8px' }}>
                    <SacarimetroSVG comAmostra={amostraNoSacarimetro} />
                  </div>
                </ZonaDrop>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Sacarímetro Digital</span>
                {amostraNoSacarimetro && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Amostra inserida</span>}
              </div>

            </div>{/* fim zona 1 */}


            {/* ══ ZONA 2: VIDRARIA ════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, alignItems: 'flex-end', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* PENEIRA / FUNIL DE TELA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="peneira" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={dropCls('peneira')}>
                    <PeneiraSVG filtrando={filtrandoPeneira} comFiltrado={extratoDisponivel} acoplada={!extratoDisponivel} />
                  </div>
                </ZonaDrop>
              </div>

              {/* COLETOR 400 mL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {coletorNaBalanca && !bagacoPesado ? (
                  /* Coletor está na balança — mostra fantasma */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.18 }}>
                    <ColetorPBRSVG nivel={0} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#57534e' }}>Coletor 400 mL</span>
                    <span style={{ fontSize: 8, color: '#57534e' }}>↑ Na balança</span>
                  </div>
                ) : (
                  <ItemBancada
                    id="coletor"
                    className={itemCls('coletor')}
                    draggable={coletorArrastavel}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <ColetorPBRSVG
                      nivel={bagacoPesado && !bagacoNoCopo ? 82 : 0}
                      cor="rgba(185,145,65,0.70)"
                      comBagaco={bagacoPesado && !bagacoNoCopo}
                    />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {coletorArrastavel ? '🖱️ ' : ''}Coletor 400 mL
                    </span>
                    <span style={{ fontSize: 8, color: (bagacoPesado && !bagacoNoCopo) ? '#fbbf24' : '#94a3b8' }}>
                      {(bagacoPesado && !bagacoNoCopo) ? '● 100 g bagaço' : 'Vazio'}
                    </span>
                  </ItemBancada>
                )}
              </div>

              {/* COPO DO DIGESTOR */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="copo-digestor" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {copoAcoplado && !digestorPronto ? (
                    <div style={{ opacity: 0.20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <CopoDigestorSVG nivel={nivelCopoDigestor} cor={corCopoDigestor} comBagaco={bagacoNoCopo} comAgua={aguaNoCopo} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#57534e' }}>Copo Digestor</span>
                      <span style={{ fontSize: 8, color: '#57534e' }}>↑ No digestor</span>
                    </div>
                  ) : (
                    <div
                      className={`item-drag ${itemCls('copo-digestor')} ${dropCls('copo-digestor')}`}
                      draggable={copoArrastavel}
                      onDragStart={() => handleDragStart('copo-digestor')}
                      onDragEnd={handleDragEnd}
                    >
                      <CopoDigestorSVG nivel={nivelCopoDigestor} cor={corCopoDigestor} comBagaco={bagacoNoCopo} comAgua={aguaNoCopo} />
                    </div>
                  )}
                  {!(copoAcoplado && !digestorPronto) && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {copoArrastavel ? '🖱️ ' : ''}Copo Digestor
                    </span>
                  )}
                </ZonaDrop>
              </div>

              {/* BÉQUER FILTRADO — sempre visível, desacopla da peneira ao terminar */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {extratoDisponivel ? (
                  <ItemBancada
                    id="bequer-filtrado"
                    className={itemCls('bequer-filtrado')}
                    draggable={bqFiltradoArrastavel}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <BequerSVG ml={400} nivel={nivelBqFiltrado} cor="rgba(180,220,195,0.55)" id="pbrbqf" />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {bqFiltradoArrastavel ? '🖱️ ' : ''}Béquer Filtrado
                    </span>
                    <span style={{ fontSize: 8, color: '#86efac', fontWeight: 700 }}>✓ ~400 mL extrato</span>
                  </ItemBancada>
                ) : (
                  /* Béquer acoplado na peneira — fantasma em col 4 */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.20 }}>
                    <BequerSVG ml={400} nivel={0} cor="rgba(180,220,195,0.55)" id="pbrbqfg" />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#57534e' }}>Béquer Filtrado</span>
                    <span style={{ fontSize: 8, color: '#57534e' }}>
                      {filtrandoPeneira ? '⏳ na peneira...' : 'acoplado'}
                    </span>
                  </div>
                )}
              </div>

              {/* BÉQUER 200 mL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="bequer-200" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('bequer-200')} ${dropCls('bequer-200')}`}
                    draggable={bq200Arrastavel}
                    onDragStart={() => handleDragStart('bequer-200')}
                    onDragEnd={handleDragEnd}
                    style={agitandoClarificante ? { animation: 'pbrAgitar 0.5s ease-in-out infinite', transformOrigin: 'center bottom' } : {}}
                  >
                    <BequerSVG ml={150} nivel={nivelBequer200} cor={corBequer200} id="pbrbq200" />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {bq200Arrastavel ? '🖱️ ' : ''}Béquer 200 mL
                  </span>
                  <span style={{ fontSize: 8, color: nivelBequer200 > 0 ? (clarificanteAdicionado ? '#86efac' : '#22d3ee') : '#94a3b8' }}>
                    {nivelBequer200 > 0
                      ? filtrandoPapel ? '⏳ Filtrando...'
                        : filtradoFinal ? '✓ Filtrado clarificado'
                        : clarificanteAdicionado ? '✓ Clarificado'
                        : agitandoClarificante ? '⚡ Agitando...'
                        : '● 200 mL extrato'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* BÉQUER LEITURA 200 mL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {filtradoFinal ? (
                  <ItemBancada
                    id="bequer-leitura"
                    className={itemCls('bequer-leitura')}
                    draggable={bqLeituraArrastavel}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <BequerSVG ml={150} nivel={nivelBqLeitura} cor="rgba(235,248,225,0.65)" id="pbrbqleit" />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {bqLeituraArrastavel ? '🖱️ ' : ''}Béquer Leitura
                    </span>
                    <span style={{ fontSize: 8, color: '#86efac', fontWeight: 700 }}>✓ filtrado clarificado</span>
                  </ItemBancada>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.22 }}>
                    <BequerSVG ml={150} nivel={0} cor="rgba(235,248,225,0.65)" id="pbrbqleitg" />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#57534e' }}>Béquer Leitura</span>
                    <span style={{ fontSize: 8, color: '#57534e' }}>
                      {filtrandoPapel ? '⏳ coletando...' : 'acoplado ao funil'}
                    </span>
                  </div>
                )}
              </div>

            </div>{/* fim zona 2 */}


            {/* ══ ZONA 3: REAGENTES + FERRAMENTAS ════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'flex-end' }}>

              {/* BAGAÇO DE CANA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada
                  id="bagaco"
                  className={itemCls('bagaco')}
                  draggable={etapaAtual === 1 && !pesando && !bagacoPesado}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div style={{ width: 54, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="54" height="76" viewBox="0 0 54 76">
                      {/* Sombra */}
                      <ellipse cx={27} cy={73} rx={21} ry={3} fill="rgba(0,0,0,0.20)" />

                      {/* Bandeja / recipiente */}
                      <rect x={5} y={50} width={44} height={20} rx="4" fill="#2e1504" stroke="#1c0d02" strokeWidth="1.2" />
                      <rect x={6} y={51} width={42} height={18} rx="3" fill="#5a3010" />
                      <rect x={7} y={52} width={40} height={16} rx="2" fill="#452408" />

                      {/* Base da pilha de bagaço */}
                      <path d="M 6,50 Q 4,34 8,22 Q 14,10 27,8 Q 40,10 46,22 Q 50,34 48,50 Z"
                        fill="#7a5018" />
                      {/* Camada superior mais clara */}
                      <path d="M 8,50 Q 7,36 10,24 Q 16,13 27,11 Q 38,13 44,24 Q 47,36 46,50 Z"
                        fill="#9a6820" />

                      {/* ── FIBRAS — camada inferior (y 42-50) ── */}
                      {[
                        [9,49, 20,47, '#c08828'],
                        [17,50, 29,48, '#d4a030'],
                        [25,48, 37,50, '#e8c868'],
                        [33,49, 44,47, '#c08828'],
                        [8,46,  18,44, '#a07020'],
                        [20,45, 32,47, '#e8c868'],
                        [36,46, 47,48, '#d4a030'],
                        [12,47, 22,45, '#b08424'],
                      ].map(([x1,y1,x2,y2,c],i) => (
                        <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={c} strokeWidth="2.0" strokeLinecap="round" />
                      ))}

                      {/* ── FIBRAS — camada média (y 30-42) ── */}
                      {[
                        [9,40,  22,36, '#d4a030'],
                        [15,37, 26,42, '#e8c868'],
                        [22,39, 34,35, '#c08828'],
                        [28,36, 40,40, '#a07020'],
                        [34,38, 46,34, '#d4a030'],
                        [7,34,  18,38, '#e8c868'],
                        [14,32, 26,36, '#c08828'],
                        [30,32, 38,36, '#d4a030'],
                        [40,34, 49,30, '#a07020'],
                        [18,40, 28,36, '#e8c868'],
                      ].map(([x1,y1,x2,y2,c],i) => (
                        <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={c} strokeWidth="1.8" strokeLinecap="round" />
                      ))}

                      {/* ── FIBRAS — camada superior (y 18-30) ── */}
                      {[
                        [11,28, 20,22, '#e8c868'],
                        [17,26, 28,30, '#d4a030'],
                        [22,24, 32,20, '#c08828'],
                        [28,22, 38,26, '#e8c868'],
                        [34,24, 44,28, '#d4a030'],
                        [9,22,  20,26, '#a07020'],
                        [15,20, 24,16, '#c08828'],
                        [24,18, 34,22, '#d4a030'],
                        [32,20, 40,16, '#e8c868'],
                        [38,22, 46,18, '#a07020'],
                        [20,28, 30,24, '#b08424'],
                      ].map(([x1,y1,x2,y2,c],i) => (
                        <line key={`u${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={c} strokeWidth="1.6" strokeLinecap="round" />
                      ))}

                      {/* ── FIBRAS — ponteiras projetando para cima ── */}
                      {[
                        [21,15, 17, 6, '#e8c868'],
                        [25,13, 24, 4, '#d4a030'],
                        [27,12, 27, 3, '#c08828'],
                        [30,13, 31, 4, '#e8c868'],
                        [34,15, 37, 6, '#d4a030'],
                        [19,17, 15, 9, '#a07020'],
                        [38,17, 42, 9, '#c08828'],
                        [23,14, 21, 5, '#b08424'],
                      ].map(([x1,y1,x2,y2,c],i) => (
                        <line key={`p${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity={0.88} />
                      ))}

                      {/* Labels na bandeja */}
                      <text x={27} y={62} textAnchor="middle" fontSize="6.5" fill="#fde68a"
                        fontFamily="monospace" fontWeight="700">BAGAÇO</text>
                      <text x={27} y={68} textAnchor="middle" fontSize="5.5" fill="#fbbf24"
                        fontFamily="monospace">100 g · cana</text>
                    </svg>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: bagacoPesado ? '#34d399' : '#e7e5e4' }}>
                    {etapaAtual === 1 ? '🖱️ ' : ''}Bagaço de Cana
                  </span>
                  <span style={{ fontSize: 7, color: bagacoPesado ? '#34d399' : '#94a3b8' }}>
                    {bagacoPesado ? '✓ Pesado' : 'desintegrado · homogeneizado'}
                  </span>
                </ItemBancada>
              </div>

              {/* ÁGUA DESMINERALIZADA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada
                  id="agua"
                  className={itemCls('agua')}
                  draggable={etapaAtual === 3 && !aguaNoCopo}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <FrascoReagente cor="rgba(140,200,240,0.82)" label="H₂O" sub="Desmineralizada" nivel={aguaNoCopo ? 55 : 80} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {etapaAtual === 3 ? '🖱️ ' : ''}Água Desm.
                  </span>
                  <span style={{ fontSize: 7, color: aguaNoCopo ? '#34d399' : '#94a3b8' }}>
                    {aguaNoCopo ? '✓ 1000 mL' : '1 L por análise'}
                  </span>
                </ItemBancada>
              </div>

              {/* MISTURA CLARIFICANTE */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="clarificante" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={dropCls('clarificante')}>
                    <FrascoReagente cor="rgba(240,230,200,0.82)" label="Clarificante" sub="Mistura" nivel={clarificanteAdicionado ? 62 : 78} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('clarificante') ? '🖱️ ' : ''}Clarificante
                  </span>
                  <span style={{ fontSize: 7, color: '#94a3b8' }}>~1 g / análise</span>
                </ZonaDrop>
              </div>

              {/* ESPÁTULA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada
                  id="espatula"
                  className={itemCls('espatula')}
                  draggable={espatulaArrastavel}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <EspatulaSVG espatulaComPo={espatulaComClarificante} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {espatulaArrastavel ? '🖱️ ' : ''}Espátula
                  </span>
                  <span style={{ fontSize: 7, color: espatulaComClarificante ? '#fbbf24' : '#94a3b8' }}>
                    {espatulaComClarificante ? '● com clarificante' : 'metálica'}
                  </span>
                </ItemBancada>
              </div>

              {/* FUNIL COM PAPEL FILTRO + BÉQUER 200mL ACOPLADO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="funil-papel" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={dropCls('funil-papel')}>
                    <svg width="80" height="185" viewBox="0 0 80 185">
                      {/* Label */}
                      <text x={40} y={6} textAnchor="middle" fontSize="5" fill="#94a3b8" fontFamily="monospace">Funil + Papel Filtro</text>
                      {/* Cone do funil */}
                      <path d="M 6,10 L 74,10 L 47,66 L 33,66 Z" fill="rgba(185,228,255,0.28)" stroke="#8ac4dc" strokeWidth="1.3" />
                      <ellipse cx={40} cy={10} rx={34} ry={5} fill="rgba(185,228,255,0.38)" stroke="#8ac4dc" strokeWidth="1.1" />
                      {/* Papel filtro */}
                      <path d="M 10,13 L 70,13 L 45,63 L 35,63 Z" fill="rgba(248,248,255,0.72)" stroke="rgba(180,180,200,0.50)" strokeWidth="0.8" />
                      <line x1={14} y1={16} x2={34} y2={60} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
                      {/* Haste */}
                      <rect x={37} y={66} width={6} height={22} rx="1.5" fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1" />
                      {/* Gotas caindo até o béquer */}
                      {filtrandoPapel && (
                        <ellipse cx={40} cy={92} rx={3} ry={4} fill="rgba(220,240,200,0.88)">
                          <animate attributeName="cy" from={88} to={136} dur="0.75s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="1" to="0" dur="0.75s" repeatCount="indefinite" />
                        </ellipse>
                      )}
                      {/* ── BÉQUER 200mL ACOPLADO (some ao liberar) ── */}
                      {!filtradoFinal && (
                        <g>
                          {/* Rim */}
                          <rect x={8} y={86} width={64} height={5} rx="2"
                            fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.1" />
                          {/* Corpo */}
                          <rect x={10} y={91} width={60} height={72} rx="2"
                            fill="rgba(185,228,255,0.16)" stroke="#8ac4dc" strokeWidth="1.3" />
                          {/* Reflexo vidro */}
                          <rect x={13} y={95} width={3} height={62} rx="1.5"
                            fill="rgba(255,255,255,0.28)" />
                          {/* Conteúdo coletando */}
                          {filtrandoPapel && (
                            <rect x={11} y={142} width={58} height={20} rx="1"
                              fill="rgba(220,245,210,0.35)" />
                          )}
                          {/* Graduações */}
                          <line x1={64} y1={108} x2={70} y2={108} stroke="rgba(6,32,85,0.40)" strokeWidth="0.8" />
                          <line x1={64} y1={126} x2={70} y2={126} stroke="rgba(6,32,85,0.40)" strokeWidth="0.8" />
                          <line x1={64} y1={144} x2={70} y2={144} stroke="rgba(6,32,85,0.40)" strokeWidth="0.8" />
                          {/* Rótulo do béquer */}
                          <rect x={18} y={144} width={44} height={11} rx="2"
                            fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />
                          <text x={40} y={152} textAnchor="middle" fontSize="5.5" fill="#0d2137" fontFamily="monospace" fontWeight="700">200 mL</text>
                          {/* Sombra */}
                          <ellipse cx={40} cy={164} rx={28} ry={3} fill="rgba(0,0,0,0.12)" />
                          <text x={40} y={178} textAnchor="middle" fontSize="5" fill="#64748b" fontFamily="monospace">
                            {filtrandoPapel ? '⏳ coletando...' : 'acoplado · vazio'}
                          </text>
                        </g>
                      )}
                      {/* Béquer liberado */}
                      {filtradoFinal && (
                        <text x={40} y={105} textAnchor="middle" fontSize="6" fill="#86efac" fontFamily="monospace">✓ béquer liberado</text>
                      )}
                    </svg>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>Funil Papel Filtro</span>
                  <span style={{ fontSize: 7, color: filtrandoPapel ? '#fbbf24' : filtradoFinal ? '#86efac' : '#94a3b8' }}>
                    {filtrandoPapel ? '⏳ filtrando...' : filtradoFinal ? '✓ béquer desacoplado' : 'despreze 10 mL'}
                  </span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona 3 */}

          </div>{/* fim pedra */}
        </div>{/* fim bancada */}

        {/* ── RODAPÉ DICA ── */}
        <div style={{ marginTop: 14, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.30)', borderRadius: 14, padding: '12px 20px', textAlign: 'center' }}>
          <p style={{ color: '#7dd3fc', fontWeight: 600, fontSize: 13, margin: 0 }}>
            💡 Arraste os itens piscando para os locais destacados em Azul!
          </p>
        </div>
      </LayoutSimulador>
    </div>
  );
};

export default PolBagaco;
