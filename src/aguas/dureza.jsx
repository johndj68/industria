/**
 * dureza.jsx — Determinação da Dureza Total Dissolvida
 *
 * Fluxo: Proveta 50 mL → Erlenmeyer 125 mL → Solução Tampão
 *        → Espátula + Negro de Eriocromo → EDTA na Bureta
 *        → Titulação → Viragem vinho/arroxeado → azul
 *
 * Método: Solução Tampão + Negro de Eriocromo · EDTA 0,01 M ou 0,0025 M
 * Cálculo: Dureza Total (ppm CaCO₃) = V × 20 (0,01M) ou V × 5 (0,0025M)
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import ErlenmeyerSVG from '../components/lab/ErlenmeyerSVG';
import BuretaSVG from '../components/lab/BuretaSVG';
import GotaCaindo from '../components/lab/GotaCaindo';
import EspatulaSVG from '../components/lab/EspatulaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragDureza } from '../hooks/useSimuladorDragDureza';
import { useTitulacaoDureza } from '../hooks/useTitulacaoDureza';
import { etapas } from './data/etapasDureza';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_DUREZA = `
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
const SimuladorDureza = () => {
  useDragOverlay();

  // ── Injeta keyframes ──────────────────────────────────
  useEffect(() => {
    const sid = 'dur-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ESTILOS_DUREZA;
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

  // ── Amostra ───────────────────────────────────────────
  const [nivelAmostra, setNivelAmostra] = useState(82);

  // ── Erlenmeyer ────────────────────────────────────────
  const [nivelErlenmeyer,      setNivelErlenmeyer]      = useState(0);
  const [corErlenmeyer,        setCorErlenmeyer]        = useState('rgba(220,235,255,0.06)');
  const [erlenmeyerPrep,       setErlenmeyerPrep]       = useState(false);
  const [tampaoAdicionado,     setTampaoAdicionado]     = useState(false);
  const [indicadorAdicionado,  setIndicadorAdicionado]  = useState(false);
  const [erlenmeyerNaTitulacao,setErlenmeyerNaTitulacao]= useState(false);
  const [vibrarKey,            setVibrarKey]            = useState(0);

  // ── Espátula ──────────────────────────────────────────
  const [espatulaComIndicador, setEspatulaComIndicador] = useState(false);

  // ── Titulação (hook próprio para dureza) ──────────────
  const {
    molaridade,
    volumeGasto, endpointVolume, setEndpointVolume,
    pontoFinal, gotejando, nivelBureta, setNivelBureta,
    hitKey, corSolucao, handleClicarBureta,
    fator, resultadoDureza,
  } = useTitulacaoDureza({
    etapaAtual, erlenmeyerNaTitulacao, indicadorAdicionado,
    corErlenmeyer, celebrarAcerto, proximaEtapa,
  });

  // ── Timer: auto-conclusão última etapa (8) ────────────
  useEffect(() => {
    if (etapaAtual !== 8) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragDureza(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAmostra,
    setNivelErlenmeyer, setCorErlenmeyer,
    setErlenmeyerPrep, setTampaoAdicionado,
    espatulaComIndicador, setEspatulaComIndicador,
    setIndicadorAdicionado, setVibrarKey,
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
      {pontoFinal && etapaAtual === 8 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8,#3b82f6)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🔵 Ponto Final Atingido!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Vinho → Azul · Viragem completa · Volume: <strong>{endpointVolume.toFixed(1)} mL</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultadoDureza && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #3b82f6', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>💧</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#60a5fa', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação da Dureza Total Dissolvida · Negro de Eriocromo
            </p>

            <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.30)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Titulação</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#93c5fd', fontFamily: 'monospace' }}>{endpointVolume.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Volume gasto (mL)</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#60a5fa', fontFamily: 'monospace' }}>EDTA {molaridade}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Titulante</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{endpointVolume.toFixed(1)} × {fator}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Fórmula</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)', borderRadius: 14, padding: '16px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Dureza Total Dissolvida</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace', lineHeight: 1 }}>{resultadoDureza}</div>
              <div style={{ fontSize: 14, color: '#93c5fd', fontWeight: 700, marginTop: 4 }}>ppm como CaCO₃</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 10, fontSize: 10, color: '#64748b' }}>
              Indicador: Negro de Eriocromo · Viragem: vinho → azul · Titulante: EDTA {molaridade}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '6px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Status: Titulação finalizada com sucesso
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
        titulo="Dureza Total"
        subtitulo={"Negro de Eriocromo · EDTA\nViragem: Vinho → Azul"}
        icone="💧"
        badges={['💧 ÁGUAS', '⚗️ TITULAÇÃO']}
        footerLabel="💧 Dureza Total"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 780 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 15, fontWeight: 900, marginBottom: 18, letterSpacing: 0.8 }}>
            💧 Bancada — Determinação da Dureza Total Dissolvida
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '20px 18px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: BURETA + ERLENMEYER + ESPÁTULA + PROVETA ══ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>

              {/* COL 1: Bureta + plataforma de titulação */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                <ZonaDrop id="bureta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={dropCls('bureta')} style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.22))', borderRadius: 12, padding: '8px 14px 4px', border: '1px solid rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: nivelBureta > 0 ? '#60a5fa' : '#78716c', marginBottom: 2 }}>
                      {nivelBureta > 0 ? `Bureta 50 mL · EDTA ${molaridade}` : 'Bureta 50 mL — vazia'}
                    </span>
                    <BuretaSVG
                      nivel={nivelBureta} gotejando={gotejando}
                      ativo={etapaAtual === 7 && erlenmeyerNaTitulacao && !pontoFinal}
                      onClick={handleClicarBureta}
                    />
                    {etapaAtual === 7 && erlenmeyerNaTitulacao && !pontoFinal && (
                      <div style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 2 }}>↑ Clique na torneira</div>
                    )}
                    {etapaAtual === 5 && (
                      <div style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700, marginTop: 2 }}>↑ Arraste EDTA aqui</div>
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

              {/* COL 2: Erlenmeyer (sempre visível, flex: 1) */}
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
                    <div key={`erlvibench-${vibrarKey}`} className={vibrarKey > 0 ? 'erl-vibrar' : ''}>
                      <ErlenmeyerSVG nivel={nivelErlenmeyer} cor={corErlenmeyer} id="std" />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: erlenmeyerNaTitulacao ? '#57534e' : '#e7e5e4' }}>
                    {isItem('erlenmeyer') ? '🖱️ ' : ''}Erlenmeyer 125 mL
                  </span>
                  <span style={{ fontSize: 8, color:
                    erlenmeyerNaTitulacao ? '#57534e'
                    : indicadorAdicionado ? '#c084fc'
                    : tampaoAdicionado    ? '#67e8f9'
                    : erlenmeyerPrep      ? '#60a5fa'
                    : '#94a3b8'
                  }}>
                    {erlenmeyerNaTitulacao ? '↑ Em titulação'
                      : indicadorAdicionado ? '🍷 Com indicador (vinho)'
                      : tampaoAdicionado    ? '💧 Com tampão'
                      : erlenmeyerPrep      ? '💧 50 mL amostra'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* ─ COL 3: Espátula ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="espatula" className={itemCls('espatula')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <EspatulaSVG espatulaComPo={espatulaComIndicador} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('espatula') ? '🖱️ ' : ''}Espátula
                  </span>
                  {espatulaComIndicador && <span style={{ fontSize: 8, color: '#c084fc', fontWeight: 700 }}>● Com indicador</span>}
                </ItemBancada>
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

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(175,215,245,0.80)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* SOLUÇÃO TAMPÃO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ZonaDrop id="tampao" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('tampao')} ${dropCls('tampao')}`}
                    draggable={isItem('tampao')}
                    onDragStart={e => handleDragStart('tampao', e)} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(100,180,220,0.82)" label="Sol. Tampão" sub="Dureza" nivel={tampaoAdicionado ? 62 : 78} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('tampao') ? '🖱️ ' : ''}Sol. Tampão</span>
                  {tampaoAdicionado && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
                </ZonaDrop>
              </div>

              {/* NEGRO DE ERIOCROMO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ZonaDrop id="negro_eriocromo" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`${dropCls('negro_eriocromo')}`}>
                    <FrascoReagente cor="rgba(50,10,60,0.88)" label="Negro Erio." sub="Pó" nivel={espatulaComIndicador ? 55 : 72} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4', textAlign: 'center' }}>Negro Eriocromo</span>
                </ZonaDrop>
              </div>

              {/* EDTA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  className={`item-drag ${itemCls('edta')}`}
                  draggable={isItem('edta')}
                  onDragStart={e => handleDragStart('edta', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FrascoReagente cor="rgba(30,100,210,0.82)" label="EDTA" sub={molaridade} nivel={nivelBureta > 0 ? 48 : 74} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('edta') ? '🖱️ ' : ''}EDTA {molaridade}</span>
                {nivelBureta > 0 && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Na bureta</span>}
              </div>

            </div>{/* fim zona inferior */}

            {/* ══ PAINEL DE TITULAÇÃO (etapa 7) ════════════════════════ */}
            {etapaAtual === 7 && erlenmeyerNaTitulacao && (
              <div style={{ marginTop: 16, background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: '12px 18px', border: `1px solid ${pontoFinal ? 'rgba(59,130,246,0.45)' : 'rgba(34,211,238,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>VOLUME GASTO</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#93c5fd', fontFamily: 'monospace' }}>{volumeGasto.toFixed(1)} mL</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>TITULANTE</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>EDTA {molaridade}</div>
                  </div>
                  {pontoFinal && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, marginBottom: 2 }}>RESULTADO</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{resultadoDureza} ppm CaCO₃</div>
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
                      <div style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700, marginTop: 3 }}>⚠️ Próximo da viragem!</div>
                    )}
                  </div>
                )}
                {!pontoFinal && (
                  <button onClick={handleClicarBureta} style={{ background: 'linear-gradient(90deg,#1e40af,#1d4ed8)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,64,175,0.35)' }}>
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

export default SimuladorDureza;
