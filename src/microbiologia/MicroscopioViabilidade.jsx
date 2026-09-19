import React, { useState } from 'react';
import { calcViabilidade, calcBrotamento, calcCelulasML, calcLevedurasML } from '../utils/viabilidadeCalculo';

const MicroscopioViabilidade = ({ onConcluir }) => {

  // ── Estado interno da interface ───────────────────────
  const [zoom,       setZoom]       = React.useState(1);
  const [panX,       setPanX]       = React.useState(0);
  const [panY,       setPanY]       = React.useState(0);
  const [focado,     setFocado]     = React.useState(false);
  const [focando,    setFocando]    = React.useState(false);
  const [contVivas,  setContVivas]  = React.useState('');
  const [contMortas, setContMortas] = React.useState('');
  const [contBroto,  setContBroto]  = React.useState('');
  const [enviado,    setEnviado]    = React.useState(false);
  
  




  // ── Células geradas uma única vez ─────────────────────
  const [celulas] = React.useState(() => {
    const arr = [];
    const rand = (min, max) => Math.random() * (max - min) + min;
    const GX = 50, GY = 50, GW = 200, GH = 200;
    const Q = GW / 5;
    // quadrante A da Neubauer (superior esquerdo)
    const AX1 = GX;
    const AY1 = GY;
    const AX2 = GX + Q;
    const AY2 = GY + Q;
    const DIST_MIN = 5.2;        // distância mínima entre centros
    const DIST_BROTO = 3.2;      // distância mínima considerando brotos
    const MAX_TENTATIVAS = 120;  // tentativas por célula


    // função que gera posição com maior chance no quadrante A
    const posAleatoria = () => {

      const focoA = Math.random() < 0.10; // 35% das células no quadrante A

      if (focoA) {
        return {
          x: rand(AX1 + 6, AX2 - 6),
          y: rand(AY1 + 6, AY2 - 6)
        };
      }

      return {
        x: rand(GX + 8, GX + GW - 8),
        y: rand(GY + 8, GY + GH - 8)
      };

    };

    // distância livre de um ponto até todos os centros (e brotos) já colocados
    const distLivre = (x, y) => {
      let livre = Infinity;
      for (const c of arr) {
        livre = Math.min(livre, Math.hypot(c.x - x, c.y - y));
        if (c.broto) livre = Math.min(livre, Math.hypot(c.bx - x, c.by - y));
      }
      return livre;
    };

    // gera posição respeitando distância mínima entre células (evita
    // sobreposição das áreas de clique — célula por baixo ficava sem clique)
    const posValida = (minDist) => {
      let p = posAleatoria();
      let tentativas = 0;
      while (distLivre(p.x, p.y) < minDist && tentativas < MAX_TENTATIVAS) {
        p = posAleatoria();
        tentativas++;
      }
      return p;
    };

     for (let i = 0; i < 95; i++) {

  const p = posValida(DIST_MIN);

  const temBroto = Math.random() < 0.23;

  let bx = null;
  let by = null;
  let br = null;

  if (temBroto) {

    const r = rand(0.8, 1.4);

    const ang = rand(0, Math.PI * 2);


    const dist = r + rand(0.4, 0.9);

    let cbx = p.x + Math.cos(ang) * dist;
    let cby = p.y + Math.sin(ang) * dist;

    // broto também não pode cair sobre a área de clique de outra célula
    if (distLivre(cbx, cby) < DIST_BROTO) {
      cbx = p.x;
      cby = p.y;
    }

    bx = cbx;
    by = cby;
    br = r * rand(0.35,0.55);

  }

  arr.push({
    tipo: 'viva',
    x: p.x,
    y: p.y,
    r: rand(0.8, 1.4),
    opac: rand(0.55,0.85),
    broto: temBroto,
    bx,
    by,
    br
  });

}

      for (let i = 0; i < 45; i++) {
  const p = posValida(DIST_MIN);

  arr.push({tipo: 'morta',x: p.x,y: p.y,r: rand(0.7, 1.3),opac: rand(0.70, 0.92)});
}

    return arr;
  });

  // ── Controles de zoom ─────────────────────────────────
  const zoomIn  = () => setZoom(z => Math.min(z + 0.5, 8));
  const zoomOut = () => setZoom(z => Math.max(z - 0.5, 0.6));
  const [objetiva, setObjetiva] = useState(10);

  // ── Controles de pan ──────────────────────────────────
  const STEP = 24;
  const moverCima  = () => setPanY(y => y + STEP);
  const moverBaixo = () => setPanY(y => y - STEP);
  const moverEsq   = () => setPanX(x => x + STEP);
  const moverDir   = () => setPanX(x => x - STEP);
  const [dragging, setDragging] = React.useState(false);
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });
  const [light, setLight] = React.useState(1);
  const [velocity, setVelocity] = React.useState({x:0,y:0});
  // ── Controle de células já contadas ────────────────────
  const [celulasContadas, setCelulasContadas] = React.useState({});
  const [moveStart, setMoveStart] = React.useState(null);
  const [fatorDil, setFatorDil] = React.useState(40);
  
   
   // ── Contagem ao clicar na célula (clique de novo = descontar) ──
    const contarCelula = (celula, index) => {

      if (celulasContadas[index]) {

        setCelulasContadas(prev => {
          const next = { ...prev };
          delete next[index];
          return next;
        });

        if (celula.tipo === 'viva') {
          setContVivas(v => Math.max(0, (parseInt(v) || 0) - 1));

          if (celula.broto) {
            setContBroto(b => Math.max(0, (parseInt(b) || 0) - 1));
          }
        }

        if (celula.tipo === 'morta') {
          setContMortas(v => Math.max(0, (parseInt(v) || 0) - 1));
        }

        return;
      }

      setCelulasContadas(prev => ({
        ...prev,
        [index]: true
      }));

      if (celula.tipo === 'viva') {
        setContVivas (v => (parseInt(v) || 0)+1);

        if (celula.broto) {

          setContBroto(b => (parseInt(b) || 0) + 1);

        }

      }

      if (celula.tipo === 'morta') {

        setContMortas(v => (parseInt(v) || 0) + 1);

      }

    };
   
    // ── limite lente ──────────────────────────────────
  const limitarPan = (x,y)=>{

    const LIM = 120 * zoom;

    return {
      x: Math.max(-LIM, Math.min(LIM,x)),
      y: Math.max(-LIM, Math.min(LIM,y))
    };

  };
 
  const handleMouseDown = (e) => { 

    // 👇 verifica se clicou em célula (ou filho dela)
    if (e.target.closest('[data-celula="true"]')) return;
     setMoveStart({ x: e.clientX, y: e.clientY });

     
     setStartPos({
      x: e.clientX - panX,
      y: e.clientY - panY
    });

   };

  const handleMouseMove = (e) => {

    if (!moveStart) return;

    const dx = e.clientX - moveStart.x;
    const dy = e.clientY - moveStart.y;

    if (!dragging && Math.hypot(dx, dy) > 5) {
      setDragging(true);
    }

  if (!dragging) return;

    const nx = e.clientX - startPos.x;
    const ny = e.clientY - startPos.y;

    const lim = limitarPan(nx,ny);

    setVelocity({
      x: nx - panX,
      y: ny - panY
    });

    setPanX(lim.x);
    setPanY(lim.y);

  };


  const handleMouseUp = () => {
    setDragging(false);
    setMoveStart(null);
  };

  React.useEffect(()=>{

  if(dragging) return;

  const id = setInterval(()=>{

    setPanX(x=>{
      const v = velocity.x * 0.92;
      if(Math.abs(v)<0.1) return x;
      setVelocity(s=>({...s,x:v}));
      return limitarPan(x+v,panY).x;
    });

    setPanY(y=>{
      const v = velocity.y * 0.92;
      if(Math.abs(v)<0.1) return y;
      setVelocity(s=>({...s,y:v}));
      return limitarPan(panX,y+v).y;
    });

  },16);

  return ()=>clearInterval(id);

},[velocity,dragging]);

const handleWheel = (e)=>{

  e.preventDefault();

  const delta = e.deltaY > 0 ? -0.3 : 0.3;

  setZoom(z=>{

    const nz = Math.max(0.6,Math.min(8,z+delta));

    return nz;

  });

};

  const selecionarObjetiva = (valor) => {

  setObjetiva(valor);

  if (valor === 4)  setZoom(1.2);
  if (valor === 10) setZoom(2);
  if (valor === 40) setZoom(4);
  if (valor === 100) setZoom(7);

};


  // ── Foco progressivo ──────────────────────────────────
  const handleFocar = () => {
    if (focado || focando) return;
    setFocando(true);
    setTimeout(() => { setFocado(true); setFocando(false); }, 1400);
  };
  const handleDesfocar = () => { setFocado(false); };

  // ── Enviar contagem ───────────────────────────────────
  const handleEnviar = () => {
    if (!contVivas && !contMortas && !contBroto) return;
    setEnviado(true);
    setTimeout(() => onConcluir(contVivas, contMortas, contBroto), 1200);
  };

 
  

  // ── Renderização das células ──────────────────────────
  const renderCelulas = () => celulas.map((c, i) => {

 if (c.tipo === 'viva') return (

  <g key={i}
     data-celula="true"
     onClick={(e) =>{e.stopPropagation();
     contarCelula(c, i)}}
    style={{ cursor: 'pointer', pointerEvents:'all' }}>
    <circle cx={c.x}cy={c.y}r={c.r + 3}fill="transparent"/>
    <circle cx={c.x} cy={c.y} r={c.r} fill="rgba(210,235,210,0.18)"stroke="rgba(60,160,60,0.70)"strokeWidth="0.4"/>
    <circle cx={c.x} cy={c.y} r={c.r * 0.35} fill="rgba(80,180,80,0.35)"/>
    {celulasContadas[i] && (
      <circle cx={c.x} cy={c.y} r={c.r + 1.5}fill="none"stroke={
  c.tipo === 'morta'
    ? '#ef4444'
    : c.broto
    ? '#a78bfa'
    : '#fde047'
}strokeWidth="0.4" />)}

    {c.broto && (
      <circle cx={c.bx} cy={c.by} r={c.br} fill="rgba(210,235,210,0.18)"stroke="rgba(60,160,60,0.60)"strokeWidth="0.3"/>
    )}
    
    
  </g>
);

  if (c.tipo === 'morta') return (
   <g key={i}
    data-celula="true"
    onClick={(e) =>{e.stopPropagation();
    contarCelula(c, i)}}
    style={{ cursor: 'pointer',pointerEvents: 'all' }}>
    <circle cx={c.x}cy={c.y}r={c.r + 3}fill="transparent"/>
      <circle cx={c.x} cy={c.y} r={c.r} fill="rgba(235,70,100,0.55)" stroke="rgba(180,30,60,0.75)" strokeWidth="0.35" />
      <circle cx={c.x} cy={c.y} r={c.r * 0.35} fill="rgba(160,20,50,0.40)" />
      {celulasContadas[i] && (
      <circle cx={c.x} cy={c.y} r={c.r + 1.5}fill="none"stroke={c.tipo === 'morta'? '#ef4444': c.broto? '#a78bfa': '#fde047'}strokeWidth="0.4" />)}
    </g>
  );

 
  return null;

});

  // ── Grade de Neubauer SVG — fiel ao real ──────────────
 const renderNeubauer = () => {
  const OX = 50, OY = 50, GW = 200, GH = 200;
  const Q  = GW / 5;
  const sq = Q / 4;
  const linhas = [];

  // Linhas externas triplas
  [OY, OY + GH].forEach(y => {
    [-1.4, 0, 1.4].forEach(dy => {
      linhas.push(
        <line
          key={`th${y}${dy}`}
          x1={OX - 2}
          y1={y + dy}
          x2={OX + GW + 2}
          y2={y + dy}
          stroke="rgba(0,40,140,0.90)"
          strokeWidth="0.9"
        />
      );
    });
  });

  [OX, OX + GW].forEach(x => {
    [-1.4, 0, 1.4].forEach(dx => {
      linhas.push(
        <line
          key={`tv${x}${dx}`}
          x1={x + dx}
          y1={OY - 2}
          x2={x + dx}
          y2={OY + GH + 2}
          stroke="rgba(0,40,140,0.90)"
          strokeWidth="0.9"
        />
      );
    });
  });

  // Grade principal 5×5 com linhas triplas
for (let i = 1; i <= 4; i++) {
  const y = OY + Q * i;
  const x = OX + Q * i;

  [-1.4, 0, 1.4].forEach(d => {
    linhas.push(
      <line
        key={`qh${i}${d}`}
        x1={OX}
        y1={y + d}
        x2={OX + GW}
        y2={y + d}
        stroke="rgba(0,40,140,0.75)"
        strokeWidth="0.8"
      />
    );

    linhas.push(
      <line
        key={`qv${i}${d}`}
        x1={x + d}
        y1={OY}
        x2={x + d}
        y2={OY + GH}
        stroke="rgba(0,40,140,0.75)"
        strokeWidth="0.8"
      />
    );
  });
}

  // Subdivisão interna 4×4 em TODOS os 25 quadrados
  for (let qi = 0; qi < 5; qi++) {
    for (let qj = 0; qj < 5; qj++) {
      const bx = OX + qi * Q;
      const by = OY + qj * Q;

      for (let m = 1; m <= 3; m++) {
        linhas.push(
          <line
            key={`subh${qi}${qj}${m}`}
            x1={bx}
            y1={by + sq * m}
            x2={bx + Q}
            y2={by + sq * m}
            stroke="rgba(0,50,160,0.38)"
            strokeWidth="0.55"
          />
        );

        linhas.push(
          <line
            key={`subv${qi}${qj}${m}`}
            x1={bx + sq * m}
            y1={by}
            x2={bx + sq * m}
            y2={by + Q}
            stroke="rgba(0,50,160,0.38)"
            strokeWidth="0.55"
          />
        );
      }
    }
  }

  // Rótulos dos quadrantes principais
  [
    { label: 'A', x: OX + Q * 0 + 4, y: OY + Q * 0 + 13 },
    { label: 'B', x: OX + Q * 4 + 4, y: OY + Q * 0 + 13 },
    { label: 'C', x: OX + Q * 2 + 4, y: OY + Q * 2 + 13 },
    { label: 'D', x: OX + Q * 0 + 4, y: OY + Q * 4 + 13 },
    { label: 'E', x: OX + Q * 4 + 4, y: OY + Q * 4 + 13 },
  ].forEach(({ label, x, y }) => {
    linhas.push(
      <text
        key={`lbl${label}`}
        x={x}
        y={y}
        fontSize="9"
        fontWeight="700"
        fill="rgba(0,50,160,0.55)"
        fontFamily="monospace"
      >
        {label}
      </text>
    );
  });

  return linhas;
  };

  const btnCtrl = { background: 'rgba(14,165,233,0.22)', border: '1px solid rgba(14,165,233,0.45)', color: '#7dd3fc', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' };
  const inputNum = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(100,200,255,0.30)', borderRadius: 8, color: '#e2e8f0', padding: '7px 10px', width: 64, fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none' };

  // ── Estilos responsivos do modal de microscópio ────────
  React.useEffect(() => {
    const sid = 'micvb-modal-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = `
      .micvb-modal { width: 96vw; max-width: 1100px; max-height: 95vh; }
      .micvb-topbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
      .micvb-body { display: flex; gap: 0; }
      .micvb-left { flex: 1; min-width: 0; }
      .micvb-lens { width: 340px; height: 340px; }
      .micvb-right { width: 310px; flex-shrink: 0; }
      @media (max-width: 860px) {
        .micvb-body { flex-direction: column; }
        .micvb-right { width: 100%; }
        .micvb-lens { width: min(340px, 78vw); height: min(340px, 78vw); }
      }
    `;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(sid); if (el) el.remove(); };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="micvb-modal" style={{ background: 'linear-gradient(160deg,#0d1a2e,#0a1628,#091220)', border: '2px solid rgba(0,229,255,0.35)', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.75)', overflow: 'auto', padding: 0 }}>

        {/* ── Barra superior ── */}
        <div className="micvb-topbar" style={{ background: 'linear-gradient(90deg,#0c3a5e,#1a1f6e)', borderRadius: '22px 22px 0 0', padding: '14px 24px', borderBottom: '1px solid rgba(0,200,255,0.20)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(0,200,255,0.15)', borderRadius: 10, padding: '6px 10px', fontSize: 20 }}>🔬</div>
            <div>
              <div style={{ color: '#00e5ff', fontWeight: 900, fontSize: 16 }}>Microscópio de Viabilidade — Câmara de Neubauer</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>Etapa 21 · Análise de Viabilidade Celular por Exclusão com Eritrosina</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: focado ? '#22c55e' : focando ? '#f59e0b' : '#ef4444' }} />
            <span style={{ color: '#94a3b8', fontSize: 11 }}>{focado ? 'Focalizado' : focando ? 'Focando...' : 'Sem foco'}</span>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className="micvb-body" style={{}}>

          {/* ══ COLUNA ESQUERDA — Lente + Controles ══ */}
          <div className="micvb-left" style={{ padding: '18px 16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Lente circular */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>

              <div className="micvb-lens" style={{ borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #1a2e1a 0%, #0a150a 60%, #030808 100%)', border: '8px solid #1a2035', boxShadow: '0 0 0 4px #0d1525, 0 0 40px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.7)', overflow: 'hidden', position: 'relative', cursor: 'crosshair' }} onMouseDown={(e) => {
                if (e.target.closest('[data-celula="true"]')) { e.stopPropagation(); return;  }handleMouseDown(e);}} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}>

                {/* Reflexo da lente */}
                <div style={{ position: 'absolute', top: 14, left: 22, width: 60, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', transform: 'rotate(-25deg)', pointerEvents: 'none', zIndex: 10 }} />

                {/* Área microscópica com zoom + pan + foco */}
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', filter:focado? `blur(0px) brightness(${light})`: focando? `blur(2px) brightness(${light*0.8})`: `blur(6px) brightness(${light*0.6})`, transition: 'filter 1.2s ease' }}>
                  <div style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.22s ease', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="420" height="420" viewBox="0 0 300 300" style={{pointerEvents:"none"}}>
                      <defs>
                        <radialGradient id="bgMic" cx="50%" cy="50%">
                          <stop offset="0%"   stopColor="rgba(210,235,200,0.22)" />
                          <stop offset="70%"  stopColor="rgba(170,205,165,0.12)" />
                          <stop offset="100%" stopColor="rgba(130,170,130,0.06)" />
                        </radialGradient>
                        <radialGradient id="bgLens" cx="50%" cy="50%">
                          <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
                          <stop offset="85%"  stopColor="rgba(0,0,0,0)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
                        </radialGradient>
                      </defs>
                      <rect x="0"y="0"width="300"height="300"fill="url(#bgMic)"opacity={light}/>
                      {renderNeubauer()}
                      {renderCelulas()}
                      <circle cx="150" cy="150" r="150" fill="url(#bgLens)" />
                    </svg>
                    
                  </div>
                </div>

                {/* Retículo central */}
                {focado && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9 }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0,pointerEvents:'none' }}>
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
              <button style={{ ...btnCtrl, background: focado ? 'rgba(34,197,94,0.22)' : btnCtrl.background, borderColor: focado ? '#22c55e' : 'rgba(14,165,233,0.45)' }} onClick={handleFocar}>🔍 Focar</button>
              <button style={{ ...btnCtrl, background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.40)', color: '#f87171' }} onClick={handleDesfocar}>👁 Desfocar</button>
            </div>
            <div style={{
              display: "flex",
              gap: 6,
              marginTop: 6,
              justifyContent: "center"
            }}>

              {[4,10,40,100].map(v => (

                <button
                  key={v}
                  onClick={() => selecionarObjetiva(v)}
                  style={{
                    padding: "3px 6px",
                    fontSize: 10,
                    borderRadius: 6,
                    border: "1px solid #444",
                    background: objetiva === v ? "#22c55e" : "#1f2937",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  {v}x
                </button>
              ))}
            </div>

            {/* Controle de zoom */}
            <div>
              <div style={{ color: '#64748b', fontSize: 10, textAlign: 'center', marginBottom: 6 }}>ZOOM — {zoom.toFixed(1)}×</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                <button style={btnCtrl} onClick={zoomOut}>− Zoom</button>
                <div style={{ width: 90, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((zoom - 0.6) / 7.4) * 100}%`, background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', borderRadius: 4, transition: 'width 0.2s' }} />
                </div>
                <button style={btnCtrl} onClick={zoomIn}>+ Zoom</button>
              </div>
            </div>
            
            <div style={{marginTop:10}}>

            <div style={{fontSize:10,color:"#64748b",textAlign:"center"}}>
            💡 ILUMINAÇÃO
            </div>
            <input type="range"min="0.4"max="1.8"step="0.05"value={light}onChange={(e)=>setLight(parseFloat(e.target.value))}
            style={{width:"100%"}}/>
            </div>
            

            {/* Navegação da lâmina */}
            <div>
              <div style={{ color: '#64748b', fontSize: 10, textAlign: 'center', marginBottom: 6 }}>MOVER LÂMINA</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, width: 130, margin: '0 auto' }}>
                <div />
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={moverCima}>⬆</button>
                <div />
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={moverEsq}>⬅</button>
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center', background: 'rgba(255,255,255,0.05)', color: '#475569' }} onClick={() => { setPanX(0); setPanY(0); }}>○</button>
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={moverDir}>➡</button>
                <div />
                <button style={{ ...btnCtrl, padding: '5px 0', textAlign: 'center' }} onClick={moverBaixo}>⬇</button>
                <div />
              </div>
            </div>

          </div>


          {/* ══ COLUNA DIREITA — Painel educativo + Contagem ══ */}
          <div className="micvb-right" style={{ background: 'rgba(0,0,0,0.28)', borderLeft: '1px solid rgba(0,200,255,0.12)', borderRadius: '0 0 22px 0', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Legenda visual */}
            <div>
              <div style={{ color: '#00e5ff', fontSize: 12, fontWeight: 700, marginBottom: 10, borderBottom: '1px solid rgba(0,229,255,0.15)', paddingBottom: 6 }}>📚 Referência Visual</div>

              {/* Célula viva */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: 'rgba(34,197,94,0.07)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(34,197,94,0.18)' }}>
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="17" cy="17" r="12" fill="rgba(210,235,210,0.25)" stroke="rgba(60,160,60,0.85)" strokeWidth="1.5" />
                  <circle cx="17" cy="17" r="5" fill="rgba(80,180,80,0.40)" />
                  <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.45)" />
                </svg>
                <div>
                  <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 12 }}>Célula Viva</div>
                  <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.4 }}>Transparente, borda verde,<br/>núcleo visível</div>
                </div>
              </div>

              {/* Célula morta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: 'rgba(239,68,68,0.07)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(239,68,68,0.18)' }}>
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="17" cy="17" r="12" fill="rgba(235,70,100,0.72)" stroke="rgba(180,30,60,0.85)" strokeWidth="1.5" />
                  <circle cx="17" cy="17" r="5" fill="rgba(160,20,50,0.55)" />
                  <circle cx="12" cy="12" r="3" fill="rgba(255,180,180,0.50)" />
                </svg>
                <div>
                  <div style={{ color: '#f87171', fontWeight: 700, fontSize: 12 }}>Célula Morta</div>
                  <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.4 }}>Eritrosina incorporada,<br/>cor rosa/avermelhada</div>
                </div>
              </div>

              {/* Brotamento */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(99,102,241,0.07)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(99,102,241,0.18)' }}>
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="15" cy="18" r="9" fill="rgba(200,230,200,0.28)" stroke="rgba(60,160,60,0.82)" strokeWidth="1.3" />
                  <line x1="22" y1="14" x2="26" y2="11" stroke="rgba(60,160,60,0.45)" strokeWidth="2" />
                  <circle cx="27" cy="10" r="5" fill="rgba(210,240,210,0.32)" stroke="rgba(60,160,60,0.78)" strokeWidth="1.1" />
                  <circle cx="11" cy="14" r="3" fill="rgba(255,255,255,0.42)" />
                </svg>
                <div>
                  <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: 12 }}>Brotamento Celular</div>
                  <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.4 }}>Célula-mãe + célula-filha<br/>ligadas (levedura em divisão)</div>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>
                  ⚗️ Fator de Diluição
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {[20, 30,40,50].map(v => (
                    <button
                      key={v}
                      onClick={() => setFatorDil(v)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        fontSize: 11,
                        borderRadius: 6,
                        border: "1px solid #444",
                        background: fatorDil === v ? "#22c55e" : "#1f2937",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 700

                      }}
                    >
                      1mL:{v}
                    </button>
                  ))}
                </div>
              </div>


            {/* Campos de contagem */}
            <div>
              <div style={{ color: '#00e5ff', fontSize: 12, fontWeight: 700, marginBottom: 10, borderBottom: '1px solid rgba(0,229,255,0.15)', paddingBottom: 6 }}>🧮 Contagem Observada</div>

              {[
                { label: 'Células Vivas',         icon: '🟢', val: contVivas,  set: setContVivas  },
                { label: 'Células Mortas',         icon: '🔴', val: contMortas, set: setContMortas },
                { label: 'Células com Brotamento', icon: '🟣', val: contBroto,  set: setContBroto  },
              ].map(({ label, icon, val, set }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ color: '#94a3b8', fontSize: 11 }}>{icon} {label}</div>
                  <input type="number" min="0" value={val} onChange={e => set(e.target.value)} placeholder="0" style={inputNum} disabled={enviado} />
                </div>
              ))}

              {/* Viabilidade calculada ao vivo */}
              {(contVivas || contMortas) && (
      <div style={{
        background: 'rgba(0,229,255,0.07)',
        border: '1px solid rgba(0,229,255,0.22)',
        borderRadius: 10,
        padding: '10px 12px',
        marginTop: 8
      }}>

        {(() => {
          const v = parseInt(contVivas) || 0;
          const m = parseInt(contMortas) || 0;
          const b = parseInt(contBroto) || 0;

          const total = v + m;

      if (total === 0) return <div>—</div>;

      // 🔬 cálculos padrão usina (Neubauer: N × 10⁴ × fator de diluição)
      const viab       = calcViabilidade(v, m);
      const brot       = calcBrotamento(b, v);
      const celulasML  = calcCelulasML(v);
      const levedurasML = calcLevedurasML(v, fatorDil);
      const fmtCientifico = (val) => {
        if (!val || val <= 0) return '0';
        const sup = { '-': '⁻', 0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹' };
        const exp = Math.floor(Math.log10(val));
        const mant = val / Math.pow(10, exp);
        const expStr = String(exp).split('').map(ch => sup[ch] ?? ch).join('');
        return `${mant.toFixed(2)} × 10${expStr}`;
      };


      return (
        <>
          <div style={{ color: '#64748b', fontSize: 12 }}>RESULTADOS</div>
          
          <div style={{ fontSize: 10, color: '#0de74e', marginBottom: 6 }}>
             ⚗️  Diluição: 1:{fatorDil}
          </div>
              
                 

          <div style={{ color: '#00e5ff', fontSize: 20, fontWeight: 900 }}>
            {viab.toFixed()}%
          </div>
          <div style={{ fontSize: 9, color: '#475569', marginBottom: 6 }}>
            📊 Viabilidade Formula = (CV / ( CV + CM ) X 100
          </div>

          <div style={{ color: '#a78bfa', fontSize: 16, fontWeight: 800 }}>
            {brot.toFixed()}%

          </div>
          <div style={{ fontSize: 9, color: '#475569', marginBottom: 6 }}>
            🟣 Brotamento Formula = (B / CV ) X 100
          </div>

          <div style={{ color: '#22c55e', fontSize: 16, fontWeight: 800 }}>
            {fmtCientifico(celulasML)}
          </div>
          <div style={{ fontSize: 9, color: '#475569', marginBottom: 6 }}>
            🧫 Células/mL (câmara, sem diluição) = CV × 10⁴
          </div>

          <div style={{ color: '#f59e0b', fontSize: 16, fontWeight: 800 }}>
            {fmtCientifico(levedurasML)}
          </div>
          <div style={{ fontSize: 9, color: '#475569' }}>
            🟢 Leveduras viáveis/mL = CV × 10⁴ × fator de diluição
                </div>
              </>
                );
              })()}
            </div>
          )}
                      
            </div>


            {/* Princípio do método */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)', fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
              <div style={{ color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>📖 Princípio do Método</div>
              A eritrosina penetra apenas em células mortas (membrana comprometida), corando-as de rosa/vermelho. Células vivas excluem o corante e permanecem transparentes. A câmara de Neubauer possui volume definido (0,1 mm³ por quadrante).
            </div>


            {/* Botão concluir */}
            <button onClick={handleEnviar} disabled={enviado} style={{ background: enviado ? 'rgba(34,197,94,0.25)' : 'linear-gradient(90deg,#059669,#0ea5e9)', color: 'white', border: enviado ? '1px solid #22c55e' : 'none', borderRadius: 12, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: enviado ? 'default' : 'pointer', width: '100%', transition: 'all 0.2s' }}>
              {enviado ? '✅ Análise Registrada!' : '📋 Registrar Contagem'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroscopioViabilidade;
