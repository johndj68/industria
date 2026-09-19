import { Link } from 'react-router-dom';
import { AREAS } from './data/simuladores';

const SCROLLBAR_CSS = `
  .hub-page::-webkit-scrollbar { width: 5px; }
  .hub-page::-webkit-scrollbar-track { background: rgba(10,15,30,0); }
  .hub-page::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.22); border-radius: 4px; }
  .hub-page::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.50); }
  .hub-sim-card { transition: transform 0.16s ease, box-shadow 0.16s ease; }
  .hub-sim-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.38); }
`;

const S = {
  page: {
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    fontFamily: "'DM Sans',sans-serif",
    color: '#f0f6ff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '36px 20px 52px',
    boxSizing: 'border-box',
  },
  voltar: {
    alignSelf: 'flex-start',
    maxWidth: 1100,
    width: '100%',
    marginBottom: 28,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'rgba(240,246,255,0.55)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    transition: 'color 0.14s',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 640,
  },
  headerIcon: { fontSize: 52, lineHeight: 1, marginBottom: 14 },
  titulo: {
    fontSize: 28,
    fontWeight: 900,
    color: '#f0f6ff',
    margin: '0 0 8px',
    letterSpacing: '-0.4px',
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(240,246,255,0.52)',
    margin: 0,
    lineHeight: 1.55,
  },
  badge: (cor) => ({
    display: 'inline-block',
    marginTop: 10,
    padding: '3px 12px',
    borderRadius: 20,
    background: `${cor}22`,
    border: `1px solid ${cor}55`,
    color: cor,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.6px',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 18,
    width: '100%',
    maxWidth: 1100,
  },
  card: (corBg, corBorda) => ({
    background: corBg,
    border: `1px solid ${corBorda}`,
    borderRadius: 18,
    padding: '22px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }),
  cardIcon: { fontSize: 30, lineHeight: 1 },
  cardSub: (cor) => ({
    fontSize: 9.5,
    fontWeight: 700,
    color: cor,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    margin: 0,
  }),
  cardTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#f0f6ff',
    margin: '0 0 2px',
    lineHeight: 1.2,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(240,246,255,0.60)',
    lineHeight: 1.55,
    margin: 0,
    flex: 1,
  },
  botao: (cor) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    padding: '9px 16px',
    borderRadius: 11,
    background: cor,
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 12.5,
    textDecoration: 'none',
  }),
  empty: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '52px 24px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px dashed rgba(255,255,255,0.12)',
    borderRadius: 16,
    color: 'rgba(240,246,255,0.38)',
    fontSize: 14,
  },
  footer: {
    marginTop: 48,
    fontSize: 11,
    color: 'rgba(240,246,255,0.22)',
    textAlign: 'center',
  },
};

export default function AreaHub({ areaKey }) {
  const area = AREAS.find((a) => a.key === areaKey);
  if (!area) return null;

  return (
    <>
      <style>{SCROLLBAR_CSS}</style>
      <main style={S.page} className="hub-page" role="main">

        {/* ← Voltar */}
        <Link to="/" style={S.voltar}>
          ← Início
        </Link>

        {/* Cabeçalho da área */}
        <header style={S.header}>
          <div style={S.headerIcon}>{area.icone}</div>
          <h1 style={S.titulo}>{area.titulo}</h1>
          <p style={S.subtitulo}>{area.descricao}</p>
          <span style={S.badge(area.cor)}>
            {area.simuladores.length > 0
              ? `${area.simuladores.length} simulador${area.simuladores.length > 1 ? 'es' : ''}`
              : 'Em desenvolvimento'}
          </span>
        </header>

        {/* Grid de simuladores */}
        <nav aria-label={`Simuladores — ${area.titulo}`} style={S.grid}>
          {area.simuladores.length === 0 ? (
            <div style={S.empty}>
              🔧 Módulos desta área estão em desenvolvimento.<br />
              Novos simuladores serão adicionados em breve.
            </div>
          ) : (
            area.simuladores.map((sim) => (
              <div
                key={sim.rota}
                className="hub-sim-card"
                style={S.card(sim.corBg, sim.corBorda)}
              >
                <div style={S.cardIcon} aria-hidden="true">{sim.icone}</div>
                <p style={S.cardSub(sim.cor)}>{sim.subtitulo}</p>
                <h2 style={S.cardTitle}>{sim.titulo}</h2>
                <p style={S.cardDesc}>{sim.descricao}</p>
                <Link
                  to={sim.rota}
                  style={S.botao(sim.cor)}
                  aria-label={`Abrir simulador: ${sim.titulo}`}
                >
                  ▶ Abrir simulador
                </Link>
              </div>
            ))
          )}
        </nav>

        <footer style={S.footer}>
          <p>Plataforma de treinamento · Uso educacional</p>
        </footer>
      </main>
    </>
  );
}
