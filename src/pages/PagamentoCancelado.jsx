import { Link } from 'react-router-dom';

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    color: '#f0f6ff',
    fontFamily: "'DM Sans',sans-serif",
    textAlign: 'center',
    padding: 24,
  },
  icone: { fontSize: 56 },
  titulo: { fontSize: 26, fontWeight: 900, margin: 0 },
  texto: { color: 'rgba(240,246,255,0.55)', margin: 0 },
  botao: {
    marginTop: 8,
    padding: '12px 28px',
    borderRadius: 12,
    background: '#22d3ee',
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 14,
    textDecoration: 'none',
  },
};

export default function PagamentoCancelado() {
  return (
    <div style={S.page}>
      <div style={S.icone}>✕</div>
      <h1 style={S.titulo}>Pagamento cancelado</h1>
      <p style={S.texto}>Nenhuma cobrança foi feita. Você pode tentar novamente quando quiser.</p>
      <Link to="/cursos" style={S.botao}>
        Voltar aos cursos
      </Link>
    </div>
  );
}
