/**
 * SimuladorSilicaBaixa.jsx — Análise de Sílica Baixa (Método Azul Heteropoli)
 *
 * Reproduz o protocolo HACH 8185 (DR900): 27 etapas.
 * Fluxo: Proveta → Copos → Molybdate (pipeta) → Citric Acid (pipeta)
 *        → Amino Acid F (pipeta, só Copo A) → Cubeta → Fotometria.
 *
 * Usa LayoutSimulador (painel lateral compartilhado).
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import RackPonteiras from '../components/lab/RackPonteiras';
import MicropipetaSVG from '../components/lab/MicropipetaSVG';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { usePipeta } from '../hooks/usePipeta';
import { useSimuladorDragSilica } from '../hooks/useSimuladorDragSilica';
import { useFotometro } from '../hooks/useFotometro';
import ItemBancada from '../components/lab/ItemBancada';
import { etapas } from './data/etapasSilicaBaixa';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import CubetaSVG from '../components/lab/CubetaSVG';
import FotometroSVG from '../components/lab/FotometroSVG';
import CopoTransparenteSVG from '../components/lab/CopoTransparenteSVG';


const ESPERA_CONFIG = {
  9:  { duracao: 3000, label: '4 minutos', descricao: 'Formação do complexo silicomolibdato amarelo', cor: '#fbbf24', corBg: 'rgba(251,191,36,0.10)' },
  15: { duracao: 3000, label: '4 minutos', descricao: 'Citric Acid eliminando interferências de fosfato', cor: '#86efac', corBg: 'rgba(134,239,172,0.10)' },
  19: { duracao: 3000, label: '1 minuto',  descricao: 'Desenvolvimento da coloração azul heteropoli',    cor: '#60a5fa', corBg: 'rgba(96,165,250,0.10)' },
  26: { duracao: 3000, label: '30 segundos', descricao: 'Estabilizando leitura fotométrica',             cor: '#c084fc', corBg: 'rgba(192,132,252,0.10)' },
};

/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorSilicaBaixa = () => {
  useDragOverlay();

  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado, mostrarParabens,
    concluido, mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  const {
    nivelPipeta, setNivelPipeta, corPipeta, setCorPipeta,
    pipetaCheia, setPipetaCheia, volumePipeta, setVolumePipeta,
    tipIdx, setTipIdx, tips, setTips,
  } = usePipeta();

  // ── Proveta ────────────────────────────────────────────
  const [nivelProveta,  setNivelProveta]  = useState(0);
  const [provetaCheia,  setProvetaCheia]  = useState(false);

  // ── Amostra ────────────────────────────────────────────
  const [nivelAmostra,  setNivelAmostra]  = useState(82);

  // ── Copos ──────────────────────────────────────────────
  const [nivelCopoA,    setNivelCopoA]    = useState(0);
  const [corCopoA,      setCorCopoA]      = useState('rgba(100,180,255,0.35)');
  const [nivelBranco,   setNivelBranco]   = useState(0);
  const [corBranco,     setCorBranco]     = useState('rgba(200,230,255,0.35)');

  // ── Reagentes ──────────────────────────────────────────
  const [molibdatoBranco, setMolibdatoBranco] = useState(false);
  const [molibdatoA,      setMolibdatoA]      = useState(false);
  const [citricoBranco,   setCitricoBranco]   = useState(false);
  const [citricoA,        setCitricoA]        = useState(false);
  const [aminoA,          setAminoA]          = useState(false);

  // ── Cubeta ─────────────────────────────────────────────
  const [nivelCubeta,       setNivelCubeta]       = useState(0);
  const [corCubeta,         setCorCubeta]         = useState('rgba(220,235,255,0.08)');
  const [cubetaNoFotometro, setCubetaNoFotometro] = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const { zerando, zerado, lendo, resultado, handleZero, handleLer } = useFotometro({
    etapaAtual, cubetaNoFotometro, setCubetaNoFotometro,
    setNivelCubeta, setCorCubeta, celebrarAcerto, proximaEtapa,
  });

  // ── Ponteiras esperadas por etapa ─────────────────────
  const etapasPonteiraCorreta = { 4: 2, 10: 2, 16: 2 }; // P1000

  // ── Animação nível pipeta ─────────────────────────────
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

  // ── Timers automáticos ────────────────────────────────
  useEffect(() => {
    const timerMap = { 9: 3000, 15: 3000, 19: 3000, 26: 3000 };
    const delay = timerMap[etapaAtual];
    if (delay === undefined) return;
    const id = setTimeout(() => {
      celebrarAcerto(100);
      proximaEtapa();
    }, delay);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Progresso visual de espera ────────────────────────
  const [progressoEspera, setProgressoEspera] = useState(0);
  useEffect(() => {
    const cfg = ESPERA_CONFIG[etapaAtual];
    if (!cfg) return;
    let current = 0;
    const steps = 80;
    const id = setInterval(() => {
      current += 1;
      setProgressoEspera(Math.min((current / steps) * 100, 100));
      if (current >= steps) clearInterval(id);
    }, cfg.duracao / steps);
    return () => clearInterval(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragSilica(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAmostra,
    tipIdx, pipetaCheia,
    setCorPipeta, setPipetaCheia, setNivelPipeta, setTipIdx,
    setNivelCopoA, setCorCopoA,
    setNivelBranco, setCorBranco,
    setNivelCubeta, setCorCubeta,
    setCubetaNoFotometro,
    setMolibdatoBranco, setMolibdatoA,
    setCitricoBranco, setCitricoA,
    setAminoA,
  });

  // ── Clique no rack ────────────────────────────────────
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


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding: 16,
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* ── OVERLAY PARABÉNS ── */}
      {mostrarParabens && (
        <div style={{
          position: 'fixed', top: 18,
          right: 24,
          zIndex: 60, pointerEvents: 'none',
        }}>
          <div style={{
            background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)',
            color: 'white', padding: '20px 36px', borderRadius: 22,
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            border: '2px solid rgba(255,255,255,0.9)', textAlign: 'center',
          }}>
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
        <div style={{
          position: 'fixed', top: 18, left: '50%',
          transform: 'translateX(-50%)', zIndex: 70, pointerEvents: 'none',
        }}>
          <div style={{
            background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)',
            color: 'white', padding: '14px 26px', borderRadius: 16,
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            border: '2px solid rgba(255,255,255,0.85)',
            textAlign: 'center', minWidth: 280,
          }}>
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

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70,
        }}>
          <div style={{
            background: 'linear-gradient(135deg,#1e3a5f,#0d2137)',
            border: '2px solid #00e5ff', borderRadius: 24,
            padding: '48px 64px', textAlign: 'center', color: 'white',
            maxWidth: 460, boxShadow: '0 32px 80px rgba(0,0,0,0.75)',
          }}>
            <div style={{ fontSize: 72 }}>🔷</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#00e5ff', margin: '12px 0 6px' }}>
              Análise Concluída!
            </h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 20px' }}>
              Sílica Baixa · Método Azul Heteropoli · HACH 8185 · λ = 810 nm
            </p>
            <div style={{
              background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)',
              borderRadius: 14, padding: '16px 36px', marginBottom: 14,
            }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Resultado fotométrico</div>
              <div style={{
                fontSize: 52, fontWeight: 900, color: '#00ff88',
                fontFamily: 'monospace', lineHeight: 1,
              }}>{resultado}</div>
              <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>mg/L SiO₂</div>
            </div>
            <div style={{
              background: parseFloat(resultado) <= 1.60 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${parseFloat(resultado) <= 1.60 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 11, padding: '9px 18px', marginBottom: 20, fontSize: 11.5,
              color: parseFloat(resultado) <= 1.60 ? '#22c55e' : '#f87171',
            }}>
              {parseFloat(resultado) <= 1.60
                ? '✅ Sílica dentro da faixa esperada (≤ 1.60 mg/L)'
                : '⚠️ Atenção: sílica acima da faixa esperada'}
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(90deg,#0ea5e9,#6366f1)',
                color: 'white', border: 'none', borderRadius: 11,
                padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
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
        titulo="Sílica Baixa"
        subtitulo={"Método Azul Heteropoli\nHACH 8185 · DR900"}
        icone="🔷"
        badges={['💧 ÁGUAS', '🔬 FOTOMETRIA']}
        footerLabel="🔷 Sílica Baixa"
      >
        <div style={{
          background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)',
          borderRadius: 26, padding: '22px 18px',
          border: '8px solid #8b6e45',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 720,
        }}>
          <h2 style={{
            textAlign: 'center', color: '#4a3010', fontSize: 15,
            fontWeight: 900, marginBottom: 18, letterSpacing: 0.8,
          }}>
            🔷 Bancada — Análise de Sílica Baixa (Método Azul Heteropoli)
          </h2>

          <div style={{
            background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)',
            borderRadius: 20, padding: '20px 18px', border: '4px solid #292524',
            boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)',
          }}>

            {/* ══ ZONA SUPERIOR: INSTRUMENTOS ANALÍTICOS ══════════════ */}
            {/* Fotômetro (esq) · Pipeta + Rack (centro) · Cubeta (dir) */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>

              {/* FOTÔMETRO — esquerda, fixo */}
              <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div className={dropCls('fotometro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                  <FotometroSVG
                    cubetaDentro={cubetaNoFotometro}
                    zerando={zerando}
                    zerado={zerado && !cubetaNoFotometro}
                    lendo={lendo}
                    resultado={resultado}
                    zerAtivo={etapaAtual === 22 && cubetaNoFotometro && !zerando}
                    lerAtivo={etapaAtual === 25 && cubetaNoFotometro && !lendo && !resultado}
                    onZero={handleZero}
                    onLer={handleLer}
                  />
                  {etapaAtual === 22 && cubetaNoFotometro && !zerando && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>🔵 Clique ZERO para zerar!</div>
                  )}
                  {etapaAtual === 25 && cubetaNoFotometro && !lendo && !resultado && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>🟢 Clique READ para ler!</div>
                  )}
                  {(zerando || lendo) && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>⚡ Processando...</div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Fotômetro HACH DR900</span>
              </ZonaDrop>

              {/* MICROPIPETA + RACK — centro */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-end' }}>
                <ItemBancada id="pipeta" className={itemCls('pipeta')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <MicropipetaSVG nivel={nivelPipeta} corLiq={corPipeta} volume={volumePipeta} tipMounted={tipIdx} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Micropipeta P1000</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: pipetaCheia ? '#34d399' : tipIdx !== null ? '#fbbf24' : '#f87171' }}>
                    {pipetaCheia ? '● Carregada' : tipIdx !== null ? 'P1000 acoplada' : 'Sem ponteira'}
                  </span>
                </ItemBancada>

                <div className={isItem('rack') ? 'pulse-item' : ''}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 11, padding: 8 }}>
                    <RackPonteiras tips={tips} onTake={handlePickTip} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Rack de Ponteiras</span>
                  {isItem('rack') && <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique P1000 (amarela)</span>}
                </div>
              </div>

              {/* CUBETA — direita, par natural do fotômetro */}
              <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={`item-drag ${itemCls('cubeta')} ${dropCls('cubeta')}`}
                  style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 11, padding: '4px 2px' }}
                  draggable={(etapaAtual === 21 || etapaAtual === 24) && !cubetaNoFotometro}
                  onDragStart={e => handleDragStart('cubeta', e)}
                  onDragEnd={handleDragEnd}
                >
                  {!cubetaNoFotometro
                    ? <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="main" />
                    : (
                      <div style={{ width: 80, height: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <span style={{ fontSize: 18 }}>✅</span>
                        <span style={{ fontSize: 8.5, color: '#22c55e', fontWeight: 700 }}>No fotômetro</span>
                      </div>
                    )
                  }
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>
                  {(etapaAtual === 21 || etapaAtual === 24) && !cubetaNoFotometro ? '🖱️ ' : ''}Cubeta 25 mm
                </span>
                {nivelCubeta > 0 && !cubetaNoFotometro && (
                  <span style={{ fontSize: 8, color: corCubeta.includes('198') ? '#60a5fa' : '#fbbf24', fontWeight: 700 }}>
                    {corCubeta.includes('198') ? '🔵 Amostra azul' : '🟡 Branco'}
                  </span>
                )}
              </ZonaDrop>

            </div>{/* fim zona superior */}

            {/* ══ ANIMAÇÃO DE ESPERA ═══════════════════════════════════ */}
            {ESPERA_CONFIG[etapaAtual] && (() => {
              const cfg = ESPERA_CONFIG[etapaAtual];
              return (
                <div style={{ marginBottom: 18, borderRadius: 14, padding: '14px 18px', background: cfg.corBg, border: `1px solid ${cfg.cor}55`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24, display: 'inline-block', animation: 'silicaWaitSpin 3s linear infinite' }}>⏳</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: cfg.cor, marginBottom: 3 }}>
                        Aguardando {cfg.label}...
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.4 }}>{cfg.descricao}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: cfg.cor, fontFamily: 'monospace', minWidth: 44, textAlign: 'right' }}>
                      {Math.round(progressoEspera)}%
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressoEspera}%`, background: `linear-gradient(90deg,${cfg.cor}77,${cfg.cor})`, borderRadius: 4, transition: 'width 0.12s ease', boxShadow: `0 0 10px ${cfg.cor}66` }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {[0,1,2,3,4].map(i => (
                      <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: cfg.cor, opacity: progressoEspera > i * 20 ? 1 : 0.15, transition: 'opacity 0.4s ease', boxShadow: progressoEspera > i * 20 ? `0 0 7px ${cfg.cor}` : 'none', animation: progressoEspera > i * 20 ? `silicaWaitBounce 1s ${i * 0.15}s ease-in-out infinite` : 'none' }} />
                    ))}
                  </div>
                  <style>{`
                    @keyframes silicaWaitSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                    @keyframes silicaWaitBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
                  `}</style>
                </div>
              );
            })()}

            {/* ══ ZONA CENTRAL: PREPARAÇÃO DA AMOSTRA ═════════════════ */}
            {/* Amostra → Proveta → Copo Branco · Copo A (fluxo esq→dir) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'flex-end', paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>

              {/* PROVETA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta 50 mL</span>
                  {provetaCheia && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>25 mL medidos</span>}
                </ZonaDrop>
              </div>

              {/* COPO BRANCO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="copobranco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`item-drag ${itemCls('copobranco')} ${dropCls('copobranco')}`}
                    draggable={isItem('copobranco')}
                    onDragStart={e => handleDragStart('copobranco', e)} onDragEnd={handleDragEnd}>
                    <CopoTransparenteSVG nivel={nivelBranco} cor={corBranco} id="gb" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>{isItem('copobranco') ? '🖱️ ' : ''}Copo Branco</span>
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>
                    {citricoBranco ? '🟡 Citric Acid ✓' : molibdatoBranco ? '🟡 Molybdate ✓' : nivelBranco > 0 ? '💧 Amostra' : 'Branco ref.'}
                  </span>
                </ZonaDrop>
              </div>

              {/* COPO A */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="copoA" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`item-drag ${itemCls('copoA')} ${dropCls('copoA')}`}
                    draggable={isItem('copoA')}
                    onDragStart={e => handleDragStart('copoA', e)} onDragEnd={handleDragEnd}>
                    <CopoTransparenteSVG nivel={nivelCopoA} cor={corCopoA} id="ga" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>{isItem('copoA') ? '🖱️ ' : ''}Copo A</span>
                  <span style={{ fontSize: 8, color: aminoA ? '#60a5fa' : citricoA ? '#fbbf24' : '#94a3b8' }}>
                    {aminoA ? '🔵 Azul heteropoli ✓' : citricoA ? '🟡 Citric Acid ✓' : molibdatoA ? '🟡 Molybdate ✓' : nivelCopoA > 0 ? '💧 Amostra' : 'Amostra'}
                  </span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona central */}

            {/* ══ ZONA INFERIOR: REAGENTES ════════════════════════════ */}
            {/* Pipeta aspira aqui: Molybdate → Citric Acid → Amino Acid F */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'flex-end' }}>

              {/* FRASCO DE AMOSTRA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} draggable={isItem('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,200,240,0.78)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* MOLYBDATE 3 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="molibdato" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={dropCls('molibdato')}>
                    <FrascoReagente cor="rgba(220,160,40,0.85)" label="Molybdate 3" nivel={molibdatoA ? 52 : 72} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Molybdate 3</span>
                  {molibdatoA && molibdatoBranco && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
                </ZonaDrop>
              </div>

              {/* CITRIC ACID */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="citrico" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={dropCls('citrico')}>
                    <FrascoReagente cor="rgba(100,205,80,0.85)" label="Citric Acid" nivel={citricoA ? 60 : 78} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Citric Acid</span>
                  {citricoA && citricoBranco && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
                </ZonaDrop>
              </div>

              {/* AMINO ACID F */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="amino" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={dropCls('amino')}>
                    <FrascoReagente cor="rgba(40,80,220,0.85)" label="Amino Acid" sub="F" nivel={aminoA ? 58 : 75} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Amino Acid F</span>
                  <span style={{ fontSize: 8, color: aminoA ? '#34d399' : '#f59e0b', fontWeight: 700 }}>
                    {aminoA ? '✓ Adicionado (Copo A)' : '⚠️ Só no Copo A!'}
                  </span>
                </ZonaDrop>
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

export default SimuladorSilicaBaixa;
