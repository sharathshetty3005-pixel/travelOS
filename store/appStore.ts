import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  isOnboardingCompleted: boolean;
  isInitialized: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setInitialized: (val: boolean) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnboardingCompleted: false,
      isInitialized: false,
      completeOnboarding: () => set({ isOnboardingCompleted: true }),
      resetOnboarding: () => set({ isOnboardingCompleted: false }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'travelos-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
