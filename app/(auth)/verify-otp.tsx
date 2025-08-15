import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

const otpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  token: z.string().min(6, 'Verification code must be at least 6 characters'),
});

type OTPForm = z.infer<typeof otpSchema>;

export default function VerifyOTPScreen() {
  const { verifyOtp, lastMagicLinkEmail, otpVerificationLoading, error } = useAuthStore();
  const { showToast } = useUIStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
    defaultValues: {
      email: lastMagicLinkEmail || '',
    },
  });

  const onSubmit = async (data: OTPForm) => {
    const { error } = await verifyOtp(data.email, data.token);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Successfully signed in!', 'success');
      router.replace('/(tabs)');
    }
  };

  const handleBackToSignIn = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>
          
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code from your email
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
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
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <Controller
                control={control}
                name="token"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.token && styles.inputError]}
                    placeholder="123456"
                    placeholderTextColor="#666"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    maxLength={6}
                  />
                )}
              />
              {errors.token && (
                <Text style={styles.errorText}>{errors.token.message}</Text>
              )}
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.button, (!isValid || otpVerificationLoading) && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || otpVerificationLoading}
            >
              <Text style={styles.buttonText}>
                {otpVerificationLoading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToSignIn}
            >
              <Text style={styles.backButtonText}>
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.help}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <Text style={styles.helpText}>
              • Check your email for a 6-digit code
            </Text>
            <Text style={styles.helpText}>
              • The code expires in 60 minutes
            </Text>
            <Text style={styles.helpText}>
              • Make sure to check your spam folder
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 30,
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
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25292e',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  help: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffd33d',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
    lineHeight: 18,
  },
});