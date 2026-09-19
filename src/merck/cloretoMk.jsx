/**
 * cloretoMk.jsx — Determinação de Cloreto — Kit Merck Spectroquant 114897
 *
 * Faixa: 2,5 – 250,0 mg/L Cl⁻
 * Reagentes: Cl-1 (2,5 mL) · Cl-2 (0,50 mL)
 * Fotômetro: Merck Spectroquant Prove 300
 *
 * Fluxo (12 etapas, 0‑11):
 *  0  — Verificar pH da Amostra (faixa aceitável: pH 1–12)
 *  1  — Selecionar Micropipeta P1000
 *  2  — Micropipeta → Amostra (aspirar 5,0 mL)
 *  3  — Micropipeta → Béquer 250 mL (dispensar 5,0 mL)
 *  4  — Micropipeta → Cl-1 (aspirar 2,5 mL)
 *  5  — Micropipeta → Béquer (adicionar Cl-1)
 *  6  — Micropipeta → Cl-2 (aspirar 0,50 mL)
 *  7  — Micropipeta → Béquer (adicionar Cl-2 + timer 1 min simulado)
 *  8  — Béquer → Cubeta 10 mL (transferir solução reagida)
 *  9  — Célula cilíndrica preta → Fotômetro (reconhecer kit 114897)
 * 10  — Cubeta → Fotômetro (inserir amostra)
 * 11  — Clicar LER → resultado mg/L Cl⁻
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ZonaDrop from '../components/lab/ZonaDrop';
import CubetaSVG from '../components/lab/CubetaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';


/* ═══════════════════════════════════════════════════════════
   DADOS — 11 etapas do método (Cloreto, Kit 114897)
═══════════════════════════════════════════════════════════ */
const etapas = [
  {
    id: 0,
    titulo: 'Verificar pH da Amostra (pH 1–12)',
    descricao: 'Verifique o pH da amostra antes de iniciar a análise de cloreto. A faixa aceitável para este método é pH 1–12. Caso esteja fora da faixa, ajuste a amostra antes de prosseguir.',
    item: null, alvo: null,
  },
  {
    id: 1,
    titulo: 'Selecionar a Micropipeta P1000',
    descricao: 'Clique na micropipeta P1000 para selecioná-la. Ela será usada para pipetar os volumes de amostra e reagentes com precisão de 0,01 mL.',
    item: null, alvo: null,
  },
  {
    id: 2,
    titulo: 'Aspirar 5,0 mL de Amostra',
    descricao: 'Arraste a micropipeta P1000 até o frasco de amostra para aspirar exatamente 5,0 mL. Pressione o êmbolo até a primeira parada antes de mergulhar na amostra.',
    item: 'micropipeta', alvo: 'amostra',
  },
  {
    id: 3,
    titulo: 'Transferir 5,0 mL para o Béquer de 250 mL',
    descricao: 'Arraste a micropipeta com 5,0 mL de amostra até o béquer de 250 mL para dispensar o volume. Pressione o êmbolo até a segunda parada para transferência completa.',
    item: 'micropipeta', alvo: 'bequer',
  },
  {
    id: 4,
    titulo: 'Aspirar 2,5 mL do Reagente Cl-1',
    descricao: 'Arraste a micropipeta até o frasco do Reagente Cl-1 para aspirar 2,5 mL. O Reagente Cl-1 contém a solução de tiocianato de mercúrio necessária para o desenvolvimento de cor.',
    item: 'micropipeta', alvo: 'cl1',
  },
  {
    id: 5,
    titulo: 'Adicionar 2,5 mL de Cl-1 ao Béquer — Misturar',
    descricao: 'Arraste a micropipeta com 2,5 mL de Cl-1 até o béquer de 250 mL para dispensar e misturar. Agite suavemente após a adição para homogeneização completa.',
    item: 'micropipeta', alvo: 'bequer',
  },
  {
    id: 6,
    titulo: 'Aspirar 0,50 mL do Reagente Cl-2',
    descricao: 'Arraste a micropipeta até o frasco do Reagente Cl-2 para aspirar 0,50 mL. O Reagente Cl-2 contém nitrato férrico amoniacal para completar o desenvolvimento de cor.',
    item: 'micropipeta', alvo: 'cl2',
  },
  {
    id: 7,
    titulo: 'Adicionar Cl-2, Agitar e Aguardar 1 Minuto de Reação',
    descricao: 'Arraste a micropipeta com Cl-2 até o béquer. Após a adição, o sistema simulará agitação e iniciará automaticamente o timer de 1 minuto de reação para desenvolvimento total da cor (vermelho-alaranjado).',
    item: 'micropipeta', alvo: 'bequer',
  },
  {
    id: 8,
    titulo: 'Transferir Solução do Béquer para a Cubeta de 10 mL',
    descricao: 'Arraste o béquer de 250 mL até a cubeta de 10 mL para transferir a solução reagida. Preencha até a linha de marcação da cubeta para garantir volume correto de leitura.',
    item: 'bequer', alvo: 'cubeta',
  },
  {
    id: 9,
    titulo: 'Reconhecer o Kit 114897 no Fotômetro Merck',
    descricao: 'Arraste a célula cilíndrica preta (célula de reconhecimento do kit) até o fotômetro Merck Spectroquant Prove 300. O equipamento lerá o código do kit e ajustará automaticamente a curva de calibração para cloreto.',
    item: 'celula_preta', alvo: 'fotometro',
  },
  {
    id: 10,
    titulo: 'Inserir Cubeta com Amostra Reagida no Fotômetro',
    descricao: 'Arraste a cubeta com a solução reagida de cloreto até o compartimento de leitura do fotômetro Merck. Alinhe a marca da cubeta com a marca do compartimento para leitura precisa.',
    item: 'cubeta', alvo: 'fotometro',
  },
  {
    id: 11,
    titulo: 'Realizar Leitura — Concentração de Cloreto (mg/L Cl⁻)',
    descricao: 'Clique em LER no fotômetro Merck para obter a concentração de cloreto. O Prove 300 utilizará a curva 114897 e exibirá o resultado em mg/L Cl⁻. Registre o valor para o boletim de análise.',
    item: null, alvo: 'fotometro',
  },
];


/* ═══════════════════════════════════════════════════════════
   CSS — animações (prefixo cmk)
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes cmkDropFall {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:1; }
    65%  { transform:translateX(-50%) translateY(52px); opacity:.90; }
    100% { transform:translateX(-50%) translateY(72px); opacity:0;   }
  }
  @keyframes cmkDropFall2 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.80; }
    65%  { transform:translateX(-50%) translateY(46px); opacity:.70; }
    100% { transform:translateX(-50%) translateY(65px); opacity:0;   }
  }
  @keyframes cmkDropFall3 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.65; }
    65%  { transform:translateX(-50%) translateY(58px); opacity:.55; }
    100% { transform:translateX(-50%) translateY(76px); opacity:0;   }
  }
  @keyframes cmkDropFall4 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.48; }
    65%  { transform:translateX(-50%) translateY(42px); opacity:.40; }
    100% { transform:translateX(-50%) translateY(60px); opacity:0;   }
  }
  @keyframes cmkShake {
    0%,100% { transform: rotate(0deg); }
    18%     { transform: rotate(-6deg); }
    36%     { transform: rotate(6deg);  }
    54%     { transform: rotate(-4deg); }
    72%     { transform: rotate(4deg);  }
  }
  @keyframes cmkTimerPulse {
    0%,100% { opacity:.60; }
    50%     { opacity:1.00; }
  }
  @keyframes cmkGlow {
    0%,100% { opacity:.50; }
    50%     { opacity:.95; }
  }
`;

/* ── Gota de reagente genérica ── */
const GotaReagente = ({ offsetX = 0, animName = 'cmkDropFall', delay = 0, animKey = 'g', cor = 'rgba(200,200,200,0.90)' }) => (
  <div key={animKey} style={{
    position:'absolute', left:`calc(50% + ${offsetX}px)`, top:4,
    width:10, height:24, opacity:0, pointerEvents:'none', zIndex:30,
    animationName:animName, animationDuration:'0.60s',
    animationDelay:`${delay}ms`, animationFillMode:'forwards',
    animationTimingFunction:'ease-in',
  }}>
    <svg width="10" height="24" viewBox="0 0 10 24">
      <line x1="5" y1="1" x2="5" y2="10" stroke={cor} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <ellipse cx="5" cy="17" rx="4" ry="5.5" fill={cor}/>
      <ellipse cx="3.5" cy="14.5" rx="1.2" ry="1.8" fill="rgba(255,255,255,0.32)"/>
    </svg>
  </div>
);


/* ═══════════════════════════════════════════════════════════
   SVG — MICROPIPETA P1000
═══════════════════════════════════════════════════════════ */
const MicropipetaP1000SVG = ({ ativa = false, conteudo = null }) => {
  const corConteudo =
    conteudo === 'amostra' ? 'rgba(195,220,255,0.88)'
    : conteudo === 'cl1'   ? 'rgba(255,215,100,0.88)'
    : conteudo === 'cl2'   ? 'rgba(120,200,120,0.88)'
    : 'rgba(186,230,253,0.88)';

  return (
    <svg width="46" height="180" viewBox="0 0 46 180">
      <defs>
        <linearGradient id="cmkPipGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1a4d7a"/>
          <stop offset="48%"  stopColor="#2563a8"/>
          <stop offset="100%" stopColor="#1a4d7a"/>
        </linearGradient>
      </defs>
      <ellipse cx="23" cy="177" rx="10" ry="2.5" fill="rgba(0,0,0,0.18)"/>
      {/* plunger */}
      <rect x="17" y="1" width="12" height="22" rx="6"
        fill="#64748b" stroke="#475569" strokeWidth="1"/>
      <rect x="18" y="3" width="8" height="4" rx="2" fill="rgba(255,255,255,0.22)"/>
      {/* corpo */}
      <rect x="12" y="20" width="22" height="80" rx="8"
        fill="url(#cmkPipGrad)" stroke="#1e4a8a" strokeWidth="1.2"/>
      <rect x="13" y="22" width="4" height="72" rx="2.5" fill="rgba(255,255,255,0.09)"/>
      {/* janela volume */}
      <rect x="15" y="28" width="16" height="15" rx="3"
        fill="rgba(0,0,0,0.48)" stroke="#1e3a5f" strokeWidth="0.8"/>
      <text x="23" y="37.5" textAnchor="middle" fontSize="5.5"
        fill="#fde68a" fontFamily="monospace" fontWeight="bold">1000</text>
      <text x="23" y="43" textAnchor="middle" fontSize="4"
        fill="#94a3b8" fontFamily="monospace">μL</text>
      <text x="23" y="55" textAnchor="middle" fontSize="6"
        fill="white" fontFamily="monospace" fontWeight="900">P1000</text>
      {[62,67,72,77,82,87].map(y => (
        <rect key={y} x="11" y={y} width="24" height="1.6" rx="0.8"
          fill="rgba(255,255,255,0.10)"/>
      ))}
      {/* botão eject */}
      <rect x="17" y="92" width="12" height="8" rx="3"
        fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8"/>
      <text x="23" y="98" textAnchor="middle" fontSize="3.5"
        fill="white" fontFamily="sans-serif">EJECT</text>
      {/* taper */}
      <path d="M16,100 L18,130 L28,130 L30,100 Z" fill="#64748b" stroke="#475569" strokeWidth="1"/>
      <path d="M17,102 L18,124"
        stroke="rgba(255,255,255,0.16)" strokeWidth="1" strokeLinecap="round"/>
      {/* conector */}
      <path d="M19,130 L20,144 L26,144 L27,130 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8"/>
      {/* tip */}
      {ativa ? (
        <g>
          <path d="M20,144 L21.5,177 L24.5,177 L26,144 Z"
            fill={corConteudo}
            stroke="rgba(100,150,220,0.70)" strokeWidth="1"/>
          <path d="M20.5,144 L22,168"
            stroke="rgba(255,255,255,0.26)" strokeWidth="0.8" strokeLinecap="round"/>
          <ellipse cx="23" cy="144" rx="3" ry="1.0" fill="rgba(255,255,255,0.18)"/>
        </g>
      ) : (
        <g>
          <path d="M19,145 L19,148 L27,148 L27,145"
            fill="none" stroke="#4b5563" strokeWidth="0.8" strokeDasharray="2,1"/>
          <text x="23" y="158" textAnchor="middle" fontSize="4"
            fill="#4b5563" fontFamily="sans-serif">▼ clicar</text>
        </g>
      )}
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — BÉQUER 250 mL
═══════════════════════════════════════════════════════════ */
const BequerSVG = ({ nivel = 0, cor = 'rgba(220,235,255,0.08)', agitando = false }) => {
  const W = 72, H = 90, wall = 3.5;
  const iW = W - wall * 2, iH = H - wall * 2 - 4;
  const lH = (nivel / 100) * iH;
  const lY = wall + iH - lH + 4;

  return (
    <svg width="100" height="130" viewBox="0 0 100 130"
      style={agitando ? { animation:'cmkShake 0.55s ease-in-out 3' } : {}}>
      <defs>
        <linearGradient id="cmkBeqGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.50)"/>
          <stop offset="22%"  stopColor="rgba(215,238,255,0.12)"/>
          <stop offset="75%"  stopColor="rgba(210,235,255,0.06)"/>
          <stop offset="100%" stopColor="rgba(170,215,252,0.38)"/>
        </linearGradient>
        <clipPath id="cmkBeqClip">
          <rect x={wall} y={wall + 4} width={iW} height={iH} rx="1"/>
        </clipPath>
        <filter id="cmkBeqSh"><feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity=".22"/></filter>
      </defs>
      <g transform="translate(14,8)">
        <ellipse cx={W/2} cy={H+8} rx={W/2-5} ry={4} fill="rgba(0,0,0,0.16)"/>

        {/* líquido */}
        <g clipPath="url(#cmkBeqClip)">
          {nivel > 0 && (
            <>
              <rect x={wall} y={lY} width={iW} height={lH + 2} fill={cor}/>
              {/* ondinha superfície */}
              {nivel > 5 && (
                <ellipse cx={W/2} cy={lY + 1} rx={iW/2 - 1} ry={2.5}
                  fill="rgba(255,255,255,0.18)"/>
              )}
            </>
          )}
        </g>

        {/* corpo vidro */}
        <g filter="url(#cmkBeqSh)">
          <rect x="0" y="4" width={W} height={H} rx="3"
            fill="url(#cmkBeqGlass)" stroke="#8ac4dc" strokeWidth="1.8"/>
        </g>

        {/* borda/aba superior */}
        <rect x="-2" y="1" width={W+4} height="6" rx="3"
          fill="rgba(165,210,240,0.28)" stroke="#9ab8d0" strokeWidth="1.1"/>

        {/* bico de despejo */}
        <path d={`M${W-4},1 Q${W+6},-5 ${W+8},1 L${W},7 Z`}
          fill="rgba(165,210,240,0.40)" stroke="#9ab8d0" strokeWidth="1"/>

        {/* marcações de volume */}
        {[20,40,60,80].map((pct, i) => {
          const y = wall + 4 + iH - (pct / 100) * iH;
          const vl = Math.round(pct * 2.5); // 250 mL scale
          return (
            <g key={i}>
              <line x1={W-14} y1={y} x2={W-3} y2={y}
                stroke="rgba(100,160,200,0.55)" strokeWidth="1"/>
              <text x={W-16} y={y+2} textAnchor="end" fontSize="5.5"
                fill="rgba(80,140,190,0.70)" fontFamily="monospace">{vl}</text>
            </g>
          );
        })}

        {/* reflexo */}
        <rect x="4" y="6" width="4" height={H-8} rx="2" fill="rgba(255,255,255,0.24)"/>

        {/* label */}
        <rect x={W/2-16} y={H-22} width={32} height={14} rx="3"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7"/>
        <text x={W/2} y={H-13} textAnchor="middle" fontSize="5.5"
          fill="#0d2137" fontFamily="monospace" fontWeight="700">250 mL</text>
        <text x={W/2} y={H-7} textAnchor="middle" fontSize="4.5"
          fill="#1a3a5e" fontFamily="sans-serif">Béquer</text>
      </g>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — CÉLULA CILÍNDRICA PRETA (reconhecimento de kit)
═══════════════════════════════════════════════════════════ */
const CelulaCilindricaSVG = ({ reconhecida = false, pulsando = false }) => (
  <svg width="56" height="110" viewBox="0 0 56 110">
    <defs>
      <linearGradient id="cmkCelGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#1a1a1a"/>
        <stop offset="40%"  stopColor="#2d2d2d"/>
        <stop offset="100%" stopColor="#111111"/>
      </linearGradient>
    </defs>
    <ellipse cx="28" cy="107" rx="16" ry="3.5" fill="rgba(0,0,0,0.22)"/>

    {/* corpo cilíndrico */}
    <ellipse cx="28" cy="18" rx="18" ry="5" fill="#1a1a1a" stroke="#333" strokeWidth="1.2"/>
    <rect x="10" y="18" width="36" height="80" fill="url(#cmkCelGrad)" stroke="#222" strokeWidth="1.2"/>
    <ellipse cx="28" cy="98" rx="18" ry="5" fill="#111" stroke="#222" strokeWidth="1.2"/>

    {/* reflexo lateral */}
    <rect x="11" y="20" width="4" height="72" rx="2" fill="rgba(255,255,255,0.06)"/>

    {/* faixa identificadora do kit */}
    <rect x="10" y="35" width="36" height="14" fill="rgba(204,0,51,0.85)"/>
    <text x="28" y="44" textAnchor="middle" fontSize="5.5"
      fill="white" fontFamily="monospace" fontWeight="700">114897</text>
    <text x="28" y="50" textAnchor="middle" fontSize="3.8"
      fill="rgba(255,255,255,0.80)" fontFamily="sans-serif">Cl⁻ · Merck</text>

    {/* código de barras simulado */}
    {[0,2,3.5,5.5,7,9,10.5,12.5].map((x,i) => (
      <rect key={i} x={12 + x * 2.5} y="54" width={i % 2 === 0 ? 1.2 : 2} height="12"
        fill="rgba(255,255,255,0.50)"/>
    ))}

    {/* tampa superior */}
    <ellipse cx="28" cy="18" rx="18" ry="5" fill="#252525" stroke="#333" strokeWidth="1.2"/>
    <circle cx="28" cy="18" r="5" fill="#1a1a1a" stroke="#555" strokeWidth="1"/>

    {/* indicador reconhecimento */}
    {reconhecida && (
      <g>
        <circle cx="28" cy="80" r="8"
          fill="rgba(0,204,80,0.85)" stroke="rgba(0,180,60,0.90)" strokeWidth="1.2"/>
        <text x="28" y="83.5" textAnchor="middle" fontSize="9"
          fill="white" fontFamily="sans-serif">✓</text>
      </g>
    )}
    {pulsando && !reconhecida && (
      <circle cx="28" cy="18" r="20" fill="none"
        stroke="rgba(251,191,36,0.55)" strokeWidth="2.5">
        <animate attributeName="opacity" from="0.8" to="0" dur="0.9s" repeatCount="indefinite"/>
      </circle>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — FOTÔMETRO MERCK SPECTROQUANT PROVE 300 (Cl⁻ · 114897)
═══════════════════════════════════════════════════════════ */
const FotometroCloretoMkSVG = ({
  cubetaDentro = false, corCubeta = 'rgba(220,235,255,0.08)',
  celulaDentro = false,
  reconhecendo = false, kitReconhecido = false,
  lendo = false, resultado = null,
  lerAtivo = false,
  onLer,
}) => (
  <svg width="238" height="210" viewBox="0 0 238 210">
    <defs>
      <linearGradient id="cmkSqBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#e8eaec"/>
        <stop offset="100%" stopColor="#cdd0d4"/>
      </linearGradient>
      <linearGradient id="cmkSqScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001a2c"/>
        <stop offset="100%" stopColor="#00101c"/>
      </linearGradient>
      <filter id="cmkSqSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".28"/></filter>
    </defs>

    <g filter="url(#cmkSqSh)">
      <rect x="4" y="4" width="230" height="202" rx="12"
        fill="url(#cmkSqBody)" stroke="#b0b5ba" strokeWidth="1.5"/>
    </g>

    {/* header Merck vermelho */}
    <rect x="4" y="4" width="230" height="30" rx="12" fill="#cc0033"/>
    <rect x="4" y="20" width="230" height="14" fill="#cc0033"/>
    <text x="70"  y="18" textAnchor="middle" fontSize="10"
      fill="white" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="2">Merck</text>
    <text x="165" y="18" textAnchor="middle" fontSize="7.5"
      fill="rgba(255,255,255,0.85)" fontFamily="Arial,sans-serif" letterSpacing="1">Spectroquant®</text>
    <text x="119" y="28" textAnchor="middle" fontSize="5.5"
      fill="rgba(255,255,255,0.75)" fontFamily="sans-serif">Prove 300 · Kit 114897 · Cloreto</text>

    {/* Display */}
    <rect x="12" y="38" width="155" height="100" rx="6"
      fill="url(#cmkSqScr)" stroke="#004060" strokeWidth="1.2"/>
    <rect x="14" y="40"  width="151" height="96" rx="5" fill="rgba(0,30,50,0.35)"/>

    {resultado !== null ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#4dd7ff" fontFamily="monospace">KIT 114897 · CLORETO</text>
        <line x1="18" y1="62" x2="161" y2="62"
          stroke="rgba(77,215,255,0.22)" strokeWidth="0.8"/>
        <text x="85" y="92" textAnchor="middle" fontSize="28"
          fill="#00ff88" fontFamily="'Courier New',monospace" fontWeight="700">{resultado}</text>
        <text x="157" y="92" textAnchor="end" fontSize="9"
          fill="#00cc66" fontFamily="monospace">mg/L</text>
        <text x="157" y="101" textAnchor="end" fontSize="8"
          fill="#00cc66" fontFamily="monospace">Cl⁻</text>
        <text x="90" y="118" textAnchor="middle" fontSize="6.5"
          fill="#00aa88" fontFamily="monospace">✓ Leitura concluída · Merck 114897</text>
        <text x="90" y="128" textAnchor="middle" fontSize="5.5"
          fill="#007744" fontFamily="sans-serif">Cloreto · 2,5–250,0 mg/L Cl⁻</text>
      </>
    ) : lendo ? (
      <>
        <text x="90" y="60" textAnchor="middle" fontSize="6.5"
          fill="#4dd7ff" fontFamily="monospace">114897 · CLORETO</text>
        <text x="90" y="84" textAnchor="middle" fontSize="14"
          fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x="22" y="96" width="134" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="22" y="96" width="0" height="5" rx="2.5" fill="rgba(77,215,255,0.65)">
          <animate attributeName="width" from="0" to="134" dur="2.5s" fill="freeze"/>
        </rect>
        <text x="90" y="120" textAnchor="middle" fontSize="6"
          fill="#475569" fontFamily="monospace">Calculando concentração Cl⁻...</text>
      </>
    ) : reconhecendo ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#fbbf24" fontFamily="monospace">LENDO KIT...</text>
        <text x="90" y="78" textAnchor="middle" fontSize="9.5"
          fill="#fbbf24" fontFamily="monospace">114897</text>
        <rect x="22" y="86" width="134" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="22" y="86" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="134" dur="2s" fill="freeze"/>
        </rect>
        <text x="90" y="106" textAnchor="middle" fontSize="6"
          fill="#78716c" fontFamily="monospace">Reconhecendo kit · Ajustando curva...</text>
        <text x="90" y="120" textAnchor="middle" fontSize="5.5"
          fill="#4b5563" fontFamily="monospace">Cloreto · 2,5–250,0 mg/L Cl⁻</text>
      </>
    ) : kitReconhecido && !cubetaDentro ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#4dd7ff" fontFamily="monospace">KIT 114897 ✓</text>
        <line x1="18" y1="62" x2="161" y2="62"
          stroke="rgba(77,215,255,0.22)" strokeWidth="0.8"/>
        <text x="90" y="82" textAnchor="middle" fontSize="10.5"
          fill="#3b82f6" fontFamily="monospace">CALIBRADO ✓</text>
        <text x="90" y="96" textAnchor="middle" fontSize="7.5"
          fill="#60a5fa" fontFamily="monospace">Curva 114897 · Cloreto</text>
        <text x="90" y="112" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">Inserir cubeta com amostra</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#4dd7ff" fontFamily="monospace">KIT 114897 ✓</text>
        <text x="90" y="78" textAnchor="middle" fontSize="10.5"
          fill="#0ea5e9" fontFamily="monospace">PRONTO</text>
        <text x="90" y="94" textAnchor="middle" fontSize="7"
          fill="#60a5fa" fontFamily="sans-serif">Amostra inserida ✓</text>
        <text x="90" y="110" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">
          {lerAtivo ? 'Pressione LER para leitura' : 'Curva 114897 · Cl⁻ · 2,5–250 mg/L'}
        </text>
      </>
    ) : (
      <>
        <text x="90" y="65" textAnchor="middle" fontSize="9.5"
          fill="#003c50" fontFamily="monospace">STANDBY</text>
        <text x="90" y="90" textAnchor="middle" fontSize="6.5"
          fill="#001a24" fontFamily="sans-serif">Aguardando célula do kit...</text>
        <text x="90" y="104" textAnchor="middle" fontSize="5.5"
          fill="#002030" fontFamily="monospace">Kit 114897 · Cloreto</text>
      </>
    )}

    {/* Compartimento de leitura */}
    <rect x="175" y="38" width="58" height="100" rx="5"
      fill="#1a1a1a"
      stroke={
        cubetaDentro ? '#00cc66'
        : celulaDentro ? '#f59e0b'
        : kitReconhecido ? '#1e4d8a'
        : '#3a3a3a'
      }
      strokeWidth="1.5"/>
    {/* glow âmbar durante reconhecimento */}
    {celulaDentro && !cubetaDentro && (
      <rect x="175" y="38" width="58" height="100" rx="5"
        fill="none" stroke="rgba(251,191,36,0.45)" strokeWidth="4">
        <animate attributeName="opacity" from="0.9" to="0.1" dur="0.7s" repeatCount="indefinite"/>
      </rect>
    )}
    <text x="204" y="56" textAnchor="middle" fontSize="5.5"
      fill={celulaDentro ? '#f59e0b' : '#4a4a4a'} fontFamily="monospace">
      {celulaDentro ? 'KIT ID' : '10 mm'}
    </text>
    {cubetaDentro ? (
      /* cubeta de amostra acoplada */
      <g>
        <rect x="185" y="62" width="38" height="58" rx="2"
          fill={corCubeta} stroke="rgba(200,200,200,0.45)" strokeWidth="1"/>
        <rect x="187" y="64" width="6" height="50" fill="rgba(255,255,255,0.16)"/>
        <line x1="219" y1="70" x2="222" y2="70"
          stroke="rgba(200,200,200,0.65)" strokeWidth="1.2"/>
      </g>
    ) : celulaDentro ? (
      /* célula cilíndrica preta acoplada para reconhecimento */
      <g>
        {/* sombra */}
        <ellipse cx="204" cy="123" rx="16" ry="3" fill="rgba(0,0,0,0.30)"/>
        {/* face inferior */}
        <ellipse cx="204" cy="120" rx="16" ry="4" fill="#111111" stroke="#2a2a2a" strokeWidth="0.8"/>
        {/* corpo */}
        <rect x="188" y="66" width="32" height="54" fill="url(#cmkCelInner)" stroke="#1a1a1a" strokeWidth="0.8"/>
        {/* gradiente lateral do cilindro */}
        <defs>
          <linearGradient id="cmkCelInner" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1a1a1a"/>
            <stop offset="38%"  stopColor="#2d2d2d"/>
            <stop offset="100%" stopColor="#111111"/>
          </linearGradient>
        </defs>
        {/* faixa vermelha Kit */}
        <rect x="188" y="78" width="32" height="12" fill="rgba(204,0,51,0.88)"/>
        <text x="204" y="86" textAnchor="middle" fontSize="5"
          fill="white" fontFamily="monospace" fontWeight="700">114897</text>
        {/* barcode simulado */}
        {[0,2,3.5,5.5,7.5,9,11].map((x, i) => (
          <rect key={i} x={190 + x * 2.2} y="94" width={i % 2 === 0 ? 1.2 : 1.8} height="9"
            fill="rgba(255,255,255,0.45)"/>
        ))}
        {/* reflexo */}
        <rect x="189" y="68" width="3.5" height="46" rx="1.5" fill="rgba(255,255,255,0.06)"/>
        {/* face superior */}
        <ellipse cx="204" cy="66" rx="16" ry="4" fill="#252525" stroke="#333" strokeWidth="0.8"/>
        <circle cx="204" cy="66" r="4.5" fill="#1a1a1a" stroke="#555" strokeWidth="0.8"/>
        {/* led âmbar pulsando */}
        <circle cx="204" cy="66" r="3" fill="rgba(251,191,36,0.85)">
          <animate attributeName="opacity" from="1" to="0.2" dur="0.5s" repeatCount="indefinite"/>
        </circle>
      </g>
    ) : (
      /* compartimento vazio */
      <rect x="185" y="62" width="38" height="58" rx="2"
        fill="rgba(5,12,25,0.60)" stroke="#1a1a1a" strokeWidth="0.8"
        strokeDasharray="4,2"/>
    )}
    <circle cx="170" cy="100" r="4"
      fill={
        cubetaDentro ? 'rgba(0,204,102,0.8)'
        : celulaDentro ? 'rgba(251,191,36,0.85)'
        : kitReconhecido ? 'rgba(30,120,220,0.50)'
        : 'rgba(0,50,80,0.22)'
      }
      stroke="rgba(0,100,170,0.35)" strokeWidth="1">
      {celulaDentro && (
        <animate attributeName="opacity" from="1" to="0.2" dur="0.5s" repeatCount="indefinite"/>
      )}
    </circle>

    {/* Painel botões */}
    <rect x="12" y="146" width="222" height="54" rx="6"
      fill="#bfc2c6" stroke="#a0a5aa" strokeWidth="0.8"/>

    {/* Botão LER */}
    <g onClick={onLer} style={{ cursor: lerAtivo ? 'pointer' : 'default' }}>
      <rect x="20" y="153" width="70" height="22" rx="5"
        fill={lerAtivo ? '#0f2a48' : '#6b7280'}
        stroke={lerAtivo ? '#00aacc' : '#4b5563'} strokeWidth={lerAtivo ? 1.8 : 1}/>
      {lerAtivo && (
        <rect x="20" y="153" width="70" height="22" rx="5"
          fill="none" stroke="rgba(0,170,204,0.45)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
      <text x="55" y="167" textAnchor="middle" fontSize="9"
        fill={lerAtivo ? '#00ddff' : '#d1d5db'} fontFamily="monospace"
        fontWeight={lerAtivo ? '700' : '400'}>LER</text>
    </g>

    <g>
      <rect x="100" y="153" width="70" height="22" rx="5"
        fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
      <text x="135" y="167" textAnchor="middle" fontSize="8"
        fill="#d1d5db" fontFamily="monospace">MENU</text>
    </g>

    <g>
      <rect x="180" y="153" width="50" height="22" rx="5"
        fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
      <text x="205" y="167" textAnchor="middle" fontSize="8"
        fill="#d1d5db" fontFamily="monospace">PRINT</text>
    </g>

    <text x="119" y="190" textAnchor="middle" fontSize="6"
      fill="#6b7280" fontFamily="sans-serif">Spectroquant® Prove 300 · Merck KGaA</text>
    <text x="119" y="200" textAnchor="middle" fontSize="5.5"
      fill="#9ca3af" fontFamily="monospace">Kit 114897 · Cloreto · 2,5–250,0 mg/L Cl⁻</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const CloretoMk = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'cmk-anim-styles';
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
  } = useGameState(etapas.length); // 11 etapas

  // ── Fontes ────────────────────────────────────────────
  const [nivelAmostra,  setNivelAmostra]  = useState(80);
  const [nivelCl1,      setNivelCl1]      = useState(78);
  const [nivelCl2,      setNivelCl2]      = useState(80);

  // ── Micropipeta ───────────────────────────────────────
  const [micropipetaAtiva,    setMicropipetaAtiva]    = useState(false);
  const [micropipetaConteudo, setMicropipetaConteudo] = useState(null);
  // conteudo: null | 'amostra' | 'cl1' | 'cl2'

  // ── Béquer ────────────────────────────────────────────
  const [nivelBequer,  setNivelBequer]  = useState(0);
  const [corBequer,    setCorBequer]    = useState('rgba(220,235,255,0.08)');
  const [bequerConteudo, setBequerConteudo] = useState(null);
  // conteudo: null | 'amostra' | 'amostra_cl1' | 'reagido'
  const [agitando,     setAgitando]     = useState(false);

  // ── Timer reação (step 6) ─────────────────────────────
  const [timerAtivo,     setTimerAtivo]     = useState(false);
  const [timerProgresso, setTimerProgresso] = useState(0);

  // ── Gotas animadas ────────────────────────────────────
  const [mostrarGotas, setMostrarGotas] = useState(false);
  const [corGotas,     setCorGotas]     = useState('rgba(200,200,200,0.88)');
  const [gotasKey,     setGotasKey]     = useState(0);

  // ── Célula preta ──────────────────────────────────────
  const [celulaPretaUsada, setCelulaPretaUsada] = useState(false);
  const [reconhecendo,     setReconhecendo]     = useState(false);
  const [kitReconhecido,   setKitReconhecido]   = useState(false);

  // ── Cubeta ────────────────────────────────────────────
  const [nivelCubeta,      setNivelCubeta]      = useState(0);
  const [corCubeta,        setCorCubeta]         = useState('rgba(220,235,255,0.08)');
  const [cubetaComAmostra, setCubetaComAmostra]  = useState(false);
  const [cubetaNoFoto,     setCubetaNoFoto]      = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [lendo,     setLendo]     = useState(false);
  const [resultado, setResultado] = useState(null);


  // ── TIMER: reação 1 min simulada (3 s) ───────────────
  useEffect(() => {
    if (!timerAtivo) return;
    setTimerProgresso(0);
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 100/30, 100);
      setTimerProgresso(p);
    }, 100); // 3 s total
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimerAtivo(false);
      setTimerProgresso(100);
      setBequerConteudo('reagido');
      setCorBequer('rgba(200,80,30,0.72)'); // cor vermelho-alaranjado do complexo de cloreto
      // breve agitação final visual
      setAgitando(true);
      setTimeout(() => {
        setAgitando(false);
        celebrarAcerto(100);
        proximaEtapa(); // → etapa 7
      }, 700);
    }, 3000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timerAtivo]);

  // ── Ocultar gotas após 2 s ────────────────────────────
  useEffect(() => {
    if (!mostrarGotas) return;
    const id = setTimeout(() => setMostrarGotas(false), 2000);
    return () => clearTimeout(id);
  }, [mostrarGotas]);

  // ── Reconhecimento kit (2 s) ──────────────────────────
  useEffect(() => {
    if (!reconhecendo) return;
    const id = setTimeout(() => {
      setReconhecendo(false);
      setKitReconhecido(true);
      setCelulaPretaUsada(true);
      celebrarAcerto(150);
      proximaEtapa(); // → etapa 9
    }, 2000);
    return () => clearTimeout(id);
  }, [reconhecendo]);


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

    // E1 — MICROPIPETA → AMOSTRA (aspirar 5 mL)
    if (itemDrop === 'micropipeta' && alvo === 'amostra' && etapaAtual === 2) {
      setItemSegurado(null);
      setMicropipetaConteudo('amostra');
      setNivelAmostra(n => Math.max(n - 20, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E2 — MICROPIPETA → BÉQUER (dispensar amostra 5 mL)
    if (itemDrop === 'micropipeta' && alvo === 'bequer' && etapaAtual === 3) {
      setItemSegurado(null);
      setMicropipetaConteudo(null);
      setNivelBequer(22);
      setCorBequer('rgba(195,220,255,0.62)');
      setBequerConteudo('amostra');
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — MICROPIPETA → CL1 (aspirar 2,5 mL)
    if (itemDrop === 'micropipeta' && alvo === 'cl1' && etapaAtual === 4) {
      setItemSegurado(null);
      setMicropipetaConteudo('cl1');
      setNivelCl1(n => Math.max(n - 12, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — MICROPIPETA → BÉQUER (adicionar Cl-1)
    if (itemDrop === 'micropipeta' && alvo === 'bequer' && etapaAtual === 5) {
      setItemSegurado(null);
      setMicropipetaConteudo(null);
      setNivelBequer(38);
      setCorBequer('rgba(230,215,140,0.68)');
      setBequerConteudo('amostra_cl1');
      setGotasKey(k => k + 1);
      setCorGotas('rgba(220,180,50,0.90)');
      setMostrarGotas(true);
      setAgitando(true);
      setTimeout(() => setAgitando(false), 700);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E5 — MICROPIPETA → CL2 (aspirar 0,50 mL)
    if (itemDrop === 'micropipeta' && alvo === 'cl2' && etapaAtual === 6) {
      setItemSegurado(null);
      setMicropipetaConteudo('cl2');
      setNivelCl2(n => Math.max(n - 6, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E6 — MICROPIPETA → BÉQUER (adicionar Cl-2 + iniciar timer)
    if (itemDrop === 'micropipeta' && alvo === 'bequer' && etapaAtual === 7) {
      setItemSegurado(null);
      setMicropipetaConteudo(null);
      setNivelBequer(42);
      setCorBequer('rgba(230,150,80,0.70)');
      setGotasKey(k => k + 1);
      setCorGotas('rgba(120,200,120,0.90)');
      setMostrarGotas(true);
      // Iniciar timer de reação
      setTimeout(() => {
        setTimerAtivo(true);
        setAgitando(true);
        setTimeout(() => setAgitando(false), 800);
      }, 600);
      return;
    }

    // E7 — BÉQUER → CUBETA
    if (itemDrop === 'bequer' && alvo === 'cubeta' && etapaAtual === 8) {
      setItemSegurado(null);
      setNivelCubeta(78);
      setCorCubeta(corBequer);
      setCubetaComAmostra(true);
      setNivelBequer(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E8 — CÉLULA PRETA → FOTÔMETRO (reconhecer kit)
    if (itemDrop === 'celula_preta' && alvo === 'fotometro' && etapaAtual === 9) {
      setItemSegurado(null);
      setReconhecendo(true); // timer 2s → proximaEtapa internamente
      return;
    }

    // E9 — CUBETA → FOTÔMETRO
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && etapaAtual === 10) {
      setItemSegurado(null);
      setCubetaNoFoto(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }
  };


  // ── Click: Verificar pH (step 0) ──────────────────────
  const handleVerificarPH = () => {
    if (etapaAtual !== 0) return;
    celebrarAcerto(50);
    proximaEtapa();
  };

  // ── Click: selecionar micropipeta (step 1) ────────────
  const handleClicarMicropipeta = () => {
    if (etapaAtual !== 1 || micropipetaAtiva) return;
    setMicropipetaAtiva(true);
    celebrarAcerto(80); proximaEtapa();
  };

  // ── Click: LER fotômetro (step 11) ───────────────────
  const handleLerFotometro = () => {
    if (etapaAtual !== 11 || !cubetaNoFoto || !kitReconhecido || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * (250.0 - 2.5) + 2.5).toFixed(1));
      setResultado(raw.toFixed(1));
      setLendo(false);
      celebrarAcerto(200);
      setTimeout(() => proximaEtapa(), 2000);
    }, 2500);
  };


  // ── Derivados ─────────────────────────────────────────
  const micropipetaDrag = isItem('micropipeta') && micropipetaAtiva && (
    etapaAtual === 2 || etapaAtual === 3 ||
    etapaAtual === 4 || etapaAtual === 5 ||
    etapaAtual === 6 || etapaAtual === 7
  );
  const bequerDrag     = isItem('bequer') && bequerConteudo === 'reagido' && nivelBequer > 0;
  const celulaDrag     = isItem('celula_preta') && !celulaPretaUsada && !reconhecendo;
  const cubetaDrag     = isItem('cubeta') && cubetaComAmostra && !cubetaNoFoto;
  const lerAtivo       = etapaAtual === 11 && cubetaNoFoto && kitReconhecido && !lendo && !resultado;


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
          <div style={{ background:'linear-gradient(135deg,#0d9488,#3b82f6,#8b5cf6)', color:'white', padding:'20px 36px', borderRadius:22, boxShadow:'0 16px 40px rgba(0,0,0,0.35)', border:'2px solid rgba(255,255,255,0.9)', textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Star size={28} fill="currentColor"/>
              <div><h3 style={{ fontSize:21, fontWeight:900, margin:0 }}>Muito bem!</h3><p style={{ fontSize:14, margin:0 }}>+100 pontos</p></div>
              <CheckCircle size={28}/>
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
              <div>
                <h3 style={{ fontSize:16, fontWeight:900, margin:0 }}>Ação incorreta</h3>
                <p style={{ fontSize:12, margin:0 }}>{mensagemErroEtapa}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER TIMER REAÇÃO ── */}
      {timerAtivo && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#065f46,#059669,#10b981)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:16, fontWeight:900, animation:'cmkTimerPulse 1s ease-in-out infinite' }}>
              ⚗️ Reação em andamento — Aguardar 1 minuto
            </div>
            <div style={{ marginTop:8, height:6, background:'rgba(255,255,255,0.15)', borderRadius:4, overflow:'hidden', minWidth:240 }}>
              <div style={{ height:'100%', width:`${timerProgresso}%`, background:'rgba(52,211,153,0.85)', borderRadius:4, transition:'width 0.1s linear' }}/>
            </div>
            <div style={{ fontSize:11, marginTop:4, color:'rgba(255,255,255,0.78)' }}>
              {Math.floor(timerProgresso)}% · Cl-1 + Cl-2 · Desenvolvimento de cor
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RECONHECIMENTO ── */}
      {reconhecendo && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#1e3a5f,#2563eb,#3b82f6)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:16, fontWeight:900, animation:'cmkTimerPulse 0.8s ease-in-out infinite' }}>
              🔍 Reconhecendo Kit 114897...
            </div>
            <div style={{ fontSize:11, marginTop:6, color:'rgba(255,255,255,0.78)' }}>
              Ajustando curva de calibração · Cloreto · 2,5–250,0 mg/L Cl⁻
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RESULTADO ── */}
      {resultado && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#1e4d3a,#059669,#10b981)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:17, fontWeight:900 }}>🔬 Leitura Concluída — Kit 114897</div>
            <div style={{ fontSize:12, marginTop:4 }}>Cloreto: <strong>{resultado} mg/L Cl⁻</strong> · Merck Spectroquant</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:70 }}>
          <div style={{ background:'linear-gradient(135deg,#0d1f35,#0a1628)', border:'2px solid #cc0033', borderRadius:24, padding:'44px 52px', textAlign:'center', color:'white', maxWidth:560, boxShadow:'0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ marginBottom:8 }}>
              <span style={{ fontSize:36, fontWeight:900, color:'#cc0033' }}>Merck</span><br/>
              <span style={{ fontSize:18, color:'#94a3b8' }}>Spectroquant® Prove 300</span>
            </div>
            <h2 style={{ fontSize:26, fontWeight:900, color:'#10b981', margin:'8px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color:'#64748b', fontSize:12, margin:'0 0 20px' }}>
              Cloreto · Kit Merck 114897 · Fotometria
            </p>
            <div style={{ background:'rgba(204,0,51,0.08)', border:'1px solid rgba(204,0,51,0.28)', borderRadius:14, padding:'14px 22px', marginBottom:14 }}>
              <div style={{ fontSize:10, color:'#94a3b8', marginBottom:8 }}>Dados da Análise</div>
              <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
                {[
                  { label:'Kit',           val:'Merck 114897',          cor:'#cc0033' },
                  { label:'Analito',        val:'Cloreto (Cl⁻)',         cor:'#34d399' },
                  { label:'Faixa',          val:'2,5–250,0 mg/L Cl⁻',   cor:'#60a5fa' },
                  { label:'V. amostra',     val:'5,0 mL',               cor:'#a78bfa' },
                  { label:'Reagente Cl-1',  val:'2,5 mL',               cor:'#fde68a' },
                  { label:'Reagente Cl-2',  val:'0,50 mL',              cor:'#86efac' },
                  { label:'Reação',         val:'1 minuto',             cor:'#fb923c' },
                  { label:'Fotômetro',      val:'Prove 300',            cor:'#f0abfc' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'#94a3b8', marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.38)', borderRadius:14, padding:'18px 36px', marginBottom:14 }}>
              <div style={{ fontSize:13, color:'#94a3b8', marginBottom:6 }}>Resultado — Cloreto</div>
              <div style={{ fontSize:52, fontWeight:900, color:'#10b981', fontFamily:'monospace', lineHeight:1 }}>{resultado}</div>
              <div style={{ fontSize:14, color:'#34d399', fontWeight:700, marginTop:4 }}>mg/L Cl⁻</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'8px 14px', marginBottom:10, fontSize:9, color:'#64748b', textAlign:'left' }}>
              📋 <strong style={{ color:'#94a3b8' }}>Método:</strong> Merck Spectroquant Kit 114897 · Cloreto<br/>
              🔬 <strong style={{ color:'#94a3b8' }}>Reagentes:</strong> Cl-1 (2,5 mL) + Cl-2 (0,50 mL) · Reação 1 min<br/>
              📏 <strong style={{ color:'#94a3b8' }}>Faixa:</strong> 2,5 – 250,0 mg/L Cl⁻ · Fotômetro Prove 300<br/>
              ✅ <strong style={{ color:'#94a3b8' }}>QC:</strong> CombiCheck 60 (Cat. 114696) ou Certipur® Cat. 119897.
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
        titulo="Cloreto — Kit Merck Spectroquant 114897"
        subtitulo={"Fotômetro Merck Spectroquant® Prove 300\nCloreto · 2,5–250,0 mg/L Cl⁻"}
        icone="🟢"
        badges={['🔴 MERCK','⚗️ CLORETO 114897']}
        footerLabel="🟢 Cloreto Merck 114897"
      >
        <div style={{ background:'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius:26, padding:'22px 18px', border:'8px solid #8b6e45', boxShadow:'0 24px 80px rgba(0,0,0,0.6)', minWidth:980 }}>
          <h2 style={{ textAlign:'center', color:'#4a3010', fontSize:14, fontWeight:900, marginBottom:14, letterSpacing:0.6 }}>
            🟢 Bancada — Cloreto · Kit Merck Spectroquant 114897 · 2,5–250,0 mg/L Cl⁻
          </h2>

          <div style={{ background:'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius:20, padding:'18px 16px', border:'4px solid #292524', boxShadow:'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:10, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:12 }}>

              {/* BÉQUER 250 mL */}
              <div style={{ flex:1.4, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="bequer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('bequer')}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, position:'relative' }}>

                    {/* Gotas animadas */}
                    <div style={{ position:'relative', width:'100%', height:0, overflow:'visible' }}>
                      {mostrarGotas && (
                        <>
                          <GotaReagente key={`ga-${gotasKey}`} offsetX={-8}  animName="cmkDropFall"  delay={0}   animKey={`ga-${gotasKey}`} cor={corGotas}/>
                          <GotaReagente key={`gb-${gotasKey}`} offsetX={2}   animName="cmkDropFall2" delay={180} animKey={`gb-${gotasKey}`} cor={corGotas}/>
                          <GotaReagente key={`gc-${gotasKey}`} offsetX={9}   animName="cmkDropFall3" delay={360} animKey={`gc-${gotasKey}`} cor={corGotas}/>
                          <GotaReagente key={`gd-${gotasKey}`} offsetX={-3}  animName="cmkDropFall4" delay={550} animKey={`gd-${gotasKey}`} cor={corGotas}/>
                        </>
                      )}
                    </div>

                    <div
                      className={`item-drag ${itemCls('bequer')}`}
                      draggable={bequerDrag}
                      onDragStart={e => handleDragStart('bequer', e)}
                      onDragEnd={handleDragEnd}
                      style={{ cursor: bequerDrag ? 'grab' : 'default' }}>
                      <BequerSVG nivel={nivelBequer} cor={corBequer} agitando={agitando}/>
                    </div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {bequerDrag ? '🖱️ ' : ''}Béquer 250 mL
                  </span>
                  <span style={{ fontSize:8, color:
                    bequerConteudo === 'reagido' ? '#fb923c'
                    : bequerConteudo === 'amostra_cl1' ? '#fde68a'
                    : bequerConteudo === 'amostra' ? '#60a5fa' : '#94a3b8' }}>
                    {bequerConteudo === 'reagido'     ? '🟠 Reação concluída'
                      : bequerConteudo === 'amostra_cl1' ? '🟡 Amostra + Cl-1'
                      : bequerConteudo === 'amostra'  ? '💧 5,0 mL amostra'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA 10 mL */}
              <div style={{ flex:0.9, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('cubeta')} ${itemCls('cubeta')}`}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, opacity: cubetaNoFoto ? 0.18 : 1, transition:'opacity 0.3s' }}
                    draggable={cubetaDrag}
                    onDragStart={e => handleDragStart('cubeta', e)} onDragEnd={handleDragEnd}>
                    <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="cmka"/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cubetaDrag ? '🖱️ ' : ''}Cubeta 10 mL
                  </span>
                  <span style={{ fontSize:8, color: nivelCubeta > 0 ? '#34d399' : '#94a3b8' }}>
                    {cubetaNoFoto ? '✓ No fotômetro' : nivelCubeta > 0 ? '🟢 Amostra reagida' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CÉLULA CILÍNDRICA PRETA */}
              <div style={{ flex:0.9, display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('celula_preta')}`}
                    draggable={celulaDrag}
                    onDragStart={e => handleDragStart('celula_preta', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: celulaDrag ? 'grab' : 'default', opacity: celulaPretaUsada ? 0.28 : 1, transition:'opacity 0.3s' }}>
                    <CelulaCilindricaSVG
                      reconhecida={kitReconhecido}
                      pulsando={isItem('celula_preta') && !celulaPretaUsada}
                    />
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {celulaDrag ? '🖱️ ' : ''}Célula Kit 114897
                  </span>
                  <span style={{ fontSize:8, color: kitReconhecido ? '#34d399' : '#94a3b8' }}>
                    {reconhecendo ? '⚡ Reconhecendo...' : kitReconhecido ? '✓ Kit reconhecido' : 'Célula cilíndrica preta'}
                  </span>
                </div>
              </div>

              {/* FOTÔMETRO MERCK PROVE 300 */}
              <div style={{ flex:2.8, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('fotometro')}
                    style={{ background:'rgba(255,255,255,0.06)', borderRadius:13, padding:'10px 12px' }}>
                    <FotometroCloretoMkSVG
                      cubetaDentro={cubetaNoFoto}
                      corCubeta={corCubeta}
                      celulaDentro={reconhecendo}
                      reconhecendo={reconhecendo}
                      kitReconhecido={kitReconhecido}
                      lendo={lendo}
                      resultado={resultado}
                      lerAtivo={lerAtivo}
                      onLer={handleLerFotometro}
                    />
                    {lerAtivo && (
                      <div style={{ textAlign:'center', fontSize:8, color:'#00ddff', fontWeight:700, marginTop:4 }}>
                        🔵 Clique LER para obter o resultado!
                      </div>
                    )}
                    {(lendo || reconhecendo) && (
                      <div style={{ textAlign:'center', fontSize:8, color:'#fbbf24', fontWeight:700, marginTop:4 }}>
                        ⚡ Processando...
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Fotômetro Merck Spectroquant Prove 300</span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}


            {/* ══ PAINEL VERIFICAR PH (step 0) ═══════════════════ */}
            {etapaAtual === 0 && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.28)', borderRadius:12, padding:'14px 18px', border:'1px solid rgba(34,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#22c55e', fontWeight:700 }}>🧪 Verificar pH da Amostra — Faixa Aceitável: pH 1–12</div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:2 }}>
                    Antes de iniciar a análise de cloreto, verifique o pH da amostra. A faixa aceitável para este método é pH 1–12. Caso esteja fora da faixa, ajuste a amostra antes de prosseguir.
                  </div>
                </div>
                <button onClick={handleVerificarPH}
                  style={{ background:'linear-gradient(90deg,#15803d,#166534)', color:'white', border:'none', borderRadius:10, padding:'10px 22px', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(21,128,61,0.35)', whiteSpace:'nowrap' }}>
                  ✓ pH Verificado (1–12)
                </button>
              </div>
            )}


            {/* ══ ESTAÇÃO MICROPIPETA P1000 ═══════════════════════════ */}
            <div style={{
              display:'flex', alignItems:'center', gap:20, justifyContent:'flex-start',
              padding:'10px 16px', marginBottom:12,
              background: etapaAtual >= 1 && etapaAtual <= 7 ? 'rgba(37,99,168,0.07)' : 'rgba(0,0,0,0.16)',
              borderRadius:14,
              border:`1px solid ${etapaAtual >= 1 && etapaAtual <= 7 ? 'rgba(96,165,250,0.30)' : 'rgba(255,255,255,0.05)'}`,
              transition:'all 0.4s',
              opacity: etapaAtual >= 1 && etapaAtual <= 7 ? 1 : 0.28,
            }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                {/* Indicação de click step 1 */}
                {etapaAtual === 1 && !micropipetaAtiva && (
                  <div style={{ fontSize:8, color:'#fbbf24', fontWeight:700, animation:'cmkTimerPulse 0.9s ease-in-out infinite', marginBottom:2 }}>
                    👆 Clique aqui
                  </div>
                )}
                <div
                  className={`item-drag ${itemCls('micropipeta')}`}
                  draggable={micropipetaDrag}
                  onDragStart={e => handleDragStart('micropipeta', e)}
                  onDragEnd={handleDragEnd}
                  onClick={handleClicarMicropipeta}
                  style={{
                    cursor: etapaAtual === 1 && !micropipetaAtiva ? 'pointer'
                      : micropipetaDrag ? 'grab' : 'default',
                  }}>
                  <MicropipetaP1000SVG ativa={micropipetaAtiva} conteudo={micropipetaConteudo}/>
                </div>
                <span style={{ fontSize:8.5, fontWeight:700, color:'#e7e5e4' }}>
                  {micropipetaDrag ? '🖱️ ' : etapaAtual === 1 && !micropipetaAtiva ? '👆 ' : ''}Micropipeta P1000
                </span>
                <span style={{ fontSize:7.5, color:
                  micropipetaConteudo === 'cl2' ? '#86efac'
                  : micropipetaConteudo === 'cl1' ? '#fde68a'
                  : micropipetaConteudo === 'amostra' ? '#60a5fa'
                  : micropipetaAtiva ? '#fde68a' : '#6b7280' }}>
                  {micropipetaConteudo === 'cl2' ? '🟢 2 · 0,50 mL Cl-2'
                    : micropipetaConteudo === 'cl1' ? '🟡 2,5 mL Cl-1'
                    : micropipetaConteudo === 'amostra' ? '💧 5,0 mL amostra'
                    : micropipetaAtiva ? '✓ Selecionada — P1000'
                    : 'Inativa'}
                </span>
              </div>

              <div style={{ fontSize:9, color:'#78716c', maxWidth:340, lineHeight:1.6 }}>
                <strong style={{ color:'#93c5fd' }}>Micropipeta P1000</strong> · Volumes: 0,50 mL · 2,5 mL · 5,0 mL<br/>
                Usada para pipetar amostra, Reagente Cl-1 e Reagente Cl-2 com precisão.<br/>
                {etapaAtual === 1 && !micropipetaAtiva && (
                  <span style={{ color:'#fbbf24', fontWeight:700 }}>← Clique na micropipeta para selecioná-la</span>
                )}
                {micropipetaDrag && (
                  <span style={{ color:'#60a5fa', fontWeight:700 }}>← Arraste até o destino indicado</span>
                )}
              </div>
            </div>


            {/* ══ PAINEL CONFIRMAR (step 1) ═══════════════════════ */}
            {etapaAtual === 1 && !micropipetaAtiva && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.28)', borderRadius:12, padding:'14px 18px', border:'1px solid rgba(37,99,168,0.38)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#60a5fa', fontWeight:700 }}>🟢 Determinação de Cloreto — Kit Merck Spectroquant 114897</div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:3 }}>
                    Faixa: 2,5 – 250,0 mg/L Cl⁻ · Reagentes Cl-1 + Cl-2 · Reação 1 minuto · Fotômetro Prove 300.<br/>
                    QC: CombiCheck 60 (Cat. 114696) · Solução padrão Certipur® Cat. 119897.
                  </div>
                </div>
                <button onClick={handleClicarMicropipeta}
                  style={{ background:'linear-gradient(90deg,#1d4ed8,#1e40af)', color:'white', border:'none', borderRadius:10, padding:'10px 22px', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,168,0.38)', whiteSpace:'nowrap' }}>
                  🔬 Selecionar Micropipeta
                </button>
              </div>
            )}


            {/* ══ ZONA INFERIOR: REAGENTES ═══════════════════════════ */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, alignItems:'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('amostra')}`}
                    style={{ cursor:'default', pointerEvents:'none' }}>
                    <FrascoReagente cor="rgba(210,195,148,0.82)" label="Amostra" sub="Água" nivel={nivelAmostra}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Frasco de Amostra</span>
                  <span style={{ fontSize:8, color:'#94a3b8' }}>5,0 mL → Béquer</span>
                </ZonaDrop>
              </div>

              {/* REAGENTE Cl-1 */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cl1" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('cl1')}
                    style={{ pointerEvents:'none' }}>
                    <FrascoReagente cor="rgba(230,200,60,0.82)" label="Cl-1" sub="2,5 mL" nivel={nivelCl1}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Reagente Cl-1</span>
                  <span style={{ fontSize:8, color: micropipetaConteudo === 'cl1' || bequerConteudo === 'amostra_cl1' || bequerConteudo === 'reagido' ? '#fde68a' : '#94a3b8' }}>
                    {bequerConteudo === 'amostra_cl1' || bequerConteudo === 'reagido'
                      ? '✓ 2,5 mL adicionados'
                      : micropipetaConteudo === 'cl1' ? '✓ 2,5 mL aspirados'
                      : '2,5 mL → Béquer'}
                  </span>
                </ZonaDrop>
              </div>

              {/* REAGENTE Cl-2 */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cl2" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('cl2')}
                    style={{ pointerEvents:'none' }}>
                    <FrascoReagente cor="rgba(100,185,100,0.82)" label="Cl-2" sub="0,50 mL" nivel={nivelCl2}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Reagente Cl-2</span>
                  <span style={{ fontSize:8, color: micropipetaConteudo === 'cl2' || bequerConteudo === 'reagido' ? '#86efac' : '#94a3b8' }}>
                    {bequerConteudo === 'reagido'
                      ? '✓ 0,50 mL adicionados'
                      : micropipetaConteudo === 'cl2' ? '✓ 0,50 mL aspirados'
                      : '0,50 mL → Béquer'}
                  </span>
                </ZonaDrop>
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

export default CloretoMk;
