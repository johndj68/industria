/**
 * ContagemdeBastonetes.jsx — Análise de Contagem de Bastonetes Vivos em Vinho
 *
 * Simulador de bancada microbiológica que reproduz o protocolo de contagem
 * de bastonetes vivos presentes em amostra de vinho após fermentação.
 *
 * Equipamentos simulados:
 *   Micropipeta P1000 · P500 · Rack de ponteiras · Tubos de ensaio
 *   Lâmina de infecção · Microscópio óptico 1000× · Vortex mixer
 *
 * Método:
 *   Amostra + Papaína → diluição → coloração (Azul de Metileno + Sulfato de Nilo)
 *   → Lâmina de infecção → Óleo de imersão → 1000× → Contagem 50 campos
 *
 * Fórmula:
 *   Bastonetes/mL = (Nº Vivos / Nº Campos) × (1 / Volume) × FM × D
 *
 * Referência: ATy OPE GQI-PR-002, página 156.
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
import { useSimuladorDragBastonetes } from '../hooks/useSimuladorDragBastonetes';
import { etapas } from './data/etapasBastonetes';
import TuboEnsaio from '../components/lab/TuboEnsaio';
import TuboEnsaioVazio from '../components/lab/TuboEnsaioVazio';
import TuboEnsaioFinal from '../components/lab/TuboEnsaioFinal';
import RackPonteiras from '../components/lab/RackPonteiras';
import EspatulaSVG from '../components/lab/EspatulaSVG';
import MicropipetaSVG from '../components/lab/MicropipetaSVG';
import MicroscopioSVG from '../components/lab/MicroscopioSVG';
import VortexSVG from '../components/lab/VortexSVG';
import BalaoBancada from '../components/lab/BalaoBancada';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import MicroscopioBastonetes from './MicroscopioBastonetes';



/* ═══════════════════════════════════════════════════════════
   LÂMINA DE INFECÇÃO — SVG 2D realista
   Representa a lâmina de vidro com lamínula, área de amostra,
   reflexos de vidro e gota de óleo de imersão.
═══════════════════════════════════════════════════════════ */
const LaminaMicroscopicaSVG = ({ carregada = false, comOleo = false }) => (
  <svg width="130" height="58" viewBox="0 0 130 58">
    <defs>
      <linearGradient id="laminaVidroGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="rgba(215, 238, 255, 0.88)" />
        <stop offset="100%" stopColor="rgba(170, 208, 240, 0.52)" />
      </linearGradient>
      <linearGradient id="laminulaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="rgba(195, 228, 255, 0.82)" />
        <stop offset="100%" stopColor="rgba(150, 196, 238, 0.42)" />
      </linearGradient>
      <linearGradient id="amostraAzulGrad" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stopColor="rgba(55, 130, 215, 0.55)" />
        <stop offset="100%" stopColor="rgba(30, 100, 185, 0.28)" />
      </linearGradient>
      {comOleo && (
        <radialGradient id="oleoImersaoGrad" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="rgba(255, 242, 160, 0.62)" />
          <stop offset="80%"  stopColor="rgba(215, 190, 45, 0.32)" />
          <stop offset="100%" stopColor="rgba(180, 155, 20, 0.10)" />
        </radialGradient>
      )}
    </defs>

    {/* Sombra da lâmina */}
    <rect x="5" y="9" width="122" height="44" rx="2.5" fill="rgba(0,0,0,0.22)" />

    {/* Corpo da lâmina de vidro */}
    <rect x="2" y="6" width="126" height="44" rx="2.8"
      fill="url(#laminaVidroGrad)"
      stroke="rgba(110, 165, 218, 0.72)"
      strokeWidth="1.1" />

    {/* Reflexo superior — brilho do vidro */}
    <rect x="8" y="8" width="65" height="4.5" rx="2.2"
      fill="rgba(255,255,255,0.42)" />

    {/* Reflexo lateral direito */}
    <rect x="120" y="10" width="4" height="30" rx="2"
      fill="rgba(255,255,255,0.16)" />

    {/* Área da amostra (mancha centralizada — aparece após carregada) */}
    {carregada && (
      <ellipse cx="65" cy="28" rx="26" ry="13"
        fill="rgba(55, 130, 215, 0.28)"
        stroke="rgba(40, 110, 195, 0.48)"
        strokeWidth="0.8" />
    )}

    {/* Lamínula sobre a preparação */}
    <rect x="36" y="11" width="58" height="34" rx="1.8"
      fill="url(#laminulaGrad)"
      stroke="rgba(130, 186, 228, 0.82)"
      strokeWidth="0.9"
      opacity="0.84" />

    {/* Reflexo da lamínula */}
    <rect x="40" y="13" width="18" height="3.5" rx="1.8"
      fill="rgba(255,255,255,0.48)" />

    {/* Partículas de amostra visíveis sob a lamínula */}
    {carregada && (
      <>
        <ellipse cx="58" cy="26" rx="3.5" ry="1.4" fill="rgba(30,90,185,0.55)" transform="rotate(-25, 58, 26)" />
        <ellipse cx="70" cy="30" rx="4"   ry="1.6" fill="rgba(30,90,185,0.48)" transform="rotate(40, 70, 30)" />
        <ellipse cx="63" cy="34" rx="3"   ry="1.2" fill="rgba(30,90,185,0.52)" transform="rotate(10, 63, 34)" />
        <ellipse cx="76" cy="22" rx="3.5" ry="1.3" fill="rgba(30,90,185,0.45)" transform="rotate(-50, 76, 22)" />
        <ellipse cx="52" cy="34" rx="3.2" ry="1.3" fill="rgba(30,90,185,0.42)" transform="rotate(30, 52, 34)" />
      </>
    )}

    {/* Gota de óleo de imersão */}
    {comOleo && (
      <>
        <ellipse cx="65" cy="16" rx="13" ry="5"
          fill="url(#oleoImersaoGrad)"
          stroke="rgba(210,185,40,0.55)"
          strokeWidth="0.7" />
        {/* Reflexo da gota */}
        <ellipse cx="60" cy="14.5" rx="4" ry="1.8"
          fill="rgba(255,248,200,0.50)"
          transform="rotate(-10, 60, 14.5)" />
      </>
    )}

    {/* Etiqueta identificadora */}
    <rect x="2" y="38" width="26" height="12" rx="1.8"
      fill="rgba(255,252,210,0.88)"
      stroke="rgba(175,158,78,0.62)"
      strokeWidth="0.6" />
    <text x="15" y="46.5" fontSize="4.5" textAnchor="middle"
      fill="rgba(75,58,18,0.82)" fontFamily="monospace" fontWeight="700">LAM-01</text>
  </svg>
);



/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorContagemBastonetes = () => {
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

  // ── Espátula ──────────────────────────────────────────
  const [espatulaComPo, setEspatulaComPo] = useState(false);

  // ── Tubos ─────────────────────────────────────────────
  const [nivelTubo,  setNivelTubo]  = useState(0);
  const [corTubo,    setCorTubo]    = useState('rgba(80,200,120,0.72)');
  const [nivelVazio, setNivelVazio] = useState(0);
  const [corVazio,   setCorVazio]   = useState('rgba(80,200,120,0.72)');
  const [nivelFinal, setNivelFinal] = useState(0);
  const [corFinal,   setCorFinal]   = useState('rgba(80,200,120,0.72)');
  const [tuboPrep,   setTuboPrep]   = useState(false);

  // ── Amostra ───────────────────────────────────────────
  const [nivelAmostra, setNivelAmostra] = useState(80);

  // ── Lâmina de infecção ────────────────────────────────
  const [laminaCarreg, setLaminaCarreg] = useState(false);
  const [oleoNaLamina, setOleoNaLamina] = useState(false);
  const [laminaNaMic,  setLaminaNaMic]  = useState(false);

  // ── Microscópio ───────────────────────────────────────
  const [microscopioOn, setMicroscopioOn] = useState(false);
  const [foco,          setFoco]          = useState(50);
  const [contagem,      setContagem]      = useState(null);

  // ── Interface de contagem de bastonetes ───────────────
  const [mostrarContagem, setMostrarContagem] = useState(false);
  const [contagemConc,    setContagemConc]    = useState(null);

  // ── Mapeamento ponteira correta por etapa ─────────────
  const etapasPonteiraCorreta = {
    4:  2,  // Etapa 4  → P1000 (amarela, col=2)
    14: 1,  // Etapa 14 → P500  (verde/média, col=1)
  };

  // ── Foco progressivo do microscópio ──────────────────
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

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    dropCls, itemCls,
  } = useSimuladorDragBastonetes(etapas, {
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
    setLaminaCarreg, setOleoNaLamina, setLaminaNaMic,
  });

  // ── Seleção de ponteira no rack ───────────────────────
  const handlePickTip = (idx, col) => {
    if (tipIdx !== null) return;
    const colEsperada = etapasPonteiraCorreta[etapaAtual];
    if (colEsperada === undefined) return;
    if (col !== colEsperada) return;
    setTips(t => { const n = [...t]; n[idx] = false; return n; });
    setTipIdx(col);
    // col=1 representa P500 neste simulador (volume de 500 µL)
    const vols = [20, 500, 1000];
    setVolumePipeta(vols[col]);
    celebrarAcerto();
    proximaEtapa();
  };

  // ── Clique no microscópio ─────────────────────────────
  const handleClicaMicroscopio = () => {
    // Etapa 19: focalizar
    if (etapaAtual === 19 && laminaNaMic && !microscopioOn) {
      setMicroscopioOn(true);
    }
    // Etapa 20: abrir interface de contagem
    if (etapaAtual === 20 && contagem && !mostrarContagem) {
      setMostrarContagem(true);
    }
  };

  // ── Conclusão da contagem (etapa 20) ─────────────────
  const handleContagemConcluida = (resultado) => {
    setContagemConc(resultado);
    setMostrarContagem(false);
    celebrarAcerto(300);
    proximaEtapa();
  };

  // ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── MODAL CONTAGEM DE BASTONETES (ETAPA 20) ── */}
      {mostrarContagem && (
        <MicroscopioBastonetes onConcluir={handleContagemConcluida} />
      )}

      {/* ── OVERLAY PARABÉNS ── */}
      {mostrarParabens && (
        <div
          style={{
            position: 'fixed',
            top: 18,
            right: 24,
            zIndex: 60,
            pointerEvents: 'none',
          }}>
          <div
            style={{
              background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)',
              color: 'white',
              padding: '20px 36px',
              borderRadius: 22,
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
              border: '2px solid rgba(255,255,255,0.9)',
              textAlign: 'center',
            }}>
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

      {/* ── OVERLAY ERRO ── */}
      {mostrarErroEtapa && (
        <div
          style={{
            position: 'fixed',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 70,
            pointerEvents: 'none',
          }}>
          <div
            style={{
              background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)',
              color: 'white',
              padding: '14px 26px',
              borderRadius: 16,
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
              border: '2px solid rgba(255,255,255,0.85)',
              textAlign: 'center',
              minWidth: 280,
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
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #00e5ff', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white', maxWidth: 560 }}>
            <div style={{ fontSize: 72 }}>🔬</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#00e5ff', margin: '12px 0' }}>Análise Concluída!</h2>

            {contagemConc && (
              <>
                {/* Bastonetes vivos contados */}
                <div style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.30)', borderRadius: 14, padding: '16px 36px', marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                    Bastonetes Vivos Contados ({50} campos)
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#00e5ff', fontFamily: 'monospace' }}>
                    {contagemConc.vivos50}
                  </div>
                  <div style={{ fontSize: 14, color: '#67e8f9' }}>
                    bastonetes vivos projetados para 50 campos
                  </div>
                </div>

                {/* Resultado */}
                <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 14, padding: '14px 28px', marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Resultado da Análise</div>

                  <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#4ade80' }}>{contagemConc.novoAcum}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>🔬 Contados (5 campos)</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#a78bfa' }}>{contagemConc.vivos50}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>📊 Projetados (50 campos)</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 26, fontWeight: 900, color: '#00e5ff', marginBottom: 4 }}>
                    {contagemConc.resultado.toExponential(2)} Bastonetes/mL
                  </div>

                  <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.6 }}>
                    Fórmula: Bastonetes/mL = (Nº Vivos / Nº Campos) × (1 / Volume) × FM × D
                  </div>

                  <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.20)', borderRadius: 8, padding: '6px 12px', fontSize: 10, color: '#64748b' }}>
                    ℹ️ Foram considerados apenas bastonetes não corados, conforme metodologia ATy OPE GQI-PR-002, pág. 156.
                  </div>
                </div>
              </>
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
        <div style={{ flex: 1, minWidth: 600 }}>
          <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 28, padding: '28px 24px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 18, fontWeight: 900, marginBottom: 24, letterSpacing: 1 }}>
              🔬 Bancada — Contagem de Bastonetes em Vinho
            </h2>

            <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 22, padding: '28px 24px', border: '4px solid #292524', minHeight: 600, boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)', position: 'relative' }}>

              {/* ══ LINHA SUPERIOR: Equipamentos grandes ══ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginBottom: 36, alignItems: 'end' }}>

                {/* ── VÓRTEX ── */}
                <ZonaDrop id="vortex" gap={6} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <div className={`${dropCls('vortex')}`} style={{ position: 'relative', background: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: 8 }}>
                    <VortexSVG ligado={vortexLigado} ang={vortexAng} />
                    {tuboNoVortex && (
                      <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%) scale(0.90)' }}>
                        {tipoTuboVortex === 'tubo'      && (<TuboEnsaio      cor={corTubo}  nivel={nivelTubo}  animando={vortexLigado} vortexAng={vortexAng} />)}
                        {tipoTuboVortex === 'tubovazio' && (<TuboEnsaioVazio cor={corVazio} nivel={nivelVazio} animando={vortexLigado} vortexAng={vortexAng} />)}
                        {tipoTuboVortex === 'tubofinal' && (<TuboEnsaioFinal cor={corFinal} nivel={nivelFinal} animando={vortexLigado} vortexAng={vortexAng} />)}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#e7e5e4' }}>Agitador Vórtex</span>
                  {vortexLigado  && <span style={{ fontSize: 9, color: '#34d399', fontWeight: 700 }}>⚡ Agitando...</span>}
                  {homogeneizado && <span style={{ fontSize: 9, color: '#6ee7b7', fontWeight: 700 }}>✓ Homogeneizado</span>}
                </ZonaDrop>

                {/* ── ESPÁTULA ── */}
                <ItemBancada id="espatula" className={itemCls('espatula')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <EspatulaSVG espatulaComPo={espatulaComPo} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Espátula</span>
                </ItemBancada>

                {/* ── LÂMINA DE INFECÇÃO ── */}
                <ZonaDrop id="lamina" gap={6} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <div
                    className={`item-drag ${itemCls('lamina')} ${dropCls('lamina')}`}
                    style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: 10, position: 'relative', display: 'inline-block' }}
                    draggable={etapaAtual === 18}
                    onDragStart={e => handleDragStart('lamina', e)}
                    onDragEnd={handleDragEnd}>
                    <LaminaMicroscopicaSVG carregada={laminaCarreg} comOleo={oleoNaLamina} />
                    {laminaCarreg && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: '#22c55e', borderRadius: 99, padding: '2px 8px', fontSize: 8, color: 'white', fontWeight: 700 }}>✓ Carregada</div>
                    )}
                    {oleoNaLamina && (
                      <div style={{ position: 'absolute', bottom: 6, right: 6, background: '#d97706', borderRadius: 99, padding: '2px 8px', fontSize: 8, color: 'white', fontWeight: 700 }}>+ Óleo</div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#e7e5e4' }}>Lâmina de Infecção</span>
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
                        Lâmina posicionada ✓ — Clique para focar!
                      </div>
                    )}
                    {etapaAtual === 20 && contagem && (
                      <div style={{ textAlign: 'center', fontSize: 8, color: '#a78bfa', fontWeight: 700, marginTop: 4 }}>
                        🔬 Clique para contar bastonetes!
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

                {/* ── TUBO DE ENSAIO ── */}
                <ZonaDrop id="tubo" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <div
                    className={`item-drag ${itemCls('tubo')} ${dropCls('tubo')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '5px 2px' }}
                    draggable={etapaAtual === 3}
                    onDragStart={e => handleDragStart('tubo', e)}
                    onDragEnd={handleDragEnd}>
                    {!(tuboNoVortex && tipoTuboVortex === 'tubo') && (
                      <TuboEnsaio cor={corTubo} nivel={nivelTubo} />
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Tubo de Ensaio</span>
                  {tuboPrep && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Com amostra</span>}
                </ZonaDrop>

                {/* ── TUBO DE DILUIÇÃO ── */}
                <ZonaDrop id="tubovazio" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <div
                    className={`item-drag ${itemCls('tubovazio')} ${dropCls('tubovazio')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '8px 2px' }}
                    draggable={etapaAtual === 8}
                    onDragStart={e => handleDragStart('tubovazio', e)}
                    onDragEnd={handleDragEnd}>
                    {!(tuboNoVortex && tipoTuboVortex === 'tubovazio') && (
                      <TuboEnsaioVazio cor={corVazio} nivel={nivelVazio} />
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Tubo de Diluição</span>
                </ZonaDrop>

                {/* ── TUBO FINAL ── */}
                <ZonaDrop id="tubofinal" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <div
                    className={`item-drag ${itemCls('tubofinal')} ${dropCls('tubofinal')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '8px 2px' }}
                    draggable={etapaAtual === 13}
                    onDragStart={e => handleDragStart('tubofinal', e)}
                    onDragEnd={handleDragEnd}>
                    {!(tuboNoVortex && tipoTuboVortex === 'tubofinal') && (
                      <TuboEnsaioFinal cor={corFinal} nivel={nivelFinal} />
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Tubo de Ensaio Final</span>
                </ZonaDrop>

                {/* ── FRASCO AMOSTRA DE VINHO ── */}
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(160, 80, 20, 0.78)" label="Vinho" nivel={nivelAmostra} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra de Vinho</span>
                </ItemBancada>

                {/* ── SOLUÇÃO DE COLORAÇÃO (Azul de Metileno + Sulfato de Nilo) ── */}
                <ZonaDrop id="corante" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <div className={dropCls('corante')} style={{ borderRadius: 12 }}>
                    <FrascoReagente cor="rgba(30, 80, 210, 0.78)" label="Sol. Cor." sub="AzMet+SN" nivel={68} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Solução de Coloração</span>
                  <span style={{ fontSize: 8, color: '#93c5fd', fontWeight: 600 }}>Azul Metileno + Sulfato Nilo</span>
                </ZonaDrop>

                {/* ── PAPAÍNA ── */}
                <div
                  className={`item-drag ${dropCls('papaina')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={false}
                  onDragStart={e => handleDragStart('papaina', e)}
                  onDragEnd={handleDragEnd}
                  onDrop={e => handleDrop('papaina', e)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}>
                  <FrascoReagente cor="rgba(255,210,70,0.75)" label="Papaína" sub="0,25%" nivel={60} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Papaína</span>
                </div>

                {/* ── ÁGUA DESMINERALIZADA ── */}
                <ItemBancada id="agua" className={itemCls('agua')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(100,185,255,0.65)" label="H₂O desm." nivel={85} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Água Desmineralizada</span>
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
              💡 Arraste os itens piscando para os locais destacados em azul!
            </p>
          </div>
        </div>
      </LayoutSimulador>
    </div>
  );
};

export default SimuladorContagemBastonetes;
