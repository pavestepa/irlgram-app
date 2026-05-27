import { create } from 'zustand';

import { syncUserLocationOnAuth } from '@/entities/map/api';
import { useLocationStore } from '@/entities/map/store/location-store';
import { resetEntityStores } from '@/shared/lib/reset-entity-stores';

import { signIn as signInRequest, signOut as signOutRequest } from '../api';
import { resolveSession } from '../model/session-service';
import { isSessionValid } from '../model/session';
import type { AuthSession, SignInCredentials } from '../model/types';

type SessionStoreState = {
  session: AuthSession | null;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSessionIfNeeded: () => Promise<AuthSession | null>;
  setSession: (session: AuthSession | null) => void;
};

let refreshInFlight: Promise<AuthSession | null> | null = null;

async function syncLocationOnAuth() {
  const location = await syncUserLocationOnAuth();

  if (location) {
    useLocationStore.getState().setLocation(location);
    useLocationStore.getState().setLoading(false);
  }
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  session: null,
  isLoading: true,

  setSession: (session) => {
    set({ session });
  },

  hydrate: async () => {
    const session = await resolveSession();
    set({ session, isLoading: false });

    if (session && isSessionValid(session)) {
      void syncLocationOnAuth();
    }
  },

  refreshSessionIfNeeded: async () => {
    if (refreshInFlight) {
      return refreshInFlight;
    }

    const task = (async () => {
      const currentSession = await resolveSession();
      set({ session: currentSession });
      return currentSession;
    })();

    refreshInFlight = task;

    try {
      return await task;
    } finally {
      refreshInFlight = null;
    }
  },

  signIn: async (credentials) => {
    const nextSession = await signInRequest(credentials);
    set({ session: nextSession });
    void syncLocationOnAuth();
  },

  signOut: async () => {
    await signOutRequest();
    set({ session: null });
    resetEntityStores();
  },
}));
