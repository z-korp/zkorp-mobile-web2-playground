import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export default function MagicLinkSentScreen() {
  const { lastMagicLinkEmail, resendMagicLink, magicLinkLoading, clearMagicLinkState } = useAuthStore();
  const { showToast } = useUIStore();
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResend = async () => {
    if (!lastMagicLinkEmail || resendCooldown > 0) return;

    const { error } = await resendMagicLink(lastMagicLinkEmail);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Verification code sent again!', 'success');
      // Start cooldown
      setResendCooldown(30);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleBackToSignIn = () => {
    clearMagicLinkState();
    router.replace('/(auth)/sign-in');
  };

  const handleManualVerification = () => {
    router.push('/(auth)/verify-otp');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>
        
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>
          We&apos;ve sent a verification code to{'\n'}
          <Text style={styles.email}>{lastMagicLinkEmail}</Text>
        </Text>

        <Text style={styles.description}>
          Click the link in your email or enter the 6-digit code manually.{'\n'}The code will expire in 60 minutes.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.resendButton, (resendCooldown > 0 || magicLinkLoading) && styles.buttonDisabled]}
            onPress={handleResend}
            disabled={resendCooldown > 0 || magicLinkLoading}
          >
            <Text style={styles.resendButtonText}>
              {magicLinkLoading 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend Verification Code'
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleManualVerification}
          >
            <Text style={styles.verifyButtonText}>
              Enter verification code manually
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

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Tips:</Text>
          <Text style={styles.tip}>• Check your spam folder</Text>
          <Text style={styles.tip}>• Make sure {lastMagicLinkEmail} is correct</Text>
          <Text style={styles.tip}>• The code works only once</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#25292e',
    padding: 20,
    justifyContent: 'center',
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
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    color: '#ffd33d',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    marginBottom: 40,
  },
  resendButton: {
    backgroundColor: '#ffd33d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25292e',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  verifyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffd33d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    fontSize: 16,
    color: '#ffd33d',
    fontWeight: '500',
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
  tips: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffd33d',
    marginBottom: 8,
  },
  tip: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
    lineHeight: 18,
  },
});