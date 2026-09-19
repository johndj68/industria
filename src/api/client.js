const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function getTokens() {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}

function setTokens({ accessToken, refreshToken }) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function refreshAccessToken() {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error('Sem refresh token');

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error('Sessão expirada');
  }
  const tokens = await res.json();
  setTokens(tokens);
  return tokens.accessToken;
}

export async function apiFetch(path, options = {}) {
  const { accessToken } = getTokens();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && accessToken) {
    try {
      const novoToken = await refreshAccessToken();
      res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${novoToken}` },
      });
    } catch {
      window.dispatchEvent(new Event('auth:logout'));
    }
  }

  if (!res.ok) {
    const erro = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(erro.message || 'Erro na requisição');
  }
  if (res.status === 204) return null;
  return res.json();
}

export { getTokens, setTokens, clearTokens, API_URL };
