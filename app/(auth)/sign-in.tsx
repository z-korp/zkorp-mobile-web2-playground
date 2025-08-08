import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SignInForm = z.infer<typeof signInSchema>;
type MagicLinkForm = z.infer<typeof magicLinkSchema>;

export default function SignInScreen() {
  const { signIn, signInWithMagicLink, loading, magicLinkLoading, error, biometricAvailable, authenticateWithBiometric } = useAuthStore();
  const { showToast } = useUIStore();
  const [authMode, setAuthMode] = useState<'password' | 'magiclink'>('password');

  const passwordForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const magicLinkForm = useForm<MagicLinkForm>({
    resolver: zodResolver(magicLinkSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onPasswordSubmit = async (data: SignInForm) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Welcome back!', 'success');
      router.replace('/(tabs)');
    }
  };

  const onMagicLinkSubmit = async (data: MagicLinkForm) => {
    const { error } = await signInWithMagicLink(data.email);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Magic link sent! Check your email.', 'success');
      router.push('/(auth)/magic-link-sent');
    }
  };

  const handleBiometricSignIn = async () => {
    const success = await authenticateWithBiometric();
    if (success) {
      showToast('Signed in successfully!', 'success');
      router.replace('/(tabs)');
    } else {
      showToast('Biometric authentication failed', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.form}>
            <View style={styles.authModeTabs}>
              <TouchableOpacity
                style={[styles.authModeTab, authMode === 'password' && styles.authModeTabActive]}
                onPress={() => setAuthMode('password')}
              >
                <Text style={[styles.authModeTabText, authMode === 'password' && styles.authModeTabTextActive]}>
                  Password
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authModeTab, authMode === 'magiclink' && styles.authModeTabActive]}
                onPress={() => setAuthMode('magiclink')}
              >
                <Text style={[styles.authModeTabText, authMode === 'magiclink' && styles.authModeTabTextActive]}>
                  Passwordless
                </Text>
              </TouchableOpacity>
            </View>

            {authMode === 'password' ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <Controller
                    control={passwordForm.control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, passwordForm.formState.errors.email && styles.inputError]}
                        placeholder="Enter your email"
                        placeholderTextColor="#666"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    )}
                  />
                  {passwordForm.formState.errors.email && (
                    <Text style={styles.errorText}>{passwordForm.formState.errors.email.message}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <Controller
                    control={passwordForm.control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, passwordForm.formState.errors.password && styles.inputError]}
                        placeholder="Enter your password"
                        placeholderTextColor="#666"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        autoComplete="password"
                      />
                    )}
                  />
                  {passwordForm.formState.errors.password && (
                    <Text style={styles.errorText}>{passwordForm.formState.errors.password.message}</Text>
                  )}
                </View>

                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}

                <TouchableOpacity
                  style={[styles.button, (!passwordForm.formState.isValid || loading) && styles.buttonDisabled]}
                  onPress={passwordForm.handleSubmit(onPasswordSubmit)}
                  disabled={!passwordForm.formState.isValid || loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => setAuthMode('magiclink')}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <Controller
                    control={magicLinkForm.control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, magicLinkForm.formState.errors.email && styles.inputError]}
                        placeholder="Enter your email"
                        placeholderTextColor="#666"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    )}
                  />
                  {magicLinkForm.formState.errors.email && (
                    <Text style={styles.errorText}>{magicLinkForm.formState.errors.email.message}</Text>
                  )}
                </View>

                <Text style={styles.magicLinkDescription}>
                  We&apos;ll email you a verification code to sign in without a password.
                </Text>

                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}

                <TouchableOpacity
                  style={[styles.button, (!magicLinkForm.watch('email') || magicLinkForm.formState.errors.email || magicLinkLoading) && styles.buttonDisabled]}
                  onPress={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
                  disabled={!magicLinkForm.watch('email') || !!magicLinkForm.formState.errors.email || magicLinkLoading}
                >
                  <Text style={styles.buttonText}>
                    {magicLinkLoading ? 'Sending Code...' : 'Send Verification Code'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.verifyCodeButton}
                  onPress={() => router.push('/(auth)/verify-otp')}
                >
                  <Text style={styles.verifyCodeButtonText}>
                    Have a verification code?
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {biometricAvailable && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricSignIn}
                disabled={loading}
              >
                <Text style={styles.biometricButtonText}>
                  Use Biometric Authentication
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don&apos;t have an account?{' '}
                <Link href="/(auth)/sign-up" style={styles.link}>
                  Sign Up
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#ffd33d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25292e',
  },
  biometricButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffd33d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  biometricButtonText: {
    fontSize: 16,
    color: '#ffd33d',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#999',
  },
  link: {
    color: '#ffd33d',
    fontWeight: '500',
  },
  authModeTabs: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 4,
  },
  authModeTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  authModeTabActive: {
    backgroundColor: '#ffd33d',
  },
  authModeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  authModeTabTextActive: {
    color: '#25292e',
  },
  magicLinkDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  verifyCodeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  verifyCodeButtonText: {
    fontSize: 14,
    color: '#ffd33d',
    fontWeight: '500',
  },
  forgotPasswordButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#ffd33d',
    fontWeight: '500',
  },
});