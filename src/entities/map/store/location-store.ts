import { create } from 'zustand';

import type { MapLocation } from '../model';

type LocationStoreState = {
  location: MapLocation | null;
  isLoading: boolean;
  error: string | null;
  setLocation: (location: MapLocation | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialState = {
  location: null as MapLocation | null,
  isLoading: true,
  error: null as string | null,
};

export const useLocationStore = create<LocationStoreState>((set) => ({
  ...initialState,

  setLocation: (location) => {
    set({ location });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set({ ...initialState, isLoading: false });
  },
}));
