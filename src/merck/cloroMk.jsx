/**
 * cloroMk.jsx — Determinação de Cloro Livre — Kit Merck ST598 (Curva 598)
 *
 * Faixas de medição:
 *   10 mm → 0,05 – 5,0   mg/L Cl₂  (simulada neste componente)
 *   20 mm → 0,02 – 3,0   mg/L Cl₂
 *   50 mm → 0,01 – 1,000 mg/L Cl₂
 *
 * pH da amostra: 4 – 8
 * Zeragem: água destilada (1× por semana no Spectroquant Merck)
 *
 * Fluxo (11 etapas, 0‑10):
 *  0  — Verificar e ajustar pH da amostra (pH 4–8)
 *  1  — Selecionar Micropipeta P10000
 *  2  — Micropipeta → Amostra (aspirar 10 mL)
 *  3  — Micropipeta → Béquer (dispensar 10 mL)
 *  4  — Envelope ST598 → Béquer (adicionar reagente em pó)
 *  5  — Clicar béquer para agitar + timer 1 min simulado (auto‑avança)
 *  6  — Béquer → Cubeta 10 mm (transferir solução reagida)
 *  7  — Cubeta de água destilada → Fotômetro (zeragem)
 *  8  — Clicar ZERO (zerar fotômetro)
 *  9  — Cubeta com amostra → Fotômetro (reconhecimento ST598, Curva 598)
 * 10  — Clicar LER → resultado mg/L Cl₂
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
   DADOS — 11 etapas (Cloro Livre, ST598, Curva 598)
═══════════════════════════════════════════════════════════ */
const etapas = [
  {
    id: 0,
    titulo: 'Verificar e Ajustar o pH da Amostra (pH 4–8)',
    descricao: 'Verifique o pH da amostra. A faixa especificada pelo método é pH 4–8. Se necessário, ajuste gota a gota com solução de H₂SO₄ (reduzir) ou NH₄OH (elevar). Clique em "Confirmar pH" quando o valor estiver dentro da faixa.',
    item: null, alvo: null,
  },
  {
    id: 1,
    titulo: 'Selecionar a Micropipeta P10000',
    descricao: 'Clique na micropipeta P10000 para selecioná-la. Ela será usada para pipetar exatamente 10 mL de amostra (10.000 μL) com precisão.',
    item: null, alvo: null,
  },
  {
    id: 2,
    titulo: 'Aspirar 10 mL de Amostra',
    descricao: 'Arraste a micropipeta P10000 até o frasco de amostra para aspirar 10 mL. Pressione o êmbolo até a primeira parada antes de mergulhar na amostra.',
    item: 'micropipeta', alvo: 'amostra',
  },
  {
    id: 3,
    titulo: 'Dispensar 10 mL de Amostra no Béquer',
    descricao: 'Arraste a micropipeta com 10 mL de amostra até o béquer para dispensar o volume. Pressione o êmbolo até a segunda parada para transferência completa.',
    item: 'micropipeta', alvo: 'bequer',
  },
  {
    id: 4,
    titulo: 'Adicionar Envelope de Reagente ST598 ao Béquer',
    descricao: 'Arraste o envelope de reagente ST598 até o béquer com amostra. O reagente em pó irá reagir com o cloro livre presente na amostra, desenvolvendo coloração característica.',
    item: 'envelope_st598', alvo: 'bequer',
  },
  {
    id: 5,
    titulo: 'Agitar Vigorosamente e Aguardar 1 Minuto de Reação',
    descricao: 'Clique no béquer para iniciar a agitação vigorosa até dissolver completamente o reagente sólido. O sistema iniciará automaticamente o timer de 1 minuto de reação para desenvolvimento total da cor.',
    item: null, alvo: null,
  },
  {
    id: 6,
    titulo: 'Transferir Solução para a Cubeta de Leitura 10 mm',
    descricao: 'Arraste o béquer até a cubeta de leitura de 10 mm para transferir a solução reagida. Preencha até a linha de marcação da cubeta para garantir volume correto.',
    item: 'bequer', alvo: 'cubeta',
  },
  {
    id: 7,
    titulo: 'Levar Cubeta com Água Destilada ao Fotômetro (Zeragem)',
    descricao: 'Arraste a cubeta de água destilada até o fotômetro Merck Spectroquant Prove 300 para a zeragem. A zeragem deve ser realizada pelo menos uma vez por semana no equipamento Merck.',
    item: 'cubeta_agua', alvo: 'fotometro',
  },
  {
    id: 8,
    titulo: 'Zerar o Fotômetro com Água Destilada',
    descricao: 'Clique em ZERO para zerar o fotômetro Merck com água destilada como referência. O equipamento calibrará a linha de base para a Curva 598 (Cloro Livre).',
    item: null, alvo: 'fotometro',
  },
  {
    id: 9,
    titulo: 'Inserir Cubeta com Amostra — Reconhecimento ST598',
    descricao: 'Arraste a cubeta com a solução reagida até o compartimento de leitura do fotômetro Merck. O Prove 300 reconhecerá automaticamente o kit ST598 e ajustará a Curva 598.',
    item: 'cubeta', alvo: 'fotometro',
  },
  {
    id: 10,
    titulo: 'Realizar Leitura — Concentração de Cloro Livre (mg/L Cl₂)',
    descricao: 'Clique em LER para obter a concentração de Cloro Livre pela Curva 598. O resultado será exibido em mg/L Cl₂ (faixa 0,05–5,0 mg/L, célula 10 mm). Registre o valor para o boletim de análise.',
    item: null, alvo: 'fotometro',
  },
];


/* ═══════════════════════════════════════════════════════════
   CSS — animações (prefixo clmk)
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes clmkPowderFall {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    5%   { opacity:1; }
    60%  { transform:translateX(-50%) translateY(44px); opacity:.85; }
    100% { transform:translateX(-50%) translateY(62px); opacity:0;   }
  }
  @keyframes clmkPowderFall2 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    5%   { opacity:.75; }
    60%  { transform:translateX(-50%) translateY(50px); opacity:.65; }
    100% { transform:translateX(-50%) translateY(70px); opacity:0;   }
  }
  @keyframes clmkPowderFall3 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    5%   { opacity:.55; }
    60%  { transform:translateX(-50%) translateY(38px); opacity:.45; }
    100% { transform:translateX(-50%) translateY(56px); opacity:0;   }
  }
  @keyframes clmkShake {
    0%,100% { transform: rotate(0deg) translateX(0); }
    15%     { transform: rotate(-7deg) translateX(-3px); }
    30%     { transform: rotate(7deg)  translateX(3px);  }
    45%     { transform: rotate(-5deg) translateX(-2px); }
    60%     { transform: rotate(5deg)  translateX(2px);  }
    75%     { transform: rotate(-3deg) translateX(-1px); }
    90%     { transform: rotate(3deg)  translateX(1px);  }
  }
  @keyframes clmkTimerPulse {
    0%,100% { opacity:.62; }
    50%     { opacity:1.00; }
  }
  @keyframes clmkGlow {
    0%,100% { opacity:.45; }
    50%     { opacity:.95; }
  }
  @keyframes clmkpHPulse {
    0%,100% { transform:scale(1);    opacity:.80; }
    50%     { transform:scale(1.06); opacity:1.00; }
  }
`;

/* ── Partícula de pó de reagente ── */
const ParticulaPo = ({ offsetX = 0, animName = 'clmkPowderFall', delay = 0, animKey = 'p' }) => (
  <div key={animKey} style={{
    position:'absolute', left:`calc(50% + ${offsetX}px)`, top:2,
    width:8, height:8, opacity:0, pointerEvents:'none', zIndex:30,
    animationName:animName, animationDuration:'0.55s',
    animationDelay:`${delay}ms`, animationFillMode:'forwards',
    animationTimingFunction:'ease-in',
  }}>
    <svg width="8" height="8" viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="3" fill="rgba(200,235,190,0.92)"/>
      <circle cx="2.5" cy="2.5" r="1" fill="rgba(255,255,255,0.55)"/>
    </svg>
  </div>
);


/* ═══════════════════════════════════════════════════════════
   SVG — MICROPIPETA P10000 (tema ciano/azul)
═══════════════════════════════════════════════════════════ */
const MicropipetaP10000SVG = ({ ativa = false, comAmostra = false }) => (
  <svg width="50" height="196" viewBox="0 0 50 196">
    <defs>
      <linearGradient id="clmkPipGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#164e63"/>
        <stop offset="48%"  stopColor="#0e7490"/>
        <stop offset="100%" stopColor="#164e63"/>
      </linearGradient>
    </defs>
    <ellipse cx="25" cy="193" rx="11" ry="3" fill="rgba(0,0,0,0.20)"/>
    {/* plunger */}
    <rect x="18" y="1" width="14" height="23" rx="7"
      fill="#475569" stroke="#334155" strokeWidth="1"/>
    <rect x="20" y="3" width="10" height="5" rx="2.5" fill="rgba(255,255,255,0.22)"/>
    {/* corpo */}
    <rect x="13" y="21" width="24" height="88" rx="9"
      fill="url(#clmkPipGrad)" stroke="#0c4a6e" strokeWidth="1.2"/>
    <rect x="14" y="23" width="4.5" height="80" rx="2.5" fill="rgba(255,255,255,0.09)"/>
    {/* janela volume */}
    <rect x="16" y="30" width="18" height="17" rx="3"
      fill="rgba(0,0,0,0.50)" stroke="#1e3a5f" strokeWidth="0.8"/>
    <text x="25" y="40" textAnchor="middle" fontSize="5.5"
      fill="#67e8f9" fontFamily="monospace" fontWeight="bold">10000</text>
    <text x="25" y="46" textAnchor="middle" fontSize="4"
      fill="#94a3b8" fontFamily="monospace">μL</text>
    <text x="25" y="59" textAnchor="middle" fontSize="6.5"
      fill="white" fontFamily="monospace" fontWeight="900">P10000</text>
    {[66,71,76,81,86,91].map(y => (
      <rect key={y} x="12" y={y} width="26" height="1.8" rx="0.9"
        fill="rgba(255,255,255,0.09)"/>
    ))}
    {/* botão eject */}
    <rect x="19" y="101" width="12" height="9" rx="3"
      fill="#0e7490" stroke="#0c4a6e" strokeWidth="0.8"/>
    <text x="25" y="107.5" textAnchor="middle" fontSize="3.8"
      fill="white" fontFamily="sans-serif">EJECT</text>
    {/* taper metálico */}
    <path d="M17,110 L20,143 L30,143 L33,110 Z"
      fill="#64748b" stroke="#475569" strokeWidth="1"/>
    <path d="M18,112 L20,136"
      stroke="rgba(255,255,255,0.17)" strokeWidth="1" strokeLinecap="round"/>
    {/* conector */}
    <path d="M21,143 L22,159 L28,159 L29,143 Z"
      fill="#94a3b8" stroke="#64748b" strokeWidth="0.8"/>
    {/* tip */}
    {ativa ? (
      <g>
        <path d="M22,159 L23.5,191 L26.5,191 L28,159 Z"
          fill={comAmostra ? 'rgba(195,220,255,0.88)' : 'rgba(186,230,253,0.88)'}
          stroke={comAmostra ? '#7dd3fc' : '#a5f3fc'} strokeWidth="1"/>
        <path d="M22.5,159 L24,183"
          stroke="rgba(255,255,255,0.28)" strokeWidth="0.9" strokeLinecap="round"/>
        <ellipse cx="25" cy="159" rx="3" ry="1.2" fill="rgba(255,255,255,0.20)"/>
      </g>
    ) : (
      <g>
        <path d="M21,160 L21,163 L29,163 L29,160"
          fill="none" stroke="#4b5563" strokeWidth="0.8" strokeDasharray="2,1"/>
        <text x="25" y="174" textAnchor="middle" fontSize="4.5"
          fill="#4b5563" fontFamily="sans-serif">▼ clicar</text>
      </g>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — BÉQUER 250 mL
═══════════════════════════════════════════════════════════ */
const BequerSVG = ({ nivel = 0, cor = 'rgba(220,235,255,0.08)', agitando = false }) => {
  const W = 74, H = 92, wall = 3.5;
  const iW = W - wall * 2, iH = H - wall * 2 - 4;
  const lH = (nivel / 100) * iH;
  const lY = wall + iH - lH + 4;
  return (
    <svg width="104" height="134" viewBox="0 0 104 134"
      style={agitando ? { animation:'clmkShake 0.50s ease-in-out 4', transformOrigin:'50% 90%' } : {}}>
      <defs>
        <linearGradient id="clmkBeqGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.50)"/>
          <stop offset="22%"  stopColor="rgba(215,238,255,0.12)"/>
          <stop offset="75%"  stopColor="rgba(210,235,255,0.06)"/>
          <stop offset="100%" stopColor="rgba(170,215,252,0.38)"/>
        </linearGradient>
        <clipPath id="clmkBeqClip">
          <rect x={wall} y={wall + 4} width={iW} height={iH} rx="1"/>
        </clipPath>
        <filter id="clmkBeqSh"><feDropShadow dx="2" dy="4" stdDeviation="3.5" floodOpacity=".20"/></filter>
      </defs>
      <g transform="translate(15,8)">
        <ellipse cx={W/2} cy={H+8} rx={W/2-5} ry={4} fill="rgba(0,0,0,0.16)"/>
        {/* líquido */}
        <g clipPath="url(#clmkBeqClip)">
          {nivel > 0 && (
            <>
              <rect x={wall} y={lY} width={iW} height={lH + 2} fill={cor}/>
              {nivel > 6 && (
                <ellipse cx={W/2} cy={lY + 1} rx={iW/2 - 1} ry={2.5}
                  fill="rgba(255,255,255,0.20)"/>
              )}
            </>
          )}
        </g>
        {/* corpo */}
        <g filter="url(#clmkBeqSh)">
          <rect x="0" y="4" width={W} height={H} rx="3"
            fill="url(#clmkBeqGlass)" stroke="#8ac4dc" strokeWidth="1.8"/>
        </g>
        {/* borda */}
        <rect x="-2" y="1" width={W+4} height="6" rx="3"
          fill="rgba(165,210,240,0.28)" stroke="#9ab8d0" strokeWidth="1.1"/>
        {/* bico */}
        <path d={`M${W-4},1 Q${W+7},-5 ${W+9},1 L${W},7 Z`}
          fill="rgba(165,210,240,0.40)" stroke="#9ab8d0" strokeWidth="1"/>
        {/* escala */}
        {[25,50,75].map((pct, i) => {
          const y = wall + 4 + iH - (pct / 100) * iH;
          return (
            <g key={i}>
              <line x1={W-14} y1={y} x2={W-3} y2={y}
                stroke="rgba(100,160,200,0.55)" strokeWidth="1"/>
              <text x={W-16} y={y+2.5} textAnchor="end" fontSize="5.5"
                fill="rgba(80,140,190,0.70)" fontFamily="monospace">{pct * 2.5 | 0}</text>
            </g>
          );
        })}
        {/* reflexo */}
        <rect x="4" y="6" width="4" height={H-8} rx="2" fill="rgba(255,255,255,0.24)"/>
        {/* label */}
        <rect x={W/2-18} y={H-24} width={36} height={15} rx="3"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7"/>
        <text x={W/2} y={H-14} textAnchor="middle" fontSize="5.5"
          fill="#0d2137" fontFamily="monospace" fontWeight="700">250 mL</text>
        <text x={W/2} y={H-7} textAnchor="middle" fontSize="4.5"
          fill="#1a3a5e" fontFamily="sans-serif">Béquer</text>
      </g>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — ENVELOPE / SACHÊ DE REAGENTE ST598
═══════════════════════════════════════════════════════════ */
const EnvelopeST598SVG = ({ usado = false }) => (
  <svg width="72" height="96" viewBox="0 0 72 96" opacity={usado ? 0.22 : 1}>
    <defs>
      <linearGradient id="clmkEnvGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#e8f5e9"/>
        <stop offset="100%" stopColor="#c8e6c9"/>
      </linearGradient>
      <linearGradient id="clmkEnvFoil" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="rgba(180,230,180,0.60)"/>
        <stop offset="45%"  stopColor="rgba(240,255,240,0.30)"/>
        <stop offset="100%" stopColor="rgba(160,210,160,0.55)"/>
      </linearGradient>
      <filter id="clmkEnvSh"><feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity=".25"/></filter>
    </defs>
    {/* sombra */}
    <ellipse cx="36" cy="93" rx="26" ry="4" fill="rgba(0,0,0,0.16)"/>
    {/* corpo do envelope */}
    <g filter="url(#clmkEnvSh)">
      <rect x="6" y="18" width="60" height="70" rx="4"
        fill="url(#clmkEnvGrad)" stroke="#4caf50" strokeWidth="1.5"/>
    </g>
    {/* franja cripada topo */}
    {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56].map((x, i) => (
      <path key={i} d={`M ${6+x},18 L ${6+x+2},12 L ${6+x+4},18`}
        fill="none" stroke="#388e3c" strokeWidth="1" strokeLinecap="round"/>
    ))}
    {/* franja cripada base */}
    {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56].map((x, i) => (
      <path key={i} d={`M ${6+x},88 L ${6+x+2},94 L ${6+x+4},88`}
        fill="none" stroke="#388e3c" strokeWidth="1" strokeLinecap="round"/>
    ))}
    {/* reflexo lateral */}
    <rect x="8" y="20" width="10" height="64" rx="2"
      fill="url(#clmkEnvFoil)"/>
    {/* faixa branca central */}
    <rect x="10" y="30" width="52" height="46" rx="3"
      fill="rgba(255,255,255,0.90)" stroke="rgba(76,175,80,0.35)" strokeWidth="0.8"/>
    {/* texto ST598 */}
    <text x="36" y="43" textAnchor="middle" fontSize="9.5"
      fill="#1b5e20" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="0.5">ST598</text>
    {/* linha divisória */}
    <line x1="12" y1="47" x2="60" y2="47"
      stroke="rgba(76,175,80,0.45)" strokeWidth="0.8"/>
    {/* subtexto */}
    <text x="36" y="56" textAnchor="middle" fontSize="6.5"
      fill="#2e7d32" fontFamily="sans-serif" fontWeight="700">Cloro Livre</text>
    <text x="36" y="64" textAnchor="middle" fontSize="5"
      fill="#388e3c" fontFamily="monospace">Curva 598</text>
    {/* Merck */}
    <text x="36" y="72" textAnchor="middle" fontSize="7"
      fill="#cc0033" fontFamily="Arial,sans-serif" fontWeight="900">Merck</text>
    {/* clip art pó */}
    <line x1="13" y1="20" x2="13" y2="88" stroke="rgba(76,175,80,0.28)" strokeWidth="0.7"/>
    <line x1="59" y1="20" x2="59" y2="88" stroke="rgba(76,175,80,0.28)" strokeWidth="0.7"/>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — FOTÔMETRO MERCK SPECTROQUANT PROVE 300 (ST598 / Cl₂)
═══════════════════════════════════════════════════════════ */
const FotometroCloretoMkSVG = ({
  cubetaAguaDentro = false,
  cubetaDentro = false, corCubeta = 'rgba(220,235,255,0.08)',
  reconhecendo = false, kitReconhecido = false,
  zerando = false, zerado = false,
  lendo = false, resultado = null,
  zeroAtivo = false, lerAtivo = false,
  onZero, onLer,
}) => (
  <svg width="240" height="214" viewBox="0 0 240 214">
    <defs>
      <linearGradient id="clmkSqBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#e8eaec"/>
        <stop offset="100%" stopColor="#cdd0d4"/>
      </linearGradient>
      <linearGradient id="clmkSqScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001a2c"/>
        <stop offset="100%" stopColor="#00101c"/>
      </linearGradient>
      <filter id="clmkSqSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".28"/></filter>
    </defs>

    <g filter="url(#clmkSqSh)">
      <rect x="4" y="4" width="232" height="206" rx="12"
        fill="url(#clmkSqBody)" stroke="#b0b5ba" strokeWidth="1.5"/>
    </g>

    {/* header Merck */}
    <rect x="4" y="4" width="232" height="30" rx="12" fill="#cc0033"/>
    <rect x="4" y="20" width="232" height="14" fill="#cc0033"/>
    <text x="70"  y="18" textAnchor="middle" fontSize="10"
      fill="white" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="2">Merck</text>
    <text x="168" y="18" textAnchor="middle" fontSize="7.5"
      fill="rgba(255,255,255,0.85)" fontFamily="Arial,sans-serif" letterSpacing="1">Spectroquant®</text>
    <text x="120" y="28" textAnchor="middle" fontSize="5.5"
      fill="rgba(255,255,255,0.75)" fontFamily="sans-serif">Prove 300 · ST598 · Cloro Livre · Curva 598</text>

    {/* Display */}
    <rect x="12" y="38" width="156" height="100" rx="6"
      fill="url(#clmkSqScr)" stroke="#004060" strokeWidth="1.2"/>
    <rect x="14" y="40" width="152" height="96" rx="5" fill="rgba(0,30,50,0.35)"/>

    {resultado !== null ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">ST598 · CLORO LIVRE · Curva 598</text>
        <line x1="18" y1="62" x2="162" y2="62"
          stroke="rgba(110,231,183,0.22)" strokeWidth="0.8"/>
        <text x="85" y="94" textAnchor="middle" fontSize="30"
          fill="#00ff88" fontFamily="'Courier New',monospace" fontWeight="700">{resultado}</text>
        <text x="159" y="94" textAnchor="end" fontSize="9"
          fill="#00cc66" fontFamily="monospace">mg/L</text>
        <text x="159" y="103" textAnchor="end" fontSize="9"
          fill="#00cc66" fontFamily="monospace">Cl₂</text>
        <text x="90" y="120" textAnchor="middle" fontSize="6.5"
          fill="#00aa88" fontFamily="monospace">✓ Leitura concluída · Curva 598</text>
        <text x="90" y="130" textAnchor="middle" fontSize="5.5"
          fill="#007744" fontFamily="sans-serif">Cloro Livre · 0,05–5,0 mg/L Cl₂ · 10 mm</text>
      </>
    ) : lendo ? (
      <>
        <text x="90" y="60" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">ST598 · CLORO LIVRE</text>
        <text x="90" y="84" textAnchor="middle" fontSize="14"
          fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x="22" y="96" width="136" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="22" y="96" width="0" height="5" rx="2.5" fill="rgba(110,231,183,0.65)">
          <animate attributeName="width" from="0" to="136" dur="2.5s" fill="freeze"/>
        </rect>
        <text x="90" y="120" textAnchor="middle" fontSize="6"
          fill="#475569" fontFamily="monospace">Calculando Cl₂ livre · Curva 598...</text>
      </>
    ) : reconhecendo ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#fbbf24" fontFamily="monospace">RECONHECENDO KIT...</text>
        <text x="90" y="78" textAnchor="middle" fontSize="10"
          fill="#fbbf24" fontFamily="monospace">ST598</text>
        <rect x="22" y="87" width="136" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="22" y="87" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="136" dur="2s" fill="freeze"/>
        </rect>
        <text x="90" y="107" textAnchor="middle" fontSize="6"
          fill="#78716c" fontFamily="monospace">Kit ST598 · Curva 598 · ajustando...</text>
        <text x="90" y="120" textAnchor="middle" fontSize="5.5"
          fill="#4b5563" fontFamily="monospace">Cloro Livre · 0,05–5,0 mg/L Cl₂</text>
      </>
    ) : kitReconhecido && !cubetaDentro ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">ST598 ✓ · Curva 598 ajustada</text>
        <line x1="18" y1="62" x2="162" y2="62"
          stroke="rgba(110,231,183,0.20)" strokeWidth="0.8"/>
        <text x="90" y="82" textAnchor="middle" fontSize="10"
          fill="#3b82f6" fontFamily="monospace">PRONTO ✓</text>
        <text x="90" y="98" textAnchor="middle" fontSize="7.5"
          fill="#60a5fa" fontFamily="monospace">Inserir cubeta c/ amostra</text>
        <text x="90" y="114" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">Cloro Livre · 10 mm · Curva 598</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">ST598 ✓</text>
        <text x="90" y="80" textAnchor="middle" fontSize="11"
          fill="#0ea5e9" fontFamily="monospace">PRONTO</text>
        <text x="90" y="96" textAnchor="middle" fontSize="7"
          fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="90" y="112" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">
          {lerAtivo ? 'Pressione LER para leitura' : 'Curva 598 · Cl₂ · 10 mm'}
        </text>
      </>
    ) : zerado && !cubetaAguaDentro ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">ZERADO ✓ · Curva 598</text>
        <line x1="18" y1="62" x2="162" y2="62"
          stroke="rgba(110,231,183,0.20)" strokeWidth="0.8"/>
        <text x="90" y="82" textAnchor="middle" fontSize="10.5"
          fill="#3b82f6" fontFamily="monospace">ZERO ✓</text>
        <text x="90" y="96" textAnchor="middle" fontSize="7.5"
          fill="#60a5fa" fontFamily="monospace">0.000 mg/L Cl₂</text>
        <text x="90" y="112" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">Inserir cubeta com amostra</text>
      </>
    ) : zerando ? (
      <>
        <text x="90" y="58" textAnchor="middle" fontSize="6.5"
          fill="#fbbf24" fontFamily="monospace">ZERANDO...</text>
        <text x="90" y="78" textAnchor="middle" fontSize="9.5"
          fill="#fbbf24" fontFamily="monospace">Curva 598</text>
        <rect x="22" y="87" width="136" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="22" y="87" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="136" dur="2s" fill="freeze"/>
        </rect>
        <text x="90" y="110" textAnchor="middle" fontSize="5.5"
          fill="#475569" fontFamily="monospace">Selecionando Curva 598 · ST598...</text>
      </>
    ) : cubetaAguaDentro ? (
      <>
        <text x="90" y="62" textAnchor="middle" fontSize="8"
          fill="#0ea5e9" fontFamily="monospace">Água destilada</text>
        <text x="90" y="80" textAnchor="middle" fontSize="9"
          fill="#60a5fa" fontFamily="monospace">inserida ✓</text>
        <text x="90" y="98" textAnchor="middle" fontSize="7"
          fill="#3a6a9a" fontFamily="sans-serif">
          {zeroAtivo ? 'Pressione ZERO para zerar' : 'Curva 598 · Cloro Livre'}
        </text>
      </>
    ) : (
      <>
        <text x="90" y="66" textAnchor="middle" fontSize="9.5"
          fill="#003c50" fontFamily="monospace">STANDBY</text>
        <text x="90" y="88" textAnchor="middle" fontSize="6.5"
          fill="#001a24" fontFamily="sans-serif">Aguardando cubeta...</text>
        <text x="90" y="104" textAnchor="middle" fontSize="5.5"
          fill="#002030" fontFamily="monospace">Kit ST598 · Curva 598</text>
      </>
    )}

    {/* Compartimento de leitura */}
    <rect x="176" y="38" width="60" height="100" rx="5"
      fill="#1a1a1a"
      stroke={
        cubetaDentro ? '#00cc66'
        : reconhecendo ? '#f59e0b'
        : cubetaAguaDentro ? '#0ea5e9'
        : zerado ? '#1e4d8a'
        : '#3a3a3a'
      }
      strokeWidth="1.5"/>
    {/* glow estado */}
    {reconhecendo && (
      <rect x="176" y="38" width="60" height="100" rx="5"
        fill="none" stroke="rgba(251,191,36,0.45)" strokeWidth="4">
        <animate attributeName="opacity" from="0.9" to="0.1" dur="0.7s" repeatCount="indefinite"/>
      </rect>
    )}
    <text x="206" y="56" textAnchor="middle" fontSize="5.5"
      fill={reconhecendo ? '#f59e0b' : '#4a4a4a'} fontFamily="monospace">10 mm</text>

    {/* conteúdo compartimento */}
    {cubetaDentro ? (
      /* cubeta amostra reagida */
      <g>
        <rect x="186" y="62" width="40" height="58" rx="2"
          fill={corCubeta} stroke="rgba(200,200,200,0.45)" strokeWidth="1"/>
        <rect x="188" y="64" width="6" height="50" fill="rgba(255,255,255,0.16)"/>
        <line x1="222" y1="70" x2="225" y2="70"
          stroke="rgba(200,200,200,0.65)" strokeWidth="1.2"/>
      </g>
    ) : cubetaAguaDentro ? (
      /* cubeta de água destilada */
      <g>
        <rect x="186" y="62" width="40" height="58" rx="2"
          fill="rgba(195,225,255,0.65)" stroke="rgba(180,220,255,0.55)" strokeWidth="1"/>
        <rect x="188" y="64" width="6" height="50" fill="rgba(255,255,255,0.28)"/>
        <line x1="222" y1="70" x2="225" y2="70"
          stroke="rgba(150,200,255,0.65)" strokeWidth="1.2"/>
        <text x="206" y="116" textAnchor="middle" fontSize="5"
          fill="rgba(100,150,200,0.70)" fontFamily="monospace">H₂O dest.</text>
      </g>
    ) : reconhecendo ? (
      /* cubeta dentro durante reconhecimento ST598 */
      <g>
        <rect x="186" y="62" width="40" height="58" rx="2"
          fill={corCubeta} stroke="rgba(200,200,200,0.45)" strokeWidth="1"/>
        <rect x="188" y="64" width="6" height="50" fill="rgba(255,255,255,0.14)"/>
        {/* glow âmbar */}
        <rect x="186" y="62" width="40" height="58" rx="2"
          fill="rgba(251,191,36,0.18)">
          <animate attributeName="opacity" from="0.9" to="0.1" dur="0.6s" repeatCount="indefinite"/>
        </rect>
        {/* LED âmbar */}
        <circle cx="206" cy="68" r="4" fill="rgba(251,191,36,0.90)">
          <animate attributeName="opacity" from="1" to="0.15" dur="0.4s" repeatCount="indefinite"/>
        </circle>
      </g>
    ) : (
      <rect x="186" y="62" width="40" height="58" rx="2"
        fill="rgba(5,12,25,0.60)" stroke="#1a1a1a" strokeWidth="0.8"
        strokeDasharray="4,2"/>
    )}
    <circle cx="171" cy="100" r="4"
      fill={
        cubetaDentro ? 'rgba(0,204,102,0.8)'
        : reconhecendo ? 'rgba(251,191,36,0.85)'
        : cubetaAguaDentro ? 'rgba(14,165,233,0.80)'
        : zerado ? 'rgba(30,120,220,0.50)'
        : 'rgba(0,50,80,0.22)'
      }
      stroke="rgba(0,100,170,0.35)" strokeWidth="1">
      {reconhecendo && (
        <animate attributeName="opacity" from="1" to="0.2" dur="0.5s" repeatCount="indefinite"/>
      )}
    </circle>

    {/* Painel botões */}
    <rect x="12" y="146" width="224" height="58" rx="6"
      fill="#bfc2c6" stroke="#a0a5aa" strokeWidth="0.8"/>

    {/* Botão ZERO */}
    <g onClick={onZero} style={{ cursor: zeroAtivo ? 'pointer' : 'default' }}>
      <rect x="20" y="154" width="60" height="22" rx="5"
        fill={zeroAtivo ? '#0f4020' : '#6b7280'}
        stroke={zeroAtivo ? '#00cc44' : '#4b5563'} strokeWidth={zeroAtivo ? 1.8 : 1}/>
      {zeroAtivo && (
        <rect x="20" y="154" width="60" height="22" rx="5"
          fill="none" stroke="rgba(0,204,80,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
      <text x="50" y="168" textAnchor="middle" fontSize="8.5"
        fill={zeroAtivo ? '#00ff66' : '#d1d5db'} fontFamily="monospace"
        fontWeight={zeroAtivo ? '700' : '400'}>ZERO</text>
    </g>

    {/* Botão LER */}
    <g onClick={onLer} style={{ cursor: lerAtivo ? 'pointer' : 'default' }}>
      <rect x="92" y="154" width="60" height="22" rx="5"
        fill={lerAtivo ? '#0f2a48' : '#6b7280'}
        stroke={lerAtivo ? '#00aacc' : '#4b5563'} strokeWidth={lerAtivo ? 1.8 : 1}/>
      {lerAtivo && (
        <rect x="92" y="154" width="60" height="22" rx="5"
          fill="none" stroke="rgba(0,170,204,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
      <text x="122" y="168" textAnchor="middle" fontSize="8.5"
        fill={lerAtivo ? '#00ddff' : '#d1d5db'} fontFamily="monospace"
        fontWeight={lerAtivo ? '700' : '400'}>LER</text>
    </g>

    <g>
      <rect x="163" y="154" width="60" height="22" rx="5"
        fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
      <text x="193" y="168" textAnchor="middle" fontSize="8"
        fill="#d1d5db" fontFamily="monospace">MENU</text>
    </g>

    <text x="120" y="194" textAnchor="middle" fontSize="6"
      fill="#6b7280" fontFamily="sans-serif">Spectroquant® Prove 300 · Merck KGaA</text>
    <text x="120" y="204" textAnchor="middle" fontSize="5.5"
      fill="#9ca3af" fontFamily="monospace">ST598 · Cloro Livre · 0,05–5,0 mg/L Cl₂ · 10 mm</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const CloroMk = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'clmk-anim-styles';
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

  // ── pH ────────────────────────────────────────────────
  const [pHAtual,      setPHAtual]      = useState(9.2);
  const [pHOk,         setPHOk]         = useState(false);
  const [ajustandopH,  setAjustandopH]  = useState(false);

  // ── Amostra / micropipeta ─────────────────────────────
  const [nivelAmostra,      setNivelAmostra]      = useState(82);
  const [micropipetaAtiva,  setMicropipetaAtiva]  = useState(false);
  const [micropipetaComAm,  setMicropipetaComAm]  = useState(false);

  // ── Béquer ────────────────────────────────────────────
  const [nivelBequer,   setNivelBequer]   = useState(0);
  const [corBequer,     setCorBequer]     = useState('rgba(220,235,255,0.08)');
  const [bequerConteudo,setBequerConteudo]= useState(null);
  // null | 'amostra' | 'amostra_st598' | 'reagido'
  const [agitando,      setAgitando]      = useState(false);
  const [envelopeUsado, setEnvelopeUsado] = useState(false);

  // ── Partículas de pó (step 4) ─────────────────────────
  const [mostrarPo, setMostrarPo] = useState(false);
  const [poKey,     setPoKey]     = useState(0);

  // ── Timer reação 1 min (3 s) ──────────────────────────
  const [timerAtivo,     setTimerAtivo]     = useState(false);
  const [timerProgresso, setTimerProgresso] = useState(0);
  const [podeAgitar,     setPodeAgitar]     = useState(false);

  // ── Cubeta amostra ────────────────────────────────────
  const [nivelCubeta,      setNivelCubeta]      = useState(0);
  const [corCubeta,        setCorCubeta]         = useState('rgba(220,235,255,0.08)');
  const [cubetaComAmostra, setCubetaComAmostra]  = useState(false);
  const [cubetaNoFoto,     setCubetaNoFoto]      = useState(false);

  // ── Cubeta de água destilada ──────────────────────────
  const [cubetaAguaNoFoto, setCubetaAguaNoFoto] = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [zerando,       setZerando]       = useState(false);
  const [zerado,        setZerado]        = useState(false);
  const [reconhecendo,  setReconhecendo]  = useState(false);
  const [kitReconhecido,setKitReconhecido]= useState(false);
  const [lendo,         setLendo]         = useState(false);
  const [resultado,     setResultado]     = useState(null);


  // ── TIMER: reação 1 min (3 s) ─────────────────────────
  useEffect(() => {
    if (!timerAtivo) return;
    setTimerProgresso(0);
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 100 / 30, 100);
      setTimerProgresso(p);
    }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimerAtivo(false);
      setTimerProgresso(100);
      setBequerConteudo('reagido');
      setCorBequer('rgba(160,220,150,0.72)'); // verde-amarelado do complexo de cloro livre
      setAgitando(false);
      celebrarAcerto(100);
      proximaEtapa(); // → etapa 6
    }, 3000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timerAtivo]);

  // ── Partículas pó: ocultar após 1,8 s ────────────────
  useEffect(() => {
    if (!mostrarPo) return;
    const id = setTimeout(() => setMostrarPo(false), 1800);
    return () => clearTimeout(id);
  }, [mostrarPo]);

  // ── Reconhecimento ST598 (2 s) ────────────────────────
  useEffect(() => {
    if (!reconhecendo) return;
    const id = setTimeout(() => {
      setReconhecendo(false);
      setKitReconhecido(true);
      celebrarAcerto(150);
      proximaEtapa(); // → etapa 10
    }, 2000);
    return () => clearTimeout(id);
  }, [reconhecendo]);

  // ── pH: ajuste animado (1,2 s) ────────────────────────
  useEffect(() => {
    if (!ajustandopH) return;
    const alvo = 6.5;
    const inicio = pHAtual;
    const passos = 12;
    let i = 0;
    const id = setInterval(() => {
      i++;
      const t = i / passos;
      setPHAtual(parseFloat((inicio + (alvo - inicio) * t).toFixed(1)));
      if (i >= passos) {
        clearInterval(id);
        setAjustandopH(false);
        setPHOk(true);
        setTimeout(() => { celebrarAcerto(80); proximaEtapa(); }, 400);
      }
    }, 100);
    return () => clearInterval(id);
  }, [ajustandopH]);


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

    // E2 — MICROPIPETA → AMOSTRA
    if (itemDrop === 'micropipeta' && alvo === 'amostra' && etapaAtual === 2) {
      setItemSegurado(null);
      setMicropipetaComAm(true);
      setNivelAmostra(n => Math.max(n - 22, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — MICROPIPETA → BÉQUER
    if (itemDrop === 'micropipeta' && alvo === 'bequer' && etapaAtual === 3) {
      setItemSegurado(null);
      setMicropipetaComAm(false);
      setNivelBequer(28);
      setCorBequer('rgba(195,222,255,0.60)');
      setBequerConteudo('amostra');
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — ENVELOPE ST598 → BÉQUER
    if (itemDrop === 'envelope_st598' && alvo === 'bequer' && etapaAtual === 4) {
      setItemSegurado(null);
      setEnvelopeUsado(true);
      setBequerConteudo('amostra_st598');
      setCorBequer('rgba(185,235,180,0.60)');
      setNivelBequer(30);
      setPoKey(k => k + 1);
      setMostrarPo(true);
      setPodeAgitar(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E6 — BÉQUER → CUBETA
    if (itemDrop === 'bequer' && alvo === 'cubeta' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelCubeta(76);
      setCorCubeta(corBequer);
      setCubetaComAmostra(true);
      setNivelBequer(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E7 — CUBETA ÁGUA → FOTÔMETRO
    if (itemDrop === 'cubeta_agua' && alvo === 'fotometro' && etapaAtual === 7) {
      setItemSegurado(null);
      setCubetaAguaNoFoto(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E9 — CUBETA AMOSTRA → FOTÔMETRO (reconhecimento)
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && etapaAtual === 9) {
      setItemSegurado(null);
      setCubetaNoFoto(true);
      setReconhecendo(true); // 2s → proximaEtapa internamente
      return;
    }
  };


  // ── Click: ajustar pH (step 0) ───────────────────────
  const handleAjustarPH = () => {
    if (etapaAtual !== 0 || pHOk || ajustandopH) return;
    setAjustandopH(true);
  };

  // ── Click: selecionar micropipeta (step 1) ────────────
  const handleClicarMicropipeta = () => {
    if (etapaAtual !== 1 || micropipetaAtiva) return;
    setMicropipetaAtiva(true);
    celebrarAcerto(80); proximaEtapa();
  };

  // ── Click: agitar béquer (step 5) ────────────────────
  const handleAgitarBequer = () => {
    if (etapaAtual !== 5 || !podeAgitar || agitando || timerAtivo) return;
    setAgitando(true);
    setTimeout(() => {
      setTimerAtivo(true);
    }, 800); // shake 0,8s depois inicia timer
  };

  // ── Click: ZERO (step 8) ─────────────────────────────
  const handleZerarFotometro = () => {
    if (etapaAtual !== 8 || !cubetaAguaNoFoto || zerando || zerado) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaAguaNoFoto(false);
      celebrarAcerto(150);
      proximaEtapa(); // → etapa 9
    }, 2200);
  };

  // ── Click: LER (step 10) ─────────────────────────────
  const handleLerFotometro = () => {
    if (etapaAtual !== 10 || !cubetaNoFoto || !kitReconhecido || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * (5.0 - 0.05) + 0.05).toFixed(2));
      setResultado(raw.toFixed(2));
      setLendo(false);
      celebrarAcerto(200);
      setTimeout(() => proximaEtapa(), 2000);
    }, 2500);
  };


  // ── Derivados ─────────────────────────────────────────
  const micropipetaDrag   = isItem('micropipeta') && micropipetaAtiva && (etapaAtual === 2 || etapaAtual === 3);
  const envelopeDrag      = isItem('envelope_st598') && !envelopeUsado;
  const bequerDrag        = isItem('bequer') && bequerConteudo === 'reagido' && nivelBequer > 0;
  const cubetaAguaDrag    = isItem('cubeta_agua') && !cubetaAguaNoFoto && !zerado;
  const cubetaDrag        = isItem('cubeta') && cubetaComAmostra && !cubetaNoFoto;
  const podeAgitarBequer  = etapaAtual === 5 && podeAgitar && !agitando && !timerAtivo;
  const zeroAtivo         = etapaAtual === 8 && cubetaAguaNoFoto && !zerando && !zerado;
  const lerAtivo          = etapaAtual === 10 && cubetaNoFoto && kitReconhecido && !lendo && !resultado;


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
          <div style={{ background:'linear-gradient(135deg,#064e3b,#059669,#34d399)', color:'white', padding:'20px 36px', borderRadius:22, boxShadow:'0 16px 40px rgba(0,0,0,0.35)', border:'2px solid rgba(255,255,255,0.9)', textAlign:'center' }}>
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
          <div style={{ background:'linear-gradient(135deg,#064e3b,#059669,#10b981)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:16, fontWeight:900, animation:'clmkTimerPulse 1s ease-in-out infinite' }}>
              ⚗️ Reação em andamento — Aguardar 1 minuto
            </div>
            <div style={{ marginTop:8, height:6, background:'rgba(255,255,255,0.15)', borderRadius:4, overflow:'hidden', minWidth:240 }}>
              <div style={{ height:'100%', width:`${timerProgresso}%`, background:'rgba(52,211,153,0.85)', borderRadius:4, transition:'width 0.1s linear' }}/>
            </div>
            <div style={{ fontSize:11, marginTop:4, color:'rgba(255,255,255,0.78)' }}>
              {Math.floor(timerProgresso)}% · ST598 · Desenvolvimento de cor · Cloro Livre
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RECONHECIMENTO ST598 ── */}
      {reconhecendo && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#1e3a5f,#2563eb,#3b82f6)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:16, fontWeight:900, animation:'clmkTimerPulse 0.8s ease-in-out infinite' }}>
              🔍 Reconhecendo Kit ST598...
            </div>
            <div style={{ fontSize:11, marginTop:6, color:'rgba(255,255,255,0.78)' }}>
              Curva 598 · Cloro Livre · 0,05–5,0 mg/L Cl₂ · 10 mm
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RESULTADO ── */}
      {resultado && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#064e3b,#059669,#10b981)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:17, fontWeight:900 }}>🟢 Leitura Concluída — Curva 598</div>
            <div style={{ fontSize:12, marginTop:4 }}>Cloro Livre: <strong>{resultado} mg/L Cl₂</strong> · ST598 · Merck</div>
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
            <h2 style={{ fontSize:26, fontWeight:900, color:'#34d399', margin:'8px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color:'#64748b', fontSize:12, margin:'0 0 20px' }}>
              Cloro Livre · Kit ST598 · Curva 598 · Fotometria
            </p>
            <div style={{ background:'rgba(204,0,51,0.08)', border:'1px solid rgba(204,0,51,0.28)', borderRadius:14, padding:'14px 22px', marginBottom:14 }}>
              <div style={{ fontSize:10, color:'#94a3b8', marginBottom:8 }}>Dados da Análise</div>
              <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
                {[
                  { label:'Kit',         val:'ST598',                 cor:'#cc0033' },
                  { label:'Curva',       val:'598',                   cor:'#34d399' },
                  { label:'Analito',     val:'Cloro Livre (Cl₂)',     cor:'#6ee7b7' },
                  { label:'Faixa',       val:'0,05–5,0 mg/L Cl₂',    cor:'#60a5fa' },
                  { label:'Célula',      val:'10 mm',                 cor:'#fbbf24' },
                  { label:'V. amostra',  val:'10 mL',                 cor:'#a78bfa' },
                  { label:'Reagente',    val:'Envelope ST598',        cor:'#86efac' },
                  { label:'Reação',      val:'1 minuto',              cor:'#fb923c' },
                  { label:'pH amostra',  val:'4 – 8',                 cor:'#f0abfc' },
                  { label:'Zeragem',     val:'H₂O dest. · 1×/semana', cor:'#93c5fd' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'#94a3b8', marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(52,211,153,0.10)', border:'1px solid rgba(52,211,153,0.35)', borderRadius:14, padding:'18px 36px', marginBottom:14 }}>
              <div style={{ fontSize:13, color:'#94a3b8', marginBottom:6 }}>Resultado — Cloro Livre</div>
              <div style={{ fontSize:52, fontWeight:900, color:'#34d399', fontFamily:'monospace', lineHeight:1 }}>{resultado}</div>
              <div style={{ fontSize:14, color:'#6ee7b7', fontWeight:700, marginTop:4 }}>mg/L Cl₂</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'8px 14px', marginBottom:10, fontSize:9, color:'#64748b', textAlign:'left' }}>
              📋 <strong style={{ color:'#94a3b8' }}>Método:</strong> Merck Spectroquant · Curva 598 · Cloro Livre<br/>
              🔬 <strong style={{ color:'#94a3b8' }}>Reagente:</strong> Envelope ST598 · Reação 1 min<br/>
              📏 <strong style={{ color:'#94a3b8' }}>Faixa:</strong> 0,05–5,0 mg/L Cl₂ (10 mm) · pH 4–8<br/>
              ⚙️ <strong style={{ color:'#94a3b8' }}>Zeragem:</strong> Água destilada · 1× por semana (Prove 300).
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
        titulo="Cloro Livre — Kit Merck ST598 (Curva 598)"
        subtitulo={"Fotômetro Merck Spectroquant® Prove 300\nCloro Livre · 0,05–5,0 mg/L Cl₂ · pH 4–8"}
        icone="🟩"
        badges={['🔴 MERCK','⚗️ ST598 · CLORO LIVRE']}
        footerLabel="🟩 Cloro Livre Merck ST598"
      >
        <div style={{ background:'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius:26, padding:'22px 18px', border:'8px solid #8b6e45', boxShadow:'0 24px 80px rgba(0,0,0,0.6)', minWidth:990 }}>
          <h2 style={{ textAlign:'center', color:'#4a3010', fontSize:14, fontWeight:900, marginBottom:14, letterSpacing:0.6 }}>
            🟩 Bancada — Cloro Livre · Kit Merck ST598 · Curva 598 · 0,05–5,0 mg/L Cl₂
          </h2>

          <div style={{ background:'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius:20, padding:'18px 16px', border:'4px solid #292524', boxShadow:'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:10, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:12 }}>

              {/* BÉQUER 250 mL */}
              <div style={{ flex:1.3, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="bequer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('bequer')}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, position:'relative',
                      cursor: podeAgitarBequer ? 'pointer' : 'default',
                    }}
                    onClick={handleAgitarBequer}>

                    {/* partículas de pó ST598 */}
                    <div style={{ position:'relative', width:'100%', height:0, overflow:'visible' }}>
                      {mostrarPo && (
                        <>
                          <ParticulaPo key={`pa-${poKey}`} offsetX={-12} animName="clmkPowderFall"  delay={0}   animKey={`pa-${poKey}`}/>
                          <ParticulaPo key={`pb-${poKey}`} offsetX={0}   animName="clmkPowderFall2" delay={120} animKey={`pb-${poKey}`}/>
                          <ParticulaPo key={`pc-${poKey}`} offsetX={10}  animName="clmkPowderFall"  delay={240} animKey={`pc-${poKey}`}/>
                          <ParticulaPo key={`pd-${poKey}`} offsetX={-5}  animName="clmkPowderFall3" delay={360} animKey={`pd-${poKey}`}/>
                          <ParticulaPo key={`pe-${poKey}`} offsetX={14}  animName="clmkPowderFall2" delay={480} animKey={`pe-${poKey}`}/>
                          <ParticulaPo key={`pf-${poKey}`} offsetX={-14} animName="clmkPowderFall3" delay={600} animKey={`pf-${poKey}`}/>
                        </>
                      )}
                    </div>

                    <div
                      className={`item-drag ${itemCls('bequer')}`}
                      draggable={bequerDrag}
                      onDragStart={e => handleDragStart('bequer', e)}
                      onDragEnd={handleDragEnd}
                      style={{ cursor: bequerDrag ? 'grab' : podeAgitarBequer ? 'pointer' : 'default' }}>
                      <BequerSVG nivel={nivelBequer} cor={corBequer} agitando={agitando || timerAtivo}/>
                    </div>

                    {podeAgitarBequer && (
                      <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', fontSize:8, color:'#fbbf24', fontWeight:700, whiteSpace:'nowrap', animation:'clmkTimerPulse 0.9s ease-in-out infinite' }}>
                        👆 Clicar para agitar
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {bequerDrag ? '🖱️ ' : ''}Béquer 250 mL
                  </span>
                  <span style={{ fontSize:8, color:
                    bequerConteudo === 'reagido'     ? '#34d399'
                    : bequerConteudo === 'amostra_st598' ? '#a7f3d0'
                    : bequerConteudo === 'amostra'   ? '#60a5fa' : '#94a3b8' }}>
                    {timerAtivo               ? `⚗️ Reagindo ${Math.floor(timerProgresso)}%`
                      : bequerConteudo === 'reagido'     ? '🟢 Reação concluída'
                      : bequerConteudo === 'amostra_st598' ? '🌿 Amostra + ST598'
                      : bequerConteudo === 'amostra'     ? '💧 10 mL amostra'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA LEITURA 10 mm */}
              <div style={{ flex:0.85, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('cubeta')} ${itemCls('cubeta')}`}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, opacity: cubetaNoFoto ? 0.18 : 1, transition:'opacity 0.3s' }}
                    draggable={cubetaDrag}
                    onDragStart={e => handleDragStart('cubeta', e)} onDragEnd={handleDragEnd}>
                    <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="clmka"/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cubetaDrag ? '🖱️ ' : ''}Cubeta 10 mm
                  </span>
                  <span style={{ fontSize:8, color: nivelCubeta > 0 ? '#6ee7b7' : '#94a3b8' }}>
                    {cubetaNoFoto ? '✓ No fotômetro' : nivelCubeta > 0 ? '🟢 Solução reagida' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA ÁGUA DESTILADA */}
              <div style={{ flex:0.85, display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('cubeta_agua')}`}
                    draggable={cubetaAguaDrag}
                    onDragStart={e => handleDragStart('cubeta_agua', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: cubetaAguaDrag ? 'grab' : 'default', opacity: cubetaAguaNoFoto || zerado ? 0.20 : 1, transition:'opacity 0.3s' }}>
                    <CubetaSVG cor="rgba(195,225,255,0.68)" nivel={72} id="clmkb"/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cubetaAguaDrag ? '🖱️ ' : ''}Cubeta — Água Dest.
                  </span>
                  <span style={{ fontSize:8, color: zerado ? '#34d399' : '#94a3b8' }}>
                    {zerado ? '✓ Usado (zero)' : 'H₂O destilada · zeragem'}
                  </span>
                </div>
              </div>

              {/* FOTÔMETRO MERCK PROVE 300 */}
              <div style={{ flex:3, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('fotometro')}
                    style={{ background:'rgba(255,255,255,0.06)', borderRadius:13, padding:'10px 12px' }}>
                    <FotometroCloretoMkSVG
                      cubetaAguaDentro={cubetaAguaNoFoto}
                      cubetaDentro={cubetaNoFoto}
                      corCubeta={corCubeta}
                      reconhecendo={reconhecendo}
                      kitReconhecido={kitReconhecido}
                      zerando={zerando}
                      zerado={zerado}
                      lendo={lendo}
                      resultado={resultado}
                      zeroAtivo={zeroAtivo}
                      lerAtivo={lerAtivo}
                      onZero={handleZerarFotometro}
                      onLer={handleLerFotometro}
                    />
                    {zeroAtivo && (
                      <div style={{ textAlign:'center', fontSize:8, color:'#00ff66', fontWeight:700, marginTop:4 }}>
                        🟢 Clique ZERO para zerar!
                      </div>
                    )}
                    {lerAtivo && (
                      <div style={{ textAlign:'center', fontSize:8, color:'#00ddff', fontWeight:700, marginTop:4 }}>
                        🔵 Clique LER para a leitura!
                      </div>
                    )}
                    {(zerando || lendo || reconhecendo) && (
                      <div style={{ textAlign:'center', fontSize:8, color:'#fbbf24', fontWeight:700, marginTop:4 }}>
                        ⚡ Processando...
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Fotômetro Merck Spectroquant Prove 300</span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}


            {/* ══ ESTAÇÃO MICROPIPETA ═══════════════════════════════ */}
            <div style={{
              display:'flex', alignItems:'center', gap:20, justifyContent:'flex-start',
              padding:'10px 16px', marginBottom:12,
              background: etapaAtual >= 1 && etapaAtual <= 3 ? 'rgba(14,116,144,0.07)' : 'rgba(0,0,0,0.16)',
              borderRadius:14,
              border:`1px solid ${etapaAtual >= 1 && etapaAtual <= 3 ? 'rgba(103,232,249,0.28)' : 'rgba(255,255,255,0.05)'}`,
              transition:'all 0.4s',
              opacity: etapaAtual >= 1 && etapaAtual <= 3 ? 1 : 0.28,
            }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                {etapaAtual === 1 && !micropipetaAtiva && (
                  <div style={{ fontSize:8, color:'#fbbf24', fontWeight:700, animation:'clmkTimerPulse 0.9s ease-in-out infinite', marginBottom:2 }}>
                    👆 Clique aqui
                  </div>
                )}
                <div
                  className={`item-drag ${itemCls('micropipeta')}`}
                  draggable={micropipetaDrag}
                  onDragStart={e => handleDragStart('micropipeta', e)}
                  onDragEnd={handleDragEnd}
                  onClick={handleClicarMicropipeta}
                  style={{ cursor: etapaAtual === 1 && !micropipetaAtiva ? 'pointer' : micropipetaDrag ? 'grab' : 'default' }}>
                  <MicropipetaP10000SVG ativa={micropipetaAtiva} comAmostra={micropipetaComAm}/>
                </div>
                <span style={{ fontSize:8.5, fontWeight:700, color:'#e7e5e4' }}>
                  {micropipetaDrag ? '🖱️ ' : etapaAtual === 1 && !micropipetaAtiva ? '👆 ' : ''}Micropipeta P10000
                </span>
                <span style={{ fontSize:7.5, color: micropipetaComAm ? '#67e8f9' : micropipetaAtiva ? '#a5f3fc' : '#6b7280' }}>
                  {micropipetaComAm ? '💧 10 mL amostra' : micropipetaAtiva ? '✓ Selecionada' : 'Inativa'}
                </span>
              </div>

              <div style={{ fontSize:9, color:'#78716c', maxWidth:340, lineHeight:1.6 }}>
                <strong style={{ color:'#67e8f9' }}>Micropipeta P10000</strong> · Volume: 10.000 μL (10 mL)<br/>
                Usada para transferir 10 mL de amostra para o béquer de reação.
                {etapaAtual === 1 && !micropipetaAtiva && (
                  <><br/><span style={{ color:'#fbbf24', fontWeight:700 }}>← Clique na micropipeta para selecioná-la</span></>
                )}
              </div>
            </div>


            {/* ══ PAINEL AJUSTE pH (step 0) ══════════════════════ */}
            {etapaAtual === 0 && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.28)', borderRadius:12, padding:'14px 18px', border:'1px solid rgba(251,146,60,0.38)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#67e8f9', fontWeight:700 }}>🟩 Determinação de Cloro Livre — Kit Merck ST598 · Curva 598</div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:3 }}>
                    pH da amostra deve estar entre <strong style={{ color:'#34d399' }}>pH 4–8</strong>.<br/>
                    Se necessário: H₂SO₄ (reduzir pH) · NH₄OH (elevar pH) · gota a gota · filtrar se necessário.
                  </div>
                </div>
                <button onClick={handleAjustarPH} disabled={ajustandopH}
                  style={{ background: ajustandopH ? 'rgba(15,76,55,0.60)' : 'linear-gradient(90deg,#065f46,#047857)', color:'white', border:'none', borderRadius:10, padding:'10px 22px', fontSize:12, fontWeight:700, cursor: ajustandopH ? 'wait' : 'pointer', boxShadow:'0 4px 14px rgba(6,95,70,0.38)', whiteSpace:'nowrap' }}>
                  {ajustandopH ? '⚡ Ajustando pH...' : '🧪 Confirmar pH (4–8)'}
                </button>
              </div>
            )}

            {/* ══ PAINEL AGITAR (step 5) ════════════════════════ */}
            {etapaAtual === 5 && podeAgitar && !timerAtivo && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.28)', borderRadius:12, padding:'14px 18px', border:'1px solid rgba(52,211,153,0.38)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#34d399', fontWeight:700 }}>🌀 Agitar Vigorosamente até Dissolver o Reagente ST598</div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:3 }}>
                    O reagente em pó deve ser completamente dissolvido antes de iniciar o timer. Clique no béquer ou no botão ao lado para iniciar a agitação vigorosa.
                  </div>
                </div>
                <button onClick={handleAgitarBequer} disabled={agitando}
                  style={{ background:'linear-gradient(90deg,#064e3b,#047857)', color:'white', border:'none', borderRadius:10, padding:'10px 22px', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(6,78,59,0.38)', whiteSpace:'nowrap' }}>
                  🌀 Agitar e Iniciar Reação
                </button>
              </div>
            )}


            {/* ══ ZONA INFERIOR: REAGENTES ═══════════════════════════ */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, alignItems:'flex-end' }}>

              {/* FRASCO AMOSTRA */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('amostra')} style={{ pointerEvents:'none' }}>
                    <FrascoReagente cor="rgba(210,195,148,0.82)" label="Amostra" sub="Água" nivel={nivelAmostra}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Frasco de Amostra</span>
                  <span style={{ fontSize:8, color:'#94a3b8' }}>10 mL → Béquer</span>
                </ZonaDrop>
              </div>

              {/* ENVELOPE ST598 */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('envelope_st598')}`}
                    draggable={envelopeDrag}
                    onDragStart={e => handleDragStart('envelope_st598', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: envelopeDrag ? 'grab' : 'default' }}>
                    <EnvelopeST598SVG usado={envelopeUsado}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {envelopeDrag ? '🖱️ ' : ''}Envelope ST598
                  </span>
                  <span style={{ fontSize:8, color: envelopeUsado ? '#34d399' : '#94a3b8' }}>
                    {envelopeUsado ? '✓ Adicionado ao béquer' : 'Reagente em pó · → Béquer'}
                  </span>
                </div>
              </div>

              {/* ÁGUA DESTILADA FRASCO */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, opacity: 0.55 }}>
                  <FrascoReagente cor="rgba(195,225,255,0.82)" label="H₂O dest." sub="zeragem" nivel={85}/>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Água Destilada</span>
                  <span style={{ fontSize:8, color:'#94a3b8' }}>cubeta separada</span>
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

export default CloroMk;
