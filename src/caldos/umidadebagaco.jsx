/**
 * umidadebagaco.jsx — Determinação da Umidade do Bagaço de Cana
 *
 * Método Estufa Spencer · 105 °C · 30 min · Amostra 50 g
 * Norma CONSECANA · Fórmula: Ub (%) = (P1 − P2) × 2
 *
 * Fluxo: Cesto → Balança (tarar) → Bagaço 50 g → P1 (350 g)
 *        → Estufa 105 °C → Secar 30 min → P2 (325 g) → Calcular Ub
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { etapas } from './data/etapasUmidadeBagaco';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const UB_CSS = `
  @keyframes ubPulse {
    0%,100% { opacity: 0.65; }
    50%      { opacity: 1; }
  }
  @keyframes ubAquecer {
    0%,100% { opacity: 0.50; }
    50%      { opacity: 1; }
  }
  @keyframes ubFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* Valores simulados fixos (CONSECANA padrão) */
const P1_SIM = 350;   // cesto 300 g + amostra úmida 50 g
const P2_SIM = 325;   // cesto 300 g + amostra seca  25 g


/* ═══════════════════════════════════════════════════════════
   SVG — BALANÇA DE PRECISÃO
   Mostra o cesto (wire mesh) sobre a plataforma quando acoplado
═══════════════════════════════════════════════════════════ */
const BalancaUBSVG = ({ pesoBal, cestoNaBalanca, tarandoPeso, balancaTarada, bagacoPesado, fase }) => (
  <svg width="148" height="134" viewBox="0 -24 148 134">
    <defs>
      <linearGradient id="ubBalBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#5a5e6a" />
        <stop offset="100%" stopColor="#3a3d46" />
      </linearGradient>
    </defs>

    {/* Sombra */}
    <ellipse cx={74} cy={100} rx={60} ry={5} fill="rgba(0,0,0,0.18)" />

    {/* Plataforma */}
    <ellipse cx={74} cy={28} rx={52} ry={8} fill="rgba(200,200,210,0.85)" stroke="#9ca3af" strokeWidth="1.5" />
    <ellipse cx={74} cy={27} rx={50} ry={6} fill="rgba(220,220,230,0.92)" stroke="#9ca3af" strokeWidth="0.8" />

    {/* Coluna */}
    <rect x={65} y={30} width={18} height={14} rx="2" fill="url(#ubBalBody)" stroke="#374151" strokeWidth="1.2" />

    {/* Corpo */}
    <rect x={10} y={42} width={128} height={44} rx="6" fill="url(#ubBalBody)" stroke="#374151" strokeWidth="1.5" />

    {/* LCD */}
    <rect x={16} y={47} width={80} height={32} rx="4" fill="#0a1018" stroke="#22d3ee" strokeWidth="1.0" />
    <text x={56} y={60} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="monospace">
      {fase === 'tarar'    ? 'TARANDO...' :
       fase === 'pesar'    ? 'PESANDO...' :
       fase === 'p1'       ? 'PESANDO...' :
       fase === 'p2'       ? 'PESANDO...' :
       balancaTarada       ? 'TARA ✓' :
       cestoNaBalanca      ? 'CESTO ✓' : 'STANDBY'}
    </text>
    <text x={56} y={75} textAnchor="middle" fontSize="14"
      fill={fase ? '#00ff88' : balancaTarada ? '#22d3ee' : cestoNaBalanca ? '#22d3ee' : '#3a5a6a'}
      fontFamily="monospace" fontWeight="700">
      {cestoNaBalanca || fase ? `${pesoBal.toFixed(1)} g` : '—'}
    </text>

    {/* LED indicador */}
    <circle cx={112} cy={63} r={5}
      fill={fase === 'tarar' || fase === 'pesar' || fase === 'p1' || fase === 'p2' ? '#f59e0b'
        : balancaTarada ? '#22c55e'
        : cestoNaBalanca ? '#22c55e' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

    <text x={74} y={98} textAnchor="middle" fontSize="6" fill="#4a3e28" fontFamily="monospace">
      Balança de Precisão · 0,001 g
    </text>

    {/* ── Cesto wire-mesh sobre a plataforma ── */}
    {cestoNaBalanca && (
      <g>
        {/* Aro superior */}
        <ellipse cx={74} cy={0} rx={16} ry={3.5}
          fill="rgba(200,200,210,0.65)" stroke="#9ca3af" strokeWidth="0.9" />
        {/* Corpo do cesto */}
        <path d="M 58,3 L 90,3 L 87,21 L 61,21 Z"
          fill="rgba(210,210,220,0.20)" stroke="#9ca3af" strokeWidth="0.9" />
        {/* Fios horizontais */}
        {[7, 12, 17].map(y => {
          const pct = (y - 3) / 18;
          return <line key={y} x1={58 + pct * 3} y1={y} x2={90 - pct * 3} y2={y}
            stroke="rgba(150,160,170,0.60)" strokeWidth="0.7" />;
        })}
        {/* Fios verticais */}
        {[63, 68, 74, 80, 85].map(x => (
          <line key={x} x1={x} y1={3} x2={x - 0.8} y2={21}
            stroke="rgba(150,160,170,0.50)" strokeWidth="0.6" />
        ))}
        {/* Aro inferior */}
        <ellipse cx={74} cy={21} rx={13} ry={3}
          fill="rgba(180,180,190,0.25)" stroke="#9ca3af" strokeWidth="0.8" />
        {/* Bagaço no cesto (quando pesado) */}
        {bagacoPesado && (
          <>
            <path d="M 59,5 L 89,5 L 87,20 L 61,20 Z" fill="rgba(160,110,60,0.55)" />
            <line x1={62} y1={10} x2={78} y2={8}  stroke="#d4a030" strokeWidth="1.1" strokeLinecap="round" />
            <line x1={70} y1={14} x2={86} y2={12} stroke="#c08828" strokeWidth="1.0" strokeLinecap="round" />
            <line x1={63} y1={17} x2={80} y2={15} stroke="#d4a030" strokeWidth="1.0" strokeLinecap="round" />
          </>
        )}
      </g>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — ESTUFA SPENCER
   Estufa de secagem laboratorial a 105 °C / 30 min
═══════════════════════════════════════════════════════════ */
const EstufaSpencerSVG = ({ ligada, temperatura, secando, tempoSecagem, pronto, cestoNaEstufa }) => (
  <svg width="170" height="170" viewBox="0 0 170 170">
    <defs>
      <linearGradient id="ubEstBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#4a5568" />
        <stop offset="100%" stopColor="#2d3748" />
      </linearGradient>
      <linearGradient id="ubEstFace" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"  stopColor="#3a4456" />
        <stop offset="50%" stopColor="#4a5568" />
        <stop offset="100%" stopColor="#3a4456" />
      </linearGradient>
    </defs>

    {/* Sombra */}
    <ellipse cx={85} cy={166} rx={76} ry={4} fill="rgba(0,0,0,0.22)" />

    {/* Profundidade */}
    <rect x={6} y={10} width={164} height={152} rx="9" fill="#1a1f2a" />

    {/* Corpo principal */}
    <rect x={2} y={6} width={164} height={152} rx="9"
      fill="url(#ubEstBody)" stroke="#2d3a50" strokeWidth="1.5" />

    {/* Highlight superior */}
    <rect x={4} y={6} width={160} height={6} rx="4"
      fill="rgba(255,255,255,0.10)" />

    {/* ── PAINEL DE CONTROLE (topo) ── */}
    <rect x={8} y={10} width={152} height={42} rx="6"
      fill="#080f18" stroke="#22d3ee" strokeWidth="0.9" />

    {/* Display temperatura */}
    <rect x={12} y={14} width={68} height={34} rx="4"
      fill="#060c14" stroke="#22d3ee" strokeWidth="0.7" />
    <text x={46} y={25} textAnchor="middle" fontSize="5.5" fill="#3a5a6a" fontFamily="monospace">TEMPERATURA</text>
    <text x={46} y={40} textAnchor="middle" fontSize="16"
      fill={ligada ? (temperatura >= 105 ? '#22c55e' : '#f59e0b') : '#1a4044'}
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

    {/* ── PORTA COM JANELA ── */}
    <rect x={10} y={58} width={148} height={90} rx="6"
      fill={ligada && temperatura >= 80 ? 'rgba(255,100,0,0.06)' : '#0d1520'}
      stroke="#2d3a50" strokeWidth="1" />

    {/* Janela da porta */}
    <rect x={18} y={64} width={132} height={66} rx="4"
      fill={ligada && temperatura >= 60 ? `rgba(255,${Math.max(0,120 - Math.round((temperatura/105)*60))},0,${Math.min(0.15, (temperatura/105)*0.15)})` : 'rgba(5,10,20,0.92)'}
      stroke="#1e2a3a" strokeWidth="1.2" />

    {/* Elementos de aquecimento */}
    {ligada && (
      <>
        <line x1={24} y1={100} x2={146} y2={100}
          stroke={`rgba(255,90,0,${Math.min(temperatura / 105 * 0.85, 0.85)})`}
          strokeWidth="3.5" strokeLinecap="round"
          style={{ animation: 'ubAquecer 0.9s ease-in-out infinite' }} />
        <line x1={24} y1={116} x2={146} y2={116}
          stroke={`rgba(255,60,0,${Math.min(temperatura / 105 * 0.65, 0.65)})`}
          strokeWidth="2.5" strokeLinecap="round"
          style={{ animation: 'ubAquecer 1.3s ease-in-out infinite' }} />
      </>
    )}

    {/* Cesto dentro da estufa */}
    {cestoNaEstufa && (
      <g opacity={0.75}>
        {/* Base do cesto */}
        <path d="M 46,120 L 122,120 L 118,138 L 50,138 Z"
          fill="rgba(200,180,120,0.35)" stroke="rgba(180,160,100,0.80)" strokeWidth="0.9" />
        {/* Fios horizontais */}
        {[124, 130, 136].map(y => (
          <line key={y} x1={46 + ((y-120)/18)*4} y1={y}
            x2={122 - ((y-120)/18)*4} y2={y}
            stroke="rgba(190,170,110,0.55)" strokeWidth="0.7" />
        ))}
        {/* Fios verticais */}
        {[52, 62, 72, 84, 96, 106, 116].map(x => (
          <line key={x} x1={x} y1={120} x2={x - 0.5} y2={138}
            stroke="rgba(190,170,110,0.45)" strokeWidth="0.6" />
        ))}
        {/* Conteúdo bagaço seco */}
        <path d="M 48,122 L 120,122 L 117,136 L 51,136 Z"
          fill="rgba(200,160,80,0.45)" />
        <line x1={54} y1={127} x2={72}  y2={125} stroke="#c8a040" strokeWidth="1.0" strokeLinecap="round" />
        <line x1={68} y1={131} x2={90}  y2={129} stroke="#b89030" strokeWidth="1.0" strokeLinecap="round" />
        <line x1={84} y1={126} x2={108} y2={124} stroke="#c8a040" strokeWidth="1.0" strokeLinecap="round" />
      </g>
    )}

    {/* Status text na janela */}
    <text x={84} y={80} textAnchor="middle" fontSize="7.5"
      fill={pronto ? '#22c55e' : secando ? '#f59e0b' : ligada ? '#22d3ee' : '#2d3a50'}
      fontFamily="monospace" fontWeight="700">
      {pronto    ? '✓ SECAGEM CONCLUÍDA' :
       secando   ? `🌡 ${Math.round(temperatura)}°C · SECANDO` :
       ligada    ? '🔥 AQUECENDO...' :
                   'DESLIGADA'}
    </text>

    {/* ── ALÇA DA PORTA ── */}
    <rect x={74} y={150} width={20} height={5} rx="2.5"
      fill="#5a6478" stroke="#3a4050" strokeWidth="0.8" />

    {/* Plaqueta da marca */}
    <rect x={56} y={154} width={56} height={8} rx="2"
      fill="rgba(255,255,255,0.90)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
    <text x={84} y={160} textAnchor="middle" fontSize="5" fill="#0d2137"
      fontFamily="sans-serif" fontWeight="900">ESTUFA SPENCER</text>

    {/* Pés de borracha */}
    {[20, 52, 118, 150].map(x => (
      <rect key={x} x={x - 8} y={157} width={16} height={7} rx="3.5"
        fill="#0d1117" stroke="#090d12" strokeWidth="0.7" />
    ))}

    {/* Dica de clique */}
    {!ligada && (
      <text x={84} y={8} textAnchor="middle" fontSize="6.5" fill="#22d3ee"
        fontFamily="monospace" fontWeight="700">↓ Clique para ligar</text>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — CESTO DA ESTUFA SPENCER (standalone zona de itens)
   Recipiente de tela metálica para secagem de bagaço
═══════════════════════════════════════════════════════════ */
const CestoSVG = ({ comBagaco = false, seco = false }) => (
  <svg width="80" height="90" viewBox="0 0 80 90">
    {/* Alça superior */}
    <path d="M 30,18 Q 30,6 40,6 Q 50,6 50,18"
      fill="none" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
    <path d="M 30,18 Q 31,9 40,9 Q 49,9 50,18"
      fill="none" stroke="#c8cdd3" strokeWidth="1.2" strokeLinecap="round" />

    {/* Aro superior */}
    <ellipse cx={40} cy={20} rx={26} ry={6}
      fill="rgba(200,205,215,0.55)" stroke="#9ca3af" strokeWidth="1.3" />

    {/* Corpo cônico */}
    <path d="M 14,24 L 66,24 L 60,68 L 20,68 Z"
      fill="rgba(210,215,225,0.18)" stroke="#9ca3af" strokeWidth="1.3" />

    {/* Fios horizontais da malha */}
    {[32, 40, 50, 60].map(y => {
      const pct = (y - 24) / 44;
      const x1 = 14 + pct * 6;
      const x2 = 66 - pct * 6;
      return (
        <line key={y} x1={x1} y1={y} x2={x2} y2={y}
          stroke="rgba(148,160,175,0.60)" strokeWidth="0.8" />
      );
    })}

    {/* Fios verticais da malha */}
    {[21, 28, 35, 40, 45, 52, 59].map(x => (
      <line key={x} x1={x} y1={24} x2={x - 1.5} y2={66}
        stroke="rgba(148,160,175,0.50)" strokeWidth="0.7" />
    ))}

    {/* Aro inferior */}
    <ellipse cx={40} cy={68} rx={20} ry={5}
      fill="rgba(180,185,195,0.30)" stroke="#9ca3af" strokeWidth="1.2" />

    {/* Bagaço (úmido ou seco) */}
    {comBagaco && (
      <>
        <path d="M 16,30 L 64,30 L 60,66 L 20,66 Z"
          fill={seco ? 'rgba(195,165,100,0.55)' : 'rgba(160,110,60,0.55)'} />
        {[
          [20, 40, 38, 38],
          [30, 46, 54, 44],
          [22, 54, 44, 52],
          [36, 58, 58, 56],
          [18, 62, 38, 60],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={seco ? '#c8a040' : '#c08828'} strokeWidth="1.2" strokeLinecap="round" />
        ))}
      </>
    )}

    {/* Sombra */}
    <ellipse cx={40} cy={72} rx={22} ry={3} fill="rgba(0,0,0,0.12)" />

    {/* Label status */}
    <text x={40} y={82} textAnchor="middle" fontSize="6"
      fill={comBagaco ? (seco ? '#fbbf24' : '#d4a030') : '#4b5563'}
      fontFamily="monospace">
      {comBagaco ? (seco ? '● 50g seco' : '● 50g bagaço') : 'vazio'}
    </text>
    <text x={40} y={89} textAnchor="middle" fontSize="5" fill="#4b5563" fontFamily="monospace">
      Cesto Spencer
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const UmidadeBagaco = () => {
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
  const [cestoNaBalanca,  setCestoNaBalanca]  = useState(false);
  const [tarandoPeso,     setTarandoPeso]     = useState(false);
  const [balancaTarada,   setBalancaTarada]   = useState(false);
  const [pesandoBagaco,   setPesandoBagaco]   = useState(false);
  const [bagacoPesado,    setBagacoPesado]    = useState(false);
  const [registrandoP1,   setRegistrandoP1]  = useState(false);
  const [p1Registrado,    setP1Registrado]   = useState(false);
  const [registrandoP2,   setRegistrandoP2]  = useState(false);
  const [p2Registrado,    setP2Registrado]   = useState(false);

  // ── Estufa ───────────────────────────────────────────────
  const [estufaLigada,    setEstufaLigada]   = useState(false);
  const [temperatura,     setTemperatura]    = useState(0);
  const [cestoNaEstufa,   setCestoNaEstufa]  = useState(false);
  const [secando,         setSecando]        = useState(false);
  const [tempoSecagem,    setTempoSecagem]   = useState(30);
  const [secagemPronta,   setSecagemPronta]  = useState(false);

  // ── Cálculo ──────────────────────────────────────────────
  const [campoP1,         setCampoP1]        = useState('');
  const [campoP2,         setCampoP2]        = useState('');
  const [umidadeResultado,setUmidadeResultado]= useState(null);
  const [erroCalculo,     setErroCalculo]    = useState('');


  /* ── useEffects (nenhum setState síncrono no body) ────── */

  // Taragem: cesto sobe de 0 → 300 g
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

  // Pesagem bagaço: 0 → 50 g
  useEffect(() => {
    if (!pesandoBagaco) return;
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setPesoBal(Math.min(v, 50));
      if (v >= 50) {
        clearInterval(id);
        setPesandoBagaco(false);
        setBagacoPesado(true);
        setCestoNaBalanca(false);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 30);
    return () => clearInterval(id);
  }, [pesandoBagaco, celebrarAcerto, proximaEtapa]);

  // Registro P1: cesto + bagaço úmido → 350 g
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

  // Aquecimento estufa: 0 → 105 °C (~1 s)
  useEffect(() => {
    if (!estufaLigada) return;
    let t = 0;
    const id = setInterval(() => {
      t += 5;
      setTemperatura(Math.min(t, 105));
      if (t >= 105) {
        clearInterval(id);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 50);
    return () => clearInterval(id);
  }, [estufaLigada, celebrarAcerto, proximaEtapa]);

  // Secagem: 30 → 0 minutos (200 ms por minuto simulado = 6 s total)
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

  // Registro P2: cesto + bagaço seco → 325 g
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


  /* ── Helpers de etapa ──────────────────────────────────── */
  const isItem  = (id) => etapas[etapaAtual]?.itemNecessario === id;
  const isAlvo  = (id) => etapas[etapaAtual]?.alvo === id;
  const itemCls = (id) => isItem(id) ? 'pulse-item' : '';
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';


  /* ── Drag handlers ─────────────────────────────────────── */
  const handleDragStart = (id) => setItemSegurado(id);
  const handleDragEnd   = ()   => setItemSegurado(null);
  const handleDragOver  = (e)  => e.preventDefault();


  /* ── Drop handler ──────────────────────────────────────── */
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

    // Etapa 2: bagaço → balança (pesar 50 g)
    if (etapaAtual === 2) {
      setCestoNaBalanca(true);
      setPesandoBagaco(true);
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


  /* ── Click: TARAR balança (etapa 1) ────────────────────── */
  const handleTarar = () => {
    if (etapaAtual !== 1 || !cestoNaBalanca) return;
    setPesoBal(0);
    setBalancaTarada(true);
    // cesto permanece na balança — sai apenas ao terminar pesagem do bagaço (etapa 2)
    celebrarAcerto(100);
    proximaEtapa();
  };


  /* ── Click: ligar estufa (etapa 4) ─────────────────────── */
  const handleClicarEstufa = () => {
    if (etapaAtual !== 4 || estufaLigada) return;
    setEstufaLigada(true);
  };


  /* ── Cálculo da Umidade ─────────────────────────────────── */
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
      setErroCalculo('P1 deve ser maior que P2 (amostra perde massa ao secar).');
      return;
    }

    const resultado = (P1 - P2) * 2;

    if (!isFinite(resultado) || isNaN(resultado) || resultado < 0) {
      setErroCalculo('Resultado inválido — verifique os valores.');
      return;
    }

    setUmidadeResultado(resultado);
  };


  /* ── Draggability helpers ───────────────────────────────── */
  const cestoArrastavel =
    (etapaAtual === 0 && !cestoNaBalanca && !tarandoPeso) ||
    (etapaAtual === 3 && bagacoPesado && !cestoNaBalanca && !registrandoP1) ||
    (etapaAtual === 5 && !cestoNaEstufa && temperatura >= 105) ||
    (etapaAtual === 6 && secagemPronta && !cestoNaBalanca && !registrandoP2);

  const bagacoArrastavel = etapaAtual === 2 && !pesandoBagaco && !bagacoPesado;

  // "Fase" atual da balança para display
  const faseBalanca = tarandoPeso   ? 'tarar' :
                      pesandoBagaco ? 'pesar' :
                      registrandoP1 ? 'p1'    :
                      registrandoP2 ? 'p2'    : null;

  // Cesto em uso em outro local (mostrar como ghost)
  const cestoNaBalancaAtivo = cestoNaBalanca || tarandoPeso || pesandoBagaco || registrandoP1 || registrandoP2;
  const cestoEmUso = cestoNaBalancaAtivo || cestoNaEstufa || secando;

  // Bagaço no cesto: após pesar e antes de registrar P2 final
  const cestoComBagaco = bagacoPesado;
  const cestoComBagacoSeco = secagemPronta;

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
      <style>{UB_CSS}</style>

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
                ? `🔥 Secagem em andamento — ${String(tempoSecagem).padStart(2,'0')}:00 restantes · 105 °C`
                : `🌡 Aquecendo — ${Math.round(temperatura)} °C / 105 °C`}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 16, overflowY: 'auto' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #22d3ee', borderRadius: 22, padding: '28px 34px', textAlign: 'center', color: 'white', maxWidth: 560, width: '100%', boxShadow: '0 0 42px rgba(34,211,238,0.22)' }}>

            <div style={{ fontSize: 48 }}>💧</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#22d3ee', margin: '8px 0 4px' }}>Simulação Concluída!</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Insira os valores para calcular a Umidade do Bagaço</p>

            {/* Fórmula */}
            <div style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.22)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: '#67e8f9', fontWeight: 700, marginBottom: 6 }}>Fórmula — Umidade do Bagaço (CONSECANA)</div>
              <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#e2e8f0', lineHeight: 2 }}>
                Ub (%) = <span style={{ color: '#86efac' }}>( P1 − P2 )</span> × <span style={{ color: '#fbbf24' }}>2</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
                P1 = peso inicial (cesto + amostra úmida) · P2 = peso final (cesto + amostra seca)
              </div>
            </div>

            {/* Campos P1 e P2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {[
                { label: 'P1 — Peso Inicial (g)', value: campoP1, set: setCampoP1, placeholder: 'ex: 350' },
                { label: 'P2 — Peso Final (g)',   value: campoP2, set: setCampoP2, placeholder: 'ex: 325' },
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
              💧 Calcular Umidade
            </button>

            {/* Resultado */}
            {umidadeResultado !== null && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.30)', borderRadius: 16, padding: '18px 22px', marginTop: 4, animation: 'ubFadeIn 0.3s ease' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Umidade do Bagaço (Ub)</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#86efac', fontFamily: 'monospace', lineHeight: 1 }}>
                  {umidadeResultado.toFixed(2)}%
                </div>
                <div style={{ fontSize: 11, marginTop: 10, fontWeight: 700,
                  color: umidadeResultado < 45 ? '#fbbf24' : umidadeResultado <= 55 ? '#34d399' : '#f87171' }}>
                  {umidadeResultado < 45
                    ? '⚠️ Umidade baixa · Bagaço muito seco'
                    : umidadeResultado <= 55
                    ? '✓ Umidade dentro do padrão CONSECANA (45–55%)'
                    : '🔴 Umidade elevada · Reduz eficiência energética'}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>faixa ideal: 45–55% (CONSECANA)</div>
              </div>
            )}

            {/* Pontuação + Recomeçar */}
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
        titulo="Umidade do Bagaço"
        subtitulo={"Determinação de Umidade do Bagaço de Cana\nMétodo Estufa Spencer 105 °C · CONSECANA"}
        icone="💧"
        badges={['🍬 CALDOS', '💧 UMIDADE']}
        footerLabel="💧 Umidade Bagaço"
      >
        {/* ── CARD BANCADA (madeira) ── */}
        <div style={{
          background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)',
          borderRadius: 26, padding: '22px 18px',
          border: '8px solid #8b6e45',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 760,
        }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            💧 Bancada — Determinação de Umidade do Bagaço · Estufa Spencer 105 °C / 30 min · CONSECANA
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
                  <BalancaUBSVG
                    pesoBal={pesoBal}
                    cestoNaBalanca={cestoNaBalancaAtivo}
                    tarandoPeso={tarandoPeso}
                    balancaTarada={balancaTarada}
                    bagacoPesado={bagacoPesado}
                    fase={faseBalanca}
                  />
                </div>

                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Balança de Precisão</span>

                {/* Indicadores de fase */}
                {tarandoPeso && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(0)} g</span>}
                {pesandoBagaco && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(1)} g</span>}
                {bagacoPesado && !registrandoP1 && !p1Registrado && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ 50 g pesados</span>}
                {registrandoP1 && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(0)} g</span>}
                {p1Registrado && !registrandoP2 && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ P1 = {P1_SIM} g</span>}
                {registrandoP2 && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚖️ {pesoBal.toFixed(0)} g</span>}
                {p2Registrado && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ P2 = {P2_SIM} g</span>}

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
                  style={{
                    background: 'rgba(0,0,0,0.20)', borderRadius: 14, padding: '6px 8px',
                    cursor: estufaClicavel ? 'pointer' : 'default',
                  }}
                  onDrop={e => handleDrop('estufa', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onClick={handleClicarEstufa}
                >
                  <EstufaSpencerSVG
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
                  /* Ghost: cesto está sendo usado em outro local */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.18 }}>
                    <CestoSVG comBagaco={cestoComBagaco} seco={cestoComBagacoSeco} />
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
                    <CestoSVG comBagaco={cestoComBagaco} seco={cestoComBagacoSeco} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {cestoArrastavel ? '🖱️ ' : ''}Cesto da Estufa
                    </span>
                    <span style={{ fontSize: 8, color: cestoComBagaco ? (cestoComBagacoSeco ? '#fbbf24' : '#d4a030') : '#94a3b8' }}>
                      {cestoComBagacoSeco ? '● bagaço seco (P2)' : cestoComBagaco ? '● 50 g bagaço (P1)' : 'vazio · tara 300 g'}
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
                      {/* Sombra */}
                      <ellipse cx={30} cy={73} rx={22} ry={3} fill="rgba(0,0,0,0.18)" />
                      {/* Bandeja */}
                      <rect x={6} y={52} width={48} height={18} rx="4" fill="#3a2008" stroke="#261404" strokeWidth="1.2" />
                      <rect x={7} y={53} width={46} height={16} rx="3" fill="#5a3010" />
                      {/* Corpo da pilha */}
                      <path d="M 7,52 Q 5,36 9,24 Q 15,12 30,10 Q 45,12 51,24 Q 55,36 53,52 Z" fill="#8a5c18" />
                      <path d="M 9,52 Q 8,38 11,26 Q 17,14 30,12 Q 43,14 49,26 Q 52,38 51,52 Z" fill="#9a6820" />
                      {/* Fibras camada inferior */}
                      {[[10,49,21,47],[18,50,30,48],[26,48,38,50],[34,49,45,47]].map(([x1,y1,x2,y2],i) => (
                        <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4a030" strokeWidth="1.8" strokeLinecap="round" />
                      ))}
                      {/* Fibras camada média */}
                      {[[10,40,23,36],[16,37,26,41],[22,38,34,34],[28,36,40,40],[34,38,46,34]].map(([x1,y1,x2,y2],i) => (
                        <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c08828" strokeWidth="1.6" strokeLinecap="round" />
                      ))}
                      {/* Fibras topo */}
                      {[[12,28,20,22],[18,25,28,29],[24,22,34,18],[30,20,40,24],[36,22,46,18]].map(([x1,y1,x2,y2],i) => (
                        <line key={`u${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8c868" strokeWidth="1.4" strokeLinecap="round" />
                      ))}
                      {/* Labels bandeja */}
                      <text x={30} y={62} textAnchor="middle" fontSize="6.5" fill="#fde68a" fontFamily="monospace" fontWeight="700">BAGAÇO</text>
                      <text x={30} y={68} textAnchor="middle" fontSize="5.5" fill="#fbbf24" fontFamily="monospace">50 g · homog.</text>
                    </svg>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: bagacoPesado ? '#34d399' : '#e7e5e4' }}>
                    {bagacoArrastavel ? '🖱️ ' : ''}Amostra de Bagaço
                  </span>
                  <span style={{ fontSize: 7, color: bagacoPesado ? '#34d399' : '#94a3b8' }}>
                    {bagacoPesado ? '✓ Pesada' : 'homogeneizada · 50 g'}
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

export default UmidadeBagaco;
