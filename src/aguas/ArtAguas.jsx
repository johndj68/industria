/**
 * ArtAguas.jsx — ART em Águas Residuais — Método Colorimétrico Antrona
 *
 * Fluxo: Amostra → Béquer A + Celite → Homogeneizar
 *        → Funil + Papel Filtro → Béquer B → Filtração automática
 *        → Béquer B → Proveta (2 mL) → Tubo Amostra
 *        → Água Desmin → Proveta (2 mL) → Tubo Branco
 *        → Antrona (10 mL cada) → Agitar
 *        → Banho-maria ebulição 12 min → Resfriamento auto
 *        → Cubeta 25 mm → Espectrofotômetro → ZERO (branco) → READ
 *        → Resultado mg/L ART
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import BequerSVG from '../components/lab/BequerSVG';
import TuboConicoSVG from '../components/lab/TuboConicoSVG';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import CubetaSVG from '../components/lab/CubetaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragArtAguas } from '../hooks/useSimuladorDragArtAguas';
import { etapas } from './data/etapasArtAguas';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes aaPoFall {
    0%   { transform: translateX(-50%) translateY(0);   opacity: 0;    }
    8%   { opacity: 1; }
    70%  { transform: translateX(-50%) translateY(35px); opacity: 0.72; }
    100% { transform: translateX(-50%) translateY(50px); opacity: 0;    }
  }
  @keyframes aaPoFall2 {
    0%   { transform: translateX(-50%) translateY(0);   opacity: 0;    }
    8%   { opacity: 0.82; }
    70%  { transform: translateX(-50%) translateY(32px); opacity: 0.58; }
    100% { transform: translateX(-50%) translateY(46px); opacity: 0;    }
  }
  @keyframes aaVibrar {
    0%,100% { transform: translateX(0)    rotate(0deg);    }
    12%     { transform: translateX(-4px) rotate(-1.8deg); }
    25%     { transform: translateX(4px)  rotate(1.8deg);  }
    38%     { transform: translateX(-3px) rotate(-1.0deg); }
    52%     { transform: translateX(3px)  rotate(1.0deg);  }
    65%     { transform: translateX(-2px) rotate(-0.5deg); }
    80%     { transform: translateX(2px)  rotate(0.5deg);  }
  }
  @keyframes aaTimerPulse {
    0%,100% { opacity: 0.60; }
    50%     { opacity: 1.00; }
  }
  .aa-vibrar { animation: aaVibrar 0.60s ease-in-out; transform-origin: center bottom; }
`;

/* Partícula de pó Celite */
const PoCeliteCaindo = ({ offsetX = 0, animName = 'aaPoFall', delay = 0, animKey = 'c' }) => (
  <div key={animKey} style={{
    position: 'absolute', left: `calc(50% + ${offsetX}px)`, top: 3,
    width: 7, height: 7, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(228,222,216,0.96), rgba(198,192,186,0.88))',
    opacity: 0, pointerEvents: 'none', zIndex: 30,
    animationName: animName, animationDuration: '0.52s',
    animationDelay: `${delay}ms`, animationFillMode: 'forwards',
    animationTimingFunction: 'ease-in',
  }} />
);


/* ═══════════════════════════════════════════════════════════
   SVG — FUNIL (item arrastável)
═══════════════════════════════════════════════════════════ */
const FunilItemSVG = ({ usado = false }) => (
  <svg width="52" height="60" viewBox="0 0 52 60" opacity={usado ? 0.40 : 1}>
    <ellipse cx={26} cy={58} rx={18} ry={3} fill="rgba(0,0,0,0.12)" />
    {/* Borda topo */}
    <ellipse cx={26} cy={8} rx={23} ry={5} fill="rgba(200,228,248,0.50)" stroke="#8fb8d8" strokeWidth="1.5" />
    {/* Corpo cônico */}
    <path d="M 3,8 L 20,42 L 20,56 L 32,56 L 32,42 L 49,8 Z"
      fill="rgba(195,225,248,0.45)" stroke="#8fb8d8" strokeWidth="1.4" />
    {/* Brilho lateral */}
    <path d="M 5,8 L 10,30 L 12,30 L 7,8 Z" fill="rgba(255,255,255,0.35)" />
    {/* Haste */}
    <rect x={21} y={42} width={10} height={14} rx="2"
      fill="rgba(200,228,248,0.55)" stroke="#8fb8d8" strokeWidth="1.2" />
    <text x={26} y={28} textAnchor="middle" fontSize="8" fill="#1e4060"
      fontFamily="sans-serif" fontWeight="700">Funil</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — PAPEL FILTRO QUALITATIVO (item arrastável)
═══════════════════════════════════════════════════════════ */
const PapelFiltroItemSVG = ({ usado = false }) => (
  <svg width="50" height="52" viewBox="0 0 50 52" opacity={usado ? 0.40 : 1}>
    <ellipse cx={25} cy={50} rx={18} ry={3} fill="rgba(0,0,0,0.10)" />
    {/* Círculo (papel plano) */}
    <ellipse cx={25} cy={14} rx={22} ry={10}
      fill="rgba(252,248,240,0.92)" stroke="#c8b898" strokeWidth="1.4" />
    {/* Linhas de dobra */}
    <line x1={3} y1={14} x2={25} y2={14} stroke="#c8b898" strokeWidth="0.8" />
    <line x1={25} y1={4}  x2={25} y2={24} stroke="#c8b898" strokeWidth="0.8" />
    {/* Cone dobrado */}
    <path d="M 8,14 Q 25,32 42,14 L 38,40 Q 25,48 12,40 Z"
      fill="rgba(248,244,234,0.92)" stroke="#c8b898" strokeWidth="1.2" />
    {/* Textura de fibra */}
    <line x1={16} y1={20} x2={20} y2={36} stroke="rgba(200,185,160,0.30)" strokeWidth="0.6" />
    <line x1={25} y1={20} x2={25} y2={42} stroke="rgba(200,185,160,0.30)" strokeWidth="0.6" />
    <line x1={34} y1={20} x2={30} y2={36} stroke="rgba(200,185,160,0.30)" strokeWidth="0.6" />
    <text x={25} y={46} textAnchor="middle" fontSize="6" fill="#6b5030"
      fontFamily="sans-serif">Papel Filtro</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — BANHO-MARIA
═══════════════════════════════════════════════════════════ */
const BanhoMariaSVG = ({ ativa, progresso, tuboBrancoDentro, tuboAmostraDentro,
  corTuboA, corTuboB }) => (
  <svg width="240" height="160" viewBox="0 0 240 160">
    <defs>
      <linearGradient id="bmBody2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="bmAgua2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor={ativa ? 'rgba(59,130,246,0.60)' : 'rgba(37,99,235,0.38)'} />
        <stop offset="100%" stopColor="rgba(29,78,216,0.55)" />
      </linearGradient>
      <filter id="bmSh2"><feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity=".32" /></filter>
    </defs>
    <ellipse cx={120} cy={157} rx={95} ry={5} fill="rgba(0,0,0,0.13)" />
    <g filter="url(#bmSh2)">
      <rect x={5} y={28} width={230} height={125} rx={10} fill="url(#bmBody2)" stroke="#111827" strokeWidth="2" />
    </g>
    {/* Janela de água */}
    <rect x={12} y={35} width={216} height={85} rx={7} fill="url(#bmAgua2)" />
    {/* Bolhas quando ativa */}
    {ativa && [0,1,2,3,4,5,6].map(i => (
      <circle key={i} cx={18 + i*34} cy={90} r={2.5 + (i%3)}
        fill="rgba(255,255,255,0.38)">
        <animate attributeName="cy" from="113" to="40"
          dur={`${0.65 + i*0.11}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.55" to="0"
          dur={`${0.65 + i*0.11}s`} repeatCount="indefinite" />
      </circle>
    ))}
    {/* Vapor */}
    {ativa && [52,120,188].map((cx, i) => (
      <path key={i} d={`M ${cx},32 Q ${cx-5},25 ${cx},18 Q ${cx+5},11 ${cx},4`}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round">
        <animate attributeName="opacity" from="0.25" to="0" dur={`${1.1+i*0.15}s`} repeatCount="indefinite" />
      </path>
    ))}
    {/* Rack de suporte */}
    <rect x={72} y={30} width={96} height={6} rx={2} fill="#0f172a" stroke="#334155" strokeWidth="1" />
    {[82, 148].map((x, i) => (
      <rect key={i} x={x} y={32} width={14} height={70} rx={2}
        fill="rgba(15,23,42,0.55)" stroke="#334155" strokeWidth="0.8" />
    ))}
    {/* Tubo Branco */}
    {tuboBrancoDentro && (
      <g>
        <rect x={85} y={34} width={8} height={62} rx={2} fill={corTuboB} stroke="rgba(180,180,200,0.5)" strokeWidth="0.8" />
        <rect x={84} y={30} width={10} height={6} rx={1} fill="rgba(200,225,245,0.25)" stroke="rgba(180,180,200,0.45)" strokeWidth="0.8" />
      </g>
    )}
    {/* Tubo Amostra */}
    {tuboAmostraDentro && (
      <g>
        <rect x={151} y={34} width={8} height={62} rx={2} fill={corTuboA} stroke="rgba(180,180,200,0.5)" strokeWidth="0.8" />
        <rect x={150} y={30} width={10} height={6} rx={1} fill="rgba(200,225,245,0.25)" stroke="rgba(180,180,200,0.45)" strokeWidth="0.8" />
        {ativa && (
          <rect x={151} y={34} width={8} height={62} rx={2} fill={corTuboA} opacity="0.35"
            style={{ animation: 'aaTimerPulse 0.9s ease-in-out infinite' }} />
        )}
      </g>
    )}
    {/* Painel de controle */}
    <rect x={12} y={124} width={216} height={22} rx={5} fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
    <text x={120} y={133.5} textAnchor="middle" fontSize={7} fill="#64748b" fontFamily="monospace">
      {ativa ? `AQUECENDO · ${Math.floor(progresso)}% · 12 MINUTOS`
        : (tuboBrancoDentro || tuboAmostraDentro) ? 'Clique ▶ para iniciar ebulição'
        : 'Banho-maria · Ebulição · 12 min'}
    </text>
    {ativa && (
      <>
        <rect x={16} y={137} width={208} height={5} rx="2.5" fill="rgba(255,255,255,0.07)" />
        <rect x={16} y={137} width={Math.max(4, 208 * progresso / 100)} height={5} rx="2.5"
          fill="rgba(239,68,68,0.72)" style={{ transition: 'width 0.1s linear' }} />
      </>
    )}
    <text x={120} y={152} textAnchor="middle" fontSize={5.5} fill="#374151" fontFamily="monospace">
      Banho-maria em Ebulição
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — ESPECTROFOTÔMETRO CURVA ANTRONA
═══════════════════════════════════════════════════════════ */
const EspectrofotometroAntronaSVG = ({
  cubetaDentro = false, corCubeta = 'rgba(200,220,240,0.65)',
  zerando = false, zerado = false, lendo = false, resultado = null,
  zerAtivo = false, lerAtivo = false, onZero, onLer,
}) => (
  <svg width="240" height="175" viewBox="0 0 240 175">
    <defs>
      <linearGradient id="eaBody2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#2c3e55" />
        <stop offset="100%" stopColor="#1a2535" />
      </linearGradient>
      <linearGradient id="eaScr2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#001830" />
        <stop offset="100%" stopColor="#000e20" />
      </linearGradient>
      <filter id="eaSh2"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".5" /></filter>
    </defs>
    <g filter="url(#eaSh2)">
      <rect x="4" y="24" width="232" height="142" rx="10" fill="url(#eaBody2)" stroke="#131e2d" strokeWidth="2" />
      <rect x="8" y="12" width="224" height="20" rx="6" fill="#1e2e42" stroke="#1e3050" strokeWidth="1" />
    </g>
    <text x="22" y="25" fontSize="7.5" fill="#4a9fd4" fontFamily="monospace" fontWeight="700">ESPECTROFOTÔMETRO</text>
    <text x="22" y="31.5" fontSize="5.5" fill="#3a5a7a" fontFamily="sans-serif">Curva: Antrona · ART</text>
    <circle cx="216" cy="22" r="5"
      fill={resultado ? '#22c55e' : (lendo || zerando) ? '#f59e0b' : '#3b82f6'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <rect x="14" y="38" width="148" height="72" rx="5" fill="url(#eaScr2)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x="16" y="40" width="144" height="68" rx="4" fill="rgba(0,40,80,0.4)" />
    <text x="88" y="56" textAnchor="middle" fontSize="7" fill="#2a6a9a" fontFamily="monospace">CURVA: ANTRONA</text>
    <line x1="22" y1="60" x2="154" y2="60" stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />
    {resultado ? (
      <>
        <text x="88" y="79" textAnchor="middle" fontSize="23" fill="#00ff88" fontFamily="monospace" fontWeight="700">{resultado}</text>
        <text x="88" y="94" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">mg/L ART</text>
        <text x="88" y="105" textAnchor="middle" fontSize="6" fill="#16a34a" fontFamily="sans-serif">✓ Leitura concluída</text>
      </>
    ) : lendo ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="11" fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="3s" fill="freeze" />
        </rect>
      </>
    ) : zerando ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="monospace">ZERO</text>
        <text x="88" y="88" textAnchor="middle" fontSize="8" fill="#fbbf24" fontFamily="monospace">Zerando...</text>
        <rect x="28" y="95" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="95" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="2s" fill="freeze" />
        </rect>
      </>
    ) : zerado ? (
      <>
        <text x="88" y="74" textAnchor="middle" fontSize="10" fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
        <text x="88" y="85" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="monospace">0,000</text>
        <text x="88" y="98" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="sans-serif">Curva Antrona carregada</text>
        <text x="88" y="108" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Insira amostra → READ</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="88" y="74" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="88" y="89" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Curva: Antrona</text>
      </>
    ) : (
      <>
        <text x="88" y="73" textAnchor="middle" fontSize="10" fill="#4a7a9a" fontFamily="monospace">STANDBY</text>
        <text x="88" y="87" textAnchor="middle" fontSize="7.5" fill="#3a5a6a" fontFamily="sans-serif">Curva: Antrona</text>
        <text x="88" y="100" textAnchor="middle" fontSize="6" fill="#2a4060" fontFamily="sans-serif">Aguardando branco...</text>
      </>
    )}
    <rect x="172" y="38" width="56" height="72" rx="5" fill="#0a1525"
      stroke={cubetaDentro ? '#22c55e' : '#2a3a52'} strokeWidth="1.5" />
    <text x="200" y="53" textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="monospace">SAMPLE</text>
    {cubetaDentro
      ? <g>
          <rect x="182" y="60" width="36" height="46" rx="2"
            fill={corCubeta} stroke="rgba(200,200,200,0.4)" strokeWidth="1" />
          <rect x="184" y="62" width="5" height="38" fill="rgba(255,255,255,0.14)" />
        </g>
      : <rect x="182" y="60" width="36" height="46" rx="2"
          fill="rgba(5,12,25,0.6)" stroke="#1a2535" strokeWidth="0.8" strokeDasharray="4,2" />
    }
    <circle cx="168" cy="84" r="4"
      fill={cubetaDentro ? 'rgba(14,165,233,0.8)' : 'rgba(14,165,233,0.22)'}
      stroke="rgba(14,165,233,0.35)" strokeWidth="1" />
    {['ON','ZERO','READ','MENU'].map((lbl, i) => {
      const isZ = lbl === 'ZERO', isR = lbl === 'READ';
      const active = (isZ && zerAtivo) || (isR && lerAtivo);
      return (
        <g key={lbl} onClick={isZ ? onZero : isR ? onLer : undefined}
          style={{ cursor: active ? 'pointer' : 'default' }}>
          <rect x={18+i*36} y="126" width="32" height="14" rx="4"
            fill={active ? '#0f2a48' : '#0f1e30'}
            stroke={active ? '#22d3ee' : '#1e3a5f'} strokeWidth={active ? 1.8 : 1} />
          <text x={34+i*36} y="135.5" textAnchor="middle" fontSize="5.5"
            fill={active ? '#22d3ee' : '#60a5fa'} fontFamily="monospace"
            fontWeight={active ? '700' : '400'}>{lbl}</text>
        </g>
      );
    })}
    <text x="120" y="167" textAnchor="middle" fontSize="5.5" fill="#2a4060" fontFamily="sans-serif">
      ART em Águas · Método Colorimétrico Antrona · mg/L
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorArtAguas = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'aa-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ESTILOS_ANIMACAO;
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
  const [nivelAmostra,   setNivelAmostra]   = useState(82);
  const [nivelAguaDesmin,setNivelAguaDesmin]= useState(80);
  const [nivelAntrona,   setNivelAntrona]   = useState(84);

  // ── Béquer A (preparo) ────────────────────────────────
  const [nivelBequerA,   setNivelBequerA]   = useState(0);
  const [corBequerA,     setCorBequerA]     = useState('rgba(220,235,255,0.08)');
  const [amostraNoBequerA,setAmostraNoBequerA]=useState(false);
  const [celiteAdicionada,setCeliteAdicionada]=useState(false);
  const [bqAVibrarKey,   setBqAVibrarKey]   = useState(0);
  const [bqAVibrar,      setBqAVibrar]      = useState(false);

  // ── Béquer B (coletor/funil) ──────────────────────────
  const [nivelBequerB,   setNivelBequerB]   = useState(0);
  const [corBequerB,     setCorBequerB]     = useState('rgba(220,235,255,0.08)');
  const [funilNoBqB,     setFunilNoBqB]     = useState(false);
  const [papelFiltroNoBqB,setPapelFiltroNoBqB]=useState(false);
  const [filtracaoAtiva, setFiltracaoAtiva] = useState(false);
  const [filtradoPronto, setFiltradoPronto] = useState(false);

  // ── Pó Celite ─────────────────────────────────────────
  const [mostrarPo, setMostrarPo] = useState(false);
  const [poKey,     setPoKey]     = useState(0);

  // ── Proveta ───────────────────────────────────────────
  const [nivelProveta,     setNivelProveta]     = useState(0);
  const [provetaCheia,     setProvetaCheia]     = useState(false);
  const [provetaComFiltrado,setProvetaComFiltrado]=useState(false);

  // ── Tubo Amostra ──────────────────────────────────────
  const [nivelTuboAmostra, setNivelTuboAmostra] = useState(0);
  const [corTuboAmostra,   setCorTuboAmostra]   = useState('rgba(220,235,255,0.08)');
  const [filtradoNoTuboA,  setFiltradoNoTuboA]  = useState(false);
  const [antronaNaAmostra, setAntronaNaAmostra] = useState(false);

  // ── Tubo Branco ───────────────────────────────────────
  const [nivelTuboBranco,  setNivelTuboBranco]  = useState(0);
  const [corTuboBranco,    setCorTuboBranco]     = useState('rgba(220,235,255,0.08)');
  const [brancoNoTubo,     setBrancoNoTubo]      = useState(false);
  const [antronaNoBranco,  setAntronaNoBranco]   = useState(false);

  // ── Animações tubos ───────────────────────────────────
  const [hitKeyTuboA,setHitKeyTuboA] = useState(0);
  const [hitKeyTuboB,setHitKeyTuboB] = useState(0);
  const [tuboAVibrar,setTuboAVibrar] = useState(false);
  const [tuboBVibrar,setTuboBVibrar] = useState(false);

  // ── Banho-maria ───────────────────────────────────────
  const [tuboBrancoNoBanho, setTuboBrancoNoBanho] = useState(false);
  const [tuboAmostraNoBanho,setTuboAmostraNoBanho]= useState(false);
  const [timerAtivo,        setTimerAtivo]         = useState(false);
  const [progressoTimer,    setProgressoTimer]     = useState(0);
  const [aquecimentoConcluido,setAquecimentoConcluido]=useState(false);

  // ── Cubeta + Espectrofotômetro ────────────────────────
  const [nivelCubeta,       setNivelCubeta]       = useState(0);
  const [corCubeta,         setCorCubeta]         = useState('rgba(220,235,255,0.08)');
  const [cubetaNoEspectro,  setCubetaNoEspectro]  = useState(false);
  const [ehBrancoNoEspectro,setEhBrancoNoEspectro]= useState(false);
  const [zerando,           setZerando]           = useState(false);
  const [zerado,            setZerado]            = useState(false);
  const [lendo,             setLendo]             = useState(false);
  const [resultado,         setResultado]         = useState(null);

  // Cores pós-aquecimento
  const COR_AMOSTRA_AQUECIDA = 'rgba(28,128,88,0.88)'; // teal (reação Antrona + ART)
  const COR_BRANCO_AQUECIDO  = 'rgba(200,222,240,0.66)';

  // ── Ocultar pó após 1.1s ──────────────────────────────
  useEffect(() => {
    if (!mostrarPo) return;
    const id = setTimeout(() => setMostrarPo(false), 1100);
    return () => clearTimeout(id);
  }, [mostrarPo]);

  // ── Filtração: timer 2.5s após drag bequer_a → bequer_b ─
  useEffect(() => {
    if (!filtracaoAtiva) return;
    const id = setTimeout(() => {
      setFiltracaoAtiva(false);
      setFiltradoPronto(true);
      setNivelBequerA(0);
      setNivelBequerB(55);
      setCorBequerB('rgba(168,210,235,0.68)');
      setFunilNoBqB(false);
      setPapelFiltroNoBqB(false);
      celebrarAcerto();
      proximaEtapa(); // → step 6
    }, 2500);
    return () => clearTimeout(id);
  }, [filtracaoAtiva]);

  // ── Timer banho-maria 12 min (step 16) ────────────────
  useEffect(() => {
    if (!timerAtivo) return;
    setProgressoTimer(0);
    let p = 0;
    const tick = setInterval(() => { p = Math.min(p + 1.25, 100); setProgressoTimer(p); }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimerAtivo(false);
      setAquecimentoConcluido(true);
      setProgressoTimer(100);
      setCorTuboAmostra(COR_AMOSTRA_AQUECIDA);
      setCorTuboBranco(COR_BRANCO_AQUECIDO);
      setTuboBrancoNoBanho(false);
      setTuboAmostraNoBanho(false);
      celebrarAcerto(100);
      proximaEtapa(); // → step 17
    }, 8000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timerAtivo]);

  // ── Auto-conclusão step 23 ────────────────────────────
  useEffect(() => {
    if (etapaAtual !== 23) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const getCorTuboAmostraAtual = () => corTuboAmostra;
  const getCorTuboBrancoAtual  = () => corTuboBranco;

  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragArtAguas(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra, setNivelAguaDesmin, setNivelAntrona,
    setNivelBequerA, setCorBequerA, setAmostraNoBequerA,
    setCeliteAdicionada: (v) => { setCeliteAdicionada(v); if (v) { setPoKey(k=>k+1); setMostrarPo(true); } },
    setFunilNoBqB, setPapelFiltroNoBqB, setFiltracaoAtiva,
    setNivelProveta, setProvetaCheia, setProvetaComFiltrado,
    setNivelTuboAmostra, setCorTuboAmostra, setFiltradoNoTuboA, setAntronaNaAmostra,
    setNivelTuboBranco, setCorTuboBranco, setBrancoNoTubo, setAntronaNoBranco,
    setTuboBrancoNoBanho, setTuboAmostraNoBanho,
    setNivelCubeta, setCorCubeta,
    setCubetaNoEspectro, setEhBrancoNoEspectro,
    getCorTuboAmostraAtual, getCorTuboBrancoAtual,
  });

  // ── Click: homogenizar béquer A (step 2) ──────────────
  const handleHomogenizarBqA = () => {
    if (etapaAtual !== 2 || !celiteAdicionada) return;
    setBqAVibrarKey(k => k + 1);
    setBqAVibrar(true);
    setCorBequerA('rgba(175,190,200,0.85)');
    setTimeout(() => { setBqAVibrar(false); celebrarAcerto(); proximaEtapa(); }, 650);
  };

  // ── Click: agitar tubos (step 12) ─────────────────────
  const handleAgitarTubos = () => {
    if (etapaAtual !== 12 || !antronaNaAmostra || !antronaNoBranco) return;
    setHitKeyTuboA(k=>k+1); setTuboAVibrar(true);
    setHitKeyTuboB(k=>k+1); setTuboBVibrar(true);
    setTimeout(() => { setTuboAVibrar(false); setTuboBVibrar(false); celebrarAcerto(); proximaEtapa(); }, 650);
  };

  // ── Click: iniciar banho-maria (step 15) ──────────────
  const handleIniciarBanho = () => {
    if (etapaAtual !== 15 || !tuboBrancoNoBanho || !tuboAmostraNoBanho) return;
    celebrarAcerto();
    proximaEtapa(); // → step 16
    setTimerAtivo(true);
  };

  // ── Click: ZERO espectrofotômetro (step 19) ───────────
  const handleZerarEspectro = () => {
    if (etapaAtual !== 19 || !cubetaNoEspectro || !ehBrancoNoEspectro || zerando) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false); setZerado(true);
      setCubetaNoEspectro(false); setNivelCubeta(0);
      celebrarAcerto(150); proximaEtapa(); // → step 20
    }, 2000);
  };

  // ── Click: READ espectrofotômetro (step 22) ───────────
  const handleLerEspectro = () => {
    if (etapaAtual !== 22 || !cubetaNoEspectro || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * 280 + 20).toFixed(1));
      setResultado(raw.toFixed(1));
      setLendo(false);
      celebrarAcerto(200); proximaEtapa(); // → step 23
    }, 3000);
  };

  // Fases para renderização condicional
  // Sem fases — todos os itens visíveis durante toda a análise

  // Cor da cubeta no espectro
  const corCubetaNoEspectro = ehBrancoNoEspectro ? corTuboBranco : corTuboAmostra;

  // Botões de ação
  const mostrarBotaoHom    = etapaAtual === 2;
  const mostrarBotaoAgitar = etapaAtual === 12;
  const mostrarBotaoBanho  = etapaAtual === 15;


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
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

      {timerAtivo && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, animation: 'aaTimerPulse 1s ease-in-out infinite' }}>🔥 Banho-maria em Ebulição — 12 minutos</div>
            <div style={{ marginTop: 8, height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', minWidth: 220 }}>
              <div style={{ height: '100%', width: `${progressoTimer}%`, background: 'rgba(251,191,36,0.85)', borderRadius: 5, transition: 'width 0.1s linear' }} />
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.75)' }}>{Math.floor(progressoTimer)}% · Reação Antrona + ART...</div>
          </div>
        </div>
      )}

      {resultado && etapaAtual >= 23 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#14532d,#166534,#16a34a)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🟢 Leitura Concluída!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>ART = <strong>{resultado} mg/L</strong></div>
          </div>
        </div>
      )}

      {/* ── MODAL FINAL ── */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #16a34a', borderRadius: 24, padding: '48px 56px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🟢</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#4ade80', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>Determinação de ART em Águas Residuais — Método Colorimétrico Antrona</p>
            <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.28)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Método', val: 'Colorimétrico Antrona', cor: '#4ade80' },
                  { label: 'Curva', val: 'Antrona', cor: '#86efac' },
                  { label: 'Branco', val: '0,000', cor: '#34d399' },
                  { label: 'Banho-maria', val: '12 min', cor: '#fbbf24' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.38)', borderRadius: 14, padding: '18px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Resultado — ART</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#16a34a', fontFamily: 'monospace', lineHeight: 1 }}>{resultado}</div>
              <div style={{ fontSize: 14, color: '#4ade80', fontWeight: 700, marginTop: 4 }}>mg/L ART</div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#34d399' }}>
              ✓ Leitura realizada com sucesso · Método Colorimétrico Antrona
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="ART em Águas — Antrona" subtitulo={"Método Colorimétrico Antrona\nBanho-maria 12 min · mg/L ART"}
        icone="🟢" badges={['💧 ÁGUAS', '🔬 COLORIMETRIA']} footerLabel="🟢 ART Antrona">

        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 780 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🟢 Bancada — ART em Águas Residuais (Método Antrona)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: EQUIPAMENTOS (sempre visíveis) ════════ */}
            <div style={{ paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* Linha 1: Béquer A · Béquer B · Proveta · Tubo Amostra · Tubo Branco */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginBottom: 12 }}>

                {/* Béquer A */}
                <ZonaDrop id="bequer_a" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div className={`${dropCls('bequer_a')} ${itemCls('bequer_a')}`}
                    style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
                    <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                      {mostrarPo && <>
                        <PoCeliteCaindo key={`c1-${poKey}`} offsetX={-12} animName="aaPoFall"  delay={0}   animKey={`c1-${poKey}`} />
                        <PoCeliteCaindo key={`c2-${poKey}`} offsetX={-3}  animName="aaPoFall2" delay={80}  animKey={`c2-${poKey}`} />
                        <PoCeliteCaindo key={`c3-${poKey}`} offsetX={6}   animName="aaPoFall"  delay={160} animKey={`c3-${poKey}`} />
                        <PoCeliteCaindo key={`c4-${poKey}`} offsetX={14}  animName="aaPoFall2" delay={240} animKey={`c4-${poKey}`} />
                      </>}
                    </div>
                    <div key={bqAVibrarKey} className={bqAVibrar ? 'aa-vibrar' : ''}
                      draggable={isItem('bequer_a') && amostraNoBequerA}
                      onDragStart={e => handleDragStart('bequer_a', e)} onDragEnd={handleDragEnd}
                      style={{ cursor: isItem('bequer_a') && amostraNoBequerA ? 'grab' : 'default' }}>
                      <BequerSVG nivel={nivelBequerA} cor={corBequerA} id="bqa" ml={150} />
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                      {isItem('bequer_a') && amostraNoBequerA ? '🖱️ ' : ''}Béquer A
                    </span>
                    <span style={{ fontSize: 7.5, color: '#94a3b8', textAlign: 'center' }}>
                      {celiteAdicionada ? '+ Celite' : amostraNoBequerA ? '~200 mL' : 'Vazio'}
                    </span>
                  </div>
                </ZonaDrop>

                {/* Béquer B */}
                <ZonaDrop id="bequer_b" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div className={`${dropCls('bequer_b')} ${itemCls('bequer_b')}`}
                    style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                    draggable={isItem('bequer_b') && filtradoPronto}
                    onDragStart={e => handleDragStart('bequer_b', e)} onDragEnd={handleDragEnd}>
                    {/* wrapper relativo para overlay do papel filtro */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <BequerSVG nivel={nivelBequerB} cor={corBequerB} id="bqb" ml={150}
                        funilAcoplado={funilNoBqB} filtrando={filtracaoAtiva} />
                      {/* Papel filtro dentro do funil — coordenadas espelham BequerSVG ml=150 */}
                      {papelFiltroNoBqB && funilNoBqB && !filtracaoAtiva && (
                        <svg width="78" height="80" viewBox="0 0 78 80"
                          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                          {/* Cone do papel filtro (levemente menor que o funil) */}
                          <path d="M 28,22 L 50,22 L 41,58 L 37,58 Z"
                            fill="rgba(252,248,238,0.88)" stroke="rgba(195,180,155,0.65)" strokeWidth="0.9" />
                          {/* Dobra central (linha de vinco) */}
                          <line x1="39" y1="22" x2="39" y2="58"
                            stroke="rgba(175,160,130,0.50)" strokeWidth="0.8" strokeDasharray="2,2" />
                          {/* Borda superior (elipse do papel) */}
                          <ellipse cx="39" cy="22" rx="11" ry="3"
                            fill="rgba(252,248,238,0.82)" stroke="rgba(195,180,155,0.55)" strokeWidth="0.9" />
                          {/* Textura de fibra — linhas suaves */}
                          <line x1="31" y1="26" x2="34" y2="54" stroke="rgba(190,175,150,0.22)" strokeWidth="0.6" />
                          <line x1="47" y1="26" x2="44" y2="54" stroke="rgba(190,175,150,0.22)" strokeWidth="0.6" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                      {isItem('bequer_b') && filtradoPronto ? '🖱️ ' : ''}Béquer B
                    </span>
                    <span style={{ fontSize: 7.5, color: filtradoPronto ? '#34d399' : filtracaoAtiva ? '#fbbf24' : '#94a3b8', textAlign: 'center' }}>
                      {filtradoPronto ? '✓ Filtrado'
                        : filtracaoAtiva ? '⏳ Filtrando'
                        : papelFiltroNoBqB ? '📄 Pronto'
                        : funilNoBqB ? 'Funil ✓'
                        : 'Vazio'}
                    </span>
                  </div>
                </ZonaDrop>

                {/* Proveta */}
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: '6px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta</span>
                    <span style={{ fontSize: 7.5, color: provetaCheia ? (provetaComFiltrado ? '#34d399' : '#60a5fa') : '#94a3b8' }}>
                      {provetaCheia ? (provetaComFiltrado ? '2 mL filtrado' : '2 mL água') : 'Vazia'}
                    </span>
                  </div>
                </ZonaDrop>

                {/* Tubo Amostra */}
                <ZonaDrop id="tubo_amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div className={`${dropCls('tubo_amostra')} ${itemCls('tubo_amostra')}`}
                    style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: tuboAmostraNoBanho ? 0.18 : 1, transition: 'opacity 0.3s' }}
                    draggable={isItem('tubo_amostra') && !tuboAmostraNoBanho}
                    onDragStart={e => handleDragStart('tubo_amostra', e)} onDragEnd={handleDragEnd}>
                    <div key={hitKeyTuboA} className={tuboAVibrar ? 'aa-vibrar' : ''}>
                      <TuboConicoSVG nivel={nivelTuboAmostra} cor={corTuboAmostra} id="aaa" />
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                      {isItem('tubo_amostra') && !tuboAmostraNoBanho ? '🖱️ ' : ''}T. Amostra
                    </span>
                    <span style={{ fontSize: 7.5, color: antronaNaAmostra ? '#86efac' : filtradoNoTuboA ? '#60a5fa' : '#94a3b8' }}>
                      {aquecimentoConcluido ? '🟢 Reagido'
                        : antronaNaAmostra ? '+ Antrona'
                        : filtradoNoTuboA ? '2 mL filtrado'
                        : 'Vazio'}
                    </span>
                  </div>
                </ZonaDrop>

                {/* Tubo Branco */}
                <ZonaDrop id="tubo_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div className={`${dropCls('tubo_branco')} ${itemCls('tubo_branco')}`}
                    style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: tuboBrancoNoBanho ? 0.18 : 1, transition: 'opacity 0.3s' }}
                    draggable={isItem('tubo_branco') && !tuboBrancoNoBanho}
                    onDragStart={e => handleDragStart('tubo_branco', e)} onDragEnd={handleDragEnd}>
                    <div key={hitKeyTuboB} className={tuboBVibrar ? 'aa-vibrar' : ''}>
                      <TuboConicoSVG nivel={nivelTuboBranco} cor={corTuboBranco} id="aab" />
                    </div>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                      {isItem('tubo_branco') && !tuboBrancoNoBanho ? '🖱️ ' : ''}T. Branco
                    </span>
                    <span style={{ fontSize: 7.5, color: antronaNoBranco ? '#86efac' : brancoNoTubo ? '#60a5fa' : '#94a3b8' }}>
                      {aquecimentoConcluido ? '❄ Branco'
                        : antronaNoBranco ? '+ Antrona'
                        : brancoNoTubo ? '2 mL água'
                        : 'Vazio'}
                    </span>
                  </div>
                </ZonaDrop>

              </div>{/* fim linha 1 */}

              {/* Linha 2: Banho-maria · Cubeta · Espectrofotômetro */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>

                {/* Banho-maria */}
                <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id="banho_maria" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div className={dropCls('banho_maria')}
                      style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 14, padding: '10px 12px', cursor: etapaAtual === 15 && tuboBrancoNoBanho && tuboAmostraNoBanho ? 'pointer' : 'default' }}
                      onClick={handleIniciarBanho}>
                      <BanhoMariaSVG ativa={timerAtivo} progresso={progressoTimer}
                        tuboBrancoDentro={tuboBrancoNoBanho} tuboAmostraDentro={tuboAmostraNoBanho}
                        corTuboA={corTuboAmostra} corTuboB={corTuboBranco} />
                      {etapaAtual === 15 && tuboBrancoNoBanho && tuboAmostraNoBanho && !timerAtivo && (
                        <div style={{ textAlign: 'center', fontSize: 8.5, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>
                          🔥 Clique para iniciar!
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#a8a29e' }}>
                      {timerAtivo ? `🔥 ${Math.floor(progressoTimer)}%` : aquecimentoConcluido ? '❄ Resfriado' : 'Banho-maria'}
                    </span>
                  </ZonaDrop>
                </div>

                {/* Cubeta */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div className={`${dropCls('cubeta')} ${itemCls('cubeta')}`}
                      style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                      draggable={isItem('cubeta') && !cubetaNoEspectro}
                      onDragStart={e => handleDragStart('cubeta', e)} onDragEnd={handleDragEnd}>
                      {cubetaNoEspectro
                        ? <div style={{ width: 80, height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <span style={{ fontSize: 18 }}>✅</span><span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>No espectro</span>
                          </div>
                        : <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="aac" />
                      }
                      <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                        {isItem('cubeta') && !cubetaNoEspectro ? '🖱️ ' : ''}Cubeta 25 mm
                      </span>
                      <span style={{ fontSize: 7.5, color: nivelCubeta > 0 && !cubetaNoEspectro ? (corCubeta.includes('28,128') ? '#4ade80' : '#60a5fa') : '#94a3b8' }}>
                        {nivelCubeta > 0 && !cubetaNoEspectro ? (corCubeta.includes('28,128') ? '🟢 Amostra' : '⚪ Branco') : 'Vazia'}
                      </span>
                    </div>
                  </ZonaDrop>
                </div>

                {/* Espectrofotômetro */}
                <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id="espectrofotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div className={dropCls('espectrofotometro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                      <EspectrofotometroAntronaSVG
                        cubetaDentro={cubetaNoEspectro} corCubeta={corCubetaNoEspectro}
                        zerando={zerando} zerado={zerado && !cubetaNoEspectro}
                        lendo={lendo} resultado={resultado}
                        zerAtivo={etapaAtual === 19 && cubetaNoEspectro && !zerando}
                        lerAtivo={etapaAtual === 22 && cubetaNoEspectro && !lendo && !resultado}
                        onZero={handleZerarEspectro} onLer={handleLerEspectro}
                      />
                      {etapaAtual === 19 && cubetaNoEspectro && !zerando && (
                        <div style={{ textAlign: 'center', fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>🔵 Clique ZERO!</div>
                      )}
                      {etapaAtual === 22 && cubetaNoEspectro && !lendo && !resultado && (
                        <div style={{ textAlign: 'center', fontSize: 8, color: '#4ade80', fontWeight: 700, marginTop: 4 }}>🟢 Clique READ!</div>
                      )}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>Espectrofotômetro</span>
                  </ZonaDrop>
                </div>

              </div>{/* fim linha 2 */}

            </div>{/* fim zona superior */}

            {/* ══ PAINEL DE AÇÃO ═══════════════════════════════════════ */}
            {(mostrarBotaoHom || mostrarBotaoAgitar || mostrarBotaoBanho) && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '12px 18px', border: '1px solid rgba(34,211,238,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>
                    {mostrarBotaoHom    ? '🔄 Homogeneizar Amostra + Celite'
                      : mostrarBotaoAgitar ? '🔄 Agitar e Homogeneizar os Dois Tubos'
                      : '🔥 Iniciar Banho-maria em Ebulição'}
                  </div>
                  <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>
                    {mostrarBotaoHom    ? 'Agitar para dispersar a Celite na amostra residual.'
                      : mostrarBotaoAgitar ? 'Misturar os tubos antes do banho-maria.'
                      : 'Aquecer em ebulição por 12 minutos. O timer iniciará automaticamente.'}
                  </div>
                </div>
                <button
                  onClick={mostrarBotaoHom ? handleHomogenizarBqA : mostrarBotaoAgitar ? handleAgitarTubos : handleIniciarBanho}
                  style={{ background: 'linear-gradient(90deg,#0891b2,#0369a1)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.35)', whiteSpace: 'nowrap' }}>
                  {mostrarBotaoHom    ? '🔄 Homogeneizar'
                    : mostrarBotaoAgitar ? '🔄 Agitar Tubos'
                    : '🔥 Iniciar Banho-maria'}
                </button>
              </div>
            )}

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            {/* ══ ZONA INFERIOR: REAGENTES (sempre visíveis) ══════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,190,220,0.78)" label="Amostra" sub="Resid." nivel={nivelAmostra} />
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* CELITE */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('celite')}`} draggable={isItem('celite')}
                  onDragStart={e => handleDragStart('celite', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(228,222,216,0.88)" label="Celite" sub="~2 g pó" nivel={celiteAdicionada ? 55 : 78} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('celite') ? '🖱️ ' : ''}Celite</span>
                {celiteAdicionada && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* FUNIL */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('funil')}`} draggable={isItem('funil')}
                  onDragStart={e => handleDragStart('funil', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FunilItemSVG usado={funilNoBqB} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('funil') ? '🖱️ ' : ''}Funil</span>
                {funilNoBqB && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* PAPEL FILTRO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('papel_filtro')}`} draggable={isItem('papel_filtro')}
                  onDragStart={e => handleDragStart('papel_filtro', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <PapelFiltroItemSVG usado={papelFiltroNoBqB} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('papel_filtro') ? '🖱️ ' : ''}Papel Filtro</span>
                {papelFiltroNoBqB && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* ÁGUA DESMINERALIZADA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('agua_desmin')}`} draggable={isItem('agua_desmin')}
                  onDragStart={e => handleDragStart('agua_desmin', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(200,232,255,0.82)" label="H₂O Desmin." sub="branco 2 mL" nivel={nivelAguaDesmin} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('agua_desmin') ? '🖱️ ' : ''}Água Desmin.</span>
                {brancoNoTubo && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* ANTRONA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('antrona')}`} draggable={isItem('antrona')}
                  onDragStart={e => handleDragStart('antrona', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(245,235,75,0.84)" label="Antrona" sub="10 mL/tubo" nivel={nivelAntrona} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('antrona') ? '🖱️ ' : ''}Sol. Antrona</span>
                {antronaNaAmostra && antronaNoBranco
                  ? <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓ A+B</span>
                  : antronaNaAmostra && <span style={{ fontSize: 7.5, color: '#fbbf24', fontWeight: 700 }}>✓ A</span>
                }
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

export default SimuladorArtAguas;
