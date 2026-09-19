/**
 * ferroMk.jsx — Determinação de Ferro — Método Merck (Curva 966, Cubeta 50 mm)
 *
 * Curva: 966 · Cubeta: 50 mm · Unidade: mg/L Fe
 * Aplicável a: tanque desmineralizado, leito misto, condensado, vapor,
 *              permeado, alimentação de caldeira e descargas.
 *
 * Fluxo (12 etapas, 0‑11):
 *  0 — Selecionar Micropipeta P10000
 *  1 — Micropipeta → Amostra (aspirar 10 mL)
 *  2 — Micropipeta → Erlenmeyer 150 mL (dispensar)
 *  3 — Reagente Fe‑1 → Erlenmeyer (6 gotas)
 *  4 — Erlenmeyer → Chapa Aquecedora
 *  5 — Clicar Chapa (aquecer 10 min simulado + resfriamento automático)
 *  6 — Água Desmi → Cubeta Branco
 *  7 — Cubeta Branco → Fotômetro
 *  8 — Clicar ZERO (fotômetro)
 *  9 — Erlenmeyer → Cubeta (transferir amostra reagida)
 * 10 — Cubeta → Fotômetro
 * 11 — Clicar LER → resultado mg/L Fe
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ZonaDrop from '../components/lab/ZonaDrop';
import ErlenmeyerSVG from '../components/lab/ErlenmeyerSVG';
import CubetaSVG from '../components/lab/CubetaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';


/* ═══════════════════════════════════════════════════════════
   DADOS — 12 etapas do método Merck (Curva 966, Ferro)
═══════════════════════════════════════════════════════════ */
const etapas = [
  {
    id: 0,
    titulo: 'Selecionar a Micropipeta P10000',
    descricao: 'Clique na micropipeta P10000 para selecioná-la como instrumento ativo. Ela será usada para pipetar exatamente 10 mL de amostra.',
    item: null, alvo: null,
  },
  {
    id: 1,
    titulo: 'Aspirar 10 mL de Amostra',
    descricao: 'Arraste a micropipeta P10000 até o frasco de amostra para aspirar 10 mL (volume ajustado para 10.000 μL). Pressione o êmbolo até a primeira parada antes de mergulhar na amostra.',
    item: 'micropipeta', alvo: 'amostra',
  },
  {
    id: 2,
    titulo: 'Transferir Amostra para o Erlenmeyer 150 mL',
    descricao: 'Arraste a micropipeta com 10 mL de amostra até o Erlenmeyer de 150 mL para dispensar o volume. Pressione o êmbolo até a segunda parada para transferência completa.',
    item: 'micropipeta', alvo: 'erlenmeyer',
  },
  {
    id: 3,
    titulo: 'Adicionar Reagente Fe‑1 — 6 Gotas',
    descricao: 'Arraste o frasco conta-gotas do Reagente Fe‑1 até o Erlenmeyer de 150 mL para adicionar exatamente 6 gotas. Homogeneize suavemente com movimentos circulares após a adição.',
    item: 'reagente_fe1', alvo: 'erlenmeyer',
  },
  {
    id: 4,
    titulo: 'Levar o Erlenmeyer à Chapa Aquecedora',
    descricao: 'Arraste o Erlenmeyer com amostra e Reagente Fe‑1 até a chapa aquecedora. Posicione-o centralmente sobre a superfície aquecedora para aquecimento uniforme.',
    item: 'erlenmeyer', alvo: 'chapa',
  },
  {
    id: 5,
    titulo: 'Aquecer por 10 Minutos e Resfriar à Temperatura Ambiente',
    descricao: 'Clique na chapa aquecedora para iniciar o aquecimento suave por 10 minutos. Ao concluir, aguarde o resfriamento natural até temperatura ambiente antes de prosseguir com a leitura.',
    item: null, alvo: null,
  },
  {
    id: 6,
    titulo: 'Preparar Cubeta com Água Desmineralizada (Branco)',
    descricao: 'Arraste o frasco de água desmineralizada/ultrapura até a cubeta de 10 mL para preparar o branco de referência. Preencha até a linha de medição da cubeta.',
    item: 'agua_desmi', alvo: 'cubeta_branco',
  },
  {
    id: 7,
    titulo: 'Inserir Cubeta com Água no Fotômetro Merck',
    descricao: 'Arraste a cubeta com água desmineralizada até o compartimento do fotômetro Merck para inserção na posição de leitura. Será utilizada para zeragem na Curva 966, cubeta 50 mm.',
    item: 'cubeta_branco', alvo: 'fotometro',
  },
  {
    id: 8,
    titulo: 'Zerar o Fotômetro — Curva 966, Cubeta 50 mm',
    descricao: 'Clique em ZERO para zerar o fotômetro Merck com o branco de água desmineralizada. O equipamento selecionará automaticamente a Curva 966 e calibrará para leitura em cubeta 50 mm.',
    item: null, alvo: 'fotometro',
  },
  {
    id: 9,
    titulo: 'Transferir Amostra Reagida para a Cubeta de 10 mL',
    descricao: 'Arraste o Erlenmeyer com a amostra reagida (Fe‑1 + aquecimento) até a cubeta de 10 mL para transferir o volume de leitura. Certifique-se de que a solução está à temperatura ambiente.',
    item: 'erlenmeyer', alvo: 'cubeta',
  },
  {
    id: 10,
    titulo: 'Inserir Cubeta com Amostra no Fotômetro Merck',
    descricao: 'Arraste a cubeta com a amostra reagida até o compartimento do fotômetro Merck para realizar a leitura fotométrica. Curva 966 · Cubeta 50 mm.',
    item: 'cubeta', alvo: 'fotometro',
  },
  {
    id: 11,
    titulo: 'Realizar Leitura — Concentração de Ferro (mg/L Fe)',
    descricao: 'Clique em LER para realizar a leitura da concentração de Ferro pelo Método Merck (Curva 966, cubeta 50 mm). O resultado será exibido em mg/L Fe. Registre o valor para o boletim de análise.',
    item: null, alvo: 'fotometro',
  },
];


/* ═══════════════════════════════════════════════════════════
   CSS — animações
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes fmkDropFall {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:1; }
    65%  { transform:translateX(-50%) translateY(52px); opacity:.92; }
    100% { transform:translateX(-50%) translateY(72px); opacity:0;   }
  }
  @keyframes fmkDropFall2 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.85; }
    65%  { transform:translateX(-50%) translateY(48px); opacity:.76; }
    100% { transform:translateX(-50%) translateY(66px); opacity:0;   }
  }
  @keyframes fmkDropFall3 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.70; }
    65%  { transform:translateX(-50%) translateY(56px); opacity:.62; }
    100% { transform:translateX(-50%) translateY(76px); opacity:0;   }
  }
  @keyframes fmkDropFall4 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.55; }
    65%  { transform:translateX(-50%) translateY(44px); opacity:.48; }
    100% { transform:translateX(-50%) translateY(62px); opacity:0;   }
  }
  @keyframes fmkDropFall5 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.45; }
    65%  { transform:translateX(-50%) translateY(60px); opacity:.38; }
    100% { transform:translateX(-50%) translateY(80px); opacity:0;   }
  }
  @keyframes fmkDropFall6 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.38; }
    65%  { transform:translateX(-50%) translateY(50px); opacity:.30; }
    100% { transform:translateX(-50%) translateY(68px); opacity:0;   }
  }
  @keyframes fmkHeatPulse {
    0%,100% { opacity:.55; }
    50%     { opacity:1.00; }
  }
  @keyframes fmkTimerPulse {
    0%,100% { opacity:.62; }
    50%     { opacity:1.00; }
  }
`;

/* ── Gota de reagente Fe-1 (laranja-ferrugem) ── */
const GotaFe1 = ({ offsetX = 0, animName = 'fmkDropFall', delay = 0, animKey = 'g' }) => (
  <div key={animKey} style={{
    position:'absolute', left:`calc(50% + ${offsetX}px)`, top:4,
    width:10, height:24, opacity:0, pointerEvents:'none', zIndex:30,
    animationName:animName, animationDuration:'0.62s',
    animationDelay:`${delay}ms`, animationFillMode:'forwards',
    animationTimingFunction:'ease-in',
  }}>
    <svg width="10" height="24" viewBox="0 0 10 24">
      <line x1="5" y1="1" x2="5" y2="10"
        stroke="rgba(185,65,15,0.65)" strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <ellipse cx="5" cy="17" rx="4" ry="5.5" fill="rgba(210,80,25,0.92)"/>
      <ellipse cx="3.5" cy="14.5" rx="1.2" ry="1.8" fill="rgba(255,200,140,0.38)"/>
    </svg>
  </div>
);


/* ═══════════════════════════════════════════════════════════
   SVG — MICROPIPETA P10000
═══════════════════════════════════════════════════════════ */
const MicropipetaP10000SVG = ({ ativa = false, comAmostra = false }) => (
  <svg width="52" height="200" viewBox="0 0 52 200">
    <defs>
      <linearGradient id="fmkPipGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#7c2d12"/>
        <stop offset="48%"  stopColor="#c2410c"/>
        <stop offset="100%" stopColor="#7c2d12"/>
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="197" rx="12" ry="3" fill="rgba(0,0,0,0.20)"/>
    {/* plunger */}
    <rect x="19" y="1" width="14" height="25" rx="7"
      fill="#78716c" stroke="#57534e" strokeWidth="1"/>
    <rect x="21" y="3" width="10" height="5" rx="2.5" fill="rgba(255,255,255,0.24)"/>
    {/* corpo */}
    <rect x="14" y="22" width="24" height="90" rx="9"
      fill="url(#fmkPipGrad)" stroke="#7c2d12" strokeWidth="1.2"/>
    <rect x="15" y="24" width="5" height="82" rx="3" fill="rgba(255,255,255,0.09)"/>
    {/* janela de volume */}
    <rect x="17" y="32" width="18" height="18" rx="3"
      fill="rgba(0,0,0,0.48)" stroke="#334155" strokeWidth="0.8"/>
    <text x="26" y="43" textAnchor="middle" fontSize="6"
      fill="#fde68a" fontFamily="monospace" fontWeight="bold">10000</text>
    <text x="26" y="50" textAnchor="middle" fontSize="4.5"
      fill="#94a3b8" fontFamily="monospace">μL</text>
    <text x="26" y="62" textAnchor="middle" fontSize="6.5"
      fill="white" fontFamily="monospace" fontWeight="900">P10000</text>
    {[70,75,80,85,90,95].map(y => (
      <rect key={y} x="13" y={y} width="26" height="1.8" rx="0.9"
        fill="rgba(255,255,255,0.10)"/>
    ))}
    {/* botão eject */}
    <rect x="20" y="100" width="12" height="9" rx="3"
      fill="#ea580c" stroke="#c2410c" strokeWidth="0.8"/>
    <text x="26" y="106" textAnchor="middle" fontSize="4"
      fill="white" fontFamily="sans-serif">EJECT</text>
    {/* taper metálica */}
    <path d="M18,112 L21,145 L31,145 L34,112 Z" fill="#64748b" stroke="#475569" strokeWidth="1"/>
    <path d="M19,114 L21,138"
      stroke="rgba(255,255,255,0.17)" strokeWidth="1.1" strokeLinecap="round"/>
    {/* conector ponteira */}
    <path d="M22,145 L23,162 L29,162 L30,145 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8"/>
    {/* ponteira / tip */}
    {ativa ? (
      <g>
        <path d="M23,162 L24.5,196 L27.5,196 L29,162 Z"
          fill={comAmostra ? 'rgba(210,80,30,0.90)' : 'rgba(186,230,253,0.88)'}
          stroke={comAmostra ? '#ea580c' : '#7dd3fc'} strokeWidth="1"/>
        <path d="M23.5,162 L25,185"
          stroke="rgba(255,255,255,0.28)" strokeWidth="0.9" strokeLinecap="round"/>
        <ellipse cx="26" cy="162" rx="3" ry="1.2" fill="rgba(255,255,255,0.20)"/>
      </g>
    ) : (
      <g>
        <path d="M22,163 L22,166 L30,166 L30,163"
          fill="none" stroke="#4b5563" strokeWidth="0.8" strokeDasharray="2,1"/>
        <text x="26" y="175" textAnchor="middle" fontSize="4.5"
          fill="#4b5563" fontFamily="sans-serif">▼ clicar</text>
      </g>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG auxiliar — mini erlenmeyer para a chapa
═══════════════════════════════════════════════════════════ */
const MiniErlSVG = ({ cx, bottomY, cor, corBorda = 'rgba(255,255,255,0.28)' }) => {
  const bx = cx, by = bottomY;
  return (
    <g>
      <path
        d={`M ${bx-3},${by-32} L ${bx-3},${by-22} L ${bx-12},${by} Q ${bx-12},${by+3} ${bx},${by+3} Q ${bx+12},${by+3} ${bx+12},${by} L ${bx+3},${by-22} L ${bx+3},${by-32} Z`}
        fill={cor} stroke={corBorda} strokeWidth="1.2"/>
      <rect x={bx-3} y={by-43} width={6} height={13} rx={1}
        fill={cor} stroke={corBorda} strokeWidth="1.0"/>
      <rect x={bx-5} y={by-45} width={10} height={4} rx={1}
        fill={corBorda} opacity="0.85"/>
    </g>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — CHAPA AQUECEDORA (bancada · 1 erlenmeyer)
═══════════════════════════════════════════════════════════ */
const ChapaAquecedoraMkSVG = ({
  ativa = false, progresso = 0, resfriando = false,
  erlenmeyerNela = false, corErl = 'rgba(185,215,250,0.65)',
  podeClicar = false, onClick,
}) => (
  <svg width="210" height="144" viewBox="0 0 210 144"
    onClick={podeClicar ? onClick : undefined}
    style={{ cursor: podeClicar ? 'pointer' : 'default', userSelect:'none' }}>
    <defs>
      <linearGradient id="fmkChapaBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#374151"/>
        <stop offset="100%" stopColor="#111827"/>
      </linearGradient>
      <linearGradient id="fmkChapaSup" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"
          stopColor={ativa ? '#b45309' : resfriando ? '#1e3a5f' : '#292524'}/>
        <stop offset="100%"
          stopColor={ativa ? '#78350f' : resfriando ? '#0e1e30' : '#1c1917'}/>
      </linearGradient>
      <filter id="fmkChapaSh"><feDropShadow dx="2" dy="5" stdDeviation="5" floodOpacity=".38"/></filter>
    </defs>

    <ellipse cx="105" cy="140" rx="82" ry="5" fill="rgba(0,0,0,0.18)"/>

    {/* Corpo */}
    <g filter="url(#fmkChapaSh)">
      <rect x="6" y="62" width="198" height="70" rx="9"
        fill="url(#fmkChapaBase)" stroke="#111827" strokeWidth="2"/>
    </g>

    {/* Superfície aquecedora */}
    <rect x="10" y="48" width="190" height="20" rx="4"
      fill="url(#fmkChapaSup)" stroke="#111827" strokeWidth="1.5"/>

    {/* Bobinas */}
    {[0,1,2,3,4,5].map(i => (
      <line key={i} x1={18 + i * 32} y1={52} x2={18 + i * 32} y2={64}
        stroke={ativa ? 'rgba(251,146,60,0.55)' : 'rgba(87,83,78,0.40)'}
        strokeWidth={ativa ? 2.2 : 1.5} strokeLinecap="round"/>
    ))}

    {/* Glow aquecimento */}
    {ativa && (
      <rect x="10" y="48" width="190" height="20" rx="4"
        fill="rgba(234,88,12,0.22)"
        style={{ animation:'fmkHeatPulse 0.8s ease-in-out infinite' }}/>
    )}
    {resfriando && !ativa && (
      <rect x="10" y="48" width="190" height="20" rx="4"
        fill="rgba(100,180,234,0.10)"/>
    )}

    {/* Glow sob erlenmeyer quando ativa */}
    {ativa && erlenmeyerNela && (
      <ellipse cx="105" cy="52" rx="24" ry="6"
        fill="rgba(251,146,60,0.30)"
        style={{ animation:'fmkHeatPulse 0.65s ease-in-out infinite' }}/>
    )}

    {/* Mini erlenmeyer na superfície */}
    {erlenmeyerNela && (
      <MiniErlSVG cx={105} bottomY={48} cor={corErl}/>
    )}

    {/* Painel de controle */}
    <rect x="12" y="68" width="186" height="54" rx="6"
      fill="#0f172a" stroke="#334155" strokeWidth="1.0"/>

    {/* Display */}
    <rect x="16" y="72" width="120" height="42" rx="4"
      fill="#001428" stroke="#1e3a5f" strokeWidth="0.8"/>
    <text x="76" y="84" textAnchor="middle" fontSize="6.5"
      fill={ativa ? '#f59e0b' : resfriando ? '#60a5fa' : '#64748b'} fontFamily="monospace">
      {ativa ? 'DIGESTÃO BRANDA' : resfriando ? 'RESFRIANDO...' : erlenmeyerNela ? 'AGUARDANDO ⏻' : 'CHAPA AQUECEDORA'}
    </text>
    <text x="76" y="98" textAnchor="middle" fontSize="11.5"
      fontFamily="monospace" fontWeight="700"
      fill={ativa ? '#f59e0b' : resfriando ? '#93c5fd' : erlenmeyerNela ? '#fbbf24' : '#3b82f6'}>
      {ativa ? `${Math.floor(progresso)}%` : resfriando ? 'T°amb' : erlenmeyerNela ? 'PRONTO' : 'STAND BY'}
    </text>
    <text x="76" y="108" textAnchor="middle" fontSize="5.5"
      fill={ativa ? '#d97706' : '#475569'} fontFamily="monospace">
      {ativa ? 'Fe‑1 + 10 mL · 10 min'
        : resfriando ? 'Aguardar temperatura ambiente'
        : erlenmeyerNela ? 'Clique ⏻ para iniciar'
        : 'Aguardando Erlenmeyer'}
    </text>
    {ativa && (
      <>
        <rect x="20" y="111" width="112" height="5" rx="2.5" fill="rgba(255,255,255,0.08)"/>
        <rect x="20" y="111"
          width={Math.max(4, 112 * progresso / 100)} height="5" rx="2.5"
          fill="rgba(245,158,11,0.72)"/>
      </>
    )}

    {/* Botão ligar */}
    <circle cx="176" cy="94" r="17" fill="#1e293b" stroke="#334155" strokeWidth="1.5"/>
    <circle cx="176" cy="94" r="11"
      fill={ativa ? '#dc2626' : '#374151'}
      stroke={ativa ? '#b91c1c' : '#4b5563'} strokeWidth="1"/>
    {ativa && (
      <circle cx="176" cy="94" r="16" fill="none"
        stroke="rgba(220,38,38,0.42)" strokeWidth="2.5">
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite"/>
      </circle>
    )}
    {podeClicar && !ativa && (
      <circle cx="176" cy="94" r="16" fill="none"
        stroke="rgba(251,191,36,0.50)" strokeWidth="2.5">
        <animate attributeName="opacity" from="0.8" to="0.10" dur="0.85s" repeatCount="indefinite"/>
      </circle>
    )}
    <text x="176" y="97.5" textAnchor="middle" fontSize="10"
      fill="white" fontFamily="monospace">⏻</text>

    <text x="105" y="135" textAnchor="middle" fontSize="6"
      fill="#4b5563" fontFamily="monospace">
      Chapa Aquecedora · Digestão 10 min · Fe‑1
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — FOTÔMETRO MERCK SPECTROQUANT (Curva 966 · Fe · 50 mm)
═══════════════════════════════════════════════════════════ */
const FotometroFerroMkSVG = ({
  cubetaDentro = false, corCubeta = 'rgba(210,80,30,0.85)',
  zerando = false, zerado = false, lendo = false, resultado = null,
  zerAtivo = false, lerAtivo = false,
  onZero, onLer,
}) => (
  <svg width="230" height="200" viewBox="0 0 230 200">
    <defs>
      <linearGradient id="fmkSqBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#e8eaec"/>
        <stop offset="100%" stopColor="#cdd0d4"/>
      </linearGradient>
      <linearGradient id="fmkSqScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001a2c"/>
        <stop offset="100%" stopColor="#00101c"/>
      </linearGradient>
      <filter id="fmkSqSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".28"/></filter>
    </defs>

    <g filter="url(#fmkSqSh)">
      <rect x="4" y="4" width="222" height="192" rx="12"
        fill="url(#fmkSqBody)" stroke="#b0b5ba" strokeWidth="1.5"/>
    </g>

    {/* header Merck vermelho */}
    <rect x="4" y="4" width="222" height="28" rx="12" fill="#cc0033"/>
    <rect x="4" y="18" width="222" height="14" fill="#cc0033"/>
    <text x="70" y="17" textAnchor="middle" fontSize="10"
      fill="white" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="2">Merck</text>
    <text x="160" y="17" textAnchor="middle" fontSize="7.5"
      fill="rgba(255,255,255,0.85)" fontFamily="Arial,sans-serif" letterSpacing="1">Spectroquant®</text>
    <text x="113" y="26" textAnchor="middle" fontSize="6"
      fill="rgba(255,255,255,0.75)" fontFamily="Arial,sans-serif">Curva 966 · Fe · 50 mm</text>

    {/* Display */}
    <rect x="12" y="36" width="148" height="90" rx="6"
      fill="url(#fmkSqScr)" stroke="#004060" strokeWidth="1.2"/>
    <rect x="14" y="38" width="144" height="86" rx="5" fill="rgba(0,30,50,0.40)"/>

    {resultado !== null ? (
      <>
        <text x="86" y="55" textAnchor="middle" fontSize="7"
          fill="#ff8844" fontFamily="monospace">CURVA 966 · Fe · 50 mm</text>
        <line x1="18" y1="59" x2="154" y2="59" stroke="rgba(255,120,60,0.22)" strokeWidth="0.8"/>
        <text x="80" y="84" textAnchor="middle" fontSize="26"
          fill="#00ff88" fontFamily="'Courier New',monospace" fontWeight="700">{resultado}</text>
        <text x="150" y="84" textAnchor="end" fontSize="9" fill="#00cc66" fontFamily="monospace">mg/L</text>
        <text x="150" y="93" textAnchor="end" fontSize="7.5" fill="#00cc66" fontFamily="monospace">Fe</text>
        <text x="86" y="108" textAnchor="middle" fontSize="6.5"
          fill="#00aa88" fontFamily="monospace">✓ Leitura concluída · Curva 966</text>
        <text x="86" y="118" textAnchor="middle" fontSize="5.5"
          fill="#007744" fontFamily="sans-serif">Ferro Total · mg/L Fe</text>
      </>
    ) : lendo ? (
      <>
        <text x="86" y="58" textAnchor="middle" fontSize="7"
          fill="#ff8844" fontFamily="monospace">CURVA 966 · Fe · 50 mm</text>
        <text x="86" y="80" textAnchor="middle" fontSize="14"
          fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x="22" y="90" width="128" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="22" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="128" dur="2.5s" fill="freeze"/>
        </rect>
        <text x="86" y="110" textAnchor="middle" fontSize="6"
          fill="#78716c" fontFamily="monospace">Calculando concentração Fe...</text>
      </>
    ) : zerando ? (
      <>
        <text x="86" y="55" textAnchor="middle" fontSize="7"
          fill="#ff8844" fontFamily="monospace">CURVA 966</text>
        <text x="86" y="70" textAnchor="middle" fontSize="9"
          fill="#fbbf24" fontFamily="monospace">Zerando...</text>
        <rect x="22" y="79" width="128" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="22" y="79" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="128" dur="2s" fill="freeze"/>
        </rect>
        <text x="86" y="110" textAnchor="middle" fontSize="5.5"
          fill="#475569" fontFamily="monospace">Selecionando Curva 966 · 50 mm...</text>
      </>
    ) : zerado ? (
      <>
        <text x="86" y="55" textAnchor="middle" fontSize="7"
          fill="#ff8844" fontFamily="monospace">CURVA 966 ✓</text>
        <line x1="18" y1="59" x2="154" y2="59" stroke="rgba(255,120,60,0.22)" strokeWidth="0.8"/>
        <text x="86" y="78" textAnchor="middle" fontSize="11"
          fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
        <text x="86" y="92" textAnchor="middle" fontSize="7.5"
          fill="#60a5fa" fontFamily="monospace">0.000 mg/L Fe</text>
        <text x="86" y="106" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">Inserir cubeta da amostra</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="86" y="55" textAnchor="middle" fontSize="7"
          fill="#ff8844" fontFamily="monospace">CURVA 966</text>
        <text x="86" y="78" textAnchor="middle" fontSize="10"
          fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="86" y="93" textAnchor="middle" fontSize="7"
          fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="86" y="108" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">
          {zerAtivo ? 'Pressione ZERO' : lerAtivo ? 'Pressione LER' : 'Curva 966 · Fe · 50 mm'}
        </text>
      </>
    ) : (
      <>
        <text x="86" y="57" textAnchor="middle" fontSize="9"
          fill="#003c50" fontFamily="monospace">STANDBY</text>
        <text x="86" y="86" textAnchor="middle" fontSize="6.5"
          fill="#001a24" fontFamily="sans-serif">Aguardando cubeta...</text>
      </>
    )}

    {/* Compartimento da cubeta (50 mm) */}
    <rect x="168" y="36" width="58" height="90" rx="5"
      fill="#1a1a1a" stroke={cubetaDentro ? '#00cc66' : '#3a3a3a'} strokeWidth="1.5"/>
    <text x="197" y="52" textAnchor="middle" fontSize="5.5"
      fill="#4a4a4a" fontFamily="monospace">50 mm</text>
    {cubetaDentro ? (
      <g>
        <rect x="178" y="58" width="38" height="50" rx="2"
          fill={corCubeta} stroke="rgba(200,200,200,0.45)" strokeWidth="1"/>
        <rect x="180" y="60" width="6" height="42" fill="rgba(255,255,255,0.16)"/>
        <line x1="212" y1="66" x2="215" y2="66"
          stroke="rgba(200,200,200,0.65)" strokeWidth="1.2"/>
      </g>
    ) : (
      <rect x="178" y="58" width="38" height="50" rx="2"
        fill="rgba(5,12,25,0.60)" stroke="#1a1a1a" strokeWidth="0.8" strokeDasharray="4,2"/>
    )}
    <circle cx="163" cy="88" r="4"
      fill={cubetaDentro ? 'rgba(0,204,102,0.8)' : 'rgba(0,170,204,0.22)'}
      stroke="rgba(0,170,204,0.35)" strokeWidth="1"/>

    {/* Botões */}
    <rect x="12" y="133" width="212" height="52" rx="6"
      fill="#bfc2c6" stroke="#a0a5aa" strokeWidth="0.8"/>

    <g onClick={onZero} style={{ cursor: zerAtivo ? 'pointer' : 'default' }}>
      <rect x="20" y="140" width="60" height="20" rx="4"
        fill={zerAtivo ? '#0f4020' : '#6b7280'}
        stroke={zerAtivo ? '#00cc44' : '#4b5563'} strokeWidth={zerAtivo ? 1.8 : 1}/>
      {zerAtivo && (
        <rect x="20" y="140" width="60" height="20" rx="4"
          fill="none" stroke="rgba(0,204,80,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
      <text x="50" y="153" textAnchor="middle" fontSize="8"
        fill={zerAtivo ? '#00ff66' : '#d1d5db'} fontFamily="monospace"
        fontWeight={zerAtivo ? '700' : '400'}>ZERO</text>
    </g>

    <g onClick={onLer} style={{ cursor: lerAtivo ? 'pointer' : 'default' }}>
      <rect x="90" y="140" width="60" height="20" rx="4"
        fill={lerAtivo ? '#0f2a48' : '#6b7280'}
        stroke={lerAtivo ? '#00aacc' : '#4b5563'} strokeWidth={lerAtivo ? 1.8 : 1}/>
      {lerAtivo && (
        <rect x="90" y="140" width="60" height="20" rx="4"
          fill="none" stroke="rgba(0,170,204,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
      <text x="120" y="153" textAnchor="middle" fontSize="8"
        fill={lerAtivo ? '#00ddff' : '#d1d5db'} fontFamily="monospace"
        fontWeight={lerAtivo ? '700' : '400'}>LER</text>
    </g>

    <g>
      <rect x="160" y="140" width="60" height="20" rx="4"
        fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
      <text x="190" y="153" textAnchor="middle" fontSize="8"
        fill="#d1d5db" fontFamily="monospace">MENU</text>
    </g>

    <text x="113" y="178" textAnchor="middle" fontSize="6"
      fill="#6b7280" fontFamily="sans-serif">Spectroquant® · Merck KGaA</text>
    <text x="113" y="188" textAnchor="middle" fontSize="5.5"
      fill="#9ca3af" fontFamily="monospace">Curva 966 · Ferro Total · Cubeta 50 mm</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const FerroMk = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'fmk-anim-styles';
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
  } = useGameState(etapas.length); // 12 etapas

  // ── Fontes ────────────────────────────────────────────
  const [nivelAmostra,  setNivelAmostra]  = useState(82);
  const [nivelFe1,      setNivelFe1]      = useState(80);
  const [nivelAguaDesmi,setNivelAguaDesmi]= useState(82);

  // ── Micropipeta ───────────────────────────────────────
  const [micropipetaAtiva,     setMicropipetaAtiva]     = useState(false);
  const [micropipetaComAmostra,setMicropipetaComAmostra]= useState(false);

  // ── Erlenmeyer 150 mL ─────────────────────────────────
  const [nivelErlenmeyer, setNivelErlenmeyer] = useState(0);
  const [corErlenmeyer,   setCorErlenmeyer]   = useState('rgba(220,235,255,0.08)');
  const [erlenmeyerComAmostra, setErlenmeyerComAmostra] = useState(false);
  const [erlenmeyerComFe1,     setErlenmeyerComFe1]     = useState(false);
  const [erlenmeyerNaChapa,    setErlenmeyerNaChapa]    = useState(false);
  const [erlenmeyerResfriado,  setErlenmeyerResfriado]  = useState(false);

  // ── Animação gotas Fe-1 ───────────────────────────────
  const [mostrarGotasFe1, setMostrarGotasFe1] = useState(false);
  const [gotasKey,         setGotasKey]         = useState(0);

  // ── Chapa aquecedora ──────────────────────────────────
  const [aquecimentoAtivo,    setAquecimentoAtivo]    = useState(false);
  const [aquecimentoProgresso,setAquecimentoProgresso]= useState(0);
  const [resfriando,          setResfriando]          = useState(false);

  // ── Cubeta Branco ─────────────────────────────────────
  const [nivelCubetaBranco, setNivelCubetaBranco] = useState(0);
  const [cubetaBrancoPrep,  setCubetaBrancoPrep]  = useState(false);
  const [cubetaBrancoNoFoto,setCubetaBrancoNoFoto]= useState(false);

  // ── Cubeta Amostra ────────────────────────────────────
  const [nivelCubeta,   setNivelCubeta]   = useState(0);
  const [corCubeta,     setCorCubeta]     = useState('rgba(220,235,255,0.08)');
  const [cubetaComAmostra,setCubetaComAmostra]= useState(false);
  const [cubetaNoFoto,  setCubetaNoFoto]  = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [zerando,   setZerando]   = useState(false);
  const [zerado,    setZerado]    = useState(false);
  const [lendo,     setLendo]     = useState(false);
  const [resultado, setResultado] = useState(null);


  // ── TIMER: aquecimento (step 5) ───────────────────────
  useEffect(() => {
    if (!aquecimentoAtivo) return;
    setAquecimentoProgresso(0);
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 2, 100);
      setAquecimentoProgresso(p);
    }, 100); // 5 s simulando 10 min
    const id = setTimeout(() => {
      clearInterval(tick);
      setAquecimentoAtivo(false);
      setAquecimentoProgresso(100);
      setCorErlenmeyer('rgba(200,80,25,0.82)'); // mais laranja/ferrugem após digestão
      setResfriando(true);
      // Resfriamento: 1,8 s depois, libera o erlenmeyer
      const rid = setTimeout(() => {
        setResfriando(false);
        setErlenmeyerNaChapa(false);
        setErlenmeyerResfriado(true);
        celebrarAcerto(100);
        proximaEtapa(); // → step 6
      }, 1800);
      return () => clearTimeout(rid);
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [aquecimentoAtivo]);

  // ── Ocultar gotas Fe-1 após 2,2 s ────────────────────
  useEffect(() => {
    if (!mostrarGotasFe1) return;
    const id = setTimeout(() => setMostrarGotasFe1(false), 2200);
    return () => clearTimeout(id);
  }, [mostrarGotasFe1]);

  // ── Auto-conclusão (step 11, após leitura) ────────────
  useEffect(() => {
    if (etapaAtual !== 11 || !resultado) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2500);
    return () => clearTimeout(id);
  }, [resultado, etapaAtual]);


  // ── Helpers drag ─────────────────────────────────────
  const isAlvo  = (id) => etapas[etapaAtual]?.alvo === id;
  const isItem  = (id) => etapas[etapaAtual]?.item === id;
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';
  const itemCls = (id) => isItem(id) ? 'pulse-item'  : '';

  const handleDragStart = (item, e) => {
    if (!isItem(item)) { e.preventDefault(); return; }
    setItemSegurado(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item);
    if (IMAGEM_DRAG_VAZIA) e.dataTransfer.setDragImage(IMAGEM_DRAG_VAZIA, 0, 0);
    const rect = e.currentTarget.getBoundingClientRect();
    iniciarOverlayDrag(e.currentTarget, e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDragEnd   = () => { setItemSegurado(null); encerrarOverlayDrag(); };
  const handleDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDragEnter = (e) => { e.preventDefault(); };

  const handleDrop = (alvo, e) => {
    e.preventDefault();
    e.stopPropagation();
    encerrarOverlayDrag();
    const itemDrop = e.dataTransfer.getData('text/plain') || itemSegurado;
    if (!itemDrop) return;

    const etapa = etapas[etapaAtual];
    if (etapa && itemDrop === etapa.item && alvo !== etapa.alvo) {
      mostrarErroAcao('Este item não deve ser usado aqui neste momento.');
      setItemSegurado(null);
      return;
    }

    // E1 — MICROPIPETA → AMOSTRA
    if (itemDrop === 'micropipeta' && alvo === 'amostra' && etapaAtual === 1) {
      setItemSegurado(null);
      setMicropipetaComAmostra(true);
      setNivelAmostra(n => Math.max(n - 22, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E2 — MICROPIPETA → ERLENMEYER
    if (itemDrop === 'micropipeta' && alvo === 'erlenmeyer' && etapaAtual === 2) {
      setItemSegurado(null);
      setMicropipetaComAmostra(false);
      setNivelErlenmeyer(35);
      setCorErlenmeyer('rgba(185,215,250,0.65)');
      setErlenmeyerComAmostra(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — REAGENTE Fe-1 → ERLENMEYER (6 gotas)
    if (itemDrop === 'reagente_fe1' && alvo === 'erlenmeyer' && etapaAtual === 3) {
      setItemSegurado(null);
      setErlenmeyerComFe1(true);
      setGotasKey(k => k + 1);
      setMostrarGotasFe1(true);
      setNivelErlenmeyer(40);
      setCorErlenmeyer('rgba(210,100,35,0.70)');
      setNivelFe1(n => Math.max(n - 12, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — ERLENMEYER → CHAPA
    if (itemDrop === 'erlenmeyer' && alvo === 'chapa' && etapaAtual === 4) {
      setItemSegurado(null);
      setErlenmeyerNaChapa(true);
      celebrarAcerto(); proximaEtapa(); // → step 5
      return;
    }

    // E6 — ÁGUA → CUBETA BRANCO
    if (itemDrop === 'agua_desmi' && alvo === 'cubeta_branco' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelCubetaBranco(72);
      setCubetaBrancoPrep(true);
      setNivelAguaDesmi(n => Math.max(n - 15, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E7 — CUBETA BRANCO → FOTÔMETRO
    if (itemDrop === 'cubeta_branco' && alvo === 'fotometro' && etapaAtual === 7) {
      setItemSegurado(null);
      setCubetaBrancoNoFoto(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E9 — ERLENMEYER → CUBETA (amostra reagida)
    if (itemDrop === 'erlenmeyer' && alvo === 'cubeta' && etapaAtual === 9) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(210,85,28,0.84)');
      setCubetaComAmostra(true);
      setNivelErlenmeyer(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E10 — CUBETA → FOTÔMETRO
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && etapaAtual === 10) {
      setItemSegurado(null);
      setCubetaNoFoto(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }
  };


  // ── Click: selecionar micropipeta (step 0) ────────────
  const handleClicarMicropipeta = () => {
    if (etapaAtual !== 0 || micropipetaAtiva) return;
    setMicropipetaAtiva(true);
    celebrarAcerto(80); proximaEtapa();
  };

  // ── Click: ligar chapa (step 5) ───────────────────────
  const handleClicarChapa = () => {
    if (etapaAtual !== 5 || !erlenmeyerNaChapa || aquecimentoAtivo || resfriando) return;
    setAquecimentoAtivo(true);
  };

  // ── Click: ZERO fotômetro (step 8) ───────────────────
  const handleZerarFotometro = () => {
    if (etapaAtual !== 8 || !cubetaBrancoNoFoto || zerando || zerado) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaBrancoNoFoto(false);
      setNivelCubetaBranco(0);
      celebrarAcerto(150);
      proximaEtapa(); // → step 9
    }, 2200);
  };

  // ── Click: LER fotômetro (step 11) ───────────────────
  const handleLerFotometro = () => {
    if (etapaAtual !== 11 || !cubetaNoFoto || !zerado || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * 1.82 + 0.02).toFixed(3));
      setResultado(raw.toFixed(3));
      setLendo(false);
      celebrarAcerto(200);
    }, 2500);
  };


  // ── Derivados ─────────────────────────────────────────
  const micropipetaDrag = isItem('micropipeta') && micropipetaAtiva && (
    (etapaAtual === 1 && !micropipetaComAmostra) ||
    (etapaAtual === 2 && micropipetaComAmostra)
  );
  const erlenmeyerDrag = isItem('erlenmeyer') && (
    (etapaAtual === 4 && erlenmeyerComFe1 && !erlenmeyerNaChapa) ||
    (etapaAtual === 9 && erlenmeyerResfriado && nivelErlenmeyer > 0)
  );
  const cubetaBrancoDrag = isItem('cubeta_branco') && cubetaBrancoPrep && !cubetaBrancoNoFoto;
  const cubetaDrag       = isItem('cubeta') && cubetaComAmostra && !cubetaNoFoto;
  const zerAtivo         = etapaAtual === 8 && cubetaBrancoNoFoto && !zerando && !zerado;
  const lerAtivo         = etapaAtual === 11 && cubetaNoFoto && zerado && !lendo && !resultado;

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding:16, fontFamily:"'Segoe UI',sans-serif",
    }}>

      {/* ── OVERLAY PARABÉNS ── */}
      {mostrarParabens && (
        <div style={{ position:'fixed', top:18, right: 24, zIndex:60, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)', color:'white', padding:'20px 36px', borderRadius:22, boxShadow:'0 16px 40px rgba(0,0,0,0.35)', border:'2px solid rgba(255,255,255,0.9)', textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Star size={30} fill="currentColor"/>
              <div><h3 style={{ fontSize:22, fontWeight:900, margin:0 }}>Muito bem!</h3><p style={{ fontSize:15, margin:0 }}>+100 pontos</p></div>
              <CheckCircle size={30}/>
            </div>
          </div>
        </div>
      )}

      {/* ── OVERLAY ERRO ── */}
      {mostrarErroEtapa && (
        <div style={{ position:'fixed', top:18, left:'50%', transform:'translateX(-50%)', zIndex:70, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)', color:'white', padding:'14px 26px', borderRadius:16, boxShadow:'0 12px 30px rgba(0,0,0,0.35)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center', minWidth:280 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
              <span style={{ fontSize:20 }}>⚠️</span>
              <div><h3 style={{ fontSize:16, fontWeight:900, margin:0 }}>Ação incorreta</h3><p style={{ fontSize:12, margin:0 }}>{mensagemErroEtapa}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER AQUECIMENTO ── */}
      {(aquecimentoAtivo || resfriando) && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background: resfriando ? 'linear-gradient(135deg,#1e3a5f,#0e7490)' : 'linear-gradient(135deg,#78350f,#b45309,#d97706)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:16, fontWeight:900, animation: aquecimentoAtivo ? 'fmkTimerPulse 1s ease-in-out infinite' : 'none' }}>
              {resfriando ? '❄️ Resfriando até temperatura ambiente...' : '🔥 Digestão Branda — Reagente Fe‑1 (10 min)'}
            </div>
            {aquecimentoAtivo && (
              <>
                <div style={{ marginTop:8, height:7, background:'rgba(255,255,255,0.15)', borderRadius:5, overflow:'hidden', minWidth:240 }}>
                  <div style={{ height:'100%', width:`${aquecimentoProgresso}%`, background:'rgba(251,191,36,0.85)', borderRadius:5, transition:'width 0.1s linear' }}/>
                </div>
                <div style={{ fontSize:11, marginTop:4, color:'rgba(255,255,255,0.75)' }}>
                  {Math.floor(aquecimentoProgresso)}% · Curva 966 · Ferro Total
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── BANNER RESULTADO ── */}
      {resultado && etapaAtual >= 11 && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:900 }}>🟠 Leitura Concluída — Curva 966</div>
            <div style={{ fontSize:12, marginTop:4 }}>Ferro Total: <strong>{resultado} mg/L Fe</strong> · Cubeta 50 mm</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:70 }}>
          <div style={{ background:'linear-gradient(135deg,#0d1f35,#0a1628)', border:'2px solid #cc0033', borderRadius:24, padding:'44px 52px', textAlign:'center', color:'white', maxWidth:540, boxShadow:'0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ marginBottom:8 }}>
              <span style={{ fontSize:36, fontWeight:900, color:'#cc0033' }}>Merck</span><br/>
              <span style={{ fontSize:18, color:'#94a3b8' }}>Spectroquant®</span>
            </div>
            <h2 style={{ fontSize:26, fontWeight:900, color:'#fb923c', margin:'8px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color:'#64748b', fontSize:12, margin:'0 0 20px' }}>
              Ferro Total · Método Merck · Curva 966 · Cubeta 50 mm
            </p>
            <div style={{ background:'rgba(204,0,51,0.08)', border:'1px solid rgba(204,0,51,0.28)', borderRadius:14, padding:'14px 22px', marginBottom:14 }}>
              <div style={{ fontSize:10, color:'#94a3b8', marginBottom:8 }}>Dados da Análise</div>
              <div style={{ display:'flex', gap:18, justifyContent:'center', flexWrap:'wrap' }}>
                {[
                  { label:'Curva',      val:'966',             cor:'#cc0033' },
                  { label:'Kit',        val:'Merck Spectroquant', cor:'#f87171' },
                  { label:'Analito',    val:'Ferro Total (Fe)', cor:'#fb923c' },
                  { label:'Cubeta',     val:'50 mm',            cor:'#fbbf24' },
                  { label:'Vol. amostra', val:'10 mL',          cor:'#60a5fa' },
                  { label:'Reagente',   val:'Fe‑1 (6 gotas)',   cor:'#a78bfa' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'#94a3b8', marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(234,88,12,0.12)', border:'1px solid rgba(234,88,12,0.38)', borderRadius:14, padding:'18px 36px', marginBottom:14 }}>
              <div style={{ fontSize:13, color:'#94a3b8', marginBottom:6 }}>Resultado — Ferro Total</div>
              <div style={{ fontSize:52, fontWeight:900, color:'#ea580c', fontFamily:'monospace', lineHeight:1 }}>{resultado}</div>
              <div style={{ fontSize:14, color:'#fb923c', fontWeight:700, marginTop:4 }}>mg/L Fe</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'8px 14px', marginBottom:10, fontSize:9, color:'#64748b', textAlign:'left' }}>
              📋 <strong style={{ color:'#94a3b8' }}>Método:</strong> Merck Spectroquant · Curva 966 · Cubeta 50 mm · mg/L Fe<br/>
              🔬 <strong style={{ color:'#94a3b8' }}>Reagente:</strong> Fe‑1 (6 gotas) · Digestão branda 10 min<br/>
              📍 <strong style={{ color:'#94a3b8' }}>Aplicação:</strong> Tanque desmineralizado, leito misto, condensado, vapor, permeado, alimentação de caldeira e descargas.
            </div>
            <div style={{ fontSize:17, color:'#fbbf24', fontWeight:700, marginBottom:18 }}>🏆 Pontuação: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background:'linear-gradient(90deg,#cc0033,#991a2b)', color:'white', border:'none', borderRadius:11, padding:'12px 32px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
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
        titulo="Ferro Total — Método Merck (Curva 966)"
        subtitulo={"Fotômetro Merck Spectroquant® · Curva 966 · Cubeta 50 mm\nFerro Total · mg/L Fe"}
        icone="🟠"
        badges={['🔴 MERCK','⚗️ FOTOMETRIA']}
        footerLabel="🟠 Ferro Merck Curva 966"
      >
        <div style={{ background:'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius:26, padding:'22px 18px', border:'8px solid #8b6e45', boxShadow:'0 24px 80px rgba(0,0,0,0.6)', minWidth:960 }}>
          <h2 style={{ textAlign:'center', color:'#4a3010', fontSize:14, fontWeight:900, marginBottom:14, letterSpacing:0.6 }}>
            🟠 Bancada — Ferro Total · Método Merck Spectroquant (Curva 966, Cubeta 50 mm)
          </h2>

          <div style={{ background:'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius:20, padding:'18px 16px', border:'4px solid #292524', boxShadow:'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:12, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:12 }}>

              {/* ERLENMEYER 150 mL */}
              <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="erlenmeyer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('erlenmeyer')}`}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, position:'relative' }}>

                    {/* Gotas Fe-1 animadas */}
                    <div style={{ position:'relative', width:'100%', height:0, overflow:'visible' }}>
                      {mostrarGotasFe1 && (
                        <>
                          <GotaFe1 key={`gf1a-${gotasKey}`} offsetX={-15} animName="fmkDropFall"  delay={0}   animKey={`gf1a-${gotasKey}`}/>
                          <GotaFe1 key={`gf1b-${gotasKey}`} offsetX={-9}  animName="fmkDropFall2" delay={180} animKey={`gf1b-${gotasKey}`}/>
                          <GotaFe1 key={`gf1c-${gotasKey}`} offsetX={-3}  animName="fmkDropFall3" delay={360} animKey={`gf1c-${gotasKey}`}/>
                          <GotaFe1 key={`gf1d-${gotasKey}`} offsetX={3}   animName="fmkDropFall4" delay={540} animKey={`gf1d-${gotasKey}`}/>
                          <GotaFe1 key={`gf1e-${gotasKey}`} offsetX={9}   animName="fmkDropFall5" delay={720} animKey={`gf1e-${gotasKey}`}/>
                          <GotaFe1 key={`gf1f-${gotasKey}`} offsetX={15}  animName="fmkDropFall6" delay={900} animKey={`gf1f-${gotasKey}`}/>
                        </>
                      )}
                    </div>

                    <div
                      className={`item-drag ${itemCls('erlenmeyer')}`}
                      draggable={erlenmeyerDrag}
                      onDragStart={e => handleDragStart('erlenmeyer', e)}
                      onDragEnd={handleDragEnd}
                      style={{
                        cursor: erlenmeyerDrag ? 'grab' : 'default',
                        opacity: erlenmeyerNaChapa ? 0.15 : 1,
                        transition:'opacity 0.35s',
                      }}>
                      <ErlenmeyerSVG nivel={erlenmeyerNaChapa ? 0 : nivelErlenmeyer} cor={corErlenmeyer} id="fmk"/>
                    </div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {erlenmeyerDrag ? '🖱️ ' : ''}Erlenmeyer 150 mL
                  </span>
                  <span style={{ fontSize:8, color: erlenmeyerComFe1 ? '#fb923c' : erlenmeyerComAmostra ? '#3b82f6' : '#94a3b8' }}>
                    {erlenmeyerNaChapa         ? '🔥 Na chapa'
                      : erlenmeyerResfriado && nivelErlenmeyer === 0 ? '↗ Transferido'
                      : erlenmeyerResfriado    ? '✓ Resfriado — pronto'
                      : erlenmeyerComFe1       ? '🟠 Amostra + Fe‑1'
                      : erlenmeyerComAmostra   ? '💧 10 mL amostra'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CHAPA AQUECEDORA */}
              <div style={{ flex:2, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="chapa" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('chapa')}>
                    <ChapaAquecedoraMkSVG
                      ativa={aquecimentoAtivo}
                      progresso={aquecimentoProgresso}
                      resfriando={resfriando}
                      erlenmeyerNela={erlenmeyerNaChapa}
                      corErl={corErlenmeyer}
                      podeClicar={etapaAtual === 5 && erlenmeyerNaChapa && !aquecimentoAtivo && !resfriando}
                      onClick={handleClicarChapa}
                    />
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#a8a29e' }}>
                    {aquecimentoAtivo ? `⏱ Aquecendo ${Math.floor(aquecimentoProgresso)}%`
                      : resfriando ? '❄️ Resfriando...'
                      : erlenmeyerNaChapa ? '↑ Clique ⏻ para iniciar'
                      : 'Chapa Aquecedora'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA BRANCO */}
              <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cubeta_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('cubeta_branco')} ${itemCls('cubeta_branco')}`}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, opacity: cubetaBrancoNoFoto ? 0.18 : 1, transition:'opacity 0.3s' }}
                    draggable={cubetaBrancoDrag}
                    onDragStart={e => handleDragStart('cubeta_branco', e)} onDragEnd={handleDragEnd}>
                    <CubetaSVG cor="rgba(195,225,252,0.65)" nivel={nivelCubetaBranco} id="fmkb"/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cubetaBrancoDrag ? '🖱️ ' : ''}Cubeta (Branco)
                  </span>
                  <span style={{ fontSize:8, color: cubetaBrancoPrep ? '#34d399' : '#94a3b8' }}>
                    {zerado ? '✓ Usado (zero)' : cubetaBrancoPrep ? '💧 Água desmi' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA AMOSTRA */}
              <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('cubeta')} ${itemCls('cubeta')}`}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, opacity: cubetaNoFoto ? 0.18 : 1, transition:'opacity 0.3s' }}
                    draggable={cubetaDrag}
                    onDragStart={e => handleDragStart('cubeta', e)} onDragEnd={handleDragEnd}>
                    {cubetaNoFoto
                      ? <div style={{ width:80, height:110, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
                          <span style={{ fontSize:18 }}>✅</span>
                          <span style={{ fontSize:8, color:'#22c55e', fontWeight:700 }}>No fotômetro</span>
                        </div>
                      : <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="fmka"/>
                    }
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cubetaDrag ? '🖱️ ' : ''}Cubeta 50 mm
                  </span>
                  <span style={{ fontSize:8, color: nivelCubeta > 0 ? '#fb923c' : '#94a3b8' }}>
                    {nivelCubeta > 0 && !cubetaNoFoto ? '🟠 Amostra reagida' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* FOTÔMETRO MERCK */}
              <div style={{ flex:2.5, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('fotometro')} style={{ background:'rgba(255,255,255,0.06)', borderRadius:13, padding:'10px 12px' }}>
                    <FotometroFerroMkSVG
                      cubetaDentro={cubetaBrancoNoFoto || cubetaNoFoto}
                      corCubeta={cubetaBrancoNoFoto ? 'rgba(195,225,252,0.65)' : corCubeta}
                      zerando={zerando}
                      zerado={zerado && !cubetaNoFoto}
                      lendo={lendo}
                      resultado={resultado}
                      zerAtivo={zerAtivo}
                      lerAtivo={lerAtivo}
                      onZero={handleZerarFotometro}
                      onLer={handleLerFotometro}
                    />
                    {zerAtivo && <div style={{ textAlign:'center', fontSize:8, color:'#00cc44', fontWeight:700, marginTop:4 }}>🟢 Clique ZERO para calibrar!</div>}
                    {lerAtivo && <div style={{ textAlign:'center', fontSize:8, color:'#00ddff', fontWeight:700, marginTop:4 }}>🔵 Clique LER para a leitura!</div>}
                    {(zerando || lendo) && <div style={{ textAlign:'center', fontSize:8, color:'#fbbf24', fontWeight:700, marginTop:4 }}>⚡ Processando...</div>}
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Fotômetro Merck Spectroquant®</span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}


            {/* ══ ESTAÇÃO MICROPIPETA P10000 ═══════════════════════ */}
            <div style={{
              display:'flex', alignItems:'center', gap:20, justifyContent:'flex-start',
              padding:'10px 16px', marginBottom:12,
              background: etapaAtual >= 0 && etapaAtual <= 2 ? 'rgba(251,146,60,0.06)' : 'rgba(0,0,0,0.16)',
              borderRadius:14,
              border:`1px solid ${etapaAtual >= 0 && etapaAtual <= 2 ? 'rgba(251,146,60,0.30)' : 'rgba(255,255,255,0.05)'}`,
              transition:'all 0.4s',
              opacity: etapaAtual >= 0 && etapaAtual <= 2 ? 1 : 0.30,
            }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div
                  className={`item-drag ${itemCls('micropipeta')}`}
                  draggable={micropipetaDrag}
                  onDragStart={e => handleDragStart('micropipeta', e)}
                  onDragEnd={handleDragEnd}
                  onClick={handleClicarMicropipeta}
                  style={{
                    cursor: etapaAtual === 0 && !micropipetaAtiva ? 'pointer'
                      : micropipetaDrag ? 'grab' : 'default',
                  }}>
                  {etapaAtual === 0 && !micropipetaAtiva && (
                    <div style={{ position:'relative', display:'inline-block' }}>
                      <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', fontSize:8, color:'#fbbf24', fontWeight:700, whiteSpace:'nowrap', animation:'fmkTimerPulse 0.9s ease-in-out infinite' }}>
                        👆 Clique aqui
                      </div>
                    </div>
                  )}
                  <MicropipetaP10000SVG ativa={micropipetaAtiva} comAmostra={micropipetaComAmostra}/>
                </div>
                <span style={{ fontSize:8.5, fontWeight:700, color:'#e7e5e4' }}>
                  {micropipetaDrag ? '🖱️ ' : etapaAtual === 0 && !micropipetaAtiva ? '👆 ' : ''}Micropipeta P10000
                </span>
                <span style={{ fontSize:7.5, color: micropipetaComAmostra ? '#fb923c' : micropipetaAtiva ? '#fde68a' : '#6b7280' }}>
                  {micropipetaComAmostra ? '🟠 10 mL amostra' : micropipetaAtiva ? '✓ Selecionada' : 'Inativa'}
                </span>
              </div>

              <div style={{ fontSize:9, color:'#78716c', maxWidth:320, lineHeight:1.6 }}>
                <strong style={{ color:'#fde68a' }}>Micropipeta P10000</strong> · Volume: 10.000 μL (10 mL)<br/>
                Utilizada para pipetar a amostra com precisão.<br/>
                {etapaAtual === 0 && !micropipetaAtiva && (
                  <span style={{ color:'#fbbf24', fontWeight:700 }}>← Clique na micropipeta para selecioná-la</span>
                )}
              </div>
            </div>


            {/* ══ PAINEL CONFIRMAR SELEÇÃO (step 0) ══════════════ */}
            {etapaAtual === 0 && !micropipetaAtiva && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.28)', borderRadius:12, padding:'14px 18px', border:'1px solid rgba(234,88,12,0.35)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#fb923c', fontWeight:700 }}>🟠 Determinação de Ferro — Método Merck · Curva 966 · Cubeta 50 mm</div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:2 }}>
                    Aplicável a: tanque desmineralizado, leito misto, condensado, vapor, permeado, alimentação de caldeira e descargas.<br/>
                    Reagente: Fe‑1 (6 gotas) · Digestão branda 10 min · Leitura em mg/L Fe.
                  </div>
                </div>
                <button onClick={handleClicarMicropipeta}
                  style={{ background:'linear-gradient(90deg,#c2410c,#9a3412)', color:'white', border:'none', borderRadius:10, padding:'10px 22px', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(194,65,12,0.35)', whiteSpace:'nowrap' }}>
                  🔬 Selecionar Micropipeta
                </button>
              </div>
            )}

            {/* ══ PAINEL AQUECER (step 5) ════════════════════════ */}
            {etapaAtual === 5 && erlenmeyerNaChapa && !aquecimentoAtivo && !resfriando && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.28)', borderRadius:12, padding:'14px 18px', border:'1px solid rgba(245,158,11,0.40)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#fbbf24', fontWeight:700 }}>🔥 Aquecer por 10 Minutos — Digestão Branda</div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:2 }}>
                    O erlenmeyer com amostra + Fe‑1 está posicionado na chapa. Clique na chapa aquecedora ou no botão ao lado para iniciar a digestão branda.
                  </div>
                </div>
                <button onClick={handleClicarChapa}
                  style={{ background:'linear-gradient(90deg,#b45309,#92400e)', color:'white', border:'none', borderRadius:10, padding:'10px 22px', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(180,83,9,0.35)', whiteSpace:'nowrap' }}>
                  🔥 Iniciar Aquecimento
                </button>
              </div>
            )}


            {/* ══ PAINEL TIMERS AQUECIMENTO (step 5 ativo) ═══════ */}
            {aquecimentoAtivo && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.30)', borderRadius:12, padding:'12px 18px', border:'1px solid rgba(245,158,11,0.40)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#fbbf24', fontWeight:700, animation:'fmkTimerPulse 1s ease-in-out infinite' }}>
                    🔥 Digestão Branda em Andamento — 10 min (Fe‑1 + amostra)
                  </div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:2 }}>
                    Aguarde a conclusão do aquecimento. Após o timer, a amostra resfriará automaticamente antes de prosseguir.
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:16, fontWeight:900, color:'#f59e0b', fontFamily:'monospace' }}>
                    {Math.floor(aquecimentoProgresso)}%
                  </div>
                  <div style={{ marginTop:4, width:120, height:5, background:'rgba(255,255,255,0.12)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${aquecimentoProgresso}%`, background:'rgba(245,158,11,0.80)', borderRadius:3, transition:'width 0.1s linear' }}/>
                  </div>
                </div>
              </div>
            )}


            {/* ══ ZONA INFERIOR: REAGENTES ═══════════════════════════ */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, alignItems:'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`item-drag ${itemCls('amostra')} ${dropCls('amostra')}`}
                    style={{ cursor: 'default', pointerEvents:'none' }}>
                    <FrascoReagente cor="rgba(210,195,148,0.82)" label="Amostra" sub="Água" nivel={nivelAmostra}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Frasco de Amostra</span>
                  <span style={{ fontSize:8, color:'#94a3b8' }}>10 mL → Erlenmeyer</span>
                </ZonaDrop>
              </div>

              {/* REAGENTE Fe-1 */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('reagente_fe1')}`}
                    draggable={isItem('reagente_fe1')}
                    onDragStart={e => handleDragStart('reagente_fe1', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: isItem('reagente_fe1') ? 'grab' : 'default' }}>
                    <FrascoReagente cor="rgba(210,80,25,0.82)" label="Fe‑1" sub="conta-gotas" nivel={nivelFe1}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {isItem('reagente_fe1') ? '🖱️ ' : ''}Reagente Fe‑1
                  </span>
                  <span style={{ fontSize:8, color: erlenmeyerComFe1 ? '#fb923c' : '#94a3b8' }}>
                    {erlenmeyerComFe1 ? '✓ 6 gotas adicionadas' : '6 gotas → Erlenmeyer'}
                  </span>
                </div>
              </div>

              {/* ÁGUA DESMINERALIZADA */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('agua_desmi')}`}
                    draggable={isItem('agua_desmi')}
                    onDragStart={e => handleDragStart('agua_desmi', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: isItem('agua_desmi') ? 'grab' : 'default' }}>
                    <FrascoReagente cor="rgba(200,232,255,0.82)" label="H₂O Desmi" sub="ultrapura" nivel={nivelAguaDesmi}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {isItem('agua_desmi') ? '🖱️ ' : ''}Água Desmineralizada
                  </span>
                  <span style={{ fontSize:8, color: cubetaBrancoPrep ? '#34d399' : '#94a3b8' }}>
                    {cubetaBrancoPrep ? '✓ Cubeta branco pronta' : 'Branco → Cubeta 50 mm'}
                  </span>
                </div>
              </div>

            </div>{/* fim zona inferior */}

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

export default FerroMk;
