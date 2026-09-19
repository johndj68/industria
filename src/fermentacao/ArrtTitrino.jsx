/**
 * ArrtTitrino.jsx — Determinação de ARRT em Dornas
 *
 * Açúcares Redutores Residuais Totais · Método Titrino com Micro-ondas
 * Fluxo: Filtração algodão → 15 mL → Micro-ondas → HCl → Fenol → NaOH
 *        → Fehling A/B → Vidro Relógio → Micro-ondas → Água → Iodeto
 *        → H₂SO₄ → Titrino Plus (método Dorna) → Resultado ARRT
 *
 * Usa LayoutSimulador (painel lateral compartilhado).
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragArrt } from '../hooks/useSimuladorDragArrt';
import { useTitrinoArrt } from '../hooks/useTitrinoArrt';
import { useArrtTimers } from '../hooks/useArrtTimers';
import { etapas } from './data/etapasArrtTitrino';
import BequerSVG from '../components/lab/BequerSVG';
import PipetaLabSVG from '../components/lab/PipetaLabSVG';
import MicroondasArrtSVG from '../components/lab/MicroondasArrtSVG';
import TitrinoSVG from '../components/lab/TitrinoSVG';
import VidroRelogioSVG from '../components/lab/VidroRelogioSVG';


/* ═══════════════════════════════════════════════════════════
   CSS — animações Titrino (curva + fade)
═══════════════════════════════════════════════════════════ */
const ARRT_CSS = `
  @keyframes drawARRTCurve {
    0%   { stroke-dashoffset: 180; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes arrtFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes arrtDropFall {
    0%   { opacity: 0; transform: translateY(0px); }
    8%   { opacity: 1; transform: translateY(3px); }
    78%  { opacity: 1; transform: translateY(50px); }
    100% { opacity: 0; transform: translateY(60px); }
  }
`;


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorArrtTitrino = () => {
  useDragOverlay();

  // ── Injeta CSS de animações (curva Titrino) ───────────
  useEffect(() => {
    const sid = 'arrt-titrino-css';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ARRT_CSS;
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

  // ── Funil / algodão ───────────────────────────────────
  const [funilAcoplado,    setFunilAcoplado]    = useState(false);
  const [algodaoNoFunil,   setAlgodaoNoFunil]   = useState(false);

  // ── Filtração (timer trigger) ─────────────────────────
  const [filtrando,        setFiltrando]        = useState(false);
  const [amostraFiltrada,  setAmostraFiltrada]  = useState(false);
  const [nivelBequer400,   setNivelBequer400]   = useState(0);

  // ── Pipeta ────────────────────────────────────────────
  const [pipetaCheia,      setPipetaCheia]      = useState(false);
  const [corPipeta,        setCorPipeta]        = useState('rgba(140,200,240,0.65)');

  // ── Béquer 150 mL ─────────────────────────────────────
  const [nivelBequer150,   setNivelBequer150]   = useState(0);
  const [corBequer150,     setCorBequer150]     = useState('rgba(220,235,255,0.06)');

  // ── Micro-ondas ───────────────────────────────────────
  const [bequerNoMicro1,   setBequerNoMicro1]   = useState(false);
  const [bequerNoMicro2,   setBequerNoMicro2]   = useState(false);
  // derivados — aquecendo quando béquer está no micro-ondas
  const aquecendo1 = bequerNoMicro1;
  const aquecendo2 = bequerNoMicro2;

  // ── Fenolftaleína (timer trigger) ─────────────────────
  const [fenolGotas,       setFenolGotas]       = useState(false);

  // ── Animação NaOH (titulação) ─────────────────────────
  const [titulandoNaOH,    setTitulandoNaOH]    = useState(false);

  // ── Vidro relógio ─────────────────────────────────────
  const [vidroRelogioAcoplado, setVidroRelogioAcoplado] = useState(false);

  // ── Titrino ───────────────────────────────────────────
  const {
    bequerNoTitrino, setBequerNoTitrino,
    titrinoLendo, curvaFinalizada, resultadoArrt,
    handleClickTitrino,
  } = useTitrinoArrt({ etapaAtual, celebrarAcerto, proximaEtapa });

  // ── Timers de processo ────────────────────────────────
  useArrtTimers({
    filtrando, setFiltrando, setAmostraFiltrada, setFunilAcoplado, setNivelBequer400,
    titulandoNaOH, setTitulandoNaOH,
    fenolGotas, setFenolGotas, setCorBequer150,
    bequerNoMicro1, setBequerNoMicro1,
    bequerNoMicro2, setBequerNoMicro2, setVidroRelogioAcoplado,
    celebrarAcerto, proximaEtapa,
  });

  // ── TIMER: auto-conclusão última etapa (24) ───────────
  useEffect(() => {
    if (etapaAtual !== 24) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragArrt(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    funilAcoplado, setFunilAcoplado, setAlgodaoNoFunil,
    setFiltrando,
    pipetaCheia, setPipetaCheia, setCorPipeta,
    nivelBequer150, setNivelBequer150, setCorBequer150,
    setBequerNoMicro1, setBequerNoMicro2,
    setFenolGotas,
    setTitulandoNaOH,
    setVidroRelogioAcoplado,
    setBequerNoTitrino,
  });

  // Béquer 150 visível na bancada quando NÃO está no microondas nem no titrino
  const bequerNaBancada = !bequerNoMicro1 && !bequerNoMicro2 && !bequerNoTitrino;
  const aquecendoAtivo  = aquecendo1 || aquecendo2;
  const bequerDentroMicro = bequerNoMicro1 || bequerNoMicro2;


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

      {/* ── BANNERS DE PROCESSO ── */}
      {filtrando && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9)', color: 'white', padding: '12px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>🔍 Filtrando em Algodão...</div>
          </div>
        </div>
      )}
      {aquecendoAtivo && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#78350f,#b45309,#f59e0b)', color: 'white', padding: '12px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>⚡ Micro-ondas — 30s em ebulição...</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultadoArrt !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #22d3ee', borderRadius: 24, padding: '48px 60px', textAlign: 'center', color: 'white', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🧪</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#22d3ee', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de ARRT em Dornas · Método Titrino com Micro-ondas
            </p>
            <div style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Resultado da Análise</div>
              <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#22d3ee', fontFamily: 'monospace', lineHeight: 1 }}>{resultadoArrt}</div>
                  <div style={{ fontSize: 13, color: '#67e8f9', marginTop: 4 }}>% ARRT</div>
                </div>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                  <div style={{ fontSize: 11, color: '#60a5fa' }}>Método: Dorna</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Titrino Plus</div>
                  <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>✓ Leitura finalizada</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Observação: resultado obtido pelo método Dorna no Titrino Plus (Metrohm)
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#22d3ee,#6366f1)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="ARRT — Dornas"
        subtitulo={"Açúcares Redutores Residuais Totais\nMétodo Titrino · Micro-ondas"}
        icone="⚗️"
        badges={['🍶 FERMENTAÇÃO', '📈 TITRINO']}
        footerLabel="⚗️ ARRT Dornas"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 780 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            ⚗️ Bancada — ARRT em Dornas (Método Titrino com Micro-ondas)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA EQUIPAMENTOS: Microondas · Béquers · Titrino ═══ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* MICRO-ONDAS — esquerda, fixo */}
              <ZonaDrop id="microondas" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div className={dropCls('microondas')} style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px' }}>
                  <MicroondasArrtSVG aquecendo={aquecendoAtivo} bequerDentro={bequerDentroMicro} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Micro-ondas Lab</span>
                {aquecendoAtivo && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚡ 30s em ebulição...</span>}
              </ZonaDrop>

              {/* BÉQUER 400 mL — centro esquerdo */}
              <ZonaDrop id="bequer400" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div className={dropCls('bequer400')} style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '4px 6px' }}>
                  <BequerSVG ml={400} nivel={nivelBequer400} cor="rgba(220,190,100,0.58)"
                    id="b400" funilAcoplado={funilAcoplado} algodaoVisible={algodaoNoFunil} filtrando={filtrando} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Béquer 400 mL</span>
                <span style={{ fontSize: 8, color: amostraFiltrada ? '#22c55e' : funilAcoplado ? '#fbbf24' : '#94a3b8' }}>
                  {amostraFiltrada ? '✓ Filtrado' : funilAcoplado ? algodaoNoFunil ? '🔍 Com algodão' : '↑ Funil acoplado' : 'Vazio'}
                </span>
              </ZonaDrop>

              {/* BÉQUER 150 mL — centro direito */}
              <ZonaDrop id="bequer150" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={`item-drag ${itemCls('bequer150')} ${dropCls('bequer150')}`}
                  style={{ opacity: bequerNaBancada ? 1 : 0.14, transition: 'opacity 0.3s', background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '4px 6px' }}
                  draggable={isItem('bequer150') && bequerNaBancada}
                  onDragStart={e => handleDragStart('bequer150', e)}
                  onDragEnd={handleDragEnd}
                >
                  <BequerSVG ml={150} nivel={nivelBequer150} cor={corBequer150}
                    id="b150" vidroRelogioAcoplado={vidroRelogioAcoplado}
                    gotasFenol={fenolGotas} titulando={titulandoNaOH} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: bequerNaBancada ? '#e7e5e4' : '#57534e' }}>
                  {isItem('bequer150') && bequerNaBancada ? '🖱️ ' : ''}Béquer 150 mL
                </span>
                <span style={{ fontSize: 8, fontWeight: 700, color: bequerNoTitrino ? '#57534e' : bequerDentroMicro ? '#f59e0b' : vidroRelogioAcoplado ? '#60a5fa' : nivelBequer150 > 0 ? '#22c55e' : '#94a3b8' }}>
                  {bequerNoTitrino ? '↑ No Titrino' : bequerDentroMicro ? '⚡ No micro-ondas' : vidroRelogioAcoplado ? '🔵 Vidro relógio' : nivelBequer150 > 0 ? '💧 Com solução' : 'Vazio'}
                </span>
              </ZonaDrop>

              {/* TITRINO PLUS — direita, fixo */}
              <ZonaDrop id="titrino" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={dropCls('titrino')}
                  style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '8px 10px', cursor: etapaAtual === 23 && bequerNoTitrino && !titrinoLendo && !curvaFinalizada ? 'pointer' : 'default' }}
                  onClick={handleClickTitrino}
                >
                  <TitrinoSVG
                    bequerPresente={bequerNoTitrino}
                    lendo={titrinoLendo}
                    curvaFinalizada={curvaFinalizada}
                    resultado={resultadoArrt}
                    ativo={etapaAtual === 23 && bequerNoTitrino && !titrinoLendo && !curvaFinalizada}
                  />
                  {etapaAtual === 23 && bequerNoTitrino && !titrinoLendo && !curvaFinalizada && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>
                      🟢 Clique em DORNA para iniciar!
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Titrino Plus</span>
                {resultadoArrt && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ {resultadoArrt}% ARRT</span>}
              </ZonaDrop>

            </div>{/* fim zona equipamentos */}

            {/* ══ ZONA VIDRARIA + FERRAMENTAS ═════════════════════════ */}
            {/* Amostra → Funil → Algodão → Pipeta → Vidro Relógio       */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, alignItems: 'flex-end', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* AMOSTRA DORNA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(210,180,85,0.80)" label="Amostra" sub="Dorna" nivel={82} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra Dorna</span>
                </ItemBancada>
              </div>

              {/* FUNIL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('funil')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: funilAcoplado ? 0.15 : 1, transition: 'opacity 0.3s' }}
                  draggable={isItem('funil') && !funilAcoplado}
                  onDragStart={e => handleDragStart('funil', e)}
                  onDragEnd={handleDragEnd}
                >
                  <svg width="52" height="62" viewBox="0 0 52 62">
                    <path d="M2,2 L50,2 L32,52 L20,52 Z" fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.4" />
                    <ellipse cx={26} cy={2} rx={24} ry={4} fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.2" />
                    <rect x={22} y={52} width={8} height={8} rx="1.5" fill="rgba(165,215,255,0.30)" stroke="#8ac4dc" strokeWidth="1.0" />
                    <line x1={6} y1={5} x2={14} y2={50} stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700, color: funilAcoplado ? '#57534e' : '#e7e5e4' }}>
                    {isItem('funil') ? '🖱️ ' : ''}Funil
                  </span>
                  {funilAcoplado && <span style={{ fontSize: 8, color: '#57534e' }}>↑ Acoplado</span>}
                </div>
              </div>

              {/* ALGODÃO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('algodao')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: algodaoNoFunil ? 0.15 : 1, transition: 'opacity 0.3s' }}
                  draggable={isItem('algodao') && !algodaoNoFunil}
                  onDragStart={e => handleDragStart('algodao', e)}
                  onDragEnd={handleDragEnd}
                >
                  <svg width="52" height="40" viewBox="0 0 52 40">
                    <ellipse cx={26} cy={24} rx={22} ry={6} fill="rgba(0,0,0,0.12)" />
                    <ellipse cx={26} cy={20} rx={22} ry={12} fill="rgba(248,248,248,0.95)" stroke="rgba(200,200,200,0.5)" strokeWidth="1" />
                    <ellipse cx={14} cy={16} rx={10} ry={7} fill="rgba(255,255,255,0.90)" />
                    <ellipse cx={36} cy={18} rx={9} ry={6} fill="rgba(255,255,255,0.88)" />
                    <ellipse cx={26} cy={12} rx={8} ry={5} fill="rgba(255,255,255,0.92)" />
                    <text x={26} y={36} textAnchor="middle" fontSize="6" fill="rgba(150,150,150,0.70)" fontFamily="sans-serif">algodão</text>
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700, color: algodaoNoFunil ? '#57534e' : '#e7e5e4' }}>
                    {isItem('algodao') ? '🖱️ ' : ''}Algodão
                  </span>
                  {algodaoNoFunil && <span style={{ fontSize: 8, color: '#57534e' }}>↑ No funil</span>}
                </div>
              </div>

              {/* PIPETA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('pipeta')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={isItem('pipeta')}
                  onDragStart={e => handleDragStart('pipeta', e)}
                  onDragEnd={handleDragEnd}
                >
                  <PipetaLabSVG nivel={pipetaCheia ? 72 : 0} cor={corPipeta} cheia={pipetaCheia} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Pipeta</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: pipetaCheia ? '#34d399' : '#f87171' }}>
                    {pipetaCheia ? '● Carregada' : 'Vazia'}
                  </span>
                </div>
              </div>

              {/* VIDRO RELÓGIO */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('vidrorel')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: vidroRelogioAcoplado ? 0.15 : 1, transition: 'opacity 0.3s' }}
                  draggable={isItem('vidrorel') && !vidroRelogioAcoplado}
                  onDragStart={e => handleDragStart('vidrorel', e)}
                  onDragEnd={handleDragEnd}
                >
                  <VidroRelogioSVG />
                  <span style={{ fontSize: 10, fontWeight: 700, color: vidroRelogioAcoplado ? '#57534e' : '#e7e5e4' }}>
                    {isItem('vidrorel') ? '🖱️ ' : ''}Vidro Relógio
                  </span>
                  {vidroRelogioAcoplado && <span style={{ fontSize: 8, color: '#60a5fa' }}>↑ No béquer</span>}
                </div>
              </div>

            </div>{/* fim zona vidraria */}

            {/* ══ ZONA REAGENTES: todos 8 em grid uniforme ════════════ */}
            {/* HCl · Fenol · NaOH · FehlingB · FehlingA · H₂O · Iodeto · H₂SO₄ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {[
                { id: 'hcl',      cor: 'rgba(200,235,255,0.72)', label: 'HCl',      sub: '6,34 N'  },
                { id: 'fenol',    cor: 'rgba(255,140,200,0.78)', label: 'Fenolftal', sub: '1%',     draggable: true },
                { id: 'naoh',     cor: 'rgba(240,240,255,0.72)', label: 'NaOH',     sub: '20%'     },
                { id: 'fehlingb', cor: 'rgba(0,60,180,0.75)',    label: 'Fehling B', sub: ''        },
                { id: 'fehlinga', cor: 'rgba(10,40,160,0.75)',   label: 'Fehling A', sub: ''        },
                { id: 'agua',     cor: 'rgba(140,200,240,0.75)', label: 'H₂O desm.', sub: '',      draggable: true },
                { id: 'iodeto',   cor: 'rgba(220,180,30,0.78)',  label: 'Iodeto K',  sub: '30%'   },
                { id: 'sulfurico',cor: 'rgba(200,55,45,0.82)',   label: 'H₂SO₄',    sub: '25%'   },
              ].map(({ id: fid, cor, label, sub, draggable }) => (
                <div key={fid} style={{ display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id={fid} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      className={`${draggable ? `item-drag ${itemCls(fid)}` : ''} ${dropCls(fid)}`}
                      draggable={draggable ? isItem(fid) : false}
                      onDragStart={draggable ? e => handleDragStart(fid, e) : undefined}
                      onDragEnd={draggable ? handleDragEnd : undefined}
                    >
                      <FrascoReagente cor={cor} label={label} sub={sub} nivel={70} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4', textAlign: 'center' }}>
                      {draggable && isItem(fid) ? '🖱️ ' : ''}{label}
                    </span>
                  </ZonaDrop>
                </div>
              ))}

            </div>{/* fim zona reagentes */}

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

export default SimuladorArrtTitrino;
