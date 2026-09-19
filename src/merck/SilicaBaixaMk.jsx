/**
 * SilicaBaixaMk.jsx — Sílica (Baixa Faixa) — Kit Merck Spectroquant 114794
 *
 * Fluxo: Confirmar amostra → Ajustar pH (2–10)
 *        → Micropipeta P1000: aspirar amostra → dispensar no Tubo (5,0 mL)
 *        → SB1 (3 gotas) → SB2 (0,50 mL) → Timer reação
 *        → Cubeta (10 mm) → Branco H₂O → ZERO + Método 114794
 *        → Cubeta amostra → LER → Resultado mg/L SiO₂
 *
 * Kit: Merck Spectroquant 114794 · Sílica Baixa Faixa
 * Equipamento: Merck Spectroquant Prove 300
 * Faixas: 10 mm: 0,21–10,70 mg/L SiO₂ | 20 mm: ~0,11–5,35 | 50 mm: ~0,011–1,60
 * Padrão CRM: Cat. 132243 | Não armazenar em vidro
 */
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { LayoutSimulador } from '../SimuladorComponentes';
import FrascoReagente from '../components/lab/FrascoReagente';
import ItemBancada from '../components/lab/ItemBancada';
import ZonaDrop from '../components/lab/ZonaDrop';
import CubetaSVG from '../components/lab/CubetaSVG';
import { useDragOverlay } from '../hooks/useDragOverlay';
import { useGameState } from '../hooks/useGameState';
import { useSimuladorDragSilicaBaixaMk } from '../hooks/useSimuladorDragSilicaBaixaMk';
import { etapas } from './data/etapasSilicaBaixaMk';


/* ═══════════════════════════════════════════════════════════
   CSS — animações exclusivas desta página
═══════════════════════════════════════════════════════════ */
const ESTILOS_ANIMACAO = `
  @keyframes sbmkDropFall {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:1; }
    65%  { transform:translateX(-50%) translateY(48px); opacity:.90;}
    100% { transform:translateX(-50%) translateY(68px); opacity:0;  }
  }
  @keyframes sbmkDropFall2 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.85;}
    65%  { transform:translateX(-50%) translateY(44px); opacity:.75;}
    100% { transform:translateX(-50%) translateY(62px); opacity:0;  }
  }
  @keyframes sbmkDropFall3 {
    0%   { transform:translateX(-50%) translateY(0);    opacity:0;   }
    6%   { opacity:.70;}
    65%  { transform:translateX(-50%) translateY(52px); opacity:.60;}
    100% { transform:translateX(-50%) translateY(72px); opacity:0;  }
  }
  @keyframes sbmkTimerPulse {
    0%,100% { opacity:.62; }
    50%     { opacity:1.00;}
  }
  @keyframes sbmkPhPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
    50%     { box-shadow: 0 0 0 6px rgba(34,197,94,0.25); }
  }
`;

/* ── Gota colorida de reagente ── */
const GotaReagenteCaindo = ({
  offsetX = 0, animName = 'sbmkDropFall', delay = 0,
  animKey = 'g', cor = 'rgba(80,160,80,0.88)',
}) => (
  <div key={animKey} style={{
    position: 'absolute', left: `calc(50% + ${offsetX}px)`, top: 4,
    width: 10, height: 22, opacity: 0, pointerEvents: 'none', zIndex: 30,
    animationName: animName, animationDuration: '0.55s',
    animationDelay: `${delay}ms`, animationFillMode: 'forwards',
    animationTimingFunction: 'ease-in',
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
const TuboReacaoSVG = ({ nivel = 0, cor = 'rgba(220,235,255,0.08)' }) => {
  const liqH = Math.max(0, nivel / 100 * 80);
  return (
    <svg width="72" height="140" viewBox="0 0 72 140">
      <defs>
        <linearGradient id="sbmkTrBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(200,228,248,0.50)" />
          <stop offset="18%"  stopColor="rgba(220,240,255,0.18)" />
          <stop offset="50%"  stopColor="rgba(200,228,248,0.07)" />
          <stop offset="82%"  stopColor="rgba(220,240,255,0.14)" />
          <stop offset="100%" stopColor="rgba(200,228,248,0.38)" />
        </linearGradient>
        <clipPath id="sbmkTrClip">
          <path d="M 20,20 L 20,115 Q 20,132 36,132 Q 52,132 52,115 L 52,20 Z" />
        </clipPath>
        <filter id="sbmkTrSh"><feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity=".20" /></filter>
      </defs>
      <ellipse cx={36} cy={137} rx={20} ry={4} fill="rgba(0,0,0,0.14)" />
      <g filter="url(#sbmkTrSh)">
        <path d="M 20,20 L 20,115 Q 20,132 36,132 Q 52,132 52,115 L 52,20 Z"
          fill="url(#sbmkTrBody)" stroke="#8fb8d8" strokeWidth="1.5" />
      </g>
      <g clipPath="url(#sbmkTrClip)">
        <rect x={20} y={132 - liqH} width={32} height={liqH} fill={cor} opacity="0.86" />
        {nivel > 2 && nivel < 97 && (
          <ellipse cx={36} cy={132 - liqH} rx={12} ry={2} fill={cor} opacity="0.30" />
        )}
      </g>
      <path d="M 21,22 L 21,110 L 24,110 L 24,22 Z"
        fill="rgba(255,255,255,0.30)" clipPath="url(#sbmkTrClip)" />
      <rect x={17} y={8} width={38} height={16} rx={4}
        fill="rgba(200,228,248,0.28)" stroke="#8fb8d8" strokeWidth="1.3" />
      <rect x={19} y={9} width={10} height={12} rx={2} fill="rgba(255,255,255,0.16)" />
      {[25, 40, 55, 70, 85, 100].map((y, i) => (
        <g key={i}>
          <line x1={52} y1={y} x2={i % 2 === 0 ? 60 : 57} y2={y}
            stroke="rgba(14,50,140,0.60)" strokeWidth={i % 2 === 0 ? 1.1 : 0.7} />
          {i % 2 === 0 && (
            <text x={63} y={y + 3.5} fontSize="6.5" fill="rgba(12,45,130,0.70)"
              fontFamily="monospace">{(6 - i)}mL</text>
          )}
        </g>
      ))}
      <text x={36} y={6} textAnchor="middle" fontSize="6"
        fill="rgba(12,45,130,0.65)" fontFamily="sans-serif">10 mL</text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   SVG — MICROPIPETA P1000
═══════════════════════════════════════════════════════════ */
const MicropipetaP1000SVG = ({ comAmostra = false }) => (
  <svg width="52" height="200" viewBox="0 0 52 200">
    <defs>
      <linearGradient id="sbmkPipGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#1e3a6e"/>
        <stop offset="48%"  stopColor="#2563ab"/>
        <stop offset="100%" stopColor="#1e3a6e"/>
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="197" rx="12" ry="3" fill="rgba(0,0,0,0.20)"/>
    {/* plunger */}
    <rect x="19" y="1" width="14" height="25" rx="7"
      fill="#718096" stroke="#475569" strokeWidth="1"/>
    <rect x="21" y="3" width="10" height="5" rx="2.5" fill="rgba(255,255,255,0.24)"/>
    {/* corpo */}
    <rect x="14" y="22" width="24" height="90" rx="9"
      fill="url(#sbmkPipGrad)" stroke="#1e3a6e" strokeWidth="1.2"/>
    <rect x="15" y="24" width="5" height="82" rx="3" fill="rgba(255,255,255,0.09)"/>
    {/* janela de volume */}
    <rect x="17" y="32" width="18" height="18" rx="3"
      fill="rgba(0,0,0,0.48)" stroke="#334155" strokeWidth="0.8"/>
    <text x="26" y="43" textAnchor="middle" fontSize="6.5"
      fill="#e2e8f0" fontFamily="monospace" fontWeight="bold">1000</text>
    <text x="26" y="50" textAnchor="middle" fontSize="4.5"
      fill="#94a3b8" fontFamily="monospace">μL</text>
    <text x="26" y="62" textAnchor="middle" fontSize="7"
      fill="white" fontFamily="monospace" fontWeight="900">P1000</text>
    {[70,75,80,85,90,95].map(y => (
      <rect key={y} x="13" y={y} width="26" height="1.8" rx="0.9"
        fill="rgba(255,255,255,0.11)"/>
    ))}
    {/* botão eject */}
    <rect x="20" y="100" width="12" height="9" rx="3"
      fill="#dc2626" stroke="#b91c1c" strokeWidth="0.8"/>
    <text x="26" y="106" textAnchor="middle" fontSize="4"
      fill="white" fontFamily="sans-serif">EJECT</text>
    {/* taper metálica */}
    <path d="M18,112 L21,145 L31,145 L34,112 Z" fill="#64748b" stroke="#475569" strokeWidth="1"/>
    <path d="M19,114 L21,138" stroke="rgba(255,255,255,0.17)"
      strokeWidth="1.1" strokeLinecap="round"/>
    {/* conector ponteira */}
    <path d="M22,145 L23,162 L29,162 L30,145 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8"/>
    {/* ponteira */}
    <g>
      <path d="M23,162 L24.5,196 L27.5,196 L29,162 Z"
        fill={comAmostra ? 'rgba(140,200,240,0.85)' : 'rgba(226,232,240,0.30)'}
        stroke={comAmostra ? '#60a5fa' : '#94a3b8'} strokeWidth="1"/>
      <path d="M23.5,162 L25,185"
        stroke="rgba(255,255,255,0.30)" strokeWidth="0.9" strokeLinecap="round"/>
      <ellipse cx="26" cy="162" rx="3" ry="1.2" fill="rgba(255,255,255,0.20)"/>
    </g>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   SVG — SPECTROQUANT PROVE 300 (Merck) · Método 114794
═══════════════════════════════════════════════════════════ */
const SpectroquantBaixaSVG = ({
  cubetaDentro = false, corCubeta = 'rgba(45,90,200,0.88)',
  zerando = false, zerado = false, lendo = false, resultado = null,
  zerAtivo = false, lerAtivo = false,
  onZero, onLer,
}) => {
  const si    = resultado ? (parseFloat(resultado) * 0.4675).toFixed(2) : null;
  const mmol  = resultado ? (parseFloat(resultado) / 60.08).toFixed(3) : null;

  return (
    <svg width="230" height="200" viewBox="0 0 230 200">
      <defs>
        <linearGradient id="sbmkSqBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8eaec" />
          <stop offset="100%" stopColor="#cdd0d4" />
        </linearGradient>
        <linearGradient id="sbmkSqScr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#001a2c" />
          <stop offset="100%" stopColor="#00101c" />
        </linearGradient>
        <filter id="sbmkSqSh"><feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity=".28" /></filter>
      </defs>

      {/* Corpo branco Merck */}
      <g filter="url(#sbmkSqSh)">
        <rect x="4" y="4" width="222" height="192" rx="12"
          fill="url(#sbmkSqBody)" stroke="#b0b5ba" strokeWidth="1.5" />
      </g>

      {/* Header vermelho Merck */}
      <rect x="4" y="4" width="222" height="28" rx="12" fill="#cc0033" />
      <rect x="4" y="18" width="222" height="14"        fill="#cc0033" />
      <text x="70"  y="17" textAnchor="middle" fontSize="10"
        fill="white" fontFamily="Arial, sans-serif" fontWeight="900" letterSpacing="2">Merck</text>
      <text x="160" y="17" textAnchor="middle" fontSize="7.5"
        fill="rgba(255,255,255,0.85)" fontFamily="Arial, sans-serif" letterSpacing="1">Spectroquant®</text>
      <text x="113" y="26" textAnchor="middle" fontSize="6"
        fill="rgba(255,255,255,0.75)" fontFamily="Arial, sans-serif">Prove 300</text>

      {/* Display LCD */}
      <rect x="12" y="36" width="148" height="90" rx="6" fill="url(#sbmkSqScr)" stroke="#006080" strokeWidth="1.2" />
      <rect x="14" y="38" width="144" height="86" rx="5" fill="rgba(0,30,50,0.40)" />

      {resultado !== null ? (
        <>
          <text x="86" y="55" textAnchor="middle" fontSize="7" fill="#00ccaa" fontFamily="monospace">MÉTODO 114794 · SiO₂</text>
          <line x1="18" y1="59" x2="154" y2="59" stroke="rgba(0,200,170,0.22)" strokeWidth="0.8" />
          <text x="80" y="85" textAnchor="middle" fontSize="28"
            fill="#00ff88" fontFamily="'Courier New', monospace" fontWeight="700">{resultado}</text>
          <text x="150" y="85" textAnchor="end" fontSize="9"
            fill="#00cc66" fontFamily="monospace">mg/L</text>
          <text x="150" y="94" textAnchor="end" fontSize="7.5"
            fill="#00cc66" fontFamily="monospace">SiO₂</text>
          <text x="86" y="108" textAnchor="middle" fontSize="6.5" fill="#00aa88" fontFamily="monospace">
            Si: {si} mg/L · {mmol} mmol/L SiO₂
          </text>
          <text x="86" y="118" textAnchor="middle" fontSize="5.5" fill="#007744" fontFamily="sans-serif">✓ Leitura concluída · Kit 114794</text>
        </>
      ) : lendo ? (
        <>
          <text x="86" y="58" textAnchor="middle" fontSize="7" fill="#00ccaa" fontFamily="monospace">MÉTODO 114794 · SiO₂</text>
          <text x="86" y="80" textAnchor="middle" fontSize="14" fill="#fbbf24" fontFamily="monospace">Lendo...</text>
          <rect x="22" y="90" width="128" height="5" rx="2.5" fill="rgba(255,255,255,0.07)" />
          <rect x="22" y="90" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
            <animate attributeName="width" from="0" to="128" dur="2.5s" fill="freeze" />
          </rect>
          <text x="86" y="110" textAnchor="middle" fontSize="6" fill="#78716c" fontFamily="monospace">Calculando concentração SiO₂...</text>
        </>
      ) : zerando ? (
        <>
          <text x="86" y="55" textAnchor="middle" fontSize="7" fill="#00ccaa" fontFamily="monospace">MÉTODO 114794</text>
          <text x="86" y="70" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="monospace">Zerando...</text>
          <rect x="22" y="79" width="128" height="5" rx="2.5" fill="rgba(255,255,255,0.07)" />
          <rect x="22" y="79" width="0" height="5" rx="2.5" fill="rgba(251,191,36,0.65)">
            <animate attributeName="width" from="0" to="128" dur="2s" fill="freeze" />
          </rect>
          <text x="86" y="96" textAnchor="middle" fontSize="6" fill="#78716c" fontFamily="monospace">Calibrando com H₂O destilada...</text>
          <text x="86" y="110" textAnchor="middle" fontSize="5.5" fill="#475569" fontFamily="monospace">Selecionando Método 114794...</text>
        </>
      ) : zerado ? (
        <>
          <text x="86" y="55" textAnchor="middle" fontSize="7" fill="#00ccaa" fontFamily="monospace">MÉTODO 114794 ✓</text>
          <line x1="18" y1="59" x2="154" y2="59" stroke="rgba(0,200,170,0.22)" strokeWidth="0.8" />
          <text x="86" y="78" textAnchor="middle" fontSize="11" fill="#3b82f6" fontFamily="monospace">ZERADO ✓</text>
          <text x="86" y="92" textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="monospace">0.000 mg/L SiO₂</text>
          <text x="86" y="106" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">Inserir cubeta da amostra</text>
        </>
      ) : cubetaDentro ? (
        <>
          <text x="86" y="55" textAnchor="middle" fontSize="7" fill="#00ccaa" fontFamily="monospace">MÉTODO 114794</text>
          <text x="86" y="78" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontFamily="monospace">READY</text>
          <text x="86" y="93" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="sans-serif">Cubeta inserida ✓</text>
          <text x="86" y="108" textAnchor="middle" fontSize="6.5" fill="#3a6a9a" fontFamily="sans-serif">
            {zerAtivo ? 'Pressione ZERO' : lerAtivo ? 'Pressione LER' : 'Sílica 114794'}
          </text>
        </>
      ) : (
        <>
          <text x="86" y="57" textAnchor="middle" fontSize="9" fill="#003c50" fontFamily="monospace">STANDBY</text>
          <text x="86" y="73" textAnchor="middle" fontSize="7" fill="#002a38" fontFamily="monospace">Spectroquant®</text>
          <text x="86" y="86" textAnchor="middle" fontSize="6.5" fill="#001a24" fontFamily="sans-serif">Aguardando cubeta...</text>
        </>
      )}

      {/* Compartimento da cubeta */}
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
        fill={cubetaDentro ? 'rgba(0,204,102,0.8)' : 'rgba(0,180,160,0.22)'}
        stroke="rgba(0,180,160,0.35)" strokeWidth="1" />

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

      <text x="113" y="178" textAnchor="middle" fontSize="6"
        fill="#6b7280" fontFamily="sans-serif">
        Spectroquant® Prove 300 · Merck KGaA
      </text>
      <text x="113" y="188" textAnchor="middle" fontSize="5.5"
        fill="#9ca3af" fontFamily="monospace">
        Método 114794 · Sílica — Baixa Faixa
      </text>
    </svg>
  );
};


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════ */
const SilicaBaixaMk = () => {
  useDragOverlay();

  useEffect(() => {
    const sid = 'sbmk-anim-styles';
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
  const [nivelAmostra,  setNivelAmostra]  = useState(82);
  const [nivelSB1,      setNivelSB1]      = useState(80);
  const [nivelSB2,      setNivelSB2]      = useState(78);
  const [nivelAguaDest, setNivelAguaDest] = useState(82);

  // ── Tubo de reação ────────────────────────────────────
  const [nivelTubo,     setNivelTubo]     = useState(0);
  const [corTubo,       setCorTubo]       = useState('rgba(220,235,255,0.08)');
  const [amostraNoTubo, setAmostraNoTubo] = useState(false);
  const [sb1Adicionado, setSb1Adicionado] = useState(false);
  const [sb2Adicionado, setSb2Adicionado] = useState(false);

  // ── Timer de reação ───────────────────────────────────
  const [timerAtivo,     setTimerAtivo]     = useState(false);
  const [progressoTimer, setProgressoTimer] = useState(0);

  // ── Gotas (SB1) ───────────────────────────────────────
  const [mostrarGotas3, setMostrarGotas3] = useState(false);
  const [gotasKey,      setGotasKey]      = useState(0);

  // ── Cubeta amostra ────────────────────────────────────
  const [nivelCubeta,  setNivelCubeta]  = useState(0);
  const [corCubeta,    setCorCubeta]    = useState('rgba(220,235,255,0.08)');

  // ── Cubeta branco ─────────────────────────────────────
  const [nivelCubetaBranco,     setNivelCubetaBranco]     = useState(0);
  const [cubetaBrancoPreparada, setCubetaBrancoPreparada] = useState(false);

  // ── Micropipeta P1000 ─────────────────────────────────
  const [micropipetaComAmostra, setMicropipetaComAmostra] = useState(false);

  // ── Spectroquant ──────────────────────────────────────
  const [cubetaNoSpectro,   setCubetaNoSpectro]   = useState(false);
  const [ehBrancoNoSpectro, setEhBrancoNoSpectro] = useState(false);
  const [zerando,           setZerando]           = useState(false);
  const [zerado,            setZerado]            = useState(false);
  const [lendo,             setLendo]             = useState(false);
  const [resultado,         setResultado]         = useState(null);

  // ── Timer de reação (step 5, 5s simulados) ───────────
  useEffect(() => {
    if (!timerAtivo) return;
    setProgressoTimer(0);
    let p = 0;
    const tick = setInterval(() => { p = Math.min(p + 2, 100); setProgressoTimer(p); }, 100);
    const id = setTimeout(() => {
      clearInterval(tick);
      setTimerAtivo(false);
      setProgressoTimer(100);
      setCorTubo('rgba(45,90,200,0.88)'); // complexo silicomolibdato azul
      celebrarAcerto(100);
      proximaEtapa(); // → step 8
    }, 5000);
    return () => { clearTimeout(id); clearInterval(tick); };
  }, [timerAtivo]);

  // ── Ocultar gotas SB1 após 2s ─────────────────────────
  useEffect(() => {
    if (!mostrarGotas3) return;
    const id = setTimeout(() => setMostrarGotas3(false), 2000);
    return () => clearTimeout(id);
  }, [mostrarGotas3]);

  // ── Auto-conclusão (step 13, após leitura) ────────────
  useEffect(() => {
    if (etapaAtual !== 13 || !resultado) return;
    const id = setTimeout(() => { celebrarAcerto(150); proximaEtapa(); }, 2500);
    return () => clearTimeout(id);
  }, [resultado, etapaAtual]);

  // ── Drag / drop ───────────────────────────────────────
  const {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isItem, dropCls, itemCls,
  } = useSimuladorDragSilicaBaixaMk(etapas, {
    etapaAtual, itemSegurado, setItemSegurado,
    celebrarAcerto, mostrarErroAcao, proximaEtapa,
    setNivelAmostra, setNivelSB1, setNivelSB2, setNivelAguaDest,
    setNivelTubo, setCorTubo,
    setAmostraNoTubo, setSb1Adicionado, setSb2Adicionado,
    setTimerAtivo, setMicropipetaComAmostra,
    setMostrarGotas3, setGotasKey,
    setNivelCubeta, setCorCubeta,
    setNivelCubetaBranco, setCubetaBrancoPreparada,
    setCubetaNoSpectro, setEhBrancoNoSpectro,
  });

  // ── Click: Confirmar Amostra (step 0) ─────────────────
  const handleConfirmarAmostra = () => {
    if (etapaAtual !== 0) return;
    celebrarAcerto(50);
    proximaEtapa();
  };

  // ── Click: Ajustar pH (step 1) ────────────────────────
  const handleAjustarPH = () => {
    if (etapaAtual !== 1) return;
    celebrarAcerto(75);
    proximaEtapa();
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
      const rawSiO2 = parseFloat((Math.random() * 9.5 + 0.5).toFixed(2));
      setResultado(rawSiO2.toFixed(2));
      setLendo(false);
      celebrarAcerto(200);
    }, 2500);
  };

  // Derived booleans
  const cubetaBrancoDrag  = isItem('cubeta_branco') && cubetaBrancoPreparada;
  const cubetaAmostraDrag = isItem('cubeta') && nivelCubeta > 0 && !cubetaNoSpectro;
  const tuboDraggable     = isItem('tubo_reacao') && sb2Adicionado && !timerAtivo && nivelTubo > 0;
  const corCubetaNoSpectro = ehBrancoNoSpectro ? 'rgba(195,225,252,0.65)' : corCubeta;

  const zerAtivo = etapaAtual === 11 && cubetaNoSpectro && ehBrancoNoSpectro && !zerando;
  const lerAtivo = etapaAtual === 13 && cubetaNoSpectro && zerado && !lendo && !resultado;

  // Conversões do resultado
  const resultadoSi   = resultado ? (parseFloat(resultado) * 0.4675).toFixed(2) : null;
  const resultadoMmol = resultado ? (parseFloat(resultado) / 60.08).toFixed(3)  : null;


  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1a,#0d1f35,#0a1628)',
      padding: 16, fontFamily: "'Segoe UI', sans-serif",
    }}>

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

      {/* ── BANNER TIMER ── */}
      {timerAtivo && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#713f12,#92400e,#b45309)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, animation: 'sbmkTimerPulse 1s ease-in-out infinite' }}>
              ⏱ Reação — Formação do Complexo Silicomolibdato
            </div>
            <div style={{ marginTop: 8, height: 7, background: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden', minWidth: 220 }}>
              <div style={{ height: '100%', width: `${progressoTimer}%`, background: 'rgba(251,191,36,0.85)', borderRadius: 5, transition: 'width 0.1s linear' }} />
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.75)' }}>
              {Math.floor(progressoTimer)}% concluído · Kit 114794 · Sílica Baixa Faixa
            </div>
          </div>
        </div>
      )}

      {/* ── BANNER RESULTADO ── */}
      {resultado && etapaAtual >= 13 && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#0f3a2a,#0c5c40,#0d7a55)', color: 'white', padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.85)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>🟢 Leitura Concluída — Método 114794</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Sílica: <strong>{resultado} mg/L SiO₂</strong> · Si: {resultadoSi} mg/L · {resultadoMmol} mmol/L</div>
          </div>
        </div>
      )}

      {/* ── MODAL CONCLUÍDO ── */}
      {concluido && resultado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div style={{ background: 'linear-gradient(135deg,#0f2a1e,#0a1a10)', border: '2px solid #cc0033', borderRadius: 24, padding: '44px 52px', textAlign: 'center', color: 'white', maxWidth: 540, boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#cc0033' }}>Merck</span><br />
              <span style={{ fontSize: 18, color: '#94a3b8' }}>Spectroquant®</span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#34d399', margin: '8px 0 6px' }}>Análise Concluída!</h2>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 20px' }}>
              Sílica (Baixa Faixa) · Kit Merck 114794 · Spectroquant Prove 300 · Célula 10 mm
            </p>

            <div style={{ background: 'rgba(204,0,51,0.08)', border: '1px solid rgba(204,0,51,0.28)', borderRadius: 14, padding: '14px 22px', marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 8 }}>Dados da Análise</div>
              <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Método',       val: '114794',             cor: '#cc0033' },
                  { label: 'Kit',          val: 'Merck Spectroquant', cor: '#f87171' },
                  { label: 'Analito',      val: 'Sílica (SiO₂)',      cor: '#34d399' },
                  { label: 'Equip.',       val: 'Prove 300',          cor: '#a78bfa' },
                  { label: 'Vol. amostra', val: '5,0 mL',             cor: '#60a5fa' },
                  { label: 'Célula',       val: '10 mm',              cor: '#fbbf24' },
                ].map(({ label, val, cor }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(4,120,87,0.12)', border: '1px solid rgba(4,120,87,0.38)', borderRadius: 14, padding: '18px 36px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Resultado — Sílica Baixa Faixa</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#00ff88', fontFamily: 'monospace', lineHeight: 1 }}>{resultado}</div>
              <div style={{ fontSize: 14, color: '#34d399', fontWeight: 700, marginTop: 4 }}>mg/L SiO₂</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>mg/L Si</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>{resultadoSi}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>mmol/L SiO₂</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa', fontFamily: 'monospace' }}>{resultadoMmol}</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 14px', marginBottom: 10, fontSize: 9, color: '#64748b', textAlign: 'left' }}>
              📋 <strong style={{ color: '#94a3b8' }}>Faixas de medição (Método 114794):</strong><br />
              · 10 mm: 0,21–10,70 mg/L SiO₂ (0,10–5,35 mg/L Si)<br />
              · 20 mm: ~0,11–5,35 mg/L SiO₂ · 50 mm: ~0,011–1,60 mg/L SiO₂<br />
              <br />
              ⚗️ <strong style={{ color: '#94a3b8' }}>Garantia da qualidade:</strong> use padrão fotométrico CRM Cat. 132243.<br />
              ⚠️ Não armazenar solução padrão em frascos de vidro.
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
        titulo="Sílica Baixa Faixa — Kit Merck 114794"
        subtitulo={"Spectroquant® Prove 300 · Método 114794\nSílica (Baixa Faixa) · mg/L SiO₂"}
        icone="🟢"
        badges={['🟢 MERCK', '⚗️ ESPECTROFOTOMETRIA']}
        footerLabel="🟢 Sílica Baixa 114794"
      >
        <div style={{ background: 'linear-gradient(160deg,#d4c5a0,#c8b48a,#bfab7e)', borderRadius: 26, padding: '22px 18px', border: '8px solid #8b6e45', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', minWidth: 880 }}>
          <h2 style={{ textAlign: 'center', color: '#4a3010', fontSize: 14, fontWeight: 900, marginBottom: 14, letterSpacing: 0.6 }}>
            🟢 Bancada — Sílica (Baixa Faixa) · Kit Merck Spectroquant 114794
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

                    {/* Gotas SB1 caindo */}
                    <div style={{ position: 'relative', width: '100%', height: 0, overflow: 'visible' }}>
                      {mostrarGotas3 && (
                        <>
                          <GotaReagenteCaindo key={`g3a-${gotasKey}`} offsetX={-6} animName="sbmkDropFall"  delay={0}   animKey={`g3a-${gotasKey}`} cor="rgba(100,170,80,0.90)" />
                          <GotaReagenteCaindo key={`g3b-${gotasKey}`} offsetX={0}  animName="sbmkDropFall2" delay={220} animKey={`g3b-${gotasKey}`} cor="rgba(100,170,80,0.82)" />
                          <GotaReagenteCaindo key={`g3c-${gotasKey}`} offsetX={6}  animName="sbmkDropFall3" delay={440} animKey={`g3c-${gotasKey}`} cor="rgba(100,170,80,0.74)" />
                        </>
                      )}
                    </div>

                    <div
                      className={`item-drag ${itemCls('tubo_reacao')}`}
                      draggable={tuboDraggable}
                      onDragStart={e => handleDragStart('tubo_reacao', e)}
                      onDragEnd={handleDragEnd}
                      style={{ cursor: tuboDraggable ? 'grab' : 'default', transition: 'opacity 0.3s' }}>
                      <TuboReacaoSVG nivel={nivelTubo} cor={corTubo} />
                    </div>

                    <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                      {tuboDraggable ? '🖱️ ' : ''}Tubo de Reação
                    </span>
                    <span style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center' }}>
                      {sb2Adicionado && !timerAtivo && nivelTubo > 0 ? '🔵 Pronto' :
                        timerAtivo                                     ? '⏱ Reagindo...' :
                        sb2Adicionado && nivelTubo === 0               ? '↗ Transferido' :
                        sb2Adicionado                                  ? '+ SB2 ✓' :
                        sb1Adicionado                                  ? '+ SB1 ✓' :
                        amostraNoTubo                                  ? '5,0 mL amostra' :
                                                                         'Vazio'}
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
                      : <CubetaSVG cor={corCubeta} nivel={nivelCubeta} id="sbmka" />
                    }
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>
                    {cubetaAmostraDrag ? '🖱️ ' : ''}Cubeta 10 mm (Amostra)
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
                    <CubetaSVG cor="rgba(195,225,252,0.65)" nivel={nivelCubetaBranco} id="sbmkb" />
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
                    <SpectroquantBaixaSVG
                      cubetaDentro={cubetaNoSpectro}
                      corCubeta={corCubetaNoSpectro}
                      zerando={zerando}
                      zerado={zerado && !cubetaNoSpectro}
                      lendo={lendo}
                      resultado={resultado}
                      zerAtivo={zerAtivo}
                      lerAtivo={lerAtivo}
                      onZero={handleZerarSpectro}
                      onLer={handleLerSpectro}
                    />
                    {zerAtivo && <div style={{ textAlign: 'center', fontSize: 8, color: '#00cc44', fontWeight: 700, marginTop: 4 }}>🟢 Clique ZERO para calibrar!</div>}
                    {lerAtivo && <div style={{ textAlign: 'center', fontSize: 8, color: '#00ddff', fontWeight: 700, marginTop: 4 }}>🟢 Clique LER para a leitura!</div>}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#e7e5e4' }}>Spectroquant Prove 300</span>
                </ZonaDrop>
              </div>

            </div>{/* fim zona superior */}

            {/* ══ PAINEL CONFIRMAR AMOSTRA (step 0) ═══════════════ */}
            {etapaAtual === 0 && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(204,0,51,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#f87171', fontWeight: 700 }}>📋 Verificar Amostra — Kit Merck Spectroquant 114794 (Sílica Baixa Faixa)</div>
                  <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>
                    Confirme que a amostra está homogeneizada. Para garantia da qualidade, use padrão fotométrico CRM Cat. 132243 após diluição apropriada. Não armazenar solução padrão em frascos de vidro.
                  </div>
                </div>
                <button onClick={handleConfirmarAmostra}
                  style={{ background: 'linear-gradient(90deg,#cc0033,#991a2b)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(204,0,51,0.35)', whiteSpace: 'nowrap' }}>
                  ✓ Confirmar Amostra
                </button>
              </div>
            )}

            {/* ══ PAINEL AJUSTE DE PH (step 1) ════════════════════ */}
            {etapaAtual === 1 && (
              <div style={{ marginBottom: 14, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(34,197,94,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>🧪 Verificar e Ajustar pH da Amostra — Faixa Aceitável: pH 2–10</div>
                  <div style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>
                    Meça o pH da amostra. Se necessário, ajuste cuidadosamente com NaOH (↑ pH) ou H₂SO₄ (↓ pH) gota a gota até atingir a faixa pH 2–10. Filtre se indicado após ajuste.
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 8, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 6, padding: '2px 8px', color: '#4ade80' }}>NaOH — elevar pH</span>
                    <span style={{ fontSize: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '2px 8px', color: '#f87171' }}>H₂SO₄ — reduzir pH</span>
                    <span style={{ fontSize: 8, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 6, padding: '2px 8px', color: '#fbbf24' }}>Faixa: pH 2–10</span>
                  </div>
                </div>
                <button onClick={handleAjustarPH}
                  style={{ background: 'linear-gradient(90deg,#15803d,#166534)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(21,128,61,0.35)', whiteSpace: 'nowrap' }}>
                  ✓ pH Verificado (2–10)
                </button>
              </div>
            )}

            {/* ══ ZONA INFERIOR: REAGENTES ═════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, alignItems: 'flex-end' }}>

              {/* MICROPIPETA P1000 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('micropipeta')}`}
                  draggable={isItem('micropipeta')}
                  onDragStart={e => handleDragStart('micropipeta', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: isItem('micropipeta') ? 'grab' : 'default' }}>
                  <MicropipetaP1000SVG comAmostra={micropipetaComAmostra} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('micropipeta') ? '🖱️ ' : ''}Micropipeta P1000</span>
              </div>

              {/* AMOSTRA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <ZonaDrop id="amostra" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <ItemBancada id="amostra" className={`${itemCls('amostra')} ${dropCls('amostra')}`} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <FrascoReagente cor="rgba(140,200,240,0.78)" label="Amostra" sub="5,0 mL" nivel={nivelAmostra} />
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>Amostra</span>
                  </ItemBancada>
                </ZonaDrop>
              </div>

              {/* REAGENTE SÍLICA BAIXA 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('reagente_sb1')}`}
                  draggable={isItem('reagente_sb1')}
                  onDragStart={e => handleDragStart('reagente_sb1', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(120,200,100,0.85)" label="Sílica B.1" sub="3 gotas" nivel={nivelSB1} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('reagente_sb1') ? '🖱️ ' : ''}Sílica Baixa 1</span>
                {sb1Adicionado && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* REAGENTE SÍLICA BAIXA 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <ZonaDrop id="reagente_sb2" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
                  <div className={`item-drag ${dropCls('reagente_sb2')}`}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <FrascoReagente cor="rgba(80,160,240,0.85)" label="Sílica B.2" sub="0,50 mL" nivel={nivelSB2} />
                  </div>
                </ZonaDrop>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>Sílica Baixa 2</span>
                {sb2Adicionado && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

              {/* NaOH (informacional — ajuste pH) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: etapaAtual === 1 ? 1 : 0.35, transition: 'opacity 0.4s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(34,197,94,0.75)" label="NaOH" sub="↑ pH" nivel={72} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: etapaAtual === 1 ? '#4ade80' : '#6b7280' }}>NaOH</span>
                <span style={{ fontSize: 7, color: '#6b7280' }}>ajuste pH</span>
              </div>

              {/* H₂SO₄ (informacional — ajuste pH) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: etapaAtual === 1 ? 1 : 0.35, transition: 'opacity 0.4s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(239,68,68,0.75)" label="H₂SO₄" sub="↓ pH" nivel={70} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: etapaAtual === 1 ? '#f87171' : '#6b7280' }}>H₂SO₄</span>
                <span style={{ fontSize: 7, color: '#6b7280' }}>ajuste pH</span>
              </div>

              {/* ÁGUA DESTILADA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div className={`item-drag ${itemCls('agua_dest')}`}
                  draggable={isItem('agua_dest')}
                  onDragStart={e => handleDragStart('agua_dest', e)}
                  onDragEnd={handleDragEnd}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <FrascoReagente cor="rgba(200,232,255,0.82)" label="H₂O dest." sub="branco" nivel={nivelAguaDest} />
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#e7e5e4' }}>{isItem('agua_dest') ? '🖱️ ' : ''}Água Destilada</span>
                {cubetaBrancoPreparada && <span style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700 }}>✓</span>}
              </div>

            </div>{/* fim zona inferior */}

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

export default SilicaBaixaMk;
