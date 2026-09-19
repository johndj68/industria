import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch, getTokens, setTokens, clearTokens } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuario = useCallback(async () => {
    const { accessToken } = getTokens();
    if (!accessToken) {
      setUser(null);
      setCarregando(false);
      return;
    }
    try {
      const me = await apiFetch('/auth/me');
      setUser(me);
    } catch (err) {
      if (err.status === 401) clearTokens();
      setUser(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
    const onLogout = () => {
      clearTokens();
      setUser(null);
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [carregarUsuario]);

  async function login(email, senha) {
    const tokens = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    setTokens(tokens);
    await carregarUsuario();
  }

  async function registrar(nome, email, senha) {
    const tokens = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    });
    setTokens(tokens);
    await carregarUsuario();
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, carregando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return ctx;
}
