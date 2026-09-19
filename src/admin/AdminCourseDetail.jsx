import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    fontFamily: "'DM Sans',sans-serif",
    color: '#f0f6ff',
    padding: '40px 24px 80px',
  },
  container: { maxWidth: 880, margin: '0 auto' },
  voltar: { color: '#22d3ee', textDecoration: 'none', fontSize: 13, fontWeight: 700 },
  titulo: { fontSize: 24, fontWeight: 900, margin: '14px 0 4px' },
  meta: { fontSize: 13, color: 'rgba(240,246,255,0.5)', margin: '0 0 28px' },
  painel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
  },
  moduloTitulo: { fontSize: 15.5, fontWeight: 800, margin: '0 0 12px', display: 'flex', gap: 8, alignItems: 'center' },
  aulaLinha: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 8,
    fontSize: 13,
  },
  form: { display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  input: {
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.25)',
    color: '#f0f6ff',
    fontSize: 13,
    outline: 'none',
  },
  botao: {
    padding: '9px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#22d3ee',
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 13,
    cursor: 'pointer',
  },
  subtitulo: { fontSize: 16, fontWeight: 800, margin: '0 0 16px' },
};

export default function AdminCourseDetail() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [novoModulo, setNovoModulo] = useState({ titulo: '', ordem: '' });
  const [novaAula, setNovaAula] = useState({});

  async function carregar() {
    const dados = await apiFetch(`/admin/courses/${id}`);
    setCurso(dados);
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function criarModulo(e) {
    e.preventDefault();
    await apiFetch(`/admin/courses/${id}/modules`, {
      method: 'POST',
      body: JSON.stringify({ titulo: novoModulo.titulo, ordem: Number(novoModulo.ordem) }),
    });
    setNovoModulo({ titulo: '', ordem: '' });
    await carregar();
  }

  async function criarAula(e, moduleId) {
    e.preventDefault();
    const dados = novaAula[moduleId] ?? {};
    await apiFetch(`/admin/modules/${moduleId}/lessons`, {
      method: 'POST',
      body: JSON.stringify({
        titulo: dados.titulo,
        ordem: Number(dados.ordem ?? 1),
        duracaoSeg: Number(dados.duracaoSeg ?? 0),
        cfVideoId: dados.cfVideoId || undefined,
      }),
    });
    setNovaAula({ ...novaAula, [moduleId]: { titulo: '', ordem: '', duracaoSeg: '', cfVideoId: '' } });
    await carregar();
  }

  function atualizarCampoAula(moduleId, campo, valor) {
    setNovaAula({ ...novaAula, [moduleId]: { ...novaAula[moduleId], [campo]: valor } });
  }

  if (!curso) return <div style={S.page}>Carregando…</div>;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <Link to="/admin" style={S.voltar}>
          ← Voltar aos cursos
        </Link>
        <h1 style={S.titulo}>{curso.titulo}</h1>
        <p style={S.meta}>
          /{curso.slug} · {curso.publicado ? 'Publicado' : 'Rascunho'}
        </p>

        <div style={S.painel}>
          <h2 style={S.subtitulo}>Novo módulo</h2>
          <form style={S.form} onSubmit={criarModulo}>
            <input
              style={{ ...S.input, flex: 2 }}
              placeholder="Título do módulo"
              value={novoModulo.titulo}
              onChange={(e) => setNovoModulo({ ...novoModulo, titulo: e.target.value })}
              required
            />
            <input
              style={{ ...S.input, width: 90 }}
              type="number"
              placeholder="Ordem"
              value={novoModulo.ordem}
              onChange={(e) => setNovoModulo({ ...novoModulo, ordem: e.target.value })}
              required
            />
            <button style={S.botao} type="submit">
              Adicionar módulo
            </button>
          </form>
        </div>

        {curso.modulos.map((modulo) => (
          <div key={modulo.id} style={S.painel}>
            <h3 style={S.moduloTitulo}>
              📦 {modulo.ordem}. {modulo.titulo}
            </h3>

            {modulo.aulas.map((aula) => (
              <div key={aula.id} style={S.aulaLinha}>
                <span>
                  {aula.ordem}. {aula.titulo}
                </span>
                <span style={{ color: 'rgba(240,246,255,0.5)' }}>
                  {aula.cfVideoId ? '🎥 vídeo ok' : '⚠️ sem vídeo'} · {aula.duracaoSeg}s
                </span>
              </div>
            ))}

            <form style={S.form} onSubmit={(e) => criarAula(e, modulo.id)}>
              <input
                style={{ ...S.input, flex: 2 }}
                placeholder="Título da aula"
                value={novaAula[modulo.id]?.titulo ?? ''}
                onChange={(e) => atualizarCampoAula(modulo.id, 'titulo', e.target.value)}
                required
              />
              <input
                style={{ ...S.input, width: 70 }}
                type="number"
                placeholder="Ordem"
                value={novaAula[modulo.id]?.ordem ?? ''}
                onChange={(e) => atualizarCampoAula(modulo.id, 'ordem', e.target.value)}
                required
              />
              <input
                style={{ ...S.input, width: 100 }}
                type="number"
                placeholder="Duração (s)"
                value={novaAula[modulo.id]?.duracaoSeg ?? ''}
                onChange={(e) => atualizarCampoAula(modulo.id, 'duracaoSeg', e.target.value)}
              />
              <input
                style={{ ...S.input, flex: 2 }}
                placeholder="Cloudflare video UID (após upload)"
                value={novaAula[modulo.id]?.cfVideoId ?? ''}
                onChange={(e) => atualizarCampoAula(modulo.id, 'cfVideoId', e.target.value)}
              />
              <button style={S.botao} type="submit">
                Adicionar aula
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
