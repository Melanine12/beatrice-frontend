import api from './api';
import { getMemoryAccessToken, setMemoryAccessToken } from './authTokenMemory';

/**
 * Le cookie HttpOnly same-origin (/api via Netlify) suffit au REST,
 * mais Socket.IO parle en cross-origin à Render → le cookie n’est pas envoyé.
 * Il faut un Bearer en mémoire pour authentifier le handshake.
 */
export async function ensureSocketAuthToken() {
  const existing = getMemoryAccessToken();
  if (existing) return existing;

  try {
    const { data } = await api.post('/auth/refresh');
    const token = data?.token;
    if (token) {
      setMemoryAccessToken(token);
      return token;
    }
  } catch (err) {
    console.warn(
      '[socketAuth] refresh token failed:',
      err?.response?.status || err?.message || err
    );
  }
  return null;
}
