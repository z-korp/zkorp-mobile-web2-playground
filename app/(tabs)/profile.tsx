import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

function AuthenticatedProfile() {
  const { 
    user, 
    signOut, 
    loading, 
    biometricAvailable, 
    biometricEnabled, 
    enableBiometric 
  } = useAuthStore();
  const { showToast } = useUIStore();

  const handleSignOut = async () => {
    console.log('Sign out button pressed - direct logout');
    try {
      console.log('Starting sign out process...');
      await signOut();
      console.log('Sign out completed');
      showToast('Signed out successfully', 'success');
    } catch (error) {
      console.error('Sign out error:', error);
      showToast('Failed to sign out', 'error');
    }
  };

  const handleEnableBiometric = async () => {
    const success = await enableBiometric();
    if (success) {
      showToast('Biometric authentication enabled', 'success');
    } else {
      showToast('Failed to enable biometric authentication', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={48} color="#ffd33d" />
            </View>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.joinDate}>
              Member since {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
            </Text>
          </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#fff" />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#fff" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          {biometricAvailable && (
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleEnableBiometric}
              disabled={biometricEnabled}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="finger-print-outline" size={24} color="#fff" />
                <View>
                  <Text style={styles.settingText}>Biometric Authentication</Text>
                  <Text style={styles.settingSubtext}>
                    {biometricEnabled ? 'Enabled' : 'Tap to enable'}
                  </Text>
                </View>
              </View>
              {biometricEnabled ? (
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#666" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={24} color="#fff" />
              <Text style={styles.settingText}>Export Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

          {/* Sign Out */}
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleSignOut}
            disabled={loading}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            <Text style={styles.signOutText}>
              {loading ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UnauthenticatedProfile() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.authContainer}>
        <View style={styles.authHeader}>
          <Ionicons name="person-circle-outline" size={80} color="#ffd33d" />
          <Text style={styles.authTitle}>Welcome!</Text>
          <Text style={styles.authSubtitle}>
            Sign in to access your notes, sync across devices, and unlock all features.
          </Text>
        </View>

        <View style={styles.authButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Ionicons name="log-in-outline" size={20} color="#25292e" />
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Ionicons name="person-add-outline" size={20} color="#ffd33d" />
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What you get with an account:</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="cloud-outline" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Sync notes across all devices</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Secure backup & recovery</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="finger-print-outline" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Biometric authentication</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Access history & versions</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function ProfileScreen() {
  const { session, initializing } = useAuthStore();

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="hourglass-outline" size={48} color="#ffd33d" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return session ? <AuthenticatedProfile /> : <UnauthenticatedProfile />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  
  // Authenticated Profile Styles
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
    marginLeft: 16,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  signOutText: {
    fontSize: 16,
    color: '#ff4444',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Unauthenticated Profile Styles
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 16,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  authButtons: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#ffd33d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25292e',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffd33d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffd33d',
  },
  featuresContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 12,
  },
});