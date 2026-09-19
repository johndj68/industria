/**
 * TE088SVG.jsx — Determinador de Açúcares TE-088 (TECNAL)
 *
 * Props:
 *   te088Aquecendo        — aquecimento em andamento
 *   te088Quente           — temperatura atingida
 *   fervendo              — bolhas de fervura visíveis
 *   nivelBuretaDireita    — 0–100, nível da bureta (%)
 *   corBuretaDireita      — cor CSS do reagente na bureta
 *   nivelErlenmeyerTE     — px de líquido no erlenmeyer
 *   corErlenmeyerDireitoFinal — cor CSS do líquido no erlenmeyer
 *   posicaoGotasAzul      — array de posições Y das gotas de azul de metileno
 *   posicaoGotasBureta    — array de posições Y das gotas da bureta
 *   etapaAtual            — etapa atual (controla cursor da bureta)
 *   gotejandoBuretaDireita — titulação em andamento (desabilita novo clique)
 *   onBuretaClick         — callback ao clicar na bureta (etapa 21)
 */
import React from 'react';

const TE088SVG = ({
  te088Aquecendo = false,
  te088Quente = false,
  fervendo = false,
  nivelBuretaDireita = 0,
  corBuretaDireita = '#ffffff',
  nivelErlenmeyerTE = 0,
  corErlenmeyerDireitoFinal = '#3b82f6',
  posicaoGotasAzul = [],
  posicaoGotasBureta = [],
  etapaAtual = 0,
  gotejandoBuretaDireita = false,
  onBuretaClick,
}) => (
  <svg width="100%" height="100%" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid meet">
    <defs>
      {/* Gradientes */}
      <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9ca3af" />
        <stop offset="50%" stopColor="#6b7280" />
        <stop offset="100%" stopColor="#4b5563" />
      </linearGradient>

      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.1" />
      </linearGradient>

      <radialGradient id="displayGlow">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </radialGradient>

      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Corpo Principal - Estrutura Metálica */}
    <g filter="url(#shadow)">
      <rect x="50" y="450" width="300" height="130" rx="8"
            fill="url(#metalGradient)" stroke="#374151" strokeWidth="2"/>

      <rect x="80" y="150" width="240" height="310" rx="6"
            fill="url(#metalGradient)" stroke="#374151" strokeWidth="2"/>

      <rect x="50" y="200" width="30" height="250" rx="4"
            fill="#4b5563" stroke="#374151" strokeWidth="1"/>

      <rect x="320" y="200" width="30" height="250" rx="4"
            fill="#4b5563" stroke="#374151" strokeWidth="1"/>
    </g>

    {/* Caldeira de Vidro Borossilicato (ESQUERDA - vazia) */}
    <g>
      {/* Base da caldeira */}
      <ellipse cx="130" cy="150" rx="45" ry="10"
               fill="#1e293b" stroke="#475569" strokeWidth="2"/>

      {/* Corpo da caldeira */}
      <rect x="85" y="80" width="90" height="70"
            fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2" rx="4"/>

      {/* Brilho do vidro */}
      <rect x="90" y="85" width="15" height="60"
            fill="white" opacity="0.3" rx="2"/>

      {/* Topo da caldeira */}
      <ellipse cx="130" cy="80" rx="45" ry="10"
               fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>

      {/* Tampa superior */}
      <ellipse cx="130" cy="68" rx="25" ry="6"
               fill="#6b7280" stroke="#4b5563" strokeWidth="2"/>
      <rect x="126" y="56" width="8" height="15"
            fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
    </g>

    {/* BURETA (DIREITA) - Sistema de Titulação */}
    <g style={{ cursor: etapaAtual === 21 ? 'pointer' : 'default' }}
      onClick={() => {
        if (etapaAtual === 21 && !gotejandoBuretaDireita && onBuretaClick) {
          onBuretaClick();
        }
      }}>
      {/* Suporte da Bureta */}
      <rect x="360" y="60" width="8" height="180"
            fill="#4b5563" stroke="#374151" strokeWidth="2"/>

      {/* Presilha superior */}
      <rect x="355" y="75" width="18" height="12" rx="2"
            fill="#6b7280" stroke="#374151" strokeWidth="1"/>

      {/* Presilha inferior */}
      <rect x="355" y="150" width="18" height="12" rx="2"
            fill="#6b7280" stroke="#374151" strokeWidth="1"/>

      {/* Corpo da Bureta (tubo de vidro graduado) */}
      <rect x="378" y="70" width="24" height="150"
            fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2" rx="2"/>

      {/* Graduações da bureta */}
      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135].map(y => (
        <line key={y} x1="378" y1={70 + y} x2="385" y2={70 + y}
              stroke="#64748b" strokeWidth="1"/>
      ))}

      {/* Nível do reagente (líquido - cor do Fehling ou amostra) */}
      <rect
            x="379"
            y={205 - (nivelBuretaDireita * 1.35)}
            width="22"
            height={nivelBuretaDireita * 1.35}
            fill={corBuretaDireita}
            opacity="0.6"
          />
      {/* Brilho do vidro da bureta */}
      <rect x="380" y="72" width="6" height="145"
            fill="white" opacity="0.2" rx="1"/>

      {/* Torneira/Válvula de controle */}
      <g>
        <rect x="386" y="218" width="12" height="8"
              fill="#6b7280" stroke="#374151" strokeWidth="1"/>
        <ellipse cx="392" cy="222" rx="8" ry="4"
                 fill="#4b5563" stroke="#374151" strokeWidth="1"/>
      </g>

      {/* Bico da bureta (ponteira) */}
      <path d="M 390 226 L 388 235 L 394 235 Z"
            fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
      {posicaoGotasBureta.map((y, i) => (
        <circle
          key={i}
          cx="385"
          cy={y}
          r="4"
          fill={corBuretaDireita}
        />
      ))}
    </g>

    {/* Erlenmeyer/Cuba de Reação (DIREITA) */}
    <g>
      {/* Corpo do erlenmeyer */}
      <path d="M 350 250 L 340 290 L 340 310 Q 340 320, 350 320 L 430 320 Q 440 320, 440 310 L 440 290 L 430 250 Z"
            fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>

      {/* Gargalo */}
      <rect x="385" y="230" width="20" height="20"
            fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>

      {/* Boca do erlenmeyer */}
      <ellipse cx="395" cy="230" rx="10" ry="3"
               fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>

      {/* Brilho do vidro */}
      <path d="M 352 255 L 348 285 L 348 305"
            stroke="white" strokeWidth="8" opacity="0.2" fill="none"/>

      {fervendo && (
        <>
          {/* ── BOLHAS SUBINDO NO LÍQUIDO ── */}
          {[
            { cx: 362, dur: '1.10s', delay: '0.00s', r: 3.2 },
            { cx: 378, dur: '0.90s', delay: '0.28s', r: 2.6 },
            { cx: 393, dur: '1.30s', delay: '0.55s', r: 4.0 },
            { cx: 368, dur: '0.80s', delay: '0.85s', r: 2.2 },
            { cx: 407, dur: '1.00s', delay: '0.12s', r: 3.5 },
            { cx: 355, dur: '1.20s', delay: '0.42s', r: 2.0 },
            { cx: 400, dur: '0.85s', delay: '0.70s', r: 2.8 },
            { cx: 418, dur: '1.10s', delay: '0.95s', r: 2.4 },
          ].map((b, i) => (
            <circle key={i} cx={b.cx} cy="315" r={b.r} fill="rgba(147,197,253,0)">
              <animate attributeName="cy"      from="315" to="270"       dur={b.dur} begin={b.delay} repeatCount="indefinite" />
              <animate attributeName="r"       from={b.r * 0.5} to={b.r * 1.5} dur={b.dur} begin={b.delay} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.08;0.78;1" dur={b.dur} begin={b.delay} repeatCount="indefinite" />
              <animate attributeName="fill"    from="rgba(147,197,253,0.88)" to="rgba(255,255,255,0.55)" dur={b.dur} begin={b.delay} repeatCount="indefinite" />
            </circle>
          ))}

          {/* ── AGITAÇÃO NA SUPERFÍCIE ── */}
          <ellipse cx="390" cy="272" rx="34" ry="4" fill="none"
            stroke="rgba(255,255,255,0.30)" strokeWidth="1.5">
            <animate attributeName="ry"      from="3"    to="7"    dur="0.55s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.45" to="0"    dur="0.55s" repeatCount="indefinite" />
          </ellipse>

          {/* ── VAPOR SAINDO PELO GARGALO ── */}
          {[
            { d: 'M 390 228 C 378 210 398 192 384 172', delay: '0.00s', dur: '1.4s', w: 4 },
            { d: 'M 396 228 C 410 207 394 186 408 166', delay: '0.48s', dur: '1.6s', w: 3 },
            { d: 'M 393 228 C 383 204 402 182 391 158', delay: '0.96s', dur: '1.2s', w: 3.5 },
          ].map((v, i) => (
            <path key={i} d={v.d} stroke="rgba(220,232,255,0.70)" strokeWidth={v.w}
              fill="none" strokeLinecap="round">
              <animate attributeName="stroke-opacity" from="0.70" to="0"   dur={v.dur} begin={v.delay} repeatCount="indefinite" />
              <animate attributeName="stroke-width"   from={v.w}  to="0.5" dur={v.dur} begin={v.delay} repeatCount="indefinite" />
            </path>
          ))}
        </>
      )}

      {nivelErlenmeyerTE > 0 && (
        <rect
          x="350"
          y={320 - nivelErlenmeyerTE}
          width="80"
          height={nivelErlenmeyerTE}
          fill={corErlenmeyerDireitoFinal}
          opacity="0.9"
        />
      )}

      {/* GOTAS DE AZUL DE METILENO */}
      {posicaoGotasAzul.map((y, i) => {
        const yLiquido = 320 - nivelErlenmeyerTE;
        if (y >= yLiquido) return null;
        return (
          <circle
            key={i}
            cx={395}
            cy={y}
            r="3.2"
            fill="#1e40af"
            opacity="0.85"
          />
        );
      })}

      {/* Base do erlenmeyer */}
      <ellipse cx="390" cy="320" rx="50" ry="8"
               fill="#1e293b" stroke="#475569" strokeWidth="2"/>
    </g>

    {/* Eletrodo de Platina (dentro do erlenmeyer) */}
    <g>
      <line x1="365" y1="240" x2="365" y2="305"
            stroke="#d1d5db" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="365" cy="305" r="4" fill="#e5e7eb"/>
      <circle cx="365" cy="310" r="6" fill="#9ca3af" opacity="0.5"/>

      {/* Fio de conexão do eletrodo */}
      <line x1="365" y1="240" x2="365" y2="200"
            stroke="#d1d5db" strokeWidth="2"/>
    </g>

    {/* Tubulação conectando caldeira */}
    <path d="M 130 150 Q 130 170, 150 180"
          stroke="#6b7280" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <circle cx="150" cy="180" r="8" fill="#4b5563" stroke="#374151" strokeWidth="2"/>

    {/* Painel Frontal */}
    <g>
      <rect x="100" y="250" width="200" height="180" rx="8"
            fill="#1e293b" stroke="#475569" strokeWidth="2"/>

      {/* Display Digital */}
      <rect x="120" y="280" width="160" height="50" rx="4"
            fill="url(#displayGlow)" stroke="#334155" strokeWidth="2"/>

      <text x="200" y="295" textAnchor="middle"
            fill="#334155" fontSize="10" fontFamily="monospace">
        mV
      </text>
      <text x="200" y="318" textAnchor="middle"
        fill={te088Aquecendo || te088Quente ? '#f87171' : '#22c55e'}
        fontSize="28"
        fontFamily="monospace"
        fontWeight="bold">
        {te088Aquecendo || te088Quente ? '95.0' : '25.0'}
      </text>

      {/* LED Indicador */}
      <circle
          cx="130"
          cy="360"
          r="6"
          fill={te088Aquecendo || te088Quente ? '#ef4444' : '#22c55e'}
          className={te088Aquecendo ? 'animate-pulse' : ''}
        />
      <text x="145" y="365" fill="#94a3b8" fontSize="11">AQUEC.</text>

      {/* Botão Power */}
      <g>
        <circle cx="260" cy="360" r="18"
                fill="#374151"
                stroke="#1f2937" strokeWidth="2"/>
        <circle cx="260" cy="360" r="14"
                fill="#4b5563"/>
        <circle cx="260" cy="358" r="10"
                fill="#6b7280"/>
      </g>
      <text x="243" y="395" fill="#94a3b8" fontSize="10">POWER</text>

      {/* Controle de Temperatura */}
      <g>
        <circle cx="200" cy="400" r="22"
                fill="#374151" stroke="#1f2937" strokeWidth="2"/>
        <circle cx="200" cy="400" r="18"
                fill="#4b5563" stroke="#374151" strokeWidth="1"/>

        <line
          x1="200"
          y1="400"
          x2={200 + 14 * Math.cos(-50 * Math.PI / 180)}
          y2={400 + 14 * Math.sin(-50 * Math.PI / 180)}
          stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>

        {[0, 30, 60, 90].map(angle => (
          <line
            key={angle}
            x1={200 + 24 * Math.cos((angle - 50) * Math.PI / 180)}
            y1={400 + 24 * Math.sin((angle - 50) * Math.PI / 180)}
            x2={200 + 28 * Math.cos((angle - 50) * Math.PI / 180)}
            y2={400 + 28 * Math.sin((angle - 50) * Math.PI / 180)}
            stroke="#6b7280" strokeWidth="2"/>
        ))}
      </g>
      <text x="175" y="435" fill="#94a3b8" fontSize="9">TEMP °C</text>
    </g>

    {/* Etiqueta */}
    <rect x="150" y="520" width="100" height="35" rx="4"
          fill="#0f172a" stroke="#334155" strokeWidth="1"/>
    <text x="200" y="535" textAnchor="middle"
          fill="#60a5fa" fontSize="12" fontWeight="bold">
      TECNAL
    </text>
    <text x="200" y="548" textAnchor="middle"
          fill="#94a3b8" fontSize="10">
      TE-088
    </text>

    {/* Ventilação */}
    {[0, 1, 2, 3, 4].map(i => (
      <line key={`left-${i}`} x1="110" y1={480 + i * 8} x2="140" y2={480 + i * 8}
            stroke="#374151" strokeWidth="2"/>
    ))}
    {[0, 1, 2, 3, 4].map(i => (
      <line key={`right-${i}`} x1="260" y1={480 + i * 8} x2="290" y2={480 + i * 8}
            stroke="#374151" strokeWidth="2"/>
    ))}
  </svg>
);

export default TE088SVG;
