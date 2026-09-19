/**
 * cloreto.jsx — Determinação de Cloretos em Águas
 *
 * Fluxo: Proveta 50 mL → Erlenmeyer Branco → Proveta 50 mL
 *        → Erlenmeyer Amostra → Fenolftaleína → Cromato K₂CrO₄
 *        → AgNO₃ na Bureta → Titulação → Viragem amarelo → mostarda
 *
 * Método: Cromato de Potássio 5% + AgNO₃ 0,1 N ou 0,02 N
 * Fonte: COR-IND-QUA-PO-07 (adaptação)
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import ErlenmeyerSVG from '../components/lab/ErlenmeyerSVG';
import BuretaSVG from '../components/lab/BuretaSVG';
import GotaCaindo from '../components/lab/GotaCaindo';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragCloreto } from '../hooks/useSimuladorDragCloreto';
import { etapas } from './data/etapasCloreto';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_CLORETO = `
  @keyframes alcDropFall {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 1;    }
    65%  { transform: translateX(-50%) translateY(48px);  opacity: 0.90; }
    100% { transform: translateX(-50%) translateY(68px);  opacity: 0;    }
  }
  @keyframes alcDropFall2 {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 0.85; }
    65%  { transform: translateX(-50%) translateY(44px);  opacity: 0.75; }
    100% { transform: translateX(-50%) translateY(62px);  opacity: 0;    }
  }
  @keyframes alcDropFall3 {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 0.70; }
    65%  { transform: translateX(-50%) translateY(52px);  opacity: 0.60; }
    100% { transform: translateX(-50%) translateY(72px);  opacity: 0;    }
  }
  @keyframes cloFenolDrop {
    0%   { opacity: 0; transform: translateY(0); }
    8%   { opacity: 1; transform: translateY(3px); }
    78%  { opacity: 1; transform: translateY(50px); }
    100% { opacity: 0; transform: translateY(60px); }
  }
  @keyframes erlVibrar {
    0%,100% { transform: translateX(0)    rotate(0deg);    }
    12%     { transform: translateX(-5px) rotate(-2deg);   }
    25%     { transform: translateX(5px)  rotate(2deg);    }
    38%     { transform: translateX(-3px) rotate(-1.2deg); }
    52%     { transform: translateX(3px)  rotate(1.2deg);  }
    65%     { transform: translateX(-2px) rotate(-0.6deg); }
    78%     { transform: translateX(2px)  rotate(0.6deg);  }
    90%     { transform: translateX(-1px) rotate(-0.2deg); }
  }
  .erl-vibrar {
    animation: erlVibrar 0.55s ease-in-out;
    transform-origin: center bottom;
  }
`;


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorCloreto = () => {
  useDragOverlay();

  // ── Injeta keyframes de animação ──────────────────────
  useEffect(() => {
    const sid = 'clo-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ESTILOS_CLORETO;
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
  const [nivelAmostra, setNivelAmostra] = useState(82);
  const [nivelAgua,    setNivelAgua]    = useState(80);

  // ── Erlenmeyer Branco ─────────────────────────────────
  const [nivelErlBranco,  setNivelErlBranco]  = useState(0);
  const [corErlBranco,    setCorErlBranco]    = useState('rgba(220,235,255,0.06)');
  const [brancoPreparado, setBrancoPreparado] = useState(false);

  // ── Erlenmeyer Amostra ────────────────────────────────
  const [nivelErlAmostra,  setNivelErlAmostra]  = useState(0);
  const [corErlAmostra,    setCorErlAmostra]    = useState('rgba(220,235,255,0.06)');
  const [erlAmostraPrep,   setErlAmostraPrep]   = useState(false);

  // ── Indicadores / reagentes ───────────────────────────
  const [fenolGotas,        setFenolGotas]        = useState(false);  // timer trigger
  const [fenolKey,          setFenolKey]           = useState(0);     // reset drops anim
  const [cromatoAdicionado, setCromatoAdicionado] = useState(false);
  const [vibrarKey,         setVibrarKey]          = useState(0);

  // ── Titulação ─────────────────────────────────────────
  const [normalidade]                                    = useState('0.1N');
  const [erlenmeyerNaTitulacao,setErlenmeyerNaTitulacao]= useState(false);
  const [endpointVolume,       setEndpointVolume]       = useState(0);
  const [volumeGasto,          setVolumeGasto]          = useState(0);
  const [pontoFinal,           setPontoFinal]           = useState(false);
  const [gotejando,            setGotejando]            = useState(false);
  const [nivelBureta,          setNivelBureta]          = useState(0);
  const [hitKey,               setHitKey]               = useState(0);

  // ── Cor interpolada durante titulação ─────────────────
  // Amarelo vivo → mostarda
  const corSolucao = useMemo(() => {
    if (!cromatoAdicionado) return corErlAmostra;
    if (!erlenmeyerNaTitulacao || endpointVolume === 0) return corErlAmostra;
    if (pontoFinal) return 'rgba(180,120,20,0.92)'; // mostarda
    const p = Math.min(volumeGasto / endpointVolume, 1);
    const r = Math.round(255 - (255 - 180) * p);
    const g = Math.round(215 - (215 - 120) * p);
    const b = Math.round(0   + 20 * p);
    return `rgba(${r},${g},${b},${(0.85 + 0.07 * p).toFixed(2)})`;
  }, [cromatoAdicionado, erlenmeyerNaTitulacao, pontoFinal, volumeGasto, endpointVolume, corErlAmostra]);

  // ── TIMER: fenolftaleína gotas (etapa 4) ──────────────
  useEffect(() => {
    if (!fenolGotas) return;
    setFenolKey(k => k + 1);
    const id = setTimeout(() => {
      setFenolGotas(false);
      celebrarAcerto();
      proximaEtapa();
    }, 2200);
    return () => clearTimeout(id);
  }, [fenolGotas]);

  // ── TIMER: auto-conclusão última etapa (9) ────────────
  useEffect(() => {
    if (etapaAtual !== 9) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragCloreto(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAmostra, setNivelAgua,
    setNivelErlBranco, setCorErlBranco, setBrancoPreparado,
    setNivelErlAmostra, setCorErlAmostra, setErlAmostraPrep,
    setFenolGotas,
    setCromatoAdicionado, setVibrarKey,
    setErlenmeyerNaTitulacao, setEndpointVolume,
    setNivelBureta,
  });

  // ── Clique na torneira da bureta (titulação, etapa 8) ─
  const handleClicarBureta = () => {
    if (etapaAtual !== 8 || !erlenmeyerNaTitulacao || pontoFinal) return;
    const novo = parseFloat((volumeGasto + 0.2).toFixed(1));
    setVolumeGasto(novo);
    setGotejando(true);
    setHitKey(k => k + 1);
    setTimeout(() => setGotejando(false), 660);
    setNivelBureta(prev => Math.max(prev - (0.2 / 50) * 100, 0));
    if (novo >= endpointVolume) {
      setPontoFinal(true);
      setTimeout(() => { celebrarAcerto(200); proximaEtapa(); }, 1600);
    }
  };

  // Derivados visuais
  const erlAmostraVis = !erlenmeyerNaTitulacao;


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

      {/* ── BANNER PONTO FINAL ── */}
      {pontoFinal && etapaAtual === 9 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#78350f,#b45309,#d97706)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🟡 Ponto Final Atingido!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Amarelo vivo → Mostarda · Volume: <strong>{endpointVolume.toFixed(1)} mL</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #eab308', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>💧</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#eab308', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Cloretos em Águas · Indicador: Cromato de Potássio 5%
            </p>

            {/* Dados da titulação */}
            <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.30)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Titulação</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{endpointVolume.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Volume gasto (mL)</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#c4b5fd', fontFamily: 'monospace' }}>AgNO₃ {normalidade}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Titulante</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>🟡 → 🟫</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Viragem</div>
                </div>
              </div>
            </div>

            {/* Resultado */}
            <div style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.35)', borderRadius: 14, padding: '14px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Volume gasto — Registro</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#eab308', fontFamily: 'monospace', lineHeight: 1 }}>
                {endpointVolume.toFixed(1)}
              </div>
              <div style={{ fontSize: 14, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>mL de AgNO₃ {normalidade}</div>
              <div style={{ fontSize: 11, color: '#78716c', marginTop: 8 }}>
                Amarelo vivo → Mostarda · Status: Titulação finalizada com sucesso
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Indicador: K₂CrO₄ 5% · Titulante: AgNO₃ {normalidade} · Viragem: amarelo vivo → mostarda
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#ca8a04,#d97706)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Cloretos em Águas"
        subtitulo={"Cromato de Potássio + AgNO₃\nViragem: Amarelo vivo → Mostarda"}
        icone="💧"
        badges={['💧 ÁGUAS', '⚗️ TITULAÇÃO']}
        footerLabel="💧 Cloretos"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 800 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            💧 Bancada — Determinação de Cloretos em Águas
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '20px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: BURETA + ERLENMEYERS + NORMALIDADE ══ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* ─ COL 1: Bureta + plataforma ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                <ZonaDrop id="bureta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={dropCls('bureta')} style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.22))', borderRadius: 12, padding: '8px 14px 4px', border: '1px solid rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: nivelBureta > 0 ? '#eab308' : '#78716c', marginBottom: 2 }}>
                      {nivelBureta > 0 ? `Bureta 50 mL · AgNO₃ ${normalidade}` : 'Bureta 50 mL — vazia'}
                    </span>
                    <BuretaSVG
                      nivel={nivelBureta} gotejando={gotejando}
                      ativo={etapaAtual === 8 && erlenmeyerNaTitulacao && !pontoFinal}
                      onClick={handleClicarBureta}
                    />
                    {etapaAtual === 8 && erlenmeyerNaTitulacao && !pontoFinal && (
                      <div style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>↑ Clique na torneira</div>
                    )}
                    {etapaAtual === 6 && (
                      <div style={{ fontSize: 8, color: '#eab308', fontWeight: 700, marginTop: 2 }}>↑ Arraste AgNO₃ aqui</div>
                    )}
                  </div>
                </ZonaDrop>

                {/* Gotas caindo */}
                <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                  {gotejando && (
                    <>
                      <GotaCaindo key={`d1-${hitKey}`} offsetX={-4} animName="alcDropFall"  delay={0}   animKey={`d1-${hitKey}`} />
                      <GotaCaindo key={`d2-${hitKey}`} offsetX={0}  animName="alcDropFall2" delay={110} animKey={`d2-${hitKey}`} />
                      <GotaCaindo key={`d3-${hitKey}`} offsetX={4}  animName="alcDropFall3" delay={220} animKey={`d3-${hitKey}`} />
                    </>
                  )}
                </div>

                {/* Plataforma de titulação */}
                <ZonaDrop id="areaTitulacao" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <div className={dropCls('areaTitulacao')} style={{ minWidth: 100, minHeight: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', background: erlenmeyerNaTitulacao ? 'rgba(0,0,0,0.20)' : 'rgba(0,0,0,0.10)', borderRadius: 12, padding: '4px 8px', border: erlenmeyerNaTitulacao ? '1px solid rgba(234,179,8,0.30)' : '2px dashed rgba(255,255,255,0.15)' }}>
                    {erlenmeyerNaTitulacao ? (
                      <>
                        <div key={`erlvib-${hitKey}`} className={hitKey > 0 ? 'erl-vibrar' : ''}>
                          <ErlenmeyerSVG nivel={nivelErlAmostra} cor={corSolucao} id="tit" />
                        </div>
                        {volumeGasto > 0 && (
                          <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '3px 8px', fontSize: 8, color: '#eab308', fontFamily: 'monospace', fontWeight: 700, marginTop: 2 }}>
                            {volumeGasto.toFixed(1)} mL
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: 9, color: '#78716c', textAlign: 'center', padding: '10px 6px', lineHeight: 1.5 }}>
                        Arraste o<br />Erlenmeyer aqui
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#a8a29e' }}>Plataforma</span>
                </ZonaDrop>
              </div>

              {/* ─ COL 2: Erlenmeyer Branco ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="erlenmeyer_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('erlenmeyer_branco')} ${dropCls('erlenmeyer_branco')}`}>
                    <ErlenmeyerSVG nivel={nivelErlBranco} cor={corErlBranco} id="branco" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Erlenmeyer Branco</span>
                  <span style={{ fontSize: 8, color: brancoPreparado ? '#22c55e' : '#94a3b8' }}>
                    {brancoPreparado ? '✓ Preparado (50 mL)' : 'Aguardando'}
                  </span>
                </ZonaDrop>
              </div>

              {/* ─ COL 3: Erlenmeyer Amostra ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="erlenmeyer_amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('erlenmeyer_amostra')} ${dropCls('erlenmeyer_amostra')}`}
                    style={{ opacity: erlAmostraVis ? 1 : 0.18, transition: 'opacity 0.3s', position: 'relative' }}
                    draggable={isItem('erlenmeyer_amostra') && erlAmostraVis}
                    onDragStart={e => handleDragStart('erlenmeyer_amostra', e)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Gotas de fenolftaleína */}
                    {fenolGotas && [0, 1, 2].map(v => (
                      <div key={`ff${v}-${fenolKey}`} style={{
                        position: 'absolute', top: 0,
                        left: `calc(50% + ${(v - 1) * 6}px)`,
                        width: 8, height: 22, pointerEvents: 'none', zIndex: 30,
                        animation: `cloFenolDrop 0.58s ${v * 0.60}s linear both`,
                      }}>
                        <svg width="8" height="22" viewBox="0 0 8 22">
                          <ellipse cx="4" cy="16" rx="3.5" ry="5" fill="rgba(236,72,153,0.90)" />
                          <ellipse cx="3" cy="13" rx="1.1" ry="1.7" fill="rgba(255,180,230,0.40)" />
                        </svg>
                      </div>
                    ))}
                    <div key={`erlanim-${vibrarKey}`} className={vibrarKey > 0 ? 'erl-vibrar' : ''}>
                      <ErlenmeyerSVG nivel={nivelErlAmostra} cor={erlenmeyerNaTitulacao ? corSolucao : corErlAmostra} id="amost" />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: erlenmeyerNaTitulacao ? '#57534e' : '#e7e5e4' }}>
                    {isItem('erlenmeyer_amostra') && erlAmostraVis ? '🖱️ ' : ''}Erlenmeyer Amostra
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 700, color:
                    erlenmeyerNaTitulacao  ? '#57534e'
                    : cromatoAdicionado    ? '#eab308'
                    : fenolGotas           ? '#f472b6'
                    : erlAmostraPrep       ? '#60a5fa'
                    : '#94a3b8'
                  }}>
                    {erlenmeyerNaTitulacao  ? '↑ Em titulação'
                      : cromatoAdicionado  ? '🟡 Amarelo vivo'
                      : fenolGotas         ? '💧 Fenolftal. (3 gotas)'
                      : erlAmostraPrep     ? '💧 50 mL'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* ─ COL 4: Proveta 50 mL ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta 50 mL</span>
                  {provetaCheia && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>50 mL medidos</span>}
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ ZONA INFERIOR: REAGENTES ════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {/* AMOSTRA ÁGUA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(175,215,245,0.78)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* ÁGUA DESMINERALIZADA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('agua')}`}
                  draggable={isItem('agua')}
                  onDragStart={e => handleDragStart('agua', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(200,235,255,0.80)" label="H₂O desm." sub="" nivel={nivelAgua} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('agua') ? '🖱️ ' : ''}Água desm.</span>
                </div>
              </div>

              {/* FENOLFTALEÍNA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="fenol" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('fenol')} ${dropCls('fenol')}`}
                    draggable={isItem('fenol')}
                    onDragStart={e => handleDragStart('fenol', e)} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(240,100,180,0.82)" label="Fenolftal." sub="1%" nivel={70} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('fenol') ? '🖱️ ' : ''}Fenolftaleína</span>
                </ZonaDrop>
              </div>

              {/* CROMATO DE POTÁSSIO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="cromato" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('cromato')} ${dropCls('cromato')}`}
                    draggable={isItem('cromato')}
                    onDragStart={e => handleDragStart('cromato', e)} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(255,210,0,0.88)" label="K₂CrO₄" sub="5%" nivel={cromatoAdicionado ? 55 : 72} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('cromato') ? '🖱️ ' : ''}Cromato K 5%</span>
                  {cromatoAdicionado && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
                </ZonaDrop>
              </div>

              {/* NITRATO DE PRATA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('nitrato')}`}
                  draggable={isItem('nitrato')}
                  onDragStart={e => handleDragStart('nitrato', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <FrascoReagente cor="rgba(200,195,220,0.82)" label="AgNO₃" sub={normalidade} nivel={nivelBureta > 0 ? 48 : 74} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('nitrato') ? '🖱️ ' : ''}Nitrato Prata</span>
                  {nivelBureta > 0 && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Na bureta</span>}
                </div>
              </div>

            </div>

            {/* ══ PAINEL DE TITULAÇÃO (etapa 8) ════════════════════════ */}
            {etapaAtual === 8 && erlenmeyerNaTitulacao && (
              <div style={{ marginTop: 16, background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: '12px 18px', border: `1px solid ${pontoFinal ? 'rgba(234,179,8,0.45)' : 'rgba(34,211,238,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>VOLUME GASTO</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#eab308', fontFamily: 'monospace' }}>{volumeGasto.toFixed(1)} mL</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>TITULANTE</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd', fontFamily: 'monospace' }}>AgNO₃ {normalidade}</div>
                  </div>
                  {pontoFinal && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>VIRAGEM</div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#eab308', fontFamily: 'monospace' }}>🟡 → 🟫 Mostarda</div>
                    </div>
                  )}
                </div>
                {!pontoFinal && endpointVolume > 0 && (
                  <div style={{ minWidth: 150 }}>
                    <div style={{ fontSize: 8, color: '#64748b', marginBottom: 4 }}>Aproximação ao ponto final</div>
                    <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min((volumeGasto / endpointVolume) * 100, 100)}%`, background: `linear-gradient(90deg,#eab308,${volumeGasto / endpointVolume > 0.8 ? '#b45309' : '#ca8a04'})`, borderRadius: 4, transition: 'width 0.2s' }} />
                    </div>
                    {volumeGasto / endpointVolume > 0.8 && (
                      <div style={{ fontSize: 8, color: '#eab308', fontWeight: 700, marginTop: 3 }}>⚠️ Próximo da viragem!</div>
                    )}
                  </div>
                )}
                {!pontoFinal && (
                  <button onClick={handleClicarBureta} style={{ background: 'linear-gradient(90deg,#854d0e,#ca8a04)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(180,120,0,0.35)' }}>
                    + 0,2 mL
                  </button>
                )}
              </div>
            )}

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

export default SimuladorCloreto;
