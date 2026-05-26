import { SESSION_ACCESS_TTL_MS } from '../model/constants';
import type { AuthSession, SignInCredentials } from '../model';
import { refreshSession } from './refresh-session';
import { clearStoredSession, saveStoredSession } from './session-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

function createSession(refreshToken: string): AuthSession {
  const now = Date.now();

  return {
    accessToken: `access_${now}`,
    refreshToken,
    expiresAt: now + SESSION_ACCESS_TTL_MS,
  };
}

async function requestSignIn(credentials: SignInCredentials): Promise<AuthSession> {
  if (!API_BASE_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return createSession(`refresh_${credentials.phoneNumber}_${Date.now()}`);
  }

  const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Failed to sign in');
  }

  const data = (await response.json()) as AuthSession;
  return data;
}

export async function signIn(credentials: SignInCredentials): Promise<AuthSession> {
  const session = await requestSignIn(credentials);
  await saveStoredSession(session);
  return session;
}

export async function signOut(): Promise<void> {
  await clearStoredSession();
}

export { refreshSession };
