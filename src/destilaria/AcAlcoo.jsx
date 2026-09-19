/**
 * AcAlcoo.jsx — Determinação de Acidez Total em Álcool Etílico
 *
 * Fluxo: Água deionizada → Proveta → Erlenmeyer → Alfa-naftolftaleína
 *        → NaOH na Bureta → Ajuste Branco (incolor → azul-claro)
 *        → Álcool Hidratado → Erlenmeyer (incolor) → Titulação
 *        → Viragem incolor → azul-claro → Resultado
 *
 * Método: Alfa-naftolftaleína · NaOH 0,02 mol/L · Viragem incolor → azul-claro
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
import { useSimuladorDragAcAlcoo } from '../hooks/useSimuladorDragAcAlcoo';
import { etapas } from '../fermentacao/data/etapasAcAlcoo';


/* ═══════════════════════════════════════════════════════════
   CSS — animações desta página (mesmo padrão Alcalinidade)
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes aacDropFall {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 1;    }
    65%  { transform: translateX(-50%) translateY(48px);  opacity: 0.90; }
    100% { transform: translateX(-50%) translateY(68px);  opacity: 0;    }
  }
  @keyframes aacDropFall2 {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 0.85; }
    65%  { transform: translateX(-50%) translateY(44px);  opacity: 0.75; }
    100% { transform: translateX(-50%) translateY(62px);  opacity: 0;    }
  }
  @keyframes aacDropFall3 {
    0%   { transform: translateX(-50%) translateY(0px);   opacity: 0.70; }
    65%  { transform: translateX(-50%) translateY(52px);  opacity: 0.60; }
    100% { transform: translateX(-50%) translateY(72px);  opacity: 0;    }
  }
  @keyframes aacIndicDrop {
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
  .erl-vibrar { animation: erlVibrar 0.55s ease-in-out; transform-origin: center bottom; }
`;

// Cor do ponto final: azul-claro
const COR_AZUL_CLARO = 'rgba(100,150,220,0.82)';


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorAcAlcoo = () => {
  useDragOverlay();

  // ── Injeta keyframes ──────────────────────────────────
  useEffect(() => {
    const sid = 'aac-anim-styles';
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
  const [nivelAgua,   setNivelAgua]   = useState(82);
  const [nivelAlcool, setNivelAlcool] = useState(82);

  // ── Erlenmeyer ────────────────────────────────────────
  const [nivelErlenmeyer,       setNivelErlenmeyer]       = useState(0);
  const [corErlenmeyer,         setCorErlenmeyer]         = useState('rgba(220,235,255,0.08)');
  const [aguaNoErl,             setAguaNoErl]             = useState(false);
  const [indicadorAdicionado,   setIndicadorAdicionado]   = useState(false);
  const [brancoAjustado,        setBrancoAjustado]        = useState(false);
  const [alcoolNoErl,           setAlcoolNoErl]           = useState(false);
  const [erlenmeyerNaTitulacao, setErlenmeyerNaTitulacao] = useState(false);

  // ── Alfa-naftol drops (step 2) ────────────────────────
  const [alfaNaftolGotas, setAlfaNaftolGotas] = useState(false);
  const [alfaNaftolKey,   setAlfaNaftolKey]   = useState(0);

  // ── Bureta ────────────────────────────────────────────
  const [nivelBureta, setNivelBureta] = useState(0);

  // ── Titulação final (phase 2) ─────────────────────────
  const [volumeGasto,    setVolumeGasto]    = useState(0);
  const [endpointVolume, setEndpointVolume] = useState(0);
  const [pontoFinal,     setPontoFinal]     = useState(false);
  const [gotejando,      setGotejando]      = useState(false);
  const [hitKey,         setHitKey]         = useState(0);

  // ── Cor da solução durante titulação final ────────────
  const corSolucao = useMemo(() => {
    // Aplica apenas durante phase 2 com erlenmeyer na plataforma
    if (!alcoolNoErl || !erlenmeyerNaTitulacao || endpointVolume === 0) return corErlenmeyer;
    if (pontoFinal) return COR_AZUL_CLARO;
    const p = Math.min(volumeGasto / endpointVolume, 1);
    const r = Math.round(195 - 95 * p);  // 195 → 100
    const g = Math.round(225 - 75 * p);  // 225 → 150
    const b = Math.round(248 - 28 * p);  // 248 → 220
    return `rgba(${r},${g},${b},${(0.52 + 0.30 * p).toFixed(2)})`;
  }, [alcoolNoErl, erlenmeyerNaTitulacao, pontoFinal, volumeGasto, endpointVolume, corErlenmeyer]);

  // ── TIMER: alfa-naftol gotas (etapa 2) ────────────────
  useEffect(() => {
    if (!alfaNaftolGotas) return;
    setAlfaNaftolKey(k => k + 1);
    const id = setTimeout(() => {
      setAlfaNaftolGotas(false);
      setIndicadorAdicionado(true);
      // Cor levíssima — indicador quase incolor antes da titulação
      setCorErlenmeyer('rgba(195,220,248,0.55)');
      celebrarAcerto();
      proximaEtapa();
    }, 2200);
    return () => clearTimeout(id);
  }, [alfaNaftolGotas]);

  // ── TIMER: erlenmeyer retorna após branco (etapa 6) ───
  useEffect(() => {
    if (etapaAtual !== 6) return;
    const id = setTimeout(() => {
      setErlenmeyerNaTitulacao(false);
      setBrancoAjustado(true);
      celebrarAcerto(100);
      proximaEtapa();
    }, 400);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── TIMER: auto-conclusão última etapa (12) ───────────
  useEffect(() => {
    if (etapaAtual !== 12) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragAcAlcoo(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAgua, setNivelAlcool,
    setNivelErlenmeyer, setCorErlenmeyer,
    setAguaNoErl, setAlcoolNoErl,
    setAlfaNaftolGotas,
    setNivelBureta,
    setErlenmeyerNaTitulacao, setEndpointVolume,
  });

  // ── Click branco (etapa 5): 2 cliques → viragem incolor → azul-claro ─
  const [brancoClique1, setBrancoClique1] = useState(false);

  const handleClicarBranco = () => {
    if (etapaAtual !== 5 || !erlenmeyerNaTitulacao || brancoAjustado) return;

    if (!brancoClique1) {
      // 1º clique: gotas caem, cor começa a mudar levemente
      setBrancoClique1(true);
      setGotejando(true);
      setHitKey(k => k + 1);
      setNivelBureta(prev => Math.max(prev - 4, 0));
      setCorErlenmeyer('rgba(145,185,235,0.62)'); // azul intermediário
      setTimeout(() => setGotejando(false), 660);
      celebrarAcerto(50);
    } else {
      // 2º clique: viragem completa para azul-claro
      setGotejando(true);
      setHitKey(k => k + 1);
      setNivelBureta(prev => Math.max(prev - 4, 0));
      setCorErlenmeyer(COR_AZUL_CLARO);
      setTimeout(() => setGotejando(false), 660);
      setTimeout(() => {
        celebrarAcerto(150);
        proximaEtapa(); // vai para etapa 6 (retorno timer)
      }, 800);
    }
  };

  // ── Click bureta final (etapa 11): titulação progressiva ─
  const handleClicarBuretaFinal = () => {
    if (etapaAtual !== 11 || !erlenmeyerNaTitulacao || pontoFinal) return;
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
  const fase1 = etapaAtual <= 6;
  const erlVis = !erlenmeyerNaTitulacao;
  const buretaAtiva5  = etapaAtual === 5  && erlenmeyerNaTitulacao && !brancoAjustado;
  const buretaAtiva11 = etapaAtual === 11 && erlenmeyerNaTitulacao && !pontoFinal;


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
      {pontoFinal && etapaAtual === 12 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8,#3b82f6)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🔵 Ponto Final Atingido!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Incolor → Azul-claro · Volume: <strong>{endpointVolume.toFixed(1)} mL</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #3b82f6', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>⚗️</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#60a5fa', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Acidez Total em Álcool Etílico · Alfa-naftolftaleína
            </p>
            <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.30)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Titulação</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#93c5fd', fontFamily: 'monospace' }}>{endpointVolume.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Volume gasto (mL)</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#60a5fa', fontFamily: 'monospace' }}>NaOH 0,02 mol/L</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Titulante</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>Incolor → Azul-claro</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Viragem</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.28)', borderRadius: 11, padding: '9px 18px', marginBottom: 14, fontSize: 11, color: '#93c5fd' }}>
              Indicador: Alfa-naftolftaleína · Titulação finalizada com sucesso
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#1d4ed8,#3b82f6)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Acidez — Álcool Etílico"
        subtitulo={"Alfa-naftolftaleína · NaOH 0,02 mol/L\nViragem: Incolor → Azul-claro"}
        icone="⚗️"
        badges={['🍶 FERMENTAÇÃO', '⚗️ TITULAÇÃO']}
        footerLabel="⚗️ Acidez Álcool"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 760 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            ⚗️ Bancada — Determinação de Acidez Total em Álcool Etílico
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '20px 18px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: BURETA + ERLENMEYER + FASE INFO ══════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>

              {/* ─ COL 1: Estação de Titulação ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                <ZonaDrop id="bureta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={dropCls('bureta')} style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.22))', borderRadius: 12, padding: '8px 14px 4px', border: '1px solid rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: nivelBureta > 0 ? '#60a5fa' : '#78716c', marginBottom: 2 }}>
                      {nivelBureta > 0 ? 'Bureta · NaOH 0,02 mol/L' : 'Bureta — vazia'}
                    </span>
                    <BuretaSVG
                      nivel={nivelBureta} gotejando={gotejando}
                      ativo={buretaAtiva5 || buretaAtiva11}
                      onClick={buretaAtiva5 ? handleClicarBranco : buretaAtiva11 ? handleClicarBuretaFinal : undefined}
                    />
                    {buretaAtiva5 && (
                      <div style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>↑ Clique para ajustar branco</div>
                    )}
                    {buretaAtiva11 && (
                      <div style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>↑ Clique na torneira</div>
                    )}
                    {(etapaAtual === 3 || etapaAtual === 9) && (
                      <div style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700, marginTop: 2 }}>↑ Arraste NaOH aqui</div>
                    )}
                  </div>
                </ZonaDrop>

                {/* Gotas caindo */}
                <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                  {gotejando && (
                    <>
                      <GotaCaindo key={`d1-${hitKey}`} offsetX={-4} animName="aacDropFall"  delay={0}   animKey={`d1-${hitKey}`} />
                      <GotaCaindo key={`d2-${hitKey}`} offsetX={0}  animName="aacDropFall2" delay={110} animKey={`d2-${hitKey}`} />
                      <GotaCaindo key={`d3-${hitKey}`} offsetX={4}  animName="aacDropFall3" delay={220} animKey={`d3-${hitKey}`} />
                    </>
                  )}
                </div>

                {/* Plataforma de titulação */}
                <ZonaDrop id="areaTitulacao" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <div className={dropCls('areaTitulacao')} style={{ minWidth: 104, minHeight: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', background: erlenmeyerNaTitulacao ? 'rgba(0,0,0,0.20)' : 'rgba(0,0,0,0.10)', borderRadius: 12, padding: '4px 8px', border: erlenmeyerNaTitulacao ? '1px solid rgba(59,130,246,0.30)' : '2px dashed rgba(255,255,255,0.15)' }}>
                    {erlenmeyerNaTitulacao ? (
                      <>
                        <div key={`erlvib-${hitKey}`} className={hitKey > 0 ? 'erl-vibrar' : ''}>
                          <ErlenmeyerSVG nivel={nivelErlenmeyer} cor={corSolucao} id="tit" />
                        </div>
                        {volumeGasto > 0 && (
                          <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '3px 8px', fontSize: 8, color: '#93c5fd', fontFamily: 'monospace', fontWeight: 700, marginTop: 2 }}>
                            {volumeGasto.toFixed(1)} mL
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: 9, color: '#78716c', textAlign: 'center', padding: '12px 8px', lineHeight: 1.5 }}>
                        Arraste o<br />Erlenmeyer aqui
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#a8a29e' }}>Plataforma de Titulação</span>
                </ZonaDrop>
              </div>

              {/* ─ COL 2: Erlenmeyer ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="erlenmeyer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('erlenmeyer')} ${dropCls('erlenmeyer')}`}
                    style={{ opacity: erlVis ? 1 : 0.18, transition: 'opacity 0.3s', position: 'relative' }}
                    draggable={isItem('erlenmeyer') && erlVis}
                    onDragStart={e => handleDragStart('erlenmeyer', e)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Gotas alfa-naftol */}
                    {alfaNaftolGotas && [0,1,2,3].map(v => (
                      <div key={`afg${v}-${alfaNaftolKey}`} style={{
                        position: 'absolute', top: 0, left: `calc(50% + ${(v-1.5)*5}px)`,
                        width: 8, height: 22, pointerEvents: 'none', zIndex: 30,
                        animation: `aacIndicDrop 0.55s ${v * 0.55}s linear both`,
                      }}>
                        <svg width="8" height="22" viewBox="0 0 8 22">
                          <ellipse cx="4" cy="15" rx="3.2" ry="5" fill="rgba(99,120,220,0.88)" />
                          <ellipse cx="3" cy="12" rx="1.1" ry="1.8" fill="rgba(160,180,255,0.40)" />
                        </svg>
                      </div>
                    ))}
                    <ErlenmeyerSVG nivel={nivelErlenmeyer} cor={corErlenmeyer} id="std" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: erlenmeyerNaTitulacao ? '#57534e' : '#e7e5e4' }}>
                    {isItem('erlenmeyer') ? '🖱️ ' : ''}Erlenmeyer 250 mL
                  </span>
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>
                    {erlenmeyerNaTitulacao ? '↑ Em titulação'
                      : alcoolNoErl         ? '🔵→⬜ Incolor (titular)'
                      : brancoAjustado      ? '🔵 Branco ajustado'
                      : indicadorAdicionado ? '🟦 Com indicador'
                      : aguaNoErl           ? '💧 Com água'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* ─ COL 3: Info da Fase ─ */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.22)', borderRadius: 14, padding: '12px 14px', border: `1px solid ${fase1 ? 'rgba(59,130,246,0.20)' : 'rgba(34,197,94,0.20)'}`, alignSelf: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: fase1 ? '#60a5fa' : '#34d399', letterSpacing: 0.5, textAlign: 'center' }}>
                  {fase1 ? 'FASE 1' : 'FASE 2'}
                </span>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4', textAlign: 'center', lineHeight: 1.5 }}>
                  {fase1 ? 'Ajuste do\nBranco' : 'Titulação\nAmostra'}
                </div>
                <div style={{ fontSize: 8, color: '#60a5fa', fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.5 }}>
                  NaOH<br />0,02 mol/L
                </div>
                {brancoAjustado && (
                  <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Branco ok</span>
                )}
              </div>

            </div>{/* fim zona superior */}

            {/* ══ ZONA INFERIOR: REAGENTES (só os da fase atual) ══════ */}
            {/* Fase 1: água · proveta · alfanaftol · naoh           */}
            {/* Fase 2: álcool · proveta · naoh                      */}
            <div style={{ display: 'grid', gridTemplateColumns: fase1 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: 12, alignItems: 'flex-end' }}>

              {/* ÁGUA DEIONIZADA — só fase 1 */}
              {fase1 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ItemBancada id="agua" className={itemCls('agua')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(200,230,255,0.80)" label="H₂O desion." sub="" nivel={nivelAgua} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Água Deion.</span>
                  </ItemBancada>
                </div>
              )}

              {/* ÁLCOOL HIDRATADO — só fase 2 */}
              {!fase1 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ItemBancada id="alcool" className={itemCls('alcool')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(220,240,255,0.75)" label="Álcool" sub="Hidratado" nivel={nivelAlcool} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Álcool Hidr.</span>
                  </ItemBancada>
                </div>
              )}

              {/* PROVETA — sempre presente */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta 50 mL</span>
                  {provetaCheia && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>50 mL medidos</span>}
                </ZonaDrop>
              </div>

              {/* ALFA-NAFTOLFTALEÍNA — só fase 1 */}
              {fase1 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id="alfanaftol" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <div className={`item-drag ${itemCls('alfanaftol')} ${dropCls('alfanaftol')}`}
                      draggable={isItem('alfanaftol')}
                      onDragStart={e => handleDragStart('alfanaftol', e)} onDragEnd={handleDragEnd}>
                      <FrascoReagente cor="rgba(90,110,220,0.82)" label="Alfa-naftol." sub="1%" nivel={indicadorAdicionado ? 65 : 80} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('alfanaftol') ? '🖱️ ' : ''}Alfa-naftolftaléína</span>
                    {indicadorAdicionado && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
                  </ZonaDrop>
                </div>
              )}

              {/* NaOH 0,02 mol/L — sempre presente */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('naoh')}`}
                  draggable={isItem('naoh')}
                  onDragStart={e => handleDragStart('naoh', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(30,100,200,0.82)" label="NaOH" sub="0,02 mol/L" nivel={nivelBureta > 0 ? 50 : 76} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('naoh') ? '🖱️ ' : ''}NaOH 0,02 mol/L</span>
                  {nivelBureta > 0 && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Na bureta</span>}
                </div>
              </div>

            </div>

            {/* ══ PAINEL DE TITULAÇÃO FINAL (etapa 11) ═════════════════ */}
            {etapaAtual === 11 && erlenmeyerNaTitulacao && (
              <div style={{ marginTop: 16, background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: '12px 18px', border: `1px solid ${pontoFinal ? 'rgba(59,130,246,0.45)' : 'rgba(34,211,238,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>VOLUME GASTO</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#93c5fd', fontFamily: 'monospace' }}>{volumeGasto.toFixed(1)} mL</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>TITULANTE</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>NaOH 0,02 mol/L</div>
                  </div>
                  {pontoFinal && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>VIRAGEM</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#60a5fa', fontFamily: 'monospace' }}>Incolor → Azul-claro ✓</div>
                    </div>
                  )}
                </div>
                {!pontoFinal && endpointVolume > 0 && (
                  <div style={{ minWidth: 150 }}>
                    <div style={{ fontSize: 8, color: '#64748b', marginBottom: 4 }}>Aproximação ao ponto final</div>
                    <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min((volumeGasto / endpointVolume) * 100, 100)}%`, background: `linear-gradient(90deg,#3b82f6,${volumeGasto / endpointVolume > 0.8 ? '#1d4ed8' : '#1e40af'})`, borderRadius: 4, transition: 'width 0.2s' }} />
                    </div>
                    {volumeGasto / endpointVolume > 0.8 && (
                      <div style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700, marginTop: 3 }}>⚠️ Próximo do ponto final!</div>
                    )}
                  </div>
                )}
                {!pontoFinal && (
                  <button onClick={handleClicarBuretaFinal} style={{ background: 'linear-gradient(90deg,#1e40af,#1d4ed8)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,64,175,0.35)' }}>
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

export default SimuladorAcAlcoo;
