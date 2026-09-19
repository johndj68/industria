import { Link } from 'react-router-dom';
import { AREAS } from './data/simuladores';

/**
 * Home — Hub principal da plataforma.
 *
 * Exibe um card por grande área do laboratório virtual.
 * Clicando no card, o usuário acessa a listagem de simuladores
 * daquela área (AreaHub.jsx).
 *
 * Estilos 100% inline — sem dependência de Tailwind.
 */

const SCROLLBAR_CSS = `
  .home-page::-webkit-scrollbar { width: 5px; }
  .home-page::-webkit-scrollbar-track { background: rgba(10,15,30,0); }
  .home-page::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.22); border-radius: 4px; }
  .home-page::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.52); }
  .home-area-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .home-area-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.44); }
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
    padding: '48px 20px 60px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: 52,
    maxWidth: 620,
  },
  logoIcon: { fontSize: 58, lineHeight: 1, marginBottom: 18 },
  titulo: {
    fontSize: 32,
    fontWeight: 900,
    color: '#f0f6ff',
    margin: '0 0 10px',
    letterSpacing: '-0.5px',
  },
  subtitulo: {
    fontSize: 14.5,
    color: 'rgba(240,246,255,0.52)',
    margin: 0,
    lineHeight: 1.6,
  },
  divisor: {
    width: 52,
    height: 3,
    background: 'linear-gradient(90deg,rgba(34,211,238,0),#22d3ee,rgba(34,211,238,0))',
    borderRadius: 99,
    margin: '18px auto 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 22,
    width: '100%',
    maxWidth: 1140,
  },
  card: (corBg, corBorda) => ({
    background: corBg,
    border: `1px solid ${corBorda}`,
    borderRadius: 22,
    padding: '28px 26px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    textDecoration: 'none',
    color: 'inherit',
  }),
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: { fontSize: 40, lineHeight: 1 },
  cardBadge: (cor) => ({
    fontSize: 10,
    fontWeight: 700,
    color: cor,
    background: `${cor}18`,
    border: `1px solid ${cor}44`,
    padding: '3px 10px',
    borderRadius: 14,
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
  }),
  cardTitulo: {
    fontSize: 20,
    fontWeight: 900,
    color: '#f0f6ff',
    margin: '4px 0 0',
    lineHeight: 1.15,
  },
  cardDescricao: {
    fontSize: 13,
    color: 'rgba(240,246,255,0.58)',
    lineHeight: 1.58,
    margin: 0,
    flex: 1,
  },
  cardBotao: (cor) => ({
    marginTop: 6,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    borderRadius: 13,
    background: cor,
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 13,
    textDecoration: 'none',
    alignSelf: 'flex-start',
  }),
  footer: {
    marginTop: 56,
    fontSize: 11,
    color: 'rgba(240,246,255,0.22)',
    textAlign: 'center',
  },
};

function contarLabel(n) {
  if (n === 0) return 'Em desenvolvimento';
  return `${n} simulador${n > 1 ? 'es' : ''}`;
}

export default function Home() {
  return (
    <>
      <style>{SCROLLBAR_CSS}</style>
      <main style={S.page} className="home-page" role="main">

        {/* Cabeçalho */}
        <header style={S.header}>
          <div style={S.logoIcon}>🏭</div>
          <h1 style={S.titulo}>Simulador Industrial</h1>
          <p style={S.subtitulo}>
            Bancada virtual de laboratório para treinamento em análises industriais.<br />
            Selecione uma área para ver os simuladores disponíveis.
          </p>
          <div style={S.divisor} />
        </header>

        {/* Grid de áreas */}
        <nav aria-label="Áreas do laboratório" style={S.grid}>
          {AREAS.map((area) => (
            <Link
              key={area.key}
              to={area.rota}
              className="home-area-card"
              style={S.card(area.corBg, area.corBorda)}
              aria-label={`Acessar área: ${area.titulo}`}
            >
              <div style={S.cardTop}>
                <div style={S.cardIcon} aria-hidden="true">{area.icone}</div>
                <span style={S.cardBadge(area.cor)}>
                  {contarLabel(area.simuladores.length)}
                </span>
              </div>

              <h2 style={S.cardTitulo}>{area.titulo}</h2>
              <p style={S.cardDescricao}>{area.descricao}</p>

              <span style={S.cardBotao(area.cor)}>
                Acessar área →
              </span>
            </Link>
          ))}
        </nav>

        <footer style={S.footer}>
          <p>Plataforma de treinamento · Uso educacional</p>
        </footer>
      </main>
    </>
  );
}
