import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    fontFamily: "'DM Sans',sans-serif",
    color: '#f0f6ff',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 22,
    padding: '36px 30px',
  },
  titulo: { fontSize: 24, fontWeight: 900, margin: '0 0 6px' },
  subtitulo: { fontSize: 13.5, color: 'rgba(240,246,255,0.52)', margin: '0 0 26px' },
  label: { fontSize: 12.5, fontWeight: 700, color: 'rgba(240,246,255,0.7)', marginBottom: 6, display: 'block' },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.25)',
    color: '#f0f6ff',
    fontSize: 14,
    marginBottom: 18,
    outline: 'none',
  },
  botao: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    border: 'none',
    background: '#22d3ee',
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 14.5,
    cursor: 'pointer',
  },
  erro: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.35)',
    color: '#fca5a5',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    marginBottom: 18,
  },
  rodape: { marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(240,246,255,0.52)' },
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700 },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate(location.state?.from ?? '/');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.titulo}>Entrar</h1>
        <p style={S.subtitulo}>Acesse sua conta na plataforma.</p>

        {erro && <div style={S.erro}>{erro}</div>}

        <form onSubmit={onSubmit}>
          <label style={S.label}>Email</label>
          <input
            style={S.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={S.label}>Senha</label>
          <input
            style={S.input}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button style={S.botao} type="submit" disabled={carregando}>
            {carregando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div style={S.rodape}>
          Não tem conta?{' '}
          <Link to="/cadastro" style={S.link}>
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
