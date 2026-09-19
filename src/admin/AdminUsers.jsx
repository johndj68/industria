import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
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
  busca: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.25)',
    color: '#f0f6ff',
    fontSize: 13.5,
    marginBottom: 20,
    outline: 'none',
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
  nome: { fontWeight: 800, fontSize: 14, margin: 0 },
  meta: { fontSize: 12, color: 'rgba(240,246,255,0.5)', margin: '4px 0 0' },
  badge: (role) => ({
    fontSize: 11,
    fontWeight: 800,
    padding: '4px 10px',
    borderRadius: 99,
    background: role === 'ADMIN' ? 'rgba(34,211,238,0.15)' : 'rgba(240,246,255,0.08)',
    color: role === 'ADMIN' ? '#22d3ee' : 'rgba(240,246,255,0.5)',
    marginRight: 12,
  }),
  botao: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#f0f6ff',
    borderRadius: 8,
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: 12,
  },
  erro: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.35)',
    color: '#fca5a5',
    borderRadius: 10,
    padding: '9px 14px',
    fontSize: 13,
    marginBottom: 16,
  },
};

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const { user: usuarioLogado } = useAuth();

  async function carregar(termo) {
    const qs = termo ? `?busca=${encodeURIComponent(termo)}` : '';
    const dados = await apiFetch(`/admin/users${qs}`);
    setUsuarios(dados);
  }

  useEffect(() => {
    carregar('');
  }, []);

  useEffect(() => {
    const t = setTimeout(() => carregar(busca), 350);
    return () => clearTimeout(t);
  }, [busca]);

  async function alternarRole(u) {
    setErro('');
    const novoRole = u.role === 'ADMIN' ? 'ALUNO' : 'ADMIN';
    try {
      await apiFetch(`/admin/users/${u.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: novoRole }),
      });
      await carregar(busca);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.titulo}>Painel Admin — Usuários</h1>
        <AdminNav />

        {erro && <div style={S.erro}>{erro}</div>}

        <input
          style={S.busca}
          placeholder="Buscar por nome ou email…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {usuarios.map((u) => (
          <div key={u.id} style={S.linha}>
            <div>
              <p style={S.nome}>{u.nome}</p>
              <p style={S.meta}>
                {u.email} · Nv.{u.nivel} · {u.xp} XP
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={S.badge(u.role)}>{u.role}</span>
              <button
                style={S.botao}
                onClick={() => alternarRole(u)}
                disabled={u.id === usuarioLogado?.id}
                title={u.id === usuarioLogado?.id ? 'Você não pode alterar seu próprio acesso' : ''}
              >
                {u.role === 'ADMIN' ? 'Rebaixar a aluno' : 'Promover a admin'}
              </button>
            </div>
          </div>
        ))}
        {usuarios.length === 0 && (
          <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 13.5 }}>Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
