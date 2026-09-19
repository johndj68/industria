import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  topo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  titulo: { fontSize: 26, fontWeight: 900, margin: 0 },
  sair: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#f0f6ff',
    borderRadius: 10,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 13,
  },
  painel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 24,
    marginBottom: 28,
  },
  subtitulo: { fontSize: 16, fontWeight: 800, margin: '0 0 16px' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  campoFull: { gridColumn: '1 / -1' },
  label: { fontSize: 12, fontWeight: 700, color: 'rgba(240,246,255,0.6)', marginBottom: 5, display: 'block' },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    borderRadius: 9,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.25)',
    color: '#f0f6ff',
    fontSize: 13.5,
    outline: 'none',
  },
  botao: {
    gridColumn: '1 / -1',
    padding: '11px 0',
    borderRadius: 10,
    border: 'none',
    background: '#22d3ee',
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 6,
  },
  erro: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.35)',
    color: '#fca5a5',
    borderRadius: 10,
    padding: '9px 14px',
    fontSize: 13,
    gridColumn: '1 / -1',
  },
  linha: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 10,
  },
  cursoTitulo: { fontWeight: 800, fontSize: 14.5, margin: 0 },
  cursoMeta: { fontSize: 12, color: 'rgba(240,246,255,0.5)', margin: '4px 0 0' },
  badge: (publicado) => ({
    fontSize: 11,
    fontWeight: 800,
    padding: '4px 10px',
    borderRadius: 99,
    background: publicado ? 'rgba(52,211,153,0.15)' : 'rgba(240,246,255,0.08)',
    color: publicado ? '#34d399' : 'rgba(240,246,255,0.5)',
    marginRight: 12,
  }),
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700, fontSize: 13 },
};

const vazio = { titulo: '', slug: '', descricao: '', precoCentavos: '' };

export default function AdminDashboard() {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  async function carregar() {
    const dados = await apiFetch('/admin/courses');
    setCursos(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await apiFetch('/admin/courses', {
        method: 'POST',
        body: JSON.stringify({ ...form, precoCentavos: Number(form.precoCentavos) }),
      });
      setForm(vazio);
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function alternarPublicado(curso) {
    await apiFetch(`/admin/courses/${curso.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ publicado: !curso.publicado }),
    });
    await carregar();
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.topo}>
          <h1 style={S.titulo}>Painel Admin — Cursos</h1>
        </div>
        <AdminNav />

        <div style={S.painel}>
          <h2 style={S.subtitulo}>Novo curso</h2>
          <form style={S.form} onSubmit={criar}>
            {erro && <div style={S.erro}>{erro}</div>}

            <div>
              <label style={S.label}>Título</label>
              <input
                style={S.input}
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={S.label}>Slug (URL)</label>
              <input
                style={S.input}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="ex: fermentacao-industrial"
                required
              />
            </div>
            <div style={S.campoFull}>
              <label style={S.label}>Descrição</label>
              <input
                style={S.input}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={S.label}>Preço (centavos)</label>
              <input
                style={S.input}
                type="number"
                min="0"
                value={form.precoCentavos}
                onChange={(e) => setForm({ ...form, precoCentavos: e.target.value })}
                placeholder="ex: 19900 = R$199,00"
                required
              />
            </div>

            <button style={S.botao} type="submit" disabled={carregando}>
              {carregando ? 'Criando…' : 'Criar curso'}
            </button>
          </form>
        </div>

        <div style={S.painel}>
          <h2 style={S.subtitulo}>Cursos ({cursos.length})</h2>
          {cursos.map((curso) => (
            <div key={curso.id} style={S.linha}>
              <div>
                <p style={S.cursoTitulo}>{curso.titulo}</p>
                <p style={S.cursoMeta}>
                  /{curso.slug} · R$ {(curso.precoCentavos / 100).toFixed(2)}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={S.badge(curso.publicado)}>{curso.publicado ? 'Publicado' : 'Rascunho'}</span>
                <button
                  style={{ ...S.sair, marginRight: 12 }}
                  onClick={() => alternarPublicado(curso)}
                >
                  {curso.publicado ? 'Despublicar' : 'Publicar'}
                </button>
                <Link to={`/admin/cursos/${curso.id}`} style={S.link}>
                  Gerenciar →
                </Link>
              </div>
            </div>
          ))}
          {cursos.length === 0 && (
            <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 13.5 }}>Nenhum curso criado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
