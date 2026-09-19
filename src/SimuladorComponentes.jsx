/**
 * SimuladorComponentes.jsx
 *
 * Biblioteca de componentes visuais reutilizáveis compartilhados
 * entre todos os simuladores da plataforma (ART, Viabilidade, Sílica).
 *
 * Exporta:
 *   - HeaderSimulador   → cabeçalho do painel lateral (título, ícone, pontuação, badges)
 *   - BannerEtapa       → card da etapa atual com número e descrição
 *   - BarraProgresso    → barra de progresso animada
 *   - InstrucoesEtapa   → lista de passos com status (ativa / concluída)
 *   - PainelDireito     → agrega todos os componentes acima em uma sidebar
 *   - LayoutSimulador   → wrapper principal: bancada (esquerda) + painel (direita)
 *
 * Estilo: injeção única de CSS global via <style> no <head>.
 * O guard `stylesInjected` garante que a injeção ocorre apenas uma vez,
 * independente de quantos componentes chamem `injectGlobalStyles()`.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award } from 'lucide-react';
import { AREAS } from './pages/data/simuladores';

/* ─── Design tokens ────────────────────────────────────────────────────── */

const tokens = {
  bg:        '#0a0f1e',
  surface:   '#111827',
  border:    'rgba(99,179,237,0.18)',
  borderHi:  'rgba(99,179,237,0.55)',
  cyan:      '#22d3ee',
  indigo:    '#818cf8',
  emerald:   '#34d399',
  amber:     '#fbbf24',
  textPri:   '#f0f6ff',
  textSec:   'rgba(240,246,255,0.62)',
  textMuted: 'rgba(240,246,255,0.35)',
  radius:    { md: 16, lg: 22 },
};


/* ─── Injeção de estilos globais ────────────────────────────────────────── */

/*
 * Flag de controle: garante que os estilos são injetados apenas uma vez,
 * mesmo que múltiplos componentes chamem `injectGlobalStyles()` no mesmo render.
 */
let stylesInjected = false;

function injectGlobalStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

    :root {
      --sim-bg:      ${tokens.bg};
      --sim-surface: ${tokens.surface};
      --sim-cyan:    ${tokens.cyan};
      --sim-indigo:  ${tokens.indigo};
      --sim-emerald: ${tokens.emerald};
    }

    * { box-sizing: border-box; }

    html, body, #root {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: var(--sim-bg);
    }

    body {
      overflow-x: hidden;
      font-family: 'DM Sans', sans-serif;
      color: ${tokens.textPri};
    }

    ::-webkit-scrollbar             { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track       { background: ${tokens.surface}; }
    ::-webkit-scrollbar-thumb       { background: ${tokens.border}; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: ${tokens.borderHi}; }

    /* ── Layout raiz: bancada + painel lateral ── */
    .sim-root {
      display: flex;
      align-items: stretch;
      min-height: 100vh;
      height: 100vh;
      overflow: hidden;
      background:
        radial-gradient(circle at top left,    rgba(34,211,238,0.05), transparent 28%),
        radial-gradient(circle at bottom right, rgba(129,140,248,0.05), transparent 30%),
        var(--sim-bg);
    }

    /* Área da bancada de laboratório — rolagem interna */
    .sim-bancada-area {
      flex: 1;
      min-width: 0;
      padding: 26px 26px 56px;
      overflow-x: auto;
      overflow-y: auto;
      height: 100vh;
      min-height: 100vh;
      scroll-behavior: smooth;
    }

    /* Painel lateral direito — fixo enquanto a bancada rola */
    .sim-painel-direito {
      position: sticky;
      top: 0;
      height: 100vh;
      width: 420px;
      min-width: 380px;
      max-width: 460px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      background: linear-gradient(180deg, rgba(17,24,39,0.98), rgba(12,18,32,0.98));
      border-left: 1px solid ${tokens.border};
      box-shadow: -10px 0 40px rgba(0,0,0,0.45);
      flex-shrink: 0;
      z-index: 10;
      backdrop-filter: blur(10px);
    }

    /* ── Header do painel ── */
    .sim-header {
      background: linear-gradient(135deg, #0f1f40 0%, #1a2550 55%, #172554 100%);
      padding: 24px 22px 20px;
      border-bottom: 1px solid ${tokens.border};
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }
    .sim-header::before {
      content: '';
      position: absolute;
      top: -42px; right: -42px;
      width: 130px; height: 130px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 70%);
      pointer-events: none;
    }

    .sim-header-icon {
      width: 48px; height: 48px;
      background: linear-gradient(135deg, ${tokens.cyan}, ${tokens.indigo});
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
      box-shadow: 0 6px 18px rgba(34,211,238,0.25);
      flex-shrink: 0;
    }

    .sim-header-title {
      font-size: 17px; font-weight: 900;
      color: ${tokens.textPri};
      line-height: 1.15; margin: 0;
      letter-spacing: -0.25px;
    }
    .sim-header-sub {
      font-size: 11px; color: ${tokens.textSec};
      margin: 4px 0 0; line-height: 1.4;
    }
    .sim-header-badge {
      font-size: 9.5px;
      background: rgba(34,211,238,0.12);
      border: 1px solid rgba(34,211,238,0.3);
      color: ${tokens.cyan};
      padding: 4px 9px; border-radius: 999px;
      font-weight: 700; letter-spacing: 0.45px;
      white-space: nowrap;
    }

    /* Card de pontuação */
    .sim-pontos-card {
      margin-top: 14px;
      background: rgba(251,191,36,0.10);
      border: 1px solid rgba(251,191,36,0.28);
      border-radius: 16px;
      padding: 12px 14px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .sim-pontos-label {
      display: flex; align-items: center; gap: 8px;
      color: rgba(251,191,36,0.92);
      font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.6px;
    }
    .sim-pontos-num {
      color: ${tokens.amber};
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px; font-weight: 900; line-height: 1;
      text-shadow: 0 0 12px rgba(251,191,36,0.25);
    }

    /* ── Banner da etapa atual ── */
    .sim-banner-etapa {
      margin: 18px 18px 0;
      background: linear-gradient(135deg, #064e3b, #065f46 55%, #047857 100%);
      border: 1px solid rgba(52,211,153,0.35);
      border-radius: ${tokens.radius.lg}px;
      padding: 18px;
      position: relative; overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 6px 22px rgba(5,150,105,0.18);
      transition: transform 0.2s ease, box-shadow 0.3s ease;
    }
    .sim-banner-etapa::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 55%);
      pointer-events: none;
    }

    /* Número da etapa (círculo/quadrado com número) */
    .sim-etapa-num {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, ${tokens.emerald}, #059669);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 900; color: white;
      font-family: 'JetBrains Mono', monospace;
      box-shadow: 0 4px 14px rgba(5,150,105,0.32);
      flex-shrink: 0;
      animation: sim-pulse 2s ease-in-out infinite;
    }

    .sim-etapa-titulo {
      font-size: 14.5px; font-weight: 800;
      color: ${tokens.textPri};
      margin: 0 0 5px; line-height: 1.28;
    }
    .sim-etapa-desc {
      font-size: 11.5px;
      color: rgba(255,255,255,0.78);
      margin: 0; line-height: 1.5;
    }
    .sim-progresso-txt {
      font-size: 9.5px;
      color: rgba(255,255,255,0.58);
      text-align: right; margin: 0 0 4px;
    }
    .sim-progresso-num {
      font-size: 24px; font-weight: 900;
      color: ${tokens.emerald}; line-height: 1;
      text-align: right; margin: 0;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ── Barra de progresso ── */
    .sim-barra-wrap {
      margin: 14px 18px 0;
      background: rgba(255,255,255,0.06);
      border-radius: 999px; height: 8px; overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .sim-barra-fill {
      height: 100%; border-radius: 999px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      background-size: 200% 100%;
      background-image: linear-gradient(90deg, ${tokens.cyan} 0%, ${tokens.indigo} 45%, ${tokens.cyan} 90%);
      animation: sim-shimmer 3s linear infinite;
    }
    .sim-barra-fill::after {
      content: '';
      position: absolute; right: 0; top: 50%;
      transform: translateY(-50%);
      width: 10px; height: 10px;
      background: white; border-radius: 50%;
      box-shadow: 0 0 8px ${tokens.cyan};
    }
    .sim-barra-pct {
      margin: 7px 18px 0;
      display: flex; justify-content: space-between;
      font-size: 9.5px; color: ${tokens.textMuted};
    }

    /* ── Lista de instruções / passos ── */
    .sim-instrucoes {
      margin: 16px 18px 0;
      background: rgba(255,255,255,0.04);
      border: 1px solid ${tokens.border};
      border-radius: ${tokens.radius.md}px;
      padding: 16px;
    }
    .sim-instrucoes-titulo {
      font-size: 10px; font-weight: 700;
      color: ${tokens.cyan}; letter-spacing: 0.8px;
      text-transform: uppercase;
      margin: 0 0 10px;
      display: flex; align-items: center; gap: 6px;
    }
    .sim-instrucoes-titulo::before {
      content: '';
      width: 14px; height: 2px;
      background: ${tokens.cyan}; border-radius: 999px;
    }

    .sim-steps-list {
      list-style: none; padding: 0; margin: 0;
      display: flex; flex-direction: column; gap: 8px;
    }
    .sim-step-item {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 11.8px; color: ${tokens.textSec};
      line-height: 1.45;
      padding: 9px 10px; border-radius: 10px;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .sim-step-item.ativa    { background: rgba(34,211,238,0.08); border-color: rgba(34,211,238,0.28); color: ${tokens.textPri}; }
    .sim-step-item.concluida { opacity: 0.55; }

    .sim-step-dot {
      width: 18px; height: 18px;
      border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; flex-shrink: 0; margin-top: 1px;
      transition: all 0.2s ease;
    }
    .sim-step-item.ativa    .sim-step-dot { background: ${tokens.cyan};    border-color: ${tokens.cyan};    box-shadow: 0 0 8px rgba(34,211,238,0.45); }
    .sim-step-item.concluida .sim-step-dot { background: ${tokens.emerald}; border-color: ${tokens.emerald}; }

    /* ── Dica / hint ── */
    .sim-dica {
      margin: 16px 18px 0;
      background: rgba(251,191,36,0.08);
      border: 1px solid rgba(251,191,36,0.25);
      border-radius: ${tokens.radius.md}px;
      padding: 12px 15px;
      display: flex; align-items: center; gap: 9px;
    }
    .sim-dica-icon { font-size: 16px; flex-shrink: 0; }
    .sim-dica-txt  { font-size: 11px; color: rgba(251,191,36,0.92); font-weight: 600; line-height: 1.45; }

    /* Espaçador flex para empurrar o footer ao fundo */
    .sim-painel-spacer { flex: 1; min-height: 24px; }

    /* ── Footer do painel ── */
    .sim-painel-footer {
      padding: 15px 18px;
      border-top: 1px solid ${tokens.border};
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(0,0,0,0.22);
    }
    .sim-footer-label { font-size: 10px; color: ${tokens.textMuted}; }
    .sim-footer-pct   { font-size: 13px; font-weight: 900; color: ${tokens.cyan}; font-family: 'JetBrains Mono', monospace; }

    /* ── Keyframes do painel ── */
    @keyframes sim-pulse {
      0%, 100% { box-shadow: 0 0 0 0   rgba(34,211,238,0.45); }
      50%       { box-shadow: 0 0 0 6px rgba(34,211,238,0); }
    }
    @keyframes sim-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    /* ── Responsividade ── */
    @media (max-width: 1024px) {
      .sim-painel-direito { width: 360px; min-width: 320px; max-width: 380px; }
    }

    @media (max-width: 900px) {
      /* Empilha verticalmente: painel de instruções acima, bancada abaixo,
         cada um com rolagem vertical própria (2 áreas, como antes).
         Rolagem horizontal da bancada preservada para bancadas mais
         largas que a tela. */
      .sim-root {
        flex-direction: column-reverse;
        height: 100vh;
        overflow: hidden;
      }
      .sim-painel-direito {
        position: relative; top: auto;
        height: 52vh; max-height: 52vh;
        width: 100%; max-width: 100%; min-width: 0;
        overflow-y: auto;
        border-left: none;
        border-bottom: 1px solid ${tokens.border};
        box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        flex-shrink: 0;
      }
      .sim-bancada-area {
        flex: none;
        width: 100%; padding: 16px 12px 32px;
        height: 48vh; min-height: 48vh;
        overflow-y: auto;
        /* overflow-x permanece "auto" (herdado): bancadas com largura fixa
           maior que a tela ganham rolagem horizontal em vez de serem cortadas. */
      }
    }

    @media (max-width: 680px) {
      .sim-bancada-area { padding: 10px 6px 24px; }
      .sim-header { padding: 14px 14px 12px; }
      .sim-header-icon { width: 40px; height: 40px; font-size: 20px; }
      .sim-pontos-card { margin-top: 10px; padding: 9px 12px; }
      .sim-pontos-num { font-size: 20px; }
      .sim-banner-etapa, .sim-instrucoes, .sim-dica { margin-left: 12px; margin-right: 12px; }
      .sim-banner-etapa { padding: 12px; margin-top: 12px; }
      .sim-etapa-num { width: 34px; height: 34px; font-size: 14px; }
      .sim-etapa-titulo { font-size: 13px; line-height: 1.3; }
      .sim-etapa-desc   { font-size: 10.5px; line-height: 1.45; }
      .sim-progresso-num { font-size: 18px; }
      .sim-barra-wrap { margin: 10px 12px 0; }
      .sim-barra-pct  { margin: 6px 12px 0; }
    }

    /* Telas muito estreitas: evita que o cabeçalho e o banner da etapa
       sejam cortados por overflow:hidden — quebra para a linha seguinte
       em vez de espremer/clipar o conteúdo. */
    @media (max-width: 480px) {
      .sim-header-row,
      .sim-banner-row { flex-wrap: wrap; }
      .sim-banner-row > div:last-child {
        flex-basis: 100%;
        text-align: left;
        margin-top: 6px;
      }
      .sim-progresso-txt,
      .sim-progresso-num { display: inline; margin: 0; }
      .sim-progresso-num { margin-left: 6px; }
      .sim-barra-pct { flex-wrap: wrap; gap: 4px; }
    }

    /* ── Breadcrumb (Home > Área > Simulador) ── */
    .sim-breadcrumb {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      font-size: 10.5px; color: ${tokens.textMuted};
      margin: 0 0 12px;
    }
    .sim-breadcrumb-link {
      color: ${tokens.textSec}; text-decoration: none; font-weight: 600;
      transition: color 0.15s ease;
    }
    .sim-breadcrumb-link:hover { color: ${tokens.cyan}; }
    .sim-breadcrumb-sep { color: ${tokens.textMuted}; }
    .sim-breadcrumb-current { color: ${tokens.cyan}; font-weight: 700; }

    /* ── Botão Voltar (mesmo estilo do "← Início" do AreaHub) ── */
    .sim-voltar {
      display: inline-flex; align-items: center; gap: 6px;
      color: ${tokens.textMuted}; text-decoration: none;
      font-size: 12px; font-weight: 600;
      margin: 0 0 8px;
      transition: color 0.15s ease;
    }
    .sim-voltar:hover { color: ${tokens.cyan}; }

    /* ── Tela de loading (Suspense fallback dos simuladores) ── */
    .sim-loading {
      min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 14px;
      background: var(--sim-bg);
      color: ${tokens.textSec};
      font-family: 'DM Sans', sans-serif;
    }
    .sim-loading-icon { font-size: 42px; line-height: 1; }
    .sim-loading-spinner {
      width: 38px; height: 38px;
      border: 3px solid rgba(34,211,238,0.18);
      border-top-color: ${tokens.cyan};
      border-radius: 50%;
      animation: sim-spin 0.8s linear infinite;
    }
    .sim-loading-txt { font-size: 13px; font-weight: 600; letter-spacing: 0.2px; }
    @keyframes sim-spin { to { transform: rotate(360deg); } }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

/*
 * NOTA SOBRE INJEÇÃO DE CSS:
 * injectGlobalStyles() é chamada DENTRO de LayoutSimulador (componente raiz),
 * e não em nível de módulo. Isso garante que o CSS só seja injetado quando um
 * simulador que usa LayoutSimulador realmente renderizar, evitando conflitos
 * de estilos globais (html/body/#root) nas páginas que não usam este layout
 * (ex.: SilicaBaixa e COI têm seus próprios sistemas de estilo).
 */


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: BreadcrumbSimulador
   ════════════════════════════════════════════════════════════════════════
   Trilha de navegação "Home > Área > Simulador", resolvida automaticamente
   a partir da rota atual (useLocation) usando a fonte única AREAS
   (src/pages/data/simuladores.js). Não exige props: cada simulador que usa
   HeaderSimulador/LayoutSimulador exibe a trilha correta sem alterações.
   ════════════════════════════════════════════════════════════════════════ */
export function BreadcrumbSimulador() {
  const { pathname } = useLocation();

  let info = null;
  for (const area of AREAS) {
    const sim = area.simuladores.find((s) => s.rota === pathname);
    if (sim) { info = { area, sim }; break; }
  }
  if (!info) return null;

  return (
    <>
      <Link to={info.area.rota} className="sim-voltar">← Voltar</Link>
      <nav className="sim-breadcrumb" aria-label="Trilha de navegação">
        <Link to="/" className="sim-breadcrumb-link">Home</Link>
        <span className="sim-breadcrumb-sep" aria-hidden="true">/</span>
        <Link to={info.area.rota} className="sim-breadcrumb-link">{info.area.titulo}</Link>
        <span className="sim-breadcrumb-sep" aria-hidden="true">/</span>
        <span className="sim-breadcrumb-current" aria-current="page">{info.sim.titulo}</span>
      </nav>
    </>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: HeaderSimulador
   ════════════════════════════════════════════════════════════════════════
   Exibe o cabeçalho do painel lateral com:
   - Ícone + título + subtítulo do simulador
   - Badges identificadores configuráveis via prop `badges`
   - Card de pontuação atual

   Props:
     titulo     {string}   — nome do simulador
     subtitulo  {string}   — descrição (suporta \n para quebras de linha)
     icone      {string}   — emoji ou caractere de ícone
     pontuacao  {number}   — pontos acumulados até o momento
     badges     {string[]} — rótulos exibidos como chips (ex: ['🏭 USINA', '⚗️ ART'])
   ════════════════════════════════════════════════════════════════════════ */
export function HeaderSimulador({
  titulo     = 'Análise de ART — Dorna',
  subtitulo  = 'Açúcares Redutores Totais\nSimulador de bancada industrial',
  icone      = '🧪',
  pontuacao  = 0,
  badges     = ['🏭 USINA VIRTUAL', '🎓 DIDÁTICO'],
}) {
  const linhas = String(subtitulo).split('\n');

  return (
    <div className="sim-header">
      <BreadcrumbSimulador />
      <div className="sim-header-row" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="sim-header-icon" aria-hidden="true">{icone}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="sim-header-title">{titulo}</h1>
          <p className="sim-header-sub">
            {linhas.map((linha, i) => (
              <React.Fragment key={i}>
                {linha}
                {i < linhas.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Badges identificadores do simulador */}
      {badges.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {badges.map((badge) => (
            <span key={badge} className="sim-header-badge">{badge}</span>
          ))}
        </div>
      )}

      {/* Card de pontuação */}
      <div className="sim-pontos-card" role="status" aria-label={`Pontuação: ${pontuacao} pontos`}>
        <div className="sim-pontos-label">
          <Award size={16} aria-hidden="true" />
          Pontos
        </div>
        <div className="sim-pontos-num">{pontuacao}</div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: BannerEtapa
   ════════════════════════════════════════════════════════════════════════
   Card verde que exibe a etapa atual do procedimento:
   - Número da etapa (com animação de pulso)
   - Título e descrição da etapa
   - Contador X/Total no canto direito

   Props:
     etapaAtual {number}   — índice da etapa atual (base 0)
     etapas     {object[]} — array completo de etapas com { titulo, descricao }
   ════════════════════════════════════════════════════════════════════════ */
export function BannerEtapa({ etapaAtual, etapas }) {
  const total = etapas?.length ?? 1;
  const etapa = etapas?.[etapaAtual] ?? {};

  return (
    <div className="sim-banner-etapa" aria-live="polite" aria-label={`Etapa ${etapaAtual + 1} de ${total}: ${etapa.titulo ?? ''}`}>
      <div className="sim-banner-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div className="sim-etapa-num" aria-hidden="true">{etapaAtual + 1}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="sim-etapa-titulo">{etapa.titulo ?? '—'}</h2>
          <p className="sim-etapa-desc">{etapa.descricao ?? ''}</p>
        </div>

        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <p className="sim-progresso-txt">Etapa</p>
          <p className="sim-progresso-num" aria-hidden="true">
            {etapaAtual + 1}
            <span style={{ fontSize: 12, color: 'rgba(52,211,153,0.6)' }}>/{total}</span>
          </p>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: BarraProgresso
   ════════════════════════════════════════════════════════════════════════
   Barra animada que representa o percentual concluído do procedimento.
   Calculado como: etapaAtual / (total - 1) × 100

   Props:
     etapaAtual {number} — índice da etapa atual (base 0)
     total      {number} — número total de etapas
   ════════════════════════════════════════════════════════════════════════ */
export function BarraProgresso({ etapaAtual, total }) {
  const pct = total > 1 ? Math.round((etapaAtual / (total - 1)) * 100) : 0;

  return (
    <>
      <div
        className="sim-barra-wrap"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso: ${pct}% concluído`}
      >
        <div className="sim-barra-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="sim-barra-pct" aria-hidden="true">
        <span>Início</span>
        <span style={{ color: tokens.cyan, fontWeight: 700 }}>{pct}% concluído</span>
        <span>Fim</span>
      </div>
    </>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: InstrucoesEtapa
   ════════════════════════════════════════════════════════════════════════
   Lista as etapas visíveis (janela deslizante de até 3 itens):
   - Etapa ativa: destacada em azul com ícone ▶
   - Etapas concluídas: opacidade reduzida com ✓
   - Etapas futuras: não exibidas (a lista só mostra até a etapa atual)

   Props:
     etapaAtual {number}   — índice da etapa atual (base 0)
     etapas     {object[]} — array completo de etapas com { descricao }
   ════════════════════════════════════════════════════════════════════════ */
export function InstrucoesEtapa({ etapaAtual, etapas }) {
  /* Janela deslizante: exibe as 3 últimas etapas (2 concluídas + a atual) */
  const inicio    = Math.max(0, etapaAtual - 2);
  const visiveis  = (etapas ?? []).slice(inicio, etapaAtual + 1);

  return (
    <>
      <div className="sim-instrucoes">
        <p className="sim-instrucoes-titulo" aria-hidden="true">Passo a passo</p>

        <ul className="sim-steps-list" aria-label="Passos do procedimento">
          {visiveis.map((et, idx) => {
            const indiceReal = inicio + idx;
            const isAtiva    = indiceReal === etapaAtual;
            const isConcluida = indiceReal < etapaAtual;
            const classe     = `sim-step-item${isAtiva ? ' ativa' : ''}${isConcluida ? ' concluida' : ''}`;

            return (
              <li key={indiceReal} className={classe} aria-current={isAtiva ? 'step' : undefined}>
                <div className="sim-step-dot" aria-hidden="true">
                  {isConcluida ? '✓' : isAtiva ? '▶' : ''}
                </div>
                <span>{et.descricao}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Dica de como interagir com a bancada */}
      <div className="sim-dica" role="note">
        <span className="sim-dica-icon" aria-hidden="true">💡</span>
        <span className="sim-dica-txt">
          Arraste os itens <strong>piscando</strong> para os locais destacados em azul na bancada.
        </span>
      </div>
    </>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: PainelDireito
   ════════════════════════════════════════════════════════════════════════
   Sidebar completa que agrega: Header + Banner + Barra + Instruções.
   Recebe as mesmas props que HeaderSimulador e as distribui
   para os subcomponentes corretos.

   Props:
     etapaAtual {number}   — índice da etapa atual
     etapas     {object[]} — array de etapas
     pontuacao  {number}   — pontos acumulados
     badges     {string[]} — rótulos do header (opcional)
     titulo     {string}   — título do simulador (opcional)
     subtitulo  {string}   — subtítulo (opcional)
     icone      {string}   — ícone (opcional)
     footerLabel {string}  — texto do rodapé do painel (opcional)
   ════════════════════════════════════════════════════════════════════════ */
export function PainelDireito({
  etapaAtual,
  etapas,
  pontuacao   = 0,
  badges,
  titulo,
  subtitulo,
  icone,
  footerLabel = '🧪 Simulador',
}) {
  const total = etapas?.length ?? 1;
  const pct   = total > 1 ? Math.round((etapaAtual / (total - 1)) * 100) : 0;

  return (
    <aside className="sim-painel-direito" aria-label="Painel de progresso">
      <HeaderSimulador
        pontuacao={pontuacao}
        badges={badges}
        titulo={titulo}
        subtitulo={subtitulo}
        icone={icone}
      />
      <BannerEtapa    etapaAtual={etapaAtual} etapas={etapas} />
      <BarraProgresso etapaAtual={etapaAtual} total={total} />
      <InstrucoesEtapa etapaAtual={etapaAtual} etapas={etapas} />
      <div className="sim-painel-spacer" />

      <div className="sim-painel-footer">
        <span className="sim-footer-label">{footerLabel}</span>
        <span className="sim-footer-pct">{pct}%</span>
      </div>
    </aside>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: LayoutSimulador
   ════════════════════════════════════════════════════════════════════════
   Wrapper de layout principal da plataforma.
   Divide a tela em duas colunas:
     - Esquerda (flex: 1): área da bancada (children)
     - Direita (fixo):     PainelDireito com progresso e instruções

   Props:
     etapaAtual  {number}   — etapa atual (passada ao painel)
     etapas      {object[]} — lista de etapas (passada ao painel)
     pontuacao   {number}   — pontuação atual
     badges      {string[]} — badges do header (opcional)
     titulo      {string}   — título do simulador (opcional)
     subtitulo   {string}   — subtítulo (opcional)
     icone       {string}   — ícone (opcional)
     footerLabel {string}   — rodapé do painel (opcional)
     children    {ReactNode} — conteúdo da bancada
   ════════════════════════════════════════════════════════════════════════ */
export function LayoutSimulador({
  etapaAtual,
  etapas,
  pontuacao   = 0,
  badges,
  titulo,
  subtitulo,
  icone,
  footerLabel,
  children,
}) {
  // Injeta os estilos globais apenas quando este layout renderiza,
  // garantindo que não interferirá com SilicaBaixa ou COI.
  injectGlobalStyles();

  return (
    <div className="sim-root">
      <main className="sim-bancada-area" role="main">
        {children}
      </main>
      <PainelDireito
        etapaAtual={etapaAtual}
        etapas={etapas}
        pontuacao={pontuacao}
        badges={badges}
        titulo={titulo}
        subtitulo={subtitulo}
        icone={icone}
        footerLabel={footerLabel}
      />
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE: SimuladorLoading
   ════════════════════════════════════════════════════════════════════════
   Fallback de <Suspense> usado enquanto o chunk de um simulador (lazy)
   é baixado. Mantém a identidade visual (tema dark, ícone, spinner)
   em vez de um texto cru.
   ════════════════════════════════════════════════════════════════════════ */
export function SimuladorLoading() {
  injectGlobalStyles();

  return (
    <div className="sim-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="sim-loading-icon" aria-hidden="true">🏭</div>
      <div className="sim-loading-spinner" aria-hidden="true" />
      <p className="sim-loading-txt">Carregando simulador…</p>
    </div>
  );
}
