import { refreshSession } from '../api/refresh-session';
import { clearStoredSession, loadStoredSession, saveStoredSession } from '../api/session-storage';
import { isSessionValid, shouldRefreshSession } from './session';

export async function resolveSession() {
  const stored = await loadStoredSession();

  if (!stored) {
    return null;
  }

  if (isSessionValid(stored)) {
    if (shouldRefreshSession(stored)) {
      return refreshStoredSession(stored.refreshToken, stored);
    }

    return stored;
  }

  if (!stored.refreshToken) {
    await clearStoredSession();
    return null;
  }

  return refreshStoredSession(stored.refreshToken);
}

async function refreshStoredSession(refreshToken: string, fallbackSession?: Awaited<ReturnType<typeof loadStoredSession>>) {
  try {
    return await refreshSession(refreshToken);
  } catch {
    if (fallbackSession && isSessionValid(fallbackSession)) {
      return fallbackSession;
    }

    await clearStoredSession();
    return null;
  }
}

export async function persistSession(session: Awaited<ReturnType<typeof resolveSession>>) {
  if (!session) {
    await clearStoredSession();
    return;
  }

  await saveStoredSession(session);
}
