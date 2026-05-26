import { Stack } from 'expo-router';

import { AnimatedSplashOverlay } from '@/shared/components/animated-icon';

export default function AppLayout() {
  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="chat/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
