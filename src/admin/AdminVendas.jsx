import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { AdminNav } from './AdminNav';

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    fontFamily: "'DM Sans',sans-serif",
    color: '#f0f6ff',
    padding: '40px 24px 80px',
  },
  container: { maxWidth: 960, margin: '0 auto' },
  titulo: { fontSize: 26, fontWeight: 900, margin: '0 0 20px' },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
    marginBottom: 28,
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '18px 20px',
  },
  cardValor: { fontSize: 26, fontWeight: 900, margin: '0 0 4px', color: '#22d3ee' },
  cardLabel: { fontSize: 12.5, color: 'rgba(240,246,255,0.55)', margin: 0 },
  painel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
  },
  subtitulo: { fontSize: 16, fontWeight: 800, margin: '0 0 16px' },
  linha: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: 13,
  },
  vazio: { color: 'rgba(240,246,255,0.5)', fontSize: 13.5 },
};

function formatarReais(centavos) {
  return `R$ ${(centavos / 100).toFixed(2)}`;
}

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR');
}

export default function AdminVendas() {
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    apiFetch('/admin/dashboard').then(setResumo);
  }, []);

  if (!resumo) return <div style={S.page}>Carregando…</div>;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.titulo}>Painel Admin — Vendas</h1>
        <AdminNav />

        <div style={S.cards}>
          <div style={S.card}>
            <p style={S.cardValor}>{formatarReais(resumo.receitaTotalCentavos)}</p>
            <p style={S.cardLabel}>Receita total</p>
          </div>
          <div style={S.card}>
            <p style={S.cardValor}>{resumo.totalMatriculasPagas}</p>
            <p style={S.cardLabel}>Matrículas pagas</p>
          </div>
          <div style={S.card}>
            <p style={S.cardValor}>{resumo.totalUsuarios}</p>
            <p style={S.cardLabel}>Usuários cadastrados</p>
          </div>
          <div style={S.card}>
            <p style={S.cardValor}>{resumo.totalCursos}</p>
            <p style={S.cardLabel}>Cursos criados</p>
          </div>
        </div>

        <div style={S.painel}>
          <h2 style={S.subtitulo}>Receita por curso</h2>
          {resumo.receitaPorCurso.map((c) => (
            <div key={c.cursoId} style={S.linha}>
              <span>{c.cursoTitulo}</span>
              <span>
                {c.totalVendas} venda{c.totalVendas !== 1 ? 's' : ''} · {formatarReais(c.receitaCentavos)}
              </span>
            </div>
          ))}
          {resumo.receitaPorCurso.length === 0 && <p style={S.vazio}>Nenhuma venda registrada ainda.</p>}
        </div>

        <div style={S.painel}>
          <h2 style={S.subtitulo}>Vendas recentes</h2>
          {resumo.vendasRecentes.map((v) => (
            <div key={v.id} style={S.linha}>
              <span>
                {v.userNome} · {v.cursoTitulo}
              </span>
              <span>
                {formatarReais(v.valorPagoCentavos)} · {formatarData(v.dataPagamento)}
              </span>
            </div>
          ))}
          {resumo.vendasRecentes.length === 0 && <p style={S.vazio}>Nenhuma venda registrada ainda.</p>}
        </div>
      </div>
    </div>
  );
}
