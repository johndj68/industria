/**
 * ProvetaSVG.jsx — Proveta Graduada 50 mL
 *
 * Props:
 *   nivel — 0–100, nível de líquido (%)
 */
import React from 'react';

const ProvetaSVG = ({ nivel = 0 }) => {
  const CX = 32, CW = 18, WALL = 3.5;
  const OW = CW + WALL * 2;
  const gL = CX - CW / 2 - WALL;
  const gR = CX + CW / 2 + WALL;
  const BT = 18, BB = 132, BH = BB - BT;
  const lH = (nivel / 100) * BH;
  const lY = BB - lH;
  const marks = [];
  for (let v = 5; v <= 50; v += 5)
    marks.push({ v, ym: BB - (v / 50) * BH, major: v % 10 === 0 || v === 25 });

  return (
    <svg width="85" height="170" viewBox="0 0 85 170">
      <defs>
        <clipPath id="apvClip"><rect x={CX - CW / 2} y={BT} width={CW} height={BH} /></clipPath>
        <linearGradient id="apvGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(185,225,255,0.54)" />
          <stop offset="20%"  stopColor="rgba(215,238,255,0.14)" />
          <stop offset="68%"  stopColor="rgba(210,235,255,0.07)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.42)" />
        </linearGradient>
        <linearGradient id="apvLiq" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(90,160,225,0.70)" />
          <stop offset="45%"  stopColor="rgba(140,205,252,0.82)" />
          <stop offset="100%" stopColor="rgba(88,155,218,0.62)" />
        </linearGradient>
        <linearGradient id="apvBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(178,222,255,0.46)" />
          <stop offset="100%" stopColor="rgba(132,196,246,0.28)" />
        </linearGradient>
      </defs>
      <ellipse cx={CX} cy={166} rx={21} ry={4} fill="rgba(0,0,0,0.16)" />
      <path d={`M${CX-21},162 L${CX+21},162 L${CX+19},153 L${CX-19},153 Z`}
        fill="url(#apvBase)" stroke="#80bcd8" strokeWidth="1.3" />
      <ellipse cx={CX} cy={162} rx={21} ry={4.5} fill="rgba(142,203,248,0.32)" stroke="#78b4d0" strokeWidth="1.3" />
      <ellipse cx={CX} cy={153} rx={19} ry={3.8} fill="rgba(185,228,255,0.46)" stroke="#88c0d8" strokeWidth="1.1" />
      <path d={`M${CX-19},153 L${CX+19},153 L${gR},${BB} L${gL},${BB} Z`}
        fill="rgba(162,215,255,0.30)" stroke="#88bfd5" strokeWidth="1.2" />
      <g clipPath="url(#apvClip)">
        {nivel > 0 && (
          <>
            <rect x={CX - CW / 2} y={lY} width={CW} height={lH} fill="url(#apvLiq)" />
            <path d={`M${CX - CW/2 + 0.5},${lY} Q${CX},${lY + 6} ${CX + CW/2 - 0.5},${lY}`}
              fill="rgba(95,170,235,0.34)" stroke="rgba(62,132,208,0.65)" strokeWidth="0.9" />
            {lH > 14 && <rect x={CX - CW/2 + 1.5} y={lY + 8} width={3} height={lH - 13} rx="1.5" fill="rgba(255,255,255,0.22)" />}
          </>
        )}
      </g>
      <rect x={gL} y={BT} width={OW} height={BB - BT + 4} rx="2" fill="url(#apvGlass)" stroke="#8ac4dc" strokeWidth="1.8" />
      <rect x={CX - CW/2} y={BT + 1} width={CW} height={BB - BT - 1} fill="none" stroke="rgba(100,175,222,0.22)" strokeWidth="0.7" />
      <rect x={gL + 1.5} y={BT + 12} width={2.5} height={BB - BT - 22} rx="1.2" fill="rgba(255,255,255,0.44)" />
      <path d={`M${gL - 2},${BT} L${gL - 5},${BT - 11} L${gR + 5},${BT - 11} L${gR + 2},${BT}`}
        fill="rgba(168,218,255,0.38)" stroke="#8ac4dc" strokeWidth="1.5" />
      <ellipse cx={CX} cy={BT - 11} rx={OW / 2 + 4.5} ry={4} fill="rgba(188,230,255,0.42)" stroke="#8ac4dc" strokeWidth="1.2" />
      {marks.map(({ v, ym, major }) =>
        major ? (
          <g key={v}>
            <line x1={gR} y1={ym} x2={gR + 10} y2={ym} stroke="rgba(6,32,85,0.72)" strokeWidth="1.1" />
            <text x={gR + 12} y={ym + 3.5} fontSize="7.5" fill="rgba(6,32,85,0.78)" fontFamily="monospace" fontWeight="700">{v}</text>
          </g>
        ) : (
          <line key={v} x1={gR} y1={ym} x2={gR + 5.5} y2={ym} stroke="rgba(6,32,85,0.40)" strokeWidth="0.8" />
        )
      )}
      <text x={gR + 12} y={BT - 4} fontSize="6.5" fill="rgba(6,32,85,0.60)" fontFamily="monospace" fontWeight="600">mL</text>
    </svg>
  );
};

export default ProvetaSVG;
