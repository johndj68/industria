import React from 'react';
import { Award } from 'lucide-react';

/* ─────────────────────────────────────────────
   COMPONENTES VISUAIS PADRÃO — Simuladores LOBBY
   Painel lateral + bancada + pontos + progresso
───────────────────────────────────────────── */
const tokens = {
  bg: '#0a0f1e',
  surface: '#111827',
  border: 'rgba(99,179,237,0.18)',
  borderHi: 'rgba(99,179,237,0.55)',
  cyan: '#22d3ee',
  indigo: '#818cf8',
  emerald: '#34d399',
  amber: '#fbbf24',
  textPri: '#f0f6ff',
  textSec: 'rgba(240,246,255,0.62)',
  textMuted: 'rgba(240,246,255,0.35)',
  radius: { md: 16, lg: 22 },
};

let stylesInjected = false;
function injectGlobalStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

    :root {
      --sim-bg: ${tokens.bg};
      --sim-surface: ${tokens.surface};
      --sim-cyan: ${tokens.cyan};
      --sim-indigo: ${tokens.indigo};
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

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: ${tokens.surface}; }
    ::-webkit-scrollbar-thumb { background: ${tokens.border}; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: ${tokens.borderHi}; }

    .sim-root {
      display: flex;
      align-items: stretch;
      min-height: 100vh;
      height: 100vh;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(34,211,238,0.05), transparent 28%),
        radial-gradient(circle at bottom right, rgba(129,140,248,0.05), transparent 30%),
        var(--sim-bg);
    }

    .sim-bancada-area {
      flex: 1;
      min-width: 0;
      padding: 26px 26px 56px 26px;
      overflow-x: auto;
      overflow-y: auto;
      height: 100vh;
      min-height: 100vh;
      scroll-behavior: smooth;
    }

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
      padding: 0;
      flex-shrink: 0;
      z-index: 10;
      backdrop-filter: blur(10px);
    }

    .sim-header {
      background: linear-gradient(135deg, #0f1f40 0%, #1a2550 55%, #172554 100%);
      padding: 24px 22px 20px;
      border-bottom: 1px solid ${tokens.border};
      position: relative;
      overflow: hidden;
    }

    .sim-header::before {
      content: '';
      position: absolute;
      top: -42px;
      right: -42px;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 70%);
      pointer-events: none;
    }

    .sim-header-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, ${tokens.cyan}, ${tokens.indigo});
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 6px 18px rgba(34,211,238,0.25);
      flex-shrink: 0;
    }

    .sim-header-title {
      font-size: 17px;
      font-weight: 900;
      color: ${tokens.textPri};
      line-height: 1.15;
      margin: 0;
      letter-spacing: -0.25px;
    }

    .sim-header-sub {
      font-size: 11px;
      color: ${tokens.textSec};
      margin: 4px 0 0;
      line-height: 1.4;
    }

    .sim-header-badge {
      font-size: 9.5px;
      background: rgba(34,211,238,0.12);
      border: 1px solid rgba(34,211,238,0.3);
      color: ${tokens.cyan};
      padding: 4px 9px;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.45px;
      white-space: nowrap;
    }

    .sim-pontos-card {
      margin-top: 14px;
      background: rgba(251,191,36,0.10);
      border: 1px solid rgba(251,191,36,0.28);
      border-radius: 16px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .sim-pontos-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(251,191,36,0.92);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .sim-pontos-num {
      color: ${tokens.amber};
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      line-height: 1;
      font-weight: 900;
      text-shadow: 0 0 12px rgba(251,191,36,0.25);
    }

    .sim-banner-etapa {
      margin: 18px 18px 0;
      background: linear-gradient(135deg, #064e3b, #065f46 55%, #047857 100%);
      border: 1px solid rgba(52,211,153,0.35);
      border-radius: ${tokens.radius.lg}px;
      padding: 18px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 6px 22px rgba(5,150,105,0.18);
      transition: transform 0.2s ease, box-shadow 0.3s ease;
    }

    .sim-banner-etapa::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 55%);
      pointer-events: none;
    }

    .sim-etapa-num {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, ${tokens.emerald}, #059669);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
      color: white;
      font-family: 'JetBrains Mono', monospace;
      box-shadow: 0 4px 14px rgba(5,150,105,0.32);
      flex-shrink: 0;
      animation: sim-pulse 2s ease-in-out infinite;
    }

    .sim-etapa-titulo {
      font-size: 14.5px;
      font-weight: 800;
      color: ${tokens.textPri};
      margin: 0 0 5px;
      line-height: 1.28;
    }

    .sim-etapa-desc {
      font-size: 11.5px;
      color: rgba(255,255,255,0.78);
      margin: 0;
      line-height: 1.5;
    }

    .sim-progresso-txt {
      font-size: 9.5px;
      color: rgba(255,255,255,0.58);
      text-align: right;
      margin: 0 0 4px;
    }

    .sim-progresso-num {
      font-size: 24px;
      font-weight: 900;
      color: ${tokens.emerald};
      line-height: 1;
      text-align: right;
      margin: 0;
      font-family: 'JetBrains Mono', monospace;
    }

    .sim-barra-wrap {
      margin: 14px 18px 0;
      background: rgba(255,255,255,0.06);
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .sim-barra-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      background-size: 200% 100%;
      background-image: linear-gradient(90deg, ${tokens.cyan} 0%, ${tokens.indigo} 45%, ${tokens.cyan} 90%);
      animation: sim-shimmer 3s linear infinite;
    }

    .sim-barra-fill::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 8px ${tokens.cyan};
    }

    .sim-barra-pct {
      margin: 7px 18px 0;
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: ${tokens.textMuted};
    }

    .sim-instrucoes {
      margin: 16px 18px 0;
      background: rgba(255,255,255,0.04);
      border: 1px solid ${tokens.border};
      border-radius: ${tokens.radius.md}px;
      padding: 16px;
    }

    .sim-instrucoes-titulo {
      font-size: 10px;
      font-weight: 700;
      color: ${tokens.cyan};
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin: 0 0 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sim-instrucoes-titulo::before {
      content: '';
      width: 14px;
      height: 2px;
      background: ${tokens.cyan};
      border-radius: 999px;
    }

    .sim-steps-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sim-step-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 11.8px;
      color: ${tokens.textSec};
      line-height: 1.45;
      padding: 9px 10px;
      border-radius: 10px;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }

    .sim-step-item.ativa {
      background: rgba(34,211,238,0.08);
      border-color: rgba(34,211,238,0.28);
      color: ${tokens.textPri};
    }

    .sim-step-item.concluida { opacity: 0.55; }

    .sim-step-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      flex-shrink: 0;
      margin-top: 1px;
      transition: all 0.2s ease;
    }

    .sim-step-item.ativa .sim-step-dot {
      background: ${tokens.cyan};
      border-color: ${tokens.cyan};
      box-shadow: 0 0 8px rgba(34,211,238,0.45);
    }

    .sim-step-item.concluida .sim-step-dot {
      background: ${tokens.emerald};
      border-color: ${tokens.emerald};
    }

    .sim-dica {
      margin: 16px 18px 0;
      background: rgba(251,191,36,0.08);
      border: 1px solid rgba(251,191,36,0.25);
      border-radius: ${tokens.radius.md}px;
      padding: 12px 15px;
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .sim-dica-icon { font-size: 16px; flex-shrink: 0; }
    .sim-dica-txt { font-size: 11px; color: rgba(251,191,36,0.92); font-weight: 600; line-height: 1.45; }
    .sim-painel-spacer { flex: 1; min-height: 24px; }

    .sim-painel-footer {
      padding: 15px 18px;
      border-top: 1px solid ${tokens.border};
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.22);
    }

    .sim-footer-label { font-size: 10px; color: ${tokens.textMuted}; }
    .sim-footer-pct { font-size: 13px; font-weight: 900; color: ${tokens.cyan}; font-family: 'JetBrains Mono', monospace; }

    @keyframes sim-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.45); }
      50% { box-shadow: 0 0 0 6px rgba(34,211,238,0); }
    }

    @keyframes sim-shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @media (max-width: 1024px) {
      .sim-painel-direito { width: 360px; min-width: 320px; max-width: 380px; }
    }

    @media (max-width: 900px) {
      .sim-root {
        flex-direction: column-reverse;
        height: 100vh;
        min-height: 100vh;
        overflow: hidden;
      }

      .sim-painel-direito {
        position: relative;
        top: auto;
        height: auto;
        max-height: 320px;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        overflow-y: auto;
        border-left: none;
        border-bottom: 1px solid ${tokens.border};
        box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        flex-shrink: 0;
      }

      .sim-bancada-area {
        width: 100%;
        padding: 16px 12px 32px;
        overflow-x: auto;
        overflow-y: auto;
        height: calc(100vh - 320px);
        min-height: 420px;
        scroll-behavior: smooth;
      }
    }

    @media (max-width: 680px) {
      .sim-bancada-area { padding: 10px 6px 24px; }
      .sim-header { padding: 18px 14px 16px; }
      .sim-banner-etapa, .sim-instrucoes, .sim-dica { margin-left: 12px; margin-right: 12px; }
      .sim-banner-etapa { padding: 14px; }
      .sim-etapa-titulo { font-size: 13px; line-height: 1.3; }
      .sim-etapa-desc { font-size: 10.5px; line-height: 1.45; }
      .sim-progresso-num { font-size: 20px; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

export function HeaderSimulador({
  titulo = 'Análise de ART - Dorna',
  subtitulo = 'Açúcares Redutores Totais\nSimulador de bancada industrial',
  icone = '🧪',
  pontuacao = 0,
}) {
  injectGlobalStyles();

  return (
    <div className="sim-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="sim-header-icon">{icone}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="sim-header-title">{titulo}</h1>
          <p className="sim-header-sub">
            {String(subtitulo).split('\n').map((linha, index) => (
              <React.Fragment key={index}>
                {linha}
                {index < String(subtitulo).split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span className="sim-header-badge">🏭 USINA VIRTUAL</span>
        <span className="sim-header-badge">🎓 DIDÁTICO</span>
        <span className="sim-header-badge">⚗️ ART</span>
      </div>

      <div className="sim-pontos-card">
        <div className="sim-pontos-label">
          <Award size={16} />
          Pontos
        </div>
        <div className="sim-pontos-num">{pontuacao}</div>
      </div>
    </div>
  );
}

export function BannerEtapa({ etapaAtual, etapas }) {
  injectGlobalStyles();

  const total = etapas?.length ?? 1;
  const etapa = etapas?.[etapaAtual] ?? {};

  return (
    <div className="sim-banner-etapa">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div className="sim-etapa-num">{etapaAtual + 1}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="sim-etapa-titulo">{etapa.titulo ?? '—'}</h2>
          <p className="sim-etapa-desc">{etapa.descricao ?? ''}</p>
        </div>

        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <p className="sim-progresso-txt">Etapa</p>
          <p className="sim-progresso-num">
            {etapaAtual + 1}
            <span style={{ fontSize: 12, color: 'rgba(52,211,153,0.6)' }}>/{total}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function BarraProgresso({ etapaAtual, total }) {
  injectGlobalStyles();

  const pct = total > 1 ? Math.round((etapaAtual / (total - 1)) * 100) : 0;

  return (
    <>
      <div className="sim-barra-wrap">
        <div className="sim-barra-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="sim-barra-pct">
        <span>Início</span>
        <span style={{ color: tokens.cyan, fontWeight: 700 }}>{pct}% concluído</span>
        <span>Fim</span>
      </div>
    </>
  );
}

export function InstrucoesEtapa({ etapaAtual, etapas }) {
  injectGlobalStyles();

  const start = Math.max(0, etapaAtual - 2);
  const visibles = (etapas ?? []).slice(start, etapaAtual + 1);

  return (
    <>
      <div className="sim-instrucoes">
        <p className="sim-instrucoes-titulo">Passo a passo</p>

        <ul className="sim-steps-list">
          {visibles.map((et, idx) => {
            const realIdx = start + idx;
            const isAtiva = realIdx === etapaAtual;
            const isConcluida = realIdx < etapaAtual;

            return (
              <li
                key={realIdx}
                className={`sim-step-item${isAtiva ? ' ativa' : ''}${isConcluida ? ' concluida' : ''}`}
              >
                <div className="sim-step-dot">{isConcluida ? '✓' : isAtiva ? '▶' : ''}</div>
                <span>{et.descricao}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sim-dica">
        <span className="sim-dica-icon">💡</span>
        <span className="sim-dica-txt">
          Arraste os itens <strong>piscando</strong> para os locais destacados em verde na bancada.
        </span>
      </div>
    </>
  );
}

export function PainelDireito({ etapaAtual, etapas, pontuacao = 0 }) {
  injectGlobalStyles();

  const total = etapas?.length ?? 1;
  const pct = total > 1 ? Math.round((etapaAtual / (total - 1)) * 100) : 0;

  return (
    <aside className="sim-painel-direito">
      <HeaderSimulador pontuacao={pontuacao} />
      <BannerEtapa etapaAtual={etapaAtual} etapas={etapas} />
      <BarraProgresso etapaAtual={etapaAtual} total={total} />
      <InstrucoesEtapa etapaAtual={etapaAtual} etapas={etapas} />
      <div className="sim-painel-spacer" />

      <div className="sim-painel-footer">
        <span className="sim-footer-label">🧪 Simulador ART</span>
        <span className="sim-footer-pct">{pct}%</span>
      </div>
    </aside>
  );
}

export function LayoutSimulador({ etapaAtual, etapas, pontuacao = 0, children }) {
  injectGlobalStyles();

  return (
    <div className="sim-root">
      <main className="sim-bancada-area">{children}</main>
      <PainelDireito etapaAtual={etapaAtual} etapas={etapas} pontuacao={pontuacao} />
    </div>
  );
}