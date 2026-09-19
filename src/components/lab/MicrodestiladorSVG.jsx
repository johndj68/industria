/**
 * MicrodestiladorSVG.jsx — Microdestilador (condensador + bloco de aquecimento)
 *
 * Props:
 *   ligado         — equipamento ligado (LED verde, 92°C)
 *   aquecendo      — aquecimento em andamento (LED laranja, 85°C)
 *   amostraNoMicro — amostra presente no frasco de entrada
 *   balaoAcoplado  — balão receptor acoplado ao saída
 *   nivelBalao     — 0–100, nível do líquido no balão acoplado (%)
 *   destilando     — gotas animadas caindo do receptor
 */
import React from 'react';

const MicrodestiladorSVG = ({
  ligado        = false,
  aquecendo     = false,
  amostraNoMicro = false,
  balaoAcoplado = false,
  nivelBalao    = 0,
  destilando    = false,
}) => {
  // Condensador e frasco na esquerda; painel de controle na direita
  const CX_C = 38; // center x do condensador (lado esquerdo)

  return (
    <svg width="195" height="245" viewBox="0 0 195 245">
      <defs>
        <linearGradient id="mdBlock" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stopColor="#6b7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="mdCond" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(147,210,245,0.46)" />
          <stop offset="50%"  stopColor="rgba(186,230,255,0.18)" />
          <stop offset="100%" stopColor="rgba(147,210,245,0.42)" />
        </linearGradient>
        <linearGradient id="mdFlask" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(180,220,255,0.50)" />
          <stop offset="30%"  stopColor="rgba(210,240,255,0.14)" />
          <stop offset="70%"  stopColor="rgba(210,240,255,0.08)" />
          <stop offset="100%" stopColor="rgba(170,215,252,0.36)" />
        </linearGradient>
        <clipPath id="bvAcoClip">
          <ellipse cx="153" cy="212" rx="17" ry="15" />
        </clipPath>
      </defs>

      {/* Sombra */}
      <ellipse cx={70} cy={240} rx={62} ry={5} fill="rgba(0,0,0,0.18)" />

      {/* ── CONDENSADOR (esquerda) ── */}
      <rect x={CX_C - 12} y={22} width={24} height={118} rx={3}
        fill="url(#mdCond)" stroke="#8ac4dc" strokeWidth="1.4" />
      <rect x={CX_C - 4} y={27} width={8} height={108} rx={1.5}
        fill="rgba(200,235,255,0.14)" stroke="rgba(140,195,225,0.40)" strokeWidth="0.8" />
      <rect x={CX_C - 15} y={14} width={30} height={11} rx={4}
        fill="rgba(155,200,230,0.40)" stroke="#8ac4dc" strokeWidth="1.3" />
      <rect x={CX_C - 10} y={25} width={3} height={112} rx={1.2}
        fill="rgba(255,255,255,0.30)" />
      {/* Portas de água IN/OUT */}
      <rect x={CX_C - 17} y={52} width={6} height={5} rx={1}
        fill="rgba(80,180,230,0.55)" stroke="#5aabcc" strokeWidth="0.8" />
      <rect x={CX_C + 11} y={80} width={6} height={5} rx={1}
        fill="rgba(80,180,230,0.55)" stroke="#5aabcc" strokeWidth="0.8" />
      <text x={CX_C - 26} y={58} fontSize="5.5" fill="#60a5fa" fontFamily="sans-serif">IN</text>
      <text x={CX_C + 18} y={86} fontSize="5.5" fill="#60a5fa" fontFamily="sans-serif">OUT</text>
      <text x={CX_C}      y={12} textAnchor="middle" fontSize="6" fill="#64748b" fontFamily="sans-serif">condensador</text>

      {/* ── BLOCO DE AQUECIMENTO ── */}
      <rect x={8} y={128} width={112} height={72} rx={8}
        fill="url(#mdBlock)" stroke="#1f2937" strokeWidth="1.8" />
      {(ligado || aquecendo) && (
        <rect x={8} y={128} width={112} height={72} rx={8}
          fill="rgba(245,158,11,0.12)"
          style={{ animation: 'glcoAquecer 1.2s ease-in-out infinite' }} />
      )}

      {/* ── PAINEL DE CONTROLE (direita — distante do frasco) ── */}
      <rect x={74} y={132} width={42} height={60} rx={5}
        fill="#1e293b" stroke="#334155" strokeWidth="1.2" />
      {/* Display */}
      <rect x={78} y={136} width={34} height={26} rx={3}
        fill="#0f172a" stroke="#1e3a5f" strokeWidth="0.8" />
      <text x={95} y={146} textAnchor="middle" fontSize="5.5" fill="#64748b" fontFamily="monospace">TEMP °C</text>
      <text x={95} y={158} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="700"
        fill={aquecendo ? '#f87171' : ligado ? '#f59e0b' : '#22c55e'}>
        {aquecendo ? '85.0' : ligado ? '92.0' : '25.0'}
      </text>
      {/* LED power */}
      <circle cx={82} cy={177} r={4.5}
        fill={ligado ? '#22c55e' : '#374151'} stroke={ligado ? '#15803d' : '#1f2937'} strokeWidth="1" />
      {ligado && (
        <circle cx={82} cy={177} r={8} fill="none" stroke="rgba(34,197,94,0.35)" strokeWidth="1.5">
          <animate attributeName="r"       from="4.5" to="10"  dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="1"   to="0"   dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
      <text x={90} y={180} fontSize="6.5" fill="#94a3b8" fontFamily="monospace">
        {ligado ? 'LIGADO' : 'DESLIG.'}
      </text>
      {/* Dial */}
      <circle cx={108} cy={170} r={13} fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
      <circle cx={108} cy={170} r={9}  fill="#4b5563" />
      <line x1={108} y1={170} x2={108} y2={163} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <text x={108} y={192} textAnchor="middle" fontSize="5.5" fill="#6b7280" fontFamily="sans-serif">TEMP</text>

      {/* ── FRASCO DE AMOSTRA (esquerda, distante do painel) ── */}
      <rect x={CX_C - 6} y={116} width={12} height={16} rx={2}
        fill="url(#mdFlask)" stroke="#8ac4dc" strokeWidth="1.3" />
      <ellipse cx={CX_C} cy={148} rx={26} ry={18}
        fill="url(#mdFlask)" stroke="#8ac4dc" strokeWidth="1.5" />
      {amostraNoMicro && (
        <ellipse cx={CX_C} cy={153} rx={22} ry={13}
          fill="rgba(220,190,120,0.55)" stroke="rgba(180,150,80,0.35)" strokeWidth="0.7" />
      )}
      {ligado && amostraNoMicro && [
        { cx: 32, cy: 152, dur: '1.0s' },
        { cx: 38, cy: 145, dur: '1.3s' },
        { cx: 44, cy: 150, dur: '0.9s' },
      ].map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={2.5} fill="rgba(255,255,255,0.55)">
          <animate attributeName="cy"      from={b.cy}      to={b.cy - 14} dur={b.dur} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8"       to="0"         dur={b.dur} repeatCount="indefinite" />
          <animate attributeName="r"       from="2.5"       to="1"         dur={b.dur} repeatCount="indefinite" />
        </circle>
      ))}
      <path d={`M${CX_C - 24},141 Q${CX_C - 25},133 ${CX_C - 20},126`}
        stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* ── BRAÇO SAÍDA DO CONDENSADOR → RECEPTOR ── */}
      {/* Sobe acima do bloco (y=118) → vai à direita → desce ao receptor */}
      <path d={`M ${CX_C},140 L ${CX_C},124 Q ${CX_C},118 ${CX_C+10},118 L 152,118 Q 158,118 158,124 L 158,172`}
        fill="none" stroke="#8ac4dc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${CX_C},140 L ${CX_C},124 Q ${CX_C},118 ${CX_C+10},118 L 152,118 Q 158,118 158,124 L 158,172`}
        fill="none" stroke="rgba(200,235,255,0.22)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Ponta do receptor */}
      <path d="M 154,171 L 162,171 L 160.5,183 L 155.5,183 Z"
        fill="rgba(165,215,255,0.32)" stroke="#8ac4dc" strokeWidth="1.2" />

      {/* ── GOTAS CAINDO DO RECEPTOR ── */}
      {destilando && [
        { cx: 157, begin: '0s' },
        { cx: 155, begin: '0.27s' },
        { cx: 159, begin: '0.54s' },
      ].map((d, i) => (
        <circle key={i} cx={d.cx} cy={184} r={2.2} fill="rgba(140,210,245,0.88)">
          <animate attributeName="cy"      from="184" to="213" dur="0.65s" begin={d.begin} repeatCount="indefinite" />
          <animate attributeName="opacity" from="1"   to="0"   dur="0.65s" begin={d.begin} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ── BALÃO ACOPLADO (quando balaoAcoplado=true) ── */}
      {balaoAcoplado && (
        <>
          {/* Gargalo do balão */}
          <rect x={150} y={183} width={14} height={17} rx={2.5}
            fill="rgba(185,225,255,0.38)" stroke="#8ac4dc" strokeWidth="1.2" />
          {/* Corpo esférico do balão */}
          <ellipse cx={157} cy={212} rx={18} ry={16}
            fill="rgba(185,225,255,0.28)" stroke="#8ac4dc" strokeWidth="1.5" />
          {/* Líquido destilado no balão */}
          {nivelBalao > 0 && (
            <rect
              x={139} y={212 + 16 - (nivelBalao / 100) * 32}
              width={36} height={(nivelBalao / 100) * 32}
              fill="rgba(140,210,245,0.68)"
              clipPath="url(#bvAcoClip)"
            />
          )}
          {/* Superfície do líquido */}
          {nivelBalao > 5 && (
            <rect x={141} y={212 + 16 - (nivelBalao / 100) * 32} width={32} height={2}
              rx={1} fill="rgba(255,255,255,0.20)" clipPath="url(#bvAcoClip)" />
          )}
          {/* Marca de calibração */}
          <line x1={147} y1={190} x2={167} y2={190}
            stroke="rgba(6,32,85,0.60)" strokeWidth="1.2" />
          {/* Reflexo */}
          <line x1={151} y1={186} x2={151} y2={198}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Rótulo */}
          <rect x={146} y={215} width={22} height={10} rx={2}
            fill="rgba(255,255,255,0.85)" />
          <text x={157} y={222} textAnchor="middle" fontSize="5.5"
            fill="#0d2137" fontFamily="monospace" fontWeight="700">10mL</text>
          {/* Indicador acoplado */}
          <circle cx={157} cy={183} r={4} fill="rgba(34,197,94,0.55)" stroke="#22c55e" strokeWidth="1">
            <animate attributeName="opacity" from="1" to="0.3" dur="0.9s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

export default MicrodestiladorSVG;
