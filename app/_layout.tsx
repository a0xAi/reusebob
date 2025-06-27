import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SessionProvider, useSession } from '../ctx';
import { SplashScreenController } from '../splash';

SplashScreen.preventAutoHideAsync();

export default function Root() {

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

// Separate this into a new component so it can access the SessionProvider context later
function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Protected guard={session}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="listing" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
    </Stack >
  );
}