/**
 * impurezabagaco.jsx — Determinação de Impureza Mineral no Bagaço Residual
 *
 * Método Mufla · Incineração completa do material orgânico
 * Fórmulas:
 *   % Terra       = ((PF − PI) / PA) × 100
 *   Kg Terra / t  = ((PF − PI) / PA) × 1000
 *
 * Fluxo: Tarar → Cadinho (PI) → Tarar c/ cadinho → Bagaço 30 g (PA)
 *        → Mufla → Incinerar → Pré-resfriamento → Dessecador
 *        → Balança (PF) → Calcular
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { etapas } from './data/etapasImpurezaBagaco';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const IM_CSS = `
  @keyframes imGlow {
    0%,100% { opacity: 0.55; }
    50%      { opacity: 1; }
  }
  @keyframes imPulse {
    0%,100% { opacity: 0.7; }
    50%      { opacity: 1; }
  }
  @keyframes imFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* Valores simulados (CONSECANA) */
const PI_SIM = 42.135;   // cadinho de porcelana limpo e seco
const PA_SIM = 30.000;   // amostra de bagaço  ~30 g ± 0,1 g
const PF_SIM = 42.290;   // cadinho + resíduo mineral  (0,155 g de cinzas)


/* ═══════════════════════════════════════════════════════════
   SVG — BALANÇA ANALÍTICA (exibe 3 casas decimais)
═══════════════════════════════════════════════════════════ */
const BalancaIMSVG = ({ pesoBal, cadinhoNaBalanca, balancaTarada, amostraPesada, fase }) => (
  <svg width="148" height="134" viewBox="0 -24 148 134">
    <defs>
      <linearGradient id="imBalBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#5a5e6a" />
        <stop offset="100%" stopColor="#3a3d46" />
      </linearGradient>
    </defs>
    <ellipse cx={74} cy={100} rx={60} ry={5} fill="rgba(0,0,0,0.18)" />
    <ellipse cx={74} cy={28} rx={52} ry={8} fill="rgba(200,200,210,0.85)" stroke="#9ca3af" strokeWidth="1.5" />
    <ellipse cx={74} cy={27} rx={50} ry={6} fill="rgba(220,220,230,0.92)" stroke="#9ca3af" strokeWidth="0.8" />
    <rect x={65} y={30} width={18} height={14} rx="2" fill="url(#imBalBody)" stroke="#374151" strokeWidth="1.2" />
    <rect x={10} y={42} width={128} height={44} rx="6" fill="url(#imBalBody)" stroke="#374151" strokeWidth="1.5" />
    <rect x={16} y={47} width={80} height={32} rx="4" fill="#0a1018" stroke="#22d3ee" strokeWidth="1.0" />
    <text x={56} y={60} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="monospace">
      {fase === 'tarar1'  ? 'TARANDO...'   :
       fase === 'cadinho' ? 'PESANDO...'   :
       fase === 'tarar2'  ? 'TARANDO...'   :
       fase === 'bagaco'  ? 'PESANDO...'   :
       fase === 'pf'      ? 'PESANDO...'   :
       balancaTarada      ? 'TARA ✓'       :
       cadinhoNaBalanca   ? 'CADINHO ✓'    : 'STANDBY'}
    </text>
    <text x={56} y={75} textAnchor="middle" fontSize="12"
      fill={fase ? '#00ff88' : balancaTarada ? '#22d3ee' : cadinhoNaBalanca ? '#22d3ee' : '#3a5a6a'}
      fontFamily="monospace" fontWeight="700">
      {cadinhoNaBalanca || fase ? `${pesoBal.toFixed(3)} g` : '—'}
    </text>
    <circle cx={112} cy={63} r={5}
      fill={fase ? '#f59e0b' : balancaTarada ? '#22c55e' : cadinhoNaBalanca ? '#22c55e' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    <text x={74} y={98} textAnchor="middle" fontSize="6" fill="#4a3e28" fontFamily="monospace">
      Balança Analítica · 0,001 g
    </text>
    {/* Cadinho sobre a plataforma */}
    {cadinhoNaBalanca && (
      <g>
        {/* Corpo do cadinho (porcelana) */}
        <ellipse cx={74} cy={-2} rx={14} ry={4}
          fill="rgba(248,248,252,0.85)" stroke="#9ca3af" strokeWidth="0.9" />
        <path d="M 60,1 L 88,1 L 85,20 L 63,20 Z"
          fill={amostraPesada ? 'rgba(100,75,45,0.70)' : 'rgba(248,248,252,0.82)'}
          stroke="#9ca3af" strokeWidth="0.9" />
        <ellipse cx={74} cy={20} rx={11} ry={3}
          fill={amostraPesada ? 'rgba(100,75,45,0.50)' : 'rgba(240,240,248,0.60)'}
          stroke="#9ca3af" strokeWidth="0.8" />
        {/* Conteúdo da amostra */}
        {amostraPesada && (
          <>
            <line x1={63} y1={8}  x2={81} y2={6}  stroke="#c09040" strokeWidth="1.0" strokeLinecap="round" />
            <line x1={65} y1={13} x2={83} y2={11} stroke="#b08030" strokeWidth="0.9" strokeLinecap="round" />
          </>
        )}
      </g>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — MUFLA (forno de alta temperatura para incineração)
═══════════════════════════════════════════════════════════ */
const MuflaSVG = ({ ligada, incinerando, tempoIncineracao, pronto, preResfriando, cadinhoNaMufla }) => (
  <svg width="180" height="175" viewBox="0 0 180 175">
    <defs>
      <linearGradient id="imMuflaBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#4a5568" />
        <stop offset="100%" stopColor="#2d3748" />
      </linearGradient>
      <radialGradient id="imGlowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="rgba(255,200,60,0.90)" />
        <stop offset="60%"  stopColor="rgba(255,100,0,0.55)" />
        <stop offset="100%" stopColor="rgba(255,60,0,0.10)" />
      </radialGradient>
    </defs>

    <ellipse cx={90} cy={171} rx={80} ry={4} fill="rgba(0,0,0,0.22)" />

    {/* Corpo */}
    <rect x={6} y={8} width={174} height={158} rx="10" fill="#1a1f2a" />
    <rect x={2} y={4} width={174} height={158} rx="10"
      fill="url(#imMuflaBody)" stroke="#2d3a50" strokeWidth="1.5" />
    <rect x={4} y={4} width={170} height={6} rx="4" fill="rgba(255,255,255,0.10)" />

    {/* Painel superior */}
    <rect x={8} y={8} width={162} height={44} rx="6" fill="#080f18" stroke="#22d3ee" strokeWidth="0.9" />

    {/* Display status / temperatura */}
    <rect x={12} y={12} width={76} height={36} rx="4" fill="#060c14" stroke="#22d3ee" strokeWidth="0.7" />
    <text x={50} y={24} textAnchor="middle" fontSize="5.5" fill="#3a5a6a" fontFamily="monospace">STATUS</text>
    <text x={50} y={40} textAnchor="middle" fontSize="9"
      fill={pronto ? '#22c55e' : incinerando ? '#f59e0b' : preResfriando ? '#60a5fa' : ligada ? '#22d3ee' : '#1a4044'}
      fontFamily="monospace" fontWeight="900">
      {pronto        ? 'PRONTO' :
       preResfriando ? 'RESFR.' :
       incinerando   ? 'INCIN.' :
       ligada        ? 'LIGADA' : 'OFF'}
    </text>

    {/* Timer / Contagem */}
    <rect x={96} y={12} width={76} height={36} rx="4" fill="#060c14" stroke="#22d3ee" strokeWidth="0.7" />
    <text x={134} y={24} textAnchor="middle" fontSize="5.5" fill="#3a5a6a" fontFamily="monospace">INCINERAÇÃO</text>
    <text x={134} y={40} textAnchor="middle" fontSize="16"
      fill={pronto ? '#22c55e' : incinerando ? '#f59e0b' : '#1a4044'}
      fontFamily="monospace" fontWeight="900">
      {pronto ? '✓' : incinerando ? `${String(tempoIncineracao).padStart(2,'0')}s` : '--'}
    </text>

    {/* Câmara interna */}
    <rect x={12} y={58} width={154} height={92} rx="6"
      fill={incinerando ? 'rgba(255,80,0,0.12)' : preResfriando ? 'rgba(255,120,0,0.06)' : '#0d1520'}
      stroke="#2d3a50" strokeWidth="1" />

    {/* Janela da câmara */}
    <rect x={20} y={64} width={138} height={74} rx="5"
      fill={incinerando ? 'rgba(255,100,0,0.18)' : preResfriando ? 'rgba(255,140,0,0.08)' : 'rgba(5,10,20,0.92)'}
      stroke="#1e2a3a" strokeWidth="1.2" />

    {/* Glow da incineração */}
    {(incinerando || preResfriando) && (
      <ellipse cx={89} cy={101} rx={60} ry={30}
        fill="url(#imGlowGrad)"
        style={{ animation: incinerando ? 'imGlow 0.6s ease-in-out infinite' : 'imGlow 2s ease-in-out infinite' }}
        opacity={preResfriando ? 0.5 : 1} />
    )}

    {/* Cadinho dentro da mufla */}
    {cadinhoNaMufla && (
      <g opacity={incinerando ? 0.9 : 0.70}>
        <path d="M 64,116 L 114,116 L 110,132 L 68,132 Z"
          fill={pronto ? 'rgba(180,170,160,0.80)' : 'rgba(200,180,120,0.50)'}
          stroke={pronto ? '#a8a098' : '#a08840'} strokeWidth="0.9" />
        <ellipse cx={89} cy={116} rx={25} ry={6}
          fill={pronto ? 'rgba(200,190,180,0.70)' : 'rgba(220,200,140,0.60)'}
          stroke={pronto ? '#b0a8a0' : '#b09840'} strokeWidth="0.8" />
        {/* Resíduo mineral (quando pronto) */}
        {pronto && (
          <path d="M 66,118 L 112,118 L 109,130 L 69,130 Z"
            fill="rgba(165,155,145,0.70)" />
        )}
      </g>
    )}

    {/* Status text */}
    <text x={89} y={80} textAnchor="middle" fontSize="7"
      fill={pronto ? '#22c55e' : incinerando ? '#f59e0b' : preResfriando ? '#60a5fa' : ligada ? '#22d3ee' : '#2d3a50'}
      fontFamily="monospace" fontWeight="700">
      {pronto        ? '✓ INCINERAÇÃO COMPLETA' :
       preResfriando ? '🌡 PRÉ-RESFRIAMENTO...'  :
       incinerando   ? '🔥 INCINERANDO...'        :
       ligada        ? '⚡ AQUECENDO...'           : 'DESLIGADA'}
    </text>

    {/* Plaqueta */}
    <rect x={58} y={152} width={62} height={8} rx="2"
      fill="rgba(255,255,255,0.90)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
    <text x={89} y={158} textAnchor="middle" fontSize="5" fill="#0d2137"
      fontFamily="sans-serif" fontWeight="900">MUFLA · 550°C</text>

    {/* Pés */}
    {[18, 54, 124, 160].map(x => (
      <rect key={x} x={x - 8} y={162} width={16} height={7} rx="3.5"
        fill="#0d1117" stroke="#090d12" strokeWidth="0.7" />
    ))}

    {!ligada && (
      <text x={89} y={6} textAnchor="middle" fontSize="6.5" fill="#22d3ee"
        fontFamily="monospace" fontWeight="700">↓ Clique para ligar</text>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — DESSECADOR (resfriamento até temperatura ambiente)
═══════════════════════════════════════════════════════════ */
const DessecadorSVG = ({ comCadinho, resfriando, pronto }) => (
  <svg width="130" height="150" viewBox="0 0 130 150">
    <defs>
      <linearGradient id="imDesGlass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="rgba(185,225,255,0.55)" />
        <stop offset="30%"  stopColor="rgba(215,238,255,0.15)" />
        <stop offset="70%"  stopColor="rgba(210,235,255,0.10)" />
        <stop offset="100%" stopColor="rgba(170,215,252,0.45)" />
      </linearGradient>
    </defs>

    <ellipse cx={65} cy={146} rx={52} ry={4} fill="rgba(0,0,0,0.18)" />

    {/* Base */}
    <rect x={8} y={112} width={114} height={28} rx="5"
      fill="rgba(50,60,80,0.80)" stroke="#2d3a50" strokeWidth="1.2" />
    {/* Placa perfurada */}
    <rect x={12} y={116} width={106} height={6} rx="2" fill="#1a2030" />
    {[18,28,38,48,58,68,78,88,98,108].map(x => (
      <circle key={x} cx={x} cy={119} r={2} fill="#0d1520" />
    ))}
    {/* Sílica-gel */}
    {[...Array(18)].map((_,i) => {
      const x = 14 + (i % 9) * 11 + (Math.floor(i/9) * 4);
      const y = 124 + Math.floor(i / 9) * 6;
      return <ellipse key={i} cx={x} cy={y} rx={3.5} ry={2.5}
        fill={pronto ? 'rgba(100,150,255,0.70)' : 'rgba(80,120,220,0.60)'} />;
    })}
    <text x={65} y={136} textAnchor="middle" fontSize="5" fill="#4a6080" fontFamily="monospace">
      Sílica-gel indicadora
    </text>

    {/* Corpo de vidro (dome) */}
    <path d="M 14,112 Q 14,20 65,14 Q 116,20 116,112 Z"
      fill="url(#imDesGlass)" stroke="#8ac4dc" strokeWidth="1.5" />

    {/* Reflexo vidro esquerdo */}
    <path d="M 20,108 Q 22,60 40,30"
      fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2.0" strokeLinecap="round" />

    {/* Tampa / colarinho */}
    <rect x={10} y={108} width={110} height={6} rx="3"
      fill="rgba(185,225,255,0.50)" stroke="#8ac4dc" strokeWidth="1.1" />

    {/* Cadinho dentro */}
    {comCadinho && (
      <g>
        {/* Cadinho */}
        <ellipse cx={65} cy={80} rx={16} ry={5}
          fill="rgba(220,220,230,0.75)" stroke="#9ca3af" strokeWidth="0.8" />
        <path d="M 49,82 L 81,82 L 78,100 L 52,100 Z"
          fill="rgba(190,185,180,0.80)" stroke="#9ca3af" strokeWidth="0.8" />
        <ellipse cx={65} cy={100} rx={13} ry={4}
          fill="rgba(180,175,170,0.65)" stroke="#9ca3af" strokeWidth="0.8" />
        {/* Resíduo cinza no interior */}
        <path d="M 51,84 L 79,84 L 77,98 L 53,98 Z"
          fill="rgba(160,155,150,0.65)" />

        {/* Vapor de resfriamento */}
        {resfriando && [58,65,72].map(x => (
          <path key={x} d={`M ${x},78 Q ${x-3},70 ${x},62 Q ${x+3},54 ${x},46`}
            fill="none" stroke="rgba(200,230,255,0.45)" strokeWidth="1.5" strokeLinecap="round"
            style={{ animation: 'imPulse 1.5s ease-in-out infinite' }} />
        ))}
      </g>
    )}

    {/* Status */}
    <text x={65} y={46} textAnchor="middle" fontSize="6.5"
      fill={pronto ? '#22c55e' : resfriando ? '#60a5fa' : comCadinho ? '#94a3b8' : '#2d3a50'}
      fontFamily="monospace" fontWeight="700">
      {pronto     ? '✓ T.A. atingida'  :
       resfriando ? '❄ Resfriando...'  :
       comCadinho ? 'cadinho inserido'  : 'vazio'}
    </text>

    <text x={65} y={8} textAnchor="middle" fontSize="6" fill="#4b5563" fontFamily="monospace">
      Dessecador
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — CADINHO DE PORCELANA (standalone)
═══════════════════════════════════════════════════════════ */
const CadinhoSVG = ({ status = 'limpo' }) => (
  <svg width="80" height="90" viewBox="0 0 80 90">
    {/* Sombra */}
    <ellipse cx={40} cy={87} rx={24} ry={3} fill="rgba(0,0,0,0.18)" />

    {/* Corpo do cadinho */}
    <ellipse cx={40} cy={20} rx={26} ry={7}
      fill="rgba(248,248,252,0.90)" stroke="#9ca3af" strokeWidth="1.3" />
    <path d="M 14,22 L 66,22 L 60,68 L 20,68 Z"
      fill={status === 'incinerado' ? 'rgba(190,185,180,0.85)' :
            status === 'comBagaco'  ? 'rgba(150,115,75,0.75)'  :
            'rgba(252,252,255,0.88)'}
      stroke="#9ca3af" strokeWidth="1.3" />
    <ellipse cx={40} cy={68} rx={20} ry={5}
      fill={status === 'incinerado' ? 'rgba(175,170,165,0.70)' :
            status === 'comBagaco'  ? 'rgba(130,100,65,0.60)'  :
            'rgba(240,240,250,0.65)'}
      stroke="#9ca3af" strokeWidth="1.2" />

    {/* Reflexo na parede (porcelana brilhante) */}
    {status === 'limpo' && (
      <line x1={19} y1={26} x2={16} y2={64}
        stroke="rgba(255,255,255,0.55)" strokeWidth="2.0" strokeLinecap="round" />
    )}

    {/* Bagaço no interior */}
    {status === 'comBagaco' && (
      <>
        <path d="M 16,30 L 64,30 L 60,66 L 20,66 Z" fill="rgba(120,90,50,0.60)" />
        {[[18,42,36,40],[28,48,50,46],[20,54,42,52],[34,58,56,56]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#c09040" strokeWidth="1.1" strokeLinecap="round" />
        ))}
      </>
    )}

    {/* Resíduo mineral (cinzas brancas/cinzas) */}
    {status === 'incinerado' && (
      <>
        <path d="M 16,50 L 64,50 L 60,66 L 20,66 Z" fill="rgba(200,195,190,0.75)" />
        <line x1={18} y1={56} x2={60} y2={54} stroke="rgba(215,210,205,0.60)" strokeWidth="1.0" strokeLinecap="round" />
        <line x1={20} y1={62} x2={58} y2={60} stroke="rgba(215,210,205,0.50)" strokeWidth="0.8" strokeLinecap="round" />
        <text x={40} y={46} textAnchor="middle" fontSize="5.5" fill="#8090a0" fontFamily="monospace">cinzas</text>
      </>
    )}

    {/* Label status */}
    <text x={40} y={78} textAnchor="middle" fontSize="5.5"
      fill={status === 'incinerado' ? '#94a3b8' : status === 'comBagaco' ? '#c09040' : '#6b7280'}
      fontFamily="monospace">
      {status === 'incinerado' ? 'resíduo mineral' :
       status === 'comBagaco'  ? '~30 g bagaço' : 'limpo e seco'}
    </text>
    <text x={40} y={85} textAnchor="middle" fontSize="5" fill="#4b5563" fontFamily="monospace">
      Cadinho Porcelana
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const ImpurezaBagaco = () => {
  useDragOverlay();

  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado,
    mostrarParabens, concluido,
    mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  // ── Balança ──────────────────────────────────────────────
  const [pesoBal,         setPesoBal]         = useState(0);
  const [cadinhoNaBalanca,setCadinhoNaBalanca] = useState(false);
  const [tarandoInicial,  setTarandoInicial]  = useState(false);
  const [balancaTarada1,  setBalancaTarada1]  = useState(false);
  const [pesandoCadinho,  setPesandoCadinho]  = useState(false);
  const [piRegistrado,    setPiRegistrado]    = useState(false);
  const [tarandoCadinho,  setTarandoCadinho]  = useState(false);
  const [balancaTarada2,  setBalancaTarada2]  = useState(false);
  const [pesandoBagaco,   setPesandoBagaco]   = useState(false);
  const [paRegistrado,    setPaRegistrado]    = useState(false);
  const [pesandoPF,       setPesandoPF]       = useState(false);
  const [pfRegistrado,    setPfRegistrado]    = useState(false);

  // ── Mufla ────────────────────────────────────────────────
  const [cadinhoNaMufla,       setCadinhoNaMufla]       = useState(false);
  const [muflaLigada,          setMuflaLigada]          = useState(false);
  const [incinerando,          setIncinerando]          = useState(false);
  const [tempoIncineracao,     setTempoIncineracao]     = useState(3);
  const [incineracaoPronta,    setIncineracaoPronta]    = useState(false);
  const [preResfriando,        setPreResfriando]        = useState(false);
  const [preResfriamentoPronto,setPreResfriamentoPronto]= useState(false);

  // ── Dessecador ───────────────────────────────────────────
  const [cadinhoNoDessecador, setCadinhoNoDessecador] = useState(false);
  const [resfriando,           setResfriando]          = useState(false);
  const [resfriamentoPronto,   setResfriamentoPronto]  = useState(false);

  // ── Cálculo ──────────────────────────────────────────────
  const [campoPi,        setCampoPi]        = useState('');
  const [campoPa,        setCampoPa]        = useState('');
  const [campoPf,        setCampoPf]        = useState('');
  const [terraPct,       setTerraPct]       = useState(null);
  const [terraKgT,       setTerraKgT]       = useState(null);
  const [erroCalculo,    setErroCalculo]    = useState('');


  /* ── useEffects ──────────────────────────────────────── */

  // Pesagem cadinho: 0 → PI_SIM (42,135 g)
  useEffect(() => {
    if (!pesandoCadinho) return;
    const TARGET = Math.round(PI_SIM * 1000); // 42135
    let v = 0;
    const id = setInterval(() => {
      v += 421;
      const cur = Math.min(v, TARGET);
      setPesoBal(cur / 1000);
      if (cur >= TARGET) {
        clearInterval(id);
        setPesandoCadinho(false);
        setPiRegistrado(true);
        setCampoPi(PI_SIM.toFixed(3));
        celebrarAcerto(100);
        proximaEtapa(); // → etapa 2
      }
    }, 25);
    return () => clearInterval(id);
  }, [pesandoCadinho, celebrarAcerto, proximaEtapa]);

  // Pesagem bagaço: 0 → PA_SIM (30,000 g)
  useEffect(() => {
    if (!pesandoBagaco) return;
    const TARGET = Math.round(PA_SIM * 1000); // 30000
    let v = 0;
    const id = setInterval(() => {
      v += 300;
      const cur = Math.min(v, TARGET);
      setPesoBal(cur / 1000);
      if (cur >= TARGET) {
        clearInterval(id);
        setPesandoBagaco(false);
        setPaRegistrado(true);
        setCampoPa(PA_SIM.toFixed(3));
        setCadinhoNaBalanca(false);
        celebrarAcerto(100);
        proximaEtapa(); // → etapa 4
      }
    }, 25);
    return () => clearInterval(id);
  }, [pesandoBagaco, celebrarAcerto, proximaEtapa]);

  // Incineração: contador 3 → 0 (1 s/tick)
  useEffect(() => {
    if (!incinerando || incineracaoPronta) return;
    let t = 3;
    setTempoIncineracao(3);
    const id = setInterval(() => {
      t -= 1;
      setTempoIncineracao(t);
      if (t <= 0) {
        clearInterval(id);
        setIncinerando(false);
        setIncineracaoPronta(true);
        setPreResfriando(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [incinerando, incineracaoPronta]);

  // Pré-resfriamento na mufla: 2,5 s
  useEffect(() => {
    if (!preResfriando) return;
    const id = setTimeout(() => {
      setPreResfriando(false);
      setPreResfriamentoPronto(true);
      setCadinhoNaMufla(false);
      celebrarAcerto(100);
      proximaEtapa(); // → etapa 6
    }, 2500);
    return () => clearTimeout(id);
  }, [preResfriando, celebrarAcerto, proximaEtapa]);

  // Resfriamento no dessecador: 2,5 s
  useEffect(() => {
    if (!resfriando) return;
    const id = setTimeout(() => {
      setResfriando(false);
      setResfriamentoPronto(true);
      setCadinhoNoDessecador(false);
      celebrarAcerto(100);
      proximaEtapa(); // → etapa 7
    }, 2500);
    return () => clearTimeout(id);
  }, [resfriando, celebrarAcerto, proximaEtapa]);

  // Pesagem PF: 0 → PF_SIM (42,290 g)
  useEffect(() => {
    if (!pesandoPF) return;
    const TARGET = Math.round(PF_SIM * 1000); // 42290
    let v = 0;
    const id = setInterval(() => {
      v += 421;
      const cur = Math.min(v, TARGET);
      setPesoBal(cur / 1000);
      if (cur >= TARGET) {
        clearInterval(id);
        setPesandoPF(false);
        setPfRegistrado(true);
        setCampoPf(PF_SIM.toFixed(3));
        setCadinhoNaBalanca(false);
        celebrarAcerto(100);
        proximaEtapa(); // → concluido
      }
    }, 25);
    return () => clearTimeout(id);
  }, [pesandoPF, celebrarAcerto, proximaEtapa]);


  /* ── Helpers de etapa ────────────────────────────────── */
  const isItem  = (id) => etapas[etapaAtual]?.itemNecessario === id;
  const isAlvo  = (id) => etapas[etapaAtual]?.alvo === id;
  const itemCls = (id) => isItem(id) ? 'pulse-item' : '';
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';


  /* ── Drag handlers ───────────────────────────────────── */
  const handleDragStart = (id) => setItemSegurado(id);
  const handleDragEnd   = ()   => setItemSegurado(null);
  const handleDragOver  = (e)  => e.preventDefault();


  /* ── Drop handler ────────────────────────────────────── */
  const handleDrop = (alvo, e) => {
    e.preventDefault();
    const item = itemSegurado;
    setItemSegurado(null);

    const etapa = etapas[etapaAtual];
    if (!etapa || etapa.itemNecessario !== item || etapa.alvo !== alvo) {
      mostrarErroAcao('Ação incorreta para esta etapa.');
      return;
    }

    // Etapa 1: cadinho → balança (pesagem PI)
    if (etapaAtual === 1) {
      setCadinhoNaBalanca(true);
      setPesoBal(0);
      setPesandoCadinho(true);
      return;
    }

    // Etapa 3: bagaço → balança (pesagem PA, cadinho já presente)
    if (etapaAtual === 3) {
      setPesandoBagaco(true);
      return;
    }

    // Etapa 4: cadinho → mufla
    if (etapaAtual === 4) {
      setCadinhoNaMufla(true);
      celebrarAcerto(100);
      proximaEtapa(); // → etapa 5
      return;
    }

    // Etapa 6: cadinho → dessecador
    if (etapaAtual === 6) {
      setCadinhoNoDessecador(true);
      setResfriando(true);
      return;
    }

    // Etapa 7: cadinho → balança (pesagem PF)
    if (etapaAtual === 7) {
      setCadinhoNaBalanca(true);
      setPesoBal(0);
      setPesandoPF(true);
      return;
    }
  };


  /* ── Click: Tarar balança (etapas 0 e 2) ────────────── */
  const handleTarar = () => {
    if (etapaAtual === 0 && !balancaTarada1) {
      setTarandoInicial(false);
      setBalancaTarada1(true);
      setPesoBal(0);
      celebrarAcerto(100);
      proximaEtapa(); // → etapa 1
    } else if (etapaAtual === 2 && cadinhoNaBalanca && !balancaTarada2) {
      setTarandoCadinho(false);
      setBalancaTarada2(true);
      setPesoBal(0);
      celebrarAcerto(100);
      proximaEtapa(); // → etapa 3
    }
  };

  const taraClicavel =
    (etapaAtual === 0 && !balancaTarada1) ||
    (etapaAtual === 2 && cadinhoNaBalanca && !balancaTarada2);


  /* ── Click: Ligar mufla (etapa 5) ───────────────────── */
  const handleClicarMufla = () => {
    if (etapaAtual !== 5 || muflaLigada) return;
    setMuflaLigada(true);
    setIncinerando(true);
  };


  /* ── Cálculo ─────────────────────────────────────────── */
  const calcular = () => {
    setErroCalculo('');
    setTerraPct(null);
    setTerraKgT(null);

    if (!campoPi.trim() || !campoPa.trim() || !campoPf.trim()) {
      setErroCalculo('Preencha PI, PA e PF antes de calcular.');
      return;
    }

    const PI = parseFloat(campoPi.replace(',', '.'));
    const PA = parseFloat(campoPa.replace(',', '.'));
    const PF = parseFloat(campoPf.replace(',', '.'));

    if (isNaN(PI) || isNaN(PA) || isNaN(PF)) {
      setErroCalculo('Todos os valores devem ser numéricos.');
      return;
    }
    if (PI <= 0 || PA <= 0 || PF <= 0) {
      setErroCalculo('PI, PA e PF devem ser valores positivos.');
      return;
    }
    if (PA === 0) {
      setErroCalculo('O peso da amostra PA não pode ser zero.');
      return;
    }
    if (PF <= PI) {
      setErroCalculo('PF deve ser maior que PI (a cinza é mais leve que o material úmido, mas o cadinho ganha o resíduo mineral).');
      return;
    }

    const pct = ((PF - PI) / PA) * 100;
    const kgt = ((PF - PI) / PA) * 1000;

    if (!isFinite(pct) || isNaN(pct) || pct < 0) {
      setErroCalculo('Resultado inválido — verifique os valores inseridos.');
      return;
    }

    setTerraPct(pct);
    setTerraKgT(kgt);
  };


  /* ── Draggability helpers ────────────────────────────── */
  const cadinhoArrastavel =
    (etapaAtual === 1 && !cadinhoNaBalanca && !pesandoCadinho) ||
    (etapaAtual === 4 && paRegistrado && !cadinhoNaMufla) ||
    (etapaAtual === 6 && preResfriamentoPronto && !cadinhoNoDessecador) ||
    (etapaAtual === 7 && resfriamentoPronto && !cadinhoNaBalanca && !pesandoPF);

  const bagacoArrastavel = etapaAtual === 3 && cadinhoNaBalanca && !pesandoBagaco && !paRegistrado;

  const faseBalanca = pesandoCadinho ? 'cadinho' :
                      tarandoInicial ? 'tarar1'  :
                      tarandoCadinho ? 'tarar2'  :
                      pesandoBagaco  ? 'bagaco'  :
                      pesandoPF      ? 'pf'      : null;

  const cadinhoNaBalancaAtivo = cadinhoNaBalanca || pesandoCadinho || pesandoBagaco || pesandoPF;
  const cadinhoEmUso = cadinhoNaBalancaAtivo || cadinhoNaMufla || incinerando ||
                       preResfriando || cadinhoNoDessecador || resfriando;

  const cadinhoStatus = incineracaoPronta ? 'incinerado' :
                        paRegistrado      ? 'comBagaco'  : 'limpo';

  const muflaClicavel = etapaAtual === 5 && !muflaLigada;


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding: 16, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <style>{IM_CSS}</style>

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

      {/* ── OVERLAY ERRO ── */}
      {mostrarErroEtapa && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c)', color: 'white', padding: '10px 24px', borderRadius: 14, border: '2px solid rgba(255,255,255,0.6)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>⚠️ {mensagemErroEtapa}</div>
          </div>
        </div>
      )}

      {/* ── BANNER: mufla incinerando / pré-resfriando ── */}
      {(incinerando || preResfriando) && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: incinerando ? 'linear-gradient(135deg,#7c2d12,#c2410c)' : 'linear-gradient(135deg,#1e3a5f,#1e4080)', color: 'white', padding: '10px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.65)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>
              {incinerando
                ? `🔥 Incineração em andamento — ${String(tempoIncineracao).padStart(2,'0')} s restantes`
                : '🌡 Pré-resfriamento na mufla — aguarde...'}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 16, overflowY: 'auto' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #22d3ee', borderRadius: 22, padding: '28px 34px', textAlign: 'center', color: 'white', maxWidth: 600, width: '100%', boxShadow: '0 0 42px rgba(34,211,238,0.22)' }}>

            <div style={{ fontSize: 48 }}>⚗️</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#22d3ee', margin: '8px 0 4px' }}>Simulação Concluída!</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Insira os valores para calcular a Impureza Mineral no Bagaço</p>

            {/* Fórmulas */}
            <div style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.22)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: '#67e8f9', fontWeight: 700, marginBottom: 6 }}>Fórmulas — Impureza Mineral (CONSECANA)</div>
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#e2e8f0', lineHeight: 2 }}>
                <div>% Terra   = <span style={{ color: '#86efac' }}>( PF − PI )</span> ÷ PA × <span style={{ color: '#fbbf24' }}>100</span></div>
                <div>Kg Terra/t = <span style={{ color: '#86efac' }}>( PF − PI )</span> ÷ PA × <span style={{ color: '#fbbf24' }}>1000</span></div>
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
                PI = peso inicial do cadinho · PA = peso da amostra de bagaço · PF = peso final (cadinho + resíduo)
              </div>
            </div>

            {/* Campos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'PI — Cadinho inicial (g)', value: campoPi, set: setCampoPi, placeholder: 'ex: 42,135' },
                { label: 'PA — Amostra bagaço (g)',  value: campoPa, set: setCampoPa, placeholder: 'ex: 30,000' },
                { label: 'PF — Cadinho + resíduo (g)', value: campoPf, set: setCampoPf, placeholder: 'ex: 42,290' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'left' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>{label}</label>
                  <input
                    type="text" inputMode="decimal" value={value}
                    onChange={ev => set(ev.target.value)} placeholder={placeholder}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(34,211,238,0.30)', borderRadius: 10, padding: '8px 10px', color: '#e2e8f0', fontSize: 13, fontFamily: 'monospace', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    onFocus={ev => (ev.target.style.borderColor = '#22d3ee')}
                    onBlur={ev  => (ev.target.style.borderColor = 'rgba(34,211,238,0.30)')}
                  />
                </div>
              ))}
            </div>

            {/* Erro */}
            {erroCalculo && (
              <div style={{ background: 'rgba(127,29,29,0.50)', border: '1px solid rgba(248,113,113,0.40)', borderRadius: 10, padding: '8px 14px', marginBottom: 14, fontSize: 12, color: '#fca5a5', textAlign: 'left' }}>
                ⚠️ {erroCalculo}
              </div>
            )}

            {/* Botão calcular */}
            <button onClick={calcular}
              style={{ background: 'linear-gradient(90deg,#0ea5e9,#22c55e)', color: 'white', border: 'none', borderRadius: 14, padding: '11px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: terraPct !== null ? 20 : 0 }}>
              ⚗️ Calcular Impureza
            </button>

            {/* Resultados */}
            {terraPct !== null && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.30)', borderRadius: 16, padding: '18px 22px', marginTop: 4, animation: 'imFadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>% Terra no Bagaço</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#86efac', fontFamily: 'monospace', lineHeight: 1 }}>
                      {terraPct.toFixed(3)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Kg Terra / ton Bagaço</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#67e8f9', fontFamily: 'monospace', lineHeight: 1 }}>
                      {terraKgT.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700,
                  color: terraPct < 0.5 ? '#34d399' : terraPct < 1.5 ? '#fbbf24' : '#f87171' }}>
                  {terraPct < 0.5
                    ? '✓ Impureza baixa · Bagaço de boa qualidade'
                    : terraPct < 1.5
                    ? '⚠️ Impureza moderada · Verificar processo de lavagem'
                    : '🔴 Impureza elevada · Contaminação significativa por terra'}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>faixa esperada: &lt; 0,5% para bagaço bem lavado</div>
              </div>
            )}

            <div style={{ marginTop: 18, fontSize: 15, color: '#fbbf24', fontWeight: 700 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>
            <button onClick={() => window.location.reload()}
              style={{ marginTop: 12, background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '9px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              🔄 Recomeçar
            </button>
          </div>
        </div>
      )}


      {/* ════════════════════════════════════════════════════
         BANCADA
      ════════════════════════════════════════════════════ */}
      <LayoutSimulador
        etapaAtual={etapaAtual}
        etapas={etapas}
        pontuacao={pontuacao}
        titulo="Impureza Mineral"
        subtitulo={"Determinação de Impureza Mineral no Bagaço Residual\nMétodo Mufla · Incineração Completa · CONSECANA"}
        icone="⚗️"
        badges={['🍬 CALDOS', '⚗️ MUFLA']}
        footerLabel="⚗️ Impureza Bagaço"
      >
        {/* ── CARD BANCADA (madeira) ── */}
        <div style={{
          background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)',
          borderRadius: 26, padding: '22px 18px',
          border: '8px solid #8b6e45',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 860,
        }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            ⚗️ Bancada — Impureza Mineral no Bagaço · Método Mufla · CONSECANA
          </h2>

          {/* ── PEDRA INTERNA ── */}
          <div style={{
            background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)',
            borderRadius: 20, padding: '18px 16px',
            border: '4px solid #292524',
            boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)',
          }}>

            {/* ══ ZONA 1: EQUIPAMENTOS ════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* BALANÇA ANALÍTICA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={dropCls('balanca')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '6px 8px' }}
                  onDrop={e => handleDrop('balanca', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                >
                  <BalancaIMSVG
                    pesoBal={pesoBal}
                    cadinhoNaBalanca={cadinhoNaBalancaAtivo}
                    balancaTarada={balancaTarada2 || balancaTarada1}
                    amostraPesada={paRegistrado}
                    fase={faseBalanca}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Balança Analítica</span>

                {/* Indicadores de fase */}
                {pesandoCadinho  && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(3)} g</span>}
                {piRegistrado && !balancaTarada2 && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ PI = {PI_SIM.toFixed(3)} g</span>}
                {pesandoBagaco   && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(3)} g</span>}
                {paRegistrado && !pesandoPF && !pfRegistrado && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ PA = {PA_SIM.toFixed(3)} g</span>}
                {pesandoPF       && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(3)} g</span>}
                {pfRegistrado    && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ PF = {PF_SIM.toFixed(3)} g</span>}

                {/* Botão TARAR — etapas 0 e 2 */}
                {(etapaAtual === 0 || etapaAtual === 2) && (
                  <button
                    onClick={handleTarar}
                    disabled={!taraClicavel}
                    style={{
                      marginTop: 4,
                      background: taraClicavel ? 'linear-gradient(90deg,#22d3ee,#06b6d4)' : 'rgba(255,255,255,0.08)',
                      color: taraClicavel ? '#0d2137' : '#4b5563',
                      border: 'none', borderRadius: 10, padding: '6px 18px',
                      fontSize: 11, fontWeight: 800, cursor: taraClicavel ? 'pointer' : 'not-allowed',
                    }}
                  >
                    ⟳ TARAR
                  </button>
                )}
              </div>

              {/* MUFLA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={dropCls('mufla')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 14, padding: '6px 8px', cursor: muflaClicavel ? 'pointer' : 'default' }}
                  onDrop={e => handleDrop('mufla', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onClick={handleClicarMufla}
                >
                  <MuflaSVG
                    ligada={muflaLigada}
                    incinerando={incinerando}
                    tempoIncineracao={tempoIncineracao}
                    pronto={incineracaoPronta}
                    preResfriando={preResfriando}
                    cadinhoNaMufla={cadinhoNaMufla || incinerando || preResfriando}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Mufla</span>
                {muflaClicavel    && <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique para ligar</span>}
                {incinerando      && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>🔥 {tempoIncineracao} s</span>}
                {preResfriando    && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>🌡 Pré-resfriando...</span>}
                {incineracaoPronta && !preResfriando && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Incineração completa</span>}
              </div>

              {/* DESSECADOR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <ZonaDrop id="dessecador" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    className={dropCls('dessecador')}
                    style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '6px 8px' }}
                  >
                    <DessecadorSVG
                      comCadinho={cadinhoNoDessecador || resfriando || resfriamentoPronto}
                      resfriando={resfriando}
                      pronto={resfriamentoPronto}
                    />
                  </div>
                </ZonaDrop>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Dessecador</span>
                {resfriando         && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>❄ Resfriando...</span>}
                {resfriamentoPronto && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Temperatura ambiente</span>}
              </div>

            </div>{/* fim zona 1 */}


            {/* ══ ZONA 2: ITENS DA BANCADA ════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'flex-end' }}>

              {/* CADINHO DE PORCELANA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {cadinhoEmUso ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.18 }}>
                    <CadinhoSVG status={cadinhoStatus} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#57534e' }}>Cadinho Porcelana</span>
                    <span style={{ fontSize: 8, color: '#57534e' }}>
                      {cadinhoNaBalancaAtivo ? '↑ Na balança' :
                       cadinhoNaMufla || incinerando || preResfriando ? '↑ Na mufla' : '↑ No dessecador'}
                    </span>
                  </div>
                ) : (
                  <ItemBancada
                    id="cadinho"
                    className={itemCls('cadinho')}
                    draggable={cadinhoArrastavel}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <CadinhoSVG status={cadinhoStatus} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {cadinhoArrastavel ? '🖱️ ' : ''}Cadinho Porcelana
                    </span>
                    <span style={{ fontSize: 8,
                      color: cadinhoStatus === 'incinerado' ? '#94a3b8' :
                             cadinhoStatus === 'comBagaco'  ? '#c09040' : '#94a3b8' }}>
                      {cadinhoStatus === 'incinerado' ? '● resíduo mineral' :
                       cadinhoStatus === 'comBagaco'  ? '● ~30 g bagaço'   : 'limpo e seco'}
                    </span>
                  </ItemBancada>
                )}
              </div>

              {/* AMOSTRA DE BAGAÇO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada
                  id="bagaco"
                  className={itemCls('bagaco')}
                  draggable={bagacoArrastavel}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div style={{ width: 60, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="60" height="76" viewBox="0 0 60 76">
                      <ellipse cx={30} cy={73} rx={22} ry={3} fill="rgba(0,0,0,0.18)" />
                      <rect x={6} y={52} width={48} height={18} rx="4" fill="#3a2008" stroke="#261404" strokeWidth="1.2" />
                      <rect x={7} y={53} width={46} height={16} rx="3" fill="#5a3010" />
                      <path d="M 7,52 Q 5,36 9,24 Q 15,12 30,10 Q 45,12 51,24 Q 55,36 53,52 Z" fill="#8a5c18" />
                      <path d="M 9,52 Q 8,38 11,26 Q 17,14 30,12 Q 43,14 49,26 Q 52,38 51,52 Z" fill="#9a6820" />
                      {[[10,49,21,47],[18,50,30,48],[26,48,38,50],[34,49,45,47]].map(([x1,y1,x2,y2],i) => (
                        <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4a030" strokeWidth="1.8" strokeLinecap="round" />
                      ))}
                      {[[10,40,23,36],[16,37,26,41],[22,38,34,34],[28,36,40,40],[34,38,46,34]].map(([x1,y1,x2,y2],i) => (
                        <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c08828" strokeWidth="1.6" strokeLinecap="round" />
                      ))}
                      {[[12,26,20,22],[18,23,28,27],[24,20,34,16],[30,18,40,22]].map(([x1,y1,x2,y2],i) => (
                        <line key={`u${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8c868" strokeWidth="1.4" strokeLinecap="round" />
                      ))}
                      <text x={30} y={62} textAnchor="middle" fontSize="6.5" fill="#fde68a" fontFamily="monospace" fontWeight="700">BAGAÇO</text>
                      <text x={30} y={68} textAnchor="middle" fontSize="5.5" fill="#fbbf24" fontFamily="monospace">~30 g · comp.</text>
                    </svg>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: paRegistrado ? '#34d399' : '#e7e5e4' }}>
                    {bagacoArrastavel ? '🖱️ ' : ''}Amostra Bagaço
                  </span>
                  <span style={{ fontSize: 7, color: paRegistrado ? '#34d399' : '#94a3b8' }}>
                    {paRegistrado ? '✓ Pesada' : 'composta · ±30 g'}
                  </span>
                </ItemBancada>
              </div>

            </div>{/* fim zona 2 */}

          </div>{/* fim pedra */}
        </div>{/* fim bancada */}

        {/* ── RODAPÉ DICA ── */}
        <div style={{ marginTop: 14, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.30)', borderRadius: 14, padding: '12px 20px', textAlign: 'center' }}>
          <p style={{ color: '#7dd3fc', fontWeight: 600, fontSize: 13, margin: 0 }}>
            💡 Arraste os itens piscando para os locais destacados em Azul. Botão TARAR aparece nas etapas de zeragem.
          </p>
        </div>
      </LayoutSimulador>
    </div>
  );
};

export default ImpurezaBagaco;
