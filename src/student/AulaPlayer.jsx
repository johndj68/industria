import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1525 55%,#0a1628 100%)',
    fontFamily: "'DM Sans',sans-serif",
    color: '#f0f6ff',
    padding: '56px 20px 80px',
  },
  container: { maxWidth: 900, margin: '0 auto' },
  voltar: { color: '#22d3ee', textDecoration: 'none', fontSize: 13, fontWeight: 700 },
  titulo: { fontSize: 22, fontWeight: 900, margin: '16px 0 20px' },
  player: {
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 16,
    overflow: 'hidden',
    background: '#000',
    marginBottom: 20,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  aviso: {
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 10,
    color: 'rgba(240,246,255,0.5)',
    fontSize: 13.5,
    marginBottom: 20,
    textAlign: 'center',
    padding: 24,
    boxSizing: 'border-box',
  },
  acoes: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  botao: {
    padding: '11px 22px',
    borderRadius: 10,
    border: 'none',
    background: '#22d3ee',
    color: '#0a0f1e',
    fontWeight: 800,
    fontSize: 13.5,
    cursor: 'pointer',
  },
  nav: { display: 'flex', gap: 10 },
  navBotao: {
    padding: '9px 16px',
    borderRadius: 9,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#f0f6ff',
    fontSize: 12.5,
    textDecoration: 'none',
    cursor: 'pointer',
  },
  toast: {
    background: 'rgba(52,211,153,0.12)',
    border: '1px solid rgba(52,211,153,0.35)',
    color: '#34d399',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    marginTop: 14,
  },
};

export default function AulaPlayer() {
  const { slug, lessonId } = useParams();
  const [curso, setCurso] = useState(null);
  const [playback, setPlayback] = useState(null);
  const [erroPlayback, setErroPlayback] = useState('');
  const [resultado, setResultado] = useState(null);
  const [concluindo, setConcluindo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/courses/${slug}`).then(setCurso);
  }, [slug]);

  useEffect(() => {
    setPlayback(null);
    setErroPlayback('');
    setResultado(null);
    apiFetch(`/lessons/${lessonId}/playback`)
      .then(setPlayback)
      .catch((err) => setErroPlayback(err.message));
  }, [lessonId]);

  const aulasFlat = useMemo(() => {
    if (!curso) return [];
    return curso.modulos.flatMap((m) => m.aulas);
  }, [curso]);

  const indiceAtual = aulasFlat.findIndex((a) => a.id === lessonId);
  const aulaAtual = aulasFlat[indiceAtual];
  const anterior = aulasFlat[indiceAtual - 1];
  const proxima = aulasFlat[indiceAtual + 1];

  async function marcarConcluida() {
    setConcluindo(true);
    try {
      const r = await apiFetch(`/lessons/${lessonId}/progress`, { method: 'POST', body: JSON.stringify({}) });
      setResultado(r);
      if (proxima) {
        setTimeout(() => navigate(`/app/curso/${slug}/aula/${proxima.id}`), 900);
      }
    } catch (err) {
      setErroPlayback(err.message);
    } finally {
      setConcluindo(false);
    }
  }

  if (!curso) return <div style={S.page}>Carregando…</div>;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <Link to={`/app/curso/${slug}`} style={S.voltar}>
          ← {curso.titulo}
        </Link>
        <h1 style={S.titulo}>{aulaAtual?.titulo ?? 'Aula'}</h1>

        {playback?.iframeUrl && (
          <div style={S.player}>
            <iframe
              src={playback.iframeUrl}
              title={aulaAtual?.titulo}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        )}

        {erroPlayback && (
          <div style={S.aviso}>
            <span style={{ fontSize: 28 }}>⚠️</span>
            <span>{erroPlayback}</span>
          </div>
        )}

        <div style={S.acoes}>
          <button style={S.botao} onClick={marcarConcluida} disabled={concluindo}>
            {concluindo ? 'Salvando…' : 'Marcar como concluída'}
          </button>
          <div style={S.nav}>
            {anterior && (
              <Link to={`/app/curso/${slug}/aula/${anterior.id}`} style={S.navBotao}>
                ← Anterior
              </Link>
            )}
            {proxima && (
              <Link to={`/app/curso/${slug}/aula/${proxima.id}`} style={S.navBotao}>
                Próxima →
              </Link>
            )}
          </div>
        </div>

        {resultado && (
          <div style={S.toast}>
            {resultado.jaEstavaConcluida
              ? 'Aula já concluída.'
              : `+${resultado.xpGanho} XP · nível ${resultado.nivel}`}
            {resultado.badgesConquistadas?.length > 0 &&
              ` · Nova conquista: ${resultado.badgesConquistadas.map((b) => b.icone + ' ' + b.nome).join(', ')}`}
          </div>
        )}
      </div>
    </div>
  );
}
