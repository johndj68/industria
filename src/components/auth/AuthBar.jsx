import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const S = {
  bar: {
    position: 'fixed',
    top: 14,
    right: 16,
    zIndex: 999,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    fontFamily: "'DM Sans',sans-serif",
  },
  pill: {
    background: 'rgba(10,15,30,0.75)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 99,
    padding: '7px 14px',
    fontSize: 12.5,
    fontWeight: 700,
    color: '#f0f6ff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  destaque: { background: '#22d3ee', color: '#0a0f1e', border: 'none' },
};

export function AuthBar() {
  const { user, carregando, logout } = useAuth();

  if (carregando) return null;

  if (!user) {
    return (
      <div style={S.bar}>
        <Link to="/cursos" style={S.pill}>
          Cursos
        </Link>
        <Link to="/login" style={S.pill}>
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div style={S.bar}>
      <Link to="/cursos" style={S.pill}>
        Cursos
      </Link>
      {user.role === 'ADMIN' ? (
        <Link to="/admin" style={{ ...S.pill, ...S.destaque }}>
          Painel Admin
        </Link>
      ) : (
        <Link to="/app" style={{ ...S.pill, ...S.destaque }}>
          Meus cursos
        </Link>
      )}
      <span style={S.pill}>
        {user.nome} · Nv.{user.nivel}
      </span>
      <button style={S.pill} onClick={logout}>
        Sair
      </button>
    </div>
  );
}
