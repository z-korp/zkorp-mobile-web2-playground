import { create } from 'zustand';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as LocalAuthentication from 'expo-local-authentication';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  biometricAvailable: boolean;
  biometricEnabled: boolean;
  magicLinkLoading: boolean;
  magicLinkSent: boolean;
  lastMagicLinkEmail: string | null;
  otpVerificationLoading: boolean;
  googleLoading: boolean;
  appleLoading: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: { display_name?: string }) => Promise<{ error: AuthError | null }>;
  checkBiometric: () => Promise<void>;
  enableBiometric: () => Promise<boolean>;
  authenticateWithBiometric: () => Promise<boolean>;
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: AuthError | null }>;
  resendMagicLink: (email: string) => Promise<{ error: AuthError | null }>;
  clearMagicLinkState: () => void;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithApple: () => Promise<{ error: AuthError | null }>;
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  session: null,
  user: null,
  loading: false,
  initializing: true,
  error: null,
  biometricAvailable: false,
  biometricEnabled: false,
  magicLinkLoading: false,
  magicLinkSent: false,
  lastMagicLinkEmail: null,
  otpVerificationLoading: false,
  googleLoading: false,
  appleLoading: false,

  // Actions
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, loading: false });
        return { error };
      }

      set({ 
        session: data.session, 
        user: data.user, 
        loading: false,
        error: null 
      });
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, loading: false });
      return { error: { message } as AuthError };
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, loading: false });
        return { error };
      }

      set({ 
        session: data.session, 
        user: data.user, 
        loading: false,
        error: null 
      });
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, loading: false });
      return { error: { message } as AuthError };
    }
  },

  signOut: async () => {
    set({ loading: true });
    
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        set({ error: error.message, loading: false });
        return;
      }

      // Clear all auth state
      set({ 
        session: null, 
        user: null, 
        loading: false,
        error: null,
        biometricEnabled: false
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error('signOut catch error:', error);
      set({ error: message, loading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        set({ error: error.message, loading: false });
        return { error };
      }

      set({ loading: false });
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, loading: false });
      return { error: { message } as AuthError };
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        set({ error: error.message, loading: false });
        return { error };
      }

      set({ 
        user: data.user, 
        loading: false,
        error: null 
      });
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, loading: false });
      return { error: { message } as AuthError };
    }
  },

  checkBiometric: async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      set({ biometricAvailable: compatible && enrolled });
    } catch (error) {
      console.log('Biometric check failed:', error);
      set({ biometricAvailable: false });
    }
  },

  enableBiometric: async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Use password',
      });
      
      if (result.success) {
        set({ biometricEnabled: true });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Biometric enable failed:', error);
      return false;
    }
  },

  authenticateWithBiometric: async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use password',
      });
      
      return result.success;
    } catch (error) {
      console.log('Biometric auth failed:', error);
      return false;
    }
  },

  initialize: async () => {
    try {
      set({ initializing: true });
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        set({ 
          session, 
          user: session.user,
          initializing: false 
        });
      } else {
        set({ initializing: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          session, 
          user: session?.user ?? null,
          initializing: false 
        });
      });

      // Check biometric availability
      await get().checkBiometric();
      
    } catch (error) {
      console.error('Auth initialization failed:', error);
      set({ initializing: false });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  signInWithMagicLink: async (email: string) => {
    set({ magicLinkLoading: true, error: null });
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'zkorpmobileweb2playground://auth/callback',
        },
      });

      if (error) {
        set({ error: error.message, magicLinkLoading: false });
        return { error };
      }

      set({ 
        magicLinkLoading: false,
        magicLinkSent: true,
        lastMagicLinkEmail: email,
        error: null 
      });
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, magicLinkLoading: false });
      return { error: { message } as AuthError };
    }
  },

  verifyOtp: async (email: string, token: string) => {
    set({ otpVerificationLoading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        set({ error: error.message, otpVerificationLoading: false });
        return { error };
      }

      set({ 
        session: data.session, 
        user: data.user, 
        otpVerificationLoading: false,
        magicLinkSent: false,
        lastMagicLinkEmail: null,
        error: null 
      });
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, otpVerificationLoading: false });
      return { error: { message } as AuthError };
    }
  },

  resendMagicLink: async (email: string) => {
    return get().signInWithMagicLink(email);
  },

  clearMagicLinkState: () => {
    set({ 
      magicLinkSent: false,
      lastMagicLinkEmail: null,
      error: null 
    });
  },

  signInWithGoogle: async () => {
    set({ googleLoading: true, error: null });
    
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'zkorpmobileweb2playground',
        path: 'auth/callback',
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        set({ error: error.message, googleLoading: false });
        return { error };
      }

      // OAuth success will be handled by the auth state change listener
      set({ googleLoading: false, error: null });
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred with Google sign-in';
      set({ error: message, googleLoading: false });
      return { error: { message } as AuthError };
    }
  },

  signInWithApple: async () => {
    if (Platform.OS !== 'ios') {
      const message = 'Apple sign-in is only available on iOS';
      set({ error: message });
      return { error: { message } as AuthError };
    }

    // Check if running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) {
      const message = 'Apple Sign-In requires a development build. It does not work in Expo Go. Please create a development build using EAS Build.';
      set({ error: message });
      return { error: { message } as AuthError };
    }

    set({ appleLoading: true, error: null });
    
    try {
      // Check if Apple Authentication is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        const message = 'Apple sign-in is not available. Make sure you are using a development build and Sign in with Apple is configured.';
        set({ error: message, appleLoading: false });
        return { error: { message } as AuthError };
      }

      // Generate a random nonce for security
      const nonce = Math.random().toString(36).substring(2, 15);
      
      // Hash the nonce for Apple Authentication (using HEX encoding)
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce,
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      // Request Apple authentication with hashed nonce
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      // Sign in with Supabase using the Apple ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
        nonce,
      });

      if (error) {
        set({ error: error.message, appleLoading: false });
        return { error };
      }

      set({ 
        session: data.session, 
        user: data.user, 
        appleLoading: false,
        error: null 
      });
      
      return { error: null };
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // User canceled the sign-in flow
        set({ appleLoading: false });
        return { error: null };
      }
      
      // Provide more specific error messages
      let message = 'An error occurred with Apple sign-in';
      
      if (error.code === 'ERR_REQUEST_UNKNOWN') {
        message = 'Apple Sign-In failed. Please ensure: 1) You are using a development build (not Expo Go), 2) Apple Sign-In is configured in Supabase, 3) Your Apple Developer account is properly set up.';
      } else if (error.code === 'ERR_REQUEST_FAILED') {
        message = 'Apple Sign-In request failed. Check your internet connection and try again.';
      } else if (error.code === 'ERR_REQUEST_NOT_FOUND') {
        message = 'Apple Sign-In service not found. Make sure Sign in with Apple is enabled for your app.';
      } else if (error.code === 'ERR_REQUEST_NOT_HANDLED') {
        message = 'Apple Sign-In not properly configured. Check your app configuration.';
      } else if (error.code === 'ERR_REQUEST_INVALID_RESPONSE') {
        message = 'Invalid response from Apple. Please try again.';
      } else if (error.message) {
        message = error.message;
      }
      
      console.error('Apple Sign-In Error:', { code: error.code, message: error.message, error });
      set({ error: message, appleLoading: false });
      return { error: { message } as AuthError };
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));