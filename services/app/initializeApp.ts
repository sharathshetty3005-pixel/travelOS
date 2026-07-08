import * as Font from 'expo-font';
import { Image } from 'expo-image';
import { useAppStore } from '@/store/appStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { IMAGES } from '@/constants/imageRegistry';

// Wait reactively for Zustand store hydration from disk storage
function waitForHydration(store: any): Promise<void> {
  return new Promise((resolve) => {
    if (store.getState()._hasHydrated) {
      resolve();
    } else {
      const unsubscribe = store.subscribe((state: any) => {
        if (state._hasHydrated) {
          unsubscribe();
          resolve();
        }
      });
    }
  });
}

export const appInitService = {
  async initialize(): Promise<void> {
    try {
      // 1. Run store hydration checks and font loading in parallel to optimize boot speed
      await Promise.all([
        // Load custom typographic assets
        Font.loadAsync({
          SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
        }),
        // Await rehydration of state stores from local storage
        waitForHydration(useAppStore),
        waitForHydration(useThemeStore),
        waitForHydration(useAuthStore),
      ]);

      // 2. Warm caches: Pre-fetch high-priority onboarding layout backgrounds in the background
      const onboardingBgUrls = [
        IMAGES.onboarding.discover,
        IMAGES.onboarding.companion,
        IMAGES.onboarding.preserve,
      ];
      
      // Fire prefetch requests concurrently without blocking the main render thread
      onboardingBgUrls.forEach((url) => {
        Image.prefetch(url).catch(() => {
          // Fail silently to avoid interrupting boot execution if cache prefetch fails
        });
      });

    } catch (error) {
      // Throw formatted error to be caught by global boundary handlers
      throw new Error(`App initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};
