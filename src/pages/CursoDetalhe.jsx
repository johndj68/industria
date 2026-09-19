import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    fontFamily: "'DM Sans',sans-serif",
    color: '#f0f6ff',
    padding: '56px 20px 80px',
  },
  container: { maxWidth: 760, margin: '0 auto' },
  voltar: { color: '#22d3ee', textDecoration: 'none', fontSize: 13, fontWeight: 700 },
  titulo: { fontSize: 30, fontWeight: 900, margin: '16px 0 10px' },
  descricao: { fontSize: 15, color: 'rgba(240,246,255,0.65)', lineHeight: 1.6, margin: '0 0 28px' },
  painel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 26,
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  preco: { fontSize: 28, fontWeight: 900, color: '#22d3ee', margin: 0 },
  botao: {
    padding: '13px 28px',
    borderRadius: 12,
    border: 'none',
    background: '#22d3ee',
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 14.5,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  moduloTitulo: { fontSize: 16, fontWeight: 800, margin: '20px 0 10px' },
  aulaLinha: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 8,
    fontSize: 13.5,
  },
  erro: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.35)',
    color: '#fca5a5',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    marginBottom: 16,
  },
};

function formatarReais(centavos) {
  return `R$ ${(centavos / 100).toFixed(2)}`;
}

export default function CursoDetalhe() {
  const { slug } = useParams();
  const [curso, setCurso] = useState(null);
  const [matriculaPaga, setMatriculaPaga] = useState(false);
  const [erro, setErro] = useState('');
  const [comprando, setComprando] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/courses/${slug}`).then(setCurso);
  }, [slug]);

  useEffect(() => {
    if (!user || !curso) return;
    apiFetch('/me/enrollments').then((matriculas) => {
      const minha = matriculas.find((m) => m.course.slug === slug);
      setMatriculaPaga(minha?.statusPagamento === 'PAGO');
    });
  }, [user, curso, slug]);

  async function comprar() {
    if (!user) {
      navigate('/login', { state: { from: `/cursos/${slug}` } });
      return;
    }
    setErro('');
    setComprando(true);
    try {
      const { checkoutUrl } = await apiFetch('/payments/checkout', {
        method: 'POST',
        body: JSON.stringify({ courseId: curso.id }),
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      setErro(err.message);
      setComprando(false);
    }
  }

  if (!curso) return <div style={S.page}>Carregando…</div>;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <Link to="/cursos" style={S.voltar}>
          ← Todos os cursos
        </Link>
        <h1 style={S.titulo}>{curso.titulo}</h1>
        <p style={S.descricao}>{curso.descricao}</p>

        {erro && <div style={S.erro}>{erro}</div>}

        <div style={S.painel}>
          <p style={S.preco}>{formatarReais(curso.precoCentavos)}</p>
          {matriculaPaga ? (
            <Link to={`/app/curso/${curso.slug}`} style={S.botao}>
              Ir para o curso →
            </Link>
          ) : (
            <button style={S.botao} onClick={comprar} disabled={comprando}>
              {comprando ? 'Redirecionando…' : 'Comprar curso'}
            </button>
          )}
        </div>

        {curso.modulos.map((modulo) => (
          <div key={modulo.id}>
            <h3 style={S.moduloTitulo}>{modulo.titulo}</h3>
            {modulo.aulas.map((aula) => (
              <div key={aula.id} style={S.aulaLinha}>
                <span>🎬</span>
                <span>{aula.titulo}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
