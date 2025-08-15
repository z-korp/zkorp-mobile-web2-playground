import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import SocialButton from '@/components/SocialButton';
import SignInScreen from './sign-in';

export default function AuthScreen() {
  const { signInWithGoogle, signInWithApple, googleLoading, appleLoading, error } = useAuthStore();
  const { showToast } = useUIStore();
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Successfully signed in with Google!', 'success');
      router.replace('/(tabs)');
    }
  };

  const handleAppleSignIn = async () => {
    const { error } = await signInWithApple();
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Successfully signed in with Apple!', 'success');
      router.replace('/(tabs)');
    }
  };

  const handleEmailSignIn = () => {
    setShowEmailModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.buttonContainer}>
          {Platform.OS === 'ios' && (
            <SocialButton
              provider="apple"
              onPress={handleAppleSignIn}
              loading={appleLoading}
            />
          )}
          
          <SocialButton
            provider="google"
            onPress={handleGoogleSignIn}
            loading={googleLoading}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.emailButton}
            onPress={handleEmailSignIn}
            activeOpacity={0.8}
          >
            <View style={styles.emailButtonContent}>
              <Ionicons
                name="mail"
                size={20}
                color="#25292e"
                style={styles.emailIcon}
              />
              <Text style={styles.emailButtonText}>
                Sign in with Email
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ff4444" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>

      <Modal
        visible={showEmailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalContainer}>
          <SignInScreen />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#3d1f1f',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ff444444',
  },
  errorIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  errorText: {
    color: '#ff6666',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  emailButton: {
    backgroundColor: '#ffd33d',
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ffd33d',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emailButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailIcon: {
    marginRight: 12,
    width: 20,
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#25292e',
  },
});