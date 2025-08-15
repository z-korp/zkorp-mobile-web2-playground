import * as Linking from 'expo-linking';

// Configuration for deep linking
export const linkingConfig = {
  prefixes: [
    Linking.createURL('/'),
    'zkorpmobileweb2playground://',
    'https://auth.expo.io/@username/zkorp-web2-playground', // For Expo Go
  ],
  config: {
    screens: {
      '(tabs)': {
        screens: {
          index: '',
          about: 'about',
          notes: 'notes',
          profile: 'profile',
        },
      },
      '(auth)': {
        screens: {
          index: 'auth',
          'sign-in': 'auth/sign-in',
          'sign-up': 'auth/sign-up',
          'magic-link-sent': 'auth/magic-link-sent',
          'verify-otp': 'auth/verify-otp',
        },
      },
      callback: 'auth/callback',
    },
  },
};

// Helper function to create OAuth redirect URLs
export const createRedirectUrl = (path: string = 'auth/callback') => {
  return Linking.createURL(path, { scheme: 'zkorpmobileweb2playground' });
};

// Handle OAuth callback URLs
export const handleAuthCallback = (url: string): boolean => {
  const { hostname, path, queryParams } = Linking.parse(url);
  
  if (hostname === 'auth' && path === '/callback') {
    // Return true to indicate this was an auth callback
    return true;
  }
  
  return false;
};