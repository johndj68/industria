/**
 * Naftol.jsx — Determinação de Açúcar em Águas — Alfa Naftol (Qualitativo)
 *
 * Fluxo: Amostra → Tubo de Ensaio
 *        → 3 gotas Alfa Naftol → Homogeneizar
 *        → H₂SO₄ conc. (lento, pela parede) → Agitar levemente
 *        → Observar anel roxo → Resultado qualitativo
 *
 * Resultado: Anel roxo = presença de açúcar na água
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import TuboEnsaio from '../components/lab/TuboEnsaio';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragNaftol } from '../hooks/useSimuladorDragNaftol';
import { etapas } from './data/etapasNaftol';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes nftDropFall {
    0%   { transform: translateX(-50%) translateY(0px)  scaleX(1.00) scaleY(0.82); opacity: 0;    }
    6%   { transform: translateX(-50%) translateY(2px)  scaleX(0.87) scaleY(1.12); opacity: 1.00; }
    62%  { transform: translateX(calc(-50% + 1.5px)) translateY(50px)  scaleX(0.90) scaleY(1.07); opacity: 0.90; }
    86%  { transform: translateX(calc(-50% + 2px))   translateY(64px)  scaleX(1.12) scaleY(0.84); opacity: 0.48; }
    100% { transform: translateX(calc(-50% + 2px))   translateY(70px)  scaleX(1.20) scaleY(0.68); opacity: 0;    }
  }
  @keyframes nftDropFall2 {
    0%   { transform: translateX(-50%) translateY(0px)  scaleX(1.00) scaleY(0.86); opacity: 0;    }
    6%   { transform: translateX(-50%) translateY(2px)  scaleX(0.90) scaleY(1.09); opacity: 0.96; }
    58%  { transform: translateX(calc(-50% - 1px))    translateY(46px)  scaleX(0.91) scaleY(1.06); opacity: 0.84; }
    85%  { transform: translateX(calc(-50% - 2px))    translateY(60px)  scaleX(1.10) scaleY(0.86); opacity: 0.44; }
    100% { transform: translateX(calc(-50% - 2px))    translateY(66px)  scaleX(1.18) scaleY(0.70); opacity: 0;    }
  }
  @keyframes nftDropFall3 {
    0%   { transform: translateX(-50%) translateY(0px)  scaleX(1.00) scaleY(0.84); opacity: 0;    }
    6%   { transform: translateX(-50%) translateY(2px)  scaleX(0.85) scaleY(1.13); opacity: 0.94; }
    65%  { transform: translateX(calc(-50% + 1px))    translateY(53px)  scaleX(0.89) scaleY(1.08); opacity: 0.82; }
    87%  { transform: translateX(calc(-50% + 2.5px))  translateY(67px)  scaleX(1.14) scaleY(0.82); opacity: 0.40; }
    100% { transform: translateX(calc(-50% + 2.5px))  translateY(73px)  scaleX(1.22) scaleY(0.66); opacity: 0;    }
  }
  @keyframes nftVibrar {
    0%,100% { transform: translateX(0)    rotate(0deg);    }
    10%     { transform: translateX(-5px) rotate(-2.5deg); }
    22%     { transform: translateX(5px)  rotate(2.5deg);  }
    34%     { transform: translateX(-4px) rotate(-1.5deg); }
    46%     { transform: translateX(4px)  rotate(1.5deg);  }
    58%     { transform: translateX(-2px) rotate(-0.8deg); }
    70%     { transform: translateX(2px)  rotate(0.8deg);  }
    84%     { transform: translateX(-1px) rotate(-0.3deg); }
  }
  @keyframes nftVibrarLeve {
    0%,100% { transform: translateX(0) rotate(0deg);    }
    15%     { transform: translateX(-3px) rotate(-1.2deg); }
    30%     { transform: translateX(3px)  rotate(1.2deg);  }
    50%     { transform: translateX(-2px) rotate(-0.7deg); }
    65%     { transform: translateX(2px)  rotate(0.7deg);  }
    80%     { transform: translateX(-1px) rotate(-0.3deg); }
  }
  @keyframes nftAcidStream {
    0%   { transform: scaleY(0);    opacity: 0;    }
    5%   { transform: scaleY(0.02); opacity: 1;    }
    55%  { transform: scaleY(1);    opacity: 0.90; }
    82%  { transform: scaleY(1);    opacity: 0.70; }
    100% { transform: scaleY(1);    opacity: 0;    }
  }
  @keyframes nftAcidDrop {
    0%   { transform: translateY(0px)  scale(0.35); opacity: 0;    }
    12%  { transform: translateY(6px)  scale(1.00); opacity: 0.95; }
    72%  { transform: translateY(58px) scale(0.90); opacity: 0.85; }
    100% { transform: translateY(70px) scale(0.50); opacity: 0;    }
  }
  @keyframes nftAnelPulse {
    0%,100% { opacity: 0.78; }
    50%     { opacity: 0.96; }
  }
  .nft-vibrar {
    animation: nftVibrar 0.60s ease-in-out;
    transform-origin: center bottom;
  }
  .nft-vibrar-leve {
    animation: nftVibrarLeve 0.70s ease-in-out;
    transform-origin: center bottom;
  }
`;


/* ═══════════════════════════════════════════════════════════
   COMPONENTE: Gota de Alfa Naftol — teardrop com física realista
═══════════════════════════════════════════════════════════ */
const GotaNaftolCaindo = ({ offsetX = 0, animName = 'nftDropFall', delay = 0, animKey = 'a' }) => {
  // ID único por instância para o gradiente SVG não colidir
  const gid = `ndg${String(animKey).replace(/\W/g, '')}`;
  return (
    <div
      key={animKey}
      style={{
        position: 'absolute',
        left: `calc(50% + ${offsetX}px)`,
        top: 2,
        width: 14,
        height: 30,
        opacity: 0,           // invisível antes do delay
        pointerEvents: 'none',
        zIndex: 30,
        animationName: animName,
        animationDuration: '0.80s',
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards', // não 'both' — não aplica frame 0 antes do delay
        animationTimingFunction: 'cubic-bezier(0.38, 0.04, 0.82, 0.58)',
      }}
    >
      <svg width="14" height="30" viewBox="0 0 14 30">
        <defs>
          {/* Gradiente radial único por gota — brilho interno realista */}
          <radialGradient id={gid} cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="rgba(200,135,255,0.98)" />
            <stop offset="40%"  stopColor="rgba(118,0,178,0.93)" />
            <stop offset="100%" stopColor="rgba(65,0,115,0.90)" />
          </radialGradient>
        </defs>

        {/* Cauda fina curvada — fio de desprendimento do gotejador */}
        <path d="M 7,1 C 7.3,3 6.7,6 7,10"
          stroke="rgba(148,28,210,0.38)" strokeWidth="0.85"
          fill="none" strokeLinecap="round" />

        {/* Corpo teardrop — estreito no topo, arredondado na base */}
        <path d="M 7,10 C 3.5,13.5 2,18.5 2,22 C 2,26 4.2,29 7,29 C 9.8,29 12,26 12,22 C 12,18.5 10.5,13.5 7,10 Z"
          fill={`url(#${gid})`} />

        {/* Borda translúcida — profundidade de vidro */}
        <path d="M 7,10 C 3.5,13.5 2,18.5 2,22 C 2,26 4.2,29 7,29 C 9.8,29 12,26 12,22 C 12,18.5 10.5,13.5 7,10 Z"
          fill="none"
          stroke="rgba(185,80,240,0.28)"
          strokeWidth="0.75" />

        {/* Reflexo primário — mancha de luz (canto superior esquerdo) */}
        <ellipse cx="5.0" cy="16.5" rx="1.5" ry="3.0"
          fill="rgba(232,200,255,0.52)"
          transform="rotate(-14 5 16.5)" />

        {/* Especular puntual — ponto de luz */}
        <circle cx="9.8" cy="23" r="0.9" fill="rgba(255,255,255,0.26)" />

        {/* Luz difusa inferior — translucência da base */}
        <ellipse cx="7" cy="26.5" rx="2.2" ry="1.2"
          fill="rgba(200,150,255,0.15)" />
      </svg>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════
   COMPONENTE: Tubo de Ensaio com sobreposição do Anel Roxo
═══════════════════════════════════════════════════════════ */
// Mirrors TuboConicoSVG geometry — anel na marca de 2 mL (interface ácido/amostra)
// yOf(ml) = topY + coneH * (1 - ml/10)  →  yOf(2) ≈ 133.6
// xLi(y)  = CX - (topWi - (topWi-botWi) * (y-topY)/coneH)  →  rx ≈ 8.3
const RING_Y  = 44 + 112 * (1 - 2 / 10);          // ≈ 133.6  (2 mL mark)
const RING_RX = 25 - 19 * (RING_Y - 44) / 112 - 1.5; // ≈  8.3

const TuboComAnel = ({ nivel, cor, anelRoxo, animando, vortexAng }) => {

  return (
    <div style={{ position: 'relative', width: 96, height: 200 }}>
      <TuboEnsaio nivel={nivel} cor={cor} animando={animando} vortexAng={vortexAng} />
      {anelRoxo && (
        <svg
          width="96" height="200" viewBox="0 0 96 200"
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {/* Halo externo difuso */}
          <ellipse cx={44} cy={RING_Y} rx={RING_RX + 7} ry={11}
            fill="rgba(112,0,180,0.08)" />
          {/* Halo médio */}
          <ellipse cx={44} cy={RING_Y} rx={RING_RX + 3} ry={6}
            fill="rgba(112,0,180,0.13)" />
          {/* Anel principal */}
          <ellipse cx={44} cy={RING_Y} rx={RING_RX} ry={3.2}
            fill="rgba(100,0,155,0.86)"
            style={{ animation: 'nftAnelPulse 2.2s ease-in-out infinite' }} />
          {/* Highlight especular */}
          <ellipse cx={44 - RING_RX * 0.12} cy={RING_Y - 1}
            rx={RING_RX * 0.62} ry={1.2}
            fill="rgba(215,175,255,0.42)" />
          {/* Linha-guia e label (overflow visible, fora dos 96px) */}
          <line
            x1={44 + RING_RX + 1} y1={RING_Y}
            x2={44 + RING_RX + 14} y2={RING_Y - 10}
            stroke="rgba(192,132,252,0.65)" strokeWidth="0.8" strokeDasharray="3,2"
          />
          <text x={44 + RING_RX + 16} y={RING_Y - 11}
            fontSize="6" fill="rgba(192,132,252,0.90)" fontWeight="700" fontFamily="sans-serif">
            anel roxo
          </text>
          <text x={44 + RING_RX + 16} y={RING_Y - 3}
            fontSize="5.5" fill="rgba(167,139,250,0.70)" fontFamily="monospace">
            @ 2 mL
          </text>
        </svg>
      )}
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorNaftol = () => {
  useDragOverlay();

  // ── Injeta keyframes ──────────────────────────────────
  useEffect(() => {
    const sid = 'nft-anim-styles';
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

  // ── Tubo de ensaio ────────────────────────────────────
  const [nivelTubo, setNivelTubo] = useState(0);
  const [corTubo,   setCorTubo]   = useState('rgba(220,235,255,0.08)');

  // ── Frascos (nível visual) ────────────────────────────
  const [nivelAmostra,    setNivelAmostra]    = useState(82);
  const [nivelAlfaNaftol, setNivelAlfaNaftol] = useState(80);
  const [nivelAcido,      setNivelAcido]      = useState(78);

  // ── Progresso da análise ──────────────────────────────
  const [amostraNoTubo,       setAmostraNoTubo]       = useState(false);
  const [alfaNaftolAdicionado,setAlfaNaftolAdicionado] = useState(false);
  const [tuboHom1,            setTuboHom1]            = useState(false);
  const [acidoAdicionado,     setAcidoAdicionado]     = useState(false);
  const [acidoPourando,       setAcidoPourando]        = useState(false);
  const [homogeneizacaoFinal, setHomogeneizacaoFinal] = useState(false);
  const [anelRoxoFormado,     setAnelRoxoFormado]     = useState(false);

  // ── Animações ─────────────────────────────────────────
  const [hitKey,      setHitKey]      = useState(0);
  const [tuboVibrar,  setTuboVibrar]  = useState('');    // '' | 'forte' | 'leve'
  const [mostrarGotas,setMostrarGotas]= useState(false);
  const [gotasKey,    setGotasKey]    = useState(0);

  // ── TIMER: animação drops alfa naftol (step 1 → step 2) ──
  useEffect(() => {
    if (!alfaNaftolAdicionado || tuboHom1) return;
    setGotasKey(k => k + 1);
    setMostrarGotas(true);
    // última gota: delay 1500ms + queda 800ms = 2300ms; folga extra
    const id = setTimeout(() => {
      setMostrarGotas(false);
      setNivelTubo(55);
      setCorTubo('rgba(185,215,248,0.70)');
    }, 2800);
    return () => clearTimeout(id);
  }, [alfaNaftolAdicionado]);

  // ── TIMER: adição lenta de ácido (step 3) ─────────────
  useEffect(() => {
    if (!acidoPourando) return;
    const id = setTimeout(() => {
      setAcidoPourando(false);
      setAcidoAdicionado(true);
      setNivelTubo(72); // nível sobe com os ~2 mL de ácido
      setCorTubo('rgba(178,212,248,0.72)'); // líquido permanece incolor/água
      celebrarAcerto();
      proximaEtapa(); // → step 4
    }, 2500);
    return () => clearTimeout(id);
  }, [acidoPourando]);

  // ── TIMER: step 5 — avança direto após anel roxo (sem botão) ──
  useEffect(() => {
    if (etapaAtual !== 5) return;
    const id = setTimeout(() => proximaEtapa(), 3000); // 3s visível antes do modal
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── TIMER: auto-conclusão na última etapa ─────────────
  useEffect(() => {
    if (etapaAtual !== 6) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 300);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragNaftol(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra, setNivelAlfaNaftol, setNivelAcido,
    setNivelTubo, setCorTubo,
    setAmostraNoTubo, setAlfaNaftolAdicionado, setAcidoPourando,
  });

  // ── Click: agitar (step 2) ────────────────────────────
  const handleClicarTuboAgitar = () => {
    if (etapaAtual !== 2 || !alfaNaftolAdicionado) return;
    setHitKey(k => k + 1);
    setTuboVibrar('forte');
    setTimeout(() => {
      setTuboVibrar('');
      setTuboHom1(true);
      celebrarAcerto();
      proximaEtapa(); // → step 3
    }, 650);
  };

  // ── Click: agitar levemente (step 4) → forma anel ────
  const handleClicarTuboFinal = () => {
    if (etapaAtual !== 4 || !acidoAdicionado) return;
    setHitKey(k => k + 1);
    setTuboVibrar('leve');
    setTimeout(() => {
      setTuboVibrar('');
      setAnelRoxoFormado(true);
      setHomogeneizacaoFinal(true);
      setCorTubo('rgba(178,212,248,0.72)'); // líquido permanece incolor — só anel é roxo
      celebrarAcerto(150);
      proximaEtapa(); // → step 5
    }, 850);
  };

  // Classe de vibração do tubo
  const tuboClass = tuboVibrar === 'forte' ? 'nft-vibrar'
    : tuboVibrar === 'leve'  ? 'nft-vibrar-leve'
    : '';

  // O tubo pode ser clicado nos steps 2 e 4
  const tuboClickavel = etapaAtual === 2 || etapaAtual === 4;
  const handleClicarTubo = tuboClickavel
    ? (etapaAtual === 2 ? handleClicarTuboAgitar : handleClicarTuboFinal)
    : undefined;


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
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Muito bem!</h3>
                <p style={{ fontSize: 15, margin: 0 }}>+100 pontos</p>
              </div>
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
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Ação incorreta</h3>
                <p style={{ fontSize: 12, margin: 0 }}>{mensagemErroEtapa}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER ANEL ROXO ── */}
      {anelRoxoFormado && etapaAtual >= 5 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#4c1d95,#6d28d9,#7c3aed)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🟣 Anel Roxo Formado!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Presença de açúcar detectada na amostra
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && anelRoxoFormado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#2e1065)', border: '2px solid #7c3aed', borderRadius: 24, padding: '48px 56px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🟣</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#c084fc', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Açúcar em Águas — Alfa Naftol — Qualitativo
            </p>

            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.30)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>Tipo</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>Qualitativa</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>Indicador</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>Alfa Naftol</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>Reagente</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f87171' }}>H₂SO₄ conc.</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.38)', borderRadius: 14, padding: '18px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Resultado Visual</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#c084fc', marginBottom: 4 }}>
                🟣 Formação de Anel Roxo
              </div>
              <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700, marginBottom: 2 }}>
                Presença de açúcar na água
              </div>
              <div style={{ fontSize: 11, color: '#6d28d9', background: 'rgba(109,40,217,0.15)', borderRadius: 8, padding: '4px 12px', display: 'inline-block', marginTop: 4 }}>
                Resultado qualitativo positivo
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Método Alfa Naftol · Análise qualitativa de açúcares em águas
            </div>

            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#7c3aed,#6d28d9)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
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
        titulo="Açúcar em Águas"
        subtitulo={"Alfa Naftol · Qualitativo\nPresença de açúcar = anel roxo"}
        icone="🟣"
        badges={['💧 ÁGUAS', '🔬 QUALITATIVO']}
        footerLabel="🟣 Alfa Naftol"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 680 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 15, fontWeight: 900, marginBottom: 18, letterSpacing: 0.8 }}>
            🟣 Bancada — Determinação de Açúcar em Águas (Alfa Naftol)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '20px 18px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>

              {/* ─ COL 1: Informações do método ─ */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(0,0,0,0.22)', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(124,58,237,0.18)', minWidth: 148, alignSelf: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#c084fc', letterSpacing: 0.6, textTransform: 'uppercase' }}>Método</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Análise', val: 'Qualitativa', cor: '#a78bfa' },
                    { label: 'Indicador', val: 'Alfa Naftol', cor: '#c084fc' },
                    { label: 'Reagente', val: 'H₂SO₄ conc.', cor: '#f87171' },
                    { label: 'Resultado', val: 'Anel Roxo', cor: anelRoxoFormado ? '#c084fc' : '#4b5563' },
                  ].map(({ label, val, cor }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 8, color: '#64748b' }}>{label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: cor }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 8 }}>
                  <div style={{ fontSize: 7.5, color: '#475569', lineHeight: 1.5 }}>
                    Açúcar reduz α-naftol<br />
                    com H₂SO₄ → anel roxo
                  </div>
                </div>
              </div>

              {/* ─ COL 2: Tubo de Ensaio (elemento principal) ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop
                  id="tubo"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                >
                  <div className={dropCls('tubo')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.20)', borderRadius: 14, padding: '10px 18px', cursor: tuboClickavel ? 'pointer' : 'default' }}>

                    {/* Drops caindo — container acima do tubo */}
                    <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                      {mostrarGotas && (
                        <>
                          <GotaNaftolCaindo key={`n1-${gotasKey}`} offsetX={-5} animName="nftDropFall"  delay={0}    animKey={`n1-${gotasKey}`} />
                          <GotaNaftolCaindo key={`n2-${gotasKey}`} offsetX={1}  animName="nftDropFall2" delay={750}  animKey={`n2-${gotasKey}`} />
                          <GotaNaftolCaindo key={`n3-${gotasKey}`} offsetX={6}  animName="nftDropFall3" delay={1500} animKey={`n3-${gotasKey}`} />
                        </>
                      )}
                      {acidoPourando && (
                        <>
                          {/* Fio principal — scaleY GPU-acelerado, cresce de cima para baixo */}
                          <div style={{
                            position: 'absolute',
                            left: 'calc(50% - 2px)',
                            top: 4,
                            width: 4,
                            height: 66,
                            background: 'linear-gradient(rgba(154,52,18,0.95) 0%, rgba(200,100,30,0.72) 55%, rgba(154,52,18,0.06) 100%)',
                            borderRadius: '0 0 4px 4px',
                            transformOrigin: 'top center',
                            animation: 'nftAcidStream 2.5s cubic-bezier(0.25,0.1,0.25,1) forwards',
                            pointerEvents: 'none',
                            zIndex: 30,
                          }} />
                          {/* Gota na ponta do fio */}
                          <div style={{
                            position: 'absolute',
                            left: 'calc(50% - 5px)',
                            top: 6,
                            width: 10,
                            height: 13,
                            borderRadius: '50% 50% 62% 62%',
                            background: 'radial-gradient(circle at 40% 40%, rgba(220,130,60,0.9), rgba(154,52,18,0.88))',
                            animation: 'nftAcidDrop 2.5s ease-in forwards',
                            pointerEvents: 'none',
                            zIndex: 31,
                          }} />
                        </>
                      )}
                    </div>

                    {/* Tubo com overlay de anel roxo */}
                    <div
                      key={hitKey}
                      className={tuboClass}
                      onClick={handleClicarTubo}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <TuboComAnel
                        nivel={nivelTubo}
                        cor={corTubo}
                        anelRoxo={anelRoxoFormado}
                        animando={false}
                        vortexAng={0}
                      />
                    </div>

                    {/* Labels de status */}
                    <div style={{ textAlign: 'center', marginTop: 2 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: tuboClickavel ? '#c084fc' : '#e7e5e4' }}>
                        {tuboClickavel ? '🖱️ Clique para agitar' : 'Tubo de Ensaio'}
                      </div>
                      <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 2 }}>
                        {anelRoxoFormado         ? '🟣 Anel roxo formado!'
                          : homogeneizacaoFinal  ? '⚗️ Aguardando observação'
                          : acidoAdicionado      ? '⚗️ H₂SO₄ adicionado · Agitar levemente'
                          : acidoPourando        ? '⏳ Adicionando ácido vagarosamente...'
                          : tuboHom1             ? '✓ Homogeneizado · Adicione H₂SO₄'
                          : alfaNaftolAdicionado  ? '🟣 Alfa Naftol adicionado · Agitar'
                          : amostraNoTubo        ? '💧 Amostra no tubo · Adicione Alfa Naftol'
                          : 'Vazio — adicione a amostra'}
                      </div>
                    </div>
                  </div>
                </ZonaDrop>
              </div>


            </div>{/* fim zona superior */}

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,200,240,0.78)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
                {amostraNoTubo && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ No tubo</span>}
              </div>

              {/* ALFA NAFTOL */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  className={`item-drag ${itemCls('alfaNaftol')}`}
                  draggable={isItem('alfaNaftol')}
                  onDragStart={e => handleDragStart('alfaNaftol', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <FrascoReagente
                    cor="rgba(118,0,178,0.82)"
                    label="Alfa Naftol"
                    sub="Indicador"
                    nivel={nivelAlfaNaftol}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>
                  {isItem('alfaNaftol') ? '🖱️ ' : ''}Alfa Naftol
                </span>
                {alfaNaftolAdicionado
                  ? <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ 3 gotas adicionadas</span>
                  : <span style={{ fontSize: 8, color: '#64748b' }}>Indicador · 3 gotas</span>
                }
              </div>

              {/* H₂SO₄ CONCENTRADO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  className={`item-drag ${itemCls('acido')}`}
                  draggable={isItem('acido')}
                  onDragStart={e => handleDragStart('acido', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <FrascoReagente
                    cor="rgba(180,60,14,0.86)"
                    label="H₂SO₄"
                    sub="Conc."
                    nivel={nivelAcido}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>
                  {isItem('acido') ? '🖱️ ' : ''}H₂SO₄ Concentrado
                </span>
                {acidoAdicionado
                  ? <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado (~2 mL)</span>
                  : acidoPourando
                    ? <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⏳ Adicionando...</span>
                    : <span style={{ fontSize: 8, color: '#ef4444', fontWeight: 700 }}>⚠ Adição lenta · cuidado</span>
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

export default SimuladorNaftol;
