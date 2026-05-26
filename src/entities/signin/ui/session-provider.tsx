import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { syncUserLocationOnAuth } from '@/entities/map/api';

import { signIn as signInRequest, signOut as signOutRequest } from '../api';
import { SESSION_CHECK_INTERVAL_MS } from '../model/constants';
import { resolveSession } from '../model/session-service';
import { isSessionValid, shouldRefreshSession } from '../model/session';
import type { AuthSession, SignInCredentials } from '../model/types';

type SessionContextValue = {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSessionIfNeeded: () => Promise<AuthSession | null>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const value = use(SessionContext);

  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshInFlightRef = useRef<Promise<AuthSession | null> | null>(null);

  const refreshSessionIfNeeded = useCallback(async () => {
    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current;
    }

    const task = (async () => {
      const currentSession = await resolveSession();
      setSession(currentSession);
      return currentSession;
    })();

    refreshInFlightRef.current = task;

    try {
      return await task;
    } finally {
      refreshInFlightRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const initialSession = await resolveSession();

      if (isMounted) {
        setSession(initialSession);
        setIsLoading(false);
      }

      if (initialSession && isSessionValid(initialSession)) {
        void syncUserLocationOnAuth();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!session || isLoading) {
      return;
    }

    const intervalId = setInterval(() => {
      if (!session || !shouldRefreshSession(session)) {
        return;
      }

      void refreshSessionIfNeeded();
    }, SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isLoading, refreshSessionIfNeeded, session]);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        void refreshSessionIfNeeded();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, [refreshSessionIfNeeded]);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const nextSession = await signInRequest(credentials);
    setSession(nextSession);
    void syncUserLocationOnAuth();
  }, []);

  const signOut = useCallback(async () => {
    await signOutRequest();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      isAuthenticated: isSessionValid(session),
      signIn,
      signOut,
      refreshSessionIfNeeded,
    }),
    [isLoading, refreshSessionIfNeeded, session, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
