import { useEffect, type PropsWithChildren } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { SESSION_CHECK_INTERVAL_MS } from '../model/constants';
import { isSessionValid, shouldRefreshSession } from '../model/session';
import { useSessionStore } from '../store/session-store';

export function useSession() {
  return useSessionStore(
    useShallow((state) => ({
      session: state.session,
      isLoading: state.isLoading,
      isAuthenticated: isSessionValid(state.session),
      signIn: state.signIn,
      signOut: state.signOut,
      refreshSessionIfNeeded: state.refreshSessionIfNeeded,
    })),
  );
}

export function SessionProvider({ children }: PropsWithChildren) {
  const hydrate = useSessionStore((state) => state.hydrate);
  const refreshSessionIfNeeded = useSessionStore((state) => state.refreshSessionIfNeeded);
  const session = useSessionStore((state) => state.session);
  const isLoading = useSessionStore((state) => state.isLoading);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

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

  return children;
}
