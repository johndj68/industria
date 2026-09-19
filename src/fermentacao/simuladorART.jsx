/**
 * SimuladorART.jsx — Análise de Açúcares Redutores Totais (ART) da Dorna
 *
 * Simulador de bancada com 22 etapas pelo método de Fehling (TE-088).
 * Refatorado para seguir o padrão estrutural e visual do ArtMosto.jsx.
 *
 * Fluxo: Filtração → Pesagem → NaOH → Microondas → Açúcar → Fenol → HCl
 *        → EDTA → Água → Fehling A/B → TE-088 → Azul de Metileno
 *        → Transferência bureta → Titulação → Viragem vermelho cereja
 */
import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import BequerSVG from '../components/lab/BequerSVG';
import PipetaLabSVG from '../components/lab/PipetaLabSVG';
import MicroondasArrtSVG from '../components/lab/MicroondasArrtSVG';
import BalaoVolumetrico200SVG from '../components/lab/BalaoVolumetrico200SVG';
import TE088SVG from '../components/lab/TE088SVG';
import BuretaModalSVG from '../components/lab/BuretaModalSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { etapas } from './data/etapasART';
import { useARTGameState } from '../hooks/useARTGameState';
import { useSimuladorDragART } from '../hooks/useSimuladorDragART';
import { useARTTransferencias } from '../hooks/useARTTransferencias';
import { useARTReacoes } from '../hooks/useARTReacoes';
import { useARTTE088 } from '../hooks/useARTTE088';
import { useState } from 'react';


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorART = () => {
  useDragOverlay();

  // ── Game state ────────────────────────────────────────
  const {
    pontuacao, etapaAtual, itemSegurado, setItemSegurado,
    mostrarParabens, concluido, volumeGasto, artPercentual, estrelas,
    avancarEtapa, finalizarAnalise,
  } = useARTGameState(etapas.length);

  // ── Filtração ─────────────────────────────────────────
  const [funilEncaixado,    setFunilEncaixado]    = useState(false);
  const [funilPosicionado,  setFunilPosicionado]  = useState(false);
  const [filtrando,         setFiltrando]         = useState(false);
  const [nivelColetor,      setNivelColetor]      = useState(0);
  const [nivelAmostra,      setNivelAmostra]      = useState(100);
  const [funilVoltando,     setFunilVoltando]     = useState(false);

  // ── Balança / transferência ───────────────────────────
  const [, setBalaoEncaixado] = useState(false);
  const [balaoPosicionado,  setBalaoPosicionado]  = useState(false);
  const [transferindo,      setTransferindo]      = useState(false);
  const [peso,              setPeso]              = useState(0);
  const [pesando,           setPesando]           = useState(false);

  // ── Balão da bancada ──────────────────────────────────
  const [nivelBalao,        setNivelBalao]        = useState(0);
  const [balaoNoMicroondas, setBalaoNoMicroondas] = useState(false);
  const [tempoMicroondas,   setTempoMicroondas]   = useState(30);
  const [aquecendo,         setAquecendo]         = useState(false);
  const [amostraQuente,     setAmostraQuente]     = useState(false);
  const [mostrarAvisoResfriamento, setMostrarAvisoResfriamento] = useState(false);

  // ── Pipeta (NaOH, Açúcar, HCl, Azul de Metileno) ─────
  const [pipetaCheia,            setPipetaCheia]            = useState(false);
  const [nivelPipeta,            setNivelPipeta]            = useState(0);
  const [transferindoPipeta,     setTransferindoPipeta]     = useState(false);
  const [pipetaAcucarCheia,      setPipetaAcucarCheia]      = useState(false);
  const [nivelPipetaAcucar,      setNivelPipetaAcucar]      = useState(0);
  const [transferindoPipetaAcucar, setTransferindoPipetaAcucar] = useState(false);
  const [pipetaHClCheia,         setPipetaHClCheia]         = useState(false);
  const [nivelPipetaHCl,         setNivelPipetaHCl]         = useState(0);
  const [nivelAlvoPipetaHCl,     setNivelAlvoPipetaHCl]     = useState(100);
  const [pipetaAzulCheia,        setPipetaAzulCheia]        = useState(false);
  const [nivelPipetaAzul,        setNivelPipetaAzul]        = useState(0);

  // ── Reações ───────────────────────────────────────────
  const [adicionandoFenol,  setAdicionandoFenol]  = useState(false);
  const [gotasFenol,        setGotasFenol]        = useState(0);
  const [titulando,         setTitulando]         = useState(false);
  const [corBalao,          setCorBalao]          = useState('amber');
  const [, setAgitacao] = useState(false);
  const [neutralizandoEDTA, setNeutralizandoEDTA] = useState(false);
  const [gotasEDTA,         setGotasEDTA]         = useState(0);
  const [gotejandoEDTA,     setGotejandoEDTA]     = useState(false);
  const [adicionandoAgua,   setAdicionandoAgua]   = useState(false);
  const [nivelAlvoBalao] = useState(100);
  const [diluindo,          setDiluindo]          = useState(false);

  // ── TE-088 ────────────────────────────────────────────
  const [te088Ligado,              setTe088Ligado]              = useState(false);
  const [te088Aquecendo,           setTe088Aquecendo]           = useState(false);
  const [fervendo,                 setFervendo]                 = useState(false);
  const [te088Quente,              setTe088Quente]              = useState(false);
  const [fehlingAAdicionado,       setFehlingAAdicionado]       = useState(false);
  const [fehlingBAdicionado,       setFehlingBAdicionado]       = useState(false);
  const [nivelErlenmeyerTE,        setNivelErlenmeyerTE]        = useState(0);
  const [corErlenmeyerDireitoFinal,setCorErlenmeyerDireitoFinal]= useState('#3b82f6');
  const [, setGotasAzul]               = useState(0);
  const [gotejandoAzul,            setGotejandoAzul]            = useState(false);
  const [posicaoGotasAzul,         setPosicaoGotasAzul]         = useState([]);
  const [transferindoBalaoParaBureta,setTransferindoBalaoParaBureta]=useState(false);
  const [nivelBuretaDireita,       setNivelBuretaDireita]       = useState(0);
  const [corBuretaDireita,         setCorBuretaDireita]         = useState('#ffffff');
  const [gotejandoBuretaDireita,   setGotejandoBuretaDireita]   = useState(false);
  const [posicaoGotasBureta,       setPosicaoGotasBureta]       = useState([]);

  // ── Click: ligar TE-088 (etapa 17) ───────────────────
  const handleLigarTE088 = () => {
    if (etapaAtual !== 17) return;
    setTe088Ligado(true);
    setTe088Aquecendo(true);
    setNivelErlenmeyerTE((prev) => Math.min(prev + 5, 25));
    setFervendo(true);
    setTimeout(() => {
      setTe088Aquecendo(false);
      setTe088Quente(true);
      avancarEtapa();
    }, 4000);
  };

  // ── Drag / drop ───────────────────────────────────────
  const { handleDragStart, handleDragEnd, handleDragOver, handleDrop } =
    useSimuladorDragART({
      etapaAtual, itemSegurado, setItemSegurado, avancarEtapa,
      pesando, funilEncaixado,
      pipetaCheia, pipetaAcucarCheia, pipetaHClCheia, pipetaAzulCheia,
      fehlingAAdicionado, corBalao,
      setFunilPosicionado, setFunilEncaixado, setFiltrando,
      setBalaoPosicionado, setBalaoEncaixado, setTransferindo, setPesando,
      setPipetaCheia, setTransferindoPipeta,
      setBalaoNoMicroondas, setAquecendo, setTempoMicroondas,
      setPipetaAcucarCheia, setTransferindoPipetaAcucar,
      setAdicionandoFenol, setGotasFenol,
      setNivelPipetaHCl, setNivelAlvoPipetaHCl, setPipetaHClCheia,
      setTitulando, setAgitacao,
      setGotasEDTA, setGotejandoEDTA,
      setAdicionandoAgua, setDiluindo,
      setFehlingAAdicionado, setNivelErlenmeyerTE, setCorErlenmeyerDireitoFinal,
      setFehlingBAdicionado,
      setNivelPipetaAzul, setPipetaAzulCheia,
      setPosicaoGotasAzul, setGotasAzul, setGotejandoAzul,
      setTransferindoBalaoParaBureta, setCorBuretaDireita,
    });

  // ── Hooks de animação ─────────────────────────────────
  useARTTransferencias({
    filtrando, setFiltrando, setNivelColetor, setNivelAmostra, setFunilVoltando,
    funilVoltando, setFunilEncaixado, setFunilPosicionado,
    pesando, setPesando, setPeso,
    pipetaCheia, setNivelPipeta, setPipetaCheia,
    pipetaAcucarCheia, setNivelPipetaAcucar, setPipetaAcucarCheia,
    transferindoPipeta, setTransferindoPipeta, setNivelBalao,
    transferindo, setTransferindo, setBalaoEncaixado, setBalaoPosicionado,
    transferindoPipetaAcucar, setTransferindoPipetaAcucar,
  });

  useARTReacoes({
    aquecendo, setTempoMicroondas, setAquecendo,
    setBalaoNoMicroondas, setBalaoPosicionado,
    setAmostraQuente, setMostrarAvisoResfriamento,
    adicionandoFenol, setGotasFenol, setAdicionandoFenol,
    pipetaHClCheia, setNivelPipetaHCl, nivelAlvoPipetaHCl,
    etapaAtual, nivelPipetaHCl, fehlingAAdicionado,
    titulando, setTitulando, setCorBalao, setAgitacao, setPipetaHClCheia,
    neutralizandoEDTA, setNeutralizandoEDTA,
    gotejandoEDTA, setGotasEDTA, setGotejandoEDTA,
    adicionandoAgua, nivelAlvoBalao, setNivelBalao, setAdicionandoAgua, setDiluindo,
    avancarEtapa,
  });

  useARTTE088({
    pipetaAzulCheia, setNivelPipetaAzul,
    gotejandoAzul, setGotejandoAzul, setPosicaoGotasAzul,
    posicaoGotasAzul, nivelErlenmeyerTE, setCorErlenmeyerDireitoFinal,
    transferindoBalaoParaBureta, setTransferindoBalaoParaBureta,
    setNivelBalao, setNivelBuretaDireita,
    gotejandoBuretaDireita, setGotejandoBuretaDireita, setPosicaoGotasBureta,
    avancarEtapa, finalizarAnalise,
  });

  // ── Helpers de etapa (padrão ArtMosto) ───────────────
  const isItem  = (id) => etapas[etapaAtual]?.itemNecessario === id;
  const isAlvo  = (id) => etapas[etapaAtual]?.alvo === id;
  const itemCls = (id) => isItem(id) ? 'pulse-item' : '';
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';

  // ── Derivados da pipeta ───────────────────────────────
  const nivelPipetaAtual = pipetaAzulCheia ? nivelPipetaAzul
    : pipetaHClCheia   ? nivelPipetaHCl
    : pipetaAcucarCheia? nivelPipetaAcucar
    : nivelPipeta;
  const corPipetaAtual = pipetaAzulCheia ? 'rgba(30,64,175,0.85)'
    : pipetaHClCheia   ? 'rgba(200,60,50,0.78)'
    : pipetaAcucarCheia? 'rgba(59,130,246,0.75)'
    : pipetaCheia      ? 'rgba(147,197,253,0.75)'
    : 'rgba(140,200,240,0.65)';
  const pipetaCarregada = pipetaAzulCheia || pipetaHClCheia || pipetaAcucarCheia || pipetaCheia;

  // ── Cor do balão da bancada ───────────────────────────
  const corBalaoRgba = diluindo          ? 'rgba(245,200,120,0.68)'
    : corBalao === 'amber'  ? 'rgba(180,83,9,0.72)'
    : corBalao === 'orange' ? 'rgba(194,65,12,0.72)'
    : corBalao === 'pink'   ? 'rgba(190,24,93,0.72)'
    : corBalao === 'rose'   ? 'rgba(190,18,60,0.72)'
    : 'rgba(127,29,29,0.88)';

  const balaoNaBancada  = !balaoPosicionado && !balaoNoMicroondas;
  const buretaClicavel  = etapaAtual === 21 && !gotejandoBuretaDireita;
  const te088Clicavel   = etapaAtual === 17 && !te088Ligado;


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
              <div><h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Parabéns!</h3><p style={{ fontSize: 15, margin: 0 }}>+100 pontos</p></div>
              <CheckCircle size={30} />
            </div>
          </div>
          {/* Estrelas de fundo */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {estrelas?.map((e) => (
              <Star key={e.id} fill="#fbbf24" style={{ position: 'absolute', left: e.left, top: e.top, width: 20, color: '#fbbf24', animationDelay: e.delay }} className="animate-ping" />
            ))}
          </div>
        </div>
      )}

      {/* ── BANNER: aguardar resfriamento ── */}
      {mostrarAvisoResfriamento && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)', color: 'white', padding: '12px 28px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>🔥 Aguarde a amostra atingir temperatura ambiente</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 16 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #00e5ff', borderRadius: 22, padding: '30px 38px', textAlign: 'center', color: 'white', maxWidth: 650, width: '100%', boxShadow: '0 0 42px rgba(0,229,255,0.22)' }}>
            <div style={{ fontSize: 52 }}>🧪</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#00e5ff', margin: '10px 0 4px' }}>Análise Concluída!</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 18 }}>Resultado final da análise de ART da dorna</p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: 18, flexWrap: 'wrap', marginBottom: 18 }}>
              <div style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 14, padding: '14px 22px', minWidth: 250 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Volume gasto na bureta</div>
                <div style={{ width: 128, height: 238, margin: '0 auto 8px', position: 'relative' }}>
                  <BuretaModalSVG volumeGasto={volumeGasto || 47.1} />
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#00e5ff', fontFamily: 'monospace', lineHeight: 1 }}>
                  {(volumeGasto || 0).toFixed(1)}
                </div>
                <div style={{ fontSize: 13, color: '#67e8f9' }}>mL gastos</div>
                <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 4 }}>faixa esperada: 47.1 a 50.9 mL</div>
              </div>

              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 14, padding: '16px 26px', minWidth: 230, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>ART calculado</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#54cf81', fontFamily: 'monospace', lineHeight: 1 }}>
                  {(artPercentual || 0).toFixed(2)}%
                </div>
                <div style={{ fontSize: 13, color: '#86efac', marginTop: 8 }}>Açúcares Redutores Totais</div>
              </div>
            </div>

            <div style={{ fontSize: 18, color: '#fbbf24', fontWeight: 700, marginBottom: 18 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', color: 'white', border: 'none', borderRadius: 14, padding: '12px 34px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Análise de ART"
        subtitulo={"Açúcares Redutores Totais · Dorna\nMétodo Fehling · TE-088"}
        icone="🧪"
        badges={['🍶 FERMENTAÇÃO', '🧪 ART']}
        footerLabel="🧪 ART Dorna"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 820 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 16, letterSpacing: 0.6 }}>
            🧪 Bancada — ART (Açúcares Redutores Totais) da Dorna · Método Fehling / TE-088
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA 1: EQUIPAMENTOS ════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>

              {/* BALANÇA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div
                  className={dropCls('balanca')}
                  style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '8px 10px' }}
                  onDrop={e => handleDrop('balanca', e)}
                  onDragOver={handleDragOver}
                >
                  {/* Display balança */}
                  <svg width="148" height="120" viewBox="0 -20 148 120">
                    <defs>
                      <linearGradient id="artBalBody" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"  stopColor="#5a5e6a" />
                        <stop offset="100%" stopColor="#3a3d46" />
                      </linearGradient>
                      {/* Clip no formato do Erlenmeyer (coords locais do <g>) */}
                      <clipPath id="artBalcoClip">
                        <rect x="-4" y="0" width="8" height="13" />
                        <path d="M -4,13 Q -14,17 -20,27 L 20,27 Q 14,17 4,13 Z" />
                        <ellipse cx="0" cy="27" rx="20" ry="5" />
                      </clipPath>
                    </defs>
                    <ellipse cx={74} cy={95} rx={60} ry={5} fill="rgba(0,0,0,0.18)" />
                    {/* Plataforma */}
                    <ellipse cx={74} cy={28} rx={52} ry={8} fill="rgba(200,200,210,0.85)" stroke="#9ca3af" strokeWidth="1.5" />
                    <ellipse cx={74} cy={27} rx={50} ry={6} fill="rgba(220,220,230,0.92)" stroke="#9ca3af" strokeWidth="0.8" />
                    {/* Coluna */}
                    <rect x={65} y={30} width={18} height={14} rx="2" fill="url(#artBalBody)" stroke="#374151" strokeWidth="1.2" />
                    {/* Corpo */}
                    <rect x={10} y={42} width={128} height={44} rx="6" fill="url(#artBalBody)" stroke="#374151" strokeWidth="1.5" />
                    {/* LCD */}
                    <rect x={16} y={47} width={80} height={32} rx="4" fill="#0a1018" stroke="#22d3ee" strokeWidth="1.0" />
                    <text x={56} y={60} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="monospace">
                      {pesando ? 'PESANDO' : balaoPosicionado ? 'BALÃO ✓' : 'STANDBY'}
                    </text>
                    <text x={56} y={75} textAnchor="middle" fontSize="14" fill={pesando ? '#00ff88' : balaoPosicionado ? '#22d3ee' : '#3a5a6a'} fontFamily="monospace" fontWeight="700">
                      {pesando ? `${peso.toFixed(1)} g` : balaoPosicionado ? '0,0 g' : '—'}
                    </text>
                    {/* LED */}
                    <circle cx={112} cy={63} r={5} fill={pesando ? '#f59e0b' : balaoPosicionado ? '#22c55e' : '#334155'} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                    <text x={74} y={93} textAnchor="middle" fontSize="6" fill="#4a3e28" fontFamily="monospace">Balança de Precisão</text>
                    {/* Erlenmeyer posicionado — y=0 no topo do bico, cresce para baixo */}
                    {balaoPosicionado && (
                      <g transform="translate(74, -14) scale(1.35)">
                        {/* Líquido (sobe de baixo para cima conforme nivelBalao) */}
                        {nivelBalao > 0 && (() => {
                          const liqH  = (nivelBalao / 100) * 32;
                          const liqTop = 32 - liqH;
                          return (
                            <g clipPath="url(#artBalcoClip)">
                              <rect x="-22" y={liqTop} width="44" height={liqH + 2} fill={corBalaoRgba} />
                              {/* Menisco */}
                              <ellipse cx="0" cy={liqTop} rx="3.5" ry="1.2" fill="rgba(255,255,255,0.28)" />
                            </g>
                          );
                        })()}
                        {/* Boca (menisco) */}
                        <ellipse cx="0" cy="0" rx="5" ry="2" fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.0" />
                        {/* Pescoço cilíndrico */}
                        <rect x="-4" y="0" width="8" height="13" rx="1.5" fill="rgba(185,228,255,0.38)" stroke="#8ac4dc" strokeWidth="1.2" />
                        {/* Ombros + corpo (Erlenmeyer simétrico) */}
                        <path d="M -4,13 Q -14,17 -20,27 L 20,27 Q 14,17 4,13 Z"
                          fill="rgba(185,228,255,0.32)" stroke="#8ac4dc" strokeWidth="1.2" />
                        {/* Fundo oval */}
                        <ellipse cx="0" cy="27" rx="20" ry="5" fill="rgba(185,228,255,0.32)" stroke="#8ac4dc" strokeWidth="1.2" />
                        {/* Reflexo no pescoço */}
                        <line x1="-3" y1="2" x2="-3" y2="11" stroke="rgba(255,255,255,0.40)" strokeWidth="1.3" strokeLinecap="round" />
                      </g>
                    )}
                  </svg>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Balança</span>
                {pesando && <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700 }}>⚖️ {peso.toFixed(1)} g</span>}
                {peso >= 50 && !pesando && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Pesagem ok</span>}
              </div>

              {/* MICROONDAS */}
              <ZonaDrop id="microondas" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div className={dropCls('microondas')} style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px' }}>
                  <MicroondasArrtSVG aquecendo={aquecendo} bequerDentro={balaoNoMicroondas} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Micro-ondas</span>
                {aquecendo && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>⚡ {tempoMicroondas}s</span>}
              </ZonaDrop>

              {/* TE-088 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  className={dropCls('te088')}
                  style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 13, padding: '6px 8px', cursor: te088Clicavel || buretaClicavel ? 'pointer' : 'default', width: 220, height: 260 }}
                  onDrop={e => handleDrop('te088', e)}
                  onDragOver={handleDragOver}
                  onClick={te088Clicavel ? handleLigarTE088 : buretaClicavel ? () => setGotejandoBuretaDireita(true) : undefined}
                >
                  <TE088SVG
                    te088Aquecendo={te088Aquecendo}
                    te088Quente={te088Quente}
                    fervendo={fervendo}
                    nivelBuretaDireita={nivelBuretaDireita}
                    corBuretaDireita={corBuretaDireita}
                    nivelErlenmeyerTE={nivelErlenmeyerTE}
                    corErlenmeyerDireitoFinal={corErlenmeyerDireitoFinal}
                    posicaoGotasAzul={posicaoGotasAzul}
                    posicaoGotasBureta={posicaoGotasBureta}
                    etapaAtual={buretaClicavel ? 21 : etapaAtual}
                    gotejandoBuretaDireita={gotejandoBuretaDireita}
                    onBuretaClick={() => setGotejandoBuretaDireita(true)}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Determinador TE-088</span>
                {te088Clicavel && <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique para ligar</span>}
                {buretaClicavel && <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>↑ Clique na bureta</span>}
                {te088Ligado && !te088Aquecendo && <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Em ebulição</span>}
              </div>

            </div>{/* fim zona 1 */}

            {/* ══ ZONA 2: VIDRARIA + FERRAMENTAS ══════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, alignItems: 'flex-end', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* AMOSTRA DA DORNA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(200,150,50,0.80)" label="Amostra" sub="Dorna" nivel={nivelAmostra} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra Dorna</span>
                </ItemBancada>
              </div>

              {/* COLETOR 400 mL (com funil) */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="coletor" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('coletor')} ${dropCls('coletor')}`}
                    draggable={isItem('coletor')}
                    onDragStart={e => handleDragStart('coletor', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <BequerSVG ml={400} nivel={nivelColetor} cor="rgba(200,150,50,0.62)"
                      id="artcol" funilAcoplado={funilPosicionado || funilEncaixado} filtrando={filtrando} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('coletor') ? '🖱️ ' : ''}Coletor 400 mL
                  </span>
                  <span style={{ fontSize: 8, color: nivelColetor > 0 ? '#22c55e' : '#94a3b8' }}>
                    {funilPosicionado ? '↑ Funil acoplado' : nivelColetor > 0 ? '✓ Filtrado' : 'Vazio'}
                  </span>
                </ZonaDrop>
              </div>

              {/* BALÃO BANCADA 200 mL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {balaoNaBancada ? (
                  <ZonaDrop id="balao-bancada" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      className={`item-drag ${itemCls('balao')} ${dropCls('balao-bancada')}`}
                      style={{ position: 'relative' }}
                      draggable={isItem('balao')}
                      onDragStart={e => handleDragStart('balao', e)}
                      onDragEnd={handleDragEnd}
                    >
                      <BalaoVolumetrico200SVG
                        nivel={Math.min(nivelBalao * 0.55, 100)}
                        cor={corBalaoRgba}
                        id="artbal"
                      />
                      {/* Gotas de fenolftaleína */}
                      {gotasFenol > 0 && Array.from({ length: gotasFenol }).map((_, i) => (
                        <div key={i} style={{ position: 'absolute', top: 0, left: 'calc(50% - 4px)', width: 8, height: 18, pointerEvents: 'none', zIndex: 30, animation: 'quedaGota 0.8s ease-in forwards' }}>
                          <svg width="8" height="16" viewBox="0 0 8 16">
                            <ellipse cx="4" cy="11" rx="3" ry="4" fill="rgba(236,72,153,0.90)" />
                          </svg>
                        </div>
                      ))}
                      {/* Gotas de EDTA */}
                      {gotasEDTA > 0 && Array.from({ length: gotasEDTA }).map((_, i) => (
                        <div key={i} style={{ position: 'absolute', top: 0, left: 'calc(50% - 5px)', width: 10, height: 20, pointerEvents: 'none', zIndex: 30, animation: 'quedaGota 0.9s ease-in forwards' }}>
                          <svg width="10" height="18" viewBox="0 0 10 18">
                            <ellipse cx="5" cy="13" rx="3.5" ry="4.5" fill="rgba(147,51,234,0.88)" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {isItem('balao') ? '🖱️ ' : ''}Balão 200 mL
                    </span>
                    <span style={{ fontSize: 8, color: nivelBalao > 0 ? '#22c55e' : '#94a3b8' }}>
                      {nivelBalao > 0 ? '💧 Com solução' : 'Vazio'}
                    </span>
                    {amostraQuente && (
                      <span style={{ fontSize: 8, color: '#ef4444', fontWeight: 700 }}>🔥 Quente!</span>
                    )}
                  </ZonaDrop>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.18 }}>
                    <BalaoVolumetrico200SVG nivel={0} cor="rgba(140,200,240,0.65)" id="artbalghost" />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#57534e' }}>Balão 200 mL</span>
                    <span style={{ fontSize: 8, color: '#57534e' }}>{balaoNoMicroondas ? '⚡ No micro-ondas' : '↑ Na balança'}</span>
                  </div>
                )}
              </div>

              {/* PIPETA 20 mL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('pipeta')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={isItem('pipeta')}
                  onDragStart={e => handleDragStart('pipeta', e)}
                  onDragEnd={handleDragEnd}
                >
                  <PipetaLabSVG nivel={nivelPipetaAtual} cor={corPipetaAtual} cheia={pipetaCarregada} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Pipeta 20 mL</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: pipetaCarregada ? '#34d399' : '#f87171' }}>
                    {pipetaCarregada ? '● Carregada' : 'Vazia'}
                  </span>
                </div>
              </div>

            </div>{/* fim zona 2 */}

            {/* ══ ZONA 3: FERRAMENTAS + FUNIL ════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'flex-end', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* FUNIL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('funil')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: funilPosicionado ? 0.15 : 1, transition: 'opacity 0.3s' }}
                  draggable={isItem('funil') && !funilPosicionado}
                  onDragStart={e => handleDragStart('funil', e)}
                  onDragEnd={handleDragEnd}
                >
                  <svg width="52" height="62" viewBox="0 0 52 62">
                    <path d="M2,2 L50,2 L32,52 L20,52 Z" fill="rgba(185,228,255,0.35)" stroke="#8ac4dc" strokeWidth="1.4" />
                    <ellipse cx={26} cy={2} rx={24} ry={4} fill="rgba(185,228,255,0.42)" stroke="#8ac4dc" strokeWidth="1.2" />
                    <rect x={22} y={52} width={8} height={8} rx="1.5" fill="rgba(165,215,255,0.30)" stroke="#8ac4dc" strokeWidth="1.0" />
                    <line x1={6} y1={5} x2={14} y2={50} stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 9, fontWeight: 700, color: funilPosicionado ? '#57534e' : '#e7e5e4' }}>
                    {isItem('funil') ? '🖱️ ' : ''}Funil
                  </span>
                  {funilPosicionado && <span style={{ fontSize: 8, color: '#57534e' }}>↑ Acoplado</span>}
                </div>
              </div>

              {/* ÁGUA DESMINERALIZADA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('agua')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={isItem('agua')}
                  onDragStart={e => handleDragStart('agua', e)}
                  onDragEnd={handleDragEnd}
                >
                  <FrascoReagente cor="rgba(140,200,240,0.75)" label="H₂O" sub="desm." nivel={80} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('agua') ? '🖱️ ' : ''}Água Desm.
                  </span>
                </div>
              </div>

              {/* FENOLFTALEÍNA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`item-drag ${itemCls('fenol')}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  draggable={isItem('fenol')}
                  onDragStart={e => handleDragStart('fenol', e)}
                  onDragEnd={handleDragEnd}
                >
                  <FrascoReagente cor="rgba(255,140,200,0.80)" label="Fenolftal." sub="1%" nivel={70} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {isItem('fenol') ? '🖱️ ' : ''}Fenolftaleína
                  </span>
                </div>
              </div>

            </div>{/* fim zona 3 */}

            {/* ══ ZONA 4: REAGENTES ═══════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {[
                { id: 'naoh',        cor: 'rgba(140,200,240,0.78)', label: 'NaOH',    sub: '20%'  },
                { id: 'acido',       cor: 'rgba(200,60,50,0.82)',   label: 'HCl',     sub: ''     },
                { id: 'acucar',      cor: 'rgba(200,145,30,0.82)',  label: 'Açúcar',  sub: 'Inv.' },
                { id: 'edta4',       cor: 'rgba(180,100,220,0.78)', label: 'EDTA',    sub: '4%'   },
                { id: 'azul-metileno', cor: 'rgba(0,30,180,0.85)', label: 'Azul Met.',sub: '1%'  },
              ].map(({ id: fid, cor, label, sub }) => (
                <div key={fid} style={{ display: 'flex', justifyContent: 'center' }}>
                  <ZonaDrop id={fid} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div className={dropCls(fid)}>
                      <FrascoReagente cor={cor} label={label} sub={sub} nivel={70} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4', textAlign: 'center' }}>{label}</span>
                  </ZonaDrop>
                </div>
              ))}

              {/* FEHLING A — draggável na etapa 15 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="fehlingA" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('fehlingA')} ${dropCls('fehlingA')}`}
                    draggable={etapaAtual === 15 && !fehlingAAdicionado}
                    onDragStart={e => { if (etapaAtual === 15 && !fehlingAAdicionado) handleDragStart('fehlingA', e); }}
                    onDragEnd={handleDragEnd}
                  >
                    <FrascoReagente cor="rgba(0,60,180,0.80)" label="Fehling A" sub="" nivel={68} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4', textAlign: 'center' }}>
                    {isItem('fehlingA') ? '🖱️ ' : ''}Fehling A
                  </span>
                </ZonaDrop>
              </div>

              {/* FEHLING B — draggável na etapa 16 */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="fehlingB" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('fehlingB')} ${dropCls('fehlingB')}`}
                    draggable={etapaAtual === 16 && !fehlingBAdicionado}
                    onDragStart={e => { if (etapaAtual === 16 && !fehlingBAdicionado) handleDragStart('fehlingB', e); }}
                    onDragEnd={handleDragEnd}
                  >
                    <FrascoReagente cor="rgba(10,40,160,0.80)" label="Fehling B" sub="" nivel={68} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4', textAlign: 'center' }}>
                    {isItem('fehlingB') ? '🖱️ ' : ''}Fehling B
                  </span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona 4 */}

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

export default SimuladorART;
