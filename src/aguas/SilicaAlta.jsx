/**
 * SilicaAlta.jsx — Determinação de Sílica Alto Teor
 *
 * Fluxo: Amostra/Água → Proveta (10 mL) → Béqueres
 *        → HCl 2% → Ácido Oxálico 10% → Homogeneizar
 *        → Molibdato NH₄ 10% → Homogeneizar → Timer 4 min
 *        → Sulfito Na 17% → Homogeneizar
 *        → Cubeta quartzo 10 mm → Fotômetro
 *        → ZERO (branco) → READ (amostra) → ppm SiO₂
 *
 * Curva: Sílica Alto Teor · λ ≈ 815 nm · Resultado em ppm SiO₂
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import BequerSVG from '../components/lab/BequerSVG';
import CubetaSVG from '../components/lab/CubetaSVG';
import GotaCaindo from '../components/lab/GotaCaindo';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragSilicaAlta } from '../hooks/useSimuladorDragSilicaAlta';
import { etapas } from './data/etapasSilicaAlta';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes slaDropFall {
    0%   { transform: translateX(-50%) translateY(0px);  opacity: 0;    }
    6%   { transform: translateX(-50%) translateY(1px);  opacity: 1;    }
    65%  { transform: translateX(-50%) translateY(46px); opacity: 0.90; }
    100% { transform: translateX(-50%) translateY(62px); opacity: 0;    }
  }
  @keyframes slaDropFall2 {
    0%   { transform: translateX(-50%) translateY(0px);  opacity: 0;    }
    6%   { transform: translateX(-50%) translateY(1px);  opacity: 0.85; }
    65%  { transform: translateX(-50%) translateY(42px); opacity: 0.75; }
    100% { transform: translateX(-50%) translateY(58px); opacity: 0;    }
  }
  @keyframes slaDropFall3 {
    0%   { transform: translateX(-50%) translateY(0px);  opacity: 0;    }
    6%   { transform: translateX(-50%) translateY(1px);  opacity: 0.70; }
    65%  { transform: translateX(-50%) translateY(50px); opacity: 0.60; }
    100% { transform: translateX(-50%) translateY(66px); opacity: 0;    }
  }
  @keyframes slaVibrar {
    0%,100% { transform: translateX(0)    rotate(0deg);    }
    12%     { transform: translateX(-5px) rotate(-2deg);   }
    25%     { transform: translateX(5px)  rotate(2deg);    }
    38%     { transform: translateX(-3px) rotate(-1.2deg); }
    52%     { transform: translateX(3px)  rotate(1.2deg);  }
    65%     { transform: translateX(-2px) rotate(-0.6deg); }
    78%     { transform: translateX(2px)  rotate(0.6deg);  }
    90%     { transform: translateX(-1px) rotate(-0.2deg); }
  }
  @keyframes slaTimerPulse {
    0%,100% { opacity: 0.65; }
    50%     { opacity: 1.00; }
  }
  .sla-vibrar {
    animation: slaVibrar 0.55s ease-in-out;
    transform-origin: center bottom;
  }
`;


/* ═══════════════════════════════════════════════════════════
   SVG — FOTÔMETRO SÍLICA ALTO TEOR
═══════════════════════════════════════════════════════════ */
const FotometroSilicaAltaSVG = ({
  cubetaDentro = false,
  zerando   = false,
  zerado    = false,
  lendo     = false,
  resultado = null,
  zerAtivo  = false,
  lerAtivo  = false,
  onZero,
  onLer,
}) => (
  <svg width="240" height="175" viewBox="0 0 240 175">
    <defs>
      <linearGradient id="fsaBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#2c3e55" />
        <stop offset="100%" stopColor="#1a2535" />
      </linearGradient>
      <linearGradient id="fsaScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#001830" />
        <stop offset="100%" stopColor="#000e20" />
      </linearGradient>
      <filter id="fsaSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".5" /></filter>
    </defs>
    <g filter="url(#fsaSh)">
      <rect x="4" y="24" width="232" height="142" rx="10" fill="url(#fsaBody)" stroke="#131e2d" strokeWidth="2" />
      <rect x="8" y="12" width="224" height="20" rx="6" fill="#1e2e42" stroke="#1e3050" strokeWidth="1" />
    </g>
    <text x="22" y="25" fontSize="7.5" fill="#4a9fd4" fontFamily="monospace" fontWeight="700">HACH DR900</text>
    <text x="22" y="31.5" fontSize="5.5" fill="#3a5a7a" fontFamily="sans-serif">Colorimeter · Photometer</text>
    <circle cx="216" cy="22" r="5"
      fill={resultado ? '#22c55e' : (lendo || zerando) ? '#f59e0b' : '#3b82f6'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

    {/* Display principal */}
    <rect x="14" y="38" width="148" height="72" rx="5" fill="url(#fsaScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x="16" y="40" width="144" height="68" rx="4" fill="rgba(0,40,80,0.4)" />
    <text x="88" y="56" textAnchor="middle" fontSize="7" fill="#2a6a9a" fontFamily="monospace">SÍLICA ALTO TEOR · 815 nm</text>
    <line x1="22" y1="60" x2="154" y2="60" stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />

    {resultado ? (
      <>
        <text x="88" y="81" textAnchor="middle" fontSize="26" fill="#00ff88" fontFamily="monospace" fontWeight="700">{resultado}</text>
        <text x="88" y="96" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">ppm SiO₂</text>
        <text x="88" y="106" textAnchor="middle" fontSize="6" fill="#16a34a" fontFamily="sans-serif">✓ Leitura concluída</text>
      </>
    ) : lendo ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="11" fill="#fbbf24" fontFamily="monospace">Reading...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="3s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Analisando...</text>
      </>
    ) : zerando ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="monospace">Zerando...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="2s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Ajustando branco...</text>
      </>
    ) : zerado ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
        <text x="88" y="87" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="monospace">0.000 ppm SiO₂</text>
        <text x="88" y="100" textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="sans-serif">Branco OK — Curva carregada</text>
        <text x="88" y="109" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Insira amostra e pressione READ</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="88" y="91" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="88" y="104" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Curva: Sílica Alto Teor</text>
      </>
    ) : (
      <>
        <text x="88" y="73" textAnchor="middle" fontSize="10" fill="#4a7a9a" fontFamily="monospace">STANDBY</text>
        <text x="88" y="87" textAnchor="middle" fontSize="6.5" fill="#3a5a6a" fontFamily="sans-serif">Curva: Sílica Alto Teor</text>
        <text x="88" y="98" textAnchor="middle" fontSize="6" fill="#2a4060" fontFamily="sans-serif">Aguardando cubeta...</text>
      </>
    )}

    {/* Compartimento da cubeta */}
    <rect x="172" y="38" width="56" height="72" rx="5" fill="#0a1525"
      stroke={cubetaDentro ? '#22c55e' : '#2a3a52'} strokeWidth="1.5" />
    <text x="200" y="53" textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="monospace">SAMPLE</text>
    {cubetaDentro ? (
      <g>
        <rect x="182" y="60" width="36" height="46" rx="2"
          fill={zerado ? 'rgba(218,232,218,0.55)' : 'rgba(48,132,210,0.70)'}
          stroke="rgba(150,200,255,0.6)" strokeWidth="1" />
        <rect x="184" y="62" width="6" height="38" fill="rgba(255,255,255,0.16)" />
      </g>
    ) : (
      <rect x="182" y="60" width="36" height="46" rx="2"
        fill="rgba(5,12,25,0.6)" stroke="#1a2535" strokeWidth="0.8" strokeDasharray="4,2" />
    )}
    <circle cx="168" cy="84" r="4"
      fill={cubetaDentro ? 'rgba(14,165,233,0.8)' : 'rgba(14,165,233,0.22)'}
      stroke="rgba(14,165,233,0.35)" strokeWidth="1" />

    {/* Botões */}
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
      Sílica Alto Teor · λ ≈ 815 nm · ppm SiO₂
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorSilicaAlta = () => {
  useDragOverlay();

  // ── Injeta keyframes ──────────────────────────────────
  useEffect(() => {
    const sid = 'sla-anim-styles';
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

  // ── Proveta ───────────────────────────────────────────
  const [nivelProveta, setNivelProveta] = useState(0);
  const [provetaCheia, setProvetaCheia] = useState(false);

  // ── Frascos fonte ─────────────────────────────────────
  const [nivelAmostra,   setNivelAmostra]   = useState(82);
  const [nivelAgua,      setNivelAgua]      = useState(85);
  const [nivelHcl,       setNivelHcl]       = useState(80);
  const [nivelOxalico,   setNivelOxalico]   = useState(78);
  const [nivelMolibdato, setNivelMolibdato] = useState(80);
  const [nivelSulfito,   setNivelSulfito]   = useState(82);

  // ── Béquer Branco ─────────────────────────────────────
  const [nivelBranco,    setNivelBranco]    = useState(0);
  const [corBranco,      setCorBranco]      = useState('rgba(220,235,255,0.08)');
  const [brancoPrep,     setBrancoPrep]     = useState(false);
  const [hclBranco,      setHclBranco]      = useState(false);
  const [oxalicoBranco,  setOxalicoBranco]  = useState(false);
  const [molibdatoBranco,setMolibdatoBranco]= useState(false);
  const [sulfitoBranco,  setSulfitoBranco]  = useState(false);

  // ── Béquer Amostra ────────────────────────────────────
  const [nivelAmostraBq,    setNivelAmostraBq]    = useState(0);
  const [corAmostraBq,      setCorAmostraBq]      = useState('rgba(220,235,255,0.08)');
  const [amostraBqPrep,     setAmostraBqPrep]     = useState(false);
  const [hclAmostra,        setHclAmostra]        = useState(false);
  const [oxalicoAmostra,    setOxalicoAmostra]    = useState(false);
  const [molibdatoAmostra,  setMolibdatoAmostra]  = useState(false);
  const [sulfitoAmostra,    setSulfitoAmostra]    = useState(false);

  // ── Timer 4 min ───────────────────────────────────────
  const [timerAtivo,    setTimerAtivo]    = useState(false);
  const [progressoTimer,setProgressoTimer]= useState(0);
  const [, setTimerConcluido] = useState(false);

  // ── Animações homogeneização ──────────────────────────
  const [hitKeyB,    setHitKeyB]    = useState(0);
  const [hitKeyA,    setHitKeyA]    = useState(0);
  const [vibrarB,    setVibrarB]    = useState(false);
  const [vibrarA,    setVibrarA]    = useState(false);

  // ── Cubeta ────────────────────────────────────────────
  const [nivelCubeta,       setNivelCubeta]       = useState(0);
  const [corCubeta,         setCorCubeta]         = useState('rgba(220,235,255,0.08)');
  const [cubetaNoFotometro, setCubetaNoFotometro] = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [zerando,   setZerando]   = useState(false);
  const [zerado,    setZerado]    = useState(false);
  const [lendo,     setLendo]     = useState(false);
  const [resultado, setResultado] = useState(null);

  // ── Gotas (para feedback visual de reagentes) ─────────
  const [gotasKey]    = useState(0);
  const [mostrarGotas,setMostrarGotas]= useState(false);
  const [gotaAlvo]    = useState(null); // 'branco' | 'amostra'

  // ── TIMER: 4 min simulados (step 12) ─────────────────
  useEffect(() => {
    if (!timerAtivo) return;
    setProgressoTimer(0);
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 2, 100);
      setProgressoTimer(p);
    }, 100); // 100ms × 50 = 5s total
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimerAtivo(false);
      setTimerConcluido(true);
      setProgressoTimer(100);
      celebrarAcerto(100);
      proximaEtapa(); // → step 13
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timerAtivo]);

  // ── TIMER: auto-conclusão na última etapa ─────────────
  useEffect(() => {
    if (etapaAtual !== 22) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Gotas: mostrar por 1.2s após cada adição ──────────
  useEffect(() => {
    if (!mostrarGotas) return;
    const id = setTimeout(() => setMostrarGotas(false), 1200);
    return () => clearTimeout(id);
  }, [mostrarGotas]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragSilicaAlta(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAmostra, setNivelAgua,
    setNivelHcl, setNivelOxalico, setNivelMolibdato, setNivelSulfito,
    setNivelBranco, setCorBranco,
    setBrancoPrep, setHclBranco, setOxalicoBranco, setMolibdatoBranco, setSulfitoBranco,
    setNivelAmostraBq, setCorAmostraBq,
    setAmostraBqPrep, setHclAmostra, setOxalicoAmostra, setMolibdatoAmostra, setSulfitoAmostra,
    setNivelCubeta, setCorCubeta,
    setCubetaNoFotometro,
  });

  // Helper: vibrar ambos os béquers
  const vibrarAmbos = (cb) => {
    setHitKeyB(k => k + 1); setVibrarB(true);
    setHitKeyA(k => k + 1); setVibrarA(true);
    setTimeout(() => { setVibrarB(false); setVibrarA(false); if (cb) cb(); }, 600);
  };

  // ── Click: Homogenizar 1 (step 8) ────────────────────
  const handleHomogenizar1 = () => {
    if (etapaAtual !== 8) return;
    vibrarAmbos(() => { celebrarAcerto(); proximaEtapa(); });
  };

  // ── Click: Homogenizar 2 + Iniciar Timer (step 11) ───
  const handleHomogenizar2ETimer = () => {
    if (etapaAtual !== 11) return;
    vibrarAmbos(() => {
      celebrarAcerto();
      proximaEtapa(); // → step 12
      setTimerAtivo(true);
    });
  };

  // ── Click: Homogenizar 3 (step 15) ───────────────────
  const handleHomogenizar3 = () => {
    if (etapaAtual !== 15) return;
    vibrarAmbos(() => { celebrarAcerto(); proximaEtapa(); });
  };

  // ── Click: ZERO fotômetro (step 18) ──────────────────
  const handleZerarFotometro = () => {
    if (etapaAtual !== 18 || !cubetaNoFotometro || zerando || zerado) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaNoFotometro(false);
      setNivelCubeta(0);
      setCorCubeta('rgba(220,235,255,0.08)');
      celebrarAcerto(150);
      proximaEtapa(); // → step 19
    }, 2200);
  };

  // ── Click: READ fotômetro (step 21) ──────────────────
  const handleLerFotometro = () => {
    if (etapaAtual !== 21 || !cubetaNoFotometro || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const raw = parseFloat((Math.random() * 60 + 5).toFixed(1));
      setResultado(raw.toFixed(1));
      setLendo(false);
      celebrarAcerto(200);
      proximaEtapa(); // → step 22
    }, 3000);
  };

  // Passos onde o botão de homogeneizar aparece
  const mostrarBotaoHom = etapaAtual === 8 || etapaAtual === 11 || etapaAtual === 15;

  // O béquer pode ser arrastado nas etapas correspondentes
  const brancoDraggable  = isItem('bequer_branco');
  const amostraDraggable = isItem('bequer_amostra');
  const cubetaDraggable  = isItem('cubeta') && !cubetaNoFotometro;


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

      {/* ── BANNER RESULTADO ── */}
      {resultado && etapaAtual >= 21 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#164e63,#0e7490,#0891b2)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🔷 Leitura Concluída!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Sílica Alto Teor: <strong>{resultado} ppm SiO₂</strong></div>
          </div>
        </div>
      )}

      {/* ── TIMER BANNER (step 12) ── */}
      {timerAtivo && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, animation: 'slaTimerPulse 1s ease-in-out infinite' }}>
              ⏱ Aguardando Reação do Molibdato · 4 minutos
            </div>
            <div style={{ marginTop: 8, height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', minWidth: 240 }}>
              <div style={{ height: '100%', width: `${progressoTimer}%`, background: 'rgba(251,191,36,0.85)', borderRadius: 5, transition: 'width 0.1s linear' }} />
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.75)' }}>
              {Math.floor(progressoTimer)}% · Complexo silicomolibdato se formando...
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #0891b2', borderRadius: 24, padding: '48px 56px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🔷</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Sílica Alto Teor · Curva Sílica Alto Teor · ppm SiO₂
            </p>

            <div style={{ background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.28)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Curva</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>Sílica Alto Teor</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Branco</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>0.000</div>
                  <div style={{ fontSize: 9, color: '#64748b' }}>ppm SiO₂</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>Leitura C</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>{resultado}</div>
                  <div style={{ fontSize: 9, color: '#64748b' }}>ppm SiO₂</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.38)', borderRadius: 14, padding: '18px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Resultado Final</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#0891b2', fontFamily: 'monospace', lineHeight: 1 }}>{resultado}</div>
              <div style={{ fontSize: 14, color: '#38bdf8', fontWeight: 700, marginTop: 4 }}>ppm SiO₂</div>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#34d399' }}>
              ✓ Leitura finalizada com sucesso · Sílica Alto Teor
            </div>

            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#0891b2,#0e7490)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Sílica Alto Teor"
        subtitulo={"Molibdato de Amônio · Sulfito de Sódio\nCurva Sílica Alto Teor · ppm SiO₂"}
        icone="🔷"
        badges={['💧 ÁGUAS', '🔬 COLORIMETRIA']}
        footerLabel="🔷 Sílica Alto Teor"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 860 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🔷 Bancada — Determinação de Sílica Alto Teor
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 0, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* ─ BÉQUER BRANCO ─ */}
              <ZonaDrop id="bequer_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={`${dropCls('bequer_branco')} ${itemCls('bequer_branco')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 12px', cursor: brancoDraggable ? 'grab' : 'default', opacity: (etapaAtual >= 16 && etapaAtual < 19 && sulfitoBranco) ? 0.3 : 1, transition: 'opacity 0.3s' }}>

                  {/* Gotas caindo no branco */}
                  <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                    {mostrarGotas && gotaAlvo === 'branco' && (
                      <>
                        <GotaCaindo key={`sb1-${gotasKey}`} offsetX={-4} animName="slaDropFall"  delay={0}   animKey={`sb1-${gotasKey}`} />
                        <GotaCaindo key={`sb2-${gotasKey}`} offsetX={0}  animName="slaDropFall2" delay={100} animKey={`sb2-${gotasKey}`} />
                        <GotaCaindo key={`sb3-${gotasKey}`} offsetX={4}  animName="slaDropFall3" delay={200} animKey={`sb3-${gotasKey}`} />
                      </>
                    )}
                  </div>

                  <div key={hitKeyB} className={vibrarB ? 'sla-vibrar' : ''}
                    draggable={brancoDraggable}
                    onDragStart={e => handleDragStart('bequer_branco', e)}
                    onDragEnd={handleDragEnd}>
                    <BequerSVG nivel={nivelBranco} cor={corBranco} id="sb" ml={150} />
                  </div>

                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {brancoDraggable ? '🖱️ ' : ''}Béquer Branco 100 mL
                  </span>
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>
                    {sulfitoBranco ? '✓ Pronto para leitura'
                      : molibdatoBranco ? '🟡 + Molibdato'
                      : oxalicoBranco ? '💧 + Oxálico'
                      : hclBranco ? '💧 + HCl'
                      : brancoPrep ? '💧 10 mL água'
                      : 'Vazio'}
                  </span>
                </div>
              </ZonaDrop>

              {/* ─ BÉQUER AMOSTRA ─ */}
              <ZonaDrop id="bequer_amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={`${dropCls('bequer_amostra')} ${itemCls('bequer_amostra')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 12px', cursor: amostraDraggable ? 'grab' : 'default', opacity: (etapaAtual >= 19 && sulfitoAmostra) ? 0.3 : 1, transition: 'opacity 0.3s' }}>

                  {/* Gotas caindo na amostra */}
                  <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                    {mostrarGotas && gotaAlvo === 'amostra' && (
                      <>
                        <GotaCaindo key={`sa1-${gotasKey}`} offsetX={-4} animName="slaDropFall"  delay={0}   animKey={`sa1-${gotasKey}`} />
                        <GotaCaindo key={`sa2-${gotasKey}`} offsetX={0}  animName="slaDropFall2" delay={100} animKey={`sa2-${gotasKey}`} />
                        <GotaCaindo key={`sa3-${gotasKey}`} offsetX={4}  animName="slaDropFall3" delay={200} animKey={`sa3-${gotasKey}`} />
                      </>
                    )}
                  </div>

                  <div key={hitKeyA} className={vibrarA ? 'sla-vibrar' : ''}
                    draggable={amostraDraggable}
                    onDragStart={e => handleDragStart('bequer_amostra', e)}
                    onDragEnd={handleDragEnd}>
                    <BequerSVG nivel={nivelAmostraBq} cor={corAmostraBq} id="sa" ml={150} />
                  </div>

                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {amostraDraggable ? '🖱️ ' : ''}Béquer Amostra 100 mL
                  </span>
                  <span style={{ fontSize: 8, color: sulfitoAmostra ? '#3b82f6' : '#94a3b8' }}>
                    {sulfitoAmostra ? '🔵 Azul — pronto para leitura'
                      : molibdatoAmostra ? '🟡 + Molibdato (amarelo)'
                      : oxalicoAmostra ? '💧 + Oxálico'
                      : hclAmostra ? '💧 + HCl'
                      : amostraBqPrep ? '💧 10 mL amostra'
                      : 'Vazio'}
                  </span>
                </div>
              </ZonaDrop>

              {/* ─ PROVETA ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: '6px 4px' }}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta 50 mL</span>
                  {provetaCheia && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>10 mL medidos</span>}
                </ZonaDrop>
              </div>

              {/* ─ CUBETA ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`item-drag ${itemCls('cubeta')} ${dropCls('cubeta')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: '4px 2px' }}
                    draggable={cubetaDraggable}
                    onDragStart={e => handleDragStart('cubeta', e)} onDragEnd={handleDragEnd}>
                    {!cubetaNoFotometro
                      ? <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="sla" />
                      : <div style={{ width: 80, height: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <span style={{ fontSize: 18 }}>✅</span>
                          <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>No equip.</span>
                        </div>
                    }
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{cubetaDraggable ? '🖱️ ' : ''}Cubeta Quartzo 10 mm</span>
                  {nivelCubeta > 0 && !cubetaNoFotometro && (
                    <span style={{ fontSize: 8, color: corCubeta.includes('48,132') ? '#60a5fa' : '#34d399', fontWeight: 700 }}>
                      {corCubeta.includes('48,132') ? '🔵 Amostra' : '⚪ Branco'}
                    </span>
                  )}
                </ZonaDrop>
              </div>

              {/* ─ FOTÔMETRO ─ */}
              <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div className={dropCls('fotometro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                  <FotometroSilicaAltaSVG
                    cubetaDentro={cubetaNoFotometro}
                    zerando={zerando}
                    zerado={zerado && !cubetaNoFotometro}
                    lendo={lendo}
                    resultado={resultado}
                    zerAtivo={etapaAtual === 18 && cubetaNoFotometro && !zerando}
                    lerAtivo={etapaAtual === 21 && cubetaNoFotometro && !lendo && !resultado}
                    onZero={handleZerarFotometro}
                    onLer={handleLerFotometro}
                  />
                  {etapaAtual === 18 && cubetaNoFotometro && !zerando && (
                    <div style={{ textAlign: 'center', fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>🔵 Clique ZERO para zerar!</div>
                  )}
                  {etapaAtual === 21 && cubetaNoFotometro && !lendo && !resultado && (
                    <div style={{ textAlign: 'center', fontSize: 8, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>🟢 Clique READ para ler!</div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Equip. HACH DR900</span>
              </ZonaDrop>

            </div>{/* fim zona superior */}

            {/* ══ PAINEL HOMOGENIZAR / TIMER ═══════════════════════════ */}
            {(mostrarBotaoHom || timerAtivo) && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.30)', borderRadius: 12, padding: '12px 18px', border: `1px solid ${timerAtivo ? 'rgba(245,158,11,0.40)' : 'rgba(34,211,238,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>

                {timerAtivo ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>⏱ Reação do Molibdato — 4 minutos (simulado)</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Complexo silicomolibdato se formando...</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressoTimer}%`, background: 'linear-gradient(90deg,#f59e0b,#ef4444)', borderRadius: 4, transition: 'width 0.1s linear' }} />
                      </div>
                      <div style={{ fontSize: 8, color: '#d97706', marginTop: 3 }}>{Math.floor(progressoTimer)}% concluído</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>
                        {etapaAtual === 8  ? '🔄 Homogeneizar após HCl + Ácido Oxálico'
                          : etapaAtual === 11 ? '🔄 Homogeneizar + Iniciar Timer de 4 min'
                          : '🔄 Homogeneizar após Sulfito de Sódio'}
                      </div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>
                        {etapaAtual === 11 ? 'O timer de 4 min inicia automaticamente após a homogeneização.' : 'Agitar branco e amostra para homogeneização completa.'}
                      </div>
                    </div>
                    <button
                      onClick={etapaAtual === 8 ? handleHomogenizar1 : etapaAtual === 11 ? handleHomogenizar2ETimer : handleHomogenizar3}
                      style={{ background: 'linear-gradient(90deg,#0891b2,#0369a1)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.35)', whiteSpace: 'nowrap' }}
                    >
                      {etapaAtual === 11 ? '🔄 Homogenizar + ⏱ Timer' : '🔄 Homogenizar'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,200,240,0.78)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* ÁGUA DEIONIZADA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="agua" className={itemCls('agua')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(200,230,255,0.80)" label="H₂O" sub="desion." nivel={nivelAgua} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Água Deion.</span>
                </ItemBancada>
              </div>

              {/* HCl 2% */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className={`item-drag ${itemCls('hcl')}`}
                  draggable={isItem('hcl')}
                  onDragStart={e => handleDragStart('hcl', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(220,50,50,0.80)" label="HCl 2%" sub="5 mL" nivel={nivelHcl} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('hcl') ? '🖱️ ' : ''}HCl 2%</span>
                {hclBranco && hclAmostra && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ B+A</span>}
              </div>

              {/* ÁCIDO OXÁLICO 10% */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className={`item-drag ${itemCls('oxalico')}`}
                  draggable={isItem('oxalico')}
                  onDragStart={e => handleDragStart('oxalico', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(250,230,100,0.82)" label="H₂C₂O₄" sub="10% · 1 mL" nivel={nivelOxalico} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('oxalico') ? '🖱️ ' : ''}Ác. Oxálico 10%</span>
                {oxalicoBranco && oxalicoAmostra && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ B+A</span>}
              </div>

              {/* MOLIBDATO DE AMÔNIO 10% */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className={`item-drag ${itemCls('molibdato')}`}
                  draggable={isItem('molibdato')}
                  onDragStart={e => handleDragStart('molibdato', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(245,208,80,0.85)" label="Molibdato" sub="NH₄ 10% · 5 mL" nivel={nivelMolibdato} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('molibdato') ? '🖱️ ' : ''}Molibdato NH₄</span>
                {molibdatoBranco && molibdatoAmostra && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ B+A</span>}
              </div>

              {/* SULFITO DE SÓDIO 17% */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className={`item-drag ${itemCls('sulfito')}`}
                  draggable={isItem('sulfito')}
                  onDragStart={e => handleDragStart('sulfito', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(180,210,240,0.82)" label="Sulfito" sub="Na 17% · 10 mL" nivel={nivelSulfito} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('sulfito') ? '🖱️ ' : ''}Sulfito Na 17%</span>
                {sulfitoBranco && sulfitoAmostra && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>✓ Reação azul</span>}
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

export default SimuladorSilicaAlta;
