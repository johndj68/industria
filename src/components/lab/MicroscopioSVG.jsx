/**
 * MicroscopioSVG.jsx — SVG Microscópio Óptico Realista (Olympus CX23)
 *
 * Props:
 *   ativo  — boolean; acende a luz e anima o feixe
 *   lamina — boolean; exibe lâmina na platina
 *   foco   — 0–100; progresso da barra de foco lateral
 */
import React from 'react';

const MicroscopioSVG = ({ ativo, lamina = false, foco = 50 }) => {
  const CX        = 95;
  const objCores  = ['#78909c', '#5c6bc0', '#26a69a', '#ef5350'];
  const objLabels = ['4×', '10×', '40×', '100×'];
  const objLens   = [14, 20, 28, 36];
  const activeObj = 2;

  return (
    <svg width="190" height="285" viewBox="0 0 190 285">
      <defs>
        <linearGradient id="mBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2e3b4e" />
          <stop offset="100%" stopColor="#18253a" />
        </linearGradient>
        <linearGradient id="mArm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1e2a38" />
          <stop offset="45%"  stopColor="#2e3f54" />
          <stop offset="100%" stopColor="#1e2a38" />
        </linearGradient>
        <linearGradient id="mTube" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#18253a" />
          <stop offset="50%"  stopColor="#243550" />
          <stop offset="100%" stopColor="#18253a" />
        </linearGradient>
        <linearGradient id="mKnob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#546e7a" />
          <stop offset="100%" stopColor="#263238" />
        </linearGradient>
        <radialGradient id="eyeGlow" cx="40%" cy="38%">
          <stop offset="0%"   stopColor="#1a3a5f" />
          <stop offset="100%" stopColor="#050d1a" />
        </radialGradient>
        <filter id="mShadow">
          <feDropShadow dx="2" dy="4" stdDeviation="5"
            floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#mShadow)">
        <ellipse cx={CX} cy="264" rx="72" ry="16"
          fill="url(#mBase)" stroke="#0d1117" strokeWidth="2" />
        <ellipse cx={CX} cy="261" rx="66" ry="12"
          fill="#263238" stroke="#37474f" strokeWidth="1" />
      </g>

      <ellipse cx={CX} cy="256" rx="16" ry="6"
        fill={ativo ? 'rgba(255,255,180,0.3)' : 'rgba(255,255,180,0.08)'} />
      <ellipse cx={CX} cy="256" rx="9" ry="4"
        fill={ativo ? 'rgba(255,255,180,0.55)' : 'rgba(255,255,180,0.12)'} />
      {ativo && (
        <ellipse cx={CX} cy="256" rx="5" ry="2.5"
          fill="rgba(255,255,200,0.9)" />
      )}

      <rect x={CX - 12} y="78" width="24" height="180" rx="8"
        fill="url(#mArm)" stroke="#18253a" strokeWidth="1.8" />
      <rect x={CX - 8} y="82" width="6" height="174" rx="3"
        fill="rgba(255,255,255,0.05)" />

      <rect x={CX - 12} y="232" width="24" height="20" rx="4"
        fill="#263238" stroke="#37474f" strokeWidth="1" />
      <ellipse cx={CX} cy="232" rx="10" ry="4" fill="#1a253a" />
      <ellipse cx={CX} cy="252" rx="8"  ry="3" fill="#1a253a" />

      <rect x="24" y="142" width="142" height="20" rx="5"
        fill="#263238" stroke="#37474f" strokeWidth="1.6" />

      <rect x={CX - 20} y="143" width="40" height="18" rx="3"
        fill={lamina ? 'rgba(180,220,255,0.25)' : 'rgba(180,220,255,0.10)'}
        stroke={lamina ? 'rgba(140,190,240,0.6)' : 'rgba(140,190,240,0.25)'} strokeWidth="1" />

      <rect x={CX - 32} y="140" width="10" height="7" rx="2"
        fill="#546e7a" stroke="#37474f" strokeWidth="0.8" />
      <rect x={CX + 22} y="140" width="10" height="7" rx="2"
        fill="#546e7a" stroke="#37474f" strokeWidth="0.8" />

      {lamina && (
        <g>
          <rect x={CX - 22} y="143" width="44" height="16" rx="2"
            fill="rgba(200,235,255,0.30)"
            stroke="rgba(140,190,240,0.7)" strokeWidth="1" />
          {[0, 1, 2, 3, 4].map(i => (
            <line key={`lh${i}`}
              x1={CX - 18} y1={145 + i * 3}
              x2={CX + 18} y2={145 + i * 3}
              stroke="rgba(0,80,200,0.4)" strokeWidth="0.4" />
          ))}
          {[0, 1, 2, 3, 4,].map(i => (
            <line key={`lv${i}`}
              x1={CX - 18 + i * 9} y1="145"
              x2={CX - 18 + i * 9} y2="158"
              stroke="rgba(0,80,200,0.4)" strokeWidth="0.4" />
          ))}
        </g>
      )}

      <circle cx="26"  cy="152" r="8" fill="url(#mKnob)" stroke="#37474f" strokeWidth="1" />
      <circle cx="26"  cy="152" r="5" fill="#1e293b" />
      <circle cx="164" cy="152" r="8" fill="url(#mKnob)" stroke="#37474f" strokeWidth="1" />
      <circle cx="164" cy="152" r="5" fill="#1e293b" />

      <ellipse cx="22" cy="184" rx="11" ry="18"
        fill="url(#mKnob)" stroke="#546e7a" strokeWidth="1.5" />
      <ellipse cx="22" cy="184" rx="7" ry="12" fill="#1e293b" />
      {[-6, -3, 0, 3, 6].map(dy => (
        <line key={dy} x1="14" y1={184 + dy} x2="30" y2={184 + dy}
          stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
      ))}

      <ellipse cx="22" cy="202" rx="8" ry="11"
        fill="#37474f" stroke="#546e7a" strokeWidth="1" />
      <ellipse cx="22" cy="202" rx="5" ry="7" fill="#1e293b" />


      <ellipse cx="168" cy="184" rx="11" ry="18"
        fill="url(#mKnob)" stroke="#546e7a" strokeWidth="1.5" />
      <ellipse cx="168" cy="184" rx="7" ry="12" fill="#1e293b" />

      <ellipse cx="168" cy="202" rx="8" ry="11"
        fill="#37474f" stroke="#546e7a" strokeWidth="1" />
      <ellipse cx="168" cy="202" rx="5" ry="7" fill="#1e293b" />

      <rect x="34" y="174" width="5" height="32" rx="2.5"
        fill="#0d1117" stroke="#37474f" strokeWidth="0.8" />
      <rect x="34" y={174 + 32 * (1 - foco / 100)} width="5" height={32 * foco / 100} rx="2.5"
        fill="#00bcd4" />

      <circle cx={CX} cy="135" r="22" fill="#1e2d3d" stroke="#37474f" strokeWidth="1.8" />
      <circle cx={CX} cy="135" r="16" fill="#263238" stroke="#37474f" strokeWidth="1" />
      <circle cx={CX} cy="135" r="6"  fill="#1a1a2a" />

      {[0, 1, 2, 3].map(i => {
        const ang    = (i * 90 - 30) * Math.PI / 180;
        const ox     = CX + Math.cos(ang) * 14;
        const oy     = 135 + Math.sin(ang) * 14;
        const active = i === activeObj;
        const len    = objLens[i];
        const eaX    = active ? ox : ox + Math.cos(ang) * 4;
        const eaY    = active ? oy + len : oy + Math.sin(ang) * 4 + 8;

        return (
          <g key={i}>
            <circle cx={ox} cy={oy} r={active ? 5.5 : 4}
              fill={active ? objCores[i] : '#37474f'}
              stroke={active ? 'rgba(255,255,255,0.3)' : '#263238'} strokeWidth="1" />
            <line x1={ox} y1={oy} x2={eaX} y2={eaY}
              stroke={active ? objCores[i] : '#37474f'}
              strokeWidth={active ? 5.5 : 4} strokeLinecap="round" />
            {active && (
              <>
                <circle cx={eaX} cy={eaY} r="3"
                  fill={objCores[i]} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                <text x={ox + 8} y={oy - 4} fontSize="6"
                  fill={objCores[i]} fontFamily="monospace" fontWeight="700">
                  {objLabels[i]}
                </text>
              </>
            )}
          </g>
        );
      })}

      <rect x={CX - 12} y="30" width="24" height="72" rx="6"
        fill="url(#mTube)" stroke="#18253a" strokeWidth="1.6" />
      <rect x={CX - 8} y="33" width="6" height="66" rx="3"
        fill="rgba(255,255,255,0.065)" />

      <path d={`M ${CX} 76 Q ${CX - 5} 90 ${CX} 110`}
        stroke="#1e2a38" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d={`M ${CX} 76 Q ${CX - 5} 90 ${CX} 110`}
        stroke="#263238" strokeWidth="14" strokeLinecap="round" fill="none" />

      <rect x={CX - 16} y="8" width="32" height="24" rx="7"
        fill="#18253a" stroke="#37474f" strokeWidth="1.6" />
      <ellipse cx={CX} cy="8" rx="11" ry="5.5"
        fill="#263238" stroke="#546e7a" strokeWidth="1.3" />
      <ellipse cx={CX} cy="8" rx="7.5" ry="3.8"
        fill="url(#eyeGlow)" />
      <ellipse cx={CX - 3} cy="6.5" rx="2.5" ry="1.8"
        fill="rgba(100,180,255,0.22)" />
      <ellipse cx={CX + 4} cy="9"   rx="1.2" ry="0.8"
        fill="rgba(100,180,255,0.14)" />
      <rect x={CX - 14} y="18" width="28" height="6" rx="3"
        fill="#263238" stroke="#37474f" strokeWidth="0.9" />
      {[CX - 8, CX - 3, CX + 2, CX + 7].map((xx, i) => (
        <line key={i} x1={xx} y1="18" x2={xx} y2="24"
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}

      {ativo && (
        <ellipse cx={CX} cy="200" rx="5" ry="55"
          fill="rgba(255,255,200,0.05)" className="focus-beam" />
      )}

      <rect x={CX + 20} y="95" width="48" height="20" rx="4"
        fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <text x={CX + 44} y="103.5" textAnchor="middle" fontSize="5.5"
        fill="#60a5fa" fontWeight="700" fontFamily="monospace">OLYMPUS</text>
      <text x={CX + 44} y="111.5" textAnchor="middle" fontSize="5"
        fill="#64748b" fontFamily="sans-serif">CX23</text>

      {ativo && (
        <g>
          <circle cx="158" cy="30" r="4" fill="#22c55e" />
          <circle cx="158" cy="30" r="6" fill="none"
            stroke="rgba(34,197,94,0.3)" strokeWidth="2" className="focus-beam" />
          <text x="153" y="44" textAnchor="middle" fontSize="5.5"
            fill="#4ade80" fontFamily="sans-serif">ON</text>
        </g>
      )}
    </svg>
  );
};

export default MicroscopioSVG;
