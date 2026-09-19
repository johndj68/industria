/**
 * SimuladorViabilidade.jsx — Análise de Viabilidade Celular (Leveduras)
 *
 * Simulador de bancada microbiológica que reproduz o protocolo de contagem
 * e determinação de viabilidade de células de Saccharomyces cerevisiae.
 *
 * Equipamentos simulados:
 *   Micropipeta P1000 · Rack de ponteiras · Tubo de ensaio cônico
 *   Câmara de Neubauer · Microscópio óptico · Vortex mixer
 *
 * Método:
 *   Diluição da amostra + corante (azul de metileno) → Câmara de Neubauer
 *   → Contagem microscópica → Cálculo de viabilidade (%)
 *
 * Usa LayoutSimulador (painel lateral compartilhado).
 */
import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { usePipeta } from '../hooks/usePipeta';
import { useVortex } from '../hooks/useVortex';
import { useSimuladorDrag } from '../hooks/useSimuladorDrag';
import { etapas } from './data/etapasViabilidade';
import TuboEnsaio from '../components/lab/TuboEnsaio';
import TuboEnsaioVazio from '../components/lab/TuboEnsaioVazio';
import TuboEnsaioFinal from '../components/lab/TuboEnsaioFinal';
import RackPonteiras from '../components/lab/RackPonteiras';
import EspatulaSVG from '../components/lab/EspatulaSVG';
import MicropipetaSVG from '../components/lab/MicropipetaSVG';
import MicroscopioSVG from '../components/lab/MicroscopioSVG';
import VortexSVG from '../components/lab/VortexSVG';
import NeubauerSVG from '../components/lab/NeubauerSVG';
import BalaoBancada from '../components/lab/BalaoBancada';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import MicroscopioViabilidade from './MicroscopioViabilidade';



/* etapas — importado de ./data/etapasViabilidade */




/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorMicrobiologico = () => {
  // Registra os listeners de drag no document para mover o overlay visual
  useDragOverlay();

  // ── Hooks ─────────────────────────────────────────────
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
  const {
    vortexLigado, setVortexLigado, vortexAng,
    homogeneizado, setHomogeneizado, tuboNoVortex, setTuboNoVortex,
    tipoTuboVortex, setTipoTuboVortex,
  } = useVortex();

  /* ── ESPÁTULA ───────────────────────────────────── */
  const [espatulaComPo, setEspatulaComPo] = useState(false);

  // ── Tubo de ensaio ────────────────────────────────────
  const [nivelTubo,     setNivelTubo]     = useState(0);
  const [corTubo,       setCorTubo]       = useState('rgba(80,200,120,0.72)');
  const [nivelVazio,    setNivelVazio]    = useState(0);
  const [corVazio,      setCorVazio]      = useState('rgba(80,200,120,0.72)');
  const [nivelFinal,    setNivelFinal]    = useState(0);
  const [corFinal,      setCorFinal]      = useState('rgba(80,200,120,0.72)');
  const [tuboPrep,      setTuboPrep]      = useState(false);

  // ── Amostra ───────────────────────────────────────────
  const [nivelAmostra,  setNivelAmostra]  = useState(80);

  // ── Câmara de Neubauer ────────────────────────────────
  const [neuCarreg,     setNeuCarreg]     = useState(false);
  const [oilAplicado,   setOilAplicado]   = useState(false);
  const [laminaNaMic,   setLaminaNaMic]   = useState(false);

  // ── Microscópio ───────────────────────────────────────
  const [microscopioOn, setMicroscopioOn] = useState(false);
  const [foco,          setFoco]          = useState(50);
  const [contagem,      setContagem]      = useState(null);
  // ──— Interface de viabilidade ───────────────
  const [mostrarViabilidade, setMostrarViabilidade] = useState(false);
  const [viabilidadeConc,    setViabilidadeConc]    = useState(null);

  const etapasPonteiraCorreta = {
    4: 2,  // Etapa 4 → P1000
    11: 0, // Etapa 11 → P20
  };

  // ── Foco do microscópio ───────────────────────────────
  React.useEffect(() => {
    if (!microscopioOn || contagem) return;
    let f = 0;
    const intervalo = setInterval(() => {
      f += 2;
      setFoco(Math.min(f, 100));
      if (f >= 100) {
        clearInterval(intervalo);
        const val = (Math.random() * 3 + 4).toFixed(2);
        setContagem(val);
        celebrarAcerto(200);
        proximaEtapa();
      }
    }, 50);
    return () => clearInterval(intervalo);
  }, [microscopioOn]);

  // ── Drag / drop + helpers de classe ──────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    dropCls, itemCls,
  } = useSimuladorDrag(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setEspatulaComPo,
    setNivelAmostra,
    setNivelTubo, setCorTubo, setTuboPrep,
    setCorVazio, setNivelVazio,
    setCorFinal, setNivelFinal,
    tipIdx, pipetaCheia,
    setCorPipeta, setPipetaCheia, setNivelPipeta, setTipIdx,
    setVortexLigado, setHomogeneizado, setTuboNoVortex, setTipoTuboVortex,
    setNeuCarreg, setOilAplicado, setLaminaNaMic,
  });

  // ── Clique no rack — acoplagem de ponteira ─────────────
  const handlePickTip = (idx, col) => {
    if (tipIdx !== null) return;
    const colEsperada = etapasPonteiraCorreta[etapaAtual];
    if (colEsperada === undefined) return;
    if (col !== colEsperada) return;
    setTips(t => { const n = [...t]; n[idx] = false; return n; });
    setTipIdx(col);
    const vols = [20, 200, 1000];
    setVolumePipeta(vols[col]);
    celebrarAcerto();
    proximaEtapa();
  };

  // ── Clique no microscópio ─────────────────────────────
  const handleClicaMicroscopio = () => {
    // 🔹 ETAPA 19  — focalizar
    if (etapaAtual === 19 && laminaNaMic && !microscopioOn) {
      setMicroscopioOn(true);
    }
    // 🔹 ETAPA 20 — abre interface de viabilidade
    if (etapaAtual === 20 && contagem && !mostrarViabilidade) {
      
      setMostrarViabilidade(true);
    }
  };

  // ── Conclusão da etapa 20 ─────────────────────────────
  const handleViabilidadeConcluida = (vivas, mortas, broto) => {
    setViabilidadeConc({ vivas, mortas, broto });
    setMostrarViabilidade(false);
    celebrarAcerto(300);
    proximaEtapa();
  };

  // ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>
      

      {/* ── MODAL VIABILIDADE CELULAR (ETAPA 20) ── */}
      {mostrarViabilidade && (
        <MicroscopioViabilidade onConcluir={handleViabilidadeConcluida} />
      )}

      {/* ── OVERLAY PARABÉNS ── */}
    {mostrarParabens && (
  <div
    style={{
      position: 'fixed',
      top: 18,
      right: 24,
      zIndex: 60,
      pointerEvents: 'none'
    }}
  >
    <div
      style={{
        background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)',
        color: 'white',
        padding: '20px 36px',
        borderRadius: 22,
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        border: '2px solid rgba(255,255,255,0.9)',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Star size={30} fill="currentColor" />
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Parabéns!</h3>
          <p style={{ fontSize: 15, margin: 0 }}>+100 pontos</p>
        </div>
        <CheckCircle size={30} />
      </div>
    </div>
  </div>
)}

{mostrarErroEtapa && (
  <div
    style={{
      position: 'fixed',
      top: 18,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 70,
      pointerEvents: 'none'
    }}
  >
    <div
      style={{
        background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)',
        color: 'white',
        padding: '14px 26px',
        borderRadius: 16,
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        border: '2px solid rgba(255,255,255,0.85)',
        textAlign: 'center',
        minWidth: 280
      }}
    >
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
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #00e5ff', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: 72 }}>🔬</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#00e5ff', margin: '12px 0' }}>Análise Concluída!</h2>

          {contagem && (
        <div style={{background: 'rgba(0,229,255,0.08)',    border: '1px solid rgba(0,229,255,0.3)',
          borderRadius: 14,padding: '16px 36px',marginBottom: 16}}>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
            Total de Células Contadas
          </div>
          <div style={{fontSize: 48,fontWeight: 900, color: '#00e5ff',fontFamily: 'monospace'}}>
            {(() => {
              const v = parseInt(viabilidadeConc?.vivas) || 0;
              const m = parseInt(viabilidadeConc?.mortas) || 0;
              return v + m;
            })()}
          </div>

          <div style={{ fontSize: 14, color: '#67e8f9' }}>
            células totais (vivas + mortas)
          </div>
        </div>
      )}
            {viabilidadeConc && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 14, padding: '14px 28px', marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Contagem de Viabilidade (Etapa 21)</div>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#54cf81' }}>{viabilidadeConc.vivas || 0}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>🟢 Vivas</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#f87171' }}>{viabilidadeConc.mortas || 0}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>🔴 Mortas</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa' }}>{viabilidadeConc.broto || 0}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>🟣 Brotamento</div>
                  </div>
                  {(parseInt(viabilidadeConc.vivas) + parseInt(viabilidadeConc.mortas) > 0) && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#00e5ff' }}>
                        {(((parseInt(viabilidadeConc.vivas) || 0) / ((parseInt(viabilidadeConc.vivas) || 0) + (parseInt(viabilidadeConc.mortas) || 0))) * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>📊 Viabilidade</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ fontSize: 20, color: '#fbbf24', fontWeight: 700, marginBottom: 24 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', color: 'white', border: 'none', borderRadius: 14, padding: '14px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              🔄 Recomeçar
            </button>
          </div>
        </div>
      )}
    
  <LayoutSimulador etapaAtual={etapaAtual} etapas={etapas}>
                  {/* ── BANCADA DO LABORATÓRIO ── */}
        <div style={{ flex: 1 , minWidth: 600}}>
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 28, padding: '28px 24px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 18, fontWeight: 900, marginBottom: 24, letterSpacing: 1 }}>
            🔬 Bancada do Laboratório de Microbiologia
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 22, padding: '28px 24px', border: '4px solid #292524', minHeight: 600, boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)', position: 'relative' }}>
          
            {/* ══ LINHA SUPERIOR: Equipamentos grandes ══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginBottom: 36, alignItems: 'end' }}>

              {/* ── VÓRTEX ── */}
              <ZonaDrop id="vortex" gap={6} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                <div className={`${dropCls('vortex')}`} style={{ position: "relative",background: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: 8 }}>
                  <VortexSVG ligado={vortexLigado} ang={vortexAng} />
                  {tuboNoVortex && (
                    <div style={{position: "absolute",top: "-100px",left: "50%",transform: "translateX(-50% ) scale(0.90)",}}>
                      {tipoTuboVortex === "tubo"      && (<TuboEnsaio      cor={corTubo}  nivel={nivelTubo}  animando={vortexLigado} vortexAng={vortexAng}/>)}
                      {tipoTuboVortex === "tubovazio" && (<TuboEnsaioVazio cor={corVazio} nivel={nivelVazio} animando={vortexLigado} vortexAng={vortexAng}/>)}
                      {tipoTuboVortex === "tubofinal" && (<TuboEnsaioFinal cor={corFinal} nivel={nivelFinal} animando={vortexLigado} vortexAng={vortexAng}/>)}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e7e5e4' }}>Agitador Vórtex</span>
                {vortexLigado  && <span style={{ fontSize: 9, color: '#34d399', fontWeight: 700 }}>⚡ Agitando...</span>}
                {homogeneizado && <span style={{ fontSize: 9, color: '#6ee7b7', fontWeight: 700 }}>✓ Homogeneizado</span>}
              </ZonaDrop>

              {/* ── ESPÁTULA METÁLICA ── */}
              <ItemBancada id="espatula" className={itemCls('espatula')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <EspatulaSVG espatulaComPo={espatulaComPo} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Espátula</span>
              </ItemBancada>

              {/* ── CÂMARA DE NEUBAUER ── */}
              <ZonaDrop id="neubauer" gap={6} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                <div
                  className={`item-drag ${itemCls('neubauer')} ${dropCls('neubauer')}`}
                  style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: 10, position: 'relative', display: 'inline-block' }}
                  draggable={etapaAtual === 18}
                  onDragStart={e => handleDragStart('neubauer', e)}
                  onDragEnd={handleDragEnd}>
                  <NeubauerSVG carregada={neuCarreg} comOleo={oilAplicado} />
                  {neuCarreg   && <div style={{ position: 'absolute', top: 6, right: 6, background: '#22c55e', borderRadius: 99, padding: '2px 8px', fontSize: 8, color: 'white', fontWeight: 700 }}>✓ Carregada</div>}
                  {oilAplicado && <div style={{ position: 'absolute', bottom: 6, right: 6, background: '#d97706', borderRadius: 99, padding: '2px 8px', fontSize: 8, color: 'white', fontWeight: 700 }}>+ Óleo</div>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e7e5e4' }}>Câmara de Neubauer</span>
                {etapaAtual === 18 && !laminaNaMic && (
                  <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700 }}>🖱️ Arraste para o microscópio</span>
                )}
              </ZonaDrop>

              {/* ── MICROSCÓPIO ── */}
              <ZonaDrop id="microscopio" gap={6} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                <div
                  className={`${dropCls('microscopio')}`}
                  style={{ cursor: etapaAtual === 19 || etapaAtual === 20 ? 'pointer' : 'default', background: 'rgba(0,0,0,0.22)', borderRadius: 14, padding: '8px 12px' }}
                  onClick={handleClicaMicroscopio}>
                  <MicroscopioSVG ativo={microscopioOn} lamina={laminaNaMic} foco={foco} />
                  {laminaNaMic && !microscopioOn && (
                    <div style={{ textAlign: 'center', fontSize: 8, color: '#67e8f9', fontWeight: 700, marginTop: 4 }}>
                      Câmara posicionada ✓ — Clique para focar!
                    </div>
                  )}
                  {etapaAtual === 20 && contagem && (
                    <div style={{ textAlign: 'center', fontSize: 8, color: '#a78bfa', fontWeight: 700, marginTop: 4 }}>
                      🔬 Clique para análise de viabilidade!
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e7e5e4' }}>Microscópio Óptico</span>

                {/* Barra de foco */}
                {microscopioOn && !contagem && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 60, height: 5, background: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${foco}%`, background: '#00e5ff', transition: 'width 0.1s' }} />
                    </div>
                    <span style={{ fontSize: 9, color: '#67e8f9', fontWeight: 700 }}>Focalizando {foco}%</span>
                  </div>
                )}
              </ZonaDrop>

              {/* ── MICROPIPETA ── */}
              <ItemBancada id="pipeta" className={itemCls('pipeta')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <MicropipetaSVG nivel={nivelPipeta} corLiq={corPipeta} volume={volumePipeta} tipMounted={tipIdx} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Micropipeta</span>
                {pipetaCheia && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>● Carregada</span>}
                {tipIdx === null && <span style={{ fontSize: 8, color: '#f87171', fontWeight: 700 }}>Sem ponteira</span>}
              </ItemBancada>

              {/* ── RACK DE PONTEIRAS ── */}
              <div
                className={itemCls('rack')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <RackPonteiras tips={tips} onTake={handlePickTip} />
              </div>

            </div>
            
            {/* ══ LINHA INFERIOR: Reagentes + Instrumentos ══ */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18 }}>

              {/* ── TUBO DE ENSAIO GRADUADO ── */}
              <ZonaDrop id="tubo" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                <div
                  className={`item-drag ${itemCls('tubo')} ${dropCls('tubo')}`}
                  style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '5px 2px' }}
                  draggable={etapaAtual === 3}
                  onDragStart={e => handleDragStart('tubo', e)}
                  onDragEnd={handleDragEnd}>
                  {!(tuboNoVortex && tipoTuboVortex === "tubo") && (<TuboEnsaio cor={corTubo} nivel={nivelTubo} />)}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Tubo de Ensaio 10 mL</span>
                {tuboPrep && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Com amostra</span>}
              </ZonaDrop>

              {/* ── TUBO DE ENSAIO 2 ── */}
              <ZonaDrop id="tubovazio" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                <div
                  className={`item-drag ${itemCls('tubovazio')} ${dropCls('tubovazio')}`}
                  style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '8px 2px' }}
                  draggable={etapaAtual === 8}
                  onDragStart={e => handleDragStart('tubovazio', e)}
                  onDragEnd={handleDragEnd}>
                  {!(tuboNoVortex && tipoTuboVortex === "tubovazio") && (<TuboEnsaioVazio cor={corVazio} nivel={nivelVazio} />)}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Tubo de Diluição</span>
                {tuboPrep && <span style={{ fontSize: 8, color: '#999999', fontWeight: 700 }}>✓ Com amostra</span>}
              </ZonaDrop>

              {/* ── TUBO DE ENSAIO 3 ── */}
              <ZonaDrop id="tubofinal" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                <div
                  className={`item-drag ${itemCls('tubofinal')} ${dropCls('tubofinal')}`}
                  style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '8px 2px' }}
                  draggable={etapaAtual === 14}
                  onDragStart={e => handleDragStart('tubofinal', e)}
                  onDragEnd={handleDragEnd}>
                  {!(tuboNoVortex && tipoTuboVortex === "tubofinal") && (<TuboEnsaioFinal cor={corFinal} nivel={nivelFinal} />)}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Tubo de Ensaio 10 mL</span>
                {tuboPrep && <span style={{ fontSize: 8, color: '#999999', fontWeight: 700 }}>✓ Com amostra</span>}
              </ZonaDrop>

              {/* ── FRASCO AMOSTRA ── */}
              <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <FrascoReagente cor="rgba(192, 121, 29, 0.75)" label="Amostra" nivel={nivelAmostra} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra Celular</span>
              </ItemBancada>

              {/* ── ERITROSINA ── */}
              <ZonaDrop id="eritrosina" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                <div className={dropCls('eritrosina')} style={{ borderRadius: 12 }}>
                  <FrascoReagente cor="rgba(255,60,130,0.75)" label="Eritrosina" sub="0,1%" nivel={72} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Eritrosina 0,1%</span>
              </ZonaDrop>

              {/* ── PAPAÍNA ── */}
              <div className={`item-drag ${dropCls('papaina')}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                draggable={false}
                onDragStart={e => handleDragStart('papaina', e)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop("papaina", e)}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}> 
                <FrascoReagente cor="rgba(255,210,70,0.75)" label="Papaína" sub="0,25%" nivel={60} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Papaína</span>
              </div>

              {/* ── ÁGUA DESMINERALIZADA ── */}
              <ItemBancada id="agua" className={itemCls('agua')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <FrascoReagente cor="rgba(100,185,255,0.65)" label="H₂O desm." nivel={85} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Água Desmin.</span>
              </ItemBancada>

              {/* ── ÓLEO DE IMERSÃO ── */}
              <ItemBancada id="oil" className={itemCls('oil')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className={dropCls('oil')} style={{ borderRadius: 12 }}>
                  <FrascoReagente cor="rgba(215,190,45,0.82)" label="Óleo 100×" nivel={55} w={46} h={68} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Óleo de Imersão</span>
              </ItemBancada>

              {/* ── BÉQUER DE DESCARTE ── */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <BalaoBancada nivel={20} cor="rgba(150,200,255,0.3)" />
              </div>

            </div>


            {/* ── AVISO DE AGITAÇÃO ── */}
            {vortexLigado && (
              <div style={{ position: 'absolute', top: 16, right: 16, background: '#f59e0b', color: '#78350f', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700, boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
                ⚡ Homogeneizando...
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
      </div>
    </LayoutSimulador>
    </div>
  );
};
export default SimuladorMicrobiologico;