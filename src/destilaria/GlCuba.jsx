/**
 * GlCo2.jsx — Determinação de Teor Alcoólico (°GL) — Coluna de CO₂
 *
 * Simulador de bancada com 8 etapas interativas:
 *   Amostra CO₂ → Proveta 50 mL → Microdestilador → Balão 10 mL
 *   → Condensação/Destilação → Densímetro Digital → Resultado °GL
 *
 * Método: Microdestilação + Densimetria · Cálculo: % álcool = leitura / 5
 * Fonte: ATV-OPE-GQI-PR-002 — Página 138
 *
 * Usa LayoutSimulador (painel lateral compartilhado).
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import ProvetaSVG from '../components/lab/ProvetaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragGlCo2 } from '../hooks/useSimuladorDragGlCo2';
import { useMicrodestiladorGlCo2 } from '../hooks/useMicrodestiladorGlCo2';
import { useDensimetroGlCo2 } from '../hooks/useDensimetroGlCo2';
import { etapas } from '../fermentacao/data/etapasGlCuba';
import BalaoVolumetricoSVG from '../components/lab/BalaoVolumetricoSVG';
import MicrodestiladorSVG from '../components/lab/MicrodestiladorSVG';
import DensimetroDigitalSVG from '../components/lab/DensimetroDigitalSVG';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes glcoAquecer {
    0%, 100% { opacity: 0.55; }
    50%       { opacity: 0.95; }
  }
  @keyframes glcoBubble {
    0%   { transform: translateY(0)  scale(1);   opacity: 0.80; }
    100% { transform: translateY(-18px) scale(0.5); opacity: 0; }
  }
`;



/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SimuladorGlCuba = () => {
  useDragOverlay();

  // ── Injeta keyframes uma única vez ────────────────────
  useEffect(() => {
    const id = 'glco2-anim-styles';
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

  // ── Amostra Cuba ───────────────────────────────────────
  const [nivelAmostra, setNivelAmostra] = useState(82);

  // ── Microdestilador ───────────────────────────────────
  const [microdestiladorLigado,    setMicrodestiladorLigado]    = useState(false);
  const [microdestiladorAquecendo, setMicrodestiladorAquecendo] = useState(false);
  const [amostraNoMicro,           setAmostraNoMicro]           = useState(false);

  // ── Balão 50 mL ───────────────────────────────────────
  const [balaoAcoplado,     setBalaoAcoplado]     = useState(false);
  const [destilando,        setDestilando]        = useState(false);
  const [nivelBalao,        setNivelBalao]        = useState(0);
  const [balaoComDestilado, setBalaoComDestilado] = useState(false);

  // ── Densímetro ────────────────────────────────────────
  const [balaoNoDensimetro, setBalaoNoDensimetro] = useState(false);
  const [densimetroLendo,   setDensimetroLendo]   = useState(false);
  const [leituraRaw,        setLeituraRaw]        = useState(null);
  const [resultadoGl,       setResultadoGl]       = useState(null);

  // ── Microdestilador: destilação + click ──────────────
  const { handleClickMicrodestilador } = useMicrodestiladorGlCo2({
    etapaAtual, balaoAcoplado,
    microdestiladorLigado, microdestiladorAquecendo,
    setMicrodestiladorAquecendo, setMicrodestiladorLigado,
    setBalaoAcoplado, setDestilando, setNivelBalao, setBalaoComDestilado,
    celebrarAcerto, proximaEtapa,
  });

  // ── Densímetro: leitura + click ───────────────────────
  const { handleClickDensimetro } = useDensimetroGlCo2({
    etapaAtual, balaoNoDensimetro, densimetroLendo, resultadoGl,
    setDensimetroLendo, setLeituraRaw, setResultadoGl,
    celebrarAcerto, proximaEtapa,
  });

  // ── Timer: auto-conclusão na última etapa ─────────────
  useEffect(() => {
    if (etapaAtual !== 7) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragGlCo2(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra, setNivelProveta, setProvetaCheia,
    setAmostraNoMicro, setBalaoAcoplado, setBalaoNoDensimetro,
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

      {/* ── BANNER DESTILAÇÃO ── */}
      {destilando && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9)', color: 'white', padding: '12px 28px', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.75)', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>💧 Destilando...</div>
            <div style={{ fontSize: 12, marginTop: 3 }}>
              Coletando destilado · Balão {nivelBalao}% preenchido
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultadoGl !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #0ea5e9', borderRadius: 24, padding: '48px 60px', textAlign: 'center', color: 'white', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>🧪</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#0ea5e9', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Teor Alcoólico (°GL) · Cuba, Dorna, Volante
            </p>

            {/* Dados */}
            <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#67e8f9', fontFamily: 'monospace' }}>{leituraRaw}%</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Leitura densímetro</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{leituraRaw} ÷ 5</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Fórmula aplicada</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>Amostra: Cuba</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Coluna de fermentação</div>
                </div>
              </div>
            </div>

            {/* Resultado */}
            <div style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.35)', borderRadius: 14, padding: '16px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Teor Alcoólico</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#0ea5e9', fontFamily: 'monospace', lineHeight: 1 }}>{resultadoGl}</div>
              <div style={{ fontSize: 14, color: '#38bdf8', fontWeight: 700, marginTop: 4 }}>°GL</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#64748b' }}>
              Fonte: ATV-OPE-GQI-PR-002 — Página 138
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>
              🏆 Pontuação Final: {pontuacao} pts
            </div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Teor Alcoólico °GL"
        subtitulo={"Microdestilação · Densimetria\nATV-OPE-GQI-PR-002 ·Cuba , Dorna , Volante"}
        icone="🧫"
        badges={['🍶 FERMENTAÇÃO', '📊 DENSIMETRIA']}
        footerLabel="🧫 °GL Cuba,Dorna,Volante"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 740 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 15, fontWeight: 900, marginBottom: 18, letterSpacing: 0.8 }}>
            🧫 Bancada — Determinação de Teor Alcoólico (°GL) — Cuba, Dorna, Volante
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '20px 18px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR: EQUIPAMENTOS ══════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>

              {/* ─ MICRODESTILADOR (esq, flex:1) ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="microdestilador" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={dropCls('microdestilador')}
                    style={{
                      background: 'rgba(0,0,0,0.22)', borderRadius: 14, padding: '8px 12px',
                      cursor: etapaAtual === 1 && !microdestiladorLigado ? 'pointer' : 'default',
                    }}
                    onClick={handleClickMicrodestilador}
                  >
                    <MicrodestiladorSVG
                      ligado={microdestiladorLigado}
                      aquecendo={microdestiladorAquecendo}
                      amostraNoMicro={amostraNoMicro}
                      balaoAcoplado={balaoAcoplado}
                      nivelBalao={nivelBalao}
                      destilando={destilando}
                    />
                    {etapaAtual === 1 && !microdestiladorLigado && !microdestiladorAquecendo && (
                      <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>
                        🔵 Clique para ligar!
                      </div>
                    )}
                    {microdestiladorAquecendo && (
                      <div style={{ textAlign: 'center', fontSize: 8.5, color: '#f59e0b', fontWeight: 700, marginTop: 4 }}>
                        🔥 Aquecendo...
                      </div>
                    )}
                    {destilando && (
                      <div style={{ textAlign: 'center', fontSize: 8.5, color: '#38bdf8', fontWeight: 700, marginTop: 4 }}>
                        💧 Destilando... {nivelBalao}%
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Microdestilador</span>
                  <span style={{ fontSize: 8, color: microdestiladorLigado ? '#22c55e' : '#78716c', fontWeight: 700 }}>
                    {microdestiladorLigado ? '✓ Ligado · 92°C' : '○ Desligado'}
                  </span>
                </ZonaDrop>
              </div>

              {/* ─ DENSÍMETRO DIGITAL (dir, flexShrink:0) ─ */}
              <div style={{ flexShrink: 0 }}>
                <ZonaDrop id="densimetro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={dropCls('densimetro')}
                    style={{
                      background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '8px 10px',
                      cursor: etapaAtual === 6 && balaoNoDensimetro && !densimetroLendo && !resultadoGl ? 'pointer' : 'default',
                    }}
                    onClick={handleClickDensimetro}
                  >
                    <DensimetroDigitalSVG
                      balaoPresente={balaoNoDensimetro}
                      lendo={densimetroLendo}
                      resultado={resultadoGl}
                      leituraRaw={leituraRaw}
                    />
                    {etapaAtual === 6 && balaoNoDensimetro && !densimetroLendo && !resultadoGl && (
                      <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>
                        🔵 Clique START para ler!
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Densímetro Digital</span>
                  {resultadoGl && (
                    <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ {resultadoGl} °GL</span>
                  )}
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ ZONA INFERIOR: REAGENTES E VIDRARIA ════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'flex-end' }}>

              {/* AMOSTRA Cuba */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(220,195,130,0.80)" label="Amostra" sub="CO₂" nivel={nivelAmostra} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra Cuba</span>
                </ItemBancada>
              </div>

              {/* PROVETA 50 mL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="proveta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`item-drag ${itemCls('proveta')} ${dropCls('proveta')}`}
                    draggable={isItem('proveta') && provetaCheia}
                    onDragStart={e => handleDragStart('proveta', e)} onDragEnd={handleDragEnd}>
                    <ProvetaSVG nivel={nivelProveta} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>
                    {provetaCheia ? '🖱️ ' : ''}Proveta 50 mL
                  </span>
                  {provetaCheia && (
                    <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700 }}>50 mL medidos</span>
                  )}
                </ZonaDrop>
              </div>

              {/* BALÃO VOLUMÉTRICO 50 mL */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    className={`item-drag ${itemCls('balao')}`}
                    style={{
                      opacity: balaoAcoplado && !balaoComDestilado ? 0.16 : 1,
                      transition: 'opacity 0.3s',
                    }}
                    draggable={isItem('balao') && !balaoAcoplado}
                    onDragStart={e => handleDragStart('balao', e)}
                    onDragEnd={handleDragEnd}
                  >
                    <BalaoVolumetricoSVG
                      nivel={balaoComDestilado ? nivelBalao : 0}
                      id="bench"
                    />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: balaoAcoplado && !balaoComDestilado ? '#57534e' : '#e7e5e4' }}>
                    {isItem('balao') && !balaoAcoplado ? '🖱️ ' : ''}Balão 50 mL
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: balaoNoDensimetro ? '#57534e' : balaoComDestilado ? '#38bdf8' : balaoAcoplado ? '#57534e' : '#94a3b8' }}>
                    {balaoNoDensimetro ? '↑ No densímetro'
                      : balaoComDestilado ? '💧 Com destilado'
                      : balaoAcoplado ? '↑ No condensador'
                      : 'Vazio'}
                  </span>
                </div>
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

export default SimuladorGlCuba;
