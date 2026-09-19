/**
 * phAlcool.jsx — Determinação de pH em Álcool
 *
 * Fluxo: Amostra de Álcool → Béquer 50 mL → Verificar Calibração
 *        → Imergir Eletrodo → Estabilizar → Ler pH
 *        → Avaliação de Conformidade (faixa 6,0 a 8,0)
 *
 * Equipamento: pHmetro HACH HQd · Eletrodo IntelliCAL PHC101
 * Faixa de conformidade: pH 6,0 a 8,0
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
import { useSimuladorDragPhAlcool } from '../hooks/useSimuladorDragPhAlcool';
import { etapas } from '../fermentacao/data/etapasPhAlcool';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes phaTimerPulse {
    0%,100% { opacity: 0.62; }
    50%     { opacity: 1.00; }
  }
  @keyframes phaBlink {
    0%,49%  { opacity: 1; }
    50%,100%{ opacity: 0.30; }
  }
  @keyframes phaBulbGlow {
    0%,100% { filter: drop-shadow(0 0 3px rgba(250,204,21,0.40)); }
    50%     { filter: drop-shadow(0 0 10px rgba(250,204,21,0.72)); }
  }
`;


/* ═══════════════════════════════════════════════════════════
   SVG — pHMETRO HACH HQd — pH Álcool
═══════════════════════════════════════════════════════════ */
const PhmetroAlcoolSVG = ({
  calibrado = false,
  eletrodoImergido = false,
  estabilizando = false,
  progressoEst = 0,
  pronto = false,
  lendo = false,
  ph = null,
  emConformidade = null,
  lerAtivo = false,
  onLer,
}) => (
  <svg width="165" height="236" viewBox="0 0 210 300">
    <defs>
      <linearGradient id="phaBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#222222" />
        <stop offset="8%"   stopColor="#3a3a3a" />
        <stop offset="50%"  stopColor="#424242" />
        <stop offset="92%"  stopColor="#3a3a3a" />
        <stop offset="100%" stopColor="#222222" />
      </linearGradient>
      <linearGradient id="phaKeypad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#3c3c3c" />
        <stop offset="100%" stopColor="#2a2a2a" />
      </linearGradient>
      <linearGradient id="phaBtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#525252" />
        <stop offset="40%"  stopColor="#464646" />
        <stop offset="100%" stopColor="#303030" />
      </linearGradient>
      <linearGradient id="phaLcd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#0a1200" />
        <stop offset="100%" stopColor="#060e00" />
      </linearGradient>
      <radialGradient id="phaPort" cx="50%" cy="40%" r="60%">
        <stop offset="0%"   stopColor="#4a4a4a" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </radialGradient>
      <filter id="phaSh"><feDropShadow dx="3" dy="6" stdDeviation="7" floodOpacity=".55" /></filter>
    </defs>

    <ellipse cx={105} cy={296} rx={85} ry={6} fill="rgba(0,0,0,0.22)" />

    {/* Bumpers laranja */}
    <rect x="2"   y="2"   width="26" height="22" rx="8" fill="#f5a500" />
    <rect x="182" y="2"   width="26" height="22" rx="8" fill="#f5a500" />
    <rect x="2"   y="276" width="26" height="22" rx="8" fill="#f5a500" />
    <rect x="182" y="276" width="26" height="22" rx="8" fill="#f5a500" />

    {/* Corpo */}
    <g filter="url(#phaSh)">
      <rect x="6" y="6" width="198" height="288" rx="16"
        fill="url(#phaBody)" stroke="#181818" strokeWidth="1.8" />
    </g>

    {/* Grip */}
    {[0,3,6,9,12].map(i => (
      <rect key={i} x={7} y={120+i*8} width={5} height={5} rx={1.5} fill="rgba(0,0,0,0.45)" />
    ))}
    {[0,3,6,9,12].map(i => (
      <rect key={i} x={198} y={120+i*8} width={5} height={5} rx={1.5} fill="rgba(0,0,0,0.45)" />
    ))}

    {/* Faixa laranja topo */}
    <rect x="6" y="6" width="198" height="34" rx="16" fill="#f5a500" />
    <rect x="6" y="24" width="198" height="16" fill="#f5a500" />
    <text x="105" y="24" textAnchor="middle" fontSize="14"
      fill="white" fontFamily="Arial Black, sans-serif" fontWeight="900" letterSpacing="4">HACH</text>
    <text x="105" y="35" textAnchor="middle" fontSize="6.5"
      fill="rgba(255,255,255,0.82)" fontFamily="Arial, sans-serif" letterSpacing="1.5">HQd  pH  ÁLCOOL</text>

    {/* Porta IntelliCAL */}
    <circle cx="105" cy="55" r="14" fill="url(#phaPort)" stroke="#555" strokeWidth="1.2" />
    <circle cx="105" cy="55" r="9" fill="#0d0d0d" stroke="#444" strokeWidth="1" />
    <circle cx="102" cy="52" r="1.4" fill="#8a8a8a" />
    <circle cx="108" cy="52" r="1.4" fill="#8a8a8a" />
    <circle cx="105" cy="58" r="1.4" fill="#8a8a8a" />
    <rect x="103.5" y="44" width="3" height="4" rx="1" fill="#5a5a5a" />
    <text x="105" y="76" textAnchor="middle" fontSize="5.5" fill="#888" fontFamily="monospace">CH1 · IntelliCAL pH</text>

    {/* LED */}
    <circle cx="185" cy="55" r="5"
      fill={ph ? (emConformidade ? '#22c55e' : '#f59e0b') : pronto ? '#22c55e' : estabilizando ? '#f59e0b' : calibrado ? '#3b82f6' : '#444'}
      stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
    {(pronto || ph) && (
      <circle cx="185" cy="55" r="9" fill="none"
        stroke={ph ? (emConformidade ? 'rgba(34,197,94,0.42)' : 'rgba(245,158,11,0.42)') : 'rgba(34,197,94,0.38)'}
        strokeWidth="2">
        <animate attributeName="opacity" from="1" to="0" dur="1.2s" repeatCount="indefinite" />
      </circle>
    )}
    <text x="185" y="68" textAnchor="middle" fontSize="5" fill="#666" fontFamily="monospace">PWR</text>

    {/* Bezel */}
    <rect x="14" y="82" width="182" height="116" rx="7" fill="#0a0a0a" stroke="#1e1e1e" strokeWidth="1.5" />

    {/* LCD */}
    <rect x="18" y="86" width="174" height="108" rx="5" fill="url(#phaLcd)" />
    <rect x="19" y="87" width="172" height="106" rx="4" fill="rgba(10,25,0,0.35)" />

    {/* Barra topo LCD */}
    <rect x="18" y="86" width="174" height="15" rx="4" fill="rgba(15,40,0,0.55)" />
    <text x="24" y="97" fontSize="6.5" fill="#88dd00" fontFamily="monospace" fontWeight="700">CH1 · pH ÁLCOOL</text>
    <rect x="134" y="88.5" width="24" height="10" rx="2" fill="rgba(20,60,0,0.55)" stroke="#446600" strokeWidth="0.6" />
    <text x="146" y="96" textAnchor="middle" fontSize="6" fill="#88bb00" fontFamily="monospace">ATC ✓</text>
    <rect x="174" y="89" width="12" height="7" rx="1.5" fill="none" stroke="#66aa00" strokeWidth="0.8" />
    <rect x="186" y="91" width="2.5" height="3" rx="0.8" fill="#66aa00" />
    <rect x="174.5" y="89.5" width={ph ? 11 : 7} height="6" rx="1" fill={ph ? '#88dd00' : '#448800'} />

    {/* Conteúdo LCD */}
    {ph !== null ? (
      <g>
        <text x="105" y="130" textAnchor="middle" fontSize="40"
          fill={emConformidade ? '#aaff00' : '#fbbf24'}
          fontFamily="'Courier New', monospace" fontWeight="700" letterSpacing="2">
          {ph}
        </text>
        <text x="180" y="130" textAnchor="end" fontSize="12"
          fill={emConformidade ? '#88cc00' : '#d97706'} fontFamily="monospace">pH</text>
        <rect x="22" y="114" width="16" height="10" rx="2" fill={emConformidade ? 'rgba(40,100,0,0.22)' : 'rgba(100,60,0,0.22)'} stroke={emConformidade ? '#44aa00' : '#aa8800'} strokeWidth="0.8" />
        <text x="30" y="122" textAnchor="middle" fontSize="7" fill={emConformidade ? '#88cc00' : '#fbbf24'} fontFamily="monospace">SBL</text>
        <line x1="19" y1="138" x2="191" y2="138" stroke="rgba(50,100,0,0.28)" strokeWidth="0.7" />
        <text x="24" y="150" fontSize="7.5" fill="#66aa00" fontFamily="monospace">25,0 °C</text>
        <text x="188" y="150" textAnchor="end" fontSize="7"
          fill={emConformidade ? '#22c55e' : '#f59e0b'}
          fontFamily="monospace" fontWeight="700">
          {emConformidade ? '✓ 6,0–8,0' : '⚠ 6,0–8,0'}
        </text>
        <line x1="19" y1="158" x2="191" y2="158" stroke="rgba(40,80,0,0.22)" strokeWidth="0.6" />
        {['CAL','MENU','LOG'].map((lbl, i) => (
          <text key={lbl} x={35 + i*67} y="170" textAnchor="middle"
            fontSize="6" fill="#336600" fontFamily="monospace">{lbl}</text>
        ))}
      </g>
    ) : lendo ? (
      <g>
        <text x="105" y="120" textAnchor="middle" fontSize="30"
          fill="#fbbf24" fontFamily="'Courier New', monospace"
          style={{ animation: 'phaBlink 0.4s linear infinite' }}>
          - - . - -
        </text>
        <text x="180" y="120" textAnchor="end" fontSize="11" fill="#d97706" fontFamily="monospace">pH</text>
        <rect x="24" y="134" width="162" height="7" rx="3.5" fill="rgba(255,255,255,0.07)" />
        <rect x="24" y="134" width="0" height="7" rx="3.5" fill="rgba(245,158,11,0.65)">
          <animate attributeName="width" from="0" to="162" dur="2.5s" fill="freeze" />
        </rect>
        <text x="105" y="156" textAnchor="middle" fontSize="6.5" fill="#78716c" fontFamily="monospace">Calculando pH do álcool...</text>
      </g>
    ) : estabilizando ? (
      <g>
        <text x="24" y="112" fontSize="6.5" fill="#f59e0b" fontFamily="monospace">ESTABILIZANDO</text>
        <text x="165" y="112" fontSize="9" fill="#d97706" fontFamily="monospace">&lt; &lt;</text>
        <text x="105" y="136" textAnchor="middle" fontSize="28"
          fill="#fbbf24" fontFamily="'Courier New', monospace"
          style={{ animation: 'phaBlink 0.9s linear infinite' }}>
          {(6.0 + progressoEst * 0.025).toFixed(2)}
        </text>
        <text x="180" y="136" textAnchor="end" fontSize="10" fill="#d97706" fontFamily="monospace">pH</text>
        <line x1="19" y1="143" x2="191" y2="143" stroke="rgba(150,80,0,0.18)" strokeWidth="0.7" />
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
        <text x="105" y="134" textAnchor="middle" fontSize="22" fill="#aaff00" fontFamily="'Courier New', monospace">PRONTO</text>
        <line x1="19" y1="142" x2="191" y2="142" stroke="rgba(50,100,0,0.22)" strokeWidth="0.7" />
        <text x="105" y="156" textAnchor="middle" fontSize="7" fill="#16a34a" fontFamily="sans-serif">Eletrodo estabilizado</text>
        <text x="105" y="168" textAnchor="middle" fontSize="7" fill="#15803d" fontFamily="sans-serif">Clique em LER pH</text>
      </g>
    ) : calibrado && eletrodoImergido ? (
      <g>
        <text x="24" y="110" fontSize="6.5" fill="#3b82f6" fontFamily="monospace">ELETRODO OK</text>
        <text x="105" y="130" textAnchor="middle" fontSize="18" fill="#60a5fa" fontFamily="'Courier New', monospace">AGUARD...</text>
        <text x="105" y="155" textAnchor="middle" fontSize="7" fill="#3a6a9a" fontFamily="sans-serif">Bulbo imerso no álcool</text>
        <text x="105" y="167" textAnchor="middle" fontSize="7" fill="#2a5080" fontFamily="sans-serif">Aguardando estabilização</text>
      </g>
    ) : calibrado ? (
      <g>
        <text x="24" y="108" fontSize="6" fill="#3b82f6" fontFamily="monospace">CAL ✓  PRONTO P/ USO</text>
        <text x="105" y="130" textAnchor="middle" fontSize="20" fill="#3b82f6" fontFamily="'Courier New', monospace">CAL ✓</text>
        <text x="105" y="155" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="sans-serif">pHmetro calibrado</text>
        <text x="105" y="167" textAnchor="middle" fontSize="7" fill="#3a6a9a" fontFamily="sans-serif">Imergir eletrodo no álcool</text>
      </g>
    ) : (
      <g>
        <text x="24" y="108" fontSize="6" fill="#3a5a2a" fontFamily="monospace">STANDBY</text>
        <text x="105" y="130" textAnchor="middle" fontSize="20" fill="#2a4a1a" fontFamily="'Courier New', monospace">- - . - -</text>
        <text x="105" y="155" textAnchor="middle" fontSize="7" fill="#1e3814" fontFamily="sans-serif">Verificar certificado</text>
        <text x="105" y="167" textAnchor="middle" fontSize="7" fill="#162c10" fontFamily="sans-serif">de calibração</text>
      </g>
    )}

    {/* Botões */}
    <rect x="12" y="202" width="186" height="82" rx="8" fill="url(#phaKeypad)" />
    {[{x:42,l:'◄'},{x:105,l:'▲'},{x:168,l:'►'}].map(({x,l}) => (
      <g key={l}>
        <rect x={x-15} y="208" width="30" height="20" rx="6" fill="url(#phaBtn)" stroke="#1e1e1e" strokeWidth="0.8" />
        <rect x={x-14} y="208.5" width="28" height="7" rx="4" fill="rgba(255,255,255,0.09)" />
        <text x={x} y="221.5" textAnchor="middle" fontSize="10" fill="#c8c8c8" fontFamily="Arial">{l}</text>
      </g>
    ))}
    <g>
      <rect x="90" y="233" width="30" height="20" rx="6" fill="url(#phaBtn)" stroke="#1e1e1e" strokeWidth="0.8" />
      <rect x="91" y="233.5" width="28" height="7" rx="4" fill="rgba(255,255,255,0.09)" />
      <text x="105" y="246.5" textAnchor="middle" fontSize="10" fill="#c8c8c8" fontFamily="Arial">▼</text>
    </g>
    {[{x:42,l:'BACK'},{x:168,l:'MENU'}].map(({x,l}) => (
      <g key={l}>
        <rect x={x-20} y="233" width="40" height="20" rx="6" fill="url(#phaBtn)" stroke="#1e1e1e" strokeWidth="0.8" />
        <rect x={x-19} y="233.5" width="38" height="7" rx="4" fill="rgba(255,255,255,0.09)" />
        <text x={x} y="246.5" textAnchor="middle" fontSize="7" fill="#b0b0b0" fontFamily="Arial" fontWeight="700">{l}</text>
      </g>
    ))}

    {/* Botão LER pH */}
    <g onClick={onLer} style={{ cursor: lerAtivo ? 'pointer' : 'default' }}>
      <rect x="22" y="258" width="166" height="22" rx="8"
        fill={lerAtivo ? '#4a2800' : '#222222'}
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
        fill={lerAtivo ? '#ffdd00' : '#505050'} fontFamily="Arial"
        fontWeight={lerAtivo ? '700' : '400'} letterSpacing="2">LER pH</text>
    </g>

    {/* USB + base */}
    <rect x="199" y="155" width="7" height="12" rx="2" fill="#0d0d0d" stroke="#3a3a3a" strokeWidth="0.8" />
    <rect x="6" y="280" width="198" height="12" rx="6" fill="#f5a500" opacity="0.60" />
    <ellipse cx="105" cy="290" rx="7" ry="4.5" fill="none" stroke="#f5a500" strokeWidth="2.5" />
    <text x="105" y="297" textAnchor="middle" fontSize="5" fill="#3a3a3a" fontFamily="monospace">
      HACH HQd · pH Álcool · IntelliCAL
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — ELETRODO DE pH (item arrastável)
═══════════════════════════════════════════════════════════ */
const EletrodoAlcoolSVG = ({ imerso = false }) => (
  <svg width="44" height="128" viewBox="0 0 44 128" opacity={imerso ? 0.18 : 1}>
    <defs>
      <linearGradient id="elaC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1c1c1c" />
        <stop offset="40%" stopColor="#303030" />
        <stop offset="100%" stopColor="#1c1c1c" />
      </linearGradient>
    </defs>
    <ellipse cx={22} cy={126} rx={9} ry={3} fill="rgba(0,0,0,0.14)" />
    <rect x={19} y={0} width={6} height={26} rx={3} fill="#1a1a1a" />
    {[3,7,11,15,19,23].map(y => (
      <rect key={y} x={18} y={y} width={8} height={2} rx={1.2} fill="rgba(0,0,0,0.50)" />
    ))}
    <rect x={13} y={25} width={18} height={10} rx={3.5} fill="#3d3d3d" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx={19.5} cy={30} r={1.3} fill="#707070" />
    <circle cx={24.5} cy={30} r={1.3} fill="#707070" />
    <rect x={16} y={35} width={12} height={5} rx={2.5} fill="#f5a500" stroke="#c08000" strokeWidth="0.7" />
    <rect x={16} y={40} width={12} height={62} rx={3} fill="url(#elaC)" stroke="#0d0d0d" strokeWidth="0.8" />
    <rect x={17} y={47} width={11} height={32} rx={1.5} fill="#f0f0f0" stroke="#c8c8c8" strokeWidth="0.4" />
    <rect x={17} y={47} width={11} height={4} rx={1.5} fill="#f5a500" />
    <text x={22} y={50} textAnchor="middle" fontSize="3" fill="white" fontFamily="Arial" fontWeight="700">HACH</text>
    <text x={22} y={57} textAnchor="middle" fontSize="3.5" fill="#1a1a1a" fontFamily="Arial" fontWeight="700">PHC101</text>
    <text x={22} y={64} textAnchor="middle" fontSize="3" fill="#333" fontFamily="Arial">pH 0–14</text>
    <text x={22} y={71} textAnchor="middle" fontSize="5" fill="#c2410c" fontFamily="Arial" fontWeight="900">pH</text>
    <line x1={17.5} y1={74} x2={26.5} y2={74} stroke="#c8c8c8" strokeWidth="0.4" />
    <text x={22} y={78} textAnchor="middle" fontSize="3" fill="#888" fontFamily="monospace">NIST SRM 185</text>
    <rect x={14} y={102} width={16} height={4} rx={2} fill="#2a2a2a" stroke="#0d0d0d" strokeWidth="0.8" />
    <rect x={20.5} y={106} width={3} height={6} rx={0.8} fill="rgba(190,220,255,0.55)" stroke="#8fb8d8" strokeWidth="0.6" />
    <circle cx={22} cy={118} r={6} fill="rgba(195,230,255,0.72)" stroke="#8fb8d8" strokeWidth="1.3" />
    <circle cx={22} cy={118} r={4} fill="rgba(155,210,240,0.38)" />
    <ellipse cx={22} cy={115} rx={3} ry={1.4} fill="rgba(200,230,250,0.52)" />
    <rect x={27} y={115.5} width={2} height={3} rx={0.7} fill="rgba(180,200,220,0.75)" />
    <ellipse cx={19.5} cy={113.5} rx={1.6} ry={2.5}
      fill="rgba(255,255,255,0.30)" transform="rotate(-20 19.5 113.5)" />
    <text x={22} y={127} textAnchor="middle" fontSize="5" fill="#5a5a5a" fontFamily="sans-serif">Eletrodo pH</text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const PhAlcool = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'pha-anim-styles';
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

  // ── Certificado de calibração ─────────────────────────
  const [mostrarCertificado, setMostrarCertificado] = useState(false);
  const [certificadoVerific, setCertificadoVerific] = useState(false);

  // ── Eletrodo ──────────────────────────────────────────
  const [eletrodoImergido, setEletrodoImergido] = useState(false);

  // ── Estabilização ─────────────────────────────────────
  const [estabilizando, setEstabilizando] = useState(false);
  const [progressoEst,  setProgressoEst]  = useState(0);
  const [pronto,        setPronto]        = useState(false);

  // ── Leitura ───────────────────────────────────────────
  const [lendo,    setLendo]    = useState(false);
  const [ph,       setPh]       = useState(null);

  // Conformidade: faixa pH 6,0 a 8,0
  const emConformidade = ph !== null ? (parseFloat(ph) >= 6.0 && parseFloat(ph) <= 8.0) : null;

  // ── TIMER: Estabilização (step 3, 3s) ─────────────────
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
      proximaEtapa(); // → step 4
    }, 3000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [estabilizando]);

  // ── TIMER: auto-conclusão (step 5) ────────────────────
  useEffect(() => {
    if (etapaAtual !== 5) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2200);
    return () => clearTimeout(id);
  }, [etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragPhAlcool(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra,
    setNivelBequer, setCorBequer, setAmostraNoBequer,
    setEletrodoImergido, setEstabilizando,
  });

  // ── Click: Abrir certificado (step 1) ─────────────────
  const handleVerificarCertificado = () => {
    if (etapaAtual !== 1) return;
    setMostrarCertificado(true);
  };

  // ── Click: Confirmar certificado ──────────────────────
  const handleConfirmarCertificado = () => {
    setMostrarCertificado(false);
    setCertificadoVerific(true);
    celebrarAcerto(150);
    proximaEtapa(); // → step 2
  };

  // ── Click: Ler pH (step 4) ────────────────────────────
  const handleLerPh = () => {
    if (etapaAtual !== 4 || !pronto || lendo || ph) return;
    setLendo(true);
    setTimeout(() => {
      // Gera pH entre 5.8 e 8.5 — permite resultados fora da faixa para didática
      const rawPh = parseFloat((Math.random() * 2.7 + 5.8).toFixed(2));
      setPh(rawPh.toFixed(2));
      setLendo(false);
      celebrarAcerto(200);
      proximaEtapa(); // → step 5
    }, 2500);
  };

  const mostrarBotaoCertif = etapaAtual === 1 && !certificadoVerific;
  const lerAtivo           = etapaAtual === 4 && pronto && !lendo && !ph;


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
          <div style={{ background: 'linear-gradient(135deg,#0f2137,#1a3050)', border: '2px solid #f59e0b', borderRadius: 20, padding: '32px 40px', textAlign: 'center', color: 'white', maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.70)' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fbbf24', margin: '0 0 4px' }}>Certificado de Calibração</h3>
            <p style={{ color: '#64748b', fontSize: 11, margin: '0 0 20px' }}>pHmetro — Verificação de Rastreabilidade</p>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '16px 22px', marginBottom: 20, textAlign: 'left' }}>
              {[
                { label: 'Equipamento',        val: 'pHmetro Portátil HACH' },
                { label: 'Modelo / Série',     val: 'HQd · Nº 2024-0919' },
                { label: 'Nº de pontos',       val: '2 pontos (pH 4,00 / pH 7,00)' },
                { label: 'Tampão pH 4,00',     val: 'NIST SRM 185 · Ftalato ácido' },
                { label: 'Tampão pH 7,00',     val: 'NIST SRM 188 · Fosfato' },
                { label: 'Data de calibração', val: '01/06/2025' },
                { label: 'Validade',           val: '01/06/2026' },
                { label: 'Laboratório',        val: 'Metrologia Acreditada INMETRO' },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 6, fontSize: 11 }}>
                  <span style={{ color: '#64748b' }}>{label}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'monospace' }}>{val}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(245,158,11,0.20)', paddingTop: 10, marginTop: 8, textAlign: 'center' }}>
                <span style={{ background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.40)', color: '#4ade80', borderRadius: 8, padding: '4px 16px', fontSize: 12, fontWeight: 700 }}>
                  ✓ CERTIFICADO VÁLIDO
                </span>
              </div>
            </div>
            <button onClick={handleConfirmarCertificado}
              style={{ background: 'linear-gradient(90deg,#d97706,#b45309)', color: 'white', border: 'none', borderRadius: 10, padding: '11px 32px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(217,119,6,0.40)' }}>
              ✓ Confirmar — pHmetro Calibrado
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

      {/* ── BANNER RESULTADO ── */}
      {ph && etapaAtual >= 5 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: emConformidade ? 'linear-gradient(135deg,#14532d,#166534,#16a34a)' : 'linear-gradient(135deg,#713f12,#92400e,#b45309)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {emConformidade ? '✅ pH Dentro da Especificação!' : '⚠️ pH Fora da Especificação!'}
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              pH = <strong>{ph}</strong> · Faixa: 6,0 a 8,0
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUSÃO ── */}
      {concluido && ph && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: `2px solid ${emConformidade ? '#f59e0b' : '#b45309'}`, borderRadius: 24, padding: '48px 56px', textAlign: 'center', color: 'white', maxWidth: 480, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 72 }}>{emConformidade ? '🟡' : '⚠️'}</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fbbf24', margin: '12px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 22px' }}>
              Determinação de pH em Álcool · pHmetro HACH HQd · IntelliCAL PHC101
            </p>

            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 14, padding: '16px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Equipamento',  val: 'pHmetro HACH HQd',  cor: '#fbbf24' },
                  { label: 'Eletrodo',     val: 'IntelliCAL PHC101', cor: '#f59e0b' },
                  { label: 'Calibrado',    val: '✓ 2 pontos',        cor: '#4ade80' },
                  { label: 'Temperatura',  val: '25,0 °C (ATC)',     cor: '#a78bfa' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: emConformidade ? 'rgba(245,158,11,0.12)' : 'rgba(180,83,9,0.18)', border: `1px solid ${emConformidade ? 'rgba(245,158,11,0.38)' : 'rgba(180,83,9,0.50)'}`, borderRadius: 14, padding: '20px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>pH Medido</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: emConformidade ? '#f59e0b' : '#f97316', fontFamily: 'monospace', lineHeight: 1 }}>{ph}</div>
              <div style={{ fontSize: 16, color: emConformidade ? '#fbbf24' : '#fb923c', fontWeight: 700, marginTop: 6 }}>unidades de pH</div>
            </div>

            {/* Conformidade */}
            <div style={{ background: emConformidade ? 'rgba(34,197,94,0.12)' : 'rgba(234,88,12,0.12)', border: `1px solid ${emConformidade ? 'rgba(34,197,94,0.38)' : 'rgba(234,88,12,0.38)'}`, borderRadius: 14, padding: '14px 28px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Conformidade · Faixa Especificada: pH 6,0 a 8,0</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: emConformidade ? '#4ade80' : '#f87171' }}>
                {emConformidade ? '✅ DENTRO DA ESPECIFICAÇÃO' : '⚠️ FORA DA ESPECIFICAÇÃO'}
              </div>
              {!emConformidade && (
                <div style={{ fontSize: 11, color: '#f97316', marginTop: 6 }}>
                  pH medido ({ph}) está fora da faixa de 6,0 a 8,0
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 10, padding: '8px 16px', marginBottom: 20, fontSize: 10, color: '#34d399' }}>
              ✓ Leitura realizada com sucesso · Método pH direto · HACH HQd
            </div>

            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 20 }}>🏆 Pontuação Final: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#d97706,#b45309)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
        titulo="Determinação de pH — Álcool"
        subtitulo={"pHmetro HACH HQd · Eletrodo IntelliCAL\nFaixa de conformidade: pH 6,0 a 8,0"}
        icone="🟡"
        badges={['🍺 FERMENTAÇÃO', '🟡 pH']}
        footerLabel="🟡 pH — Álcool"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 640 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🟡 Bancada — Determinação de pH em Álcool · Faixa: 6,0 a 8,0
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
                      <BequerSVG nivel={nivelBequer} cor={corBequer} id="pha50" ml={150} />
                      {/* Overlay eletrodo imerso */}
                      {eletrodoImergido && (
                        <svg width="78" height="106" viewBox="0 0 78 106"
                          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                          <line x1="39" y1="0" x2="39" y2="18" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                          <rect x="33" y="18" width="12" height="5" rx="2" fill="#475569" stroke="#334155" strokeWidth="0.8" />
                          <rect x="35" y="23" width="8" height="3.5" rx="1.5" fill="#f5a500" />
                          <rect x="37" y="26.5" width="4" height="24" rx="1.5" fill="rgba(45,75,105,0.88)" stroke="#334155" strokeWidth="0.8" />
                          <rect x="38.5" y="50.5" width="2.5" height="6" rx="0.8" fill="rgba(190,220,255,0.55)" stroke="#8fb8d8" strokeWidth="0.6" />
                          <circle cx="39" cy="62" r="6" fill="rgba(195,230,255,0.70)" stroke="#8fb8d8" strokeWidth="1.3"
                            style={{ animation: 'phaBulbGlow 2s ease-in-out infinite' }} />
                          <circle cx="39" cy="62" r="4" fill="rgba(155,210,240,0.38)" />
                          <ellipse cx="39" cy="59" rx="3" ry="1.4" fill="rgba(200,230,250,0.52)" />
                          <rect x="27" y="59" width="2" height="3" rx="0.7" fill="rgba(180,200,220,0.75)" />
                          <ellipse cx="36.5" cy="57.5" rx="1.6" ry="2.5" fill="rgba(255,255,255,0.30)" transform="rotate(-22 36.5 57.5)" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>Béquer 50 mL</span>
                    <span style={{ fontSize: 8, color: eletrodoImergido ? '#fbbf24' : amostraNoBequer ? '#f59e0b' : '#94a3b8' }}>
                      {eletrodoImergido   ? '🟡 Eletrodo imerso'
                        : amostraNoBequer ? '🍺 Amostra de álcool'
                        : 'Vazio — adicione amostra'}
                    </span>
                  </div>
                </ZonaDrop>
              </div>

              {/* ─ pHMETRO + ELETRODO ─ */}
              <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16 }}>
                {/* pHmetro */}
                <ZonaDrop id="phmetro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div className={dropCls('phmetro')} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 13, padding: '10px 12px' }}>
                    <PhmetroAlcoolSVG
                      calibrado={certificadoVerific}
                      eletrodoImergido={eletrodoImergido}
                      estabilizando={estabilizando}
                      progressoEst={progressoEst}
                      pronto={pronto}
                      lendo={lendo}
                      ph={ph}
                      emConformidade={emConformidade}
                      lerAtivo={lerAtivo}
                      onLer={handleLerPh}
                    />
                    {lerAtivo && (
                      <div style={{ textAlign: 'center', fontSize: 8, color: '#fbbf24', fontWeight: 700, marginTop: 4 }}>
                        🟡 Clique em LER pH para registrar!
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e7e5e4' }}>pHmetro HACH HQd</span>
                </ZonaDrop>

                {/* Eletrodo (item arrastável) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    className={`item-drag ${itemCls('eletrodo')}`}
                    draggable={isItem('eletrodo') && !eletrodoImergido}
                    onDragStart={e => handleDragStart('eletrodo', e)}
                    onDragEnd={handleDragEnd}
                    style={{ cursor: isItem('eletrodo') && !eletrodoImergido ? 'grab' : 'default' }}>
                    <EletrodoAlcoolSVG imerso={eletrodoImergido} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: eletrodoImergido ? '#fbbf24' : '#e7e5e4' }}>
                    {isItem('eletrodo') && !eletrodoImergido ? '🖱️ ' : ''}Eletrodo pH
                  </span>
                  <span style={{ fontSize: 8, color: eletrodoImergido ? '#fbbf24' : '#94a3b8' }}>
                    {eletrodoImergido ? '🟡 Imerso' : 'IntelliCAL PHC101'}
                  </span>
                </div>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ PAINEL CERTIFICADO (step 1) ══════════════════════════ */}
            {mostrarBotaoCertif && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '12px 18px', border: 'rgba(34,211,238,0.22) 1px solid', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>📋 Verificar Certificado de Calibração do pHmetro</div>
                  <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Verifique se o pHmetro está calibrado com tampões NIST (pH 4,00 e pH 7,00) e dentro da validade.</div>
                </div>
                <button onClick={handleVerificarCertificado}
                  style={{ background: 'linear-gradient(90deg,#92400e,#b45309)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(180,83,9,0.35)', whiteSpace: 'nowrap' }}>
                  📋 Verificar Certificado
                </button>
              </div>
            )}

            {/* ══ PAINEL CONFORMIDADE (após leitura) ═══════════════════ */}
            {ph && etapaAtual >= 4 && (
              <div style={{ marginBottom: 14, background: emConformidade ? 'rgba(34,197,94,0.10)' : 'rgba(234,88,12,0.10)', borderRadius: 12, padding: '10px 18px', border: `1px solid ${emConformidade ? 'rgba(34,197,94,0.35)' : 'rgba(234,88,12,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: emConformidade ? '#4ade80' : '#f87171' }}>
                    {emConformidade ? '✅ pH DENTRO DA ESPECIFICAÇÃO' : '⚠️ pH FORA DA ESPECIFICAÇÃO'}
                  </div>
                  <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>
                    Faixa de conformidade: pH 6,0 a 8,0 · Resultado: pH {ph}
                  </div>
                </div>
                <div style={{ flexShrink: 0, background: emConformidade ? 'rgba(34,197,94,0.12)' : 'rgba(234,88,12,0.12)', borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: emConformidade ? '#4ade80' : '#f87171', fontFamily: 'monospace' }}>{ph}</div>
                  <div style={{ fontSize: 8, color: '#64748b' }}>pH</div>
                </div>
              </div>
            )}

            {/* ══ ZONA INFERIOR: AMOSTRA ═══════════════════════════════ */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(240,230,170,0.85)" label="Álcool" sub="Amostra" nivel={nivelAmostra} />
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

export default PhAlcool;
