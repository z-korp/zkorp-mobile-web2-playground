import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { initialize, initializing, clearMagicLinkState, session } = useAuthStore();
  const { confirmDialog, hideConfirmDialog, showToast } = useUIStore();
  const segments = useSegments();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      const parsed = Linking.parse(url);
      
      // Handle authentication callbacks (magic link and OAuth)
      if (parsed.hostname === 'auth' && parsed.path === '/callback') {
        const { queryParams } = parsed;
        
        if (queryParams?.access_token || queryParams?.refresh_token) {
          // Supabase will handle this automatically through the auth state change listener
          showToast('Successfully signed in!', 'success');
          clearMagicLinkState();
        } else if (queryParams?.error) {
          const errorMessage = queryParams.error_description || queryParams.error || 'Authentication failed';
          showToast('Authentication failed: ' + errorMessage, 'error');
          clearMagicLinkState();
        }
      }
    };

    // Handle initial URL (when app is closed and opened via link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL when app is already open
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, [showToast, clearMagicLinkState]);

  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync();
    }
  }, [initializing]);

  // Navigation guards based on authentication status
  useEffect(() => {
    if (initializing) return; // Don't navigate while initializing

    const inAuthGroup = segments[0] === '(auth)';

    if (!session) {
      // User is not authenticated, redirect to auth if not already there
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
    } else {
      // User is authenticated, redirect to main app if in auth group
      if (inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [session, initializing, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" />
      </Stack>
      <Toast />
      <ConfirmDialog
        visible={confirmDialog.visible}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        confirmColor={confirmDialog.confirmColor}
        icon={confirmDialog.icon as any}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          hideConfirmDialog();
        }}
        onCancel={() => {
          confirmDialog.onCancel?.();
          hideConfirmDialog();
        }}
      />
    </>
  );
}
