/**
 * SilicaMk.jsx — Silicato (Ácido Silícico) — Kit Merck Spectroquant 100857
 *
 * Fluxo: Confirmar amostra → Tubo (5,0 mL) → R1 (0,5 mL) → R2 (4 gotas)
 *        → R3 (2,0 mL) → Timer 1 → R4 (4 gotas) → Timer 2
 *        → Transferir cubeta → Branco (H₂O) → ZERO + Método 100857
 *        → Cubeta amostra → LER → Resultado mg/L Si
 *
 * Equipamento: Merck Spectroquant Prove 300 · Método 100857
 * Solução padrão recomendada: Certipur 170236 · 1000 mg/L Si
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import CubetaSVG from '../components/lab/CubetaSVG';
import GotaCaindo from '../components/lab/GotaCaindo';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragSilicaMk } from '../hooks/useSimuladorDragSilicaMk';
import { etapas } from './data/etapasSilicaMk';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes smkDropFall {
    0%   { transform:translateX(-50%) translateY(0);   opacity:0;   }
    6%   { opacity:1; }
    65%  { transform:translateX(-50%) translateY(48px); opacity:.90;}
    100% { transform:translateX(-50%) translateY(68px); opacity:0;  }
  }
  @keyframes smkDropFall2 {
    0%   { transform:translateX(-50%) translateY(0);   opacity:0;   }
    6%   { opacity:.85;}
    65%  { transform:translateX(-50%) translateY(44px); opacity:.75;}
    100% { transform:translateX(-50%) translateY(62px); opacity:0;  }
  }
  @keyframes smkDropFall3 {
    0%   { transform:translateX(-50%) translateY(0);   opacity:0;   }
    6%   { opacity:.70;}
    65%  { transform:translateX(-50%) translateY(52px); opacity:.60;}
    100% { transform:translateX(-50%) translateY(72px); opacity:0;  }
  }
  @keyframes smkDropFall4 {
    0%   { transform:translateX(-50%) translateY(0);   opacity:0;   }
    6%   { opacity:.55;}
    65%  { transform:translateX(-50%) translateY(44px); opacity:.50;}
    100% { transform:translateX(-50%) translateY(62px); opacity:0;  }
  }
  @keyframes smkTimerPulse {
    0%,100% { opacity:.62; }
    50%     { opacity:1.00;}
  }
`;

/* ── Gota colorida para reagentes líquidos ── */
const GotaReagenteCaindo = ({ offsetX=0, animName='smkDropFall', delay=0, animKey='g', cor='rgba(215,55,42,0.88)' }) => (
  <div key={animKey} style={{
    position:'absolute', left:`calc(50% + ${offsetX}px)`, top:4,
    width:10, height:22, opacity:0, pointerEvents:'none', zIndex:30,
    animationName:animName, animationDuration:'0.55s',
    animationDelay:`${delay}ms`, animationFillMode:'forwards',
    animationTimingFunction:'ease-in',
  }}>
    <svg width="10" height="22" viewBox="0 0 10 22">
      <line x1="5" y1="1" x2="5" y2="9" stroke={cor} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <ellipse cx="5" cy="16" rx="4" ry="5.5" fill={cor} />
      <ellipse cx="3.5" cy="13.5" rx="1.2" ry="1.8" fill="rgba(255,255,255,0.35)" />
    </svg>
  </div>
);


/* ═══════════════════════════════════════════════════════════
   SVG — TUBO DE REAÇÃO (vial de vidro)
═══════════════════════════════════════════════════════════ */
const TuboReacaoSVG = ({ nivel=0, cor='rgba(220,235,255,0.08)' }) => {
  const liqH = Math.max(0, nivel / 100 * 80);
  return (
    <svg width="72" height="140" viewBox="0 0 72 140">
      <defs>
        <linearGradient id="trBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,228,248,0.50)" />
          <stop offset="18%"  stopColor="rgba(220,240,255,0.18)" />
          <stop offset="50%"  stopColor="rgba(200,228,248,0.07)" />
          <stop offset="82%"  stopColor="rgba(220,240,255,0.14)" />
          <stop offset="100%" stopColor="rgba(200,228,248,0.38)" />
        </linearGradient>
        <clipPath id="trClip">
          <path d="M 20,20 L 20,115 Q 20,132 36,132 Q 52,132 52,115 L 52,20 Z" />
        </clipPath>
        <filter id="trSh"><feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity=".20" /></filter>
      </defs>
      <ellipse cx={36} cy={137} rx={20} ry={4} fill="rgba(0,0,0,0.14)" />
      <g filter="url(#trSh)">
        <path d="M 20,20 L 20,115 Q 20,132 36,132 Q 52,132 52,115 L 52,20 Z"
          fill="url(#trBody)" stroke="#8fb8d8" strokeWidth="1.5" />
      </g>
      {/* Líquido */}
      <g clipPath="url(#trClip)">
        <rect x={20} y={132 - liqH} width={32} height={liqH} fill={cor} opacity="0.86" />
        {nivel > 2 && nivel < 97 && (
          <ellipse cx={36} cy={132 - liqH} rx={12} ry={2}
            fill={cor} opacity="0.30" />
        )}
      </g>
      {/* Brilho lateral */}
      <path d="M 21,22 L 21,110 L 24,110 L 24,22 Z"
        fill="rgba(255,255,255,0.30)" clipPath="url(#trClip)" />
      {/* Tampa/boca */}
      <rect x={17} y={8} width={38} height={16} rx={4}
        fill="rgba(200,228,248,0.28)" stroke="#8fb8d8" strokeWidth="1.3" />
      <rect x={19} y={9} width={10} height={12} rx={2} fill="rgba(255,255,255,0.16)" />
      {/* Graduações */}
      {[25,40,55,70,85,100].map((y, i) => (
        <g key={i}>
          <line x1={52} y1={y} x2={i%2===0?60:57} y2={y}
            stroke="rgba(14,50,140,0.60)" strokeWidth={i%2===0?1.1:0.7} />
          {i%2===0 && (
            <text x={63} y={y+3.5} fontSize="6.5" fill="rgba(12,45,130,0.70)"
              fontFamily="monospace">{(6-i)}mL</text>
          )}
        </g>
      ))}
      <text x={36} y={6} textAnchor="middle" fontSize="6"
        fill="rgba(12,45,130,0.65)" fontFamily="sans-serif">10 mL</text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — SPECTROQUANT PROVE 300 (Merck)
═══════════════════════════════════════════════════════════ */
const SpectroquantSVG = ({
  cubetaDentro=false, corCubeta='rgba(45,90,200,0.88)',
  zerando=false, zerado=false, lendo=false, resultado=null,
  metodoSelecionado=false, zerAtivo=false, lerAtivo=false,
  onZero, onLer,
}) => (
  <svg width="230" height="200" viewBox="0 0 230 200">
    <defs>
      <linearGradient id="sqBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#e8eaec" />
        <stop offset="100%" stopColor="#cdd0d4" />
      </linearGradient>
      <linearGradient id="sqScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#002840" />
        <stop offset="100%" stopColor="#001a28" />
      </linearGradient>
      <filter id="sqSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".28" /></filter>
    </defs>
    {/* Corpo branco */}
    <g filter="url(#sqSh)">
      <rect x="4" y="4" width="222" height="192" rx="12"
        fill="url(#sqBody)" stroke="#b0b5ba" strokeWidth="1.5" />
    </g>
    {/* Header Merck */}
    <rect x="4" y="4" width="222" height="28" rx="12" fill="#cc0033" />
    <rect x="4" y="18" width="222" height="14" fill="#cc0033" />
    <text x="70" y="17" textAnchor="middle" fontSize="10"
      fill="white" fontFamily="Arial, sans-serif" fontWeight="900" letterSpacing="2">Merck</text>
    <text x="160" y="17" textAnchor="middle" fontSize="7.5"
      fill="rgba(255,255,255,0.85)" fontFamily="Arial, sans-serif" letterSpacing="1">Spectroquant®</text>
    <text x="113" y="26" textAnchor="middle" fontSize="6"
      fill="rgba(255,255,255,0.75)" fontFamily="Arial, sans-serif">Prove 300</text>

    {/* Display LCD */}
    <rect x="12" y="36" width="148" height="90" rx="6" fill="url(#sqScr)" stroke="#004060" strokeWidth="1.2" />
    <rect x="14" y="38" width="144" height="86" rx="5" fill="rgba(0,40,70,0.40)" />

    {/* Conteúdo display */}
    {resultado !== null ? (
      <>
        <text x="86" y="56" textAnchor="middle" fontSize="7" fill="#00aacc" fontFamily="monospace">MÉTODO 100857 · Si</text>
        <line x1="18" y1="60" x2="154" y2="60" stroke="rgba(0,170,204,0.22)" strokeWidth="0.8" />
        <text x="86" y="88" textAnchor="middle" fontSize="32"
          fill="#00ff88" fontFamily="'Courier New', monospace" fontWeight="700">{resultado}</text>
        <text x="154" y="88" textAnchor="end" fontSize="10"
          fill="#00cc66" fontFamily="monospace">mg/L Si</text>
        <text x="86" y="103" textAnchor="middle" fontSize="7" fill="#22c55e" fontFamily="monospace">✓ Leitura concluída</text>
        <text x="86" y="115" textAnchor="middle" fontSize="5.5" fill="#007744" fontFamily="sans-serif">Kit Merck 100857 · Silicato (Ác. Silícico)</text>
      </>
    ) : lendo ? (
      <>
        <text x="86" y="58" textAnchor="middle" fontSize="7" fill="#00aacc" fontFamily="monospace">MÉTODO 100857</text>
        <text x="86" y="80" textAnchor="middle" fontSize="14" fill="#fbbf24" fontFamily="monospace">Lendo...</text>
        <rect x="22" y="92" width="128" height="5" rx="2.5" fill="rgba(255,255,255,0.07)" />
        <rect x="22" y="92" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="128" dur="2.5s" fill="freeze" />
        </rect>
        <text x="86" y="112" textAnchor="middle" fontSize="6" fill="#78716c" fontFamily="monospace">Calculando concentração...</text>
      </>
    ) : zerando ? (
      <>
        <text x="86" y="55" textAnchor="middle" fontSize="7" fill="#00aacc" fontFamily="monospace">MÉTODO 100857</text>
        <text x="86" y="70" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="monospace">Zerando...</text>
        <rect x="22" y="80" width="128" height="5" rx="2.5" fill="rgba(255,255,255,0.07)" />
        <rect x="22" y="80" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
          <animate attributeName="width" from="0" to="128" dur="2s" fill="freeze" />
        </rect>
        <text x="86" y="98" textAnchor="middle" fontSize="6" fill="#78716c" fontFamily="monospace">Calibrando com H₂O destilada...</text>
        <text x="86" y="112" textAnchor="middle" fontSize="5.5" fill="#475569" fontFamily="monospace">Selecionando Método 100857...</text>
      </>
    ) : zerado ? (
      <>
        <text x="86" y="55" textAnchor="middle" fontSize="7" fill="#00aacc" fontFamily="monospace">MÉTODO 100857 ✓</text>
        <line x1="18" y1="59" x2="154" y2="59" stroke="rgba(0,170,204,0.22)" strokeWidth="0.8" />
        <text x="86" y="78" textAnchor="middle" fontSize="11" fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
        <text x="86" y="92" textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="monospace">0.000 mg/L Si</text>
        <text x="86" y="107" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Inserir cubeta da amostra</text>
      </>
    ) : cubetaDentro ? (
      <>
        <text x="86" y="55" textAnchor="middle" fontSize="7" fill="#00aacc" fontFamily="monospace">MÉTODO 100857</text>
        <text x="86" y="78" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
        <text x="86" y="93" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
        <text x="86" y="108" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">
          {zerAtivo ? 'Pressione ZERO' : lerAtivo ? 'Pressione LER' : 'Silicato 100857'}
        </text>
      </>
    ) : (
      <>
        <text x="86" y="57" textAnchor="middle" fontSize="9" fill="#004060" fontFamily="monospace">STANDBY</text>
        <text x="86" y="73" textAnchor="middle" fontSize="7" fill="#003050" fontFamily="monospace">Spectroquant®</text>
        <text x="86" y="86" textAnchor="middle" fontSize="6.5" fill="#002840" fontFamily="sans-serif">Aguardando cubeta...</text>
        {metodoSelecionado && (
          <text x="86" y="100" textAnchor="middle" fontSize="6" fill="#00aacc" fontFamily="monospace">Método 100857 carregado</text>
        )}
      </>
    )}

    {/* Compartimento de cubeta */}
    <rect x="168" y="36" width="58" height="90" rx="5" fill="#1a1a1a"
      stroke={cubetaDentro ? '#00cc66' : '#3a3a3a'} strokeWidth="1.5" />
    <text x="197" y="52" textAnchor="middle" fontSize="5.5" fill="#4a4a4a" fontFamily="monospace">CELL</text>
    {cubetaDentro ? (
      <g>
        <rect x="178" y="58" width="38" height="50" rx="2"
          fill={corCubeta} stroke="rgba(200,200,200,0.45)" strokeWidth="1" />
        <rect x="180" y="60" width="6" height="42" fill="rgba(255,255,255,0.14)" />
        <line x1="212" y1="66" x2="215" y2="66" stroke="rgba(200,200,200,0.65)" strokeWidth="1.2" />
      </g>
    ) : (
      <rect x="178" y="58" width="38" height="50" rx="2"
        fill="rgba(5,12,25,0.60)" stroke="#1a1a1a" strokeWidth="0.8" strokeDasharray="4,2" />
    )}
    <circle cx="163" cy="88" r="4"
      fill={cubetaDentro ? 'rgba(0,204,102,0.8)' : 'rgba(0,170,204,0.22)'}
      stroke="rgba(0,170,204,0.35)" strokeWidth="1" />

    {/* Painel de botões */}
    <rect x="12" y="133" width="212" height="52" rx="6" fill="#bfc2c6" stroke="#a0a5aa" strokeWidth="0.8" />

    {/* Botão ZERO */}
    <g onClick={onZero} style={{ cursor: zerAtivo ? 'pointer' : 'default' }}>
      <rect x="20" y="140" width="60" height="20" rx="4"
        fill={zerAtivo ? '#0f4020' : '#6b7280'}
        stroke={zerAtivo ? '#00cc44' : '#4b5563'} strokeWidth={zerAtivo ? 1.8 : 1} />
      {zerAtivo && (
        <rect x="20" y="140" width="60" height="20" rx="4"
          fill="none" stroke="rgba(0,204,80,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
        </rect>
      )}
      <text x="50" y="153" textAnchor="middle" fontSize="8"
        fill={zerAtivo ? '#00ff66' : '#d1d5db'} fontFamily="monospace"
        fontWeight={zerAtivo ? '700' : '400'}>ZERO</text>
    </g>

    {/* Botão LER */}
    <g onClick={onLer} style={{ cursor: lerAtivo ? 'pointer' : 'default' }}>
      <rect x="90" y="140" width="60" height="20" rx="4"
        fill={lerAtivo ? '#0f2a48' : '#6b7280'}
        stroke={lerAtivo ? '#00aacc' : '#4b5563'} strokeWidth={lerAtivo ? 1.8 : 1} />
      {lerAtivo && (
        <rect x="90" y="140" width="60" height="20" rx="4"
          fill="none" stroke="rgba(0,170,204,0.40)" strokeWidth="3">
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
        </rect>
      )}
      <text x="120" y="153" textAnchor="middle" fontSize="8"
        fill={lerAtivo ? '#00ddff' : '#d1d5db'} fontFamily="monospace"
        fontWeight={lerAtivo ? '700' : '400'}>LER</text>
    </g>

    {/* Botão MENU */}
    <g>
      <rect x="160" y="140" width="60" height="20" rx="4"
        fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
      <text x="190" y="153" textAnchor="middle" fontSize="8"
        fill="#d1d5db" fontFamily="monospace">MENU</text>
    </g>

    {/* Linha de botões 2 */}
    <text x="113" y="178" textAnchor="middle" fontSize="6"
      fill="#6b7280" fontFamily="sans-serif">
      Spectroquant® Prove 300 · Merck KGaA
    </text>
    <text x="113" y="188" textAnchor="middle" fontSize="5.5"
      fill="#9ca3af" fontFamily="monospace">
      Método 100857 · Silicato (Ácido Silícico)
    </text>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SilicaMk = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'smk-anim-styles';
    if (document.getElementById(sid)) return;
    const tag = document.createElement('style');
    tag.id = sid; tag.textContent = ESTILOS_ANIMACAO;
    document.head.appendChild(tag);
    return () => { const el = document.getElementById(sid); if (el) el.remove(); };
  }, []);

  const {
    pontuacao, etapaAtual,
    itemSegurado, setItemSegurado, mostrarParabens,
    concluido, mostrarErroEtapa, mensagemErroEtapa,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
  } = useGameState(etapas.length);

  // ── Fontes (nível visual) ─────────────────────────────
  const [nivelAmostra, setNivelAmostra]   = useState(82);
  const [nivelR1,      setNivelR1]        = useState(80);
  const [nivelR2,      setNivelR2]        = useState(78);
  const [nivelR3,      setNivelR3]        = useState(80);
  const [nivelR4,      setNivelR4]        = useState(78);
  const [nivelAguaDest,setNivelAguaDest]  = useState(82);

  // ── Tubo de reação ────────────────────────────────────
  const [nivelTubo,    setNivelTubo]    = useState(0);
  const [corTubo,      setCorTubo]      = useState('rgba(220,235,255,0.08)');
  const [amostraNoTubo,setAmostraNoTubo]= useState(false);
  const [r1Adicionado, setR1Adicionado] = useState(false);
  const [r2Adicionado, setR2Adicionado] = useState(false);
  const [r3Adicionado, setR3Adicionado] = useState(false);
  const [r4Adicionado, setR4Adicionado] = useState(false);

  // ── Timers de reação ──────────────────────────────────
  const [timer1Ativo,    setTimer1Ativo]    = useState(false);
  const [progressoT1,    setProgressoT1]    = useState(0);
  const [timer2Ativo,    setTimer2Ativo]    = useState(false);
  const [progressoT2,    setProgressoT2]    = useState(0);

  // ── Gotas animação ────────────────────────────────────
  const [mostrarGotas2, setMostrarGotas2] = useState(false);
  const [mostrarGotas4, setMostrarGotas4] = useState(false);
  const [gotasKey,      setGotasKey]      = useState(0);

  // ── Cubeta amostra ────────────────────────────────────
  const [nivelCubeta,  setNivelCubeta]  = useState(0);
  const [corCubeta,    setCorCubeta]    = useState('rgba(220,235,255,0.08)');

  // ── Cubeta branco ─────────────────────────────────────
  const [nivelCubetaBranco,    setNivelCubetaBranco]    = useState(0);
  const [cubetaBrancoPreparada,setCubetaBrancoPreparada] = useState(false);

  // ── Spectroquant ──────────────────────────────────────
  const [cubetaNoSpectro,  setCubetaNoSpectro]  = useState(false);
  const [ehBrancoNoSpectro,setEhBrancoNoSpectro]= useState(false);
  const [zerando,          setZerando]          = useState(false);
  const [zerado,           setZerado]           = useState(false);
  const [lendo,            setLendo]            = useState(false);
  const [resultado,        setResultado]        = useState(null);

  // ── Timer 1 (step 5, 5s) ──────────────────────────────
  useEffect(() => {
    if (!timer1Ativo) return;
    setProgressoT1(0);
    let p = 0;
    const tick = setInterval(() => { p = Math.min(p + 2, 100); setProgressoT1(p); }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimer1Ativo(false);
      setProgressoT1(100);
      // Cor desenvolve após reação 1
      setCorTubo('rgba(195,180,60,0.78)');
      celebrarAcerto(100);
      proximaEtapa(); // → step 6
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timer1Ativo]);

  // ── Timer 2 (step 7, 5s) ──────────────────────────────
  useEffect(() => {
    if (!timer2Ativo) return;
    setProgressoT2(0);
    let p = 0;
    const tick = setInterval(() => { p = Math.min(p + 2, 100); setProgressoT2(p); }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimer2Ativo(false);
      setProgressoT2(100);
      // Cor final azul molibdênio
      setCorTubo('rgba(45,90,200,0.88)');
      celebrarAcerto(100);
      proximaEtapa(); // → step 8
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timer2Ativo]);

  // ── Ocultar gotas após 2s ─────────────────────────────
  useEffect(() => {
    if (!mostrarGotas2) return;
    const id = setTimeout(() => setMostrarGotas2(false), 2000);
    return () => clearTimeout(id);
  }, [mostrarGotas2]);

  useEffect(() => {
    if (!mostrarGotas4) return;
    const id = setTimeout(() => setMostrarGotas4(false), 2000);
    return () => clearTimeout(id);
  }, [mostrarGotas4]);

  // ── Auto-conclusão (step 13 leitura concluída) ────────
  useEffect(() => {
    if (etapaAtual !== 13 || !resultado) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2500);
    return () => clearTimeout(id);
  }, [resultado, etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragSilicaMk(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra, setNivelR1, setNivelR2, setNivelR3, setNivelR4, setNivelAguaDest,
    setNivelTubo, setCorTubo,
    setAmostraNoTubo, setR1Adicionado, setR2Adicionado, setR3Adicionado, setR4Adicionado,
    setTimer1Ativo, setTimer2Ativo,
    setMostrarGotas2, setMostrarGotas4, setGotasKey,
    setNivelCubeta, setCorCubeta,
    setNivelCubetaBranco, setCubetaBrancoPreparada,
    setCubetaNoSpectro, setEhBrancoNoSpectro,
  });

  // ── Click: Confirmar amostra (step 0) ─────────────────
  const handleConfirmarAmostra = () => {
    if (etapaAtual !== 0) return;
    celebrarAcerto(50);
    proximaEtapa(); // → step 1
  };

  // ── Click: ZERO Spectroquant (step 11) ────────────────
  const handleZerarSpectro = () => {
    if (etapaAtual !== 11 || !cubetaNoSpectro || !ehBrancoNoSpectro || zerando) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaNoSpectro(false);
      setNivelCubetaBranco(0);
      celebrarAcerto(150);
      proximaEtapa(); // → step 12
    }, 2200);
  };

  // ── Click: LER Spectroquant (step 13) ─────────────────
  const handleLerSpectro = () => {
    if (etapaAtual !== 13 || !cubetaNoSpectro || !zerado || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const rawSi = parseFloat((Math.random() * 18 + 2).toFixed(2)); // 2–20 mg/L Si
      setResultado(rawSi.toFixed(2));
      setLendo(false);
      celebrarAcerto(200);
    }, 2500);
  };

  // Cubeta branco draggable
  const cubetaBrancoDrag = isItem('cubeta_branco') && cubetaBrancoPreparada;
  // Cubeta amostra draggable
  const cubetaAmostraDrag = isItem('cubeta') && nivelCubeta > 0 && !cubetaNoSpectro;
  // Tubo draggable
  const tuboDraggable = isItem('tubo_reacao') && r4Adicionado && !timer2Ativo;
  // cor cubeta no spectro
  const corCubetaNoSpectro = ehBrancoNoSpectro ? 'rgba(195,225,252,0.65)' : corCubeta;

  // Botões activos
  const zerAtivo = etapaAtual === 11 && cubetaNoSpectro && ehBrancoNoSpectro && !zerando;
  const lerAtivo = etapaAtual === 13 && cubetaNoSpectro && zerado && !lendo && !resultado;
  const timerAtivo = timer1Ativo || timer2Ativo;


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── OVERLAYS ── */}
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

      {/* Banner timer */}
      {timerAtivo && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#713f12,#92400e,#b45309)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, animation: 'smkTimerPulse 1s ease-in-out infinite' }}>
              ⏱ {timer1Ativo ? 'Reação 1 — Formação do Silicomolibdato' : 'Reação 2 — Desenvolvimento do Azul de Molibdênio'}
            </div>
            <div style={{ marginTop: 8, height: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', minWidth: 220 }}>
              <div style={{ height: '100%', width: `${timer1Ativo ? progressoT1 : progressoT2}%`, background: 'rgba(251,191,36,0.85)', borderRadius: 5, transition: 'width 0.1s linear' }} />
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.75)' }}>
              {Math.floor(timer1Ativo ? progressoT1 : progressoT2)}% concluído
            </div>
          </div>
        </div>
      )}

      {/* Banner resultado */}
      {resultado && etapaAtual >= 13 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1d4ed8,#2563eb)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🔵 Leitura Concluída — Método 100857</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Silicato: <strong>{resultado} mg/L Si</strong></div>
          </div>
        </div>
      )}

      {/* Modal conclusão */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #cc0033', borderRadius: 24, padding: '44px 52px', textAlign: 'center', color: 'white', maxWidth: 520, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ fontSize: 60, marginBottom: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#cc0033' }}>Merck</span><br />
              <span style={{ fontSize: 18, color: '#94a3b8' }}>Spectroquant®</span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#38bdf8', margin: '8px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 20px' }}>
              Silicato (Ácido Silícico) · Kit Merck 100857 · Spectroquant Prove 300
            </p>

            <div style={{ background: 'rgba(204,0,51,0.08)', border: '1px solid rgba(204,0,51,0.28)', borderRadius: 14, padding: '14px 22px', marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 8 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Método',    val: '100857',            cor: '#cc0033' },
                  { label: 'Kit',       val: 'Merck Spectroquant',cor: '#f87171' },
                  { label: 'Analito',   val: 'Silicato (Si)',      cor: '#60a5fa' },
                  { label: 'Equip.',    val: 'Prove 300',          cor: '#a78bfa' },
                  { label: 'Vol. amostra', val: '5,0 mL',         cor: '#34d399' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.38)', borderRadius: 14, padding: '18px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Resultado — Silicato</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace', lineHeight: 1 }}>{resultado}</div>
              <div style={{ fontSize: 14, color: '#60a5fa', fontWeight: 700, marginTop: 4 }}>mg/L Si</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 14px', marginBottom: 10, fontSize: 9, color: '#64748b' }}>
              📋 Para garantia da qualidade, use solução padrão Certipur Cat. 170236 (1000 mg/L Si).<br />
              Não armazenar padrão em frascos de vidro.
            </div>

            <div style={{ fontSize: 17, color: '#fbbf24', fontWeight: 700, marginBottom: 18 }}>🏆 Pontuação: {pontuacao} pts</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(90deg,#cc0033,#991a2b)', color: 'white', border: 'none', borderRadius: 11, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              🔄 Recomeçar
            </button>
          </div>
        </div>
      )}


      {/* ════════════════════════════════════════════════
         BANCADA
      ════════════════════════════════════════════════ */}
      <LayoutSimulador
        etapaAtual={etapaAtual} etapas={etapas} pontuacao={pontuacao}
        titulo="Silicato — Kit Merck 100857"
        subtitulo={"Spectroquant® Prove 300 · Método 100857\nSilicato (Ácido Silícico) · mg/L Si"}
        icone="🔵"
        badges={['🔵 MERCK', '⚗️ ESPECTROFOTOMETRIA']}
        footerLabel="🔵 Silicato 100857"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 880 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🔵 Bancada — Silicato (Ácido Silícico) · Kit Merck Spectroquant 100857
          </h2>

          <div style={{ background: 'linear-gradient(160deg,#78716c,#57534e,#44403c)', borderRadius: 20, padding: '18px 16px', border: '4px solid #292524', boxShadow: 'inset 0 6px 28px rgba(0,0,0,0.4)' }}>

            {/* ══ ZONA SUPERIOR ════════════════════════════════════════ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>

              {/* TUBO DE REAÇÃO */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="tubo_reacao" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`${dropCls('tubo_reacao')}`}
                    style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
                    {/* Gotas R2 caindo */}
                    <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                      {mostrarGotas2 && (
                        <>
                          <GotaReagenteCaindo key={`g2a-${gotasKey}`} offsetX={-8} animName="smkDropFall"  delay={0}   animKey={`g2a-${gotasKey}`} cor="rgba(220,180,20,0.88)" />
                          <GotaReagenteCaindo key={`g2b-${gotasKey}`} offsetX={-2} animName="smkDropFall2" delay={200} animKey={`g2b-${gotasKey}`} cor="rgba(220,180,20,0.80)" />
                          <GotaReagenteCaindo key={`g2c-${gotasKey}`} offsetX={4}  animName="smkDropFall3" delay={400} animKey={`g2c-${gotasKey}`} cor="rgba(220,180,20,0.72)" />
                          <GotaReagenteCaindo key={`g2d-${gotasKey}`} offsetX={9}  animName="smkDropFall4" delay={600} animKey={`g2d-${gotasKey}`} cor="rgba(220,180,20,0.64)" />
                        </>
                      )}
                      {mostrarGotas4 && (
                        <>
                          <GotaReagenteCaindo key={`g4a-${gotasKey}`} offsetX={-8} animName="smkDropFall"  delay={0}   animKey={`g4a-${gotasKey}`} cor="rgba(60,80,200,0.88)" />
                          <GotaReagenteCaindo key={`g4b-${gotasKey}`} offsetX={-2} animName="smkDropFall2" delay={200} animKey={`g4b-${gotasKey}`} cor="rgba(60,80,200,0.80)" />
                          <GotaReagenteCaindo key={`g4c-${gotasKey}`} offsetX={4}  animName="smkDropFall3" delay={400} animKey={`g4c-${gotasKey}`} cor="rgba(60,80,200,0.72)" />
                          <GotaReagenteCaindo key={`g4d-${gotasKey}`} offsetX={9}  animName="smkDropFall4" delay={600} animKey={`g4d-${gotasKey}`} cor="rgba(60,80,200,0.64)" />
                        </>
                      )}
                    </div>
                    <div
                      className={`item-drag ${itemCls('tubo_reacao')}`}
                      draggable={tuboDraggable}
                      onDragStart={e => handleDragStart('tubo_reacao', e)}
                      onDragEnd={handleDragEnd}
                      style={{ cursor: tuboDraggable ? 'grab' : 'default', opacity: nivelTubo === 0 && r4Adicionado ? 0.20 : 1, transition: 'opacity 0.3s' }}>
                      <TuboReacaoSVG nivel={nivelTubo} cor={corTubo} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {tuboDraggable ? '🖱️ ' : ''}Tubo de Reação
                    </span>
                    <span style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center' }}>
                      {r4Adicionado && !timer2Ativo ? '🔵 Pronto' :
                        timer2Ativo ? '⏱ Reação 2...' :
                        r3Adicionado ? '⏱ Reação 1...' :
                        r2Adicionado ? '+ R2 ✓' :
                        r1Adicionado ? '+ R1 ✓' :
                        amostraNoTubo ? '5,0 mL amostra' : 'Vazio'}
                    </span>
                  </div>
                </ZonaDrop>
              </div>

              {/* CUBETA AMOSTRA */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="cubeta" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`${dropCls('cubeta')} ${itemCls('cubeta')}`}
                    style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: cubetaNoSpectro && !ehBrancoNoSpectro ? 0.18 : 1, transition: 'opacity 0.3s' }}
                    draggable={cubetaAmostraDrag}
                    onDragStart={e => handleDragStart('cubeta', e)} onDragEnd={handleDragEnd}>
                    {cubetaNoSpectro && !ehBrancoNoSpectro
                      ? <div style={{ width: 80, height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <span style={{ fontSize: 18 }}>✅</span>
                          <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>No Spectroquant</span>
                        </div>
                      : <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="smka" />
                    }
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {cubetaAmostraDrag ? '🖱️ ' : ''}Cubeta (Amostra)
                  </span>
                  <span style={{ fontSize: 8, color: nivelCubeta > 0 ? '#3b82f6' : '#94a3b8' }}>
                    {nivelCubeta > 0 ? '🔵 Sol. reagida' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* CUBETA BRANCO */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="cubeta_branco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`${dropCls('cubeta_branco')} ${itemCls('cubeta_branco')}`}
                    style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: cubetaNoSpectro && ehBrancoNoSpectro ? 0.18 : 1, transition: 'opacity 0.3s' }}
                    draggable={cubetaBrancoDrag}
                    onDragStart={e => handleDragStart('cubeta_branco', e)} onDragEnd={handleDragEnd}>
                    <CubetaSVG cor="rgba(195,225,252,0.65)" nivel={nivelCubetaBranco} id="smkb" />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {cubetaBrancoDrag ? '🖱️ ' : ''}Cubeta (Branco)
                  </span>
                  <span style={{ fontSize: 8, color: cubetaBrancoPreparada ? '#34d399' : '#94a3b8' }}>
                    {zerado ? '✓ Usado (zero)' : cubetaBrancoPreparada ? '💧 H₂O destilada' : 'Vazia'}
                  </span>
                </ZonaDrop>
              </div>

              {/* SPECTROQUANT PROVE 300 */}
              <div style={{ flex: 2.5, display: 'flex', justifyContent: 'center' }}>
                <ZonaDrop id="spectro" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={dropCls('spectro')} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 13, padding: '10px 12px' }}>
                    <SpectroquantSVG
                      cubetaDentro={cubetaNoSpectro}
                      corCubeta={corCubetaNoSpectro}
                      zerando={zerando}
                      zerado={zerado && !cubetaNoSpectro}
                      lendo={lendo}
                      resultado={resultado}
                      metodoSelecionado={zerado}
                      zerAtivo={zerAtivo}
                      lerAtivo={lerAtivo}
                      onZero={handleZerarSpectro}
                      onLer={handleLerSpectro}
                    />
                    {zerAtivo && <div style={{ textAlign: 'center', fontSize: 8, color: '#00cc44', fontWeight: 700, marginTop: 4 }}>🔵 Clique ZERO para calibrar!</div>}
                    {lerAtivo && <div style={{ textAlign: 'center', fontSize: 8, color: '#00ddff', fontWeight: 700, marginTop: 4 }}>🔵 Clique LER para a leitura!</div>}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>Spectroquant Prove 300</span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ PAINEL CONFIRMAR (step 0) ═════════════════════════ */}
            {etapaAtual === 0 && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(204,0,51,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#f87171', fontWeight: 700 }}>📋 Verificar Amostra — Kit Merck Spectroquant 100857</div>
                  <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>Confirme que a amostra está homogeneizada. Para garantia de qualidade, use solução padrão Certipur Cat. 170236 (1000 mg/L Si). Não usar frascos de vidro para armazenar o padrão.</div>
                </div>
                <button onClick={handleConfirmarAmostra}
                  style={{ background: 'linear-gradient(90deg,#cc0033,#991a2b)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(204,0,51,0.35)', whiteSpace: 'nowrap' }}>
                  ✓ Confirmar Amostra
                </button>
              </div>
            )}

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <ItemBancada id="amostra" className={itemCls('amostra')} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <FrascoReagente cor="rgba(140,200,240,0.78)" label="Amostra" sub="5,0 mL" nivel={nivelAmostra} />
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>🖱️ Amostra</span>
                </ItemBancada>
              </div>

              {/* REAGENTE 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('reagente1')}`}
                  draggable={isItem('reagente1')} onDragStart={e => handleDragStart('reagente1', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(245,220,45,0.85)" label="Silicato 1" sub="0,5 mL" nivel={nivelR1} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('reagente1') ? '🖱️ ' : ''}Reagente 1</span>
                {r1Adicionado && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* REAGENTE 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('reagente2')}`}
                  draggable={isItem('reagente2')} onDragStart={e => handleDragStart('reagente2', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(210,120,18,0.85)" label="Silicato 2" sub="4 gotas" nivel={nivelR2} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('reagente2') ? '🖱️ ' : ''}Reagente 2</span>
                {r2Adicionado && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* REAGENTE 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('reagente3')}`}
                  draggable={isItem('reagente3')} onDragStart={e => handleDragStart('reagente3', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(200,155,25,0.88)" label="Silicato 3" sub="2,0 mL" nivel={nivelR3} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('reagente3') ? '🖱️ ' : ''}Reagente 3</span>
                {r3Adicionado && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* REAGENTE 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('reagente4')}`}
                  draggable={isItem('reagente4')} onDragStart={e => handleDragStart('reagente4', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(50,75,200,0.88)" label="Silicato 4" sub="4 gotas" nivel={nivelR4} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('reagente4') ? '🖱️ ' : ''}Reagente 4</span>
                {r4Adicionado && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* ÁGUA DESTILADA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('agua_dest')}`}
                  draggable={isItem('agua_dest')} onDragStart={e => handleDragStart('agua_dest', e)} onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(200,232,255,0.82)" label="H₂O dest." sub="branco" nivel={nivelAguaDest} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('agua_dest') ? '🖱️ ' : ''}Água Destilada</span>
                {cubetaBrancoPreparada && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
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

export default SilicaMk;
