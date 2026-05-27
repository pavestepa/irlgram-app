import { create } from 'zustand';

import { getCurrentUser } from '../api';
import type { User } from '../model';

type CurrentUserStoreState = {
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isInitialized: boolean;
  loadUser: () => Promise<void>;
  refresh: () => Promise<void>;
  ensureLoaded: () => Promise<void>;
  setUser: (user: User) => void;
  reset: () => void;
};

const initialState = {
  user: null as User | null,
  isLoading: true,
  isRefreshing: false,
  error: null as string | null,
  isInitialized: false,
};

export const useCurrentUserStore = create<CurrentUserStoreState>((set, get) => ({
  ...initialState,

  loadUser: async () => {
    try {
      set({ error: null });
      const data = await getCurrentUser();
      set({ user: data });
    } catch {
      set({ error: 'Не удалось загрузить профиль' });
    }
  },

  refresh: async () => {
    set({ isRefreshing: true });
    await get().loadUser();
    set({ isRefreshing: false });
  },

  ensureLoaded: async () => {
    if (get().isInitialized) {
      return;
    }

    await get().loadUser();
    set({ isLoading: false, isInitialized: true });
  },

  setUser: (user) => {
    set({ user });
  },

  reset: () => {
    set({ ...initialState, isLoading: false, isInitialized: false });
  },
}));
