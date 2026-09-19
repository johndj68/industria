/**
 * Alcalinidade.jsx — Determinação de Alcalinidade Total
 *
 * Fluxo: Proveta 50 mL → Erlenmeyer → Alaranjado de Metila
 *        → Ácido na Bureta → Erlenmeyer na plataforma → Titulação → Resultado
 *
 * Método: Alaranjado de Metila · H₂SO₄ 0,1 N ou 0,02 N · ponto final pH 4,3
 * Cálculo: AT = V × 100 (0,1 N) ou AT = V × 20 (0,02 N) — ppm CaCO₃
 * Fonte: COR-IND-QUA-PO-07 — Página 24
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragAlcalinidade } from '../hooks/useSimuladorDragAlcalinidade';
import { useTitulacao } from '../hooks/useTitulacao';
import { etapas } from './data/etapasAlcalinidade';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import ErlenmeyerSVG from '../components/lab/ErlenmeyerSVG';
import BuretaSVG from '../components/lab/BuretaSVG';
import GotaCaindo from '../components/lab/GotaCaindo';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
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
const SimuladorAlcalinidade = () => {
  useDragOverlay();

  // ── Injeta keyframes de animação uma única vez ────────
  useEffect(() => {
    const id = 'alc-anim-styles';
    if (document.getElementById(id)) return;
    const tag = document.createElement('style');
    tag.id = id;
    tag.textContent = ESTILOS_ANIMACAO;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
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

  // ── Amostra ───────────────────────────────────────────
  const [nivelAmostra, setNivelAmostra] = useState(82);

  // ── Erlenmeyer ────────────────────────────────────────
  const [nivelErlenmeyer,       setNivelErlenmeyer]       = useState(0);
  const [corErlenmeyer,         setCorErlenmeyer]         = useState('rgba(220,235,255,0.08)');
  const [erlenmeyerPrep,        setErlenmeyerPrep]        = useState(false);
  const [indicadorAdicionado,   setIndicadorAdicionado]   = useState(false);
  const [erlenmeyerNaTitulacao, setErlenmeyerNaTitulacao] = useState(false);

  // ── Titulação ─────────────────────────────────────────
  const {
    normalidade,
    volumeGasto, endpointVolume, setEndpointVolume,
    pontoFinal, gotejando, nivelBureta, setNivelBureta,
    hitKey, corSolucao, handleClicarBureta,
    fator, resultadoAlcalinidade,
  } = useTitulacao({
    etapaAtual, erlenmeyerNaTitulacao, indicadorAdicionado,
    corErlenmeyer, celebrarAcerto, proximaEtapa,
  });

  // ── Timer: auto-conclusão na última etapa ─────────────
  useEffect(() => {
    if (etapaAtual !== 6) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragAlcalinidade(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAmostra,
    setNivelErlenmeyer, setCorErlenmeyer,
    setErlenmeyerPrep, setIndicadorAdicionado,
    setErlenmeyerNaTitulacao, setEndpointVolume,
    setNivelBureta,
  });


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

      {/* ── BANNER PONTO FINAL ── */}
      {pontoFinal && etapaAtual === 6 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#78350f,#b45309,#f59e0b)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🟠 Ponto Final Atingido!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Cor laranja-salmão · pH 4,3 · Volume: <strong>{endpointVolume.toFixed(1)} mL</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultadoAlcalinidade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #f59e0b', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🧪</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#f59e0b', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Alcalinidade Total · Alaranjado de Metila · pH 4,3
            </p>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Titulação</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{endpointVolume.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Volume gasto (mL)</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#60a5fa', fontFamily: 'monospace' }}>H₂SO₄ {normalidade}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Normalidade</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{endpointVolume.toFixed(1)} × {fator}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Fórmula</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 14, padding: '16px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Alcalinidade Total</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', lineHeight: 1 }}>{resultadoAlcalinidade}</div>
              <div style={{ fontSize: 14, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>ppm como CaCO₃</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Fonte: COR-IND-QUA-PO-07 — Página 24
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button
              onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#f59e0b,#d97706)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
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
        titulo="Alcalinidade Total"
        subtitulo={"Alaranjado de Metila · H₂SO₄\nMétodo COR-IND-QUA-PO-07"}
        icone="🧪"
        badges={['💧 ÁGUAS', '⚗️ TITULAÇÃO']}
        footerLabel="🧪 Alcalinidade Total"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 760 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 15, fontWeight: 900, marginBottom: 18, letterSpacing: 0.8 }}>
            🧪 Bancada — Determinação de Alcalinidade Total
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '20px 18px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: EQUIPAMENTOS ══════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>

              {/* ─ COL 1: Estação de Titulação (bureta + plataforma) ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                <ZonaDrop id="bureta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={dropCls('bureta')} style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.22))', borderRadius: 12, padding: '8px 14px 4px', border: '1px solid rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: nivelBureta > 0 ? '#f59e0b' : '#78716c', marginBottom: 2 }}>
                      {nivelBureta > 0 ? `Bureta 50 mL · H₂SO₄ ${normalidade}` : 'Bureta 50 mL — vazia'}
                    </span>
                    <BuretaSVG
                      nivel={nivelBureta} gotejando={gotejando}
                      ativo={etapaAtual === 5 && erlenmeyerNaTitulacao && !pontoFinal}
                      onClick={handleClicarBureta}
                    />
                    {etapaAtual === 5 && erlenmeyerNaTitulacao && !pontoFinal && (
                      <div style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>↑ Clique na torneira</div>
                    )}
                    {etapaAtual === 3 && (
                      <div style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700, marginTop: 2 }}>↑ Arraste o H₂SO₄ aqui</div>
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
                  <div className={dropCls('areaTitulacao')} style={{ minWidth: 104, minHeight: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', background: erlenmeyerNaTitulacao ? 'rgba(0,0,0,0.20)' : 'rgba(0,0,0,0.10)', borderRadius: 12, padding: '4px 8px', border: erlenmeyerNaTitulacao ? '1px solid rgba(245,158,11,0.30)' : '2px dashed rgba(255,255,255,0.15)' }}>
                    {erlenmeyerNaTitulacao ? (
                      <>
                        <div key={`erlvib-${hitKey}`} className={hitKey > 0 ? 'erl-vibrar' : ''}>
                          <ErlenmeyerSVG nivel={nivelErlenmeyer} cor={corSolucao} id="tit" />
                        </div>
                        {volumeGasto > 0 && (
                          <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '3px 8px', fontSize: 8, color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700, marginTop: 2 }}>
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

              {/* ─ COL 2: Erlenmeyer (sempre visível, flex: 1) ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="erlenmeyer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('erlenmeyer')} ${dropCls('erlenmeyer')}`}
                    style={{ opacity: erlenmeyerNaTitulacao ? 0.18 : 1, transition: 'opacity 0.3s' }}
                    draggable={isItem('erlenmeyer') && !erlenmeyerNaTitulacao}
                    onDragStart={e => handleDragStart('erlenmeyer', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <ErlenmeyerSVG nivel={nivelErlenmeyer} cor={corErlenmeyer} id="std" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: erlenmeyerNaTitulacao ? '#57534e' : '#e7e5e4' }}>
                    {isItem('erlenmeyer') ? '🖱️ ' : ''}Erlenmeyer 250 mL
                  </span>
                  <span style={{ fontSize: 8, color: erlenmeyerNaTitulacao ? '#57534e' : indicadorAdicionado ? '#f97316' : erlenmeyerPrep ? '#60a5fa' : '#94a3b8' }}>
                    {erlenmeyerNaTitulacao ? '↑ Em titulação' : indicadorAdicionado ? '🟠 Com indicador' : erlenmeyerPrep ? '💧 Com amostra' : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* ─ COL 3: Proveta 50 mL ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
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

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,200,240,0.78)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* ALARANJADO DE METILA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ZonaDrop id="alaranjado" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('alaranjado')} ${dropCls('alaranjado')}`}
                    draggable={isItem('alaranjado')}
                    onDragStart={e => handleDragStart('alaranjado', e)} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(232,108,12,0.85)" label="Alaranjado" sub="de Metila" nivel={indicadorAdicionado ? 62 : 78} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>{isItem('alaranjado') ? '🖱️ ' : ''}Alaranjado de Metila</span>
                  {indicadorAdicionado && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
                </ZonaDrop>
              </div>

              {/* ÁCIDO SULFÚRICO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className={`item-drag ${itemCls('acido')}`}
                  draggable={isItem('acido')}
                  onDragStart={e => handleDragStart('acido', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(200,55,45,0.82)" label="H₂SO₄" sub={normalidade} nivel={nivelBureta > 0 ? 48 : 74} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>{isItem('acido') ? '🖱️ ' : ''}Ácido Sulfúrico</span>
                {nivelBureta > 0 && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Na bureta</span>}
              </div>

            </div>{/* fim zona inferior */}

            {/* ══ PAINEL DE TITULAÇÃO (etapa 5) ════════════════════════ */}
            {etapaAtual === 5 && erlenmeyerNaTitulacao && (
              <div style={{ marginTop: 16, background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: '12px 18px', border: `1px solid ${pontoFinal ? 'rgba(245,158,11,0.45)' : 'rgba(34,211,238,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>VOLUME GASTO</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{volumeGasto.toFixed(1)} mL</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>ÁCIDO</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f87171', fontFamily: 'monospace' }}>H₂SO₄ {normalidade}</div>
                  </div>
                  {pontoFinal && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>RESULTADO</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>{resultadoAlcalinidade} ppm CaCO₃</div>
                    </div>
                  )}
                </div>
                {!pontoFinal && endpointVolume > 0 && (
                  <div style={{ minWidth: 150 }}>
                    <div style={{ fontSize: 8, color: '#64748b', marginBottom: 4 }}>Aproximação ao ponto final</div>
                    <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min((volumeGasto / endpointVolume) * 100, 100)}%`, background: `linear-gradient(90deg,#f59e0b,${volumeGasto / endpointVolume > 0.8 ? '#ef4444' : '#d97706'})`, borderRadius: 4, transition: 'width 0.2s' }} />
                    </div>
                    {volumeGasto / endpointVolume > 0.8 && (
                      <div style={{ fontSize: 8, color: '#ef4444', fontWeight: 700, marginTop: 3 }}>⚠️ Próximo do ponto final!</div>
                    )}
                  </div>
                )}
                {!pontoFinal && (
                  <button onClick={handleClicarBureta} style={{ background: 'linear-gradient(90deg,#b45309,#d97706)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(180,83,9,0.35)' }}>
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

export default SimuladorAlcalinidade;
