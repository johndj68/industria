import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

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
  titulo: { fontSize: 26, fontWeight: 900, margin: '16px 0 28px' },
  moduloTitulo: { fontSize: 15.5, fontWeight: 800, margin: '0 0 10px' },
  aulaLinha: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 8,
    fontSize: 13.5,
    textDecoration: 'none',
    color: 'inherit',
  },
  check: (feita) => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    flexShrink: 0,
    background: feita ? '#34d399' : 'rgba(255,255,255,0.08)',
    color: feita ? '#0a0f1e' : 'rgba(240,246,255,0.4)',
  }),
};

export default function CursoAluno() {
  const { slug } = useParams();
  const [curso, setCurso] = useState(null);
  const [progresso, setProgresso] = useState([]);

  useEffect(() => {
    apiFetch(`/courses/${slug}`).then(async (c) => {
      setCurso(c);
      const p = await apiFetch(`/courses/${c.id}/progress`);
      setProgresso(p);
    });
  }, [slug]);

  if (!curso) return <div style={S.page}>Carregando…</div>;

  const concluidaMap = Object.fromEntries(progresso.map((p) => [p.lessonId, p.concluida]));

  return (
    <div style={S.page}>
      <div style={S.container}>
        <Link to="/app" style={S.voltar}>
          ← Meus cursos
        </Link>
        <h1 style={S.titulo}>{curso.titulo}</h1>

        {curso.modulos.map((modulo) => (
          <div key={modulo.id}>
            <h3 style={S.moduloTitulo}>{modulo.titulo}</h3>
            {modulo.aulas.map((aula) => (
              <Link key={aula.id} to={`/app/curso/${slug}/aula/${aula.id}`} style={S.aulaLinha}>
                <span style={S.check(concluidaMap[aula.id])}>
                  {concluidaMap[aula.id] ? '✓' : ''}
                </span>
                <span>{aula.titulo}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
