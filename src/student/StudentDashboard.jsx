import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    fontFamily: "'DM Sans',sans-serif",
    color: '#f0f6ff',
    padding: '56px 20px 80px',
  },
  container: { maxWidth: 880, margin: '0 auto' },
  titulo: { fontSize: 28, fontWeight: 900, margin: '0 0 28px' },
  gamificacao: {
    display: 'flex',
    gap: 14,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  statCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '16px 22px',
    flex: '1 1 140px',
  },
  statValor: { fontSize: 24, fontWeight: 900, margin: '0 0 2px', color: '#22d3ee' },
  statLabel: { fontSize: 12, color: 'rgba(240,246,255,0.55)', margin: 0 },
  badges: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge: {
    fontSize: 20,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '6px 10px',
  },
  subtitulo: { fontSize: 17, fontWeight: 800, margin: '0 0 16px' },
  card: {
    display: 'block',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '18px 22px',
    marginBottom: 12,
    textDecoration: 'none',
    color: 'inherit',
  },
  cardTitulo: { fontSize: 15, fontWeight: 800, margin: 0 },
  statusPill: (status) => ({
    fontSize: 11,
    fontWeight: 800,
    padding: '4px 10px',
    borderRadius: 99,
    display: 'inline-block',
    marginTop: 8,
    background: status === 'PAGO' ? 'rgba(52,211,153,0.15)' : 'rgba(240,246,255,0.08)',
    color: status === 'PAGO' ? '#34d399' : 'rgba(240,246,255,0.5)',
  }),
  vazio: { color: 'rgba(240,246,255,0.5)', fontSize: 13.5 },
};

const STATUS_LABEL = {
  PAGO: 'Acesso liberado',
  PENDENTE: 'Pagamento pendente',
  CANCELADO: 'Cancelado',
  REEMBOLSADO: 'Reembolsado',
};

export default function StudentDashboard() {
  const [matriculas, setMatriculas] = useState(null);
  const [gamificacao, setGamificacao] = useState(null);

  useEffect(() => {
    apiFetch('/me/enrollments').then(setMatriculas);
    apiFetch('/me/gamificacao').then(setGamificacao);
  }, []);

  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.titulo}>Meus cursos</h1>

        {gamificacao && (
          <div style={S.gamificacao}>
            <div style={S.statCard}>
              <p style={S.statValor}>{gamificacao.xp}</p>
              <p style={S.statLabel}>XP total</p>
            </div>
            <div style={S.statCard}>
              <p style={S.statValor}>Nível {gamificacao.nivel}</p>
              <p style={S.statLabel}>Progresso geral</p>
            </div>
            {gamificacao.badges.length > 0 && (
              <div style={{ ...S.statCard, flex: '2 1 240px' }}>
                <p style={S.statLabel}>Conquistas</p>
                <div style={S.badges}>
                  {gamificacao.badges.map((b) => (
                    <span key={b.nome} style={S.badge} title={b.nome}>
                      {b.icone}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!matriculas && <p style={S.vazio}>Carregando…</p>}
        {matriculas?.length === 0 && (
          <p style={S.vazio}>
            Você ainda não tem cursos. <Link to="/cursos" style={{ color: '#22d3ee' }}>Ver catálogo →</Link>
          </p>
        )}

        {matriculas?.map((m) => (
          <Link
            key={m.course.id}
            to={m.statusPagamento === 'PAGO' ? `/app/curso/${m.course.slug}` : `/cursos/${m.course.slug}`}
            style={S.card}
          >
            <h2 style={S.cardTitulo}>{m.course.titulo}</h2>
            <span style={S.statusPill(m.statusPagamento)}>{STATUS_LABEL[m.statusPagamento]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
