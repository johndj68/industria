/**
 * ArtMosto.jsx — Determinação de ART no Mosto e Caldos
 *
 * Açúcares Redutores Totais · Lane-Eynon / Redutec · Determinador TE-088
 * Fluxo: Filtração → Pesagem 50 g → Balão 200 mL → Diluição → Micro-ondas
 *        → HCl 65°C → NaOH → EDTA → TE-088 Fehling → Titulação → Viragem
 *
 * Usa LayoutSimulador e TE088SVG do projeto.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import BequerSVG from '../components/lab/BequerSVG';
import PipetaLabSVG from '../components/lab/PipetaLabSVG';
import MicroondasArrtSVG from '../components/lab/MicroondasArrtSVG';
import TE088SVG from '../components/lab/TE088SVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragArtMosto } from '../hooks/useSimuladorDragArtMosto';
import { etapas } from './data/etapasArtMosto';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ARTM_CSS = `
  @keyframes artmDropFall {
    0%   { opacity: 0; transform: translateY(0); }
    8%   { opacity: 1; transform: translateY(3px); }
    78%  { opacity: 1; transform: translateY(50px); }
    100% { opacity: 0; transform: translateY(60px); }
  }
  @keyframes artmFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes artmThermRise {
    0%   { height: 0px; }
    100% { height: 70px; }
  }
`;


/* ═══════════════════════════════════════════════════════════
   SVG — BALÃO VOLUMÉTRICO 200 mL
═══════════════════════════════════════════════════════════ */
const BalaoVolumetrico200SVG = ({
  nivel = 0,
  cor   = 'rgba(140,210,245,0.68)',
  id    = 'b200',
}) => {
  const CX = 46;
  const fp = `M 42,6 L 50,6 L 50,58 Q 62,70 79,92 A 29,29,0,0,1,13,92 Q 30,70 42,58 Z`;
  const bodyBottom = 121;
  const calibY     = 24;
  const liqRange   = bodyBottom - calibY;
  const liqY       = bodyBottom - (nivel / 100) * liqRange;

  return (
    <svg width="94" height="140" viewBox="0 0 94 140">
      <defs>
        <clipPath id={`b200Clip${id}`}><path d={fp} /></clipPath>
        <linearGradient id={`b200Glass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.52)" />
          <stop offset="20%"  stopColor="rgba(215,238,255,0.14)" />
          <stop offset="72%"  stopColor="rgba(210,235,255,0.07)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.40)" />
        </linearGradient>
      </defs>

      <ellipse cx={CX} cy={133} rx={26} ry={5} fill="rgba(0,0,0,0.15)" />

      {/* Líquido */}
      <g clipPath={`url(#b200Clip${id})`}>
        {nivel > 0 && (
          <>
            <rect x={10} y={liqY} width={68} height={bodyBottom - liqY + 2} fill={cor} />
            <rect x={32} y={liqY} width={18} height={2.5} rx="1.2" fill="rgba(255,255,255,0.22)" />
          </>
        )}
      </g>

      {/* Vidro */}
      <path d={fp} fill={`url(#b200Glass${id})`} stroke="#8ac4dc" strokeWidth="1.8" />

      {/* Reflexo */}
      <line x1="42.5" y1="9" x2="42.5" y2="55"
        stroke="rgba(255,255,255,0.40)" strokeWidth="2" strokeLinecap="round" />

      {/* Abertura */}
      <ellipse cx={CX} cy="6" rx="8" ry="3"
        fill="rgba(185,228,255,0.40)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* Calibração */}
      <line x1="36" y1={calibY} x2="56" y2={calibY}
        stroke="rgba(6,32,85,0.75)" strokeWidth="1.4" />
      <text x="60" y={calibY + 3.5} fontSize="5.5" fill="rgba(6,32,85,0.55)"
        fontFamily="monospace">200mL</text>

      {/* Rótulo */}
      <rect x="22" y="100" width="48" height="12" rx="2"
        fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
      <text x={CX} y="109" textAnchor="middle" fontSize="6.5"
        fill="#0d2137" fontFamily="monospace" fontWeight="700">200 mL</text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — BALANÇA DE PRECISÃO
═══════════════════════════════════════════════════════════ */
const BalancaSVG = ({ peso = 0, zerada = false, comBalao = false, pesando = false }) => (
  <svg width="148" height="138" viewBox="0 0 148 138">
    <defs>
      <linearGradient id="balBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#5a5e6a" />
        <stop offset="100%" stopColor="#3a3d46" />
      </linearGradient>
    </defs>

    <ellipse cx={74} cy={133} rx={60} ry={5} fill="rgba(0,0,0,0.18)" />

    {/* Plataforma/prato */}
    <ellipse cx={74} cy={58} rx={52} ry={8}
      fill="rgba(200,200,210,0.85)" stroke="#9ca3af" strokeWidth="1.5" />
    <ellipse cx={74} cy={57} rx={50} ry={6}
      fill="rgba(220,220,230,0.92)" stroke="#9ca3af" strokeWidth="0.8" />

    {/* Balão 200 mL — renderizado DEPOIS do prato para aparecer em cima */}
    {comBalao && (
      <g transform="translate(74, 48)">
        {/* Ombro + Corpo (base toca a borda superior do prato) */}
        <path d="M -6,-18 Q -8,-8 -24,2 A 24,24,0,0,0,24,2 Q 8,-8 6,-18 Z"
          fill="rgba(185,228,255,0.55)" stroke="#8ac4dc" strokeWidth="1.3" />
        {/* Líquido (sobe conforme peso) */}
        {pesando && peso > 0 && (
          <ellipse cx="0" cy="2" rx={Math.min(22, peso/2.5+4)} ry={Math.min(10, peso/6+2)}
            fill="rgba(210,175,75,0.65)" />
        )}
        {/* Rótulo no corpo */}
        <rect x="-14" y="-8" width="28" height="10" rx="2" fill="rgba(255,255,255,0.88)" />
        <text x="0" y="-1" textAnchor="middle" fontSize="6" fill="#0d2137" fontFamily="monospace" fontWeight="700">200 mL</text>
        {/* Gargalo */}
        <rect x="-6" y="-46" width="12" height="30" rx="2"
          fill="rgba(185,228,255,0.55)" stroke="#8ac4dc" strokeWidth="1.3" />
        {/* Abertura */}
        <ellipse cx="0" cy="-46" rx="7.5" ry="3"
          fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.1" />
        {/* Reflexo */}
        <line x1="-5" y1="-44" x2="-5" y2="-20"
          stroke="rgba(255,255,255,0.40)" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    )}

    {/* Coluna/suporte */}
    <rect x={65} y={60} width={18} height={15} rx="2"
      fill="url(#balBody)" stroke="#374151" strokeWidth="1.2" />

    {/* Corpo */}
    <rect x={10} y={72} width={128} height={52} rx="6"
      fill="url(#balBody)" stroke="#374151" strokeWidth="1.5" />

    {/* Painel LCD */}
    <rect x={16} y={77} width={80} height={38} rx="4"
      fill="#0a1018" stroke="#22d3ee" strokeWidth="1.0" />
    <rect x={18} y={79} width={76} height={34} rx="3"
      fill="rgba(0,40,80,0.40)" />

    {/* Texto display */}
    {pesando ? (
      <>
        <text x={56} y={91} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">PESANDO</text>
        <text x={56} y={107} textAnchor="middle" fontSize="16" fill="#00ff88" fontFamily="monospace" fontWeight="700">
          {peso.toFixed(1)} g
        </text>
      </>
    ) : zerada ? (
      <>
        <text x={56} y={91} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">TARADO</text>
        <text x={56} y={107} textAnchor="middle" fontSize="16" fill="#22d3ee" fontFamily="monospace" fontWeight="700">
          0,0 g
        </text>
      </>
    ) : comBalao ? (
      <>
        <text x={56} y={93} textAnchor="middle" fontSize="7.5" fill="#0ea5e9" fontFamily="monospace">PRONTO</text>
        <text x={56} y={106} textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="sans-serif">Zerando...</text>
      </>
    ) : (
      <>
        <text x={56} y={93} textAnchor="middle" fontSize="7.5" fill="#3a5a6a" fontFamily="monospace">STANDBY</text>
        <text x={56} y={106} textAnchor="middle" fontSize="6.5" fill="#2a4060" fontFamily="sans-serif">aguardando balão</text>
      </>
    )}

    {/* Botão TARE */}
    <rect x={102} y={81} width={30} height={18} rx="4"
      fill={zerada ? '#052e16' : '#0f1e30'}
      stroke={zerada ? '#22c55e' : '#1e3a5f'}
      strokeWidth={zerada ? 1.8 : 1} />
    <text x={117} y={92.5} textAnchor="middle" fontSize="7.5" fontFamily="monospace"
      fill={zerada ? '#22c55e' : '#60a5fa'} fontWeight="700">TARE</text>

    {/* LED */}
    <circle cx={117} cy={108} r={5}
      fill={pesando ? '#f59e0b' : zerada ? '#22c55e' : comBalao ? '#3b82f6' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

    <text x={74} y={130} textAnchor="middle" fontSize="6" fill="#4a3e28" fontFamily="monospace">
      Balança de Precisão
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — TERMÔMETRO
═══════════════════════════════════════════════════════════ */
const TermometroSVG = ({ temperatura = 0, inserido = false }) => {
  const displayTemp = Math.round(temperatura * 0.65);
  const fillH = Math.min((temperatura / 100) * 72, 72);
  const fillY = 18 + (72 - fillH);

  return (
    <svg width="30" height="130" viewBox="0 0 30 130">
      <defs>
        <clipPath id="termClip">
          <rect x="11" y="18" width="8" height="72" rx="2" />
        </clipPath>
      </defs>

      <ellipse cx={15} cy={125} rx={12} ry={3} fill="rgba(0,0,0,0.14)" />

      {/* Bulbo */}
      <ellipse cx={15} cy={100} rx={9} ry={9}
        fill={temperatura > 60 ? 'rgba(220,30,30,0.90)' : 'rgba(220,30,30,0.75)'}
        stroke="#7f1d1d" strokeWidth="1.2" />
      <ellipse cx={15} cy={100} rx={6} ry={6} fill="rgba(255,60,60,0.85)" />

      {/* Tubo de vidro */}
      <rect x={11} y={14} width={8} height={82} rx="3"
        fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.3" />

      {/* Líquido */}
      <g clipPath="url(#termClip)">
        <rect x={12.5} y={fillY} width={5} height={fillH + 10}
          fill="rgba(220,30,30,0.82)" />
      </g>

      {/* Marcas de escala */}
      {[0,20,40,60].map(t => {
        const y = 18 + 72 - (t / 65) * 72;
        return (
          <g key={t}>
            <line x1={19} y1={y} x2={23} y2={y} stroke="rgba(6,32,85,0.55)" strokeWidth="0.8" />
            <text x={25} y={y + 3} fontSize="5.5" fill="rgba(6,32,85,0.55)" fontFamily="monospace">{t}</text>
          </g>
        );
      })}
      {/* Marca 65°C destacada */}
      <line x1={11} y1={18 + 72 - 72} x2={23} y2={18 + 72 - 72}
        stroke="rgba(239,68,68,0.80)" strokeWidth="1.2" />
      <text x={25} y={22} fontSize="5.5" fill="rgba(239,68,68,0.80)" fontFamily="monospace">65</text>

      {/* Tampa superior */}
      <ellipse cx={15} cy={14} rx={5} ry={2.5}
        fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.1" />

      {/* Display temperatura */}
      {inserido && (
        <>
          <rect x="0" y="0" width="30" height="12" rx="2"
            fill="rgba(0,0,0,0.55)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.7" />
          <text x={15} y={9} textAnchor="middle" fontSize="7" fill="#22d3ee"
            fontFamily="monospace" fontWeight="700">{displayTemp}°C</text>
        </>
      )}
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorArtMosto = () => {
  useDragOverlay();

  // ── Injeta CSS de animações ───────────────────────────
  useEffect(() => {
    const sid = 'artmosto-css';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ARTM_CSS;
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

  // ── Filtração ─────────────────────────────────────────
  const [funilAcoplado,    setFunilAcoplado]    = useState(false);
  const [algodaoNoFunil,   setAlgodaoNoFunil]   = useState(false);
  const [filtrando,        setFiltrando]        = useState(false);
  const [amostraFiltrada,  setAmostraFiltrada]  = useState(false);
  const [nivelBequer400,   setNivelBequer400]   = useState(0);

  // ── Balança ───────────────────────────────────────────
  const [balao200NaBalanca, setBalao200NaBalanca] = useState(false);
  const [balancaZerada,     setBalancaZerada]     = useState(false);
  const [pesando,           setPesando]           = useState(false);
  const [peso,              setPeso]              = useState(0);
  const [nivelBalao200,     setNivelBalao200]     = useState(0);
  const [balao200Completo,  setBalao200Completo]  = useState(false);

  // ── Pipeta ────────────────────────────────────────────
  const [pipetaCheia, setPipetaCheia] = useState(false);
  const [corPipeta,   setCorPipeta]   = useState('rgba(140,200,240,0.65)');

  // ── Balão 200 #2 ──────────────────────────────────────
  const [nivelBalao200Dois,   setNivelBalao200Dois]   = useState(0);
  const [corBalao200Dois,     setCorBalao200Dois]     = useState('rgba(220,235,255,0.06)');
  const [balao200DoisComAgua, setBalao200DoisComAgua] = useState(false);
  const [balao200DoisCompleto,setBalao200DoisCompleto]= useState(false);

  // ── Micro-ondas ───────────────────────────────────────
  const [balaoNoMicro, setBalaoNoMicro] = useState(false);
  const aquecendo = balaoNoMicro;

  // ── Termômetro ────────────────────────────────────────
  const [termometroInserido, setTermometroInserido] = useState(false);
  const [temperatura,        setTemperatura]        = useState(0);
  const [temp65Atingida,     setTemp65Atingida]     = useState(false);

  // ── Reações ───────────────────────────────────────────
  const [hclAdicionado,        setHclAdicionado]        = useState(false);
  const [fenolGotas,           setFenolGotas]           = useState(false);
  const [naohTitulando,        setNaohTitulando]        = useState(false);
  const [neutralizacaoConcluida,setNeutralizacaoConcluida]=useState(false);
  const [edtaAdicionado,       setEdtaAdicionado]       = useState(false);

  // ── TE-088 ────────────────────────────────────────────
  const [te088Ligado,          setTe088Ligado]          = useState(false);
  const [te088Aquecendo,       setTe088Aquecendo]       = useState(false);
  const [fervendo,             setFervendo]             = useState(false);
  const [te088Quente,          setTe088Quente]          = useState(false);
  const [fehlingAAdicionado,   setFehlingAAdicionado]   = useState(false);
  const [nivelCaldeira,        setNivelCaldeira]        = useState(0);
  const [corCaldeira,          setCorCaldeira]          = useState('#3b82f6');
  const [nivelBuretaTE,        setNivelBuretaTE]        = useState(0);
  const [corBuretaTE,          setCorBuretaTE]          = useState('#ffffff');
  const [buretaTE088Cheia,     setBuretaTE088Cheia]     = useState(false);
  const [posicaoGotasAzul,     setPosicaoGotasAzul]     = useState([]);
  const [gotejandoAzul,        setGotejandoAzul]        = useState(false);
  const [posicaoGotasBureta,   setPosicaoGotasBureta]   = useState([]);
  const [primeiraDescargaFeita,setPrimeiraDescargaFeita]= useState(false);
  const [primeiraDescargaAtiva,setPrimeiraDescargaAtiva]= useState(false);
  const [gotejandoBuretaFinal, setGotejandoBuretaFinal] = useState(false);
  const [viragemConcluida,     setViragemConcluida]     = useState(false);
  const [volumeGasto,          setVolumeGasto]          = useState(null);

  // ── finalizarAnalise (memoized como no ART original) ──
  const finalizarAnalise = useCallback(() => {
    if (viragemConcluida) return;
    const vol = parseFloat((Math.random() * 4 + 14).toFixed(1));
    setVolumeGasto(vol);
    setViragemConcluida(true);
    setFervendo(false); // para fervura ao atingir a viragem
    celebrarAcerto(300);
    proximaEtapa();
  }, [viragemConcluida, celebrarAcerto, proximaEtapa]);

  // ── TIMER: filtração (step 2) ─────────────────────────
  useEffect(() => {
    if (!filtrando) return;
    const id = setTimeout(() => {
      setFiltrando(false);
      setAmostraFiltrada(true);
      setFunilAcoplado(false);
      setNivelBequer400(65);
      celebrarAcerto();
      proximaEtapa();
    }, 3200);
    return () => clearTimeout(id);
  }, [filtrando]);

  // ── TIMER: step 4 auto-avança (tarar acontece no step 3) ──────────
  useEffect(() => {
    if (etapaAtual !== 4) return;
    const id = setTimeout(() => { celebrarAcerto(); proximaEtapa(); }, 700);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── TIMER: pesagem — dispara quando béquer é arrastado (step 5) ───
  useEffect(() => {
    if (!pesando) return;
    let p = 0;
    const id = setInterval(() => {
      p += 1;
      setPeso(p);
      setNivelBalao200(Math.min(p * 1.1, 55));
      if (p >= 50) {
        clearInterval(id);
        setPesando(false);
        setBalao200NaBalanca(false);
        setBalancaZerada(false);
        celebrarAcerto(100);
        proximaEtapa();
      }
    }, 80);
    return () => clearInterval(id);
  }, [pesando]);

  // ── TIMER: micro-ondas (step 10) ──────────────────────
  useEffect(() => {
    if (!balaoNoMicro) return;
    const id = setTimeout(() => {
      setBalaoNoMicro(false);
      celebrarAcerto(100);
      proximaEtapa();
    }, 4000);
    return () => clearTimeout(id);
  }, [balaoNoMicro]);

  // ── TIMER: termômetro → 65 °C (step 11) ───────────────
  useEffect(() => {
    if (!termometroInserido) return;
    let t = 0;
    const id = setInterval(() => {
      t += 4;
      setTemperatura(Math.min(t, 100));
      if (t >= 100) {
        clearInterval(id);
        setTemp65Atingida(true);
        setTimeout(() => {
          setTermometroInserido(false); // retorna à posição inicial na bancada
          setTemperatura(0);
          celebrarAcerto(100);
          proximaEtapa();
        }, 600);
      }
    }, 80);
    return () => clearInterval(id);
  }, [termometroInserido]);

  // ── TIMER: fenolftaleína gotas (step 14) ───────────────
  useEffect(() => {
    if (!fenolGotas) return;
    const id = setTimeout(() => {
      setFenolGotas(false);
      setCorBalao200Dois('rgba(202,162,60,0.62)'); // mantém cor após fenol
      celebrarAcerto();
      proximaEtapa();
    }, 2200);
    return () => clearTimeout(id);
  }, [fenolGotas]);

  // ── TIMER: NaOH — cor gradual + vibração (step 16) ───
  useEffect(() => {
    if (!naohTitulando) return;
    // Interpolação: âmbar → rosa escuro em 12 passos × 160ms = 1.92s
    const sR=202, sG=162, sB=60, sA=0.62;
    const eR=210, eG=52,  eB=88, eA=0.74;
    const STEPS = 12;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const p = step / STEPS;
      const r = Math.round(sR + (eR - sR) * p);
      const g = Math.round(sG + (eG - sG) * p);
      const b = Math.round(sB + (eB - sB) * p);
      const a = (sA + (eA - sA) * p).toFixed(2);
      setCorBalao200Dois(`rgba(${r},${g},${b},${a})`);
      if (step >= STEPS) {
        clearInterval(id);
        setNivelBalao200Dois(62);
        setNaohTitulando(false);
        setNeutralizacaoConcluida(true);
        celebrarAcerto();
        proximaEtapa();
      }
    }, 160);
    return () => clearInterval(id);
  }, [naohTitulando]);

  // ── TIMER: TE-088 ligando (step 20) ───────────────────
  useEffect(() => {
    if (!te088Aquecendo) return;
    setFervendo(true);
    const id = setTimeout(() => {
      setTe088Aquecendo(false);
      // fervendo permanece true até o fim da análise (viragemConcluida)
      setTe088Quente(true);
      celebrarAcerto();
      proximaEtapa();
    }, 3500);
    return () => clearTimeout(id);
  }, [te088Aquecendo]);

  // ── TIMER: primeira descarga bureta (step 24) ─────────
  useEffect(() => {
    if (!primeiraDescargaAtiva) return;
    let n = nivelBuretaTE;
    const target = 55;
    const id = setInterval(() => {
      n -= 2;
      setNivelBuretaTE(n);
      setPosicaoGotasBureta(prev => {
        const novas = [...prev];
        if (novas.length < 1) novas.push(200);
        const atualizadas = novas.map(y => y + 10);
        const yLiquido = 320 - nivelCaldeira;
        if (atualizadas.some(y => y >= yLiquido)) return [];
        return atualizadas;
      });
      if (n <= target) {
        clearInterval(id);
        setPrimeiraDescargaAtiva(false);
        setPrimeiraDescargaFeita(true);
        setPosicaoGotasBureta([]);
        setCorCaldeira('rgba(112,62,16,0.82)'); // marrom
        setNivelCaldeira(prev => Math.min(prev + 18, 55));
        celebrarAcerto(150);
        proximaEtapa();
      }
    }, 90);
    return () => clearInterval(id);
  }, [primeiraDescargaAtiva]);

  // ── TIMER: gotas azul metileno (step 25) ──────────────
  useEffect(() => {
    if (!gotejandoAzul) return;
    const intervalo = setInterval(() => {
      setPosicaoGotasAzul(prev => {
        const novas = [...prev];
        if (novas.length < 4) novas.push(230);
        return novas.map(y => y + 6);
      });
    }, 80);
    return () => clearInterval(intervalo);
  }, [gotejandoAzul]);

  // Gotas azuis absorvidas → avança etapa
  useEffect(() => {
    const yLiquido = 320 - nivelCaldeira;
    const absorvidas = posicaoGotasAzul.length === 4 &&
      posicaoGotasAzul.every(y => y >= yLiquido);
    if (absorvidas) {
      setGotejandoAzul(false);
      setPosicaoGotasAzul([]);
      setCorCaldeira('rgba(0,15,105,0.92)'); // azul escuro
      setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 400);
    }
  }, [posicaoGotasAzul, nivelCaldeira]);

  // ── TIMER: titulação final → viragem (step 26) ────────
  useEffect(() => {
    if (!gotejandoBuretaFinal) return;
    const id = setInterval(() => {
      setNivelBuretaTE(prev => {
        const novo = prev - 1;
        setPosicaoGotasBureta(prevG => {
          const novas = [...prevG];
          if (novas.length < 1) novas.push(200);
          const atualizadas = novas.map(y => y + 10);
          const yLiquido = 320 - nivelCaldeira;
          if (atualizadas.some(y => y >= yLiquido)) return [];
          return atualizadas;
        });
        if (novo <= 15) {
          clearInterval(id);
          setGotejandoBuretaFinal(false);
          setCorCaldeira('rgba(178,35,10,0.92)'); // vermelho tijolo
          setPosicaoGotasBureta([]);
          finalizarAnalise();
          return 15;
        }
        return novo;
      });
    }, 100);
    return () => clearInterval(id);
  }, [gotejandoBuretaFinal, finalizarAnalise, nivelCaldeira]);

  // ── TIMER: auto-conclusão última etapa ────────────────
  useEffect(() => {
    if (etapaAtual !== 27) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragArtMosto(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    funilAcoplado, setFunilAcoplado, setAlgodaoNoFunil, setFiltrando,
    setBalao200NaBalanca, setBalancaZerada, balancaZerada, setPesando,
    pipetaCheia, setPipetaCheia, setCorPipeta,
    setNivelBalao200, setBalao200Completo,
    setNivelBalao200Dois, setCorBalao200Dois,
    setBalao200DoisComAgua, setBalao200DoisCompleto,
    setBalaoNoMicro, setTermometroInserido,
    setHclAdicionado, setFenolGotas,
    setNaohTitulando, setEdtaAdicionado,
    fehlingAAdicionado, setFehlingAAdicionado, setFehlingBAdicionado: () => {},
    setNivelCaldeira, setCorCaldeira,
    setNivelBuretaTE, setCorBuretaTE, setBuretaTE088Cheia,
    setGotejandoAzul, setPosicaoGotasAzul,
  });

  // ── Click handlers ────────────────────────────────────
  const handleClickBalanca = () => {
    if (etapaAtual !== 4 || !balao200NaBalanca || balancaZerada) return;
    setBalancaZerada(true);
    celebrarAcerto();
    proximaEtapa();
  };

  const handleClickTE088 = () => {
    if (etapaAtual !== 20 || te088Ligado || te088Aquecendo) return;
    setTe088Aquecendo(true);
    setTe088Ligado(true);
  };

  const handleBuretaClick = () => {
    if (etapaAtual === 24 && buretaTE088Cheia && !primeiraDescargaFeita && !primeiraDescargaAtiva) {
      setPrimeiraDescargaAtiva(true);
    } else if (etapaAtual === 26 && primeiraDescargaFeita && !gotejandoBuretaFinal && !viragemConcluida) {
      setGotejandoBuretaFinal(true);
    }
  };

  // Derivados visuais
  const balao200DoisVis  = !balaoNoMicro;
  const buretaClicavel   = (etapaAtual === 24 && buretaTE088Cheia && !primeiraDescargaFeita)
                        || (etapaAtual === 26 && primeiraDescargaFeita && !viragemConcluida);


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

      {/* ── BANNERS DE PROCESSO ── */}
      {filtrando && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9)', color: 'white', padding: '12px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>🔍 Filtrando em Algodão...</div>
          </div>
        </div>
      )}
      {balaoNoMicro && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#78350f,#b45309,#f59e0b)', color: 'white', padding: '12px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>⚡ Aquecendo no Micro-ondas...</div>
          </div>
        </div>
      )}
      {viragemConcluida && etapaAtual === 27 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#dc2626)', color: 'white', padding: '12px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>🟥 Viragem para Vermelho Tijolo!</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && volumeGasto !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #ef4444', borderRadius: 24, padding: '48px 60px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>⚗️</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#f87171', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de ART no Mosto e Caldos · Lane-Eynon / Redutec
            </p>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Titulação</div>
              <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, fontWeight: 900, color: '#f87171', fontFamily: 'monospace', lineHeight: 1 }}>{volumeGasto}</div>
                  <div style={{ fontSize: 13, color: '#67e8f9', marginTop: 4 }}>mL gastos</div>
                </div>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
                  <div style={{ fontSize: 12, color: '#60a5fa' }}>Método: Lane-Eynon / Redutec</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Equipamento: TE-088</div>
                  <div style={{ fontSize: 11, color: '#f87171', fontWeight: 700 }}>🟥 Azul → Vermelho Tijolo</div>
                  <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>✓ Titulação finalizada</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Volume gasto anotado para cálculo do ART · Método Lane-Eynon
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#ef4444,#dc2626)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="ART — Mosto e Caldos"
        subtitulo={"Açúcares Redutores Totais\nLane-Eynon / Redutec · TE-088"}
        icone="⚗️"
        badges={['🍶 FERMENTAÇÃO', '🧪 LANE-EYNON']}
        footerLabel="⚗️ ART Mosto"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 820 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            ⚗️ Bancada — ART em Mosto e Caldos (Lane-Eynon / Redutec · TE-088)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA 1: EQUIPAMENTOS ════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* BALANÇA */}
              <ZonaDrop id="balanca" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={dropCls('balanca')}
                  style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', cursor: etapaAtual === 4 && balao200NaBalanca && !balancaZerada ? 'pointer' : 'default' }}
                  onClick={handleClickBalanca}
                >
                  <BalancaSVG peso={peso} zerada={balancaZerada} comBalao={balao200NaBalanca} pesando={pesando} />
                  {etapaAtual === 4 && balao200NaBalanca && !balancaZerada && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>🟢 Clique para tarar!</div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Balança Precisão</span>
                {pesando && <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700 }}>⚖️ {peso.toFixed(1)} g</span>}
                {peso >= 50 && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ 50,0 g</span>}
              </ZonaDrop>

              {/* MICRO-ONDAS */}
              <ZonaDrop id="microondas" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div className={dropCls('microondas')} style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px' }}>
                  <MicroondasArrtSVG aquecendo={aquecendo} bequerDentro={balaoNoMicro} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Micro-ondas</span>
                {aquecendo && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚡ Aquecendo...</span>}
              </ZonaDrop>

              {/* TE-088 — maior equipamento */}
              <ZonaDrop id="te088" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={dropCls('te088')}
                  style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 13, padding: '6px 8px', cursor: (etapaAtual === 20 && !te088Ligado) || buretaClicavel ? 'pointer' : 'default', width: 220, height: 260 }}
                  onClick={etapaAtual === 20 && !te088Ligado ? handleClickTE088 : handleBuretaClick}
                >
                  <TE088SVG
                    te088Aquecendo={te088Aquecendo}
                    te088Quente={te088Quente}
                    fervendo={fervendo}
                    nivelBuretaDireita={nivelBuretaTE}
                    corBuretaDireita={corBuretaTE}
                    nivelErlenmeyerTE={nivelCaldeira}
                    corErlenmeyerDireitoFinal={corCaldeira}
                    posicaoGotasAzul={posicaoGotasAzul}
                    posicaoGotasBureta={posicaoGotasBureta}
                    etapaAtual={buretaClicavel ? 21 : etapaAtual}
                    gotejandoBuretaDireita={gotejandoBuretaFinal || primeiraDescargaAtiva}
                    onBuretaClick={handleBuretaClick}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Determinador TE-088</span>
                {te088Ligado && !te088Aquecendo && (
                  <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Ligado · Em ebulição</span>
                )}
                {etapaAtual === 20 && !te088Ligado && (
                  <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique para ligar</span>
                )}
                {buretaClicavel && (
                  <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>↑ Clique na bureta</span>
                )}
                {viragemConcluida && (
                  <span style={{ fontSize: 8, color: '#f87171', fontWeight: 700 }}>🟥 Viragem: {volumeGasto} mL</span>
                )}
              </ZonaDrop>

            </div>{/* fim zona 1 */}

            {/* ══ ZONA 2: VIDRARIA PRINCIPAL ══════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, alignItems: 'flex-end', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* BÉQUER 400 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="bequer400" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('bequer400')} ${dropCls('bequer400')}`}
                    draggable={isItem('bequer400')}
                    onDragStart={e => handleDragStart('bequer400', e)} onDragEnd={handleDragEnd}>
                    <BequerSVG ml={400} nivel={nivelBequer400} cor="rgba(210,175,75,0.60)"
                      id="am400" funilAcoplado={funilAcoplado} algodaoVisible={algodaoNoFunil} filtrando={filtrando} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('bequer400') ? '🖱️ ' : ''}Béquer 400 mL
                  </span>
                  <span style={{ fontSize: 8, color: amostraFiltrada ? '#22c55e' : funilAcoplado ? '#fbbf24' : '#94a3b8' }}>
                    {amostraFiltrada ? '✓ Filtrado' : funilAcoplado ? algodaoNoFunil ? '🔍 Algodão' : '↑ Funil' : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* BALÃO 200 #1 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="balao200" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('balao200')} ${dropCls('balao200')}`}
                    style={{ opacity: balao200NaBalanca ? 0.14 : 1, transition: 'opacity 0.3s' }}
                    draggable={isItem('balao200') && !balao200NaBalanca}
                    onDragStart={e => handleDragStart('balao200', e)} onDragEnd={handleDragEnd}>
                    <BalaoVolumetrico200SVG nivel={nivelBalao200} cor="rgba(210,175,75,0.65)" id="v1" />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: balao200NaBalanca ? '#57534e' : '#e7e5e4' }}>
                    {isItem('balao200') && !balao200NaBalanca ? '🖱️ ' : ''}Balão 200 mL
                  </span>
                  <span style={{ fontSize: 8, color: balao200Completo ? '#22c55e' : nivelBalao200 > 0 ? '#60a5fa' : '#94a3b8' }}>
                    {balao200NaBalanca ? '↑ Na balança' : balao200Completo ? '✓ Completo' : nivelBalao200 > 0 ? `💧 ${Math.round(nivelBalao200)}%` : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* BALÃO 200 #2 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="balao200dois" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('balao200dois')} ${dropCls('balao200dois')}`}
                    style={{
                      opacity: balao200DoisVis ? 1 : 0.14,
                      transition: 'opacity 0.3s',
                      position: 'relative',
                      // animation definido via inline só quando vibra — caso contrário CSS class pulse-item funciona
                      ...(naohTitulando && { animation: 'vibrar 0.45s ease-in-out infinite', transformOrigin: 'center bottom' }),
                    }}
                    draggable={isItem('balao200dois') && balao200DoisVis}
                    onDragStart={e => handleDragStart('balao200dois', e)} onDragEnd={handleDragEnd}>
                    <BalaoVolumetrico200SVG nivel={nivelBalao200Dois} cor={corBalao200Dois} id="v2" />
                    {/* Gotas de fenolftaleína */}
                    {fenolGotas && [0,1,2].map(v => (
                      <div key={`fgota${v}`} style={{
                        position: 'absolute', top: 0, left: `calc(50% + ${(v-1)*5}px)`,
                        width: 8, height: 20, pointerEvents: 'none', zIndex: 30,
                        animation: `artmDropFall 0.60s ${v * 0.62}s linear both`,
                      }}>
                        <svg width="8" height="20" viewBox="0 0 8 20">
                          <ellipse cx="4" cy="14" rx="3.5" ry="5" fill="rgba(255,80,170,0.90)" />
                          <ellipse cx="3" cy="11.5" rx="1.2" ry="1.8" fill="rgba(255,180,230,0.40)" />
                        </svg>
                      </div>
                    ))}
                    {/* Termômetro inserido */}
                    {termometroInserido && (
                      <div style={{ position: 'absolute', top: -55, right: 8, zIndex: 20 }}>
                        <TermometroSVG temperatura={temperatura} inserido={true} />
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('balao200dois') ? '🖱️ ' : ''}2º Balão 200 mL
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 700, color:
                    neutralizacaoConcluida && !edtaAdicionado ? '#f472b6'
                    : edtaAdicionado ? '#22c55e'
                    : hclAdicionado ? '#fbbf24'
                    : nivelBalao200Dois > 0 ? '#60a5fa'
                    : '#94a3b8'
                  }}>
                    {neutralizacaoConcluida && !edtaAdicionado ? '🌸 Rosa escuro'
                      : edtaAdicionado && balao200DoisCompleto ? '✓ Volume completo'
                      : edtaAdicionado ? '✓ Incolor'
                      : hclAdicionado ? '⏳ Resfriando'
                      : balao200DoisComAgua ? '💧 Pronto p/ aquecer'
                      : nivelBalao200Dois > 0 ? '💧 Com solução'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* PIPETA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('pipeta')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={isItem('pipeta')}
                  onDragStart={e => handleDragStart('pipeta', e)} onDragEnd={handleDragEnd}>
                  <PipetaLabSVG nivel={pipetaCheia ? 70 : 0} cor={corPipeta} cheia={pipetaCheia} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Pipeta</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: pipetaCheia ? '#34d399' : '#f87171' }}>
                    {pipetaCheia ? '● Carregada' : 'Vazia'}
                  </span>
                </div>
              </div>

              {/* TERMÔMETRO (standalone, quando não inserido) */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('termometro')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: termometroInserido ? 0.15 : 1, transition: 'opacity 0.3s' }}
                  draggable={isItem('termometro') && !termometroInserido}
                  onDragStart={e => handleDragStart('termometro', e)} onDragEnd={handleDragEnd}>
                  <TermometroSVG temperatura={0} inserido={false} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: termometroInserido ? '#57534e' : '#e7e5e4' }}>
                    {isItem('termometro') ? '🖱️ ' : ''}Termômetro
                  </span>
                  {temp65Atingida && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ 65 °C</span>}
                </div>
              </div>

            </div>{/* fim zona 2 */}

            {/* ══ ZONA 3: FERRAMENTAS + AMOSTRA ══════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'flex-end', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* AMOSTRA MOSTO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(210,178,80,0.82)" label="Amostra" sub="Mosto" nivel={82} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra Mosto</span>
                </ItemBancada>
              </div>

              {/* FUNIL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('funil')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: funilAcoplado ? 0.15 : 1, transition: 'opacity 0.3s' }}
                  draggable={isItem('funil') && !funilAcoplado}
                  onDragStart={e => handleDragStart('funil', e)} onDragEnd={handleDragEnd}>
                  <svg width="52" height="62" viewBox="0 0 52 62">
                    <path d="M2,2 L50,2 L32,52 L20,52 Z" fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.4" />
                    <ellipse cx={26} cy={2} rx={24} ry={4} fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.2" />
                    <rect x={22} y={52} width={8} height={8} rx="1.5" fill="rgba(165,215,255,0.30)" stroke="#8ac4dc" strokeWidth="1.0" />
                    <line x1={6} y1={5} x2={14} y2={50} stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 9, fontWeight: 700, color: funilAcoplado ? '#57534e' : '#e7e5e4' }}>
                    {isItem('funil') ? '🖱️ ' : ''}Funil
                  </span>
                </div>
              </div>

              {/* ALGODÃO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('algodao')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: algodaoNoFunil ? 0.15 : 1, transition: 'opacity 0.3s' }}
                  draggable={isItem('algodao') && !algodaoNoFunil}
                  onDragStart={e => handleDragStart('algodao', e)} onDragEnd={handleDragEnd}>
                  <svg width="52" height="40" viewBox="0 0 52 40">
                    <ellipse cx={26} cy={24} rx={22} ry={6} fill="rgba(0,0,0,0.12)" />
                    <ellipse cx={26} cy={20} rx={22} ry={12} fill="rgba(248,248,248,0.95)" stroke="rgba(200,200,200,0.5)" strokeWidth="1" />
                    <ellipse cx={14} cy={16} rx={10} ry={7} fill="rgba(255,255,255,0.90)" />
                    <ellipse cx={36} cy={18} rx={9} ry={6} fill="rgba(255,255,255,0.88)" />
                    <ellipse cx={26} cy={12} rx={8} ry={5} fill="rgba(255,255,255,0.92)" />
                    <text x={26} y={36} textAnchor="middle" fontSize="6" fill="rgba(150,150,150,0.70)" fontFamily="sans-serif">algodão</text>
                  </svg>
                  <span style={{ fontSize: 9, fontWeight: 700, color: algodaoNoFunil ? '#57534e' : '#e7e5e4' }}>
                    {isItem('algodao') ? '🖱️ ' : ''}Algodão
                  </span>
                </div>
              </div>

              {/* ÁGUA DESMINERALIZADA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('agua')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={isItem('agua')}
                  onDragStart={e => handleDragStart('agua', e)} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,200,240,0.75)" label="H₂O" sub="desm." nivel={80} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('agua') ? '🖱️ ' : ''}Água Desm.
                  </span>
                </div>
              </div>

            </div>{/* fim zona 3 */}

            {/* ══ ZONA 4: REAGENTES ═══════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {[
                { id: 'hcl',          cor: 'rgba(200,235,255,0.72)', label: 'HCl',      sub: '6,34 N'  },
                { id: 'fenol',        cor: 'rgba(255,140,200,0.78)', label: 'Fenolftal', sub: '1%',     draggable: true },
                { id: 'naoh',         cor: 'rgba(240,240,255,0.72)', label: 'NaOH',     sub: '20%'     },
                { id: 'edta',         cor: 'rgba(180,100,220,0.75)', label: 'EDTA',     sub: '4%'      },
                { id: 'fehlinga',     cor: 'rgba(0,60,180,0.75)',    label: 'Fehling A', sub: '',       draggable: true },
                { id: 'fehlingb',     cor: 'rgba(10,40,160,0.75)',   label: 'Fehling B', sub: '',       draggable: true },
                { id: 'azulmetileno', cor: 'rgba(0,30,180,0.82)',    label: 'Azul Met.', sub: '1%',     draggable: true },
              ].map(({ id: fid, cor, label, sub, draggable }) => (
                <div key={fid} style={{ display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id={fid} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      className={`${draggable ? `item-drag ${itemCls(fid)}` : ''} ${dropCls(fid)}`}
                      draggable={draggable ? isItem(fid) : false}
                      onDragStart={draggable ? e => handleDragStart(fid, e) : undefined}
                      onDragEnd={draggable ? handleDragEnd : undefined}
                    >
                      <FrascoReagente cor={cor} label={label} sub={sub} nivel={70} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4', textAlign: 'center' }}>
                      {draggable && isItem(fid) ? '🖱️ ' : ''}{label}
                    </span>
                  </ZonaDrop>
                </div>
              ))}

            </div>{/* fim zona 4 */}

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

export default SimuladorArtMosto;
