/**
 * condutividadeAlcool.jsx — Determinação de Condutividade em Álcool e STD/TDS
 *
 * Fluxo: Amostra de Álcool → Béquer 50 mL → Resfriar → Verificar Calibração
 *        → Imergir Eletrodo → Estabilizar → Ler Condutividade → Resultados
 *
 * Equipamento: Condutivímetro HACH HQ40d · Eletrodo IntelliCAL CDC401
 * Resultado: µS/cm (condutividade) · mg/L (STD/TDS)
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import BequerSVG from '../components/lab/BequerSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragCondutividadeAlcool } from '../hooks/useSimuladorDragCondutividadeAlcool';
import { etapas } from '../fermentacao/data/etapasCondutividadeAlcool';


/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes cdaTimerPulse {
    0%,100% { opacity: 0.62; }
    50%     { opacity: 1.00; }
  }
  @keyframes cdaBlink {
    0%,49%  { opacity: 1; }
    50%,100%{ opacity: 0.35; }
  }
  @keyframes cdaGlow {
    0%,100% { filter: drop-shadow(0 0 3px rgba(34,197,94,0.40)); }
    50%     { filter: drop-shadow(0 0 9px rgba(34,197,94,0.75)); }
  }
`;


/* ═══════════════════════════════════════════════════════════
   SVG — CONDUTIVÍMETRO HACH HQ40d — Álcool
   (idêntico ao de condutividadeAguas, display adaptado)
═══════════════════════════════════════════════════════════ */
const CondutivimetroAlcoolSVG = ({
  calibrado = false,
  eletrodoImergido = false,
  estabilizando = false,
  progressoEst = 0,
  pronto = false,
  lendo = false,
  condutividade = null,
  std = null,
  lerAtivo = false,
  onLer,
}) => (
  <svg width="165" height="236" viewBox="0 0 210 300">
    <defs>
      <linearGradient id="cdaBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#222222" />
        <stop offset="8%"   stopColor="#3a3a3a" />
        <stop offset="50%"  stopColor="#424242" />
        <stop offset="92%"  stopColor="#3a3a3a" />
        <stop offset="100%" stopColor="#222222" />
      </linearGradient>
      <linearGradient id="cdaKeypad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#3c3c3c" />
        <stop offset="100%" stopColor="#2a2a2a" />
      </linearGradient>
      <linearGradient id="cdaBtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#525252" />
        <stop offset="40%"  stopColor="#464646" />
        <stop offset="100%" stopColor="#303030" />
      </linearGradient>
      <linearGradient id="cdaBtnRead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#664400" />
        <stop offset="100%" stopColor="#4a3000" />
      </linearGradient>
      <linearGradient id="cdaLcd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#001608" />
        <stop offset="100%" stopColor="#000e05" />
      </linearGradient>
      <radialGradient id="cdaPort" cx="50%" cy="40%" r="60%">
        <stop offset="0%"   stopColor="#4a4a4a" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </radialGradient>
      <filter id="cdaSh"><feDropShadow dx="3" dy="6" stdDeviation="7" floodOpacity=".55" /></filter>
    </defs>

    <ellipse cx={105} cy={296} rx={85} ry={6} fill="rgba(0,0,0,0.22)" />

    {/* Bumpers laranja HACH */}
    <rect x="2"   y="2"   width="26" height="22" rx="8" fill="#f5a500" />
    <rect x="182" y="2"   width="26" height="22" rx="8" fill="#f5a500" />
    <rect x="2"   y="276" width="26" height="22" rx="8" fill="#f5a500" />
    <rect x="182" y="276" width="26" height="22" rx="8" fill="#f5a500" />

    {/* Corpo */}
    <g filter="url(#cdaSh)">
      <rect x="6" y="6" width="198" height="288" rx="16"
        fill="url(#cdaBody)" stroke="#181818" strokeWidth="1.8" />
    </g>

    {/* Grip lateral */}
    {[0,3,6,9,12].map(i => (
      <rect key={i} x={7} y={120+i*8} width={5} height={5} rx={1.5} fill="rgba(0,0,0,0.45)" />
    ))}
    {[0,3,6,9,12].map(i => (
      <rect key={i} x={198} y={120+i*8} width={5} height={5} rx={1.5} fill="rgba(0,0,0,0.45)" />
    ))}

    {/* Faixa laranja + HACH logo */}
    <rect x="6" y="6" width="198" height="34" rx="16" fill="#f5a500" />
    <rect x="6" y="24" width="198" height="16" fill="#f5a500" />
    <text x="105" y="24" textAnchor="middle" fontSize="14"
      fill="white" fontFamily="Arial Black, sans-serif" fontWeight="900" letterSpacing="4">HACH</text>
    <text x="105" y="35" textAnchor="middle" fontSize="6.5"
      fill="rgba(255,255,255,0.82)" fontFamily="Arial, sans-serif" letterSpacing="1.5">
      HQ40d  CONDUTIVIDADE  ÁLCOOL
    </text>

    {/* Porta IntelliCAL */}
    <circle cx="105" cy="55" r="14" fill="url(#cdaPort)" stroke="#555" strokeWidth="1.2" />
    <circle cx="105" cy="55" r="14" fill="none" stroke="#606060" strokeWidth="0.8" strokeDasharray="3,2.5" />
    <circle cx="105" cy="55" r="9" fill="#0d0d0d" stroke="#444" strokeWidth="1" />
    <circle cx="102" cy="52" r="1.4" fill="#8a8a8a" />
    <circle cx="108" cy="52" r="1.4" fill="#8a8a8a" />
    <circle cx="105" cy="58" r="1.4" fill="#8a8a8a" />
    <circle cx="101" cy="57" r="0.9" fill="#666" />
    <circle cx="109" cy="57" r="0.9" fill="#666" />
    <rect x="103.5" y="44" width="3" height="4" rx="1" fill="#5a5a5a" />
    <text x="105" y="76" textAnchor="middle" fontSize="5.5" fill="#888" fontFamily="monospace">
      CH1 · IntelliCAL CDC
    </text>

    {/* LED status */}
    <circle cx="185" cy="55" r="5"
      fill={condutividade ? '#22c55e' : pronto ? '#22c55e' : estabilizando ? '#f59e0b' : calibrado ? '#3b82f6' : '#444'}
      stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
    {(pronto || condutividade) && (
      <circle cx="185" cy="55" r="9" fill="none"
        stroke={condutividade ? 'rgba(34,197,94,0.42)' : 'rgba(34,197,94,0.38)'} strokeWidth="2">
        <animate attributeName="opacity" from="1" to="0" dur="1.2s" repeatCount="indefinite" />
      </circle>
    )}
    <text x="185" y="68" textAnchor="middle" fontSize="5" fill="#666" fontFamily="monospace">PWR</text>

    {/* Display bezel */}
    <rect x="14" y="82" width="182" height="116" rx="7" fill="#0a0a0a" stroke="#1e1e1e" strokeWidth="1.5" />
    <rect x="15" y="83" width="180" height="5" rx="3" fill="rgba(255,255,255,0.04)" />

    {/* LCD */}
    <rect x="18" y="86" width="174" height="108" rx="5" fill="url(#cdaLcd)" />
    <rect x="19" y="87" width="172" height="106" rx="4" fill="rgba(0,50,20,0.28)" />

    {/* Barra superior */}
    <rect x="18" y="86" width="174" height="15" rx="4" fill="rgba(15,40,0,0.55)" />
    <text x="24" y="97" fontSize="6.5" fill="#00bb44" fontFamily="monospace" fontWeight="700">
      CH1 · CONDUTIVIDADE ÁLCOOL
    </text>
    <rect x="174" y="89" width="12" height="7" rx="1.5"
      fill="none" stroke="#00aa33" strokeWidth="0.8" />
    <rect x="186" y="91" width="2.5" height="3" rx="0.8" fill="#00aa33" />
    <rect x="174.5" y="89.5" width={condutividade ? 11 : 7} height="6" rx="1"
      fill={condutividade ? '#00dd44' : '#008822'} />

    {/* Conteúdo LCD */}
    {condutividade !== null ? (
      <g>
        <text x="105" y="128" textAnchor="middle" fontSize="36"
          fill="#00ff55" fontFamily="'Courier New', monospace" fontWeight="700" letterSpacing="-1">
          {condutividade}
        </text>
        <text x="180" y="128" textAnchor="end" fontSize="11"
          fill="#00cc44" fontFamily="monospace">µS/cm</text>
        <rect x="22" y="112" width="16" height="10" rx="2" fill="rgba(0,180,60,0.20)" stroke="#00aa33" strokeWidth="0.8" />
        <text x="30" y="120" textAnchor="middle" fontSize="7" fill="#00cc44" fontFamily="monospace">SBL</text>
        <line x1="19" y1="137" x2="191" y2="137" stroke="rgba(0,100,30,0.28)" strokeWidth="0.7" />
        <text x="24" y="148" fontSize="7.5" fill="#009933" fontFamily="monospace">25,0 °C</text>
        <text x="105" y="148" textAnchor="middle" fontSize="8"
          fill="#00bb44" fontFamily="monospace">
          STD/TDS: {std} mg/L
        </text>
        <text x="188" y="148" textAnchor="end" fontSize="6.5" fill="#007722" fontFamily="monospace">✓ LOG</text>
        <line x1="19" y1="158" x2="191" y2="158" stroke="rgba(0,80,20,0.22)" strokeWidth="0.6" />
        {['CAL','MENU','LOG'].map((lbl, i) => (
          <text key={lbl} x={35 + i*67} y="170" textAnchor="middle"
            fontSize="6" fill="#006622" fontFamily="monospace">{lbl}</text>
        ))}
      </g>
    ) : lendo ? (
      <g>
        <text x="105" y="118" textAnchor="middle" fontSize="28"
          fill="#fbbf24" fontFamily="'Courier New', monospace"
          style={{ animation: 'cdaBlink 0.4s linear infinite' }}>
          - - - - -
        </text>
        <text x="180" y="118" textAnchor="end" fontSize="11" fill="#d97706" fontFamily="monospace">µS/cm</text>
        <rect x="24" y="132" width="162" height="7" rx="3.5" fill="rgba(255,255,255,0.07)" />
        <rect x="24" y="132" width="0" height="7" rx="3.5" fill="rgba(245,158,11,0.65)">
          <animate attributeName="width" from="0" to="162" dur="2.5s" fill="freeze" />
        </rect>
        <text x="105" y="153" textAnchor="middle" fontSize="6.5"
          fill="#78716c" fontFamily="monospace">Calculando condutividade...</text>
      </g>
    ) : estabilizando ? (
      <g>
        <text x="24" y="112" fontSize="6.5" fill="#f59e0b" fontFamily="monospace">ESTABILIZANDO</text>
        <text x="165" y="112" fontSize="9" fill="#d97706" fontFamily="monospace">&lt; &lt;</text>
        <text x="105" y="134" textAnchor="middle" fontSize="24"
          fill="#fbbf24" fontFamily="'Courier New', monospace"
          style={{ animation: 'cdaBlink 0.9s linear infinite' }}>
          {String(Math.floor(100 + progressoEst * 7.5)).padStart(5)}
        </text>
        <text x="180" y="134" textAnchor="end" fontSize="10" fill="#d97706" fontFamily="monospace">µS/cm</text>
        <line x1="19" y1="143" x2="191" y2="143" stroke="rgba(180,100,0,0.18)" strokeWidth="0.7" />
        <rect x="24" y="149" width="162" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
        <rect x="24" y="149" width={Math.max(4, 162 * progressoEst / 100)} height="6" rx="3"
          fill="rgba(245,158,11,0.62)" style={{ transition: 'width 0.1s linear' }} />
        <text x="105" y="168" textAnchor="middle" fontSize="7"
          fill="#b45309" fontFamily="monospace">{Math.floor(progressoEst)}% — equilíbrio térmico</text>
      </g>
    ) : pronto ? (
      <g>
        <text x="24" y="110" fontSize="6.5" fill="#22c55e" fontFamily="monospace">ESTÁVEL</text>
        <rect x="155" y="103" width="30" height="10" rx="2" fill="rgba(0,140,40,0.18)" stroke="#00aa44" strokeWidth="0.8" />
        <text x="170" y="110.5" textAnchor="middle" fontSize="6.5" fill="#88dd00" fontFamily="monospace">🔒 SBL</text>
        <text x="105" y="134" textAnchor="middle" fontSize="22"
          fill="#aaff00" fontFamily="'Courier New', monospace">PRONTO</text>
        <line x1="19" y1="142" x2="191" y2="142" stroke="rgba(50,100,0,0.22)" strokeWidth="0.7" />
        <text x="105" y="156" textAnchor="middle" fontSize="7"
          fill="#16a34a" fontFamily="sans-serif">Eletrodo estabilizado</text>
        <text x="105" y="168" textAnchor="middle" fontSize="7"
          fill="#15803d" fontFamily="sans-serif">Clique em LER</text>
      </g>
    ) : calibrado && eletrodoImergido ? (
      <g>
        <text x="24" y="110" fontSize="6.5" fill="#3b82f6" fontFamily="monospace">ELETRODO OK</text>
        <text x="105" y="130" textAnchor="middle" fontSize="18"
          fill="#60a5fa" fontFamily="'Courier New', monospace">AGUARD...</text>
        <text x="105" y="155" textAnchor="middle" fontSize="7"
          fill="#3a6a9a" fontFamily="sans-serif">Célula imersa no álcool</text>
        <text x="105" y="167" textAnchor="middle" fontSize="7"
          fill="#2a5080" fontFamily="sans-serif">Aguardando estabilização</text>
      </g>
    ) : calibrado ? (
      <g>
        <text x="24" y="108" fontSize="6" fill="#3b82f6" fontFamily="monospace">CAL ✓  PRONTO P/ USO</text>
        <text x="105" y="130" textAnchor="middle" fontSize="20"
          fill="#3b82f6" fontFamily="'Courier New', monospace">CAL ✓</text>
        <text x="105" y="155" textAnchor="middle" fontSize="7"
          fill="#60a5fa" fontFamily="sans-serif">Condutivímetro calibrado</text>
        <text x="105" y="167" textAnchor="middle" fontSize="7"
          fill="#3a6a9a" fontFamily="sans-serif">Imergir eletrodo no álcool</text>
      </g>
    ) : (
      <g>
        <text x="24" y="108" fontSize="6" fill="#3a5a2a" fontFamily="monospace">STANDBY</text>
        <text x="105" y="130" textAnchor="middle" fontSize="20"
          fill="#2a4a1a" fontFamily="'Courier New', monospace">- - - -</text>
        <text x="105" y="155" textAnchor="middle" fontSize="7"
          fill="#1e3814" fontFamily="sans-serif">Verificar certificado</text>
        <text x="105" y="167" textAnchor="middle" fontSize="7"
          fill="#162c10" fontFamily="sans-serif">de calibração</text>
      </g>
    )}

    {/* Botões */}
    <rect x="12" y="202" width="186" height="82" rx="8" fill="url(#cdaKeypad)" />
    <line x1="12" y1="203" x2="198" y2="203" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
    {[{x:42,l:'◄'},{x:105,l:'▲'},{x:168,l:'►'}].map(({x,l}) => (
      <g key={l}>
        <rect x={x-15} y="208" width="30" height="20" rx="6"
          fill="url(#cdaBtn)" stroke="#1e1e1e" strokeWidth="0.8" />
        <rect x={x-14} y="208.5" width="28" height="7" rx="4" fill="rgba(255,255,255,0.09)" />
        <text x={x} y="221.5" textAnchor="middle" fontSize="10"
          fill="#c8c8c8" fontFamily="Arial, sans-serif">{l}</text>
      </g>
    ))}
    <g>
      <rect x="90" y="233" width="30" height="20" rx="6"
        fill="url(#cdaBtn)" stroke="#1e1e1e" strokeWidth="0.8" />
      <rect x="91" y="233.5" width="28" height="7" rx="4" fill="rgba(255,255,255,0.09)" />
      <text x="105" y="246.5" textAnchor="middle" fontSize="10"
        fill="#c8c8c8" fontFamily="Arial, sans-serif">▼</text>
    </g>
    {[{x:42,l:'BACK'},{x:168,l:'MENU'}].map(({x,l}) => (
      <g key={l}>
        <rect x={x-20} y="233" width="40" height="20" rx="6"
          fill="url(#cdaBtn)" stroke="#1e1e1e" strokeWidth="0.8" />
        <rect x={x-19} y="233.5" width="38" height="7" rx="4" fill="rgba(255,255,255,0.09)" />
        <text x={x} y="246.5" textAnchor="middle" fontSize="7"
          fill="#b0b0b0" fontFamily="Arial, sans-serif" fontWeight="700">{l}</text>
      </g>
    ))}

    {/* Botão LER CONDUTIVIDADE */}
    <g onClick={onLer} style={{ cursor: lerAtivo ? 'pointer' : 'default' }}>
      <rect x="22" y="258" width="166" height="22" rx="8"
        fill={lerAtivo ? 'url(#cdaBtnRead)' : '#222222'}
        stroke={lerAtivo ? '#cc8800' : '#2a2a2a'} strokeWidth={lerAtivo ? 2 : 1} />
      <rect x="23" y="258.5" width="164" height="8" rx="6"
        fill={lerAtivo ? 'rgba(255,165,0,0.12)' : 'rgba(255,255,255,0.04)'} />
      {lerAtivo && (
        <rect x="22" y="258" width="166" height="22" rx="8"
          fill="none" stroke="rgba(255,180,0,0.38)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
        </rect>
      )}
      <text x="105" y="272" textAnchor="middle" fontSize="9"
        fill={lerAtivo ? '#ffdd00' : '#505050'} fontFamily="Arial, sans-serif"
        fontWeight={lerAtivo ? '700' : '400'} letterSpacing="1.5">
        LER CONDUTIVIDADE
      </text>
    </g>

    {/* USB + base */}
    <rect x="199" y="155" width="7" height="12" rx="2" fill="#0d0d0d" stroke="#3a3a3a" strokeWidth="0.8" />
    <rect x="6" y="280" width="198" height="12" rx="6" fill="#f5a500" opacity="0.60" />
    <ellipse cx="105" cy="290" rx="7" ry="4.5" fill="none" stroke="#f5a500" strokeWidth="2.5" />
    <ellipse cx="105" cy="290" rx="4" ry="2.5" fill="rgba(0,0,0,0.30)" />
    <text x="105" y="297" textAnchor="middle" fontSize="5" fill="#3a3a3a" fontFamily="monospace">
      HACH HQ40d · Condutividade Álcool
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — ELETRODO DE CONDUTIVIDADE IntelliCAL CDC401
═══════════════════════════════════════════════════════════ */
const EletrodoCondAlcoolSVG = ({ imerso = false }) => (
  <svg width="50" height="145" viewBox="0 0 50 145" opacity={imerso ? 0.18 : 1}>
    <defs>
      <linearGradient id="epcCabo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#1a1a1a" />
        <stop offset="45%"  stopColor="#3a3a3a" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="epcCorpo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#1c1c1c" />
        <stop offset="20%"  stopColor="#2e2e2e" />
        <stop offset="50%"  stopColor="#323232" />
        <stop offset="80%"  stopColor="#2e2e2e" />
        <stop offset="100%" stopColor="#1c1c1c" />
      </linearGradient>
    </defs>
    <ellipse cx={25} cy={143} rx={10} ry={3} fill="rgba(0,0,0,0.18)" />
    {/* Cabo */}
    <rect x="20" y="0" width="10" height="28" rx="5" fill="url(#epcCabo)" />
    {[4,8,12,16,20,24].map(y => (
      <rect key={y} x="19" y={y} width="12" height="2.5" rx="1.5" fill="rgba(0,0,0,0.55)" />
    ))}
    <rect x="22" y="1" width="3" height="25" rx="1.5" fill="rgba(255,255,255,0.12)" />
    {/* Conector */}
    <rect x="13" y="26" width="24" height="12" rx="4" fill="#3d3d3d" stroke="#1a1a1a" strokeWidth="1.2" />
    <rect x="15" y="28" width="20" height="8" rx="2.5" fill="#484848" />
    <circle cx="21" cy="32" r="1.5" fill="#707070" />
    <circle cx="29" cy="32" r="1.5" fill="#707070" />
    <rect x="24" y="26.5" width="2" height="4" rx="0.8" fill="#2a2a2a" />
    {/* Strain relief laranja HACH */}
    <rect x="17" y="38" width="16" height="6" rx="3" fill="#f5a500" stroke="#c08000" strokeWidth="0.8" />
    <rect x="18.5" y="39" width="13" height="4" rx="2" fill="#f7b500" opacity="0.60" />
    {/* Corpo */}
    <rect x="16" y="44" width="18" height="72" rx="4"
      fill="url(#epcCorpo)" stroke="#0d0d0d" strokeWidth="1" />
    <rect x="17.5" y="46" width="4" height="68" rx="2" fill="rgba(255,255,255,0.10)" />
    {/* Rótulo */}
    <rect x="17" y="52" width="16" height="40" rx="2"
      fill="#f0f0f0" stroke="#c8c8c8" strokeWidth="0.5" />
    <rect x="17" y="52" width="16" height="4" rx="2" fill="#1a6eb5" />
    <text x="25" y="55.5" textAnchor="middle" fontSize="3.5"
      fill="white" fontFamily="Arial, sans-serif" fontWeight="700" letterSpacing="0.3">
      INTELLICAL
    </text>
    <text x="25" y="63" textAnchor="middle" fontSize="4"
      fill="#1a1a1a" fontFamily="Arial, sans-serif" fontWeight="700">CDC401</text>
    <text x="25" y="69" textAnchor="middle" fontSize="3.5"
      fill="#333" fontFamily="Arial, sans-serif">Conductivity</text>
    <text x="25" y="76" textAnchor="middle" fontSize="5"
      fill="#555" fontFamily="serif">~</text>
    <text x="25" y="82" textAnchor="middle" fontSize="3"
      fill="#666" fontFamily="monospace">µS · mS/cm</text>
    <line x1="18" y1="84" x2="32" y2="84" stroke="#c8c8c8" strokeWidth="0.5" />
    <text x="25" y="89" textAnchor="middle" fontSize="3"
      fill="#888" fontFamily="monospace">CAL: NIST1413</text>
    {/* Anel transição */}
    <rect x="14" y="116" width="22" height="6" rx="3"
      fill="#2a2a2a" stroke="#0d0d0d" strokeWidth="1" />
    {/* Corpo lower */}
    <rect x="18" y="122" width="14" height="10" rx="2"
      fill="#111111" stroke="#0a0a0a" strokeWidth="1" />
    <rect x="31" y="125" width="3" height="4" rx="1"
      fill="#3a3a3a" stroke="#222" strokeWidth="0.5" />
    <circle cx="32" cy="126.5" r="0.8" fill="#555" />
    <circle cx="32" cy="128.5" r="0.8" fill="#555" />
    {/* Célula condutividade 4-eletrodos */}
    {[124, 128, 132, 136].map((y, i) => (
      <rect key={i} x={17} y={y} width={16} height={2} rx={1}
        fill={i % 2 === 0 ? '#b0b0b0' : '#909090'} />
    ))}
    {[124, 128, 132, 136].map((y, i) => (
      <rect key={i} x={18} y={y + 0.3} width={6} height={0.8} rx={0.4}
        fill="rgba(255,255,255,0.40)" />
    ))}
    {/* Ponteira */}
    <path d="M 18,136 L 32,136 L 29,142 Q 25,145 21,142 Z"
      fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="0.8" />
    <circle cx="22" cy="139" r="1.2" fill="#0d0d0d" />
    <circle cx="28" cy="139" r="1.2" fill="#0d0d0d" />
    <circle cx="25" cy="141" r="1.0" fill="#0d0d0d" />
    <text x="25" y="148" textAnchor="middle" fontSize="5.5"
      fill="#5a5a5a" fontFamily="sans-serif">IntelliCAL</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const CondutividadeAlcool = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'cda-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid;
    tag.textContent = ESTILOS_ANIMACAO;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(sid); if (el) el.remove(); };
  }, []);

  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado, mostrarParabens,
    concluido, mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  // ── Amostra ───────────────────────────────────────────
  const [nivelAmostra, setNivelAmostra] = useState(82);

  // ── Béquer 50 mL ─────────────────────────────────────
  const [nivelBequer,    setNivelBequer]    = useState(0);
  const [corBequer,      setCorBequer]      = useState('rgba(220,235,255,0.08)');
  const [amostraNoBequer,setAmostraNoBequer]= useState(false);

  // ── Resfriamento ──────────────────────────────────────
  const [resfriando,       setResfriando]       = useState(false);
  const [progressoResf,    setProgressoResf]    = useState(0);
  const [amostraResfriada, setAmostraResfriada] = useState(false);

  // ── Certificado ───────────────────────────────────────
  const [mostrarCertificado, setMostrarCertificado] = useState(false);
  const [certificadoVerific, setCertificadoVerific] = useState(false);

  // ── Eletrodo ──────────────────────────────────────────
  const [eletrodoImergido, setEletrodoImergido] = useState(false);

  // ── Estabilização ─────────────────────────────────────
  const [estabilizando, setEstabilizando] = useState(false);
  const [progressoEst,  setProgressoEst]  = useState(0);
  const [pronto,        setPronto]        = useState(false);

  // ── Leitura ───────────────────────────────────────────
  const [lendo,         setLendo]         = useState(false);
  const [condutividade, setCondutividade] = useState(null);
  const [std,           setStd]           = useState(null);

  // ── TIMER: Resfriamento (step 1, 4s) ─────────────────
  useEffect(() => {
    if (!resfriando) return;
    setProgressoResf(0);
    let p = 0;
    const tick = setInterval(() => { p = Math.min(p + 2.5, 100); setProgressoResf(p); }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setResfriando(false);
      setAmostraResfriada(true);
      setProgressoResf(100);
      setCorBequer('rgba(240,225,155,0.78)');
      celebrarAcerto();
      proximaEtapa(); // → step 2
    }, 4000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [resfriando]);

  // ── TIMER: Estabilização (step 4, 3s) ─────────────────
  useEffect(() => {
    if (!estabilizando) return;
    setProgressoEst(0);
    let p = 0;
    const tick = setInterval(() => { p = Math.min(p + 3.34, 100); setProgressoEst(p); }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setEstabilizando(false);
      setPronto(true);
      setProgressoEst(100);
      celebrarAcerto(100);
      proximaEtapa(); // → step 5
    }, 3000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [estabilizando]);

  // ── TIMER: auto-conclusão (step 6) ────────────────────
  useEffect(() => {
    if (etapaAtual !== 6) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragCondutividadeAlcool(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra,
    setNivelBequer, setCorBequer, setAmostraNoBequer,
    setEletrodoImergido, setEstabilizando,
  });

  // ── Click: Resfriar (step 1) ──────────────────────────
  const handleResfriar = () => {
    if (etapaAtual !== 1 || !amostraNoBequer || resfriando) return;
    setResfriando(true);
  };

  // ── Click: Verificar certificado (step 2) ─────────────
  const handleVerificarCertificado = () => {
    if (etapaAtual !== 2) return;
    setMostrarCertificado(true);
  };

  const handleConfirmarCertificado = () => {
    setMostrarCertificado(false);
    setCertificadoVerific(true);
    celebrarAcerto(150);
    proximaEtapa(); // → step 3
  };

  // ── Click: Ler condutividade (step 5) ─────────────────
  const handleLerCondutividade = () => {
    if (etapaAtual !== 5 || !pronto || lendo || condutividade) return;
    setLendo(true);
    setTimeout(() => {
      // Álcool hidratado: 80–800 µS/cm (AEHC típico)
      const rawCond = Math.floor(Math.random() * 720 + 80);
      const rawStd  = parseFloat((rawCond * 0.65).toFixed(1));
      setCondutividade(rawCond);
      setStd(rawStd);
      setLendo(false);
      celebrarAcerto(200);
      proximaEtapa(); // → step 6
    }, 2500);
  };

  const mostrarBotaoResfriar = etapaAtual === 1 && amostraNoBequer;
  const mostrarBotaoCertif   = etapaAtual === 2 && !certificadoVerific;
  const lerAtivo             = etapaAtual === 5 && pronto && !lendo && !condutividade;


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding: 16, fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* ── MODAL CERTIFICADO ── */}
      {mostrarCertificado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
          <div style={{ background: 'linear-gradient(135deg,#0f2137,#1a3050)', border: '2px solid #0ea5e9', borderRadius: 20, padding: '32px 40px', textAlign: 'center', color: 'white', maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.70)' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#38bdf8', margin: '0 0 4px' }}>Certificado de Calibração</h3>
            <p style={{ color: '#64748b', fontSize: 11, margin: '0 0 20px' }}>Condutivímetro — Verificação de Rastreabilidade</p>
            <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 12, padding: '16px 22px', marginBottom: 20, textAlign: 'left' }}>
              {[
                { label: 'Equipamento',        val: 'Condutivímetro Portátil HACH' },
                { label: 'Modelo / Série',     val: 'HQ40d · Nº 2024-0817' },
                { label: 'Padrão de referência', val: 'NIST 1413 · 1413 µS/cm' },
                { label: 'Data de calibração', val: '01/06/2025' },
                { label: 'Validade',           val: '01/06/2026' },
                { label: 'Laboratório',        val: 'Metrologia Acreditada INMETRO' },
                { label: 'Responsável',        val: 'Eng. Química — CREA 456789' },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 6, fontSize: 11 }}>
                  <span style={{ color: '#64748b' }}>{label}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'monospace' }}>{val}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(14,165,233,0.20)', paddingTop: 10, marginTop: 8, textAlign: 'center' }}>
                <span style={{ background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.40)', color: '#4ade80', borderRadius: 8, padding: '4px 16px', fontSize: 12, fontWeight: 700 }}>
                  ✓ CERTIFICADO VÁLIDO
                </span>
              </div>
            </div>
            <button onClick={handleConfirmarCertificado}
              style={{ background: 'linear-gradient(90deg,#0ea5e9,#0284c7)', color: 'white', border: 'none', borderRadius: 10, padding: '11px 32px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,165,233,0.40)' }}>
              ✓ Confirmar — Equipamento Calibrado
            </button>
          </div>
        </div>
      )}

      {/* ── OVERLAY PARABÉNS ── */}
      {mostrarParabens && (
        <div style={{ position: 'fixed', top: 18, right: 24, zIndex: 60, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)', color: 'white', padding: '20px 36px', borderRadius: 22, boxShadow: '0 16px 40px rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.9)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Star size={30} fill="currentColor" />
              <div><h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Muito bem!</h3><p style={{ fontSize: 15, margin: 0 }}>+100 pontos</p></div>
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
              <div><h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Ação incorreta</h3><p style={{ fontSize: 12, margin: 0 }}>{mensagemErroEtapa}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RESFRIAMENTO ── */}
      {resfriando && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#164e63,#0e7490,#0891b2)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, animation: 'cdaTimerPulse 1s ease-in-out infinite' }}>❄ Resfriando até Temperatura Ambiente...</div>
            <div style={{ marginTop: 8, height: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', minWidth: 200 }}>
              <div style={{ height: '100%', width: `${progressoResf}%`, background: 'rgba(56,189,248,0.85)', borderRadius: 5, transition: 'width 0.1s linear' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RESULTADO ── */}
      {condutividade && etapaAtual >= 6 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#14532d,#166534,#16a34a)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>⚡ Leitura Concluída!</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Condutividade: <strong>{condutividade} µS/cm</strong> · STD/TDS: <strong>{std} mg/L</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUSÃO ── */}
      {concluido && condutividade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #0ea5e9', borderRadius: 24, padding: '48px 56px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>⚡</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de Condutividade em Álcool · HACH HQ40d · IntelliCAL CDC401
            </p>
            <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.28)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Equipamento',  val: 'HACH HQ40d',     cor: '#38bdf8' },
                  { label: 'Padrão',       val: 'NIST 1413',       cor: '#60a5fa' },
                  { label: 'Calibrado',    val: '✓ Sim',           cor: '#4ade80' },
                  { label: 'Volume',       val: 'Béquer 50 mL',    cor: '#a78bfa' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{ flex: 1, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.35)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Condutividade</div>
                <div style={{ fontSize: 38, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', lineHeight: 1 }}>{condutividade}</div>
                <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 700, marginTop: 4 }}>µS/cm</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.30)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>STD/TDS</div>
                <div style={{ fontSize: 38, fontWeight: 900, color: '#4ade80', fontFamily: 'monospace', lineHeight: 1 }}>{std}</div>
                <div style={{ fontSize: 13, color: '#34d399', fontWeight: 700, marginTop: 4 }}>mg/L</div>
              </div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#34d399' }}>
              ✓ Leitura realizada com sucesso · HACH HQ40d · IntelliCAL CDC401
            </div>
            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#0891b2,#0ea5e9)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Condutividade — Álcool"
        subtitulo={"Condutividade em Álcool · Eletrodo IntelliCAL\nµS/cm · STD/TDS mg/L"}
        icone="⚡"
        badges={['🍺 FERMENTAÇÃO', '⚡ CONDUTIVIDADE']}
        footerLabel="⚡ Condutividade Álcool"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 640 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            ⚡ Bancada — Determinação de Condutividade em Álcool e STD/TDS
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* ─ BÉQUER 50 mL ─ */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="bequer" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={`${dropCls('bequer')}`}
                    style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 13, padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <BequerSVG nivel={nivelBequer} cor={corBequer} id="cda50" ml={150} />
                      {/* Overlay eletrodo de condutividade imerso */}
                      {eletrodoImergido && (
                        <svg width="78" height="106" viewBox="0 0 78 106"
                          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                          <line x1="39" y1="0" x2="39" y2="18" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                          <rect x="33" y="18" width="12" height="5" rx="2" fill="#475569" stroke="#334155" strokeWidth="0.8" />
                          <rect x="35" y="23" width="8" height="3.5" rx="1.5" fill="#f5a500" />
                          <rect x="37" y="26.5" width="4" height="24" rx="1.5" fill="rgba(45,75,105,0.88)" stroke="#334155" strokeWidth="0.8" />
                          {/* Célula condutividade no béquer */}
                          <rect x="36" y="51" width="6" height="14" rx="1" fill="#1e1e1e" stroke="#334155" strokeWidth="0.8" />
                          {[52,55,58,61].map((y, i) => (
                            <rect key={i} x="36" y={y} width="6" height="1.8" rx="0.8"
                              fill={i % 2 === 0 ? '#b0b0b0' : '#909090'}
                              style={{ animation: 'cdaGlow 2s ease-in-out infinite' }} />
                          ))}
                          <ellipse cx="39" cy="57" rx="2" ry="0.8" fill="rgba(255,255,255,0.25)" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>Béquer 50 mL</span>
                    <span style={{ fontSize: 8, color: eletrodoImergido ? '#38bdf8' : amostraResfriada ? '#34d399' : amostraNoBequer ? '#fbbf24' : '#94a3b8' }}>
                      {eletrodoImergido   ? '⚡ Eletrodo imerso'
                        : amostraResfriada ? '❄ Temp. ambiente ✓'
                        : amostraNoBequer  ? '🍺 Amostra de álcool'
                        : 'Vazio — adicione amostra'}
                    </span>
                  </div>
                </ZonaDrop>
              </div>

              {/* ─ CONDUTIVÍMETRO + ELETRODO ─ */}
              <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16 }}>
                {/* Condutivímetro */}
                <ZonaDrop id="condutivimetro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={dropCls('condutivimetro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                    <CondutivimetroAlcoolSVG
                      calibrado={certificadoVerific}
                      eletrodoImergido={eletrodoImergido}
                      estabilizando={estabilizando}
                      progressoEst={progressoEst}
                      pronto={pronto}
                      lendo={lendo}
                      condutividade={condutividade}
                      std={std}
                      lerAtivo={lerAtivo}
                      onLer={handleLerCondutividade}
                    />
                    {lerAtivo && (
                      <div style={{ textAlign: 'center', fontSize: 8, color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>
                        ⚡ Clique em LER para registrar!
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>Condutivímetro HACH HQ40d</span>
                </ZonaDrop>

                {/* Eletrodo (item arrastável) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('eletrodo')}`}
                    draggable={isItem('eletrodo') && !eletrodoImergido}
                    onDragStart={e => handleDragStart('eletrodo', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: isItem('eletrodo') && !eletrodoImergido ? 'grab' : 'default' }}>
                    <EletrodoCondAlcoolSVG imerso={eletrodoImergido} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: eletrodoImergido ? '#38bdf8' : '#e7e5e4' }}>
                    {isItem('eletrodo') && !eletrodoImergido ? '🖱️ ' : ''}Eletrodo CDC401
                  </span>
                  <span style={{ fontSize: 8, color: eletrodoImergido ? '#38bdf8' : '#94a3b8' }}>
                    {eletrodoImergido ? '⚡ Imerso' : 'IntelliCAL'}
                  </span>
                </div>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ PAINÉIS DE AÇÃO ══════════════════════════════════════ */}
            {(mostrarBotaoResfriar || resfriando || mostrarBotaoCertif) && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '12px 18px', border: `1px solid ${resfriando ? 'rgba(56,189,248,0.40)' : 'rgba(34,211,238,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                {resfriando ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, animation: 'cdaTimerPulse 1s ease-in-out infinite' }}>
                        ❄ Resfriando a Amostra de Álcool...
                      </div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Aguardando a amostra atingir temperatura ambiente.</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressoResf}%`, background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', borderRadius: 4, transition: 'width 0.1s linear' }} />
                      </div>
                      <div style={{ fontSize: 8, color: '#0ea5e9', marginTop: 3 }}>{Math.floor(progressoResf)}%</div>
                    </div>
                  </>
                ) : mostrarBotaoResfriar ? (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>❄ Resfriar a Amostra de Álcool até Temperatura Ambiente</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>A leitura de condutividade deve ser realizada com a amostra na temperatura ambiente.</div>
                    </div>
                    <button onClick={handleResfriar}
                      style={{ background: 'linear-gradient(90deg,#0891b2,#0ea5e9)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.35)', whiteSpace: 'nowrap' }}>
                      ❄ Resfriar Amostra
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>📋 Verificar Certificado de Calibração do Condutivímetro</div>
                      <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Confirme que o condutivímetro está calibrado com o padrão NIST 1413 e dentro da validade.</div>
                    </div>
                    <button onClick={handleVerificarCertificado}
                      style={{ background: 'linear-gradient(90deg,#0369a1,#0891b2)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.35)', whiteSpace: 'nowrap' }}>
                      📋 Verificar Certificado
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ══ ZONA INFERIOR: AMOSTRA ═══════════════════════════════ */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(240,230,160,0.85)" label="Álcool" sub="Amostra" nivel={nivelAmostra} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Frasco de Álcool</span>
                </ItemBancada>
                {amostraNoBequer && <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>✓ No Béquer</span>}
              </div>
            </div>

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

export default CondutividadeAlcool;
