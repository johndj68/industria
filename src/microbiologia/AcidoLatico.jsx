/**
 * AcidoLatico.jsx — Determinação de Ácido Lático
 *
 * Simulador de bancada microbiológica com 9 etapas interativas:
 *   Amostra → Tubo de ensaio → Centrífuga → Sobrenadante
 *   → Fita de determinação → Leitor → Resultado (ppm)
 *
 * Método: Fita de determinação + Leitor · Fator de multiplicação 90
 * Resultado: Ácido Lático (ppm) = Leitura do aparelho × 90
 * Fonte: ATV-OPE-GQI-PR-002 — Página 182
 *
 * Usa LayoutSimulador (painel lateral compartilhado).
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import MicropipetaSVG from '../components/lab/MicropipetaSVG';
import RackPonteiras from '../components/lab/RackPonteiras';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { usePipeta } from '../hooks/usePipeta';
import { useSimuladorDragAcidoLatico } from '../hooks/useSimuladorDragAcidoLatico';
import { etapas } from './data/etapasAcidoLatico';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const AL_CSS = `
  @keyframes centrifugarRotar {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes alFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes alGotaCai {
    0%   { opacity: 0; transform: translateY(0); }
    10%  { opacity: 1; }
    80%  { opacity: 1; transform: translateY(32px); }
    100% { opacity: 0; transform: translateY(40px); }
  }
`;


/* ═══════════════════════════════════════════════════════════
   SVG — TUBO DE ENSAIO (estado amostra / centrifugado)
═══════════════════════════════════════════════════════════ */
const TuboAcidoLaticoSVG = ({ estado = 'vazio', id = 'al' }) => {
  const CX = 34, tW = 20, bW = 8, tY = 28, bY = 138;
  const fp = `M ${CX-tW},${tY} L ${CX+tW},${tY} L ${CX+bW},${bY} A ${bW},${bW},0,0,1,${CX-bW},${bY} Z`;
  const liquidH = bY - tY;

  return (
    <svg width="68" height="158" viewBox="0 0 68 158">
      <defs>
        <clipPath id={`alTubo${id}`}><path d={fp} /></clipPath>
        <linearGradient id={`alGlass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,230,255,0.48)" />
          <stop offset="20%"  stopColor="rgba(210,235,255,0.12)" />
          <stop offset="78%"  stopColor="rgba(210,235,255,0.06)" />
          <stop offset="100%" stopColor="rgba(185,225,255,0.36)" />
        </linearGradient>
      </defs>

      <ellipse cx={CX} cy={152} rx={14} ry={4} fill="rgba(0,0,0,0.14)" />

      {/* Líquido */}
      <g clipPath={`url(#alTubo${id})`}>
        {estado === 'amostra' && (
          <rect x={10} y={tY} width={48} height={liquidH}
            fill="rgba(200,150,50,0.68)" />
        )}
        {estado === 'centrifugado' && (
          <>
            {/* Sobrenadante claro — parte superior ~58% */}
            <rect x={10} y={tY} width={48} height={liquidH * 0.58}
              fill="rgba(230,215,180,0.58)" />
            {/* Precipitado escuro — parte inferior ~42% */}
            <rect x={10} y={tY + liquidH * 0.58} width={48} height={liquidH * 0.42}
              fill="rgba(150,90,25,0.82)" />
            {/* Linha de separação */}
            <line x1={12} y1={tY + liquidH * 0.58} x2={CX * 2 - 14} y2={tY + liquidH * 0.58}
              stroke="rgba(180,140,50,0.55)" strokeWidth="1.2" />
          </>
        )}
      </g>

      {/* Vidro */}
      <path d={fp} fill={`url(#alGlass${id})`} stroke="#8ac4dc" strokeWidth="1.8" />

      {/* Boca do tubo */}
      <ellipse cx={CX} cy={tY} rx={tW+2} ry={4}
        fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* Reflexo esquerdo */}
      <line x1={CX-tW+3} y1={tY+6} x2={CX-bW+1} y2={bY-10}
        stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeLinecap="round" />

      {/* Rótulos camadas centrifugadas */}
      {estado === 'centrifugado' && (
        <>
          <text x={CX+14} y={tY + liquidH * 0.28} fontSize="5.5"
            fill="rgba(210,190,140,0.85)" fontFamily="monospace">sobrend.</text>
          <text x={CX+14} y={tY + liquidH * 0.80} fontSize="5.5"
            fill="rgba(180,120,40,0.85)" fontFamily="monospace">precipit.</text>
        </>
      )}
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — CENTRÍFUGA DE BANCADA
═══════════════════════════════════════════════════════════ */
const CentrifugaSVG = ({ centrifugando = false, concluida = false, comTubo = false }) => (
  <svg width="175" height="155" viewBox="0 0 175 155">
    <defs>
      <linearGradient id="cfBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#4b5563" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
      <filter id="cfSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".35" /></filter>
    </defs>

    <ellipse cx={87} cy={150} rx={72} ry={6} fill="rgba(0,0,0,0.18)" />

    {/* Corpo principal */}
    <g filter="url(#cfSh)">
      <rect x={8} y={48} width={159} height={98} rx={10} fill="url(#cfBody)" stroke="#111827" strokeWidth="1.8" />
    </g>

    {/* Tampa arredondada */}
    <path d="M18,48 Q87,22 156,48" fill="url(#cfBody)" stroke="#111827" strokeWidth="1.8" />
    <path d="M18,48 Q87,34 156,48" fill="rgba(255,255,255,0.06)" />

    {/* Janela do rotor */}
    <ellipse cx={87} cy={52} rx={32} ry={15}
      fill="#0f172a" stroke="#374151" strokeWidth="1.5" />
    <ellipse cx={87} cy={52} rx={29} ry={12}
      fill="#050d18" stroke="#1e3a5f" strokeWidth="0.8" />

    {/* Rotor (gira quando centrifugando) */}
    <g style={{
      animation: centrifugando ? 'centrifugarRotar 0.12s linear infinite' : 'none',
      transformOrigin: '87px 52px',
    }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const sx = 87 + 5 * Math.cos(rad);
        const sy = 52 + 5 * Math.sin(rad) * 0.45;
        const ex = 87 + 25 * Math.cos(rad);
        const ey = 52 + 25 * Math.sin(rad) * 0.45;
        return <line key={i} x1={sx} y1={sy} x2={ex} y2={ey}
          stroke={i % 2 === 0 ? '#6b7280' : '#374151'} strokeWidth="3.5" strokeLinecap="round" />;
      })}
      <circle cx={87} cy={52} r={7} fill="#4b5563" stroke="#6b7280" strokeWidth="1.2" />
    </g>

    {/* Tubo no compartimento */}
    {comTubo && (
      <g>
        <rect x={83} y={40} width={8} height={18} rx={2}
          fill="rgba(200,150,50,0.75)" stroke="rgba(140,195,225,0.55)" strokeWidth="0.9" />
      </g>
    )}

    {/* Painel de controle */}
    <rect x={16} y={72} width={143} height={62} rx={6}
      fill="#0f172a" stroke="#374151" strokeWidth="1.0" />

    {/* LCD display */}
    <rect x={20} y={76} width={100} height={38} rx={4}
      fill="#001428" stroke="#1e3a5f" strokeWidth="0.8" />
    <text x={70} y={88} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="monospace">
      STATUS
    </text>
    <text x={70} y={104} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700"
      fill={concluida ? '#22c55e' : centrifugando ? '#fbbf24' : '#3b82f6'}>
      {concluida ? 'CONCLUÍDO ✓' : centrifugando ? 'Centrifugando...' : 'STAND BY'}
    </text>

    {/* Botão power */}
    <circle cx={134} cy={95} r={13} fill="#374151" stroke="#111827" strokeWidth="1.5" />
    <circle cx={134} cy={95} r={9}
      fill={centrifugando || concluida ? '#22c55e' : '#4b5563'} />
    {(centrifugando || concluida) && (
      <circle cx={134} cy={95} r={13} fill="none" stroke="rgba(34,197,94,0.40)" strokeWidth="2">
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
      </circle>
    )}
    <text x={134} y={98.5} textAnchor="middle" fontSize="9" fill="white" fontFamily="monospace">⏻</text>

    {/* Knob velocidade */}
    <circle cx={156} cy={95} r={10} fill="#374151" stroke="#111827" strokeWidth="1.5" />
    <circle cx={156} cy={95} r={7}  fill="#4b5563" />
    <line x1={156} y1={95} x2={156} y2={89} stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
    <text x={156} y={108} textAnchor="middle" fontSize="5.5" fill="#6b7280" fontFamily="sans-serif">RPM</text>

    <text x={87} y={146} textAnchor="middle" fontSize="6.5" fill="#6b7280" fontFamily="monospace">
      Centrífuga de Bancada
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — FITA DE DETERMINAÇÃO DE ÁCIDO LÁTICO
═══════════════════════════════════════════════════════════ */
const FitaDeterminacaoSVG = ({ reagida = false, comGota = false }) => (
  <svg width="115" height="32" viewBox="0 0 115 32">
    <defs>
      <linearGradient id="fitaGlass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.92)" />
        <stop offset="100%" stopColor="rgba(240,240,230,0.92)" />
      </linearGradient>
    </defs>

    <ellipse cx={58} cy={30} rx={50} ry={3} fill="rgba(0,0,0,0.10)" />

    {/* Corpo da fita */}
    <rect x={2} y={4} width={111} height={20} rx={3}
      fill="url(#fitaGlass)" stroke="#a8a29e" strokeWidth="1.2" />

    {/* Zona de reação */}
    <rect x={6} y={7} width={22} height={14} rx={2.5}
      fill={reagida ? 'rgba(34,197,94,0.72)' : 'rgba(200,200,180,0.60)'}
      stroke={reagida ? '#16a34a' : '#d1d5db'} strokeWidth="1" />

    {reagida && (
      <text x={17} y={16.5} textAnchor="middle" fontSize="7.5" fill="white"
        fontFamily="monospace" fontWeight="700">✓</text>
    )}

    {/* Gota animada quando comGota */}
    {comGota && (
      <g style={{ animation: 'alGotaCai 0.85s ease-in forwards' }}>
        <circle cx={17} cy={1} r={3.5} fill="rgba(230,215,180,0.90)" />
      </g>
    )}

    {/* Área de leitura (hash pattern) */}
    {[0,1,2,3].map(i => (
      <line key={i} x1={34+i*6} y1={8} x2={34+i*6} y2={24}
        stroke="rgba(160,140,100,0.25)" strokeWidth="1" />
    ))}

    {/* Texto rótulo */}
    <text x={75} y={17} textAnchor="middle" fontSize="6.5" fill="#78716c"
      fontFamily="monospace">Ácido Lático</text>

    {/* Indicador de estado */}
    <rect x={95} y={8} width={14} height={8} rx={2}
      fill={reagida ? 'rgba(34,197,94,0.20)' : 'rgba(200,200,180,0.20)'}
      stroke={reagida ? '#22c55e' : '#d1d5db'} strokeWidth="0.8" />
    <text x={102} y={14.5} textAnchor="middle" fontSize="5.5"
      fill={reagida ? '#22c55e' : '#a8a29e'} fontFamily="monospace">
      {reagida ? 'OK' : '--'}
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — LEITOR DE ÁCIDO LÁTICO
═══════════════════════════════════════════════════════════ */
const LeitorAcidoLaticoSVG = ({
  fitaDentro  = false,
  lendo       = false,
  resultado   = null,
  ativo       = false,
}) => (
  <svg width="148" height="165" viewBox="0 0 148 165">
    <defs>
      <linearGradient id="lrBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#374151" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
      <linearGradient id="lrScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#001428" />
        <stop offset="100%" stopColor="#000a18" />
      </linearGradient>
      <filter id="lrSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".38" /></filter>
    </defs>

    <g filter="url(#lrSh)">
      <rect x={4} y={8} width={140} height={149} rx={10} fill="url(#lrBody)" stroke="#111827" strokeWidth="1.8" />
    </g>

    {/* Topo: slot para fita */}
    <rect x={4} y={8} width={140} height={16} rx={10} fill="rgba(255,255,255,0.05)" />
    <text x={74} y={19} textAnchor="middle" fontSize="7" fill="#60a5fa"
      fontFamily="monospace" fontWeight="700">LEITOR ÁCIDO LÁTICO</text>

    {/* Slot de inserção da fita */}
    <rect x={30} y={28} width={88} height={10} rx={3}
      fill="#0a1018" stroke={fitaDentro ? '#22c55e' : '#374151'} strokeWidth="1.2" />
    {fitaDentro ? (
      <>
        <rect x={32} y={30} width={84} height={6} rx={2}
          fill="rgba(240,230,180,0.70)" />
        <text x={74} y={36} textAnchor="middle" fontSize="5.5" fill="#22c55e"
          fontFamily="monospace">fita inserida ✓</text>
      </>
    ) : (
      <text x={74} y={36} textAnchor="middle" fontSize="5.5" fill="#374151"
        fontFamily="monospace">inserir fita →</text>
    )}

    {/* Display LCD */}
    <rect x={12} y={44} width={124} height={72} rx={5}
      fill="url(#lrScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x={14} y={46} width={120} height={68} rx={4}
      fill="rgba(0,30,60,0.40)" />

    {resultado !== null ? (
      <>
        <text x={74} y={62} textAnchor="middle" fontSize="6.5" fill="#2a6a9a"
          fontFamily="monospace">ÁCIDO LÁTICO · RESULTADO</text>
        <line x1={18} y1={66} x2={130} y2={66} stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />
        <text x={74} y={88} textAnchor="middle" fontSize="26"
          fill="#00ff88" fontFamily="monospace" fontWeight="700"
          style={{ animation: 'alFadeIn 0.4s ease forwards' }}>
          {resultado}
        </text>
        <text x={74} y={103} textAnchor="middle" fontSize="7" fill="#22c55e" fontFamily="monospace">
          ppm ácido lático
        </text>
      </>
    ) : lendo ? (
      <>
        <text x={74} y={70} textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="monospace">
          Lendo...
        </text>
        <rect x={22} y={78} width={104} height={5} rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x={22} y={78} width={0} height={5} rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="104" dur="3s" fill="freeze" />
        </rect>
        <text x={74} y={100} textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">
          analisando fita...
        </text>
      </>
    ) : fitaDentro ? (
      <>
        <text x={74} y={76} textAnchor="middle" fontSize="9" fill="#0ea5e9" fontFamily="monospace">PRONTO</text>
        <text x={74} y={90} textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="sans-serif">
          Fita inserida ✓
        </text>
        <text x={74} y={104} textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">
          Clique LER para iniciar
        </text>
      </>
    ) : (
      <>
        <text x={74} y={76} textAnchor="middle" fontSize="9" fill="#2a4060" fontFamily="monospace">STANDBY</text>
        <text x={74} y={92} textAnchor="middle" fontSize="7" fill="#1a3050" fontFamily="sans-serif">
          aguardando fita...
        </text>
      </>
    )}

    {/* Botões */}
    {['ON', 'LER', 'ZERO', 'MENU'].map((lbl, i) => {
      const isLer  = lbl === 'LER';
      const active = isLer && ativo;
      return (
        <g key={lbl}>
          <rect x={10 + i * 32} y={124} width={28} height={14} rx={4}
            fill={active ? '#0f2a48' : '#0f1e30'}
            stroke={active ? '#22d3ee' : '#1e3a5f'}
            strokeWidth={active ? 1.8 : 1} />
          <text x={24 + i * 32} y={133.5} textAnchor="middle" fontSize="5.5"
            fill={active ? '#22d3ee' : '#60a5fa'} fontFamily="monospace"
            fontWeight={active ? '700' : '400'}>{lbl}</text>
        </g>
      );
    })}

    {/* LED status */}
    <circle cx={126} cy={18} r={5}
      fill={resultado !== null ? '#22c55e' : lendo ? '#f59e0b' : fitaDentro ? '#3b82f6' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    {lendo && (
      <circle cx={126} cy={18} r={9} fill="none" stroke="rgba(245,158,11,0.38)" strokeWidth="2">
        <animate attributeName="r"       from="5" to="11" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0"  dur="0.9s" repeatCount="indefinite" />
      </circle>
    )}

    <text x={74} y={155} textAnchor="middle" fontSize="5.5" fill="#2a4060" fontFamily="sans-serif">
      Leitor · Ácido Lático (ppm)
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorAcidoLatico = () => {
  useDragOverlay();

  // ── Injeta CSS de animações ───────────────────────────
  useEffect(() => {
    const sid = 'acidolatico-css';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = AL_CSS;
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

  // ── Amostra ───────────────────────────────────────────
  const [nivelAmostra,    setNivelAmostra]    = useState(82);
  const [tipoAmostra,     setTipoAmostra]     = useState('Mosto');

  // ── Tubo de ensaio ────────────────────────────────────
  const [tuboComAmostra,  setTuboComAmostra]  = useState(false);
  const [, setCorTubo] = useState('rgba(200,150,50,0.68)');
  const [tuboNaCentrifuga,setTuboNaCentrifuga]= useState(false);
  const [tuboCentrifugado,setTuboCentrifugado]= useState(false);

  // ── Centrífuga ────────────────────────────────────────
  const [centrifugando,   setCentrifugando]   = useState(false);

  // ── Pipeta (reutiliza usePipeta do projeto) ───────────
  const {
    nivelPipeta, setNivelPipeta, corPipeta, setCorPipeta,
    pipetaCheia, setPipetaCheia, volumePipeta, setVolumePipeta,
    tipIdx, setTipIdx, tips, setTips,
  } = usePipeta();

  // ── Fita de determinação ──────────────────────────────
  const [gotaNaFita,      setGotaNaFita]      = useState(false);
  const [fitaReagida,     setFitaReagida]     = useState(false);
  const [fitaNoLeitor,    setFitaNoLeitor]    = useState(false);

  // ── Leitor ────────────────────────────────────────────
  const [leituraIniciada, setLeituraIniciada] = useState(false);
  const [resultadoAparelho, setResultadoAparelho] = useState(null);
  const [resultadoFinal,  setResultadoFinal]  = useState(null);

  // ── Pipeta: enchimento visual ─────────────────────────
  useEffect(() => {
    if (!pipetaCheia) return;
    let v = 0;
    const id = setInterval(() => {
      v += 8;
      setNivelPipeta(Math.min(v, 100));
      if (v >= 100) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [pipetaCheia]);

  // ── TIMER: centrifugação (step 2) ─────────────────────
  useEffect(() => {
    if (!centrifugando) return;
    const id = setTimeout(() => {
      setCentrifugando(false);
      setTuboNaCentrifuga(false);
      setTuboCentrifugado(true);
      celebrarAcerto(100);
      proximaEtapa();
    }, 4000);
    return () => clearTimeout(id);
  }, [centrifugando]);

  // ── TIMER: leitura (step 7) ───────────────────────────
  useEffect(() => {
    if (!leituraIniciada) return;
    const id = setTimeout(() => {
      const rawVal  = parseFloat((Math.random() * 3 + 1.5).toFixed(1));
      const finalVal = Math.round(rawVal * 90);
      setResultadoAparelho(rawVal);
      setResultadoFinal(finalVal);
      setLeituraIniciada(false);
      celebrarAcerto(200);
      proximaEtapa();
    }, 3500);
    return () => clearTimeout(id);
  }, [leituraIniciada]);

  // ── TIMER: auto-conclusão última etapa ───────────────
  useEffect(() => {
    if (etapaAtual !== 8) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragAcidoLatico(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra, setTuboComAmostra, setCorTubo,
    setTuboNaCentrifuga,
    tipIdx, pipetaCheia, setPipetaCheia, setNivelPipeta, setCorPipeta,
    setGotaNaFita, setFitaReagida,
    setFitaNoLeitor,
  });

  // ── Click centrífuga (step 2) ─────────────────────────
  const handleClickCentrifuga = () => {
    if (etapaAtual !== 2 || !tuboNaCentrifuga || centrifugando) return;
    setCentrifugando(true);
  };

  // ── Click rack ponteira (step 3) ─────────────────────
  const etapasPonteiraCorreta = { 3: 2 }; // P1000 na etapa 3
  const handlePickTip = (idx, col) => {
    if (tipIdx !== null) return;
    const colEsperada = etapasPonteiraCorreta[etapaAtual];
    if (colEsperada === undefined || col !== colEsperada) return;
    setTips(t => { const n = [...t]; n[idx] = false; return n; });
    setTipIdx(col);
    const vols = [20, 200, 1000];
    setVolumePipeta(vols[col]);
    celebrarAcerto();
    proximaEtapa();
  };

  // ── Click leitor (step 7) ─────────────────────────────
  const handleClickLeitor = () => {
    if (etapaAtual !== 7 || !fitaNoLeitor || leituraIniciada || resultadoAparelho !== null) return;
    setLeituraIniciada(true);
  };

  // ── Derivados ─────────────────────────────────────────
  const estadoTubo = tuboCentrifugado ? 'centrifugado' : tuboComAmostra ? 'amostra' : 'vazio';
  const tuboVisivel = !tuboNaCentrifuga;
  const leitorAtivo = etapaAtual === 7 && fitaNoLeitor && !leituraIniciada && resultadoAparelho === null;
  const nomeAmostra = tipoAmostra === 'Mosto' ? 'Amostra Mosto'
    : tipoAmostra === 'Vinho' ? 'Amostra Vinho' : 'Amostra Fermento';
  const nomeFormula = tipoAmostra === 'Mosto' ? 'ACMosto'
    : tipoAmostra === 'Vinho' ? 'AcVinho' : 'AcFerm';


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

      {/* ── BANNER CENTRIFUGAÇÃO ── */}
      {centrifugando && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9)', color: 'white', padding: '12px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>⚡ Centrifugando... separando sobrenadante</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultadoFinal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #22c55e', borderRadius: 24, padding: '48px 60px', textAlign: 'center', color: 'white', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🧪</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#22c55e', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Ácido Lático · {tipoAmostra}
            </p>

            {/* Dados */}
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#67e8f9', fontFamily: 'monospace' }}>{resultadoAparelho}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Leitura do aparelho</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>× 90</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Fator metodológico</div>
                </div>
              </div>
            </div>

            {/* Fórmula e Resultado */}
            <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 14, padding: '14px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                {nomeFormula} = {resultadoAparelho} × 90
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace', lineHeight: 1 }}>
                {resultadoFinal}
              </div>
              <div style={{ fontSize: 14, color: '#86efac', fontWeight: 700, marginTop: 4 }}>ppm ácido lático</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Fonte: ATV-OPE-GQI-PR-002 — Página 182
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#22c55e,#16a34a)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Ácido Lático"
        subtitulo={"Determinação de Ácido Lático\nFita + Leitor · Fator 90"}
        icone="🧫"
        badges={['🔬 MICROBIOLOGIA', '⚗️ ÁCIDO LÁTICO']}
        footerLabel="🧫 Ácido Lático"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 760 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🧫 Bancada — Determinação de Ácido Lático
          </h2>

          {/* Seletor de tipo de amostra */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#78716c', alignSelf: 'center' }}>Tipo:</span>
            {['Mosto', 'Vinho', 'Fermento'].map(tipo => (
              <button key={tipo} disabled={etapaAtual >= 1}
                onClick={() => setTipoAmostra(tipo)}
                style={{
                  background: tipoAmostra === tipo ? 'linear-gradient(90deg,#15803d,#16a34a)' : 'rgba(255,255,255,0.08)',
                  color: tipoAmostra === tipo ? 'white' : '#94a3b8',
                  border: tipoAmostra === tipo ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '5px 12px', fontSize: 9, fontWeight: 700,
                  cursor: etapaAtual >= 1 ? 'default' : 'pointer',
                }}>
                {tipo}
              </button>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA EQUIPAMENTOS ══════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* CENTRÍFUGA */}
              <ZonaDrop id="centrifuga" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={dropCls('centrifuga')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 13, padding: '8px 10px', cursor: etapaAtual === 2 && tuboNaCentrifuga && !centrifugando ? 'pointer' : 'default' }}
                  onClick={handleClickCentrifuga}
                >
                  <CentrifugaSVG
                    centrifugando={centrifugando}
                    concluida={tuboCentrifugado}
                    comTubo={tuboNaCentrifuga}
                  />
                  {etapaAtual === 2 && tuboNaCentrifuga && !centrifugando && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>
                      ⚡ Clique para centrifugar!
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Centrífuga</span>
                {centrifugando && <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700 }}>⚡ Centrifugando...</span>}
                {tuboCentrifugado && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Concluída</span>}
              </ZonaDrop>

              {/* LEITOR ÁCIDO LÁTICO */}
              <ZonaDrop id="leitor" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={dropCls('leitor')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 13, padding: '8px 10px', cursor: leitorAtivo ? 'pointer' : 'default' }}
                  onClick={handleClickLeitor}
                >
                  <LeitorAcidoLaticoSVG
                    fitaDentro={fitaNoLeitor}
                    lendo={leituraIniciada}
                    resultado={resultadoFinal}
                    ativo={leitorAtivo}
                  />
                  {leitorAtivo && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>
                      🟢 Clique LER para analisar!
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Leitor Ác. Lático</span>
                {resultadoFinal && (
                  <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ {resultadoFinal} ppm</span>
                )}
              </ZonaDrop>

            </div>{/* fim zona equipamentos */}

            {/* ══ ZONA VIDRARIA + FERRAMENTAS ════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, alignItems: 'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(200,150,50,0.82)" label="Amostra" sub={tipoAmostra} nivel={nivelAmostra} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ {nomeAmostra}</span>
                </ItemBancada>
              </div>

              {/* TUBO DE ENSAIO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="tubo" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('tubo')} ${dropCls('tubo')}`}
                    style={{ opacity: tuboVisivel ? 1 : 0.14, transition: 'opacity 0.3s' }}
                    draggable={isItem('tubo') && tuboVisivel}
                    onDragStart={e => handleDragStart('tubo', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <TuboAcidoLaticoSVG estado={estadoTubo} id="main" />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('tubo') ? '🖱️ ' : ''}Tubo de Ensaio
                  </span>
                  <span style={{ fontSize: 8, color: tuboCentrifugado ? '#22c55e' : tuboNaCentrifuga ? '#f59e0b' : tuboComAmostra ? '#60a5fa' : '#94a3b8' }}>
                    {tuboCentrifugado ? '✓ Centrifugado' : tuboNaCentrifuga ? '⚡ Na centrífuga' : tuboComAmostra ? '💧 Com amostra' : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* MICROPIPETA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('pipeta')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={isItem('pipeta')}
                  onDragStart={e => handleDragStart('pipeta', e)}
                  onDragEnd={handleDragEnd}
                >
                  <MicropipetaSVG nivel={nivelPipeta} corLiq={corPipeta} volume={volumePipeta} tipMounted={tipIdx} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Micropipeta</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: pipetaCheia ? '#34d399' : tipIdx !== null ? '#fbbf24' : '#f87171' }}>
                    {pipetaCheia ? '● Com sobrenadante' : tipIdx !== null ? 'P1000 acoplada' : 'Sem ponteira'}
                  </span>
                </div>
              </div>

              {/* RACK DE PONTEIRAS */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={isItem('rack') ? 'pulse-item' : ''}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 11, padding: 8 }}>
                    <RackPonteiras tips={tips} onTake={handlePickTip} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>Rack de Ponteiras</span>
                  {isItem('rack') && <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique P1000 (amarela)</span>}
                </div>
              </div>

              {/* FITA DE DETERMINAÇÃO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="fita" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('fita')} ${dropCls('fita')}`}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      opacity: fitaNoLeitor ? 0.18 : 1, transition: 'opacity 0.3s',
                      position: 'relative',
                    }}
                    draggable={isItem('fita') && !fitaNoLeitor}
                    onDragStart={e => handleDragStart('fita', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <FitaDeterminacaoSVG reagida={fitaReagida} comGota={gotaNaFita} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: fitaNoLeitor ? '#57534e' : '#e7e5e4' }}>
                    {isItem('fita') ? '🖱️ ' : ''}Fita Determinação
                  </span>
                  <span style={{ fontSize: 8, color: fitaNoLeitor ? '#57534e' : fitaReagida ? '#22c55e' : '#94a3b8', fontWeight: 700 }}>
                    {fitaNoLeitor ? '↑ No leitor' : fitaReagida ? '✓ Reagida' : 'Aguardando gota'}
                  </span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona vidraria */}

          </div>
        </div>
      </LayoutSimulador>
    </div>
  );
};

export default SimuladorAcidoLatico;
