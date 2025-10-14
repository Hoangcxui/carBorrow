import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import NotificationService from '@/services/NotificationService';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      NotificationService.registerForPushNotificationsAsync()
        .then(() => {
          return NotificationService.sendPushTokenToServer();
        })
        .catch((error) => {
          console.log('Failed to setup notifications:', error);
        });
    }
  }, [isAuthenticated]);

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vehicle/[id]" options={{ title: 'Chi tiết xe', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="booking/create" options={{ title: 'Đặt xe', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="booking/[id]" options={{ title: 'Chi tiết booking', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="payment/[bookingId]" options={{ title: 'Thanh toán', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="favorites" options={{ title: 'Xe yêu thích', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="features" options={{ title: 'Tính năng ứng dụng', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
