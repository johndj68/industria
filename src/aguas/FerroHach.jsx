/**
 * FerroHach.jsx — Determinação de Ferro Total — Método HACH / FerroVer
 *
 * Fluxo: Amostra → Cubeta 25 mm → FerroVer → Homogeneizar → Timer 3 min
 *        → Reação laranja → Branco → Limpar → ZERO → Limpar amostra → READ
 *        → Resultado em mg/L Fe
 *
 * Método: HACH Method 8008 · FerroVer Reagent Powder · λ = 510 nm
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import CubetaSVG from '../components/lab/CubetaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragFerroHach } from '../hooks/useSimuladorDragFerroHach';
import { etapas } from './data/etapasFerroHach';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes fhSwirl {
    0%   { transform: rotate(0deg);   }
    10%  { transform: rotate(18deg);  }
    25%  { transform: rotate(-15deg); }
    40%  { transform: rotate(14deg);  }
    55%  { transform: rotate(-10deg); }
    70%  { transform: rotate(8deg);   }
    85%  { transform: rotate(-4deg);  }
    100% { transform: rotate(0deg);   }
  }
  @keyframes fhPoFall {
    0%   { transform: translateX(-50%) translateY(0px);  opacity: 0;    }
    8%   { opacity: 1; }
    70%  { transform: translateX(-50%) translateY(38px); opacity: 0.75; }
    100% { transform: translateX(-50%) translateY(52px); opacity: 0;    }
  }
  @keyframes fhPoFall2 {
    0%   { transform: translateX(-50%) translateY(0px);  opacity: 0;    }
    8%   { opacity: 0.85; }
    65%  { transform: translateX(-50%) translateY(34px); opacity: 0.65; }
    100% { transform: translateX(-50%) translateY(48px); opacity: 0;    }
  }
  @keyframes fhPoFall3 {
    0%   { transform: translateX(-50%) translateY(0px);  opacity: 0;    }
    8%   { opacity: 0.70; }
    75%  { transform: translateX(-50%) translateY(42px); opacity: 0.55; }
    100% { transform: translateX(-50%) translateY(56px); opacity: 0;    }
  }
  @keyframes fhTimerPulse {
    0%,100% { opacity: 0.65; }
    50%     { opacity: 1.00; }
  }
  @keyframes fhLaranjaGlow {
    0%,100% { filter: drop-shadow(0 0 4px rgba(220,120,20,0.35)); }
    50%     { filter: drop-shadow(0 0 10px rgba(220,120,20,0.70)); }
  }
  .fh-swirl {
    animation: fhSwirl 0.85s ease-in-out;
    transform-origin: center center;
  }
`;

/* Partícula de pó FerroVer caindo */
const PoFerroVerCaindo = ({ offsetX = 0, animName = 'fhPoFall', delay = 0, animKey = 'p' }) => (
  <div
    key={animKey}
    style={{
      position: 'absolute',
      left: `calc(50% + ${offsetX}px)`,
      top: 3,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(230,180,60,0.95), rgba(190,130,30,0.88))',
      opacity: 0,
      pointerEvents: 'none',
      zIndex: 30,
      animationName: animName,
      animationDuration: '0.55s',
      animationDelay: `${delay}ms`,
      animationFillMode: 'forwards',
      animationTimingFunction: 'ease-in',
    }}
  />
);


/* ═══════════════════════════════════════════════════════════
   SVG — SACHÊ FERROVER
═══════════════════════════════════════════════════════════ */
const SacheFerroVerSVG = ({ usado = false }) => (
  <svg width="54" height="46" viewBox="0 0 54 46">
    <defs>
      <linearGradient id="sfvGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <ellipse cx={27} cy={44} rx={21} ry={3} fill="rgba(0,0,0,0.14)" />
    <rect x={3} y={3} width={48} height={37} rx={5}
      fill="url(#sfvGrad)" stroke="#d97706" strokeWidth="1.5"
      opacity={usado ? 0.40 : 1} />
    <line x1={3} y1={13} x2={51} y2={13} stroke="#d97706" strokeWidth="1" opacity="0.55" />
    <line x1={3} y1={29} x2={51} y2={29} stroke="#d97706" strokeWidth="1" opacity="0.55" />
    {!usado && (
      <>
        <circle cx={14} cy={21} r={2.0} fill="rgba(120,70,10,0.30)" />
        <circle cx={23} cy={19} r={1.6} fill="rgba(120,70,10,0.25)" />
        <circle cx={33} cy={22} r={1.8} fill="rgba(120,70,10,0.28)" />
        <circle cx={21} cy={24} r={1.3} fill="rgba(120,70,10,0.22)" />
        <circle cx={40} cy={20} r={1.5} fill="rgba(120,70,10,0.25)" />
      </>
    )}
    <rect x={7} y={15} width={40} height={12} rx={2}
      fill="rgba(255,255,255,0.75)" />
    <text x={27} y={23.5} textAnchor="middle" fontSize="7"
      fill="#92400e" fontFamily="monospace" fontWeight="700">
      FerroVer
    </text>
    <text x={27} y={10} textAnchor="middle" fontSize="5"
      fill="#b45309" fontFamily="sans-serif">pó · 25 mL</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — FOTÔMETRO FERRO TOTAL (HACH)
═══════════════════════════════════════════════════════════ */
const FotometroFerroHachSVG = ({
  cubetaDentro = false,
  corCubetaInterna = 'rgba(185,215,250,0.65)',
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
      <linearGradient id="fhBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#2c3e55" />
        <stop offset="100%" stopColor="#1a2535" />
      </linearGradient>
      <linearGradient id="fhScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#001830" />
        <stop offset="100%" stopColor="#000e20" />
      </linearGradient>
      <filter id="fhSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".5" /></filter>
    </defs>
    <g filter="url(#fhSh)">
      <rect x="4" y="24" width="232" height="142" rx="10" fill="url(#fhBody)" stroke="#131e2d" strokeWidth="2" />
      <rect x="8" y="12" width="224" height="20" rx="6" fill="#1e2e42" stroke="#1e3050" strokeWidth="1" />
    </g>
    <text x="22" y="25" fontSize="7.5" fill="#4a9fd4" fontFamily="monospace" fontWeight="700">HACH DR900</text>
    <text x="22" y="31.5" fontSize="5.5" fill="#3a5a7a" fontFamily="sans-serif">Colorimeter · Method 8008</text>
    <circle cx="216" cy="22" r="5"
      fill={resultado ? '#22c55e' : (lendo || zerando) ? '#f59e0b' : '#3b82f6'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

    {/* Display */}
    <rect x="14" y="38" width="148" height="72" rx="5" fill="url(#fhScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x="16" y="40" width="144" height="68" rx="4" fill="rgba(0,40,80,0.4)" />
    <text x="88" y="56" textAnchor="middle" fontSize="7" fill="#2a6a9a" fontFamily="monospace">FERRO TOTAL · 510 nm</text>
    <line x1="22" y1="60" x2="154" y2="60" stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />

    {resultado ? (
      <>
        <text x="88" y="81" textAnchor="middle" fontSize="26" fill="#00ff88" fontFamily="monospace" fontWeight="700">{resultado}</text>
        <text x="88" y="96" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">mg/L Fe</text>
        <text x="88" y="105" textAnchor="middle" fontSize="6" fill="#16a34a" fontFamily="sans-serif">✓ Leitura concluída</text>
      </>
    ) : lendo ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="11" fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="2.5s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Analisando ferro...</text>
      </>
    ) : zerando ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="monospace">Zerando...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="1.8s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Ajustando branco...</text>
      </>
    ) : zerado ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
        <text x="88" y="87" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="monospace">0,00 mg/L Fe</text>
        <text x="88" y="100" textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="sans-serif">Branco de referência OK</text>
        <text x="88" y="109" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Insira amostra e pressione LER</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="88" y="91" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="88" y="104" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Ferro Total · Method 8008</text>
      </>
    ) : (
      <>
        <text x="88" y="73" textAnchor="middle" fontSize="10" fill="#4a7a9a" fontFamily="monospace">STANDBY</text>
        <text x="88" y="87" textAnchor="middle" fontSize="7.5" fill="#3a5a6a" fontFamily="sans-serif">FERRO TOTAL</text>
        <text x="88" y="98" textAnchor="middle" fontSize="6" fill="#2a4060" fontFamily="sans-serif">Aguardando cubeta...</text>
      </>
    )}

    {/* Compartimento cubeta */}
    <rect x="172" y="38" width="56" height="72" rx="5" fill="#0a1525"
      stroke={cubetaDentro ? '#22c55e' : '#2a3a52'} strokeWidth="1.5" />
    <text x="200" y="53" textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="monospace">SAMPLE</text>
    {cubetaDentro ? (
      <g>
        <rect x="182" y="60" width="36" height="46" rx="2"
          fill={corCubetaInterna} stroke="rgba(200,200,200,0.5)" strokeWidth="1" />
        <rect x="184" y="62" width="6" height="38" fill="rgba(255,255,255,0.16)" />
        {/* Linha de nível lado direito */}
        <line x1="215" y1="68" x2="218" y2="68" stroke="rgba(200,200,200,0.7)" strokeWidth="1.2" />
      </g>
    ) : (
      <rect x="182" y="60" width="36" height="46" rx="2"
        fill="rgba(5,12,25,0.6)" stroke="#1a2535" strokeWidth="0.8" strokeDasharray="4,2" />
    )}
    <circle cx="168" cy="84" r="4"
      fill={cubetaDentro ? 'rgba(14,165,233,0.8)' : 'rgba(14,165,233,0.22)'}
      stroke="rgba(14,165,233,0.35)" strokeWidth="1" />

    {/* Botões */}
    {['ON', 'ZERO', 'LER', 'MENU'].map((lbl, i) => {
      const isZ = lbl === 'ZERO', isL = lbl === 'LER';
      const active = (isZ && zerAtivo) || (isL && lerAtivo);
      const fn = isZ ? onZero : isL ? onLer : undefined;
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
      Ferro Total · Method 8008 · FerroVer · mg/L Fe
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorFerroHach = () => {
  useDragOverlay();

  // ── Injeta keyframes ──────────────────────────────────
  useEffect(() => {
    const sid = 'fh-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ESTILOS_ANIMACAO;
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

  // ── Fonte: amostra ────────────────────────────────────
  const [nivelAmostra, setNivelAmostra] = useState(82);

  // ── Cubeta Amostra ────────────────────────────────────
  const [nivelCubetaAmostra, setNivelCubetaAmostra] = useState(0);
  const [corCubetaAmostra,   setCorCubetaAmostra]   = useState('rgba(220,235,255,0.08)');
  const [amostraNaCubeta,    setAmostraNaCubeta]     = useState(false);
  const [ferroverAdicionado, setFerroverAdicionado]  = useState(false);
  const [cubetaSwirlKey,     setCubetaSwirlKey]      = useState(0);
  const [cubetaGirando,      setCubetaGirando]       = useState(false);
  const [reacaoConcluida,    setReacaoConcluida]     = useState(false);

  // ── Cubeta Branco ─────────────────────────────────────
  const [nivelCubetaBranco, setNivelCubetaBranco] = useState(0);
  const [corCubetaBranco,   setCorCubetaBranco]   = useState('rgba(220,235,255,0.08)');
  const [brancoPreparado,   setBrancoPreparado]   = useState(false);
  const [brancoLimpo,       setBrancoLimpo]       = useState(false);

  // ── Pó FerroVer ───────────────────────────────────────
  const [mostrarPo, setMostrarPo] = useState(false);
  const [poKey,     setPoKey]     = useState(0);

  // ── Timer 3 min ───────────────────────────────────────
  const [timerAtivo,    setTimerAtivo]    = useState(false);
  const [progressoTimer,setProgressoTimer]= useState(0);

  // ── Limpeza visual ────────────────────────────────────
  const [amostraLimpa, setAmostraLimpa] = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [cubetaNoFotometro, setCubetaNoFotometro] = useState(false);
  const [ehBrancoNoFoto,    setEhBrancoNoFoto]    = useState(false);
  const [zerando,           setZerando]           = useState(false);
  const [zerado,            setZerado]            = useState(false);
  const [lendo,             setLendo]             = useState(false);
  const [resultado,         setResultado]         = useState(null);

  // ── Ocultar pó após animação ──────────────────────────
  useEffect(() => {
    if (!mostrarPo) return;
    const id = setTimeout(() => setMostrarPo(false), 1200);
    return () => clearTimeout(id);
  }, [mostrarPo]);

  // ── TIMER: 3 min simulados (step 3) ──────────────────
  useEffect(() => {
    if (!timerAtivo) return;
    setProgressoTimer(0);
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 2, 100);
      setProgressoTimer(p);
    }, 100); // 5s total
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimerAtivo(false);
      setReacaoConcluida(true);
      setProgressoTimer(100);
      // Cor laranja completamente desenvolvida
      setCorCubetaAmostra('rgba(220,120,22,0.86)');
      celebrarAcerto(100);
      proximaEtapa(); // → step 4
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timerAtivo]);

  // ── TIMER: auto-conclusão etapa final ─────────────────
  useEffect(() => {
    if (etapaAtual !== 11) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragFerroHach(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra,
    setNivelCubetaAmostra, setCorCubetaAmostra,
    setAmostraNaCubeta, setFerroverAdicionado,
    setMostrarPo, setPoKey,
    setNivelCubetaBranco, setCorCubetaBranco,
    setBrancoPreparado,
    setCubetaNoFotometro, setEhBrancoNoFoto,
  });

  // ── Click: homogenizar (step 2) ───────────────────────
  const handleHomogenizar = () => {
    if (etapaAtual !== 2 || !ferroverAdicionado) return;
    setCubetaSwirlKey(k => k + 1);
    setCubetaGirando(true);
    // Cor levemente mais laranja durante homogenização
    setCorCubetaAmostra('rgba(230,165,55,0.72)');
    setTimeout(() => {
      setCubetaGirando(false);
      celebrarAcerto();
      proximaEtapa(); // → step 3 (timer)
      setTimerAtivo(true);
    }, 900);
  };

  // ── Click: limpar cubeta branco (step 5) ─────────────
  const handleLimparBranco = () => {
    if (etapaAtual !== 5 || !brancoPreparado) return;
    setBrancoLimpo(true);
    celebrarAcerto();
    proximaEtapa();
  };

  // ── Click: ZERO (step 7) ──────────────────────────────
  const handleZerarFotometro = () => {
    if (etapaAtual !== 7 || !cubetaNoFotometro || !ehBrancoNoFoto || zerando) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaNoFotometro(false);
      setNivelCubetaBranco(0);
      celebrarAcerto(150);
      proximaEtapa(); // → step 8
    }, 2000);
  };

  // ── Click: limpar cubeta amostra (step 8) ─────────────
  const handleLimparAmostra = () => {
    if (etapaAtual !== 8) return;
    setAmostraLimpa(true);
    celebrarAcerto();
    proximaEtapa();
  };

  // ── Click: LER (step 10) ──────────────────────────────
  const handleLerFotometro = () => {
    if (etapaAtual !== 10 || !cubetaNoFotometro || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * 2.5 + 0.05).toFixed(2));
      setResultado(raw.toFixed(2));
      setLendo(false);
      celebrarAcerto(200);
      proximaEtapa(); // → step 11
    }, 2500);
  };

  // Cor interna da cubeta no fotômetro
  const corCubetaNoFoto = ehBrancoNoFoto ? corCubetaBranco : corCubetaAmostra;

  // Draggable conditions
  const cubetaBrancoDrag  = isItem('cubeta_branco')  && brancoLimpo;
  const cubetaAmostraDrag = isItem('cubeta_amostra') && amostraLimpa;

  // Step panels
  const mostrarBotaoHom   = etapaAtual === 2;
  const mostrarBotaoLimB  = etapaAtual === 5;
  const mostrarBotaoLimA  = etapaAtual === 8;


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

      {/* ── BANNER TIMER ── */}
      {timerAtivo && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, animation: 'fhTimerPulse 1s ease-in-out infinite' }}>🟠 Reação FerroVer — 3 minutos</div>
            <div style={{ marginTop: 8, height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', minWidth: 220 }}>
              <div style={{ height: '100%', width: `${progressoTimer}%`, background: 'rgba(251,191,36,0.85)', borderRadius: 5, transition: 'width 0.1s linear' }} />
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.75)' }}>
              {Math.floor(progressoTimer)}% · Cor laranja se desenvolvendo...
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RESULTADO ── */}
      {resultado && etapaAtual >= 11 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7c2d12,#c2410c,#ea580c)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🟠 Leitura Concluída!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Ferro Total: <strong>{resultado} mg/L Fe</strong></div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #ea580c', borderRadius: 24, padding: '48px 56px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🟠</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#fb923c', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Ferro Total — Método HACH / FerroVer · mg/L Fe
            </p>

            <div style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.28)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Branco</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>0,00</div>
                  <div style={{ fontSize: 9, color: '#64748b' }}>mg/L Fe</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Tempo Reação</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>3 min</div>
                  <div style={{ fontSize: 9, color: '#64748b' }}>FerroVer</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Coloração</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f97316' }}>🟠 Laranja</div>
                  <div style={{ fontSize: 9, color: '#64748b' }}>Fe presente</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(234,88,12,0.12)', border: '1px solid rgba(234,88,12,0.38)', borderRadius: 14, padding: '18px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Ferro Total</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#ea580c', fontFamily: 'monospace', lineHeight: 1 }}>{resultado}</div>
              <div style={{ fontSize: 14, color: '#fb923c', fontWeight: 700, marginTop: 4 }}>mg/L Fe</div>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#34d399' }}>
              ✓ Leitura finalizada com sucesso · HACH Method 8008 · FerroVer
            </div>

            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#ea580c,#c2410c)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Ferro Total — FerroVer"
        subtitulo={"Método HACH · FerroVer Reagent\nTimer 3 min · mg/L Fe"}
        icone="🟠"
        badges={['💧 ÁGUAS', '🔬 COLORIMETRIA']}
        footerLabel="🟠 Ferro Total HACH"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 720 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🟠 Bancada — Determinação de Ferro Total (Método FerroVer)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* ─ CUBETA AMOSTRA ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="cubeta_amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`${dropCls('cubeta_amostra')} ${itemCls('cubeta_amostra')}`}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '10px 14px', position: 'relative' }}>

                    {/* Partículas de pó FerroVer caindo */}
                    <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                      {mostrarPo && (
                        <>
                          <PoFerroVerCaindo key={`p1-${poKey}`} offsetX={-10} animName="fhPoFall"  delay={0}   animKey={`p1-${poKey}`} />
                          <PoFerroVerCaindo key={`p2-${poKey}`} offsetX={-3}  animName="fhPoFall2" delay={80}  animKey={`p2-${poKey}`} />
                          <PoFerroVerCaindo key={`p3-${poKey}`} offsetX={4}   animName="fhPoFall3" delay={160} animKey={`p3-${poKey}`} />
                          <PoFerroVerCaindo key={`p4-${poKey}`} offsetX={-7}  animName="fhPoFall"  delay={240} animKey={`p4-${poKey}`} />
                          <PoFerroVerCaindo key={`p5-${poKey}`} offsetX={8}   animName="fhPoFall2" delay={320} animKey={`p5-${poKey}`} />
                        </>
                      )}
                    </div>

                    <div
                      key={cubetaSwirlKey}
                      className={cubetaGirando ? 'fh-swirl' : ''}
                      draggable={cubetaAmostraDrag}
                      onDragStart={e => handleDragStart('cubeta_amostra', e)}
                      onDragEnd={handleDragEnd}
                      style={{
                        cursor: cubetaAmostraDrag ? 'grab' : 'default',
                        opacity: cubetaNoFotometro && !ehBrancoNoFoto ? 0.18 : 1,
                        transition: 'opacity 0.3s',
                        filter: reacaoConcluida ? 'drop-shadow(0 0 8px rgba(220,120,22,0.55))' : 'none',
                      }}>
                      <CubetaSVG cor={corCubetaAmostra} nivel={nivelCubetaAmostra} id="fha" />
                    </div>

                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {cubetaAmostraDrag ? '🖱️ ' : ''}Cubeta Amostra 25 mm
                    </span>
                    <span style={{ fontSize: 8, color: reacaoConcluida ? '#fb923c' : '#94a3b8' }}>
                      {reacaoConcluida      ? '🟠 Reação concluída'
                        : cubetaGirando    ? '🔄 Homogeneizando...'
                        : ferroverAdicionado ? '🟡 FerroVer disperso'
                        : amostraNaCubeta  ? '💧 Amostra adicionada'
                        : 'Vazia'}
                    </span>
                  </div>
                </ZonaDrop>
              </div>

              {/* ─ CUBETA BRANCO ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="cubeta_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`${dropCls('cubeta_branco')} ${itemCls('cubeta_branco')}`}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '10px 14px' }}>
                    <div
                      draggable={cubetaBrancoDrag}
                      onDragStart={e => handleDragStart('cubeta_branco', e)}
                      onDragEnd={handleDragEnd}
                      style={{
                        cursor: cubetaBrancoDrag ? 'grab' : 'default',
                        opacity: cubetaNoFotometro && ehBrancoNoFoto ? 0.18 : 1,
                        transition: 'opacity 0.3s',
                      }}>
                      <CubetaSVG cor={corCubetaBranco} nivel={nivelCubetaBranco} id="fhb" />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {cubetaBrancoDrag ? '🖱️ ' : ''}Cubeta Branco 25 mm
                    </span>
                    <span style={{ fontSize: 8, color: '#94a3b8' }}>
                      {brancoLimpo    ? '✓ Limpa — pronto'
                        : brancoPreparado ? '💧 Branco sem reagente'
                        : 'Vazia'}
                    </span>
                  </div>
                </ZonaDrop>
              </div>

              {/* ─ FOTÔMETRO ─ */}
              <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={dropCls('fotometro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                    <FotometroFerroHachSVG
                      cubetaDentro={cubetaNoFotometro}
                      corCubetaInterna={corCubetaNoFoto}
                      zerando={zerando}
                      zerado={zerado && !cubetaNoFotometro}
                      lendo={lendo}
                      resultado={resultado}
                      zerAtivo={etapaAtual === 7 && cubetaNoFotometro && !zerando}
                      lerAtivo={etapaAtual === 10 && cubetaNoFotometro && !lendo && !resultado}
                      onZero={handleZerarFotometro}
                      onLer={handleLerFotometro}
                    />
                    {etapaAtual === 7 && cubetaNoFotometro && !zerando && (
                      <div style={{ textAlign: 'center', fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>🔵 Clique ZERO para zerar!</div>
                    )}
                    {etapaAtual === 10 && cubetaNoFotometro && !lendo && !resultado && (
                      <div style={{ textAlign: 'center', fontSize: 8, color: '#f97316', fontWeight: 700, marginTop: 4 }}>🟠 Clique LER para ler!</div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Equip. HACH DR900</span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ PAINEL DE AÇÃO (homogenizar / timer / limpar) ════════ */}
            {(mostrarBotaoHom || timerAtivo || mostrarBotaoLimB || mostrarBotaoLimA) && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.30)', borderRadius: 12, padding: '12px 18px', border: `1px solid ${timerAtivo ? 'rgba(234,88,12,0.40)' : 'rgba(34,211,238,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>

                {timerAtivo ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#fb923c', fontWeight: 700 }}>⏱ Reação do FerroVer — 3 minutos (simulado)</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>O ferro reage com FerroVer desenvolvendo coloração laranja...</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressoTimer}%`, background: 'linear-gradient(90deg,#f59e0b,#ea580c)', borderRadius: 4, transition: 'width 0.1s linear' }} />
                      </div>
                      <div style={{ fontSize: 8, color: '#d97706', marginTop: 3 }}>{Math.floor(progressoTimer)}% — {progressoTimer < 100 ? 'Reação em andamento' : 'Concluído!'}</div>
                    </div>
                  </>
                ) : mostrarBotaoHom ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>🔄 Homogeneizar a Cubeta</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Gire suavemente a cubeta para dissolver o reagente FerroVer e iniciar o timer de 3 min.</div>
                    </div>
                    <button onClick={handleHomogenizar}
                      style={{ background: 'linear-gradient(90deg,#c2410c,#ea580c)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(234,88,12,0.35)', whiteSpace: 'nowrap' }}>
                      🔄 Homogeneizar + ⏱ Timer
                    </button>
                  </>
                ) : mostrarBotaoLimB ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>🧻 Limpar Parede Externa da Cubeta do Branco</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Use papel absorvente macio para limpar a parede externa antes de inserir no equipamento.</div>
                    </div>
                    <button onClick={handleLimparBranco}
                      style={{ background: 'linear-gradient(90deg,#0369a1,#0891b2)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.35)', whiteSpace: 'nowrap' }}>
                      🧻 Limpar Cubeta Branco
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>🧻 Limpar Parede Externa da Cubeta da Amostra</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Use papel absorvente macio para limpar a parede externa antes de inserir no equipamento.</div>
                    </div>
                    <button onClick={handleLimparAmostra}
                      style={{ background: 'linear-gradient(90deg,#c2410c,#ea580c)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(234,88,12,0.35)', whiteSpace: 'nowrap' }}>
                      🧻 Limpar Cubeta Amostra
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, alignItems: 'flex-end', maxWidth: 400, margin: '0 auto' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,200,240,0.78)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* FERROVER SACHÊ */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  className={`item-drag ${itemCls('ferroVer')}`}
                  draggable={isItem('ferroVer')}
                  onDragStart={e => handleDragStart('ferroVer', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <SacheFerroVerSVG usado={ferroverAdicionado} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>
                  {isItem('ferroVer') ? '🖱️ ' : ''}FerroVer Reagent
                </span>
                {ferroverAdicionado
                  ? <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>
                  : <span style={{ fontSize: 8, color: '#94a3b8' }}>Sachê em pó · 25 mL</span>
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

export default SimuladorFerroHach;
