import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

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
  subtitulo: { fontSize: 13.5, color: 'rgba(240,246,255,0.52)', margin: '0 0 26px', lineHeight: 1.5 },
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
  sucesso: {
    background: 'rgba(52,211,153,0.12)',
    border: '1px solid rgba(52,211,153,0.35)',
    color: '#34d399',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 13,
    lineHeight: 1.5,
  },
  rodape: { marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(240,246,255,0.52)' },
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700 },
};

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    try {
      await apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    } finally {
      setCarregando(false);
      setEnviado(true);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.titulo}>Esqueci minha senha</h1>
        <p style={S.subtitulo}>Informe seu email cadastrado e enviaremos um link pra redefinir a senha.</p>

        {enviado ? (
          <div style={S.sucesso}>
            Se esse email existir na plataforma, enviamos um link de redefinição. Confira sua caixa de
            entrada (e o spam).
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label style={S.label}>Email</label>
            <input
              style={S.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button style={S.botao} type="submit" disabled={carregando}>
              {carregando ? 'Enviando…' : 'Enviar link de redefinição'}
            </button>
          </form>
        )}

        <div style={S.rodape}>
          <Link to="/login" style={S.link}>
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
