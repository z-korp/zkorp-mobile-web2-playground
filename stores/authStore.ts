import { create } from 'zustand';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as LocalAuthentication from 'expo-local-authentication';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  biometricAvailable: boolean;
  biometricEnabled: boolean;
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
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  // Helper functions for testing/stories
  setSession: (session: Session | null) => void;
  setInitializing: (initializing: boolean) => void;
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
    console.log('signOut function called');
    set({ loading: true });
    
    try {
      console.log('Calling supabase.auth.signOut()...');
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        set({ error: error.message, loading: false });
        return;
      }

      console.log('Supabase signOut successful, clearing state...');
      // Clear all auth state
      set({ 
        session: null, 
        user: null, 
        loading: false,
        error: null,
        biometricEnabled: false
      });
      console.log('Auth state cleared successfully');
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

  clearError: () => {
    set({ error: null });
  },

  // Helper functions for testing/stories
  setSession: (session: Session | null) => {
    set({ 
      session, 
      user: session?.user || null,
      initializing: false 
    });
  },

  setInitializing: (initializing: boolean) => {
    set({ initializing });
  },
}));