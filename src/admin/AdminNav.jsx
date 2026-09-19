import { NavLink } from 'react-router-dom';

const S = {
  nav: { display: 'flex', gap: 8, marginBottom: 24 },
  link: (ativo) => ({
    padding: '8px 16px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
    color: ativo ? '#0a0f1e' : '#f0f6ff',
    background: ativo ? '#22d3ee' : 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  }),
};

export function AdminNav() {
  return (
    <div style={S.nav}>
      <NavLink to="/admin" end style={({ isActive }) => S.link(isActive)}>
        Cursos
      </NavLink>
      <NavLink to="/admin/usuarios" style={({ isActive }) => S.link(isActive)}>
        Usuários
      </NavLink>
      <NavLink to="/admin/vendas" style={({ isActive }) => S.link(isActive)}>
        Vendas
      </NavLink>
    </div>
  );
}
