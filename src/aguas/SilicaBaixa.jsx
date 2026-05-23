import React, { useState, useEffect } from 'react';
 
/* ═══════════════════════════════════════════════════════════
   CSS INJECTION — estilos globais do simulador
═══════════════════════════════════════════════════════════ */
let _cssInjected = false;
function injectCSS() {
  if (_cssInjected || typeof document === 'undefined') return;
  _cssInjected = true;
  const s = document.createElement('style');
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
    *{box-sizing:border-box;}
    html,body,#root{margin:0;padding:0;min-height:100vh;overflow-x:hidden;font-family:'DM Sans',sans-serif;}
    ::-webkit-scrollbar{width:8px;height:8px;}
    ::-webkit-scrollbar-track{background:#111827;}
    ::-webkit-scrollbar-thumb{background:rgba(99,179,237,0.18);border-radius:99px;}
    .sd{cursor:grab;transition:transform .14s,filter .14s;}
    .sd:hover{transform:scale(1.07) translateY(-2px);filter:brightness(1.12);}
    .sd:active{cursor:grabbing;opacity:.65;}
    .sp{animation:spGlow 1.1s ease-in-out infinite;border-radius:14px;}
    .st{filter:brightness(1.2);transform:scale(1.05);outline:3px solid #22d3ee;outline-offset:4px;border-radius:12px;}
    @keyframes spGlow{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,.55);}50%{box-shadow:0 0 0 10px rgba(34,211,238,0);}}
    @keyframes spBar{0%{background-position:-200% center;}100%{background-position:200% center;}}
    @keyframes spPop{0%{transform:scale(.85);opacity:0;}70%{transform:scale(1.05);}100%{transform:scale(1);opacity:1;}}
    @keyframes spBlink{0%,100%{opacity:1;}50%{opacity:.3;}}
    @keyframes colorDev{0%{fill:rgba(225,205,48,.60);}100%{fill:rgba(25,90,198,.80);}}
    @keyframes dropFall{0%{transform:translateY(0);opacity:1;}100%{transform:translateY(40px);opacity:0;}}
    .sb{background-image:linear-gradient(90deg,#22d3ee 0%,#818cf8 45%,#22d3ee 90%);background-size:200% 100%;animation:spBar 2.5s linear infinite;}
    .spop{animation:spPop .4s ease-out forwards;}
    .sblink{animation:spBlink .75s ease-in-out infinite;}
  `;
  document.head.appendChild(s);
}
 
 
/* ═══════════════════════════════════════════════════════════
   SVG — FRASCO DE REAGENTE
═══════════════════════════════════════════════════════════ */
const FrascoReagente = ({ cor, label, sub, nivel = 70, w = 58, h = 82 }) => {
  const uid = label.replace(/[^a-zA-Z0-9]/g, '');
  const nH = 24, bx = 4, by = nH + 4, bh = h - by - 2;
  return (
    <svg width={w} height={h + 20} viewBox={`0 0 ${w} ${h + 20}`}>
      <defs>
        <linearGradient id={`r1${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id={`r2${uid}`}>
          <rect x={bx} y={by} width={w - bx * 2} height={bh} rx="5" />
        </clipPath>
      </defs>
      <rect x={w / 2 - 11} y="0" width="22" height="10" rx="4" fill="#455a64" stroke="#37474f" strokeWidth="1" />
      <rect x={w / 2 - 8} y="8" width="16" height={nH} fill="rgba(200,235,255,.14)" stroke="#94a3b8" strokeWidth="1.4" />
      <rect x={bx} y={by} width={w - bx * 2} height={bh} rx="5" fill="rgba(200,235,255,.10)" stroke="#94a3b8" strokeWidth="1.4" />
      <g clipPath={`url(#r2${uid})`}>
        <rect x={bx} y={by + bh * (1 - nivel / 100)} width={w - bx * 2} height={bh * (nivel / 100)} fill={cor} opacity=".88" />
      </g>
      <rect x={bx + 6} y={by + 8} width="5" height={bh * .55} rx="2.5" fill={`url(#r1${uid})`} />
      <rect x={bx + 3} y={by + bh * .38} width={w - bx * 2 - 6} height="28" rx="3" fill="rgba(255,255,255,.92)" stroke="rgba(0,0,0,.08)" strokeWidth=".8" />
      <text x={w / 2} y={by + bh * .53} textAnchor="middle" fontSize="6.2" fontWeight="700" fill="#0d2137" fontFamily="monospace">{label}</text>
      {sub && <text x={w / 2} y={by + bh * .66} textAnchor="middle" fontSize="5.5" fill="#1a3a5e" fontFamily="sans-serif">{sub}</text>}
    </svg>
  );
};
 
 
/* ═══════════════════════════════════════════════════════════
   SVG — CUBETA DE VIDRO QUADRADA 25 mm / 10 mL
═══════════════════════════════════════════════════════════ */
const CubetaSVG = ({ cor = 'rgba(220,235,255,.08)', nivel = 0, id = 'cv' }) => {
  const W = 56, H = 84, wall = 3.5;
  const iW = W - wall * 2, iH = H - wall * 2 - 4;
  const lH = (nivel / 100) * iH, lY = wall + iH - lH;
  return (
    <svg width={W + 24} height={H + 34} viewBox={`0 0 ${W + 24} ${H + 34}`}>
      <defs>
        <linearGradient id={`cg${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(200,230,255,.44)" />
          <stop offset="30%" stopColor="rgba(220,240,255,.14)" />
          <stop offset="70%" stopColor="rgba(220,240,255,.08)" />
          <stop offset="100%" stopColor="rgba(200,230,255,.36)" />
        </linearGradient>
        <clipPath id={`cc${id}`}>
          <rect x={wall} y={wall} width={iW} height={iH} />
        </clipPath>
      </defs>
      <g transform="translate(12,6)">
        <ellipse cx={W / 2} cy={H + 6} rx={W / 2 - 4} ry="4" fill="rgba(0,0,0,.22)" />
        <g clipPath={`url(#cc${id})`}>
          <rect x={wall} y={lY} width={iW} height={lH} fill={cor}>
            {cor === 'rgba(25,90,198,.80)' && (
              <animate attributeName="opacity" from="0.5" to="0.88" dur="1.5s" fill="freeze" />
            )}
          </rect>
          {nivel > 5 && <rect x={wall + 2} y={lY + 1} width={iW - 4} height="2" rx="1" fill="rgba(255,255,255,.22)" />}
        </g>
        <rect x="0" y="0" width={W} height={H} rx="2" fill={`url(#cg${id})`} stroke="#a0c0da" strokeWidth="1.8" />
        <rect x="0" y="0" width={wall} height={H} rx="1" fill="rgba(255,255,255,.28)" />
        <rect x={W - wall} y="0" width={wall} height={H} rx="1" fill="rgba(255,255,255,.11)" />
        <rect x="0" y={H - wall} width={W} height={wall} rx="1" fill="rgba(200,225,245,.32)" />
        <rect x="-2" y="-3" width={W + 4} height="6" rx="2" fill="rgba(180,215,240,.26)" stroke="#9ab8d0" strokeWidth="1.1" />
        <rect x="6" y="10" width="4" height={H * .56} rx="2" fill="rgba(255,255,255,.26)" />
        <rect x={W / 2 - 18} y={H - 22} width="36" height="18" rx="3" fill="rgba(255,255,255,.88)" stroke="rgba(0,0,0,.08)" strokeWidth=".7" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="6.5" fill="#0d2137" fontFamily="monospace" fontWeight="700">10 mL</text>
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="5.2" fill="#1a3a5e" fontFamily="sans-serif">25 mm</text>
      </g>
    </svg>
  );
};
 
 
/* ═══════════════════════════════════════════════════════════
   SVG — FOTÔMETRO / ESPECTRÔMETRO DE BANCADA
═══════════════════════════════════════════════════════════ */
const FotometroSVG = ({ cubetaDentro = false, lendo = false, resultado = null }) => (
  <svg width="240" height="175" viewBox="0 0 240 175">
    <defs>
      <linearGradient id="fBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2c3e55" />
        <stop offset="100%" stopColor="#1a2535" />
      </linearGradient>
      <linearGradient id="fScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#001830" />
        <stop offset="100%" stopColor="#000e20" />
      </linearGradient>
      <filter id="fSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".5" /></filter>
    </defs>
    <g filter="url(#fSh)">
      <rect x="4" y="24" width="232" height="142" rx="10" fill="url(#fBody)" stroke="#131e2d" strokeWidth="2" />
      <rect x="8" y="12" width="224" height="20" rx="6" fill="#1e2e42" stroke="#1e3050" strokeWidth="1" />
    </g>
    <text x="22" y="25" fontSize="7.5" fill="#4a9fd4" fontFamily="monospace" fontWeight="700">HACH DR900</text>
    <text x="22" y="31.5" fontSize="5.5" fill="#3a5a7a" fontFamily="sans-serif">Colorimeter · Photometer</text>
    <circle cx="216" cy="22" r="5" fill={resultado ? '#22c55e' : lendo ? '#f59e0b' : '#3b82f6'} stroke="rgba(0,0,0,.3)" strokeWidth="1" />
    {(lendo || resultado) && <circle cx="216" cy="22" r="9" fill="none" stroke={lendo ? 'rgba(245,158,11,.38)' : 'rgba(34,197,94,.38)'} strokeWidth="2" />}
    <rect x="14" y="38" width="148" height="72" rx="5" fill="url(#fScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x="16" y="40" width="144" height="68" rx="4" fill="rgba(0,40,80,.4)" />
    <text x="88" y="56" textAnchor="middle" fontSize="7" fill="#2a6a9a" fontFamily="monospace">SILICA LOW · 810 nm</text>
    <line x1="22" y1="60" x2="154" y2="60" stroke="rgba(14,165,233,.22)" strokeWidth=".8" />
    {resultado ? (
      <>
        <text x="88" y="81" textAnchor="middle" fontSize="26" fill="#00ff88" fontFamily="monospace" fontWeight="700">{resultado}</text>
        <text x="88" y="96" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">mg/L SiO₂</text>
        <text x="88" y="105" textAnchor="middle" fontSize="6" fill="#16a34a" fontFamily="sans-serif">✓ Leitura concluída</text>
      </>
    ) : lendo ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="11" fill="#fbbf24" fontFamily="monospace">Reading...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,.08)" />
        <rect x="28" y="90" width="80" height="5" rx="2.5" fill="rgba(251,191,36,.6)">
          <animate attributeName="width" from="20" to="120" dur="2.5s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Analisando...</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="88" y="91" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="88" y="104" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Pressione READ</text>
      </>
    ) : (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#4a7a9a" fontFamily="monospace">STANDBY</text>
        <text x="88" y="92" textAnchor="middle" fontSize="7.5" fill="#3a5a6a" fontFamily="sans-serif">Aguardando cubeta...</text>
      </>
    )}
    <rect x="172" y="38" width="56" height="72" rx="5" fill="#0a1525" stroke={cubetaDentro ? '#22c55e' : '#2a3a52'} strokeWidth="1.5" />
    <text x="200" y="53" textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="monospace">SAMPLE</text>
    {cubetaDentro ? (
      <g>
        <rect x="182" y="60" width="36" height="46" rx="2" fill="rgba(25,90,198,.72)" stroke="rgba(90,150,220,.8)" strokeWidth="1" />
        <rect x="184" y="62" width="6" height="38" fill="rgba(255,255,255,.16)" />
        <rect x="166" y="78" width="52" height="8" rx="3" fill={resultado ? 'rgba(34,197,94,.15)' : 'rgba(14,165,233,.1)'} />
      </g>
    ) : (
      <rect x="182" y="60" width="36" height="46" rx="2" fill="rgba(5,12,25,.6)" stroke="#1a2535" strokeWidth=".8" strokeDasharray="4,2" />
    )}
    <circle cx="168" cy="84" r="4" fill={cubetaDentro ? 'rgba(14,165,233,.8)' : 'rgba(14,165,233,.22)'} stroke="rgba(14,165,233,.35)" strokeWidth="1" />
    {['ON', 'ZERO', 'READ', 'MENU'].map((lbl, i) => (
      <g key={lbl}>
        <rect x={18 + i * 36} y="126" width="32" height="14" rx="4" fill="#0f1e30" stroke="#1e3a5f" strokeWidth="1" />
        <text x={34 + i * 36} y="135.5" textAnchor="middle" fontSize="5.5" fill="#60a5fa" fontFamily="monospace">{lbl}</text>
      </g>
    ))}
    <text x="120" y="167" textAnchor="middle" fontSize="5.5" fill="#2a4060" fontFamily="sans-serif">HACH Method 8185 · Low Range Silica</text>
  </svg>
);
 
 
/* ═══════════════════════════════════════════════════════════
   SVG — MICROPIPETA P1000
═══════════════════════════════════════════════════════════ */
const MicropipetaP1000SVG = ({ nivel = 0, corLiq = 'rgba(200,228,248,.8)', temPonteira = false }) => {
  const tipH = temPonteira ? 34 : 0;
  return (
    <svg width="58" height={195 + tipH} viewBox={`0 0 58 ${195 + tipH}`}>
      <defs>
        <linearGradient id="mpBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dde4f0" />
          <stop offset="50%" stopColor="#f0f4fa" />
          <stop offset="100%" stopColor="#c5cedf" />
        </linearGradient>
        <linearGradient id="mpBtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#546e7a" />
          <stop offset="100%" stopColor="#263238" />
        </linearGradient>
        <clipPath id="mpLiq"><rect x="17" y="44" width="22" height="96" rx="7" /></clipPath>
      </defs>
      <ellipse cx="29" cy="10" rx="13" ry="9" fill="url(#mpBtn)" stroke="#1a2a35" strokeWidth="1.4" />
      <ellipse cx="29" cy="8" rx="9" ry="5.5" fill="rgba(255,255,255,.18)" />
      <text x="29" y="11.5" textAnchor="middle" fontSize="5.5" fill="rgba(255,255,255,.55)" fontFamily="sans-serif">▲</text>
      <rect x="14" y="18" width="30" height="138" rx="13" fill="url(#mpBody)" stroke="#9baab8" strokeWidth="1.4" />
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x="16" y={100 + i * 9} width="26" height="4" rx="2" fill="rgba(0,0,0,.05)" />
      ))}
      <rect x="17" y="30" width="24" height="26" rx="4" fill="#0a1220" stroke="#00bcd4" strokeWidth="1.1" />
      <rect x="19" y="32" width="20" height="22" rx="3" fill="#001428" />
      <text x="29" y="46" textAnchor="middle" fontSize="8.5" fill="#00e5ff" fontFamily="monospace" fontWeight="700">P1000</text>
      <text x="29" y="52" textAnchor="middle" fontSize="5" fill="rgba(0,229,255,.5)" fontFamily="sans-serif">µL</text>
      {temPonteira && nivel > 0 && (
        <g clipPath="url(#mpLiq)">
          <rect x="17" y={140 - nivel * .9} width="22" height={nivel * .9} fill={corLiq} opacity=".85" />
        </g>
      )}
      <rect x="18" y="142" width="22" height="12" rx="4" fill="#e8ecf4" stroke="#9baab8" strokeWidth=".9" />
      <text x="29" y="150.5" textAnchor="middle" fontSize="5" fill="#546e7a" fontFamily="sans-serif">EJECT</text>
      <rect x="24" y="153" width="10" height="12" rx="3" fill="#718096" stroke="#4a5568" strokeWidth="1" />
      <rect x="26" y="162" width="6" height="5" rx="1.5" fill="#4a5568" />
      {temPonteira && (
        <g>
          <polygon points={`22,167 36,167 31.5,${167 + tipH} 26.5,${167 + tipH}`} fill="rgba(100,170,250,.65)" stroke="rgba(50,100,180,.4)" strokeWidth=".8" />
          <polygon points={`22,167 25,167 26.8,${167 + tipH} 26.5,${167 + tipH}`} fill="rgba(255,255,255,.28)" />
          {nivel > 0 && (
            <polygon
              points={`${22 + (1 - nivel / 100) * 4},${167 + tipH * (1 - nivel / 100)} ${36 - (1 - nivel / 100) * 4},${167 + tipH * (1 - nivel / 100)} 31.5,${167 + tipH} 26.5,${167 + tipH}`}
              fill={corLiq} opacity=".85"
            />
          )}
          <rect x="21.5" y="165" width="15" height="4" rx="1.5" fill="rgba(100,170,250,.75)" stroke="rgba(50,100,180,.3)" strokeWidth=".7" />
        </g>
      )}
    </svg>
  );
};
 
 
/* ═══════════════════════════════════════════════════════════
   SVG — COPO TRANSPARENTE
═══════════════════════════════════════════════════════════ */
const CopoTransparenteSVG = ({ nivel = 0, cor = 'rgba(100,180,255,.4)', id = 'g1' }) => {
  const W = 64, H = 88, bx = 6, by = 8, bw = W - 12, bh = H - 14;
  const lH = (nivel / 100) * bh, lY = by + bh - lH;
  return (
    <svg width={W + 16} height={H + 22} viewBox={`0 0 ${W + 16} ${H + 22}`}>
      <defs>
        <clipPath id={`gc${id}`}>
          <path d={`M${bx + 8},${by} L${bx},${by + bh} L${bx + bw},${by + bh} L${bx + bw - 8},${by} Z`} />
        </clipPath>
        <linearGradient id={`gg${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(200,230,255,.36)" />
          <stop offset="20%" stopColor="rgba(220,240,255,.1)" />
          <stop offset="80%" stopColor="rgba(220,240,255,.07)" />
          <stop offset="100%" stopColor="rgba(200,230,255,.26)" />
        </linearGradient>
      </defs>
      <g transform="translate(8,6)">
        <ellipse cx={W / 2} cy={H + 8} rx={W / 2 - 4} ry="4" fill="rgba(0,0,0,.18)" />
        <path d={`M${bx + bw - 8},${by} Q${bx + bw + 4},${by - 6} ${bx + bw + 4},${by}`} fill="none" stroke="#9ab8d0" strokeWidth="1.5" />
        <g clipPath={`url(#gc${id})`}>
          <rect x={bx} y={lY} width={bw} height={lH + 4} fill={cor} />
        </g>
        <path d={`M${bx + 8},${by} L${bx},${by + bh} L${bx + bw},${by + bh} L${bx + bw - 8},${by} Z`} fill={`url(#gg${id})`} stroke="#9ab8d0" strokeWidth="1.6" />
        <path d={`M${bx + 8},${by} L${bx},${by + bh} L${bx + 3},${by + bh} L${bx + 10.5},${by} Z`} fill="rgba(255,255,255,.22)" />
        <path d={`M${bx + 6},${by - 2} L${bx + bw - 6},${by - 2}`} stroke="#9ab8d0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {[25, 50, 75].map(p => {
          const y = by + bh * (1 - p / 100);
          return (
            <g key={p}>
              <line x1={bx + 2} y1={y} x2={bx + 9} y2={y} stroke="rgba(14,50,140,.55)" strokeWidth=".9" />
              <text x={bx + 11} y={y + 3.5} fontSize="6" fill="rgba(14,50,140,.5)" fontFamily="monospace">{p}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
 
 
/* ═══════════════════════════════════════════════════════════
   SVG — RACK DE PONTEIRAS  P20 / P200 / P1000
═══════════════════════════════════════════════════════════ */
const RackPonteiras = ({ disponivel = true, onTake }) => {
  const COLS = 3;
  const ROWS = 4;

  const GX = 28;
  const GY = 22;

  const RW = COLS * GX + 18;
  const RH = ROWS * GY + 26;

  const tipDef = [
    { label: 'P20', cor: '#c084fc', altTip: 14, rTip: 3.5, capH: 5 },
    { label: 'P200', cor: '#4ade80', altTip: 20, rTip: 4.5, capH: 6 },
    { label: 'P1000', cor: '#fbbf24', altTip: 28, rTip: 5.5, capH: 7 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <svg
        width={RW + 4}
        height={RH + 40}
        viewBox={`0 0 ${RW + 4} ${RH + 40}`}
      >
        <defs>
          <linearGradient id="rackGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4e342e" />
            <stop offset="100%" stopColor="#3e2723" />
          </linearGradient>
        </defs>

        <rect
          x="2"
          y="18"
          width={RW}
          height={RH}
          rx="6"
          fill="url(#rackGrad)"
          stroke="#2d1b11"
          strokeWidth="1.5"
        />

        <rect
          x="4"
          y="20"
          width={RW - 4}
          height="6"
          rx="3"
          fill="rgba(255,255,255,0.07)"
        />

        {tipDef.map((t, c) => (
          <text
            key={c}
            x={2 + 9 + c * GX + GX / 2}
            y="14"
            textAnchor="middle"
            fontSize="6.5"
            fill={t.cor}
            fontWeight="700"
            fontFamily="monospace"
          >
            {t.label}
          </text>
        ))}

        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const idx = r * COLS + c;

            const tx = 2 + 9 + c * GX + GX / 2;
            const ty = 18 + 14 + r * GY;

            const def = tipDef[c];

            const has = disponivel;

            return (
              <g
                key={idx}
                onClick={() => {
                  if (has && c === 2 && onTake) {
                    onTake();
                  }
                }}
                style={{
                  cursor: has && c === 2 ? 'pointer' : 'default',
                  opacity: has ? 1 : 0.4,
                }}
              >
                <ellipse
                  cx={tx}
                  cy={ty}
                  rx={def.rTip + 2}
                  ry={3.5}
                  fill={
                    has
                      ? 'rgba(0,0,0,0.35)'
                      : 'rgba(0,0,0,0.55)'
                  }
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="0.8"
                />

                {has && (
                  <>
                    <ellipse
                      cx={tx}
                      cy={ty - 1}
                      rx={def.rTip}
                      ry={def.capH * 0.4}
                      fill={def.cor}
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="0.7"
                    />

                    <polygon
                      points={`
                        ${tx - def.rTip},${ty}
                        ${tx + def.rTip},${ty}
                        ${tx + 1.5},${ty + def.altTip}
                        ${tx - 1.5},${ty + def.altTip}
                      `}
                      fill={def.cor}
                      opacity="0.72"
                      stroke="rgba(0,0,0,0.18)"
                      strokeWidth="0.5"
                    />

                    <polygon
                      points={`
                        ${tx - def.rTip + 1},${ty}
                        ${tx - def.rTip + 3},${ty}
                        ${tx - 0.5},${ty + def.altTip}
                        ${tx - 1.5},${ty + def.altTip}
                      `}
                      fill="rgba(255,255,255,0.3)"
                    />
                  </>
                )}
              </g>
            );
          })
        )}
      </svg>

      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#a8a29e',
        }}
      >
        Rack de Ponteiras
      </span>

      <div style={{ display: 'flex', gap: 10 }}>
        {[
          ['P20', '#c084fc', 'Pequena'],
          ['P200', '#4ade80', 'Média'],
          ['P1000', '#fbbf24', 'Grande'],
        ].map(([l, c, d]) => (
          <div
            key={l}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9,
                background: c,
              }}
            />

            <span
              style={{
                fontSize: 8,
                color: '#94a3b8',
              }}
            >
              {l} {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
 
 
 
/* ═══════════════════════════════════════════════════════════
   ETAPAS DA ANÁLISE DE SÍLICA BAIXA
═══════════════════════════════════════════════════════════ */
const etapas = [
  { id: 0, titulo: 'Selecionar Ponteira P1000',        descricao: 'Clique na ponteira azul P1000 no rack para acoplá-la à micropipeta.',                                     item: 'rack',      alvo: 'rack' },
  { id: 1, titulo: 'Aspirar Amostra (10 mL)',           descricao: 'Arraste a micropipeta até o frasco de amostra para aspirar o volume.',                                    item: 'pipeta',    alvo: 'amostra' },
  { id: 2, titulo: 'Transferir para a Cubeta',          descricao: 'Arraste a micropipeta carregada até a cubeta de vidro quadrada 25 mm.',                                    item: 'pipeta',    alvo: 'cubeta' },
  { id: 3, titulo: 'Adicionar Molybdate 3',             descricao: 'Arraste o frasco Molybdate 3 até a cubeta. Forma-se o complexo silicomolibdato (tom amarelo).',             item: 'molibdato', alvo: 'cubeta' },
  { id: 4, titulo: 'Adicionar Citric Acid',             descricao: 'Arraste o frasco Citric Acid até a cubeta. Elimina interferência de fosfatos.',                            item: 'citrico',   alvo: 'cubeta' },
  { id: 5, titulo: 'Adicionar Amino Acid F',            descricao: 'Arraste Amino Acid F até a cubeta. A cor azul heteropoli se desenvolve.',                                  item: 'amino',     alvo: 'cubeta' },
  { id: 6, titulo: 'Aguardar Desenvolvimento da Cor',   descricao: 'Aguarde o desenvolvimento completo da coloração azul na cubeta.',                                          item: null,        alvo: null },
  { id: 7, titulo: 'Inserir Cubeta no Fotômetro',       descricao: 'Arraste a cubeta azul até o compartimento de amostra do fotômetro.',                                       item: 'cubeta',    alvo: 'fotometro' },
  { id: 8, titulo: 'Realizar Leitura (λ = 810 nm)',     descricao: 'Clique no fotômetro para iniciar a leitura fotométrica. Resultado em mg/L SiO₂.',                          item: null,        alvo: 'fotometro' },
];
 
/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL — SIMULADOR DE SÍLICA BAIXA
═══════════════════════════════════════════════════════════ */
const SimuladorSilicaBaixa = () => {
  injectCSS();
 
  /* ── Estado do jogo ───────────────────────────────── */
  const [etapaAtual,        setEtapaAtual]        = useState(0);
  const [pontuacao,         setPontuacao]          = useState(0);
  const [concluido,         setConcluido]          = useState(false);
  const [mostrarParabens,   setMostrarParabens]    = useState(false);
  const [mostrarErro,       setMostrarErro]        = useState(false);
  const [msgErro,           setMsgErro]            = useState('');
  const [itemSegurado,      setItemSegurado]       = useState(null);
 
  /* ── Micropipeta ──────────────────────────────────── */
  const [pipetaTemPonteira, setPipetaTemPonteira]  = useState(false);
  const [pipetaCheia,       setPipetaCheia]        = useState(false);
  const [nivelPipeta,       setNivelPipeta]        = useState(0);
  const [corPipeta,         setCorPipeta]          = useState('rgba(200,228,248,.8)');
 
  /* ── Cubeta ───────────────────────────────────────── */
  const [nivelCubeta,       setNivelCubeta]        = useState(0);
  const [corCubeta,         setCorCubeta]          = useState('rgba(220,235,255,.08)');
 
  /* ── Fotômetro ────────────────────────────────────── */
  const [cubetaNoFotometro, setCubetaNoFotometro]  = useState(false);
  const [fotometroLendo,    setFotometroLendo]     = useState(false);
  const [resultado,         setResultado]          = useState(null);
 
  /* ── Reagentes ────────────────────────────────────── */
  const [nivelAmostra,      setNivelAmostra]       = useState(82);
  const [molibdatoUsado,    setMolibdatoUsado]     = useState(false);
  const [citricoUsado,      setCitricoUsado]       = useState(false);
  const [aminoUsado,        setAminoUsado]         = useState(false);
  const [corDesenvolvida,   setCorDesenvolvida]    = useState(false);
 
 
  /* ── Helpers ──────────────────────────────────────── */
  const proximaEtapa = () => setEtapaAtual(e => {
    if (e >= etapas.length - 1) { setConcluido(true); return e; }
    return e + 1;
  });
 
  const celebrarAcerto = (pts = 100) => {
    setPontuacao(p => p + pts);
    setMostrarParabens(true);
    setTimeout(() => setMostrarParabens(false), 1500);
  };
 
  const mostrarErroAcao = (msg = 'Ação incorreta para esta etapa.') => {
    setMsgErro(msg);
    setMostrarErro(true);
    setTimeout(() => setMostrarErro(false), 1800);
  };
 
 
  /* ── Animação de preenchimento da pipeta ───────────── */
  useEffect(() => {
    if (!pipetaCheia) return;
    let v = 0;
    const id = setInterval(() => { v += 8; setNivelPipeta(Math.min(v, 100)); if (v >= 100) clearInterval(id); }, 60);
    return () => clearInterval(id);
  }, [pipetaCheia]);
 
  /* ── Auto-advance etapa 6 (desenvolvimento cor) ───── */
  useEffect(() => {
    if (etapaAtual !== 6) return;
    const id = setTimeout(() => {
      setCorDesenvolvida(true);
      celebrarAcerto(100);
      proximaEtapa();
    }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);
 
 
  /* ── Drag handlers ─────────────────────────────────── */
  const handleDragStart = (item, e) => {
    const et = etapas[etapaAtual];
    if (et && et.item && et.item !== item) return;
    setItemSegurado(item);
    e.dataTransfer.setData('text/plain', item);
  };
  const handleDragEnd = () => setItemSegurado(null);
  const handleDragOver = e => e.preventDefault();
 
  const handleDrop = (alvo, e) => {
    e.preventDefault();
    e.stopPropagation();
    const item = e.dataTransfer.getData('text/plain') || itemSegurado;
    if (!item) return;
    setItemSegurado(null);
 
    const et = etapas[etapaAtual];
    if (et && et.item === item && et.alvo !== alvo) {
      mostrarErroAcao(`Este item não deve ser usado em "${alvo}" agora.`);
      return;
    }
 
    // STEP 1 — pipeta → amostra
    if (item === 'pipeta' && alvo === 'amostra' && etapaAtual === 1 && pipetaTemPonteira && !pipetaCheia) {
      setCorPipeta('rgba(200,228,248,.85)');
      setPipetaCheia(true);
      setNivelAmostra(n => Math.max(n - 18, 0));
      celebrarAcerto();
      proximaEtapa();
      return;
    }
    // STEP 2 — pipeta → cubeta
    if (item === 'pipeta' && alvo === 'cubeta' && etapaAtual === 2 && pipetaCheia) {
      setNivelCubeta(55);
      setCorCubeta('rgba(200,228,248,.52)');
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }
    // STEP 3 — molibdato → cubeta
    if (item === 'molibdato' && alvo === 'cubeta' && etapaAtual === 3) {
      setNivelCubeta(65);
      setCorCubeta('rgba(235,212,55,.68)');
      setMolibdatoUsado(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }
    // STEP 4 — citrico → cubeta
    if (item === 'citrico' && alvo === 'cubeta' && etapaAtual === 4) {
      setNivelCubeta(75);
      setCorCubeta('rgba(225,205,48,.60)');
      setCitricoUsado(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }
    // STEP 5 — amino → cubeta → triggers step 6 auto
    if (item === 'amino' && alvo === 'cubeta' && etapaAtual === 5) {
      setNivelCubeta(85);
      setCorCubeta('rgba(25,90,198,.80)');
      setAminoUsado(true);
      celebrarAcerto(150);
      proximaEtapa();  // goes to step 6 auto-advance
      return;
    }
    // STEP 7 — cubeta → fotometro
    if (item === 'cubeta' && alvo === 'fotometro' && etapaAtual === 7) {
      setCubetaNoFotometro(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }
  };
 
  /* ── Ponteira P1000 ────────────────────────────────── */
  const handlePickTip = () => {
    if (etapaAtual !== 0 || pipetaTemPonteira) return;
    setPipetaTemPonteira(true);
    celebrarAcerto();
    proximaEtapa();
  };
 
  /* ── Click fotômetro ───────────────────────────────── */
  const handleClickFotometro = () => {
    if (etapaAtual !== 8 || !cubetaNoFotometro || fotometroLendo || resultado) return;
    setFotometroLendo(true);
    setTimeout(() => {
      const val = (Math.random() * 1.4 + 0.05).toFixed(2);
      setResultado(val);
      setFotometroLendo(false);
      celebrarAcerto(200);
      setTimeout(() => setConcluido(true), 1500);
    }, 2800);
  };
 
 
  /* ── Helpers de classe ─────────────────────────────── */
  const itemMap = { 1: 'pipeta', 2: 'pipeta', 3: 'molibdato', 4: 'citrico', 5: 'amino', 7: 'cubeta' };
  const alvoMap = { 0: 'rack', 1: 'amostra', 2: 'cubeta', 3: 'cubeta', 4: 'cubeta', 5: 'cubeta', 7: 'fotometro', 8: 'fotometro' };
  const pulse = id => itemMap[etapaAtual] === id ? 'sp' : '';
  const drop  = id => alvoMap[etapaAtual] === id ? 'st' : '';
 
 
  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)' }}>
 
      {/* ── Parabéns overlay ── */}
      {mostrarParabens && (
        <div style={{ position: 'fixed', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 60, pointerEvents: 'none' }}>
          <div className="spop" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)', color: 'white', padding: '14px 26px', borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,.35)', border: '2px solid rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⭐</span>
            <div><h3 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>Muito bem!</h3><p style={{ fontSize: 12, margin: 0 }}>+100 pontos</p></div>
            <span style={{ fontSize: 20 }}>✅</span>
          </div>
        </div>
      )}
 
      {/* ── Erro overlay ── */}
      {mostrarErro && (
        <div style={{ position: 'fixed', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 70, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#ef4444)', color: 'white', padding: '14px 26px', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,.35)', border: '2px solid rgba(255,255,255,.85)', textAlign: 'center', minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Ação incorreta</h3>
                <p style={{ fontSize: 12, margin: 0 }}>{msgErro}</p>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* ── Modal conclusão ── */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div className="spop" style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #00e5ff', borderRadius: 22, padding: '36px 48px', textAlign: 'center', color: 'white', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,.75)' }}>
            <div style={{ fontSize: 60 }}>🔷</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#00e5ff', margin: '10px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 18px' }}>Sílica Baixa · Método Azul Heteropoli · HACH 8185</p>
            <div style={{ background: 'rgba(0,229,255,.08)', border: '1px solid rgba(0,229,255,.3)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Resultado fotométrico</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#00ff88', fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{resultado}</div>
              <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>mg/L SiO₂</div>
            </div>
            <div style={{ background: parseFloat(resultado) <= 1.60 ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${parseFloat(resultado) <= 1.60 ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 11, padding: '9px 18px', marginBottom: 18, fontSize: 11.5, color: parseFloat(resultado) <= 1.60 ? '#22c55e' : '#f87171' }}>
              {parseFloat(resultado) <= 1.60
                ? '✅ Sílica baixa dentro da faixa esperada (≤ 1.60 mg/L)'
                : '⚠️ Atenção: sílica acima da faixa esperada'}
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 18 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🔄 Recomeçar</button>
          </div>
        </div>
      )}
 
 
      {/* ════════════════════════════════════════════════
         BANCADA DO LABORATÓRIO
      ════════════════════════════════════════════════ */}
      <main style={{ flex: 1, padding: '20px 18px 36px', overflowX: 'auto', overflowY: 'auto', minWidth: 0 }}>
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,.6)', minWidth: 700 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 15, fontWeight: 900, marginBottom: 18, letterSpacing: .8 }}>
            🔷 Bancada — Análise de Sílica Baixa (Método Azul Heteropoli)
          </h2>
 
          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '22px 18px', border: '4px solid #292524', minHeight: 520, boxShadow: 'inset 0 6px 28px rgba(0,0,0,.4)', position: 'relative' }}>
 
            {/* ══ ROW 1: Fotômetro + Pipeta + Rack ══ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 30, flexWrap: 'wrap', justifyContent: 'space-around' }}>
 
              {/* FOTÔMETRO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                onDrop={e => handleDrop('fotometro', e)} onDragOver={handleDragOver}>
                <div className={drop('fotometro')} style={{ background: 'rgba(0,0,0,.22)', borderRadius: 13, padding: '10px 12px', cursor: etapaAtual === 8 && cubetaNoFotometro && !fotometroLendo && !resultado ? 'pointer' : 'default' }} onClick={handleClickFotometro}>
                  <FotometroSVG cubetaDentro={cubetaNoFotometro} lendo={fotometroLendo} resultado={resultado} />
                  {etapaAtual === 8 && cubetaNoFotometro && !fotometroLendo && !resultado && (
                    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>🔵 Clique para leitura!</div>
                  )}
                  {fotometroLendo && <div className="sblink" style={{ textAlign: 'center', fontSize: 8.5, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>⚡ Analisando...</div>}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Fotômetro HACH DR900</span>
              </div>
 
              {/* MICROPIPETA */}
              <div className={`sd ${pulse('pipeta')}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                draggable onDragStart={e => handleDragStart('pipeta', e)} onDragEnd={handleDragEnd}>
                <MicropipetaP1000SVG nivel={nivelPipeta} corLiq={corPipeta} temPonteira={pipetaTemPonteira} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Micropipeta P1000</span>
                {pipetaCheia && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>● Carregada</span>}
                {!pipetaTemPonteira && <span style={{ fontSize: 8, color: '#f87171', fontWeight: 700 }}>Sem ponteira</span>}
              </div>
 
              {/* RACK P1000 */}
              <div className={etapaAtual === 0 ? 'sp' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ background: 'rgba(0,0,0,.2)', borderRadius: 11, padding: 8 }}>
                  <RackPonteiras disponivel={!pipetaTemPonteira} onTake={handlePickTip} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Rack de Ponteiras P1000</span>
                {etapaAtual === 0 && <span style={{ fontSize: 8, color: '#22d3ee', fontWeight: 700 }}>↑ Clique na ponteira</span>}
              </div>
            </div>
 
            {/* ══ ROW 2: Reagents + Cuvette + Sample + Beakers ══ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', justifyContent: 'space-around' }}>
 
              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                onDrop={e => handleDrop('amostra', e)} onDragOver={handleDragOver}>
                <div className={`sd ${pulse('amostra')} ${drop('amostra')}`} style={{ borderRadius: 11 }}
                  draggable={false}>
                  <FrascoReagente cor="rgba(140,200,240,.78)" label="Amostra" sub="Água" nivel={nivelAmostra} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
              </div>
 
              {/* MOLYBDATE 3 */}
              <div className={`sd ${pulse('molibdato')}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                draggable onDragStart={e => handleDragStart('molibdato', e)} onDragEnd={handleDragEnd}>
                <FrascoReagente cor="rgba(220,160,40,.85)" label="Molybdate 3" nivel={molibdatoUsado ? 55 : 72} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Molybdate 3</span>
                {molibdatoUsado && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
              </div>
 
              {/* CITRIC ACID */}
              <div className={`sd ${pulse('citrico')}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                draggable onDragStart={e => handleDragStart('citrico', e)} onDragEnd={handleDragEnd}>
                <FrascoReagente cor="rgba(100,205,80,.85)" label="Citric Acid" nivel={citricoUsado ? 62 : 78} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Citric Acid</span>
                {citricoUsado && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
              </div>
 
              {/* AMINO ACID F */}
              <div className={`sd ${pulse('amino')}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                draggable onDragStart={e => handleDragStart('amino', e)} onDragEnd={handleDragEnd}>
                <FrascoReagente cor="rgba(40,80,220,.85)" label="Amino Acid" sub="F" nivel={aminoUsado ? 60 : 75} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amino Acid F</span>
                {aminoUsado && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ Adicionado</span>}
              </div>
 
              {/* CUBETA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                onDrop={e => handleDrop('cubeta', e)} onDragOver={handleDragOver}>
                <div className={`sd ${pulse('cubeta')} ${drop('cubeta')}`}
                  style={{ background: 'rgba(0,0,0,.15)', borderRadius: 11, padding: '4px 2px' }}
                  draggable={etapaAtual === 7 && !cubetaNoFotometro}
                  onDragStart={e => handleDragStart('cubeta', e)} onDragEnd={handleDragEnd}>
                  {!cubetaNoFotometro
                    ? <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="main" />
                    : <div style={{ width: 80, height: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <span style={{ fontSize: 18 }}>✅</span>
                        <span style={{ fontSize: 8.5, color: '#22c55e', fontWeight: 700 }}>No fotômetro</span>
                      </div>
                  }
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Cubeta 25 mm / 10 mL</span>
                {nivelCubeta > 0 && !cubetaNoFotometro && (
                  <span style={{ fontSize: 8, color: aminoUsado ? '#60a5fa' : '#fbbf24', fontWeight: 700 }}>
                    {aminoUsado ? '🔵 Azul heteropoli' : molibdatoUsado ? '🟡 Silicomolibdato' : '⚗️ Amostra'}
                  </span>
                )}
                {etapaAtual === 6 && !corDesenvolvida && (
                  <span className="sblink" style={{ fontSize: 8, color: '#60a5fa', fontWeight: 700 }}>⏳ Desenvolvendo cor...</span>
                )}
              </div>
 
              {/* COPO A */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <CopoTransparenteSVG nivel={10} cor="rgba(180,220,255,.32)" id="ga" />
                <span style={{ fontSize: 9, color: '#a3a3a3', fontWeight: 600 }}>Copo A</span>
              </div>
 
              {/* COPO B */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <CopoTransparenteSVG nivel={6} cor="rgba(200,230,215,.32)" id="gb" />
                <span style={{ fontSize: 9, color: '#a3a3a3', fontWeight: 600 }}>Copo B</span>
              </div>
            </div>
 
            {/* ── Resultado na bancada ── */}
            {resultado && (
              <div className="spop" style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg,rgba(14,30,60,.96),rgba(8,20,40,.96))', border: '2px solid #00e5ff', borderRadius: 14, padding: '12px 18px', textAlign: 'center', color: 'white', boxShadow: '0 8px 32px rgba(0,229,255,.28)' }}>
                <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>SiO₂ — RESULTADO</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: '#00ff88', fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{resultado}</div>
                <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>mg/L SiO₂</div>
              </div>
            )}
 
          </div>
        </div>
 
        {/* ── Tip bar ── */}
        <div style={{ marginTop: 13, background: 'rgba(14,165,233,.09)', border: '1px solid rgba(14,165,233,.26)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
          <p style={{ color: '#7dd3fc', fontWeight: 600, fontSize: 12, margin: 0 }}>
            💡 Arraste os itens piscando para os locais destacados em azul na bancada
          </p>
        </div>
      </main>
 
   
    </div>
  );
};
 
export default SimuladorSilicaBaixa;
