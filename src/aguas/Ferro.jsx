/**
 * Ferro.jsx — Determinação de Ferro Total — Método Ferrozine
 *
 * Fluxo: Água deion. → Proveta → Erlenmeyer Branco
 *        Amostra     → Proveta → Erlenmeyer Amostra
 *        Ferrozine nos dois → Chapa aquecedora (digestão branda 20-30 min)
 *        → Resfriar → Completar 25 mL → Cubeta 25 mm → Fotômetro
 *        → ZERO (branco) → READ (amostra) → Resultado mg/L Fe
 *
 * Método: Ferrozine Iron Solution · λ = 562 nm · mg/L Fe
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import ErlenmeyerSVG from '../components/lab/ErlenmeyerSVG';
import CubetaSVG from '../components/lab/CubetaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragFerro } from '../hooks/useSimuladorDragFerro';
import { etapas } from './data/etapasFerro';


/* ═══════════════════════════════════════════════════════════
   CSS — animações desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_FERRO = `
  @keyframes ferDropFall {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 1;    }
    65%  { transform: translateX(-50%) translateY(48px);  opacity: 0.90; }
    100% { transform: translateX(-50%) translateY(68px);  opacity: 0;    }
  }
  @keyframes ferDropFall2 {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 0.85; }
    65%  { transform: translateX(-50%) translateY(44px);  opacity: 0.75; }
    100% { transform: translateX(-50%) translateY(62px);  opacity: 0;    }
  }
  @keyframes ferDropFall3 {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 0.70; }
    65%  { transform: translateX(-50%) translateY(52px);  opacity: 0.60; }
    100% { transform: translateX(-50%) translateY(72px);  opacity: 0;    }
  }
  @keyframes ferHeatPulse {
    0%, 100% { opacity: 0.55; }
    50%       { opacity: 0.95; }
  }
  @keyframes erlVibrar {
    0%,100% { transform: translateX(0) rotate(0deg); }
    12%     { transform: translateX(-5px) rotate(-2deg); }
    25%     { transform: translateX(5px) rotate(2deg); }
    38%     { transform: translateX(-3px) rotate(-1.2deg); }
    52%     { transform: translateX(3px) rotate(1.2deg); }
    65%     { transform: translateX(-2px) rotate(-0.6deg); }
    78%     { transform: translateX(2px) rotate(0.6deg); }
    90%     { transform: translateX(-1px) rotate(-0.2deg); }
  }
  .erl-vibrar { animation: erlVibrar 0.55s ease-in-out; transform-origin: center bottom; }
`;


/* ═══════════════════════════════════════════════════════════
   SVG — SACHÊ FERROZINE IRON SOLUTION
═══════════════════════════════════════════════════════════ */
const SacheFerrozineSVG = ({ usado = false }) => (
  <svg width="56" height="48" viewBox="0 0 56 48">
    <defs>
      <linearGradient id="sfGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#fed7aa" />
        <stop offset="100%" stopColor="#fdba74" />
      </linearGradient>
    </defs>
    <ellipse cx={28} cy={46} rx={22} ry={3} fill="rgba(0,0,0,0.15)" />
    <rect x={4} y={4} width={48} height={38} rx={5}
      fill="url(#sfGrad)" stroke="#ea580c" strokeWidth="1.5"
      opacity={usado ? 0.45 : 1} />
    <line x1={4} y1={15} x2={52} y2={15} stroke="#ea580c" strokeWidth="1" opacity="0.6" />
    <line x1={4} y1={31} x2={52} y2={31} stroke="#ea580c" strokeWidth="1" opacity="0.6" />
    {!usado && (
      <>
        <circle cx={16} cy={23} r={2.2} fill="rgba(154,52,18,0.35)" />
        <circle cx={26} cy={21} r={1.8} fill="rgba(154,52,18,0.30)" />
        <circle cx={35} cy={24} r={2.0} fill="rgba(154,52,18,0.32)" />
        <circle cx={22} cy={26} r={1.4} fill="rgba(154,52,18,0.25)" />
      </>
    )}
    <rect x={8} y={17} width={40} height={12} rx={2}
      fill="rgba(255,255,255,0.72)" />
    <text x={28} y={25.5} textAnchor="middle" fontSize="6"
      fill="#9a3412" fontFamily="monospace" fontWeight="700">
      FERROZINE
    </text>
    <text x={28} y={11} textAnchor="middle" fontSize="5"
      fill="#c2410c" fontFamily="sans-serif">sachê</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — CHAPA AQUECEDORA DE BANCADA
═══════════════════════════════════════════════════════════ */
/* desenha um erlenmeyer pequeno centrado em (cx, bottomY) */
const MiniErlSVG = ({ cx, bottomY, cor, corBorda, label }) => {
  const bx = cx, by = bottomY;
  return (
    <g>
      {/* corpo: trapézio arredondado */}
      <path
        d={`M ${bx-3},${by-38} L ${bx-3},${by-26} L ${bx-14},${by} Q ${bx-14},${by+3} ${bx},${by+3} Q ${bx+14},${by+3} ${bx+14},${by} L ${bx+3},${by-26} L ${bx+3},${by-38} Z`}
        fill={cor} stroke={corBorda} strokeWidth="1.2" />
      {/* ombros (transição pescoço→corpo) */}
      <path
        d={`M ${bx-3},${by-26} L ${bx-14},${by} L ${bx+14},${by} L ${bx+3},${by-26} Z`}
        fill="rgba(0,0,0,0.10)" />
      {/* pescoço */}
      <rect x={bx-3} y={by-50} width={6} height={14} rx={1}
        fill={cor} stroke={corBorda} strokeWidth="1.0" />
      {/* boca */}
      <rect x={bx-5} y={by-52} width={10} height={4} rx={1}
        fill={corBorda} opacity="0.85" />
      {/* rótulo */}
      <text x={bx} y={by+14} textAnchor="middle" fontSize="8"
        fill="#e2e8f0" fontFamily="monospace" fontWeight="700">{label}</text>
    </g>
  );
};

const ChapaAquecedoraSVG = ({
  ativa      = false,
  progresso  = 0,
  brancoNela = false,
  amostraNela = false,
}) => (
  <svg width="230" height="150" viewBox="0 0 230 150">
    <defs>
      <linearGradient id="chapaBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="chapaSup" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor={ativa ? '#b45309' : '#292524'} />
        <stop offset="100%" stopColor={ativa ? '#78350f' : '#1c1917'} />
      </linearGradient>
      <filter id="chapaSh"><feDropShadow dx="2" dy="5" stdDeviation="5" floodOpacity=".40" /></filter>
    </defs>

    <ellipse cx={115} cy={147} rx={90} ry={5} fill="rgba(0,0,0,0.18)" />

    {/* Corpo */}
    <g filter="url(#chapaSh)">
      <rect x={6} y={65} width={218} height={74} rx={9}
        fill="url(#chapaBase)" stroke="#111827" strokeWidth="2" />
    </g>

    {/* Superfície aquecedora */}
    <rect x={10} y={50} width={210} height={22} rx={4}
      fill="url(#chapaSup)" stroke="#111827" strokeWidth="1.5" />

    {/* Ranhuras / bobinas */}
    {[0,1,2,3,4,5].map(i => (
      <line key={i} x1={18 + i * 36} y1={54} x2={18 + i * 36} y2={68}
        stroke={ativa ? 'rgba(251,146,60,0.55)' : 'rgba(87,83,78,0.45)'}
        strokeWidth={ativa ? 2.2 : 1.6} strokeLinecap="round" />
    ))}

    {/* Glow aquecimento */}
    {ativa && (
      <rect x={10} y={50} width={210} height={22} rx={4}
        fill="rgba(234,88,12,0.20)"
        style={{ animation: 'ferHeatPulse 0.8s ease-in-out infinite' }} />
    )}

    {/* Calor irradiado sob os frascos */}
    {ativa && brancoNela && (
      <ellipse cx={58} cy={54} rx={22} ry={5}
        fill="rgba(251,146,60,0.25)"
        style={{ animation: 'ferHeatPulse 0.6s ease-in-out infinite' }} />
    )}
    {ativa && amostraNela && (
      <ellipse cx={172} cy={54} rx={22} ry={5}
        fill="rgba(251,146,60,0.25)"
        style={{ animation: 'ferHeatPulse 0.6s ease-in-out infinite' }} />
    )}

    {/* Frascos na chapa */}
    {brancoNela && (
      <MiniErlSVG cx={58} bottomY={51}
        cor="rgba(255,208,200,0.72)" corBorda="#a8a29e" label="Branco" />
    )}
    {amostraNela && (
      <MiniErlSVG cx={172} bottomY={51}
        cor="rgba(210,88,45,0.78)" corBorda="#a8a29e" label="Amostra" />
    )}

    {/* Linha separadora visual branco/amostra */}
    {(brancoNela || amostraNela) && (
      <line x1={115} y1={52} x2={115} y2={70}
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
    )}

    {/* Painel de controle */}
    <rect x={14} y={72} width={202} height={58} rx={6}
      fill="#0f172a" stroke="#334155" strokeWidth="1.0" />

    {/* Display */}
    <rect x={18} y={76} width={130} height={44} rx={4}
      fill="#001428" stroke="#1e3a5f" strokeWidth="0.8" />
    <text x={83} y={90} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="monospace">
      {ativa ? 'DIGESTÃO BRANDA' : 'CHAPA AQUECEDORA'}
    </text>
    <text x={83} y={102} textAnchor="middle" fontSize="10.5" fontFamily="monospace" fontWeight="700"
      fill={ativa ? '#f59e0b' : '#3b82f6'}>
      {ativa ? `${Math.floor(progresso)}%` : 'AGUARDANDO'}
    </text>
    <text x={83} y={112} textAnchor="middle" fontSize="6" fill={ativa ? '#d97706' : '#475569'} fontFamily="monospace">
      {ativa ? '20–30 min · Digestão' : brancoNela || amostraNela ? 'Clique ⏻ para iniciar' : 'Aguardando frascos'}
    </text>
    {ativa && (
      <>
        <rect x={22} y={116} width={122} height={5} rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x={22} y={116} width={Math.max(4, 122 * progresso / 100)} height={5} rx="2.5"
          fill="rgba(245,158,11,0.72)" />
      </>
    )}

    {/* Botão LIGAR */}
    <circle cx={188} cy={100} r={17} fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
    <circle cx={188} cy={100} r={11}
      fill={ativa ? '#dc2626' : '#374151'} stroke={ativa ? '#b91c1c' : '#4b5563'} strokeWidth="1" />
    {ativa && (
      <circle cx={188} cy={100} r={16} fill="none" stroke="rgba(220,38,38,0.42)" strokeWidth="2.5">
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
      </circle>
    )}
    <text x={188} y={103.5} textAnchor="middle" fontSize="10" fill="white" fontFamily="monospace">⏻</text>

    <text x={115} y={142} textAnchor="middle" fontSize="6" fill="#4b5563" fontFamily="monospace">
      Chapa Aquecedora · Digestão Branda
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — FOTÔMETRO ADAPTADO PARA FERRO TOTAL (mg/L Fe)
═══════════════════════════════════════════════════════════ */
const FotometroFeSVG = ({
  cubetaDentro = false,
  zerando  = false,
  zerado   = false,
  lendo    = false,
  resultado = null,
  zerAtivo  = false,
  lerAtivo  = false,
  onZero,
  onLer,
}) => (
  <svg width="240" height="175" viewBox="0 0 240 175">
    <defs>
      <linearGradient id="ffBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#2c3e55" />
        <stop offset="100%" stopColor="#1a2535" />
      </linearGradient>
      <linearGradient id="ffScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#001830" />
        <stop offset="100%" stopColor="#000e20" />
      </linearGradient>
      <filter id="ffSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".5" /></filter>
    </defs>
    <g filter="url(#ffSh)">
      <rect x="4" y="24" width="232" height="142" rx="10" fill="url(#ffBody)" stroke="#131e2d" strokeWidth="2" />
      <rect x="8" y="12" width="224" height="20" rx="6" fill="#1e2e42" stroke="#1e3050" strokeWidth="1" />
    </g>
    <text x="22" y="25" fontSize="7.5" fill="#4a9fd4" fontFamily="monospace" fontWeight="700">HACH DR900</text>
    <text x="22" y="31.5" fontSize="5.5" fill="#3a5a7a" fontFamily="sans-serif">Colorimeter · Photometer</text>
    <circle cx="216" cy="22" r="5"
      fill={resultado ? '#22c55e' : (lendo || zerando) ? '#f59e0b' : '#3b82f6'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    {(lendo || zerando || resultado) && (
      <circle cx="216" cy="22" r="9" fill="none"
        stroke={resultado ? 'rgba(34,197,94,0.38)' : 'rgba(245,158,11,0.38)'}
        strokeWidth="2" />
    )}
    <rect x="14" y="38" width="148" height="72" rx="5" fill="url(#ffScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x="16" y="40" width="144" height="68" rx="4" fill="rgba(0,40,80,0.4)" />
    <text x="88" y="56" textAnchor="middle" fontSize="7" fill="#2a6a9a" fontFamily="monospace">FERRO TOTAL · 562 nm</text>
    <line x1="22" y1="60" x2="154" y2="60" stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />
    {resultado ? (
      <>
        <text x="88" y="81" textAnchor="middle" fontSize="26" fill="#00ff88" fontFamily="monospace" fontWeight="700">{resultado}</text>
        <text x="88" y="96" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">mg/L Fe</text>
        <text x="88" y="105" textAnchor="middle" fontSize="6" fill="#16a34a" fontFamily="sans-serif">✓ Leitura concluída</text>
      </>
    ) : lendo ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="11" fill="#fbbf24" fontFamily="monospace">Reading...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="3s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Analisando amostra...</text>
      </>
    ) : zerando ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="monospace">Zerando...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="2s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Zerando com branco...</text>
      </>
    ) : zerado ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
        <text x="88" y="87" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="monospace">0.000 mg/L Fe</text>
        <text x="88" y="100" textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="sans-serif">Branco de referência OK</text>
        <text x="88" y="109" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Insira amostra e pressione READ</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="88" y="91" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="88" y="104" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Pressione ZERO ou READ</text>
      </>
    ) : (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#4a7a9a" fontFamily="monospace">STANDBY</text>
        <text x="88" y="92" textAnchor="middle" fontSize="7.5" fill="#3a5a6a" fontFamily="sans-serif">Aguardando cubeta...</text>
      </>
    )}
    <rect x="172" y="38" width="56" height="72" rx="5" fill="#0a1525"
      stroke={cubetaDentro ? '#22c55e' : '#2a3a52'} strokeWidth="1.5" />
    <text x="200" y="53" textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="monospace">SAMPLE</text>
    {cubetaDentro ? (
      <g>
        <rect x="182" y="60" width="36" height="46" rx="2"
          fill="rgba(200,80,40,0.65)" stroke="rgba(220,120,80,0.8)" strokeWidth="1" />
        <rect x="184" y="62" width="6" height="38" fill="rgba(255,255,255,0.16)" />
        <rect x="166" y="78" width="52" height="8" rx="3"
          fill={resultado ? 'rgba(34,197,94,0.15)' : 'rgba(14,165,233,0.1)'} />
      </g>
    ) : (
      <rect x="182" y="60" width="36" height="46" rx="2"
        fill="rgba(5,12,25,0.6)" stroke="#1a2535" strokeWidth="0.8" strokeDasharray="4,2" />
    )}
    <circle cx="168" cy="84" r="4"
      fill={cubetaDentro ? 'rgba(14,165,233,0.8)' : 'rgba(14,165,233,0.22)'}
      stroke="rgba(14,165,233,0.35)" strokeWidth="1" />
    {['ON', 'ZERO', 'READ', 'MENU'].map((lbl, i) => {
      const isZ = lbl === 'ZERO', isR = lbl === 'READ';
      const active = (isZ && zerAtivo) || (isR && lerAtivo);
      const fn = isZ ? onZero : isR ? onLer : undefined;
      return (
        <g key={lbl} onClick={fn} style={{ cursor: active ? 'pointer' : 'default' }}>
          <rect x={18 + i * 36} y="126" width="32" height="14" rx="4"
            fill={active ? '#0f2a48' : '#0f1e30'}
            stroke={active ? '#22d3ee' : '#1e3a5f'}
            strokeWidth={active ? 1.8 : 1} />
          <text x={34 + i * 36} y="135.5" textAnchor="middle" fontSize="5.5"
            fill={active ? '#22d3ee' : '#60a5fa'} fontFamily="monospace"
            fontWeight={active ? '700' : '400'}>{lbl}</text>
        </g>
      );
    })}
    <text x="120" y="167" textAnchor="middle" fontSize="5.5" fill="#2a4060" fontFamily="sans-serif">
      Ferro Total · Método Ferrozine · mg/L Fe
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorFerro = () => {
  useDragOverlay();

  // ── Injeta keyframes ──────────────────────────────────
  useEffect(() => {
    const sid = 'ferro-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ESTILOS_FERRO;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(sid); if (el) el.remove(); };
  }, []);

  // ── Game state ────────────────────────────────────────
  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado, mostrarParabens,
    concluido, mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  // ── Proveta ───────────────────────────────────────────
  const [nivelProveta, setNivelProveta] = useState(0);
  const [provetaCheia, setProvetaCheia] = useState(false);

  // ── Frascos fonte ─────────────────────────────────────
  const [nivelAgua,   setNivelAgua]   = useState(85);
  const [nivelAmostra, setNivelAmostra] = useState(82);

  // ── Erlenmeyer Branco ─────────────────────────────────
  const [nivelBranco,    setNivelBranco]    = useState(0);
  const [corBranco,      setCorBranco]      = useState('rgba(220,235,255,0.08)');
  const [brancoPrep,     setBrancoPrep]     = useState(false);
  const [ferrozineBranco,setFerrozineBranco]= useState(false);
  const [brancoNaChapa,  setBrancoNaChapa]  = useState(false);

  // ── Erlenmeyer Amostra ────────────────────────────────
  const [nivelAmostraCopo, setNivelAmostraCopo] = useState(0);
  const [corAmostraCopo,   setCorAmostraCopo]   = useState('rgba(220,235,255,0.08)');
  const [amostraPrep,      setAmostraPrep]      = useState(false);
  const [ferrozineAmostra, setFerrozineAmostra] = useState(false);
  const [amostraNaChapa,   setAmostraNaChapa]   = useState(false);

  // ── Chapa aquecedora ──────────────────────────────────
  const [digestaoAtiva,    setDigestaoAtiva]    = useState(false);
  const [digestaoConcluida,setDigestaoConcluida]= useState(false);
  const [progressoDigestao,setProgressoDigestao]= useState(0);

  // ── Cubeta ────────────────────────────────────────────
  const [nivelCubeta,       setNivelCubeta]       = useState(0);
  const [corCubeta,         setCorCubeta]         = useState('rgba(220,235,255,0.08)');
  const [cubetaNoFotometro, setCubetaNoFotometro] = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [zerando,   setZerando]   = useState(false);
  const [zerado,    setZerado]    = useState(false);
  const [lendo,     setLendo]     = useState(false);
  const [resultado, setResultado] = useState(null);

  // ── Fator de diluição ─────────────────────────────────
  const [fatorDiluicao] = useState(1);

  // ── TIMER: digestão branda (step 8 click) ─────────────
  useEffect(() => {
    if (!digestaoAtiva) return;
    setProgressoDigestao(0);
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 2, 100);
      setProgressoDigestao(p);
    }, 100); // 100ms × 50 = 5s total
    const id = setTimeout(() => {
      clearInterval(tick);
      setDigestaoAtiva(false);
      setDigestaoConcluida(true);
      setProgressoDigestao(100);
      // Intensifica cor após digestão
      setCorAmostraCopo('rgba(195,72,38,0.78)');
      celebrarAcerto(100);
      proximaEtapa(); // → step 9
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [digestaoAtiva]);

  // ── TIMER: resfriamento (step 9) ──────────────────────
  useEffect(() => {
    if (etapaAtual !== 9) return;
    const id = setTimeout(() => {
      setBrancoNaChapa(false);
      setAmostraNaChapa(false);
      celebrarAcerto(100);
      proximaEtapa();
    }, 1800);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── TIMER: auto-conclusão (step 18) ──────────────────
  useEffect(() => {
    if (etapaAtual !== 18) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragFerro(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAgua, setNivelAmostra,
    setNivelBranco, setCorBranco, setBrancoPrep, setFerrozineBranco, setBrancoNaChapa,
    setNivelAmostraCopo, setCorAmostraCopo, setAmostraPrep, setFerrozineAmostra, setAmostraNaChapa,
    setNivelCubeta, setCorCubeta,
    setCubetaNoFotometro,
  });

  // ── Click chapa (step 8) ──────────────────────────────
  const handleClicarChapa = () => {
    if (etapaAtual !== 8 || !brancoNaChapa || !amostraNaChapa || digestaoAtiva) return;
    setDigestaoAtiva(true);
  };

  // ── Click ZERO fotômetro (step 14) ────────────────────
  const handleZerarFotometro = () => {
    if (etapaAtual !== 14 || !cubetaNoFotometro || zerando || zerado) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaNoFotometro(false);
      setNivelCubeta(0);
      setCorCubeta('rgba(220,235,255,0.08)');
      celebrarAcerto(150);
      proximaEtapa();
    }, 2200);
  };

  // ── Click READ fotômetro (step 17) ───────────────────
  const handleLerFotometro = () => {
    if (etapaAtual !== 17 || !cubetaNoFotometro || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * 1.9 + 0.05).toFixed(3));
      setResultado(raw.toFixed(3));
      setLendo(false);
      celebrarAcerto(200);
      proximaEtapa();
    }, 3000);
  };

  // Resultado corrigido pelo fator de diluição
  const resultadoCorrigido = resultado
    ? (parseFloat(resultado) * fatorDiluicao).toFixed(3)
    : null;

  // Derivados — cada erlenmeyer usa seu próprio estado de chapa
  const brancoDraggable  = isItem('erlenmeyer_branco')  && !brancoNaChapa;
  const amostraDraggable = isItem('erlenmeyer_amostra') && !amostraNaChapa;
  const cubetaDraggable  = (etapaAtual === 13 || etapaAtual === 16) && !cubetaNoFotometro;


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding: 16, fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* ── OVERLAY PARABÉNS ── */}
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

      {/* ── OVERLAY ERRO ── */}
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

      {/* ── BANNER PONTO FINAL ── */}
      {resultado && etapaAtual === 18 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🟠 Leitura Concluída!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Ferro Total: <strong>{resultadoCorrigido} mg/L Fe</strong>
              {fatorDiluicao > 1 && ` (fator ${fatorDiluicao}x)`}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #ea580c', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🟠</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#fb923c', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Ferro Total — Método Ferrozine · mg/L Fe
            </p>
            <div style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.30)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>Branco</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fda4af', fontFamily: 'monospace' }}>0.000</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>mg/L Fe</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>Leitura</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fb923c', fontFamily: 'monospace' }}>{resultado}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>mg/L Fe</div>
                </div>
                {fatorDiluicao > 1 && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>Fator</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>{fatorDiluicao}×</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Diluição</div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ background: 'rgba(234,88,12,0.12)', border: '1px solid rgba(234,88,12,0.35)', borderRadius: 14, padding: '16px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Ferro Total</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#ea580c', fontFamily: 'monospace', lineHeight: 1 }}>{resultadoCorrigido}</div>
              <div style={{ fontSize: 14, color: '#fb923c', fontWeight: 700, marginTop: 4 }}>mg/L Fe</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Método Ferrozine · λ = 562 nm · Leitura finalizada com sucesso
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#ea580c,#c2410c)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              🔄 Recomeçar
            </button>
          </div>
        </div>
      )}


      {/* ════════════════════════════════════════════════
         BANCADA
      ════════════════════════════════════════════════ */}
      <LayoutSimulador
        etapaAtual={etapaAtual}
        etapas={etapas}
        pontuacao={pontuacao}
        titulo="Ferro Total"
        subtitulo={"Método Ferrozine · mg/L Fe\nλ = 562 nm"}
        icone="🟠"
        badges={['💧 ÁGUAS', '🔬 FOTOMETRIA']}
        footerLabel="🟠 Ferro Total"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 820 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🟠 Bancada — Determinação de Ferro Total (Método Ferrozine)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: FOTÔMETRO + ERLENMEYERS + CUBETA ══ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* FOTÔMETRO */}
              <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div className={dropCls('fotometro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                  <FotometroFeSVG
                    cubetaDentro={cubetaNoFotometro}
                    zerando={zerando}
                    zerado={zerado && !cubetaNoFotometro}
                    lendo={lendo}
                    resultado={resultado}
                    zerAtivo={etapaAtual === 14 && cubetaNoFotometro && !zerando}
                    lerAtivo={etapaAtual === 17 && cubetaNoFotometro && !lendo && !resultado}
                    onZero={handleZerarFotometro}
                    onLer={handleLerFotometro}
                  />
                  {etapaAtual === 14 && cubetaNoFotometro && !zerando && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>🔵 Clique ZERO para zerar!</div>
                  )}
                  {etapaAtual === 17 && cubetaNoFotometro && !lendo && !resultado && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>🟢 Clique READ para ler!</div>
                  )}
                  {(zerando || lendo) && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>⚡ Processando...</div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Fotômetro HACH DR900</span>
              </ZonaDrop>

              {/* ERLENMEYER BRANCO */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="erlenmeyer_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('erlenmeyer_branco')} ${dropCls('erlenmeyer_branco')}`}
                    style={{ opacity: brancoNaChapa ? 0.15 : 1, transition: 'opacity 0.3s' }}
                    draggable={brancoDraggable}
                    onDragStart={e => handleDragStart('erlenmeyer_branco', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <ErlenmeyerSVG nivel={nivelBranco} cor={corBranco} id="branco" />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: brancoNaChapa ? '#57534e' : '#e7e5e4' }}>
                    {isItem('erlenmeyer_branco') ? '🖱️ ' : ''}Erlenmeyer Branco
                  </span>
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>
                    {brancoNaChapa          ? '🔥 Na chapa'
                      : ferrozineBranco    ? '🟠 + Ferrozine'
                      : brancoPrep         ? '💧 25 mL água'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CHAPA AQUECEDORA */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="chapa" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={dropCls('chapa')}
                    style={{ cursor: etapaAtual === 8 && brancoNaChapa && amostraNaChapa && !digestaoAtiva ? 'pointer' : 'default' }}
                    onClick={handleClicarChapa}
                  >
                    <ChapaAquecedoraSVG
                      ativa={digestaoAtiva}
                      progresso={progressoDigestao}
                      brancoNela={brancoNaChapa}
                      amostraNela={amostraNaChapa}
                    />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#a8a29e' }}>
                    {digestaoAtiva ? `⏱ Digestão ${Math.floor(progressoDigestao)}%`
                      : digestaoConcluida ? '✓ Digestão concluída'
                      : 'Chapa Aquecedora'}
                  </span>
                  {etapaAtual === 8 && brancoNaChapa && amostraNaChapa && !digestaoAtiva && (
                    <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700 }}>↑ Clique para iniciar</span>
                  )}
                </ZonaDrop>
              </div>

              {/* ERLENMEYER AMOSTRA */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="erlenmeyer_amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('erlenmeyer_amostra')} ${dropCls('erlenmeyer_amostra')}`}
                    style={{ opacity: amostraNaChapa ? 0.15 : 1, transition: 'opacity 0.3s' }}
                    draggable={amostraDraggable}
                    onDragStart={e => handleDragStart('erlenmeyer_amostra', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <ErlenmeyerSVG nivel={nivelAmostraCopo} cor={corAmostraCopo} id="amostr" />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: amostraNaChapa ? '#57534e' : '#e7e5e4' }}>
                    {isItem('erlenmeyer_amostra') ? '🖱️ ' : ''}Erlenmeyer Amostra
                  </span>
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>
                    {amostraNaChapa         ? '🔥 Na chapa'
                      : ferrozineAmostra   ? '🟠 + Ferrozine'
                      : amostraPrep        ? '💧 25 mL amostra'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA 25 mm */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('cubeta')} ${dropCls('cubeta')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 11, padding: '4px 2px' }}
                    draggable={cubetaDraggable}
                    onDragStart={e => handleDragStart('cubeta', e)}
                    onDragEnd={handleDragEnd}
                  >
                    {!cubetaNoFotometro
                      ? <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="main" />
                      : (
                        <div style={{ width: 80, height: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <span style={{ fontSize: 18 }}>✅</span>
                          <span style={{ fontSize: 8.5, color: '#22c55e', fontWeight: 700 }}>No fotômetro</span>
                        </div>
                      )
                    }
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {cubetaDraggable ? '🖱️ ' : ''}Cubeta 25 mm
                  </span>
                  {nivelCubeta > 0 && !cubetaNoFotometro && (
                    <span style={{ fontSize: 8, color: corCubeta.includes('205') ? '#fda4af' : '#fb923c', fontWeight: 700 }}>
                      {corCubeta.includes('205') ? '🌸 Branco' : '🟠 Amostra'}
                    </span>
                  )}
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ ZONA INFERIOR: REAGENTES ════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'flex-end' }}>

              {/* ÁGUA DEIONIZADA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="agua" className={itemCls('agua')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(200,230,255,0.80)" label="H₂O desion." sub="" nivel={nivelAgua} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Água Deion.</span>
                </ItemBancada>
              </div>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(210,190,140,0.80)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* PROVETA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta 25 mL</span>
                  {provetaCheia && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>25 mL medidos</span>}
                </ZonaDrop>
              </div>

              {/* FERROZINE + SELETOR FATOR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <ZonaDrop id="ferrozine" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`item-drag ${itemCls('ferrozine')} ${dropCls('ferrozine')}`}
                    draggable={isItem('ferrozine')}
                    onDragStart={e => handleDragStart('ferrozine', e)} onDragEnd={handleDragEnd}>
                    <SacheFerrozineSVG usado={ferrozineBranco && ferrozineAmostra} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('ferrozine') ? '🖱️ ' : ''}Ferrozine Iron Sol.</span>
                  {(ferrozineBranco || ferrozineAmostra) && (
                    <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>
                      {ferrozineBranco && ferrozineAmostra ? '✓ Adicionado (B+A)' : ferrozineBranco ? '✓ No Branco' : '✓ Na Amostra'}
                    </span>
                  )}
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

export default SimuladorFerro;
