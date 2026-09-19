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
  container: { maxWidth: 1080, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 44 },
  titulo: { fontSize: 32, fontWeight: 900, margin: '0 0 10px' },
  subtitulo: { fontSize: 14.5, color: 'rgba(240,246,255,0.52)', margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 22,
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '26px 24px',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardTitulo: { fontSize: 17, fontWeight: 800, margin: 0 },
  cardDesc: { fontSize: 13, color: 'rgba(240,246,255,0.55)', margin: 0, lineHeight: 1.5 },
  preco: { fontSize: 20, fontWeight: 900, color: '#22d3ee', marginTop: 8 },
  vazio: { textAlign: 'center', color: 'rgba(240,246,255,0.5)', fontSize: 14, marginTop: 40 },
};

function formatarReais(centavos) {
  return `R$ ${(centavos / 100).toFixed(2)}`;
}

export default function Cursos() {
  const [cursos, setCursos] = useState(null);

  useEffect(() => {
    apiFetch('/courses').then(setCursos);
  }, []);

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <h1 style={S.titulo}>Cursos</h1>
          <p style={S.subtitulo}>Treinamentos práticos em análises industriais, direto da bancada virtual.</p>
        </div>

        {!cursos && <p style={S.vazio}>Carregando…</p>}
        {cursos && cursos.length === 0 && <p style={S.vazio}>Nenhum curso disponível no momento.</p>}

        <div style={S.grid}>
          {cursos?.map((curso) => (
            <Link key={curso.id} to={`/cursos/${curso.slug}`} style={S.card}>
              <h2 style={S.cardTitulo}>{curso.titulo}</h2>
              <p style={S.cardDesc}>{curso.descricao}</p>
              <span style={S.preco}>{formatarReais(curso.precoCentavos)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
