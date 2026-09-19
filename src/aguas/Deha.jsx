/**
 * Deha.jsx — Determinação de Sequestrante de Oxigênio (Método DEHA)
 *
 * Fluxo: Água Tipo 2 + Amostra → Proveta 25 mL → Copos
 *        → DEHA 1 + DEHA 2 → Tampar → Caixa Escura 10 min
 *        → Cubeta 25 mm → Fotômetro HACH → Resultado ppb DEHA
 *
 * Reutiliza: ProvetaSVG, CopoTransparenteSVG, CubetaSVG, FotometroSVG,
 *            FrascoReagente, ItemBancada, ZonaDrop, LayoutSimulador,
 *            useGameState, useDragOverlay
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import CubetaSVG from '../components/lab/CubetaSVG';
import FotometroSVG from '../components/lab/FotometroSVG';
import CopoTransparenteSVG from '../components/lab/CopoTransparenteSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragDeha } from '../hooks/useSimuladorDragDeha';
import { etapas } from './data/etapasDeha';


/* ═══════════════════════════════════════════════════════════
   SVG — SACHÊ DEHA 1 (reagente em pó)
═══════════════════════════════════════════════════════════ */
const SacheDEHA1SVG = ({ usado = false }) => (
  <svg width="52" height="46" viewBox="0 0 52 46">
    <defs>
      <linearGradient id="sachGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>
    {/* Sombra */}
    <ellipse cx={26} cy={44} rx={20} ry={3} fill="rgba(0,0,0,0.15)" />
    {/* Corpo do sachê */}
    <rect x={4} y={4} width={44} height={36} rx={5}
      fill="url(#sachGrad)"
      stroke="#94a3b8" strokeWidth="1.5"
      opacity={usado ? 0.45 : 1} />
    {/* Linhas de selagem horizontal */}
    <line x1={4} y1={14} x2={48} y2={14} stroke="#94a3b8" strokeWidth="1" />
    <line x1={4} y1={32} x2={48} y2={32} stroke="#94a3b8" strokeWidth="1" />
    {/* Textura de pó */}
    {!usado && (
      <>
        <circle cx={16} cy={23} r={2} fill="rgba(100,100,120,0.30)" />
        <circle cx={26} cy={21} r={1.5} fill="rgba(100,100,120,0.25)" />
        <circle cx={34} cy={24} r={2} fill="rgba(100,100,120,0.28)" />
        <circle cx={21} cy={26} r={1.2} fill="rgba(100,100,120,0.22)" />
      </>
    )}
    {/* Rótulo */}
    <rect x={8} y={17} width={36} height={12} rx={2}
      fill="rgba(255,255,255,0.70)" />
    <text x={26} y={25.5} textAnchor="middle" fontSize="6.5"
      fill="#1e40af" fontFamily="monospace" fontWeight="700">
      DEHA 1
    </text>
    <text x={26} y={10} textAnchor="middle" fontSize="5"
      fill="#64748b" fontFamily="sans-serif">
      sachê
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — CAIXA ESCURA (gaveta/caixa para reação)
═══════════════════════════════════════════════════════════ */
const CaixaEscuraSVG = ({
  temBranco   = false,
  temAmostra  = false,
  progresso   = 0,    // 0-100 para o timer de reação
  ativa       = false,
}) => (
  <svg width="170" height="110" viewBox="0 0 170 110">
    <defs>
      <linearGradient id="cxBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#44403c" />
        <stop offset="100%" stopColor="#292524" />
      </linearGradient>
      <linearGradient id="cxLid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#57534e" />
        <stop offset="100%" stopColor="#3c3835" />
      </linearGradient>
    </defs>

    {/* Sombra */}
    <ellipse cx={85} cy={107} rx={72} ry={5} fill="rgba(0,0,0,0.22)" />

    {/* Corpo da caixa */}
    <rect x={6} y={30} width={158} height={72} rx={6}
      fill="url(#cxBody)" stroke="#1c1917" strokeWidth="2" />

    {/* Interior */}
    <rect x={10} y={34} width={150} height={64} rx={4}
      fill={ativa ? '#0f0d0c' : '#1c1917'} />

    {/* Tampa */}
    <rect x={6} y={14} width={158} height={20} rx={4}
      fill="url(#cxLid)" stroke="#1c1917" strokeWidth="1.5" />
    <rect x={10} y={17} width={150} height={8} rx={2}
      fill="rgba(255,255,255,0.06)" />

    {/* Puxador da tampa */}
    <rect x={72} y={10} width={26} height={8} rx={3}
      fill="#6b7280" stroke="#1c1917" strokeWidth="1" />
    <rect x={77} y={12} width={16} height={4} rx={2}
      fill="rgba(255,255,255,0.15)" />

    {/* Texto rótulo */}
    <text x={85} y={22.5} textAnchor="middle" fontSize="6"
      fill="#a8a29e" fontFamily="monospace">
      CAIXA ESCURA · REAÇÃO
    </text>

    {/* Copos dentro */}
    {temBranco && (
      <g transform="translate(28,50)">
        <rect x={-10} y={-14} width={20} height={22} rx={2}
          fill={ativa ? 'rgba(255,182,193,0.55)' : 'rgba(200,230,250,0.45)'}
          stroke="rgba(140,195,225,0.60)" strokeWidth="1" />
        <text x={0} y={14} textAnchor="middle" fontSize="5.5"
          fill="#94a3b8" fontFamily="monospace">B</text>
      </g>
    )}
    {temAmostra && (
      <g transform="translate(142,50)">
        <rect x={-10} y={-14} width={20} height={22} rx={2}
          fill={ativa ? 'rgba(180,100,220,0.55)' : 'rgba(185,215,245,0.45)'}
          stroke="rgba(140,195,225,0.60)" strokeWidth="1" />
        <text x={0} y={14} textAnchor="middle" fontSize="5.5"
          fill="#94a3b8" fontFamily="monospace">A</text>
      </g>
    )}

    {/* Barra de progresso da reação */}
    {ativa && (
      <>
        <rect x={14} y={80} width={142} height={8} rx={4}
          fill="rgba(255,255,255,0.08)" />
        <rect x={14} y={80} width={Math.max(4, 142 * progresso / 100)} height={8} rx={4}
          fill="rgba(139,92,246,0.70)" />
        <text x={85} y={74} textAnchor="middle" fontSize="6"
          fill="#a78bfa" fontFamily="monospace">
          ⏱ Reação no escuro...
        </text>
      </>
    )}

    {/* Indicador de copos vazios */}
    {!temBranco && !temAmostra && (
      <text x={85} y={66} textAnchor="middle" fontSize="7"
        fill="#57534e" fontFamily="sans-serif">
        arraste os copos aqui
      </text>
    )}
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorDeha = () => {
  useDragOverlay();

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
  const [nivelAgua,    setNivelAgua]    = useState(85);
  const [nivelAmostra, setNivelAmostra] = useState(82);

  // ── Copo Branco ───────────────────────────────────────
  const [nivelBranco,  setNivelBranco]  = useState(0);
  const [corBranco,    setCorBranco]    = useState('rgba(200,230,255,0.35)');
  const [deha1Branco,  setDeha1Branco]  = useState(false);
  const [deha2Branco,  setDeha2Branco]  = useState(false);
  const [brancoNaCaixa,setBrancoNaCaixa]= useState(false);

  // ── Copo Amostra ──────────────────────────────────────
  const [nivelAmostraCopo, setNivelAmostraCopo] = useState(0);
  const [corAmostraCopo,   setCorAmostraCopo]   = useState('rgba(185,215,245,0.35)');
  const [deha1Amostra,     setDeha1Amostra]     = useState(false);
  const [deha2Amostra,     setDeha2Amostra]     = useState(false);
  const [amostraNaCaixa,   setAmostraNaCaixa]   = useState(false);

  // ── Copos tampados (step 8) ───────────────────────────
  const [coposTampados, setCoposTampados] = useState(false);

  // ── Reação no escuro (step 11) ────────────────────────
  const [reacaoConcluida, setReacaoConcluida] = useState(false);
  const [progressoReacao, setProgressoReacao] = useState(0);

  // ── Cubeta ────────────────────────────────────────────
  const [nivelCubeta,       setNivelCubeta]       = useState(0);
  const [corCubeta,         setCorCubeta]         = useState('rgba(220,235,255,0.08)');
  const [cubetaNoFotometro, setCubetaNoFotometro] = useState(false);

  // ── Fotômetro ─────────────────────────────────────────
  const [zerando,   setZerando]   = useState(false);
  const [zerado,    setZerado]    = useState(false);
  const [lendo,     setLendo]     = useState(false);
  const [resultado, setResultado] = useState(null);

  // ── Timers automáticos ────────────────────────────────
  useEffect(() => {
    // Timers fixos por etapa
    const timerMap = {
      8:  1500,   // tampar + homogeneizar
      11: 6000,   // reação no escuro (simula 10 min)
      18: 2000,   // conclusão
    };
    const delay = timerMap[etapaAtual];
    if (delay === undefined) return;

    // Ações imediatas ao entrar na etapa
    if (etapaAtual === 8)  setCoposTampados(true);
    if (etapaAtual === 11) setProgressoReacao(0);

    // Progress bar da reação no escuro
    let progressInterval;
    if (etapaAtual === 11) {
      progressInterval = setInterval(() => {
        setProgressoReacao(p => Math.min(p + 100 / (6000 / 150), 100));
      }, 150);
    }

    const id = setTimeout(() => {
      if (etapaAtual === 11) {
        clearInterval(progressInterval);
        setProgressoReacao(100);
        setReacaoConcluida(true);
        setBrancoNaCaixa(false);
        setAmostraNaCaixa(false);
        // Cores pós-reação
        setCorBranco('rgba(255,182,193,0.68)');       // rosa bem claro
        setCorAmostraCopo('rgba(180,100,220,0.68)');  // roxo claro
      }
      celebrarAcerto(100);
      proximaEtapa();
    }, delay);

    return () => {
      clearTimeout(id);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [etapaAtual]);

  // ── Click ZERO no fotômetro (etapa 14) ───────────────
  const handleZerarFotometro = () => {
    if (etapaAtual !== 14 || !cubetaNoFotometro || zerando || zerado) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaNoFotometro(false);
      setNivelCubeta(0);
      setCorCubeta('rgba(220,235,255,0.08)');
      celebrarAcerto(150);
      proximaEtapa();
    }, 2200);
  };

  // ── Click LER no fotômetro (etapa 17) ────────────────
  const handleLerFotometro = () => {
    if (etapaAtual !== 17 || !cubetaNoFotometro || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const ppb = Math.floor(Math.random() * 90 + 8).toString(); // 8–98 ppb
      setResultado(ppb);
      setLendo(false);
      celebrarAcerto(200);
      proximaEtapa();
    }, 3000);
  };

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragDeha(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelProveta, setProvetaCheia,
    setNivelAgua, setNivelAmostra,
    setNivelBranco, setCorBranco, setDeha1Branco, setDeha2Branco, setBrancoNaCaixa,
    setNivelAmostraCopo, setCorAmostraCopo, setDeha1Amostra, setDeha2Amostra, setAmostraNaCaixa,
    setNivelCubeta, setCorCubeta,
    setCubetaNoFotometro,
  });

  // Caixa escura ativa durante steps 9-11
  const caixaAtiva = etapaAtual === 11;
  // Cubeta arrastável nas etapas certas
  const cubetaDraggable = (etapaAtual === 13 || etapaAtual === 16) && !cubetaNoFotometro;


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
      {zerado && etapaAtual === 15 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1d4ed8,#3b82f6)', color: 'white', padding: '12px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>🔵 Fotômetro zerado · 0 ppb DEHA</div>
            <div style={{ fontSize: 12, marginTop: 2 }}>Insira a amostra para leitura</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #7c3aed', borderRadius: 24, padding: '48px 64px', textAlign: 'center', color: 'white', maxWidth: 480, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🔬</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#a78bfa', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 20px' }}>
              Determinação de Sequestrante de Oxigênio — Método DEHA
            </p>
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.30)', borderRadius: 14, padding: '16px 36px', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Branco</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fda4af', fontFamily: 'monospace' }}>0</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>ppb DEHA</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Amostra</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: '#c084fc', fontFamily: 'monospace', lineHeight: 1 }}>{resultado}</div>
                  <div style={{ fontSize: 11, color: '#a78bfa' }}>ppb DEHA</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.28)', borderRadius: 11, padding: '9px 18px', marginBottom: 14, fontSize: 11, color: '#c4b5fd' }}>
              Tempo de reação: 10 minutos no escuro<br />
              Viragem: incolor → roxo claro · Status: Leitura finalizada com sucesso
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#7c3aed,#6d28d9)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="DEHA — Sequestrante"
        subtitulo={"Sequestrante de Oxigênio\nMétodo DEHA · ppb"}
        icone="🔬"
        badges={['💧 ÁGUAS', '🔬 FOTOMETRIA']}
        footerLabel="🔬 DEHA"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 760 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.8 }}>
            🔬 Bancada — Determinação de Sequestrante de Oxigênio (Método DEHA)
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: FOTÔMETRO + COPOS + CUBETA ══════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* FOTÔMETRO — esquerda */}
              <ZonaDrop id="fotometro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div className={dropCls('fotometro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                  <FotometroSVG
                    cubetaDentro={cubetaNoFotometro}
                    zerando={zerando}
                    zerado={zerado && !cubetaNoFotometro}
                    lendo={lendo}
                    resultado={resultado ? `${resultado} ppb` : null}
                    zerAtivo={etapaAtual === 14 && cubetaNoFotometro && !zerando}
                    lerAtivo={etapaAtual === 17 && cubetaNoFotometro && !lendo && !resultado}
                    onZero={handleZerarFotometro}
                    onLer={handleLerFotometro}
                  />
                  {etapaAtual === 14 && cubetaNoFotometro && !zerando && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>🔵 Clique ZERO para zerar!</div>
                  )}
                  {etapaAtual === 17 && cubetaNoFotometro && !lendo && !resultado && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>🟢 Clique LER para leitura!</div>
                  )}
                  {(zerando || lendo) && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>⚡ Processando...</div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Fotômetro HACH DR900</span>
              </ZonaDrop>

              {/* COPO BRANCO */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="copobranco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('copobranco')} ${dropCls('copobranco')}`}
                    style={{ opacity: brancoNaCaixa ? 0.18 : 1, transition: 'opacity 0.4s' }}
                    draggable={isItem('copobranco') && !brancoNaCaixa}
                    onDragStart={e => handleDragStart('copobranco', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <div style={{ position: 'relative' }}>
                      <CopoTransparenteSVG nivel={nivelBranco} cor={corBranco} id="gb" />
                      {coposTampados && (
                        <div style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)', width: 44, height: 10, background: 'rgba(148,163,184,0.92)', borderRadius: 4, border: '1px solid #94a3b8', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: brancoNaCaixa ? '#57534e' : '#e7e5e4' }}>
                    {isItem('copobranco') ? '🖱️ ' : ''}Copo Branco
                  </span>
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>
                    {brancoNaCaixa      ? '📦 Na caixa'
                      : reacaoConcluida ? '🌸 Rosa (pronto)'
                      : deha2Branco     ? '✓ DEHA 1+2 ✓'
                      : deha1Branco     ? '✓ DEHA 1'
                      : nivelBranco > 0 ? '💧 25 mL água'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CAIXA ESCURA — item independente, mesma distância dos demais */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="caixaescura" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={dropCls('caixaescura')}>
                    <CaixaEscuraSVG
                      temBranco={brancoNaCaixa}
                      temAmostra={amostraNaCaixa}
                      progresso={progressoReacao}
                      ativa={caixaAtiva}
                    />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#a8a29e' }}>
                    {caixaAtiva ? `⏱ Reação ${Math.floor(progressoReacao)}%` : 'Caixa Escura'}
                  </span>
                </ZonaDrop>
              </div>

              {/* COPO AMOSTRA — centro-direito */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="copoamostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('copoamostra')} ${dropCls('copoamostra')}`}
                    style={{ opacity: amostraNaCaixa ? 0.18 : 1, transition: 'opacity 0.4s' }}
                    draggable={isItem('copoamostra') && !amostraNaCaixa}
                    onDragStart={e => handleDragStart('copoamostra', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <div style={{ position: 'relative' }}>
                      <CopoTransparenteSVG nivel={nivelAmostraCopo} cor={corAmostraCopo} id="ga" />
                      {coposTampados && (
                        <div style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)', width: 44, height: 10, background: 'rgba(148,163,184,0.92)', borderRadius: 4, border: '1px solid #94a3b8', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: amostraNaCaixa ? '#57534e' : '#e7e5e4' }}>
                    {isItem('copoamostra') ? '🖱️ ' : ''}Copo Amostra
                  </span>
                  <span style={{ fontSize: 8, color: '#94a3b8' }}>
                    {amostraNaCaixa      ? '📦 Na caixa'
                      : reacaoConcluida  ? '🟣 Roxo (pronto)'
                      : deha2Amostra     ? '✓ DEHA 1+2 ✓'
                      : deha1Amostra     ? '✓ DEHA 1'
                      : nivelAmostraCopo > 0 ? '💧 25 mL amostra'
                      : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA — direita */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('cubeta')} ${dropCls('cubeta')}`}
                    style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 11, padding: '4px 2px' }}
                    draggable={cubetaDraggable}
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
                    {cubetaDraggable ? '🖱️ ' : ''}Cubeta 25 mm
                  </span>
                  {nivelCubeta > 0 && !cubetaNoFotometro && (
                    <span style={{ fontSize: 8, color: corCubeta.includes('182') ? '#fda4af' : '#c4b5fd', fontWeight: 700 }}>
                      {corCubeta.includes('182') ? '🌸 Branco' : '🟣 Amostra'}
                    </span>
                  )}
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ ZONA INFERIOR: REAGENTES ════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'flex-end' }}>

              {/* ÁGUA DESMINERALIZADA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="agua" className={itemCls('agua')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(200,230,255,0.80)" label="H₂O Tipo 2" sub="desm." nivel={nivelAgua} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Água Tipo 2</span>
                </ItemBancada>
              </div>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(180,210,245,0.80)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* PROVETA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{provetaCheia ? '🖱️ ' : ''}Proveta 50 mL</span>
                  {provetaCheia && <span style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>25 mL medidos</span>}
                </ZonaDrop>
              </div>

              {/* DEHA 1 (sachê) */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="deha1" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('deha1')} ${dropCls('deha1')}`}
                    draggable={isItem('deha1')}
                    onDragStart={e => handleDragStart('deha1', e)} onDragEnd={handleDragEnd}>
                    <SacheDEHA1SVG usado={deha1Branco && deha1Amostra} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('deha1') ? '🖱️ ' : ''}DEHA 1 Sachê</span>
                  {(deha1Branco || deha1Amostra) && (
                    <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>
                      {deha1Branco && deha1Amostra ? '✓ Adicionado (B+A)' : deha1Branco ? '✓ No Branco' : '✓ Na Amostra'}
                    </span>
                  )}
                </ZonaDrop>
              </div>

              {/* DEHA 2 (frasco líquido) */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="deha2" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('deha2')} ${dropCls('deha2')}`}
                    draggable={isItem('deha2')}
                    onDragStart={e => handleDragStart('deha2', e)} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(139,92,246,0.80)" label="DEHA 2" sub="0,5 mL" nivel={deha2Branco && deha2Amostra ? 55 : 78} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>{isItem('deha2') ? '🖱️ ' : ''}DEHA 2</span>
                  {(deha2Branco || deha2Amostra) && (
                    <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>
                      {deha2Branco && deha2Amostra ? '✓ Adicionado (B+A)' : deha2Branco ? '✓ No Branco' : '✓ Na Amostra'}
                    </span>
                  )}
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

export default SimuladorDeha;
