/**
 * MicroscopioBastonetes.jsx — Interface de Contagem de Bastonetes Vivos
 *
 * Exibida após posicionar a lâmina no microscópio (etapa 20).
 * Reproduz a observação em 1000× com óleo de imersão.
 *
 * Fluxo:
 *   5 campos interativos → usuário clica nos bastonetes vivos →
 *   "Próximo campo" → extrapolação para 50 campos → resultado final
 *
 * Fórmula:
 *   Bastonetes/mL = (Nº Vivos / Nº Campos) × (1 / Volume) × FM × D
 *
 * Referência: ATy OPE GQI-PR-002, página 156.
 */
import React, { useState } from 'react';

const TOTAL_CAMPOS_REAL  = 50;
const CAMPOS_INTERATIVOS = 5;

// ── Geração dos campos microscópicos ─────────────────────────────────────────
const gerarCampos = () => {
  const rand = (a, b) => Math.random() * (b - a) + a;
  return Array.from({ length: CAMPOS_INTERATIVOS }, () => {
    const nvivos  = Math.floor(rand(3, 7));
    const nmortos = Math.floor(rand(1, 3));
    const rods = [];
    for (let i = 0; i < nvivos + nmortos; i++) {
      rods.push({
        tipo: i < nvivos ? 'vivo' : 'morto',
        x:   rand(35, 265),
        y:   rand(35, 265),
        ang: rand(0, Math.PI),
        len: rand(10, 22),
        rad: rand(2.5, 4.0),
      });
    }
    return rods;
  });
};

// ─────────────────────────────────────────────────────────────────────────────

const MicroscopioBastonetes = ({ onConcluir }) => {

  // ── Campos gerados uma única vez ──────────────────────
  const [campos] = useState(() => gerarCampos());

  // ── Contagem ──────────────────────────────────────────
  const [campoAtual,     setCampoAtual]     = useState(0);
  const [contadosIdx,    setContadosIdx]    = useState({});
  const [vivosNoCampo,   setVivosNoCampo]   = useState(0);
  const [totalVivosAcum, setTotalVivosAcum] = useState(0);
  const [alerta,         setAlerta]         = useState('');
  const [extrapolando,   setExtrapolando]   = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [enviado,        setEnviado]        = useState(false);

  // ── Microscópio ───────────────────────────────────────
  const [focado,   setFocado]   = useState(false);
  const [focando,  setFocando]  = useState(false);
  const [zoom,     setZoom]     = useState(4);
  const [light,    setLight]    = useState(1);
  const [panX,     setPanX]     = useState(0);
  const [panY,     setPanY]     = useState(0);
  const [moveStart,setMoveStart]= useState(null);
  const [dragging, setDragging] = useState(false);

  // ── Parâmetros de cálculo ─────────────────────────────
  const [volume,   setVolume]   = useState(0.01);
  const [fatorDil, setFatorDil] = useState(10);
  const FM = 1;

  // ── Foco progressivo ──────────────────────────────────
  const handleFocar = () => {
    if (focado || focando) return;
    setFocando(true);
    setTimeout(() => { setFocado(true); setFocando(false); }, 1400);
  };
  const handleDesfocar = () => setFocado(false);

  // ── Contar bastonate ao clicar ─────────────────────────
  const contarBastonate = (rod, rodIdx) => {
    if (contadosIdx[rodIdx]) return;
    if (rod.tipo === 'morto') {
      setAlerta('Bastonetes mortos corados em azul não devem ser contados!');
      setTimeout(() => setAlerta(''), 2800);
      return;
    }
    setContadosIdx(prev => ({ ...prev, [rodIdx]: true }));
    setVivosNoCampo(v => v + 1);
  };

  // ── Avançar campo / finalizar ─────────────────────────
  const proximoCampo = () => {
    const novoAcum = totalVivosAcum + vivosNoCampo;
    if (campoAtual + 1 >= CAMPOS_INTERATIVOS) {
      setTotalVivosAcum(novoAcum);
      setExtrapolando(true);
      setTimeout(() => {
        setExtrapolando(false);
        const mediaVivos = novoAcum / CAMPOS_INTERATIVOS;
        const vivos50    = Math.round(mediaVivos * TOTAL_CAMPOS_REAL);
        const resultado  = (vivos50 / TOTAL_CAMPOS_REAL) * (1 / volume) * FM * fatorDil;
        setResultadoFinal({ novoAcum, mediaVivos, vivos50, resultado });
      }, 2200);
    } else {
      setTotalVivosAcum(novoAcum);
      setCampoAtual(c => c + 1);
      setContadosIdx({});
      setVivosNoCampo(0);
      setPanX(0);
      setPanY(0);
    }
  };

  // ── Registrar resultado ───────────────────────────────
  const handleEnviar = () => {
    if (!resultadoFinal || enviado) return;
    setEnviado(true);
    setTimeout(() => onConcluir(resultadoFinal), 1200);
  };

  // ── Pan da lente ──────────────────────────────────────
  const limitarPan = (x, y) => {
    const lim = 120 * zoom;
    return { x: Math.max(-lim, Math.min(lim, x)), y: Math.max(-lim, Math.min(lim, y)) };
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('[data-rod="true"]')) return;
    setMoveStart({ x: e.clientX - panX, y: e.clientY - panY });
  };
  const handleMouseMove = (e) => {
    if (!moveStart) return;
    if (!dragging) setDragging(true);
    const lim = limitarPan(e.clientX - moveStart.x, e.clientY - moveStart.y);
    setPanX(lim.x);
    setPanY(lim.y);
  };
  const handleMouseUp = () => { setDragging(false); setMoveStart(null); };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.max(0.6, Math.min(8, z + (e.deltaY > 0 ? -0.3 : 0.3))));
  };

  // ── Renderizar bastonetes do campo atual ──────────────
  const renderRods = () => {
    const rods = campos[Math.min(campoAtual, CAMPOS_INTERATIVOS - 1)];
    return rods.map((rod, i) => {
      const isContado = !!contadosIdx[i];
      const isVivo    = rod.tipo === 'vivo';
      const cx        = rod.x;
      const cy        = rod.y;
      const rx        = rod.len / 2;
      const ry        = rod.rad;
      const angDeg    = rod.ang * 180 / Math.PI;
      const transform = `rotate(${angDeg}, ${cx}, ${cy})`;

      // Vivos: translúcidos, borda verde-clara | Mortos: azul intenso
      const fill   = isVivo
        ? (isContado ? 'rgba(190, 230, 155, 0.80)' : 'rgba(225, 245, 205, 0.32)')
        : 'rgba(28, 78, 200, 0.88)';
      const stroke = isVivo
        ? 'rgba(100, 190, 55, 0.88)'
        : 'rgba(18, 55, 190, 0.95)';

      return (
        <g key={i}
          data-rod="true"
          onClick={(e) => { e.stopPropagation(); contarBastonate(rod, i); }}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}>

          {/* Área de clique maior que o bastonate */}
          <ellipse cx={cx} cy={cy} rx={rx + 6} ry={ry + 6}
            fill="transparent" transform={transform} />

          {/* Corpo do bastonate */}
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
            fill={fill} stroke={stroke} strokeWidth="0.7"
            transform={transform} />

          {/* Reflexo nos vivos não contados */}
          {isVivo && !isContado && (
            <ellipse cx={cx - rx * 0.28} cy={cy - ry * 0.30}
              rx={rx * 0.32} ry={ry * 0.32}
              fill="rgba(255,255,255,0.28)"
              transform={transform} />
          )}

          {/* Anel de confirmação nos contados */}
          {isContado && (
            <ellipse cx={cx} cy={cy} rx={rx + 2.2} ry={ry + 2.2}
              fill="none" stroke="#fde047" strokeWidth="0.75"
              transform={transform} />
          )}
        </g>
      );
    });
  };

  const btnCtrl = {
    background: 'rgba(14,165,233,0.22)',
    border: '1px solid rgba(14,165,233,0.45)',
    color: '#7dd3fc',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  };

  // ── Estilos responsivos do modal de microscópio ────────
  React.useEffect(() => {
    const sid = 'micbt-modal-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = `
      .micbt-modal { width: 96vw; max-width: 1100px; max-height: 95vh; }
      .micbt-topbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
      .micbt-body { display: flex; gap: 0; }
      .micbt-left { flex: 1; min-width: 0; }
      .micbt-lens { width: 340px; height: 340px; }
      .micbt-right { width: 310px; flex-shrink: 0; }
      @media (max-width: 860px) {
        .micbt-body { flex-direction: column; }
        .micbt-right { width: 100%; }
        .micbt-lens { width: min(340px, 78vw); height: min(340px, 78vw); }
      }
    `;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(sid); if (el) el.remove(); };
  }, []);

  // ─────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="micbt-modal" style={{ background: 'linear-gradient(160deg,#0d1a2e,#0a1628,#091220)', border: '2px solid rgba(0,229,255,0.35)', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.75)', overflow: 'auto', padding: 0 }}>

        {/* ── Barra superior ── */}
        <div className="micbt-topbar" style={{ background: 'linear-gradient(90deg,#0c3a5e,#1a1f6e)', borderRadius: '22px 22px 0 0', padding: '14px 24px', borderBottom: '1px solid rgba(0,200,255,0.20)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(0,200,255,0.15)', borderRadius: 10, padding: '6px 10px', fontSize: 20 }}>🔬</div>
            <div>
              <div style={{ color: '#00e5ff', fontWeight: 900, fontSize: 16 }}>Microscópio — Contagem de Bastonetes Vivos</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>Etapa 21 · Amostra de Vinho Pós-Fermentação · 1000× com Óleo de Imersão · Azul de Metileno + Sulfato de Nilo</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: focado ? '#22c55e' : focando ? '#f59e0b' : '#ef4444' }} />
            <span style={{ color: '#94a3b8', fontSize: 11 }}>
              {focado ? 'Focalizado' : focando ? 'Focando...' : 'Sem foco'}
            </span>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className="micbt-body" style={{}}>

          {/* ══ COLUNA ESQUERDA — Lente + Controles ══ */}
          <div className="micbt-left" style={{ padding: '18px 16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Alerta de bastonate morto */}
            {alerta && (
              <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)', color: 'white', padding: '10px 16px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.60)', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
                ⚠️ {alerta}
              </div>
            )}

            {/* Progresso dos campos */}
            {!resultadoFinal && !extrapolando && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.20)', borderRadius: 12, padding: '10px 16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#00e5ff', fontWeight: 700, fontSize: 12 }}>
                    Campo {campoAtual + 1} de {CAMPOS_INTERATIVOS} campos interativos (representando {TOTAL_CAMPOS_REAL} campos totais)
                  </div>
                  <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.10)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(campoAtual / CAMPOS_INTERATIVOS) * 100}%`, background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 60 }}>
                  <div style={{ color: '#4ade80', fontWeight: 900, fontSize: 22 }}>{vivosNoCampo}</div>
                  <div style={{ color: '#64748b', fontSize: 10 }}>vivos</div>
                </div>
              </div>
            )}

            {/* Banner de extrapolação */}
            {extrapolando && (
              <div style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.30)', borderRadius: 12, padding: '14px 20px', textAlign: 'center' }}>
                <div style={{ color: '#00e5ff', fontWeight: 800, fontSize: 14 }}>⏳ Extrapolando para {TOTAL_CAMPOS_REAL} campos...</div>
                <div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>
                  A metodologia real utiliza {TOTAL_CAMPOS_REAL} campos uniformemente distribuídos pela lamínula.
                </div>
              </div>
            )}

            {/* Lente circular do microscópio */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                className="micbt-lens"
                style={{ borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #141d10 0%, #0b130a 60%, #03070a 100%)', border: '8px solid #1a2035', boxShadow: '0 0 0 4px #0d1525, 0 0 40px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.7)', overflow: 'hidden', position: 'relative', cursor: 'crosshair' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}>

                {/* Reflexo da lente */}
                <div style={{ position: 'absolute', top: 14, left: 22, width: 60, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', transform: 'rotate(-25deg)', pointerEvents: 'none', zIndex: 10 }} />

                {/* Área microscópica com zoom + pan + foco */}
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', filter: focado ? `blur(0px) brightness(${light})` : focando ? `blur(2px) brightness(${light * 0.8})` : `blur(6px) brightness(${light * 0.6})`, transition: 'filter 1.2s ease' }}>
                  <div style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: 'center center', transition: dragging ? 'none' : 'transform 0.22s ease', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="420" height="420" viewBox="0 0 300 300" style={{ pointerEvents: 'none' }}>
                      <defs>
                        <radialGradient id="bgMicBast" cx="50%" cy="50%">
                          <stop offset="0%"   stopColor="rgba(195, 220, 188, 0.22)" />
                          <stop offset="70%"  stopColor="rgba(155, 190, 150, 0.10)" />
                          <stop offset="100%" stopColor="rgba(115, 155, 115, 0.05)" />
                        </radialGradient>
                        <radialGradient id="bgLensBast" cx="50%" cy="50%">
                          <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
                          <stop offset="85%"  stopColor="rgba(0,0,0,0)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="300" height="300" fill="url(#bgMicBast)" opacity={light} />
                      {/* ── Bastonetes do campo atual ── */}
                      <g style={{ pointerEvents: 'all' }}>
                        {renderRods()}
                      </g>
                      <circle cx="150" cy="150" r="150" fill="url(#bgLensBast)" />
                    </svg>
                  </div>
                </div>

                {/* Retículo central */}
                {focado && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9 }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      <line x1="170" y1="145" x2="170" y2="195" stroke="rgba(0,229,255,0.30)" strokeWidth="0.8" />
                      <line x1="145" y1="170" x2="195" y2="170" stroke="rgba(0,229,255,0.30)" strokeWidth="0.8" />
                      <circle cx="170" cy="170" r="12" fill="none" stroke="rgba(0,229,255,0.20)" strokeWidth="0.8" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de foco */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                style={{ ...btnCtrl, background: focado ? 'rgba(34,197,94,0.22)' : btnCtrl.background, borderColor: focado ? '#22c55e' : 'rgba(14,165,233,0.45)' }}
                onClick={handleFocar}>
                🔍 Focar
              </button>
              <button
                style={{ ...btnCtrl, background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.40)', color: '#f87171' }}
                onClick={handleDesfocar}>
                👁 Desfocar
              </button>
            </div>

            {/* Seletor de objetiva */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {[4, 10, 40, 100].map(v => (
                <button key={v}
                  style={{ padding: '3px 8px', fontSize: 10, borderRadius: 6, border: '1px solid #444', background: v === 100 ? '#22c55e' : '#1f2937', color: '#fff', cursor: 'pointer' }}>
                  {v}×
                </button>
              ))}
            </div>

            {/* Controle de zoom */}
            <div>
              <div style={{ color: '#64748b', fontSize: 10, textAlign: 'center', marginBottom: 6 }}>ZOOM — {zoom.toFixed(1)}× (1000× com óleo de imersão)</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                <button style={btnCtrl} onClick={() => setZoom(z => Math.max(0.6, z - 0.5))}>− Zoom</button>
                <div style={{ width: 90, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((zoom - 0.6) / 7.4) * 100}%`, background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', borderRadius: 4, transition: 'width 0.2s' }} />
                </div>
                <button style={btnCtrl} onClick={() => setZoom(z => Math.min(8, z + 0.5))}>+ Zoom</button>
              </div>
            </div>

            {/* Iluminação */}
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center' }}>💡 ILUMINAÇÃO</div>
              <input type="range" min="0.4" max="1.8" step="0.05" value={light}
                onChange={e => setLight(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>

            {/* Mover lâmina */}
            <div>
              <div style={{ color: '#64748b', fontSize: 10, textAlign: 'center', marginBottom: 6 }}>MOVER LÂMINA</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, width: 130, margin: '0 auto' }}>
                <div />
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={() => setPanY(y => limitarPan(panX, y + 24).y)}>⬆</button>
                <div />
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={() => setPanX(x => limitarPan(x + 24, panY).x)}>⬅</button>
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center', background: 'rgba(255,255,255,0.05)', color: '#475569' }} onClick={() => { setPanX(0); setPanY(0); }}>○</button>
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={() => setPanX(x => limitarPan(x - 24, panY).x)}>➡</button>
                <div />
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={() => setPanY(y => limitarPan(panX, y - 24).y)}>⬇</button>
                <div />
              </div>
            </div>

            {/* Botão próximo campo */}
            {!resultadoFinal && !extrapolando && (
              <button
                onClick={proximoCampo}
                disabled={!focado}
                style={{ background: focado ? 'linear-gradient(90deg,#0ea5e9,#6366f1)' : 'rgba(255,255,255,0.05)', color: focado ? 'white' : '#475569', border: 'none', borderRadius: 12, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: focado ? 'pointer' : 'not-allowed', width: '100%', transition: 'all 0.2s' }}>
                {campoAtual + 1 >= CAMPOS_INTERATIVOS
                  ? `✅ Finalizar — Registrar ${CAMPOS_INTERATIVOS} Campos`
                  : `➡️ Próximo Campo (${campoAtual + 1}/${CAMPOS_INTERATIVOS})`}
              </button>
            )}

          </div>

          {/* ══ COLUNA DIREITA — Legenda + Contagem + Resultado ══ */}
          <div className="micbt-right" style={{ background: 'rgba(0,0,0,0.28)', borderLeft: '1px solid rgba(0,200,255,0.12)', borderRadius: '0 0 22px 0', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Legenda visual */}
            <div>
              <div style={{ color: '#00e5ff', fontSize: 12, fontWeight: 700, marginBottom: 10, borderBottom: '1px solid rgba(0,229,255,0.15)', paddingBottom: 6 }}>📚 Referência Visual</div>

              {/* Bastonate vivo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: 'rgba(34,197,94,0.07)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(34,197,94,0.18)' }}>
                <svg width="52" height="28" viewBox="0 0 52 28">
                  <ellipse cx="26" cy="14" rx="19" ry="7" fill="rgba(225,245,205,0.40)" stroke="rgba(100,190,55,0.85)" strokeWidth="1.3" />
                  <ellipse cx="19" cy="11" rx="6" ry="3" fill="rgba(255,255,255,0.28)" />
                </svg>
                <div>
                  <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 12 }}>Bastonate Vivo</div>
                  <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.4 }}>Não corado, translúcido,<br />borda verde-clara · CONTAR</div>
                </div>
              </div>

              {/* Bastonate morto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(28,78,200,0.10)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(28,78,200,0.28)' }}>
                <svg width="52" height="28" viewBox="0 0 52 28">
                  <ellipse cx="26" cy="14" rx="19" ry="7" fill="rgba(28,78,200,0.88)" stroke="rgba(18,55,190,0.95)" strokeWidth="1.3" />
                  <ellipse cx="19" cy="11" rx="6" ry="3" fill="rgba(100,140,255,0.32)" />
                </svg>
                <div>
                  <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: 12 }}>Bastonate Morto</div>
                  <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.4 }}>Corado em azul intenso,<br />membrana comprometida · NÃO CONTAR</div>
                </div>
              </div>
            </div>

            {/* Parâmetros de cálculo */}
            <div>
              <div style={{ color: '#00e5ff', fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: '1px solid rgba(0,229,255,0.15)', paddingBottom: 6 }}>⚗️ Parâmetros do Cálculo</div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Volume transferido para a lâmina (mL)</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0.005, 0.01, 0.02].map(v => (
                    <button key={v}
                      onClick={() => setVolume(v)}
                      style={{ flex: 1, padding: '5px 0', fontSize: 10, borderRadius: 6, border: '1px solid #444', background: volume === v ? '#22c55e' : '#1f2937', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                      {v} mL
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Fator de Diluição (D)</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[1, 5, 10, 20].map(v => (
                    <button key={v}
                      onClick={() => setFatorDil(v)}
                      style={{ flex: 1, padding: '5px 0', fontSize: 10, borderRadius: 6, border: '1px solid #444', background: fatorDil === v ? '#22c55e' : '#1f2937', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                      {v}×
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contagem acumulada */}
            <div>
              <div style={{ color: '#00e5ff', fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: '1px solid rgba(0,229,255,0.15)', paddingBottom: 6 }}>🧮 Contagem Acumulada</div>
              <div style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.20)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#94a3b8', fontSize: 11 }}>Total acumulado (vivos)</span>
                  <span style={{ color: '#4ade80', fontWeight: 900, fontSize: 18 }}>{totalVivosAcum + vivosNoCampo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: 11 }}>Campos contados</span>
                  <span style={{ color: '#00e5ff', fontWeight: 700, fontSize: 14 }}>{campoAtual} / {CAMPOS_INTERATIVOS}</span>
                </div>
                <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(campoAtual / CAMPOS_INTERATIVOS) * 100}%`, background: 'linear-gradient(90deg,#22c55e,#0ea5e9)', borderRadius: 2 }} />
                </div>
              </div>
            </div>

            {/* Resultado final */}
            {resultadoFinal && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>📊 Resultado Final</div>

                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>
                  Bastonetes vivos ({CAMPOS_INTERATIVOS} campos): <strong style={{ color: '#94a3b8' }}>{resultadoFinal.novoAcum}</strong>
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 10 }}>
                  Projeção ({TOTAL_CAMPOS_REAL} campos): <strong style={{ color: '#94a3b8' }}>{resultadoFinal.vivos50}</strong>
                </div>

                <div style={{ color: '#00e5ff', fontSize: 22, fontWeight: 900, textAlign: 'center', margin: '8px 0' }}>
                  {resultadoFinal.resultado.toExponential(2)} /mL
                </div>

                <div style={{ fontSize: 9, color: '#475569', textAlign: 'center', lineHeight: 1.6, marginTop: 8 }}>
                  Bastonetes/mL = (Nº Vivos / Nº Campos) × (1 / Volume) × FM × D<br />
                  = ({resultadoFinal.vivos50} / {TOTAL_CAMPOS_REAL}) × (1 / {volume}) × {FM} × {fatorDil}
                </div>

                <div style={{ marginTop: 10, background: 'rgba(0,229,255,0.06)', borderRadius: 8, padding: '6px 10px', fontSize: 9, color: '#64748b', lineHeight: 1.5 }}>
                  ℹ️ Foram considerados apenas bastonetes não corados, conforme metodologia ATy OPE GQI-PR-002.
                </div>
              </div>
            )}

            {/* Princípio do método */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)', fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
              <div style={{ color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>📖 Princípio do Método</div>
              O Azul de Metileno + Sulfato de Nilo penetra apenas em células com membrana comprometida (mortas), corando-as em azul intenso. Bastonetes vivos excluem o corante e permanecem translúcidos. Contam-se 50 campos uniformemente distribuídos pela lamínula.
            </div>

            {/* Botão registrar */}
            <button
              onClick={handleEnviar}
              disabled={!resultadoFinal || enviado}
              style={{ background: enviado ? 'rgba(34,197,94,0.25)' : resultadoFinal ? 'linear-gradient(90deg,#059669,#0ea5e9)' : 'rgba(255,255,255,0.05)', color: 'white', border: enviado ? '1px solid #22c55e' : 'none', borderRadius: 12, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: resultadoFinal && !enviado ? 'pointer' : 'default', width: '100%', transition: 'all 0.2s' }}>
              {enviado ? '✅ Análise Registrada!' : '📋 Registrar Contagem'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroscopioBastonetes;
