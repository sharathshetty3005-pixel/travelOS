import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider } from '@/providers/AppProvider';
import { appInitService } from '@/services/app/initializeApp';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

// Prevent the native splash screen from hiding automatically until custom initialization completes
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function startApp() {
      try {
        // Run all initialization checks in parallel (fonts, Zustand state hydration, image precaching)
        await appInitService.initialize();
      } catch (error) {
        // Error will be caught by our React Error Boundary if it bubbles up
      } finally {
        setIsReady(true);
        // Hide the native splash screen to hand off rendering to custom Splash
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    startApp();
  }, []);

  if (!isReady) {
    return null; // Keep native splash screen active
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="onboarding" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="auth" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </ErrorBoundary>
  );
}
