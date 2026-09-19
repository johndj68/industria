/**
 * FotometroSVG.jsx — Fotômetro HACH DR900
 *
 * Props:
 *   cubetaDentro — cubeta inserida no compartimento
 *   zerando      — animação de zeragem em curso
 *   zerado       — branco de referência OK
 *   lendo        — animação de leitura em curso
 *   resultado    — string com resultado (ex: "0.42"), ou null
 *   zerAtivo     — botão ZERO clicável
 *   lerAtivo     — botão READ clicável
 *   onZero       — callback ao clicar ZERO
 *   onLer        — callback ao clicar READ
 */
import React from 'react';

const FotometroSVG = ({
  cubetaDentro = false,
  zerando = false,
  zerado = false,
  lendo = false,
  resultado = null,
  zerAtivo = false,
  lerAtivo = false,
  onZero,
  onLer,
}) => (
  <svg width="240" height="175" viewBox="0 0 240 175">
    <defs>
      <linearGradient id="fBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#2c3e55" />
        <stop offset="100%" stopColor="#1a2535" />
      </linearGradient>
      <linearGradient id="fScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001830" />
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
    <circle cx="216" cy="22" r="5"
      fill={resultado ? '#22c55e' : (lendo || zerando) ? '#f59e0b' : '#3b82f6'}
      stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    {(lendo || zerando || resultado) && (
      <circle cx="216" cy="22" r="9" fill="none"
        stroke={resultado ? 'rgba(34,197,94,0.38)' : 'rgba(245,158,11,0.38)'}
        strokeWidth="2" />
    )}
    <rect x="14" y="38" width="148" height="72" rx="5" fill="url(#fScr)" stroke="#0ea5e9" strokeWidth="1.2" />
    <rect x="16" y="40" width="144" height="68" rx="4" fill="rgba(0,40,80,0.4)" />
    <text x="88" y="56" textAnchor="middle" fontSize="7" fill="#2a6a9a" fontFamily="monospace">SILICA LOW · 810 nm</text>
    <line x1="22" y1="60" x2="154" y2="60" stroke="rgba(14,165,233,0.22)" strokeWidth="0.8" />
    {resultado ? (
      <>
        <text x="88" y="81" textAnchor="middle" fontSize="26" fill="#00ff88" fontFamily="monospace" fontWeight="700">{resultado}</text>
        <text x="88" y="96" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">mg/L SiO₂</text>
        <text x="88" y="105" textAnchor="middle" fontSize="6" fill="#16a34a" fontFamily="sans-serif">✓ Leitura concluída</text>
      </>
    ) : lendo ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="11" fill="#fbbf24" fontFamily="monospace">Reading...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="3s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Analisando amostra...</text>
      </>
    ) : zerando ? (
      <>
        <text x="88" y="78" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="monospace">Zerando...</text>
        <rect x="28" y="90" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="28" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.6)">
          <animate attributeName="width" from="0" to="120" dur="2s" fill="freeze" />
        </rect>
        <text x="88" y="103" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Zerando com branco...</text>
      </>
    ) : zerado ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
        <text x="88" y="91" textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="sans-serif">Branco de referência OK</text>
        <text x="88" y="104" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Insira amostra e pressione READ</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="88" y="91" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="88" y="104" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Pressione ZERO ou READ</text>
      </>
    ) : (
      <>
        <text x="88" y="76" textAnchor="middle" fontSize="10" fill="#4a7a9a" fontFamily="monospace">STANDBY</text>
        <text x="88" y="92" textAnchor="middle" fontSize="7.5" fill="#3a5a6a" fontFamily="sans-serif">Aguardando cubeta...</text>
      </>
    )}
    <rect x="172" y="38" width="56" height="72" rx="5" fill="#0a1525"
      stroke={cubetaDentro ? '#22c55e' : '#2a3a52'} strokeWidth="1.5" />
    <text x="200" y="53" textAnchor="middle" fontSize="5.5" fill="#3a5a7a" fontFamily="monospace">SAMPLE</text>
    {cubetaDentro ? (
      <g>
        <rect x="182" y="60" width="36" height="46" rx="2"
          fill="rgba(25,90,198,0.72)" stroke="rgba(90,150,220,0.8)" strokeWidth="1" />
        <rect x="184" y="62" width="6" height="38" fill="rgba(255,255,255,0.16)" />
        <rect x="166" y="78" width="52" height="8" rx="3"
          fill={resultado ? 'rgba(34,197,94,0.15)' : 'rgba(14,165,233,0.1)'} />
      </g>
    ) : (
      <rect x="182" y="60" width="36" height="46" rx="2"
        fill="rgba(5,12,25,0.6)" stroke="#1a2535" strokeWidth="0.8" strokeDasharray="4,2" />
    )}
    <circle cx="168" cy="84" r="4"
      fill={cubetaDentro ? 'rgba(14,165,233,0.8)' : 'rgba(14,165,233,0.22)'}
      stroke="rgba(14,165,233,0.35)" strokeWidth="1" />
    {['ON', 'ZERO', 'READ', 'MENU'].map((lbl, i) => {
      const isZ = lbl === 'ZERO', isR = lbl === 'READ';
      const active = (isZ && zerAtivo) || (isR && lerAtivo);
      const fn = isZ ? onZero : isR ? onLer : undefined;
      return (
        <g key={lbl} onClick={fn} style={{ cursor: active ? 'pointer' : 'default' }}>
          <rect x={18 + i * 36} y="126" width="32" height="14" rx="4"
            fill={active ? '#0f2a48' : '#0f1e30'}
            stroke={active ? '#22d3ee' : '#1e3a5f'}
            strokeWidth={active ? 1.8 : 1} />
          <text x={34 + i * 36} y="135.5" textAnchor="middle" fontSize="5.5"
            fill={active ? '#22d3ee' : '#60a5fa'} fontFamily="monospace"
            fontWeight={active ? '700' : '400'}>{lbl}</text>
        </g>
      );
    })}
    <text x="120" y="167" textAnchor="middle" fontSize="5.5" fill="#2a4060" fontFamily="sans-serif">
      HACH Method 8185 · Low Range Silica
    </text>
  </svg>
);

export default FotometroSVG;
