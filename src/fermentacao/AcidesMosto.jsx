/**
 * AcidesMosto.jsx — Determinação de Acidez em Mosto
 *
 * Fluxo: Mosto → Proveta (50 mL) → Béquer 100 mL + Peixinho
 *        → Agitador Magnético → Eletrodo pH
 *        → Bureta NaOH 1 mol/L → Ligar Agitador
 *        → Titular gota a gota → Ponto final pH 8,7 → Resultado
 *
 * Titulante: NaOH 1 mol/L · Ponto final: pH 8,7 · g H₂SO₄/L
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import BequerSVG from '../components/lab/BequerSVG';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import BuretaSVG from '../components/lab/BuretaSVG';
import GotaCaindo from '../components/lab/GotaCaindo';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragMosto } from '../hooks/useSimuladorDragMosto';
import { etapas } from './data/etapasMosto';


/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes amDropFall {
    0%  { transform:translateX(-50%) translateY(0);  opacity:0; }
    6%  { opacity:1; }
    65% { transform:translateX(-50%) translateY(48px); opacity:.90;}
    100%{ transform:translateX(-50%) translateY(68px); opacity:0; }
  }
  @keyframes amDropFall2 {
    0%  { transform:translateX(-50%) translateY(0);  opacity:0; }
    6%  { opacity:.85;}
    65% { transform:translateX(-50%) translateY(44px); opacity:.75;}
    100%{ transform:translateX(-50%) translateY(62px); opacity:0; }
  }
  @keyframes amDropFall3 {
    0%  { transform:translateX(-50%) translateY(0);  opacity:0; }
    6%  { opacity:.70;}
    65% { transform:translateX(-50%) translateY(52px); opacity:.60;}
    100%{ transform:translateX(-50%) translateY(72px); opacity:0; }
  }
  @keyframes amVibrar {
    0%,100%{ transform:translateX(0) rotate(0deg); }
    12%{ transform:translateX(-5px) rotate(-2deg); }
    25%{ transform:translateX(5px)  rotate(2deg);  }
    38%{ transform:translateX(-3px) rotate(-1.2deg);}
    52%{ transform:translateX(3px)  rotate(1.2deg); }
    65%{ transform:translateX(-2px) rotate(-.6deg); }
    78%{ transform:translateX(2px)  rotate(.6deg);  }
    90%{ transform:translateX(-1px) rotate(-.2deg); }
  }
  .am-vibrar{ animation:amVibrar .55s ease-in-out; transform-origin:center bottom; }
`;

/* ── pH durante titulação ── */
const calcPhTitracao = (v, vEp) => {
  if (v <= 0 || vEp <= 0) return 3.80; // mosto inicia mais ácido que vinho
  const r = v / vEp;
  if (r >= 1.10) return parseFloat(Math.min(11.5, 8.7 + (r - 1.0) * 5).toFixed(2));
  if (r >= 0.97)  return parseFloat((5.8 + (r - 0.97) / 0.13 * 2.9).toFixed(2));
  if (r >= 0.70)  return parseFloat((4.5 + (r - 0.70) / 0.27 * 1.3).toFixed(2));
  return parseFloat((3.8 + r / 0.70 * 0.7).toFixed(2));
};

const calcAcidez = (v) => parseFloat((v * 49 / 50).toFixed(3));


/* ═══════════════════════════════════════════════════════════
   SVG — PEIXINHO QUÍMICO
═══════════════════════════════════════════════════════════ */
const PeixinhoSVG = ({ usado = false }) => (
  <svg width="56" height="32" viewBox="0 0 56 32" opacity={usado ? 0.35 : 1}>
    <defs>
      <linearGradient id="amPxGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#d4d4d8" />
        <stop offset="50%"  stopColor="#a1a1aa" />
        <stop offset="100%" stopColor="#71717a" />
      </linearGradient>
    </defs>
    <ellipse cx={28} cy={29} rx={22} ry={3.5} fill="rgba(0,0,0,0.14)" />
    <ellipse cx={28} cy={14} rx={24} ry={10}
      fill="url(#amPxGrad)" stroke="#71717a" strokeWidth="1.2" />
    <ellipse cx={20} cy={10.5} rx={6} ry={3.5}
      fill="rgba(255,255,255,0.32)" transform="rotate(-15 20 10.5)" />
    <ellipse cx={6}  cy={14} rx={4} ry={8} fill="rgba(240,240,245,0.85)" />
    <ellipse cx={50} cy={14} rx={4} ry={8} fill="rgba(240,240,245,0.85)" />
    <text x={28} y={18} textAnchor="middle" fontSize="7"
      fill="#3f3f46" fontFamily="sans-serif" fontWeight="700">peixinho</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — AGITADOR MAGNÉTICO
═══════════════════════════════════════════════════════════ */
const AgitadorSVG = ({ ativo = false }) => (
  <svg width="150" height="66" viewBox="0 0 150 66">
    <defs>
      <linearGradient id="amAgBd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>
    <ellipse cx={75} cy={64} rx={62} ry={4} fill="rgba(0,0,0,0.16)" />
    <g><rect x={4} y={8} width={142} height={52} rx={8} fill="url(#amAgBd)" stroke="#111827" strokeWidth="1.4" /></g>
    <rect x={7} y={8} width={136} height={26} rx={6}
      fill={ativo ? '#1e2d20' : '#1a2535'} stroke="#0d1620" strokeWidth="1" />
    {ativo && (
      <>
        {/* Barra girando no plano horizontal */}
        <rect x={75-14} y={18.5} width={28} height={5} rx={2.5}
          fill="rgba(34,197,94,0.82)" stroke="rgba(34,197,94,0.50)" strokeWidth="0.8">
          <animateTransform attributeName="transform" type="rotate"
            from="0 75 21" to="360 75 21" dur="0.75s" repeatCount="indefinite" />
        </rect>
        <rect x={75-13} y={19.2} width={14} height={2} rx={1}
          fill="rgba(255,255,255,0.35)">
          <animateTransform attributeName="transform" type="rotate"
            from="0 75 21" to="360 75 21" dur="0.75s" repeatCount="indefinite" />
        </rect>
        <ellipse cx={75} cy={21} rx={18} ry={6} fill="none"
          stroke="rgba(34,197,94,0.20)" strokeWidth="1.2" />
        <circle cx={75} cy={21} r={2.5} fill="rgba(34,197,94,0.70)" />
      </>
    )}
    {!ativo && (
      <>
        <rect x={75-12} y={18.5} width={24} height={5} rx={2.5}
          fill="rgba(71,85,105,0.55)" stroke="rgba(100,116,139,0.30)" strokeWidth="0.8" />
        <circle cx={75} cy={21} r={2} fill="rgba(100,116,139,0.35)" />
      </>
    )}
    <rect x={9} y={38} width={132} height={16} rx={4}
      fill="#0f172a" stroke="#334155" strokeWidth="0.7" />
    <circle cx={24} cy={46} r={5}
      fill={ativo ? '#22c55e' : '#374151'} stroke={ativo ? '#16a34a' : '#4b5563'} strokeWidth="0.7" />
    {ativo && (
      <circle cx={24} cy={46} r={8} fill="none" stroke="rgba(34,197,94,0.35)" strokeWidth="1.5">
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
      </circle>
    )}
    <text x={24} y={49} textAnchor="middle" fontSize="8" fill={ativo ? 'white' : '#64748b'} fontFamily="monospace">⏻</text>
    <text x={85} y={49} textAnchor="middle" fontSize="6.5"
      fill={ativo ? '#86efac' : '#475569'} fontFamily="monospace">
      {ativo ? '200 RPM · AGITANDO' : 'AGITADOR MAGNÉTICO'}
    </text>
    {[16,66,116].map(x => <rect key={x} x={x} y={59} width={7} height={4} rx={1.5} fill="#0a0f1a" />)}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — ELETRODO DE pH
═══════════════════════════════════════════════════════════ */
const EletrodoSVG = ({ imerso = false }) => (
  <svg width="44" height="126" viewBox="0 0 44 126" opacity={imerso ? 0.18 : 1}>
    <defs>
      <linearGradient id="amElC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1c1c1c" />
        <stop offset="40%" stopColor="#303030" />
        <stop offset="100%" stopColor="#1c1c1c" />
      </linearGradient>
    </defs>
    <ellipse cx={22} cy={124} rx={9} ry={3} fill="rgba(0,0,0,0.14)" />
    <rect x={19} y={0} width={6} height={26} rx={3} fill="#1a1a1a" />
    {[3,7,11,15,19,23].map(y => (
      <rect key={y} x={18} y={y} width={8} height={2} rx={1.2} fill="rgba(0,0,0,0.50)" />
    ))}
    <rect x={13} y={25} width={18} height={10} rx={3.5} fill="#3d3d3d" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx={19.5} cy={30} r={1.3} fill="#707070" />
    <circle cx={24.5} cy={30} r={1.3} fill="#707070" />
    <rect x={16} y={35} width={12} height={5} rx={2.5} fill="#c0392b" stroke="#8b1a0e" strokeWidth="0.7" />
    <rect x={16} y={40} width={12} height={62} rx={3}
      fill="url(#amElC)" stroke="#0d0d0d" strokeWidth="0.8" />
    <rect x={17} y={47} width={11} height={32} rx={1.5} fill="#f0f0f0" stroke="#c8c8c8" strokeWidth="0.4" />
    <rect x={17} y={47} width={11} height={4} rx={1.5} fill="#c0392b" />
    <text x={22} y={50} textAnchor="middle" fontSize="3" fill="white" fontFamily="Arial" fontWeight="700">HACH</text>
    <text x={22} y={57} textAnchor="middle" fontSize="3.5" fill="#1a1a1a" fontFamily="Arial" fontWeight="700">PHC101</text>
    <text x={22} y={64} textAnchor="middle" fontSize="3" fill="#333" fontFamily="Arial">pH 0–14</text>
    <text x={22} y={71} textAnchor="middle" fontSize="5" fill="#c0392b" fontFamily="Arial" fontWeight="900">pH</text>
    <rect x={14} y={102} width={16} height={4} rx={2} fill="#2a2a2a" stroke="#0d0d0d" strokeWidth="0.8" />
    <rect x={20.5} y={106} width={3} height={6} rx={0.8} fill="rgba(190,220,255,0.55)" stroke="#8fb8d8" strokeWidth="0.6" />
    <circle cx={22} cy={117} r={6} fill="rgba(195,230,255,0.72)" stroke="#8fb8d8" strokeWidth="1.3" />
    <circle cx={22} cy={117} r={4} fill="rgba(155,210,240,0.38)" />
    <ellipse cx={22} cy={114} rx={3} ry={1.4} fill="rgba(200,230,250,0.52)" />
    <ellipse cx={19.5} cy={112.5} rx={1.6} ry={2.5}
      fill="rgba(255,255,255,0.28)" transform="rotate(-20 19.5 112.5)" />
    <text x={22} y={125} textAnchor="middle" fontSize="5" fill="#5a5a5a" fontFamily="sans-serif">Eletrodo pH</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — DISPLAY DE pH
═══════════════════════════════════════════════════════════ */
const PhDisplaySVG = ({ pHAtual, pontoFinal, eletrodoImergido, volumeGasto }) => (
  <svg width="148" height="108" viewBox="0 0 148 108">
    <defs>
      <linearGradient id="amPdBd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e2d3d" />
        <stop offset="100%" stopColor="#0a1628" />
      </linearGradient>
      <linearGradient id="amPdLc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a1200" />
        <stop offset="100%" stopColor="#050900" />
      </linearGradient>
    </defs>
    <rect x={3} y={3} width={142} height={102} rx={9}
      fill="url(#amPdBd)" stroke="#0d1e30" strokeWidth="1.4" />
    <text x={74} y={17} textAnchor="middle" fontSize="6"
      fill="#4a9fd4" fontFamily="monospace" fontWeight="700">pHMETRO · TITULAÇÃO</text>
    <circle cx={132} cy={11} r={4}
      fill={pontoFinal ? '#22c55e' : eletrodoImergido ? '#3b82f6' : '#334155'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
    {pontoFinal && (
      <circle cx={132} cy={11} r={7} fill="none" stroke="rgba(34,197,94,0.38)" strokeWidth="1.4">
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
      </circle>
    )}
    <rect x={8} y={24} width={132} height={66} rx={5}
      fill="url(#amPdLc)" stroke="#006622" strokeWidth="0.9" />
    <rect x={10} y={26} width={128} height={62} rx={4} fill="rgba(5,15,0,0.38)" />
    {pontoFinal ? (
      <>
        <text x={74} y={44} textAnchor="middle" fontSize="7.5" fill="#22c55e" fontFamily="monospace">PONTO FINAL ✓</text>
        <text x={74} y={67} textAnchor="middle" fontSize="30"
          fill="#00ff55" fontFamily="'Courier New', monospace" fontWeight="700">{pHAtual.toFixed(2)}</text>
        <text x={74} y={79} textAnchor="middle" fontSize="7" fill="#16a34a" fontFamily="monospace">pH 8,7 atingido</text>
      </>
    ) : eletrodoImergido ? (
      <>
        <text x={12} y={37} fontSize="6" fill="#3a5a2a" fontFamily="monospace">CH1 · pH  ATC ✓</text>
        <text x={74} y={67} textAnchor="middle" fontSize="30"
          fill={pHAtual >= 8.2 ? '#fbbf24' : '#aaff00'}
          fontFamily="'Courier New', monospace" fontWeight="700">{pHAtual.toFixed(2)}</text>
        <text x={136} y={67} textAnchor="end" fontSize="8" fill="#66aa00" fontFamily="monospace">pH</text>
        <text x={12} y={80} fontSize="6.5"
          fill={pHAtual >= 8.2 ? '#f59e0b' : '#448800'} fontFamily="monospace">
          {pHAtual >= 8.2 ? '→ PRÓXIMO DO PONTO FINAL!' : `V NaOH: ${volumeGasto.toFixed(1)} mL`}
        </text>
      </>
    ) : (
      <>
        <text x={74} y={50} textAnchor="middle" fontSize="8" fill="#2a4a1a" fontFamily="monospace">AGUARDANDO</text>
        <text x={74} y={66} textAnchor="middle" fontSize="14" fill="#1a3010" fontFamily="'Courier New', monospace">-- . --</text>
        <text x={74} y={79} textAnchor="middle" fontSize="6.5" fill="#162c10" fontFamily="sans-serif">Imergir eletrodo</text>
      </>
    )}
    <text x={74} y={100} textAnchor="middle" fontSize="5.5"
      fill="#1e3a10" fontFamily="sans-serif">Ponto final: pH 8,7</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const AcidesMosto = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'am-anim-styles';
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
  } = useGameState(etapas.length);

  // ── Fontes ────────────────────────────────────────────
  const [nivelMosto,      setNivelMosto]      = useState(85);
  const [nivelNaohFrasco, setNivelNaohFrasco] = useState(82);

  // ── Proveta ───────────────────────────────────────────
  const [nivelProveta,  setNivelProveta]  = useState(0);
  const [provetaCheia,  setProvetaCheia]  = useState(false);

  // ── Béquer 100 mL ─────────────────────────────────────
  const [nivelBequer,    setNivelBequer]    = useState(0);
  const [corBequer,      setCorBequer]      = useState('rgba(220,235,255,0.08)');
  const [amostraNoBequer,setAmostraNoBequer]= useState(false);
  const [peixinhoNoBeq,  setPeixinhoNoBeq]  = useState(false);
  const [bequerNoAgi,    setBequerNoAgi]    = useState(false);

  // ── Agitador / eletrodo ───────────────────────────────
  const [agitando,       setAgitando]       = useState(false);
  const [eletrodoImergido,setEletrodoImergido]=useState(false);

  // ── Bureta NaOH ───────────────────────────────────────
  const [nivelBureta,      setNivelBureta]      = useState(0);
  const [buretaPreenchida, setBuretaPreenchida] = useState(false);
  const [buretaPosicionada,setBuretaPosicionada]= useState(false);
  const [endpointVolume,   setEndpointVolume]   = useState(0);

  // ── Titulação ─────────────────────────────────────────
  const [volumeGasto, setVolumeGasto] = useState(0);
  const [pHAtual,     setPHAtual]     = useState(3.80);
  const [gotejando,   setGotejando]   = useState(false);
  const [pontoFinal,  setPontoFinal]  = useState(false);
  const [hitKey,      setHitKey]      = useState(0);

  // ── TIMER: auto-conclusão após ponto final ─────────────
  useEffect(() => {
    if (etapaAtual !== 7 || !pontoFinal) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2500);
    return () => clearTimeout(id);
  }, [pontoFinal, etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragMosto(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelMosto, setNivelNaoh: () => {},
    setNivelProveta, setProvetaCheia,
    setNivelBequer, setCorBequer, setAmostraNoBequer,
    setPeixinhoNoBeq, setBequerNoAgi,
    setEletrodoImergido,
    setNivelBureta, setBuretaPreenchida, setEndpointVolume,
    setBuretaPosicionada,
    setNivelNaohFrasco,
  });

  // ── Click: Ligar Agitador (step 6) ────────────────────
  const handleLigarAgitador = () => {
    if (etapaAtual !== 6 || !buretaPosicionada) return;
    setAgitando(true);
    celebrarAcerto();
    proximaEtapa(); // → step 7 (titular)
  };

  // ── Click: Bureta — gota a gota (step 7) ──────────────
  const handleClicarBureta = () => {
    if (etapaAtual !== 7 || !buretaPreenchida || !eletrodoImergido || pontoFinal) return;
    const novoVol = parseFloat((volumeGasto + 0.5).toFixed(1));
    setVolumeGasto(novoVol);
    setNivelBureta(n => Math.max(n - 5, 0));
    setGotejando(true);
    setHitKey(k => k + 1);
    const novoPH = calcPhTitracao(novoVol, endpointVolume);
    setPHAtual(novoPH);
    setTimeout(() => setGotejando(false), 400);
    if (novoPH >= 8.70 && !pontoFinal) {
      setPHAtual(8.70);
      setPontoFinal(true);
    }
  };

  const acidezMosto = pontoFinal ? calcAcidez(volumeGasto) : null;
  const mostrarBotaoAgitador = etapaAtual === 6 && buretaPosicionada;


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

      {pontoFinal && etapaAtual >= 7 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#14532d,#166534,#16a34a)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>✅ Ponto Final! pH {pHAtual.toFixed(2)}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              NaOH: <strong>{volumeGasto.toFixed(1)} mL</strong> · Acidez: <strong>{acidezMosto} g H₂SO₄/L</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUSÃO ── */}
      {concluido && pontoFinal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #d97706', borderRadius: 24, padding: '44px 52px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🍯</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fbbf24', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 20px' }}>
              Determinação de Acidez em Mosto · NaOH 1 mol/L · pH 8,7
            </p>
            <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.28)', borderRadius: 14, padding: '14px 22px', marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 8 }}>Dados da Titulação</div>
              <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Método',       val: 'Potenciométrico',    cor: '#fbbf24' },
                  { label: 'Titulante',    val: 'NaOH 1 mol/L',       cor: '#60a5fa' },
                  { label: 'Vol. amostra', val: '50 mL',              cor: '#a78bfa' },
                  { label: 'Ponto final',  val: 'pH 8,7',             cor: '#4ade80' },
                  { label: 'pH final',     val: `${pHAtual.toFixed(2)}`, cor: '#22c55e' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.38)', borderRadius: 14, padding: '14px 24px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Resultados</div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>NaOH gasto</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace', lineHeight: 1 }}>{volumeGasto.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700 }}>mL</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Acidez Sulfúrica</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', lineHeight: 1 }}>{acidezMosto}</div>
                  <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700 }}>g H₂SO₄/L</div>
                </div>
              </div>
              <div style={{ marginTop: 8, background: 'rgba(245,158,11,0.08)', borderRadius: 8, padding: '5px 12px', fontSize: 8, color: '#d97706' }}>
                Cálculo: Acidez = V(NaOH) × 49 / 50 · Volume amostra = 50 mL · NaOH 1 mol/L
              </div>
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 18 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#d97706,#b45309)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Acidez em Mosto"
        subtitulo={"NaOH 1 mol/L · Ponto final pH 8,7\nMosto · g H₂SO₄/L"}
        icone="🍯"
        badges={['🍯 FERMENTAÇÃO', '⚗️ TITULAÇÃO']}
        footerLabel="🍯 Acidez em Mosto"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 820 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🍯 Bancada — Determinação de Acidez em Mosto (NaOH 1 mol/L · pH 8,7)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* ─ BURETA + ÁREA DE TITULAÇÃO ─ */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <ZonaDrop id="bureta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={`item-drag ${dropCls('bureta')} ${itemCls('bureta')}`}
                    style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.22))', borderRadius: 12, padding: '8px 14px 4px', border: '1px solid rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                    draggable={false}>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: nivelBureta > 0 ? '#f59e0b' : '#78716c', marginBottom: 2 }}>
                      {nivelBureta > 0 ? 'Bureta 25 mL · NaOH 1 mol/L' : 'Bureta — vazia'}
                    </span>
                    <BuretaSVG nivel={nivelBureta} gotejando={gotejando}
                      ativo={etapaAtual === 7 && buretaPosicionada && !pontoFinal}
                      onClick={handleClicarBureta} />
                    {etapaAtual === 7 && buretaPosicionada && !pontoFinal && (
                      <div style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>↑ Clique na torneira</div>
                    )}
                    {etapaAtual === 5 && (
                      <div style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700, marginTop: 2 }}>↑ Arraste NaOH aqui</div>
                    )}
                  </div>
                </ZonaDrop>

                {/* Gotas */}
                <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                  {gotejando && (
                    <>
                      <GotaCaindo key={`d1-${hitKey}`} offsetX={-4} animName="amDropFall"  delay={0}   animKey={`d1-${hitKey}`} />
                      <GotaCaindo key={`d2-${hitKey}`} offsetX={0}  animName="amDropFall2" delay={110} animKey={`d2-${hitKey}`} />
                      <GotaCaindo key={`d3-${hitKey}`} offsetX={4}  animName="amDropFall3" delay={220} animKey={`d3-${hitKey}`} />
                    </>
                  )}
                </div>

                {/* Área de titulação */}
                <ZonaDrop id="area_titulacao" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <div className={dropCls('area_titulacao')} style={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '6px 8px', border: (bequerNoAgi || buretaPosicionada) ? '1px solid rgba(245,158,11,0.30)' : '2px dashed rgba(255,255,255,0.15)' }}>

                    {/* Béquer no agitador */}
                    {bequerNoAgi && (
                      <div style={{ position: 'relative', display: 'inline-block', marginBottom: -28, zIndex: 1 }}>
                        <BequerSVG nivel={nivelBequer} cor={corBequer} id="tit" ml={150} key={`bq-${hitKey}`} />
                        {/* Overlay eletrodo */}
                        {eletrodoImergido && (
                          <svg width="78" height="106" viewBox="0 0 78 106"
                            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                            <line x1="39" y1="0" x2="39" y2="18" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                            <rect x="33" y="18" width="12" height="5" rx="2" fill="#475569" />
                            <rect x="35" y="23" width="8" height="3.5" rx="1.5" fill="#c0392b" />
                            <rect x="37" y="26.5" width="4" height="24" rx="1.5" fill="rgba(45,75,105,0.88)" stroke="#334155" strokeWidth="0.8" />
                            <circle cx="39" cy="62" r="6" fill="rgba(195,230,255,0.70)" stroke="#8fb8d8" strokeWidth="1.3" />
                            <circle cx="39" cy="62" r="4" fill="rgba(155,210,240,0.38)" />
                            <ellipse cx="39" cy="59" rx="3" ry="1.4" fill="rgba(200,230,250,0.52)" />
                          </svg>
                        )}
                        {/* Vórtice quando agitando */}
                        {agitando && nivelBequer > 5 && (
                          <svg width="78" height="106" viewBox="0 0 78 106"
                            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                            <ellipse cx="39" cy="35" rx="18" ry="4" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeDasharray="20,62" strokeLinecap="round">
                              <animate attributeName="stroke-dashoffset" from="0" to="-82" dur="1.2s" repeatCount="indefinite" />
                            </ellipse>
                            <ellipse cx="39" cy="37.5" rx="11" ry="2.5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4" strokeDasharray="13,39" strokeLinecap="round">
                              <animate attributeName="stroke-dashoffset" from="0" to="52" dur="0.88s" repeatCount="indefinite" />
                            </ellipse>
                            <ellipse cx="39" cy="39.5" rx="5.5" ry="1.3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" strokeDasharray="7,17" strokeLinecap="round">
                              <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.60s" repeatCount="indefinite" />
                            </ellipse>
                            <ellipse cx="39" cy="40.5" rx="2.5" ry="0.8" fill="rgba(0,0,0,0.25)" />
                          </svg>
                        )}
                        {/* Volume NaOH */}
                        {volumeGasto > 0 && (
                          <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '3px 8px', fontSize: 8, color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700, marginTop: 4 }}>
                            {volumeGasto.toFixed(1)} mL NaOH
                          </div>
                        )}
                      </div>
                    )}

                    {/* Agitador — sempre visível */}
                    <AgitadorSVG ativo={agitando} />

                    {/* Hint quando vazia */}
                    {!bequerNoAgi && !buretaPosicionada && (
                      <div style={{ fontSize: 8.5, color: '#64748b', textAlign: 'center', marginTop: 4 }}>
                        Agitador magnético<br />↑ arraste itens aqui
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: '#a8a29e' }}>
                    {agitando ? '⚙ Titulando'
                      : bequerNoAgi ? '⚙ Béquer no agitador'
                      : 'Plataforma · Agitador'}
                  </span>
                </ZonaDrop>

                {/* Painel titulação (step 7) */}
                {etapaAtual === 7 && buretaPosicionada && eletrodoImergido && (
                  <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.30)', borderRadius: 12, padding: '8px 12px', border: `1px solid ${pontoFinal ? 'rgba(34,197,94,0.40)' : 'rgba(245,158,11,0.30)'}`, textAlign: 'center', minWidth: 120 }}>
                    <div style={{ fontSize: 8, color: '#64748b', marginBottom: 3 }}>Vol. NaOH adicionado</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{volumeGasto.toFixed(1)} mL</div>
                    {!pontoFinal && (
                      <>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', margin: '5px 0 3px' }}>
                          <div style={{ height: '100%', width: `${Math.min((pHAtual - 3.8) / 4.9 * 100, 100)}%`, background: `linear-gradient(90deg,#f59e0b,${pHAtual > 7 ? '#ef4444' : '#d97706'})`, borderRadius: 2, transition: 'width 0.2s' }} />
                        </div>
                        {pHAtual > 7.5 && <div style={{ fontSize: 7.5, color: '#ef4444', fontWeight: 700 }}>⚠️ Próximo ao ponto!</div>}
                        <button onClick={handleClicarBureta}
                          style={{ marginTop: 6, background: 'linear-gradient(90deg,#b45309,#d97706)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                          + 0,5 mL NaOH
                        </button>
                      </>
                    )}
                    {pontoFinal && acidezMosto && (
                      <div style={{ marginTop: 5, fontSize: 10, color: '#22c55e', fontWeight: 700 }}>
                        {acidezMosto} g H₂SO₄/L
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ─ LINHA CENTRAL: PROVETA + BÉQUER ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', gap: 12 }}>

                {/* Proveta */}
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: '6px 4px' }}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta 50 mL</span>
                  {provetaCheia && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>50 mL mosto</span>}
                </ZonaDrop>

                {/* Béquer 100 mL */}
                <ZonaDrop id="bequer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`${dropCls('bequer')} ${itemCls('bequer')}`}
                    style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: (bequerNoAgi || buretaPosicionada) ? 0.18 : 1, transition: 'opacity 0.3s' }}
                    draggable={isItem('bequer') && amostraNoBequer && peixinhoNoBeq && !bequerNoAgi}
                    onDragStart={e => handleDragStart('bequer', e)} onDragEnd={handleDragEnd}>
                    <BequerSVG nivel={nivelBequer} cor={corBequer} id="pr" ml={150} />
                  </div>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('bequer') && amostraNoBequer && peixinhoNoBeq && !bequerNoAgi ? '🖱️ ' : ''}Béquer 100 mL
                  </span>
                  <span style={{ fontSize: 7.5, color: bequerNoAgi ? '#f59e0b' : peixinhoNoBeq ? '#86efac' : amostraNoBequer ? '#fbbf24' : '#94a3b8' }}>
                    {bequerNoAgi ? '⚙ No agitador'
                      : peixinhoNoBeq ? '🍯 + peixinho ✓'
                      : amostraNoBequer ? '🍯 50 mL mosto'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* ─ ELETRODO + pH DISPLAY ─ */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                  <PhDisplaySVG pHAtual={pHAtual} pontoFinal={pontoFinal}
                    eletrodoImergido={eletrodoImergido} volumeGasto={volumeGasto} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div className={`item-drag ${itemCls('eletrodo')}`}
                    draggable={isItem('eletrodo') && !eletrodoImergido}
                    onDragStart={e => handleDragStart('eletrodo', e)} onDragEnd={handleDragEnd}
                    style={{ cursor: isItem('eletrodo') && !eletrodoImergido ? 'grab' : 'default' }}>
                    <EletrodoSVG imerso={eletrodoImergido} />
                  </div>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: eletrodoImergido ? '#fbbf24' : '#e7e5e4' }}>
                    {isItem('eletrodo') && !eletrodoImergido ? '🖱️ ' : ''}Eletrodo pH
                  </span>
                  <span style={{ fontSize: 7.5, color: eletrodoImergido ? '#fbbf24' : '#94a3b8' }}>
                    {eletrodoImergido ? '⚗️ Imerso' : 'PHC101'}
                  </span>
                </div>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ PAINEL LIGAR AGITADOR (step 6) ══════════════════════ */}
            {mostrarBotaoAgitador && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '12px 18px', border: 'rgba(34,211,238,0.22) 1px solid', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>⚙ Ligar o Agitador Magnético para a Titulação</div>
                  <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Iniciar agitação para homogeneizar o mosto durante a adição de NaOH.</div>
                </div>
                <button onClick={handleLigarAgitador}
                  style={{ background: 'linear-gradient(90deg,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.35)', whiteSpace: 'nowrap' }}>
                  ⚙ Ligar Agitador
                </button>
              </div>
            )}

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'flex-end', maxWidth: 420, margin: '0 auto' }}>

              {/* MOSTO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <ItemBancada id="mosto" className={itemCls('mosto')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(215,155,30,0.88)" label="Mosto" sub="Amostra" nivel={nivelMosto} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Mosto</span>
                </ItemBancada>
              </div>

              {/* PEIXINHO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('peixinho')}`}
                  draggable={isItem('peixinho')} onDragStart={e => handleDragStart('peixinho', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <PeixinhoSVG usado={peixinhoNoBeq} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('peixinho') ? '🖱️ ' : ''}Peixinho</span>
                {peixinhoNoBeq && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓ No béquer</span>}
              </div>

              {/* NAOH */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('naoh')}`}
                  draggable={isItem('naoh')} onDragStart={e => handleDragStart('naoh', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(60,90,200,0.85)" label="NaOH" sub="1 mol/L" nivel={nivelNaohFrasco} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('naoh') ? '🖱️ ' : ''}NaOH 1 mol/L</span>
                {buretaPreenchida && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓ Na bureta</span>}
              </div>

            </div>

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

export default AcidesMosto;
