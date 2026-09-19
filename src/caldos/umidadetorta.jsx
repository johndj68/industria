/**
 * umidadetorta.jsx — Determinação de Umidade em Torta de Filtro
 *
 * Método Estufa Spencer · 100 °C · 30 min · Amostra 10 g
 * Norma CONSECANA · Fórmula: %Umidade = (P1 − P2) × 10
 *
 * Fluxo: Cesto → Balança (tarar) → Torta 10 g → P1 (310 g)
 *        → Estufa 100 °C → Secar 30 min → P2 (302 g) → Calcular %Umi
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { etapas } from './data/etapasUmidadeTorta';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const UT_CSS = `
  @keyframes utAquecer {
    0%,100% { opacity: 0.50; }
    50%      { opacity: 1; }
  }
  @keyframes utFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* Valores simulados fixos (CONSECANA padrão) */
const P1_SIM = 310;   // cesto 300 g + torta úmida 10 g
const P2_SIM = 302;   // cesto 300 g + torta seca   2 g  → Umidade 80%


/* ═══════════════════════════════════════════════════════════
   SVG — BALANÇA DE PRECISÃO
   Mostra o cesto (wire-mesh) sobre a plataforma quando acoplado
═══════════════════════════════════════════════════════════ */
const BalancaUTSVG = ({ pesoBal, cestoNaBalanca, balancaTarada, amostraPesada, fase }) => (
  <svg width="148" height="134" viewBox="0 -24 148 134">
    <defs>
      <linearGradient id="utBalBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#5a5e6a" />
        <stop offset="100%" stopColor="#3a3d46" />
      </linearGradient>
    </defs>

    <ellipse cx={74} cy={100} rx={60} ry={5} fill="rgba(0,0,0,0.18)" />

    {/* Plataforma */}
    <ellipse cx={74} cy={28} rx={52} ry={8} fill="rgba(200,200,210,0.85)" stroke="#9ca3af" strokeWidth="1.5" />
    <ellipse cx={74} cy={27} rx={50} ry={6} fill="rgba(220,220,230,0.92)" stroke="#9ca3af" strokeWidth="0.8" />

    {/* Coluna */}
    <rect x={65} y={30} width={18} height={14} rx="2" fill="url(#utBalBody)" stroke="#374151" strokeWidth="1.2" />

    {/* Corpo */}
    <rect x={10} y={42} width={128} height={44} rx="6" fill="url(#utBalBody)" stroke="#374151" strokeWidth="1.5" />

    {/* LCD */}
    <rect x={16} y={47} width={80} height={32} rx="4" fill="#0a1018" stroke="#22d3ee" strokeWidth="1.0" />
    <text x={56} y={60} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="monospace">
      {fase === 'tarar' ? 'TARANDO...' :
       fase === 'pesar' ? 'PESANDO...' :
       fase === 'p1'    ? 'PESANDO...' :
       fase === 'p2'    ? 'PESANDO...' :
       balancaTarada    ? 'TARA ✓' :
       cestoNaBalanca   ? 'CESTO ✓' : 'STANDBY'}
    </text>
    <text x={56} y={75} textAnchor="middle" fontSize="14"
      fill={fase ? '#00ff88' : balancaTarada ? '#22d3ee' : cestoNaBalanca ? '#22d3ee' : '#3a5a6a'}
      fontFamily="monospace" fontWeight="700">
      {cestoNaBalanca || fase ? `${pesoBal.toFixed(1)} g` : '—'}
    </text>

    {/* LED */}
    <circle cx={112} cy={63} r={5}
      fill={fase ? '#f59e0b' : balancaTarada ? '#22c55e' : cestoNaBalanca ? '#22c55e' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

    <text x={74} y={98} textAnchor="middle" fontSize="6" fill="#4a3e28" fontFamily="monospace">
      Balança de Precisão · 0,001 g
    </text>

    {/* ── Cesto metálico (inox) sobre a plataforma ── */}
    {cestoNaBalanca && (
      <g>
        {/* Alça */}
        <path d="M 68,-9 Q 68,-17 74,-17 Q 80,-17 80,-9"
          fill="none" stroke="#c8cdd3" strokeWidth="2.2" strokeLinecap="round" />
        {/* Corpo bandeja inox */}
        <rect x={57} y={-7} width={34} height={26} rx="2"
          fill="#d8dce0" stroke="#8d96a0" strokeWidth="1.0" />
        {/* Aro superior */}
        <rect x={57} y={-9} width={34} height={4} rx="1.5"
          fill="#b8c0c8" stroke="#8d96a0" strokeWidth="0.8" />
        {/* Reflexo */}
        <rect x={59} y={-6} width={3} height={20} rx="1"
          fill="rgba(255,255,255,0.40)" />
        {/* Conteúdo */}
        {amostraPesada ? (
          <rect x={58} y={5} width={32} height={13} rx="1"
            fill="rgba(65,46,28,0.75)" />
        ) : (
          <>
            {[-2, 4, 10].map(y =>
              [62, 68, 74, 80, 86].map(x => (
                <circle key={`${x}${y}`} cx={x} cy={y} r={1.2}
                  fill="rgba(100,115,130,0.30)" />
              ))
            )}
          </>
        )}
        {/* Aro inferior */}
        <rect x={57} y={17} width={34} height={3} rx="1.5"
          fill="#b8c0c8" stroke="#8d96a0" strokeWidth="0.7" />
      </g>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — ESTUFA SPENCER (100 °C)
═══════════════════════════════════════════════════════════ */
const EstufaUTSVG = ({ ligada, temperatura, secando, tempoSecagem, pronto, cestoNaEstufa }) => (
  <svg width="170" height="170" viewBox="0 0 170 170">
    <defs>
      <linearGradient id="utEstBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#4a5568" />
        <stop offset="100%" stopColor="#2d3748" />
      </linearGradient>
    </defs>

    <ellipse cx={85} cy={166} rx={76} ry={4} fill="rgba(0,0,0,0.22)" />
    <rect x={6} y={10} width={164} height={152} rx="9" fill="#1a1f2a" />
    <rect x={2} y={6} width={164} height={152} rx="9"
      fill="url(#utEstBody)" stroke="#2d3a50" strokeWidth="1.5" />
    <rect x={4} y={6} width={160} height={6} rx="4"
      fill="rgba(255,255,255,0.10)" />

    {/* Painel de controle */}
    <rect x={8} y={10} width={152} height={42} rx="6"
      fill="#080f18" stroke="#22d3ee" strokeWidth="0.9" />

    {/* Display temperatura */}
    <rect x={12} y={14} width={68} height={34} rx="4"
      fill="#060c14" stroke="#22d3ee" strokeWidth="0.7" />
    <text x={46} y={25} textAnchor="middle" fontSize="5.5" fill="#3a5a6a" fontFamily="monospace">TEMPERATURA</text>
    <text x={46} y={40} textAnchor="middle" fontSize="16"
      fill={ligada ? (temperatura >= 100 ? '#22c55e' : '#f59e0b') : '#1a4044'}
      fontFamily="monospace" fontWeight="900">
      {ligada ? `${Math.round(temperatura)}°C` : '--°C'}
    </text>

    {/* Display timer */}
    <rect x={90} y={14} width={68} height={34} rx="4"
      fill="#060c14" stroke="#22d3ee" strokeWidth="0.7" />
    <text x={124} y={25} textAnchor="middle" fontSize="5.5" fill="#3a5a6a" fontFamily="monospace">TEMPO (min)</text>
    <text x={124} y={40} textAnchor="middle" fontSize="16"
      fill={pronto ? '#22c55e' : secando ? '#f59e0b' : '#1a4044'}
      fontFamily="monospace" fontWeight="900">
      {pronto ? '00:00' : secando ? `${String(tempoSecagem).padStart(2,'0')}:00` : '--:--'}
    </text>

    {/* Porta */}
    <rect x={10} y={58} width={148} height={90} rx="6"
      fill={ligada && temperatura >= 80 ? 'rgba(255,100,0,0.05)' : '#0d1520'}
      stroke="#2d3a50" strokeWidth="1" />

    {/* Janela */}
    <rect x={18} y={64} width={132} height={66} rx="4"
      fill={ligada && temperatura >= 60
        ? `rgba(255,${Math.max(0, 130 - Math.round((temperatura / 100) * 60))},0,${Math.min(0.14, (temperatura / 100) * 0.14)})`
        : 'rgba(5,10,20,0.92)'}
      stroke="#1e2a3a" strokeWidth="1.2" />

    {/* Elementos de aquecimento */}
    {ligada && (
      <>
        <line x1={24} y1={100} x2={146} y2={100}
          stroke={`rgba(255,90,0,${Math.min(temperatura / 100 * 0.85, 0.85)})`}
          strokeWidth="3.5" strokeLinecap="round"
          style={{ animation: 'utAquecer 0.9s ease-in-out infinite' }} />
        <line x1={24} y1={116} x2={146} y2={116}
          stroke={`rgba(255,60,0,${Math.min(temperatura / 100 * 0.65, 0.65)})`}
          strokeWidth="2.5" strokeLinecap="round"
          style={{ animation: 'utAquecer 1.3s ease-in-out infinite' }} />
      </>
    )}

    {/* Cesto dentro da estufa */}
    {cestoNaEstufa && (
      <g opacity={0.75}>
        <path d="M 46,120 L 122,120 L 118,138 L 50,138 Z"
          fill="rgba(80,60,38,0.50)" stroke="rgba(100,78,50,0.80)" strokeWidth="0.9" />
        {[124, 130, 136].map(y => (
          <line key={y} x1={46 + ((y - 120) / 18) * 4} y1={y}
            x2={122 - ((y - 120) / 18) * 4} y2={y}
            stroke="rgba(100,78,50,0.50)" strokeWidth="0.7" />
        ))}
        {[52, 62, 72, 84, 96, 106, 116].map(x => (
          <line key={x} x1={x} y1={120} x2={x - 0.5} y2={138}
            stroke="rgba(100,78,50,0.40)" strokeWidth="0.6" />
        ))}
        <path d="M 48,122 L 120,122 L 117,136 L 51,136 Z"
          fill="rgba(90,65,38,0.60)" />
      </g>
    )}

    {/* Status na janela */}
    <text x={84} y={80} textAnchor="middle" fontSize="7.5"
      fill={pronto ? '#22c55e' : secando ? '#f59e0b' : ligada ? '#22d3ee' : '#2d3a50'}
      fontFamily="monospace" fontWeight="700">
      {pronto  ? '✓ SECAGEM CONCLUÍDA' :
       secando ? `🌡 ${Math.round(temperatura)}°C · SECANDO` :
       ligada  ? '🔥 AQUECENDO...' : 'DESLIGADA'}
    </text>

    {/* Alça */}
    <rect x={74} y={150} width={20} height={5} rx="2.5"
      fill="#5a6478" stroke="#3a4050" strokeWidth="0.8" />

    {/* Plaqueta */}
    <rect x={56} y={154} width={56} height={8} rx="2"
      fill="rgba(255,255,255,0.90)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
    <text x={84} y={160} textAnchor="middle" fontSize="5" fill="#0d2137"
      fontFamily="sans-serif" fontWeight="900">ESTUFA SPENCER</text>

    {/* Pés */}
    {[20, 52, 118, 150].map(x => (
      <rect key={x} x={x - 8} y={157} width={16} height={7} rx="3.5"
        fill="#0d1117" stroke="#090d12" strokeWidth="0.7" />
    ))}

    {!ligada && (
      <text x={84} y={8} textAnchor="middle" fontSize="6.5" fill="#22d3ee"
        fontFamily="monospace" fontWeight="700">↓ Clique para ligar</text>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — CESTO METÁLICO DA ESTUFA SPENCER (menor, aço inox)
   Bandeja perfurada de inox com alça central
═══════════════════════════════════════════════════════════ */
const CestoUTSVG = ({ comAmostra = false, seco = false }) => (
  <svg width="62" height="68" viewBox="0 0 62 68">
    <defs>
      <linearGradient id="utCestoSteel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#8d96a0" />
        <stop offset="28%"  stopColor="#dde1e5" />
        <stop offset="56%"  stopColor="#f0f2f4" />
        <stop offset="82%"  stopColor="#c8cdd3" />
        <stop offset="100%" stopColor="#8d96a0" />
      </linearGradient>
      <linearGradient id="utCestoRim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#c8cdd3" />
        <stop offset="100%" stopColor="#9aa4ae" />
      </linearGradient>
      <clipPath id="utCestoClip">
        <rect x={4} y={18} width={54} height={36} rx="2" />
      </clipPath>
    </defs>

    {/* Sombra */}
    <ellipse cx={31} cy={65} rx={22} ry={3} fill="rgba(0,0,0,0.16)" />

    {/* Alça metálica central */}
    <path d="M 23,16 Q 23,6 31,6 Q 39,6 39,16"
      fill="none" stroke="url(#utCestoRim)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 24,16 Q 24,8 31,8 Q 38,8 38,16"
      fill="none" stroke="#e8ecf0" strokeWidth="1.5" strokeLinecap="round" />

    {/* Corpo principal — bandeja de inox */}
    {/* Profundidade lateral */}
    <rect x={5} y={20} width={54} height={34} rx="3" fill="#8d96a0" />
    {/* Face frontal */}
    <rect x={3} y={17} width={56} height={34} rx="3"
      fill="url(#utCestoSteel)" stroke="#8d96a0" strokeWidth="1.2" />

    {/* Reflexo metálico */}
    <rect x={6} y={19} width={4} height={30} rx="2"
      fill="rgba(255,255,255,0.38)" />

    {/* Conteúdo da bandeja (torta ou vazio) */}
    {comAmostra ? (
      <g clipPath="url(#utCestoClip)">
        <rect x={4} y={33} width={54} height={18}
          fill={seco ? 'rgba(110,85,58,0.72)' : 'rgba(65,46,28,0.85)'} />
        <rect x={4} y={31} width={54} height={4}
          fill={seco ? 'rgba(130,100,68,0.60)' : 'rgba(80,58,35,0.70)'} />
        {/* Textura superfície torta */}
        {[35, 41, 47].map((y, i) => (
          <line key={i} x1={6} y1={y} x2={56} y2={y}
            stroke={seco ? 'rgba(150,115,75,0.40)' : 'rgba(95,68,40,0.45)'}
            strokeWidth="0.9" strokeLinecap="round" />
        ))}
        {/* Reflexo úmido */}
        {!seco && (
          <ellipse cx={20} cy={33} rx={8} ry={2}
            fill="rgba(120,90,58,0.35)" />
        )}
      </g>
    ) : (
      /* Furos de perfuração quando vazio */
      <g clipPath="url(#utCestoClip)">
        {[23, 32, 41].map(y =>
          [10, 18, 26, 34, 42, 50].map(x => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={1.8}
              fill="rgba(70,80,90,0.35)" />
          ))
        )}
      </g>
    )}

    {/* Aro superior (borda da bandeja) */}
    <rect x={3} y={15} width={56} height={5} rx="2"
      fill="url(#utCestoRim)" stroke="#8d96a0" strokeWidth="0.8" />

    {/* Aro inferior */}
    <rect x={3} y={49} width={56} height={4} rx="2"
      fill="url(#utCestoRim)" stroke="#8d96a0" strokeWidth="0.8" />

    {/* Pés */}
    {[9, 52].map(x => (
      <rect key={x} x={x} y={53} width={4} height={6} rx="1"
        fill="#7a8490" stroke="#606870" strokeWidth="0.7" />
    ))}

    {/* Labels */}
    <text x={31} y={62} textAnchor="middle" fontSize="5.5"
      fill={comAmostra ? (seco ? '#fbbf24' : '#c09040') : '#4b5563'}
      fontFamily="monospace">
      {comAmostra ? (seco ? '● 10g seco' : '● 10g torta') : 'vazio'}
    </text>
    <text x={31} y={67} textAnchor="middle" fontSize="4.5" fill="#4b5563" fontFamily="monospace">
      Cesto Inox
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const UmidadeTorta = () => {
  useDragOverlay();

  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado,
    mostrarParabens, concluido,
    mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  // ── Balança ──────────────────────────────────────────────
  const [pesoBal,        setPesoBal]        = useState(0);
  const [cestoNaBalanca, setCestoNaBalanca] = useState(false);
  const [tarandoPeso,    setTarandoPeso]    = useState(false);
  const [balancaTarada,  setBalancaTarada]  = useState(false);
  const [pesandoTorta,   setPesandoTorta]   = useState(false);
  const [tortaPesada,    setTortaPesada]    = useState(false);
  const [registrandoP1,  setRegistrandoP1]  = useState(false);
  const [p1Registrado,   setP1Registrado]   = useState(false);
  const [registrandoP2,  setRegistrandoP2]  = useState(false);
  const [p2Registrado,   setP2Registrado]   = useState(false);

  // ── Estufa ───────────────────────────────────────────────
  const [estufaLigada,  setEstufaLigada]  = useState(false);
  const [temperatura,   setTemperatura]   = useState(0);
  const [cestoNaEstufa, setCestoNaEstufa] = useState(false);
  const [secando,       setSecando]       = useState(false);
  const [tempoSecagem,  setTempoSecagem]  = useState(30);
  const [secagemPronta, setSecagemPronta] = useState(false);

  // ── Cálculo ──────────────────────────────────────────────
  const [campoP1,           setCampoP1]           = useState('');
  const [campoP2,           setCampoP2]           = useState('');
  const [umidadeResultado,  setUmidadeResultado]  = useState(null);
  const [erroCalculo,       setErroCalculo]       = useState('');


  /* ── useEffects ──────────────────────────────────────── */

  // Taragem: cesto 0 → 300 g
  useEffect(() => {
    if (!tarandoPeso) return;
    let v = 0;
    const id = setInterval(() => {
      v += 6;
      setPesoBal(Math.min(v, 300));
      if (v >= 300) {
        clearInterval(id);
        setTarandoPeso(false);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 25);
    return () => clearInterval(id);
  }, [tarandoPeso, celebrarAcerto, proximaEtapa]);

  // Pesagem torta: 0 → 10 g
  useEffect(() => {
    if (!pesandoTorta) return;
    let v = 0;
    const id = setInterval(() => {
      v += 0.2;
      setPesoBal(Math.min(parseFloat(v.toFixed(1)), 10));
      if (v >= 10) {
        clearInterval(id);
        setPesandoTorta(false);
        setTortaPesada(true);
        setCestoNaBalanca(false);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 40);
    return () => clearInterval(id);
  }, [pesandoTorta, celebrarAcerto, proximaEtapa]);

  // Registro P1: cesto + torta úmida → 310 g
  useEffect(() => {
    if (!registrandoP1) return;
    let v = 0;
    const id = setInterval(() => {
      v += 7;
      setPesoBal(Math.min(v, P1_SIM));
      if (v >= P1_SIM) {
        clearInterval(id);
        setRegistrandoP1(false);
        setP1Registrado(true);
        setCampoP1(String(P1_SIM));
        setCestoNaBalanca(false);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 25);
    return () => clearInterval(id);
  }, [registrandoP1, celebrarAcerto, proximaEtapa]);

  // Aquecimento estufa: 0 → 100 °C (~1 s)
  useEffect(() => {
    if (!estufaLigada) return;
    let t = 0;
    const id = setInterval(() => {
      t += 5;
      setTemperatura(Math.min(t, 100));
      if (t >= 100) {
        clearInterval(id);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 50);
    return () => clearInterval(id);
  }, [estufaLigada, celebrarAcerto, proximaEtapa]);

  // Secagem: 30 → 0 minutos (200 ms/min = 6 s total)
  useEffect(() => {
    if (!secando || secagemPronta) return;
    let mins = 30;
    const id = setInterval(() => {
      mins -= 1;
      setTempoSecagem(mins);
      if (mins <= 0) {
        clearInterval(id);
        setSecando(false);
        setSecagemPronta(true);
        setCestoNaEstufa(false);
        celebrarAcerto(200);
        proximaEtapa();
      }
    }, 200);
    return () => clearInterval(id);
  }, [secando, secagemPronta, celebrarAcerto, proximaEtapa]);

  // Registro P2: cesto + torta seca → 302 g
  useEffect(() => {
    if (!registrandoP2) return;
    let v = 0;
    const id = setInterval(() => {
      v += 7;
      setPesoBal(Math.min(v, P2_SIM));
      if (v >= P2_SIM) {
        clearInterval(id);
        setRegistrandoP2(false);
        setP2Registrado(true);
        setCampoP2(String(P2_SIM));
        setCestoNaBalanca(false);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 25);
    return () => clearInterval(id);
  }, [registrandoP2, celebrarAcerto, proximaEtapa]);


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

    // Etapa 0: cesto → balança (tarar)
    if (etapaAtual === 0) {
      setCestoNaBalanca(true);
      setPesoBal(0);
      setTarandoPeso(true);
      return;
    }

    // Etapa 2: torta → balança (pesar 10 g)
    if (etapaAtual === 2) {
      setCestoNaBalanca(true);
      setPesandoTorta(true);
      return;
    }

    // Etapa 3: cesto → balança (registrar P1)
    if (etapaAtual === 3) {
      setCestoNaBalanca(true);
      setPesoBal(0);
      setRegistrandoP1(true);
      return;
    }

    // Etapa 5: cesto → estufa (secagem)
    if (etapaAtual === 5) {
      setCestoNaEstufa(true);
      setSecando(true);
      return;
    }

    // Etapa 6: cesto → balança (registrar P2)
    if (etapaAtual === 6) {
      setCestoNaEstufa(false);
      setCestoNaBalanca(true);
      setPesoBal(0);
      setRegistrandoP2(true);
      return;
    }
  };


  /* ── Click: TARAR balança (etapa 1) ─────────────────── */
  const handleTarar = () => {
    if (etapaAtual !== 1 || !cestoNaBalanca) return;
    setPesoBal(0);
    setBalancaTarada(true);
    celebrarAcerto(100);
    proximaEtapa();
  };


  /* ── Click: ligar estufa (etapa 4) ──────────────────── */
  const handleClicarEstufa = () => {
    if (etapaAtual !== 4 || estufaLigada) return;
    setEstufaLigada(true);
  };


  /* ── Cálculo %Umidade ────────────────────────────────── */
  const calcularUmidade = () => {
    setErroCalculo('');
    setUmidadeResultado(null);

    if (!campoP1.trim() || !campoP2.trim()) {
      setErroCalculo('Preencha P1 e P2 antes de calcular.');
      return;
    }

    const P1 = parseFloat(campoP1.replace(',', '.'));
    const P2 = parseFloat(campoP2.replace(',', '.'));

    if (isNaN(P1) || isNaN(P2)) {
      setErroCalculo('Os valores devem ser numéricos.');
      return;
    }
    if (P1 <= 0 || P2 <= 0) {
      setErroCalculo('P1 e P2 devem ser valores positivos.');
      return;
    }
    if (P1 <= P2) {
      setErroCalculo('P1 deve ser maior que P2 (a amostra perde massa ao secar).');
      return;
    }

    const resultado = (P1 - P2) * 10;

    if (!isFinite(resultado) || isNaN(resultado) || resultado < 0) {
      setErroCalculo('Resultado inválido — verifique os valores inseridos.');
      return;
    }

    setUmidadeResultado(resultado);
  };


  /* ── Draggability helpers ────────────────────────────── */
  const cestoArrastavel =
    (etapaAtual === 0 && !cestoNaBalanca && !tarandoPeso) ||
    (etapaAtual === 3 && tortaPesada && !cestoNaBalanca && !registrandoP1) ||
    (etapaAtual === 5 && !cestoNaEstufa && temperatura >= 100) ||
    (etapaAtual === 6 && secagemPronta && !cestoNaBalanca && !registrandoP2);

  const tortaArrastavel = etapaAtual === 2 && !pesandoTorta && !tortaPesada;

  const faseBalanca = tarandoPeso  ? 'tarar' :
                      pesandoTorta ? 'pesar' :
                      registrandoP1 ? 'p1'   :
                      registrandoP2 ? 'p2'   : null;

  const cestoNaBalancaAtivo = cestoNaBalanca || tarandoPeso || pesandoTorta || registrandoP1 || registrandoP2;
  const cestoEmUso = cestoNaBalancaAtivo || cestoNaEstufa || secando;
  const cestoComAmostra = tortaPesada;
  const cestoComAmostraSeco = secagemPronta;

  const estufaClicavel = etapaAtual === 4 && !estufaLigada;
  const taraClicavel   = etapaAtual === 1 && cestoNaBalanca;


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding: 16, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <style>{UT_CSS}</style>

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

      {/* ── BANNER: estufa aquecendo / secando ── */}
      {(estufaLigada && !secagemPronta) && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: secando ? 'linear-gradient(135deg,#78350f,#b45309)' : 'linear-gradient(135deg,#1e3a5f,#1e4080)', color: 'white', padding: '10px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.65)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>
              {secando
                ? `🔥 Secagem em andamento — ${String(tempoSecagem).padStart(2,'0')}:00 restantes · 100 °C`
                : `🌡 Aquecendo — ${Math.round(temperatura)} °C / 100 °C`}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 16, overflowY: 'auto' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #22d3ee', borderRadius: 22, padding: '28px 34px', textAlign: 'center', color: 'white', maxWidth: 560, width: '100%', boxShadow: '0 0 42px rgba(34,211,238,0.22)' }}>

            <div style={{ fontSize: 48 }}>🧱</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#22d3ee', margin: '8px 0 4px' }}>Simulação Concluída!</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Insira os valores para calcular a % de Umidade da Torta</p>

            {/* Fórmula */}
            <div style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.22)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: '#67e8f9', fontWeight: 700, marginBottom: 6 }}>Fórmula — Umidade da Torta de Filtro (CONSECANA)</div>
              <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#e2e8f0', lineHeight: 2 }}>
                % Umidade = <span style={{ color: '#86efac' }}>( P1 − P2 )</span> × <span style={{ color: '#fbbf24' }}>10</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
                P1 = peso inicial (cesto + torta úmida) · P2 = peso final (cesto + torta seca)
              </div>
            </div>

            {/* Campos P1 e P2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {[
                { label: 'P1 — Peso Inicial (g)', value: campoP1, set: setCampoP1, placeholder: 'ex: 310' },
                { label: 'P2 — Peso Final (g)',   value: campoP2, set: setCampoP2, placeholder: 'ex: 302' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'left' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>{label}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={ev => set(ev.target.value)}
                    placeholder={placeholder}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(34,211,238,0.30)', borderRadius: 10, padding: '8px 10px', color: '#e2e8f0', fontSize: 16, fontFamily: 'monospace', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    onFocus={ev => (ev.target.style.borderColor = '#22d3ee')}
                    onBlur={ev  => (ev.target.style.borderColor = 'rgba(34,211,238,0.30)')}
                  />
                </div>
              ))}
            </div>

            {/* Erro de cálculo */}
            {erroCalculo && (
              <div style={{ background: 'rgba(127,29,29,0.50)', border: '1px solid rgba(248,113,113,0.40)', borderRadius: 10, padding: '8px 14px', marginBottom: 14, fontSize: 12, color: '#fca5a5', textAlign: 'left' }}>
                ⚠️ {erroCalculo}
              </div>
            )}

            {/* Botão calcular */}
            <button
              onClick={calcularUmidade}
              style={{ background: 'linear-gradient(90deg,#0ea5e9,#22c55e)', color: 'white', border: 'none', borderRadius: 14, padding: '11px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: umidadeResultado !== null ? 20 : 0 }}
            >
              🧱 Calcular % Umidade
            </button>

            {/* Resultado */}
            {umidadeResultado !== null && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.30)', borderRadius: 16, padding: '18px 22px', marginTop: 4, animation: 'utFadeIn 0.3s ease' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Umidade da Torta de Filtro</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#86efac', fontFamily: 'monospace', lineHeight: 1 }}>
                  {umidadeResultado.toFixed(2)}%
                </div>
                <div style={{ fontSize: 11, marginTop: 10, fontWeight: 700,
                  color: umidadeResultado < 65 ? '#fbbf24' : umidadeResultado <= 85 ? '#34d399' : '#f87171' }}>
                  {umidadeResultado < 65
                    ? '⚠️ Umidade baixa · Torta muito seca — verificar filtros'
                    : umidadeResultado <= 85
                    ? '✓ Umidade dentro do padrão CONSECANA (65–85%)'
                    : '🔴 Umidade muito elevada · Eficiência de filtração comprometida'}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>faixa ideal: 65–85% (CONSECANA)</div>
              </div>
            )}

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


      {/* ════════════════════════════════════════════════════
         BANCADA
      ════════════════════════════════════════════════════ */}
      <LayoutSimulador
        etapaAtual={etapaAtual}
        etapas={etapas}
        pontuacao={pontuacao}
        titulo="Umidade da Torta"
        subtitulo={"Determinação de Umidade em Torta de Filtro\nMétodo Estufa Spencer 100 °C · CONSECANA"}
        icone="🧱"
        badges={['🍬 CALDOS', '🧱 TORTA']}
        footerLabel="🧱 Umidade Torta"
      >
        {/* ── CARD BANCADA (madeira) ── */}
        <div style={{
          background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)',
          borderRadius: 26, padding: '22px 18px',
          border: '8px solid #8b6e45',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 760,
        }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            🧱 Bancada — Umidade da Torta de Filtro · Estufa Spencer 100 °C / 30 min · CONSECANA
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

              {/* BALANÇA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={dropCls('balanca')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '6px 8px' }}
                  onDrop={e => handleDrop('balanca', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                >
                  <BalancaUTSVG
                    pesoBal={pesoBal}
                    cestoNaBalanca={cestoNaBalancaAtivo}
                    balancaTarada={balancaTarada}
                    amostraPesada={tortaPesada}
                    fase={faseBalanca}
                  />
                </div>

                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Balança de Precisão</span>

                {tarandoPeso    && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(0)} g</span>}
                {pesandoTorta   && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(1)} g</span>}
                {tortaPesada && !registrandoP1 && !p1Registrado && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ 10 g pesados</span>}
                {registrandoP1  && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(0)} g</span>}
                {p1Registrado && !registrandoP2 && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ P1 = {P1_SIM} g</span>}
                {registrandoP2  && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(0)} g</span>}
                {p2Registrado   && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ P2 = {P2_SIM} g</span>}

                {/* Botão TARAR — visível na etapa 1 */}
                {etapaAtual === 1 && (
                  <button
                    onClick={handleTarar}
                    disabled={!taraClicavel}
                    style={{
                      marginTop: 4,
                      background: taraClicavel ? 'linear-gradient(90deg,#22d3ee,#06b6d4)' : 'rgba(255,255,255,0.08)',
                      color: taraClicavel ? '#0d2137' : '#4b5563',
                      border: 'none', borderRadius: 10, padding: '6px 18px',
                      fontSize: 11, fontWeight: 800, cursor: taraClicavel ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                    }}
                  >
                    ⟳ TARAR
                  </button>
                )}
              </div>

              {/* ESPAÇO CENTRAL */}
              <div style={{ flex: 1 }} />

              {/* ESTUFA SPENCER */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={dropCls('estufa')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 14, padding: '6px 8px', cursor: estufaClicavel ? 'pointer' : 'default' }}
                  onDrop={e => handleDrop('estufa', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onClick={handleClicarEstufa}
                >
                  <EstufaUTSVG
                    ligada={estufaLigada}
                    temperatura={temperatura}
                    secando={secando}
                    tempoSecagem={tempoSecagem}
                    pronto={secagemPronta}
                    cestoNaEstufa={cestoNaEstufa || secando}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Estufa Spencer</span>
                {estufaClicavel && <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique para ligar</span>}
                {estufaLigada && !secando && !secagemPronta && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>🌡 {Math.round(temperatura)} °C</span>}
                {secando && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>🔥 {String(tempoSecagem).padStart(2,'0')}:00</span>}
                {secagemPronta && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Secagem concluída</span>}
              </div>

            </div>{/* fim zona 1 */}


            {/* ══ ZONA 2: ITENS DA BANCADA ════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'flex-end' }}>

              {/* CESTO DA ESTUFA SPENCER */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {cestoEmUso ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.18 }}>
                    <CestoUTSVG comAmostra={cestoComAmostra} seco={cestoComAmostraSeco} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#57534e' }}>Cesto Spencer</span>
                    <span style={{ fontSize: 8, color: '#57534e' }}>
                      {cestoNaBalancaAtivo ? '↑ Na balança' : '↑ Na estufa'}
                    </span>
                  </div>
                ) : (
                  <ItemBancada
                    id="cesto"
                    className={itemCls('cesto')}
                    draggable={cestoArrastavel}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <CestoUTSVG comAmostra={cestoComAmostra} seco={cestoComAmostraSeco} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {cestoArrastavel ? '🖱️ ' : ''}Cesto da Estufa
                    </span>
                    <span style={{ fontSize: 8, color: cestoComAmostra ? (cestoComAmostraSeco ? '#fbbf24' : '#c09040') : '#94a3b8' }}>
                      {cestoComAmostraSeco ? '● torta seca (P2)' : cestoComAmostra ? '● 10 g torta (P1)' : 'vazio · tara 300 g'}
                    </span>
                  </ItemBancada>
                )}
              </div>

              {/* AMOSTRA DE TORTA DE FILTRO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada
                  id="torta"
                  className={itemCls('torta')}
                  draggable={tortaArrastavel}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div style={{ width: 70, height: 74, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="70" height="74" viewBox="0 0 70 74">
                      {/* Sombra */}
                      <ellipse cx={35} cy={71} rx={28} ry={3} fill="rgba(0,0,0,0.20)" />

                      {/* Prato / recipiente de coleta */}
                      <ellipse cx={35} cy={60} rx={29} ry={8}
                        fill="#2c1e0e" stroke="#1c1208" strokeWidth="1.2" />
                      <ellipse cx={35} cy={56} rx={27} ry={7}
                        fill="#4a3218" stroke="#2c1e0e" strokeWidth="1.0" />

                      {/* Massa compacta da torta (úmida, escura) */}
                      <ellipse cx={35} cy={48} rx={25} ry={12}
                        fill="rgba(55,38,20,0.90)" stroke="#3a2810" strokeWidth="0.8" />
                      <ellipse cx={35} cy={44} rx={23} ry={10}
                        fill="rgba(68,48,28,0.92)" />
                      <ellipse cx={35} cy={40} rx={20} ry={8}
                        fill="rgba(78,55,32,0.88)" />

                      {/* Textura compacta */}
                      <ellipse cx={35} cy={36} rx={16} ry={5}
                        fill="rgba(88,62,36,0.80)" />
                      {[32, 38, 44].map(y => (
                        <line key={y} x1={35 - (y < 40 ? 10 : 8)} y1={y}
                          x2={35 + (y < 40 ? 10 : 8)} y2={y}
                          stroke="rgba(105,75,45,0.40)" strokeWidth="0.9" strokeLinecap="round" />
                      ))}

                      {/* Reflexo úmido */}
                      <ellipse cx={27} cy={32} rx={5} ry={2}
                        fill="rgba(115,85,55,0.35)" />

                      {/* Labels */}
                      <text x={35} y={63} textAnchor="middle" fontSize="6.5" fill="#fde68a"
                        fontFamily="monospace" fontWeight="700">TORTA</text>
                      <text x={35} y={70} textAnchor="middle" fontSize="5.5" fill="#fbbf24"
                        fontFamily="monospace">10 g · filtro</text>
                    </svg>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: tortaPesada ? '#34d399' : '#e7e5e4' }}>
                    {tortaArrastavel ? '🖱️ ' : ''}Torta de Filtro
                  </span>
                  <span style={{ fontSize: 7, color: tortaPesada ? '#34d399' : '#94a3b8' }}>
                    {tortaPesada ? '✓ Pesada' : 'homogeneizada · 10 g'}
                  </span>
                </ItemBancada>
              </div>

            </div>{/* fim zona 2 */}

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

export default UmidadeTorta;
