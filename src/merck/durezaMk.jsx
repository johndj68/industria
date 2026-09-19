/**
 * durezaMk.jsx — Determinação de Dureza Total — Método Colorimétrico da Calmagita
 *
 * Kit: Qhantye Science Solution · Código 0028631
 * Faixa: 0,05 – 2,50 mg/L Ca + Mg como CaCO₃
 * Cubeta: 50 mm · pH amostra: 4–8
 *
 * Fluxo (12 etapas, 0‑11):
 *  0  — Verificar e ajustar pH da amostra (pH 4–8)
 *  1  — Frasco de amostra → Cilindro 1 (medir 20 mL)
 *  2  — Reagente A (Tampão Dureza) → Cilindro 1 (4 gotas)
 *  3  — Reagente B (Calmagita) → Cilindro 1 (4 gotas · cor vinho)
 *  4  — Cilindro 1 → Cilindro 2 (transferir 10 mL · Branco)
 *  5  — Reagente C (EDTA) → Cilindro 2 (10 gotas · cor azul)
 *  6  — Cilindro 2 → Cubeta Branco 50 mm
 *  7  — Cubeta Branco → Fotômetro (ajuste de zero)
 *  8  — Clicar ZERO
 *  9  — Cilindro 1 → Cubeta Amostra 50 mm
 * 10  — Cubeta Amostra → Fotômetro
 * 11  — Clicar LER → resultado mg/L CaCO₃
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';


/* ═══════════════════════════════════════════════════════════
   DADOS — 12 etapas
═══════════════════════════════════════════════════════════ */
const etapas = [
  {
    id: 0,
    titulo: 'Verificar e Ajustar o pH da Amostra (pH 4–8)',
    descricao: 'Verifique o pH da amostra. A faixa especificada pelo kit é pH 4–8. Se necessário, ajuste gota a gota com solução de NaOH (elevar pH) ou HCl (reduzir pH). Clique em "Confirmar pH" quando o valor estiver dentro da faixa.',
    item: null, alvo: null,
  },
  {
    id: 1,
    titulo: 'Medir 20 mL de Amostra no Cilindro Graduado 1',
    descricao: 'Arraste o frasco de amostra até o Cilindro Graduado 1 (com tampa) para medir e transferir exatamente 20 mL. O cilindro ficará marcado com 20 mL de amostra.',
    item: 'frasco_amostra', alvo: 'cilindro1',
  },
  {
    id: 2,
    titulo: 'Adicionar 4 Gotas de Reagente A (Tampão Dureza) ao Cilindro 1',
    descricao: 'Arraste o frasco do Reagente A (Tampão Dureza) até o Cilindro 1 para adicionar exatamente 4 gotas. Tampe e misture suavemente após a adição.',
    item: 'reagente_a', alvo: 'cilindro1',
  },
  {
    id: 3,
    titulo: 'Adicionar 4 Gotas de Reagente B (Indicador Calmagita) ao Cilindro 1',
    descricao: 'Arraste o frasco do Reagente B (Indicador de Dureza – Calmagita) até o Cilindro 1 para adicionar 4 gotas. A solução desenvolverá coloração vinho/carmim na presença de Ca²⁺ e Mg²⁺. Tampe e misture.',
    item: 'reagente_b', alvo: 'cilindro1',
  },
  {
    id: 4,
    titulo: 'Transferir 10 mL do Cilindro 1 para o Cilindro 2 (Branco)',
    descricao: 'Arraste o Cilindro 1 até o Cilindro Graduado 2 para transferir exatamente 10 mL da solução (Branco da Amostra). O Cilindro 1 manterá os 10 mL restantes para a leitura da amostra.',
    item: 'cilindro1', alvo: 'cilindro2',
  },
  {
    id: 5,
    titulo: 'Adicionar 10 Gotas de Reagente C (EDTA) ao Cilindro 2',
    descricao: 'Arraste o frasco do Reagente C (EDTA) até o Cilindro 2 (Branco) para adicionar 10 gotas. O EDTA complexará os íons metálicos, tornando a solução azulada. Tampe e misture bem. Este é o Branco Final.',
    item: 'reagente_c', alvo: 'cilindro2',
  },
  {
    id: 6,
    titulo: 'Transferir Branco (Cilindro 2) para a Cubeta de 50 mm',
    descricao: 'Arraste o Cilindro 2 (Branco Final com EDTA) até a Cubeta de 50 mm para transferir o conteúdo. A cubeta ficará com o branco da amostra para zeragem do equipamento.',
    item: 'cilindro2', alvo: 'cubeta_branco',
  },
  {
    id: 7,
    titulo: 'Inserir Cubeta Branco no Equipamento de Leitura',
    descricao: 'Arraste a Cubeta de 50 mm com o Branco até o compartimento de leitura do equipamento para a zeragem. O equipamento será zerado com o Branco da Amostra de Dureza.',
    item: 'cubeta_branco', alvo: 'fotometro',
  },
  {
    id: 8,
    titulo: 'Ajustar Zero do Equipamento com o Branco de Dureza',
    descricao: 'Clique em ZERO para zerar o equipamento de leitura com o Branco da Amostra. O equipamento exibirá a mensagem "Equipamento zerado com branco de dureza" e estará pronto para a leitura.',
    item: null, alvo: 'fotometro',
  },
  {
    id: 9,
    titulo: 'Transferir Amostra (Cilindro 1) para a Cubeta de 50 mm',
    descricao: 'Arraste o Cilindro 1 com a solução de amostra + tampão + calmagita até a segunda Cubeta de 50 mm para transferência. Esta cubeta será usada para a leitura da dureza total.',
    item: 'cilindro1', alvo: 'cubeta_amostra',
  },
  {
    id: 10,
    titulo: 'Inserir Cubeta com Amostra no Equipamento de Leitura',
    descricao: 'Arraste a Cubeta de 50 mm com a amostra reagida até o compartimento de leitura do equipamento. A coloração vinho/carmim indicará a presença de dureza na amostra.',
    item: 'cubeta_amostra', alvo: 'fotometro',
  },
  {
    id: 11,
    titulo: 'Realizar Leitura — Dureza Total (mg/L CaCO₃)',
    descricao: 'Clique em LER para obter a concentração de Dureza Total. O equipamento utilizará a curva do kit 0028631 e exibirá o resultado em mg/L CaCO₃ (faixa 0,05–2,50 mg/L). Registre o valor para o boletim de análise.',
    item: null, alvo: 'fotometro',
  },
];


/* ═══════════════════════════════════════════════════════════
   CSS — animações (prefixo dmk)
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes dmkDropFall {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:1; }
    62%  { transform:translateX(-50%) translateY(50px); opacity:.90; }
    100% { transform:translateX(-50%) translateY(70px); opacity:0;   }
  }
  @keyframes dmkDropFall2 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.82; }
    62%  { transform:translateX(-50%) translateY(44px); opacity:.72; }
    100% { transform:translateX(-50%) translateY(62px); opacity:0;   }
  }
  @keyframes dmkDropFall3 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.65; }
    62%  { transform:translateX(-50%) translateY(56px); opacity:.55; }
    100% { transform:translateX(-50%) translateY(76px); opacity:0;   }
  }
  @keyframes dmkDropFall4 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.50; }
    62%  { transform:translateX(-50%) translateY(42px); opacity:.40; }
    100% { transform:translateX(-50%) translateY(60px); opacity:0;   }
  }
  @keyframes dmkShake {
    0%,100% { transform: rotate(0deg); }
    16%     { transform: rotate(-6deg); }
    32%     { transform: rotate(6deg);  }
    48%     { transform: rotate(-4deg); }
    64%     { transform: rotate(4deg);  }
    80%     { transform: rotate(-2deg); }
  }
  @keyframes dmkTimerPulse {
    0%,100% { opacity:.62; }
    50%     { opacity:1.00; }
  }
  @keyframes dmkpHPulse {
    0%,100% { transform:scale(1); }
    50%     { transform:scale(1.05); }
  }
`;

/* ── Gota de reagente (genérica, com cor) ── */
const GotaReagente = ({ offsetX = 0, animName = 'dmkDropFall', delay = 0, animKey = 'g', cor = 'rgba(200,200,200,0.90)' }) => (
  <div key={animKey} style={{
    position:'absolute', left:`calc(50% + ${offsetX}px)`, top:2,
    width:10, height:22, opacity:0, pointerEvents:'none', zIndex:30,
    animationName:animName, animationDuration:'0.58s',
    animationDelay:`${delay}ms`, animationFillMode:'forwards',
    animationTimingFunction:'ease-in',
  }}>
    <svg width="10" height="22" viewBox="0 0 10 22">
      <line x1="5" y1="1" x2="5" y2="9" stroke={cor} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      <ellipse cx="5" cy="16" rx="4" ry="5.5" fill={cor}/>
      <ellipse cx="3.5" cy="13.5" rx="1.2" ry="1.8" fill="rgba(255,255,255,0.32)"/>
    </svg>
  </div>
);

/* renderiza N gotas com delay escalonado */
const renderGotas = (n, cor, animKey) => {
  const anims = ['dmkDropFall','dmkDropFall2','dmkDropFall3','dmkDropFall4'];
  const offsets = [-10,-4,3,10,-7,5,-3,8,-5,2];
  return Array.from({ length: n }, (_, i) => (
    <GotaReagente
      key={`${animKey}-${i}`}
      animKey={`${animKey}-${i}`}
      offsetX={offsets[i % offsets.length]}
      animName={anims[i % anims.length]}
      delay={i * 180}
      cor={cor}
    />
  ));
};


/* ═══════════════════════════════════════════════════════════
   SVG — CILINDRO GRADUADO COM TAMPA (25 mL)
═══════════════════════════════════════════════════════════ */
const CilindroGraduadoSVG = ({ nivel = 0, cor = 'rgba(220,235,255,0.08)', id = 'c1', rotulo = '1', agitando = false }) => {
  const W = 32, H = 124, wall = 2.5, neck = 8, neckH = 28;
  const iW = W - wall * 2;
  const bodyY = neckH;
  const iH = H - wall * 2 - bodyY;
  const lH = (nivel / 100) * iH;
  const lY = bodyY + wall + iH - lH;

  return (
    <svg width={W + 28} height={H + 28} viewBox={`0 0 ${W + 28} ${H + 28}`}
      style={agitando ? { animation:'dmkShake 0.50s ease-in-out 3', transformOrigin:'50% 92%' } : {}}>
      <defs>
        <linearGradient id={`dmkCilGlass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.52)"/>
          <stop offset="18%"  stopColor="rgba(215,238,255,0.12)"/>
          <stop offset="78%"  stopColor="rgba(210,235,255,0.07)"/>
          <stop offset="100%" stopColor="rgba(170,215,252,0.40)"/>
        </linearGradient>
        <clipPath id={`dmkCilClip${id}`}>
          <rect x={wall} y={bodyY + wall} width={iW} height={iH}/>
        </clipPath>
        <filter id={`dmkCilSh${id}`}><feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity=".20"/></filter>
      </defs>
      <g transform="translate(10,6)">
        <ellipse cx={W/2} cy={H+7} rx={W/2-3} ry={3.5} fill="rgba(0,0,0,0.16)"/>

        {/* líquido */}
        <g clipPath={`url(#dmkCilClip${id})`}>
          {nivel > 0 && (
            <>
              <rect x={wall} y={lY} width={iW} height={lH+2} fill={cor}/>
              {nivel > 5 && (
                <ellipse cx={W/2} cy={lY+1.5} rx={iW/2-1} ry={2}
                  fill="rgba(255,255,255,0.22)"/>
              )}
            </>
          )}
        </g>

        {/* corpo principal */}
        <g filter={`url(#dmkCilSh${id})`}>
          <rect x="0" y={bodyY} width={W} height={H-bodyY} rx="3"
            fill={`url(#dmkCilGlass${id})`} stroke="#8ac4dc" strokeWidth="1.6"/>
        </g>

        {/* gargalo (neck) */}
        <rect x={W/2 - neck/2} y="8" width={neck} height={neckH+2} rx="2"
          fill={`url(#dmkCilGlass${id})`} stroke="#8ac4dc" strokeWidth="1.5"/>

        {/* tampa (stopper) */}
        <rect x={W/2-7} y="2" width="14" height="9" rx="4"
          fill="rgba(165,210,240,0.38)" stroke="#9ab8d0" strokeWidth="1.1"/>
        <rect x={W/2-5} y="0" width="10" height="4" rx="2"
          fill="rgba(145,195,225,0.55)" stroke="#8ab8d0" strokeWidth="0.9"/>

        {/* escala graduada */}
        {[0,1,2,3,4,5].map(i => {
          const pct = i / 5;
          const y = bodyY + wall + iH - pct * iH;
          const vol = Math.round(pct * 25);
          return (
            <g key={i}>
              <line x1={W-10} y1={y} x2={W} y2={y}
                stroke="rgba(100,160,200,0.55)" strokeWidth={i % 2 === 0 ? 1.2 : 0.8}/>
              {i % 2 === 0 && (
                <text x={W+2} y={y+2.5} fontSize="5.5"
                  fill="rgba(80,140,190,0.72)" fontFamily="monospace">{vol}</text>
              )}
            </g>
          );
        })}

        {/* reflexo */}
        <rect x="2" y={bodyY+2} width="3" height={H-bodyY-6} rx="1.5"
          fill="rgba(255,255,255,0.24)"/>

        {/* rótulo */}
        <rect x={W/2-10} y={H-22} width="20" height="14" rx="3"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7"/>
        <text x={W/2} y={H-12} textAnchor="middle" fontSize="5.5"
          fill="#0d2137" fontFamily="monospace" fontWeight="700">25 mL</text>
        <text x={W/2} y={H-6} textAnchor="middle" fontSize="4"
          fill="#1a3a5e" fontFamily="sans-serif">Cil. {rotulo}</text>
      </g>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — CUBETA 50 mm (inline, rótulo correto)
═══════════════════════════════════════════════════════════ */
const Cubeta50mmSVG = ({ cor = 'rgba(220,235,255,0.08)', nivel = 0, id = 'c50' }) => {
  const W = 56, H = 84, wall = 3.5;
  const iW = W - wall * 2, iH = H - wall * 2 - 4;
  const lH = (nivel / 100) * iH, lY = wall + iH - lH;
  return (
    <svg width={W+24} height={H+34} viewBox={`0 0 ${W+24} ${H+34}`}>
      <defs>
        <linearGradient id={`dmkCv50g${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,230,255,0.44)"/>
          <stop offset="30%"  stopColor="rgba(220,240,255,0.14)"/>
          <stop offset="70%"  stopColor="rgba(220,240,255,0.08)"/>
          <stop offset="100%" stopColor="rgba(200,230,255,0.36)"/>
        </linearGradient>
        <clipPath id={`dmkCv50c${id}`}>
          <rect x={wall} y={wall} width={iW} height={iH}/>
        </clipPath>
      </defs>
      <g transform="translate(12,6)">
        <ellipse cx={W/2} cy={H+6} rx={W/2-4} ry="4" fill="rgba(0,0,0,0.22)"/>
        <g clipPath={`url(#dmkCv50c${id})`}>
          <rect x={wall} y={lY} width={iW} height={lH} fill={cor}/>
          {nivel > 5 && (
            <rect x={wall+2} y={lY+1} width={iW-4} height="2" rx="1"
              fill="rgba(255,255,255,0.22)"/>
          )}
        </g>
        <rect x="0" y="0" width={W} height={H} rx="2"
          fill={`url(#dmkCv50g${id})`} stroke="#a0c0da" strokeWidth="1.8"/>
        <rect x="0" y="0" width={wall} height={H} rx="1" fill="rgba(255,255,255,0.28)"/>
        <rect x={W-wall} y="0" width={wall} height={H} rx="1" fill="rgba(255,255,255,0.11)"/>
        <rect x="0" y={H-wall} width={W} height={wall} rx="1" fill="rgba(200,225,245,0.32)"/>
        <rect x="-2" y="-3" width={W+4} height="6" rx="2"
          fill="rgba(180,215,240,0.26)" stroke="#9ab8d0" strokeWidth="1.1"/>
        <rect x="6" y="10" width="4" height={H*0.56} rx="2" fill="rgba(255,255,255,0.26)"/>
        <rect x={W/2-18} y={H-22} width="36" height="18" rx="3"
          fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.7"/>
        <text x={W/2} y={H-12} textAnchor="middle" fontSize="6.5"
          fill="#0d2137" fontFamily="monospace" fontWeight="700">10 mL</text>
        <text x={W/2} y={H-6} textAnchor="middle" fontSize="5.2"
          fill="#1a3a5e" fontFamily="sans-serif">50 mm</text>
      </g>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — EQUIPAMENTO DE LEITURA / COLORÍMETRO (Kit 0028631)
═══════════════════════════════════════════════════════════ */
const FotometroDurezaMkSVG = ({
  cubetaBrancoDentro = false, corBranco = 'rgba(60,100,210,0.75)',
  cubetaAmostraDentro = false, corAmostra = 'rgba(190,40,80,0.72)',
  zerando = false, zerado = false,
  lendo = false, resultado = null,
  zeroAtivo = false, lerAtivo = false,
  onZero, onLer,
}) => (
  <svg width="238" height="216" viewBox="0 0 238 216">
    <defs>
      <linearGradient id="dmkSqBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#e4e6e9"/>
        <stop offset="100%" stopColor="#c8cbcf"/>
      </linearGradient>
      <linearGradient id="dmkSqScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001a10"/>
        <stop offset="100%" stopColor="#000e08"/>
      </linearGradient>
      <filter id="dmkSqSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".28"/></filter>
    </defs>

    <g filter="url(#dmkSqSh)">
      <rect x="4" y="4" width="230" height="208" rx="12"
        fill="url(#dmkSqBody)" stroke="#b0b5ba" strokeWidth="1.5"/>
    </g>

    {/* header — tema verde/dureza */}
    <rect x="4" y="4" width="230" height="30" rx="12" fill="#155724"/>
    <rect x="4" y="20" width="230" height="14" fill="#155724"/>
    <text x="75"  y="18" textAnchor="middle" fontSize="9"
      fill="white" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="1.5">Qhantye</text>
    <text x="168" y="18" textAnchor="middle" fontSize="7"
      fill="rgba(255,255,255,0.85)" fontFamily="Arial,sans-serif">Science Solution</text>
    <text x="119" y="28" textAnchor="middle" fontSize="5.5"
      fill="rgba(255,255,255,0.75)" fontFamily="sans-serif">Kit 0028631 · Dureza Total · Calmagita · 50 mm</text>

    {/* Display */}
    <rect x="12" y="38" width="152" height="102" rx="6"
      fill="url(#dmkSqScr)" stroke="#1a4020" strokeWidth="1.2"/>
    <rect x="14" y="40" width="148" height="98" rx="5" fill="rgba(0,20,10,0.35)"/>

    {resultado !== null ? (
      <>
        <text x="88" y="58" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">KIT 0028631 · DUREZA TOTAL</text>
        <line x1="18" y1="62" x2="158" y2="62"
          stroke="rgba(110,231,183,0.22)" strokeWidth="0.8"/>
        <text x="82" y="94" textAnchor="middle" fontSize="28"
          fill="#00ff88" fontFamily="'Courier New',monospace" fontWeight="700">{resultado}</text>
        <text x="157" y="94" textAnchor="end" fontSize="8.5"
          fill="#00cc66" fontFamily="monospace">mg/L</text>
        <text x="157" y="104" textAnchor="end" fontSize="8"
          fill="#00cc66" fontFamily="monospace">CaCO₃</text>
        <text x="88" y="122" textAnchor="middle" fontSize="6.5"
          fill="#00aa88" fontFamily="monospace">✓ Leitura concluída · 0028631</text>
        <text x="88" y="132" textAnchor="middle" fontSize="5.5"
          fill="#007744" fontFamily="sans-serif">Dureza Total · 0,05–2,50 mg/L CaCO₃</text>
      </>
    ) : lendo ? (
      <>
        <text x="88" y="60" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">DUREZA TOTAL</text>
        <text x="88" y="82" textAnchor="middle" fontSize="14"
          fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x="20" y="94" width="132" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="20" y="94" width="0" height="5" rx="2.5" fill="rgba(110,231,183,0.65)">
          <animate attributeName="width" from="0" to="132" dur="2.5s" fill="freeze"/>
        </rect>
        <text x="88" y="118" textAnchor="middle" fontSize="6"
          fill="#475569" fontFamily="monospace">Calculando Dureza CaCO₃...</text>
      </>
    ) : zerando ? (
      <>
        <text x="88" y="60" textAnchor="middle" fontSize="6.5"
          fill="#fbbf24" fontFamily="monospace">ZERANDO...</text>
        <text x="88" y="78" textAnchor="middle" fontSize="9"
          fill="#fbbf24" fontFamily="monospace">0028631</text>
        <rect x="20" y="88" width="132" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
        <rect x="20" y="88" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="132" dur="2s" fill="freeze"/>
        </rect>
        <text x="88" y="110" textAnchor="middle" fontSize="5.5"
          fill="#4b5563" fontFamily="monospace">Ajuste zero · Branco de dureza...</text>
      </>
    ) : zerado && !cubetaAmostraDentro ? (
      <>
        <text x="88" y="60" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">ZERADO ✓</text>
        <line x1="18" y1="64" x2="158" y2="64"
          stroke="rgba(110,231,183,0.18)" strokeWidth="0.8"/>
        <text x="88" y="84" textAnchor="middle" fontSize="10.5"
          fill="#3b82f6" fontFamily="monospace">ZERO ✓</text>
        <text x="88" y="98" textAnchor="middle" fontSize="7.5"
          fill="#60a5fa" fontFamily="monospace">0.000 mg/L CaCO₃</text>
        <text x="88" y="114" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">Inserir cubeta com amostra</text>
      </>
    ) : cubetaAmostraDentro ? (
      <>
        <text x="88" y="60" textAnchor="middle" fontSize="6.5"
          fill="#6ee7b7" fontFamily="monospace">0028631 ✓</text>
        <text x="88" y="82" textAnchor="middle" fontSize="11"
          fill="#0ea5e9" fontFamily="monospace">PRONTO</text>
        <text x="88" y="97" textAnchor="middle" fontSize="7"
          fill="#60a5fa" fontFamily="sans-serif">Amostra inserida ✓</text>
        <text x="88" y="113" textAnchor="middle" fontSize="6.5"
          fill="#3a6a9a" fontFamily="sans-serif">
          {lerAtivo ? 'Pressione LER para leitura' : 'Calmagita · Dureza Total'}
        </text>
      </>
    ) : cubetaBrancoDentro ? (
      <>
        <text x="88" y="64" textAnchor="middle" fontSize="8"
          fill="#60a5fa" fontFamily="monospace">Branco inserido ✓</text>
        <text x="88" y="82" textAnchor="middle" fontSize="7.5"
          fill="#3b82f6" fontFamily="sans-serif">EDTA · Branco Dureza</text>
        <text x="88" y="98" textAnchor="middle" fontSize="7"
          fill="#3a6a9a" fontFamily="sans-serif">
          {zeroAtivo ? 'Pressione ZERO' : '0028631 · Kit Dureza'}
        </text>
      </>
    ) : (
      <>
        <text x="88" y="68" textAnchor="middle" fontSize="9.5"
          fill="#1a3a20" fontFamily="monospace">STANDBY</text>
        <text x="88" y="90" textAnchor="middle" fontSize="6.5"
          fill="#0a1a10" fontFamily="sans-serif">Aguardando cubeta...</text>
        <text x="88" y="106" textAnchor="middle" fontSize="5.5"
          fill="#0a1a10" fontFamily="monospace">Kit 0028631 · Dureza Total</text>
      </>
    )}

    {/* Compartimento 50mm */}
    <rect x="172" y="38" width="62" height="102" rx="5"
      fill="#1a1a1a"
      stroke={
        cubetaAmostraDentro ? '#00cc66'
        : cubetaBrancoDentro ? '#3b82f6'
        : zerado ? '#155724'
        : '#3a3a3a'
      }
      strokeWidth="1.5"/>
    <text x="203" y="56" textAnchor="middle" fontSize="5.5"
      fill="#4a4a4a" fontFamily="monospace">50 mm</text>
    {cubetaAmostraDentro ? (
      <g>
        <rect x="183" y="62" width="40" height="60" rx="2"
          fill={corAmostra} stroke="rgba(200,200,200,0.40)" strokeWidth="1"/>
        <rect x="185" y="64" width="6" height="52" fill="rgba(255,255,255,0.16)"/>
        <line x1="219" y1="70" x2="222" y2="70"
          stroke="rgba(200,200,200,0.60)" strokeWidth="1.2"/>
      </g>
    ) : cubetaBrancoDentro ? (
      <g>
        <rect x="183" y="62" width="40" height="60" rx="2"
          fill={corBranco} stroke="rgba(180,210,255,0.45)" strokeWidth="1"/>
        <rect x="185" y="64" width="6" height="52" fill="rgba(255,255,255,0.20)"/>
        <text x="203" y="118" textAnchor="middle" fontSize="5"
          fill="rgba(120,170,255,0.70)" fontFamily="monospace">EDTA</text>
      </g>
    ) : (
      <rect x="183" y="62" width="40" height="60" rx="2"
        fill="rgba(5,12,10,0.60)" stroke="#1a1a1a" strokeWidth="0.8"
        strokeDasharray="4,2"/>
    )}
    <circle cx="167" cy="104" r="4"
      fill={
        cubetaAmostraDentro ? 'rgba(0,204,102,0.8)'
        : cubetaBrancoDentro ? 'rgba(59,130,246,0.80)'
        : zerado ? 'rgba(21,87,36,0.60)'
        : 'rgba(0,30,10,0.22)'
      }
      stroke="rgba(0,80,30,0.35)" strokeWidth="1"/>

    {/* Botões */}
    <rect x="12" y="148" width="222" height="58" rx="6"
      fill="#bfc2c6" stroke="#a0a5aa" strokeWidth="0.8"/>

    {/* ZERO */}
    <g onClick={onZero} style={{ cursor: zeroAtivo ? 'pointer' : 'default' }}>
      <rect x="20" y="156" width="60" height="22" rx="5"
        fill={zeroAtivo ? '#0f4020' : '#6b7280'}
        stroke={zeroAtivo ? '#00cc44' : '#4b5563'} strokeWidth={zeroAtivo ? 1.8 : 1}/>
      {zeroAtivo && (
        <rect x="20" y="156" width="60" height="22" rx="5"
          fill="none" stroke="rgba(0,204,80,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
      <text x="50" y="170" textAnchor="middle" fontSize="8.5"
        fill={zeroAtivo ? '#00ff66' : '#d1d5db'} fontFamily="monospace"
        fontWeight={zeroAtivo ? '700' : '400'}>ZERO</text>
    </g>

    {/* LER */}
    <g onClick={onLer} style={{ cursor: lerAtivo ? 'pointer' : 'default' }}>
      <rect x="92" y="156" width="60" height="22" rx="5"
        fill={lerAtivo ? '#0f2a48' : '#6b7280'}
        stroke={lerAtivo ? '#00aacc' : '#4b5563'} strokeWidth={lerAtivo ? 1.8 : 1}/>
      {lerAtivo && (
        <rect x="92" y="156" width="60" height="22" rx="5"
          fill="none" stroke="rgba(0,170,204,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
      <text x="122" y="170" textAnchor="middle" fontSize="8.5"
        fill={lerAtivo ? '#00ddff' : '#d1d5db'} fontFamily="monospace"
        fontWeight={lerAtivo ? '700' : '400'}>LER</text>
    </g>

    <g>
      <rect x="162" y="156" width="60" height="22" rx="5"
        fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
      <text x="192" y="170" textAnchor="middle" fontSize="8"
        fill="#d1d5db" fontFamily="monospace">MENU</text>
    </g>

    <text x="119" y="196" textAnchor="middle" fontSize="6"
      fill="#6b7280" fontFamily="sans-serif">Qhantye Science Solution · Kit 0028631</text>
    <text x="119" y="206" textAnchor="middle" fontSize="5.5"
      fill="#9ca3af" fontFamily="monospace">Dureza Total · Calmagita · 0,05–2,50 mg/L CaCO₃</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const DurezaMk = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'dmk-anim-styles';
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

  // ── pH ────────────────────────────────────────────────
  const [pHAtual,     setPHAtual]     = useState(9.8);
  const [pHOk,        setPHOk]        = useState(false);
  const [ajustandoPH, setAjustandoPH] = useState(false);

  // ── Cilindro 1 ────────────────────────────────────────
  const [nivelCil1,   setNivelCil1]   = useState(0);
  const [corCil1,     setCorCil1]     = useState('rgba(220,235,255,0.08)');
  const [cil1Cont,    setCil1Cont]    = useState(null);
  // null | 'amostra' | 'amostra_a' | 'amostra_ab' | 'parcial' (após 10mL transferidos)
  const [agitandoCil1,setAgitandoCil1]= useState(false);

  // ── Cilindro 2 ────────────────────────────────────────
  const [nivelCil2,   setNivelCil2]   = useState(0);
  const [corCil2,     setCorCil2]     = useState('rgba(220,235,255,0.08)');
  const [cil2Cont,    setCil2Cont]    = useState(null);
  // null | 'branco' | 'branco_edta'
  const [agitandoCil2,setAgitandoCil2]= useState(false);

  // ── Gotas animadas ────────────────────────────────────
  const [mostrarGotas,  setMostrarGotas]  = useState(false);
  const [corGotas,      setCorGotas]      = useState('rgba(200,200,200,0.90)');
  const [numGotas,      setNumGotas]      = useState(4);
  const [gotasAlvo,     setGotasAlvo]     = useState('cil1'); // 'cil1' | 'cil2'
  const [gotasKey,      setGotasKey]      = useState(0);

  // ── Cubeta Branco 50mm ────────────────────────────────
  const [nivelCubBranco,  setNivelCubBranco]  = useState(0);
  const [corCubBranco,    setCorCubBranco]    = useState('rgba(60,100,210,0.75)');
  const [cubBrancoNoFoto, setCubBrancoNoFoto] = useState(false);

  // ── Cubeta Amostra 50mm ───────────────────────────────
  const [nivelCubAmostra, setNivelCubAmostra] = useState(0);
  const [corCubAmostra,   setCorCubAmostra]   = useState('rgba(190,40,80,0.72)');
  const [cubAmostraNoFoto,setCubAmostraNoFoto]= useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [zerando,   setZerando]   = useState(false);
  const [zerado,    setZerado]    = useState(false);
  const [lendo,     setLendo]     = useState(false);
  const [resultado, setResultado] = useState(null);


  // ── pH animado (1,2 s) ────────────────────────────────
  useEffect(() => {
    if (!ajustandoPH) return;
    const alvo = 6.5;
    const inicio = pHAtual;
    const passos = 12;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setPHAtual(parseFloat((inicio + (alvo - inicio) * (i / passos)).toFixed(1)));
      if (i >= passos) {
        clearInterval(id);
        setAjustandoPH(false);
        setPHOk(true);
        setTimeout(() => { celebrarAcerto(80); proximaEtapa(); }, 400);
      }
    }, 100);
    return () => clearInterval(id);
  }, [ajustandoPH]);

  // ── Ocultar gotas após 2,5 s ──────────────────────────
  useEffect(() => {
    if (!mostrarGotas) return;
    const id = setTimeout(() => setMostrarGotas(false), numGotas * 180 + 600);
    return () => clearTimeout(id);
  }, [mostrarGotas, numGotas]);


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

    // E1 — FRASCO AMOSTRA → CILINDRO 1 (20 mL)
    if (itemDrop === 'frasco_amostra' && alvo === 'cilindro1' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelCil1(80);
      setCorCil1('rgba(200,218,250,0.62)');
      setCil1Cont('amostra');
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E2 — REAGENTE A → CILINDRO 1 (4 gotas tampão)
    if (itemDrop === 'reagente_a' && alvo === 'cilindro1' && etapaAtual === 2) {
      setItemSegurado(null);
      setGotasKey(k => k + 1);
      setGotasAlvo('cil1');
      setNumGotas(4);
      setCorGotas('rgba(210,200,80,0.90)');
      setMostrarGotas(true);
      setCil1Cont('amostra_a');
      // agitação após gotas
      setTimeout(() => { setAgitandoCil1(true); setTimeout(() => setAgitandoCil1(false), 700); }, 700);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — REAGENTE B → CILINDRO 1 (4 gotas calmagita → cor vinho)
    if (itemDrop === 'reagente_b' && alvo === 'cilindro1' && etapaAtual === 3) {
      setItemSegurado(null);
      setGotasKey(k => k + 1);
      setGotasAlvo('cil1');
      setNumGotas(4);
      setCorGotas('rgba(180,30,70,0.92)');
      setMostrarGotas(true);
      setCil1Cont('amostra_ab');
      setCorCil1('rgba(185,35,72,0.72)'); // vinho/carmim
      setTimeout(() => { setAgitandoCil1(true); setTimeout(() => setAgitandoCil1(false), 700); }, 700);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — CILINDRO 1 → CILINDRO 2 (10 mL)
    if (itemDrop === 'cilindro1' && alvo === 'cilindro2' && etapaAtual === 4) {
      setItemSegurado(null);
      setNivelCil2(40); // 10mL dos 20mL (40%)
      setCorCil2(corCil1);
      setCil2Cont('branco');
      setNivelCil1(40); // metade restante
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E5 — REAGENTE C (EDTA) → CILINDRO 2 (10 gotas)
    if (itemDrop === 'reagente_c' && alvo === 'cilindro2' && etapaAtual === 5) {
      setItemSegurado(null);
      setGotasKey(k => k + 1);
      setGotasAlvo('cil2');
      setNumGotas(10);
      setCorGotas('rgba(60,100,210,0.88)');
      setMostrarGotas(true);
      setCil2Cont('branco_edta');
      setCorCil2('rgba(60,100,210,0.75)'); // azul (EDTA complexou dureza)
      setTimeout(() => { setAgitandoCil2(true); setTimeout(() => setAgitandoCil2(false), 800); }, 1900);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E6 — CILINDRO 2 → CUBETA BRANCO 50mm
    if (itemDrop === 'cilindro2' && alvo === 'cubeta_branco' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelCubBranco(78);
      setCorCubBranco(corCil2);
      setNivelCil2(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E7 — CUBETA BRANCO → FOTÔMETRO
    if (itemDrop === 'cubeta_branco' && alvo === 'fotometro' && etapaAtual === 7) {
      setItemSegurado(null);
      setCubBrancoNoFoto(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E9 — CILINDRO 1 → CUBETA AMOSTRA 50mm
    if (itemDrop === 'cilindro1' && alvo === 'cubeta_amostra' && etapaAtual === 9) {
      setItemSegurado(null);
      setNivelCubAmostra(78);
      setCorCubAmostra(corCil1);
      setNivelCil1(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E10 — CUBETA AMOSTRA → FOTÔMETRO
    if (itemDrop === 'cubeta_amostra' && alvo === 'fotometro' && etapaAtual === 10) {
      setItemSegurado(null);
      setCubAmostraNoFoto(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }
  };


  // ── Click: ajustar pH (step 0) ───────────────────────
  const handleAjustarPH = () => {
    if (etapaAtual !== 0 || pHOk || ajustandoPH) return;
    setAjustandoPH(true);
  };

  // ── Click: ZERO (step 8) ─────────────────────────────
  const handleZero = () => {
    if (etapaAtual !== 8 || !cubBrancoNoFoto || zerando || zerado) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubBrancoNoFoto(false);
      setNivelCubBranco(0);
      celebrarAcerto(150);
      proximaEtapa(); // → etapa 9
    }, 2200);
  };

  // ── Click: LER (step 11) ─────────────────────────────
  const handleLer = () => {
    if (etapaAtual !== 11 || !cubAmostraNoFoto || !zerado || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * (2.50 - 0.05) + 0.05).toFixed(2));
      setResultado(raw.toFixed(2));
      setLendo(false);
      celebrarAcerto(200);
      setTimeout(() => proximaEtapa(), 2000);
    }, 2500);
  };


  // ── Derivados ─────────────────────────────────────────
  const amostraDrag    = isItem('frasco_amostra');
  const reagADrag      = isItem('reagente_a');
  const reagBDrag      = isItem('reagente_b');
  const reagCDrag      = isItem('reagente_c');
  const cil1Drag       = isItem('cilindro1') && nivelCil1 > 0;
  const cil2Drag       = isItem('cilindro2') && nivelCil2 > 0;
  const cubBrancoDrag  = isItem('cubeta_branco') && nivelCubBranco > 0 && !cubBrancoNoFoto;
  const cubAmostraDrag = isItem('cubeta_amostra') && nivelCubAmostra > 0 && !cubAmostraNoFoto;
  const zeroAtivo      = etapaAtual === 8 && cubBrancoNoFoto && !zerando && !zerado;
  const lerAtivo       = etapaAtual === 11 && cubAmostraNoFoto && zerado && !lendo && !resultado;


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
          <div style={{ background:'linear-gradient(135deg,#052e16,#166534,#4ade80)', color:'white', padding:'20px 36px', borderRadius:22, boxShadow:'0 16px 40px rgba(0,0,0,0.35)', border:'2px solid rgba(255,255,255,0.9)', textAlign:'center' }}>
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

      {/* ── BANNER RESULTADO ── */}
      {resultado && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:55, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#052e16,#166534,#16a34a)', color:'white', padding:'14px 28px', borderRadius:18, boxShadow:'0 12px 32px rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.85)', textAlign:'center' }}>
            <div style={{ fontSize:17, fontWeight:900 }}>🟢 Leitura Concluída — Dureza Total</div>
            <div style={{ fontSize:12, marginTop:4 }}>Resultado: <strong>{resultado} mg/L CaCO₃</strong> · Kit 0028631</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:70 }}>
          <div style={{ background:'linear-gradient(135deg,#0d1f35,#0a1628)', border:'2px solid #166534', borderRadius:24, padding:'44px 52px', textAlign:'center', color:'white', maxWidth:560, boxShadow:'0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ marginBottom:8 }}>
              <span style={{ fontSize:36, fontWeight:900, color:'#4ade80' }}>Qhantye</span><br/>
              <span style={{ fontSize:18, color:'#94a3b8' }}>Science Solution</span>
            </div>
            <h2 style={{ fontSize:26, fontWeight:900, color:'#34d399', margin:'8px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color:'#64748b', fontSize:12, margin:'0 0 20px' }}>
              Dureza Total · Método Colorimétrico da Calmagita · Kit 0028631
            </p>
            <div style={{ background:'rgba(22,101,52,0.12)', border:'1px solid rgba(22,101,52,0.35)', borderRadius:14, padding:'14px 22px', marginBottom:14 }}>
              <div style={{ fontSize:10, color:'#94a3b8', marginBottom:8 }}>Dados da Análise</div>
              <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
                {[
                  { label:'Kit',         val:'0028631',              cor:'#4ade80' },
                  { label:'Método',      val:'Calmagita',            cor:'#34d399' },
                  { label:'Analito',     val:'Dureza Total (CaCO₃)', cor:'#6ee7b7' },
                  { label:'Faixa',       val:'0,05–2,50 mg/L',       cor:'#60a5fa' },
                  { label:'Cubeta',      val:'50 mm',                cor:'#fbbf24' },
                  { label:'Vol. amostra',val:'20 mL',                cor:'#a78bfa' },
                  { label:'Reagente A',  val:'Tampão (4 gotas)',      cor:'#fde68a' },
                  { label:'Reagente B',  val:'Calmagita (4 gotas)',   cor:'#fca5a5' },
                  { label:'Reagente C',  val:'EDTA (10 gotas)',       cor:'#93c5fd' },
                  { label:'pH amostra',  val:'4 – 8',                cor:'#86efac' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'#94a3b8', marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(52,211,153,0.10)', border:'1px solid rgba(52,211,153,0.35)', borderRadius:14, padding:'18px 36px', marginBottom:14 }}>
              <div style={{ fontSize:13, color:'#94a3b8', marginBottom:6 }}>Resultado — Dureza Total</div>
              <div style={{ fontSize:52, fontWeight:900, color:'#34d399', fontFamily:'monospace', lineHeight:1 }}>{resultado}</div>
              <div style={{ fontSize:14, color:'#6ee7b7', fontWeight:700, marginTop:4 }}>mg/L CaCO₃</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'8px 14px', marginBottom:10, fontSize:9, color:'#64748b', textAlign:'left' }}>
              📋 <strong style={{ color:'#94a3b8' }}>Método:</strong> Colorimétrico da Calmagita · Kit 0028631 · Qhantye<br/>
              🔬 <strong style={{ color:'#94a3b8' }}>Reag.:</strong> A (Tampão, 4gt) · B (Calmagita, 4gt) · C (EDTA branco, 10gt)<br/>
              📏 <strong style={{ color:'#94a3b8' }}>Faixa:</strong> 0,05–2,50 mg/L Ca + Mg como CaCO₃ · Cubeta 50 mm<br/>
              🧪 <strong style={{ color:'#94a3b8' }}>pH:</strong> 4–8 · Branco de amostra c/ EDTA · Zero antes da leitura.
            </div>
            <div style={{ fontSize:17, color:'#fbbf24', fontWeight:700, marginBottom:18 }}>🏆 Pontuação: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background:'linear-gradient(90deg,#166534,#14532d)', color:'white', border:'none', borderRadius:11, padding:'12px 32px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
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
        titulo="Dureza Total — Método Colorimétrico da Calmagita (Kit 0028631)"
        subtitulo={"Qhantye Science Solution · Kit 0028631 · Calmagita\nDureza Total · 0,05–2,50 mg/L CaCO₃ · pH 4–8"}
        icone="🟢"
        badges={['🟢 QHANTYE','⚗️ CALMAGITA · DUREZA']}
        footerLabel="🟢 Dureza Total Kit 0028631"
      >
        <div style={{ background:'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius:26, padding:'22px 18px', border:'8px solid #8b6e45', boxShadow:'0 24px 80px rgba(0,0,0,0.6)', minWidth:1000 }}>
          <h2 style={{ textAlign:'center', color:'#4a3010', fontSize:14, fontWeight:900, marginBottom:14, letterSpacing:0.6 }}>
            🟢 Bancada — Dureza Total · Calmagita · Kit 0028631 · 0,05–2,50 mg/L CaCO₃
          </h2>

          <div style={{ background:'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius:20, padding:'18px 16px', border:'4px solid #292524', boxShadow:'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:10, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:12 }}>

              {/* CILINDRO 1 */}
              <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cilindro1" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('cilindro1')}
                    style={{ background:'rgba(0,0,0,0.20)', borderRadius:12, padding:'8px 12px', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>

                    {/* gotas caindo no cilindro 1 */}
                    <div style={{ position:'relative', width:'100%', height:0, overflow:'visible' }}>
                      {mostrarGotas && gotasAlvo === 'cil1' && renderGotas(numGotas, corGotas, `g1-${gotasKey}`)}
                    </div>

                    <div
                      className={`item-drag ${itemCls('cilindro1')}`}
                      draggable={cil1Drag}
                      onDragStart={e => handleDragStart('cilindro1', e)}
                      onDragEnd={handleDragEnd}
                      style={{ cursor: cil1Drag ? 'grab' : 'default', opacity: nivelCil1 === 0 && etapaAtual > 9 ? 0.20 : 1 }}>
                      <CilindroGraduadoSVG nivel={nivelCil1} cor={corCil1} id="dmk1" rotulo="1" agitando={agitandoCil1}/>
                    </div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cil1Drag ? '🖱️ ' : ''}Cilindro 1 (Amostra)
                  </span>
                  <span style={{ fontSize:8, color:
                    cil1Cont === 'amostra_ab' ? '#f87171'
                    : cil1Cont === 'amostra_a' ? '#fde68a'
                    : cil1Cont === 'amostra'   ? '#60a5fa'
                    : '#94a3b8' }}>
                    {cil1Cont === 'amostra_ab' ? '🔴 Amostra + A + B (calmagita)'
                      : cil1Cont === 'amostra_a' ? '🟡 Amostra + Tampão A'
                      : cil1Cont === 'amostra'   ? '💧 20 mL amostra'
                      : 'Vazio'}
                    {cil1Cont === 'amostra_ab' && nivelCil1 <= 42 && etapaAtual > 4 ? ' · 10 mL' : ''}
                  </span>
                </ZonaDrop>
              </div>

              {/* CILINDRO 2 */}
              <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cilindro2" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('cilindro2')}
                    style={{ background:'rgba(0,0,0,0.20)', borderRadius:12, padding:'8px 12px', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>

                    {/* gotas caindo no cilindro 2 */}
                    <div style={{ position:'relative', width:'100%', height:0, overflow:'visible' }}>
                      {mostrarGotas && gotasAlvo === 'cil2' && renderGotas(numGotas, corGotas, `g2-${gotasKey}`)}
                    </div>

                    <div
                      className={`item-drag ${itemCls('cilindro2')}`}
                      draggable={cil2Drag}
                      onDragStart={e => handleDragStart('cilindro2', e)}
                      onDragEnd={handleDragEnd}
                      style={{ cursor: cil2Drag ? 'grab' : 'default', opacity: nivelCil2 === 0 && etapaAtual > 6 ? 0.20 : 1 }}>
                      <CilindroGraduadoSVG nivel={nivelCil2} cor={corCil2} id="dmk2" rotulo="2" agitando={agitandoCil2}/>
                    </div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cil2Drag ? '🖱️ ' : ''}Cilindro 2 (Branco)
                  </span>
                  <span style={{ fontSize:8, color:
                    cil2Cont === 'branco_edta' ? '#60a5fa'
                    : cil2Cont === 'branco'    ? '#f87171'
                    : '#94a3b8' }}>
                    {cil2Cont === 'branco_edta' ? '🔵 Branco + EDTA (azul)'
                      : cil2Cont === 'branco'  ? '🔴 10 mL branco'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA BRANCO 50mm */}
              <div style={{ flex:0.9, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cubeta_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('cubeta_branco')} ${itemCls('cubeta_branco')}`}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, opacity: cubBrancoNoFoto ? 0.18 : 1, transition:'opacity 0.3s' }}
                    draggable={cubBrancoDrag}
                    onDragStart={e => handleDragStart('cubeta_branco', e)} onDragEnd={handleDragEnd}>
                    <Cubeta50mmSVG cor={corCubBranco} nivel={nivelCubBranco} id="dmkb"/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cubBrancoDrag ? '🖱️ ' : ''}Cubeta Branco 50 mm
                  </span>
                  <span style={{ fontSize:8, color: nivelCubBranco > 0 ? '#60a5fa' : '#94a3b8' }}>
                    {zerado ? '✓ Zero feito' : cubBrancoNoFoto ? '⚡ No equip.' : nivelCubBranco > 0 ? '🔵 Branco EDTA' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA AMOSTRA 50mm */}
              <div style={{ flex:0.9, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="cubeta_amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={`${dropCls('cubeta_amostra')} ${itemCls('cubeta_amostra')}`}
                    style={{ background:'rgba(0,0,0,0.18)', borderRadius:12, padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, opacity: cubAmostraNoFoto ? 0.18 : 1, transition:'opacity 0.3s' }}
                    draggable={cubAmostraDrag}
                    onDragStart={e => handleDragStart('cubeta_amostra', e)} onDragEnd={handleDragEnd}>
                    <Cubeta50mmSVG cor={corCubAmostra} nivel={nivelCubAmostra} id="dmka"/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {cubAmostraDrag ? '🖱️ ' : ''}Cubeta Amostra 50 mm
                  </span>
                  <span style={{ fontSize:8, color: nivelCubAmostra > 0 ? '#f87171' : '#94a3b8' }}>
                    {cubAmostraNoFoto ? '⚡ No equip.' : nivelCubAmostra > 0 ? '🔴 Amostra calmagita' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* EQUIPAMENTO DE LEITURA */}
              <div style={{ flex:2.8, display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div className={dropCls('fotometro')}
                    style={{ background:'rgba(255,255,255,0.06)', borderRadius:13, padding:'10px 12px' }}>
                    <FotometroDurezaMkSVG
                      cubetaBrancoDentro={cubBrancoNoFoto}
                      corBranco={corCubBranco}
                      cubetaAmostraDentro={cubAmostraNoFoto}
                      corAmostra={corCubAmostra}
                      zerando={zerando}
                      zerado={zerado}
                      lendo={lendo}
                      resultado={resultado}
                      zeroAtivo={zeroAtivo}
                      lerAtivo={lerAtivo}
                      onZero={handleZero}
                      onLer={handleLer}
                    />
                    {zeroAtivo && <div style={{ textAlign:'center', fontSize:8, color:'#00ff66', fontWeight:700, marginTop:4 }}>🟢 Clique ZERO!</div>}
                    {lerAtivo  && <div style={{ textAlign:'center', fontSize:8, color:'#00ddff', fontWeight:700, marginTop:4 }}>🔵 Clique LER!</div>}
                    {(zerando || lendo) && <div style={{ textAlign:'center', fontSize:8, color:'#fbbf24', fontWeight:700, marginTop:4 }}>⚡ Processando...</div>}
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>Equipamento de Leitura — Qhantye 0028631</span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}


            {/* ══ PAINEL AJUSTE pH (step 0) ══════════════════════ */}
            {etapaAtual === 0 && (
              <div style={{ marginBottom:14, background:'rgba(0,0,0,0.28)', borderRadius:12, padding:'14px 18px', border:'1px solid rgba(74,222,128,0.38)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, color:'#4ade80', fontWeight:700 }}>🟢 Determinação de Dureza Total — Método Colorimétrico da Calmagita · Kit 0028631</div>
                  <div style={{ fontSize:9, color:'#78716c', marginTop:3 }}>
                    pH da amostra deve estar entre <strong style={{ color:'#4ade80' }}>pH 4–8</strong>.<br/>
                    Se necessário: NaOH (elevar pH) · HCl (reduzir pH) · gota a gota.
                  </div>
                </div>
                <button onClick={handleAjustarPH} disabled={ajustandoPH}
                  style={{ background: ajustandoPH ? 'rgba(20,83,45,0.60)' : 'linear-gradient(90deg,#166534,#14532d)', color:'white', border:'none', borderRadius:10, padding:'10px 22px', fontSize:12, fontWeight:700, cursor: ajustandoPH ? 'wait' : 'pointer', boxShadow:'0 4px 14px rgba(22,101,52,0.38)', whiteSpace:'nowrap' }}>
                  {ajustandoPH ? '⚡ Ajustando...' : '🧪 Confirmar pH (4–8)'}
                </button>
              </div>
            )}


            {/* ══ ZONA INFERIOR: FRASCO AMOSTRA + REAGENTES ═══════════════ */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, alignItems:'flex-end' }}>

              {/* FRASCO AMOSTRA */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <ZonaDrop id="frasco_amostra_zone" onDrop={() => {}} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('frasco_amostra')}`}
                    draggable={amostraDrag}
                    onDragStart={e => handleDragStart('frasco_amostra', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: amostraDrag ? 'grab' : 'default' }}>
                    <FrascoReagente cor="rgba(210,195,148,0.82)" label="Amostra" sub="Água" nivel={82}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {amostraDrag ? '🖱️ ' : ''}Frasco de Amostra
                  </span>
                  <span style={{ fontSize:8, color:'#94a3b8' }}>20 mL → Cilindro 1</span>
                </ZonaDrop>
              </div>

              {/* REAGENTE A — Tampão Dureza */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('reagente_a')}`}
                    draggable={reagADrag}
                    onDragStart={e => handleDragStart('reagente_a', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: reagADrag ? 'grab' : 'default' }}>
                    <FrascoReagente cor="rgba(220,190,60,0.82)" label="Reag. A" sub="Tampão" nivel={76}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {reagADrag ? '🖱️ ' : ''}Reagente A
                  </span>
                  <span style={{ fontSize:8, color: cil1Cont === 'amostra_a' || cil1Cont === 'amostra_ab' ? '#fde68a' : '#94a3b8' }}>
                    {cil1Cont === 'amostra_a' || cil1Cont === 'amostra_ab' ? '✓ 4 gotas' : '4 gotas · Tampão Dureza'}
                  </span>
                </div>
              </div>

              {/* REAGENTE B — Indicador Calmagita */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('reagente_b')}`}
                    draggable={reagBDrag}
                    onDragStart={e => handleDragStart('reagente_b', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: reagBDrag ? 'grab' : 'default' }}>
                    <FrascoReagente cor="rgba(180,30,70,0.82)" label="Reag. B" sub="Calmagita" nivel={78}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {reagBDrag ? '🖱️ ' : ''}Reagente B
                  </span>
                  <span style={{ fontSize:8, color: cil1Cont === 'amostra_ab' ? '#f87171' : '#94a3b8' }}>
                    {cil1Cont === 'amostra_ab' ? '✓ 4 gotas' : '4 gotas · Indicador'}
                  </span>
                </div>
              </div>

              {/* REAGENTE C — EDTA */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div
                    className={`item-drag ${itemCls('reagente_c')}`}
                    draggable={reagCDrag}
                    onDragStart={e => handleDragStart('reagente_c', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: reagCDrag ? 'grab' : 'default' }}>
                    <FrascoReagente cor="rgba(60,100,210,0.82)" label="Reag. C" sub="EDTA" nivel={80}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#e7e5e4' }}>
                    {reagCDrag ? '🖱️ ' : ''}Reagente C
                  </span>
                  <span style={{ fontSize:8, color: cil2Cont === 'branco_edta' ? '#60a5fa' : '#94a3b8' }}>
                    {cil2Cont === 'branco_edta' ? '✓ 10 gotas' : '10 gotas · EDTA (Branco)'}
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

export default DurezaMk;
