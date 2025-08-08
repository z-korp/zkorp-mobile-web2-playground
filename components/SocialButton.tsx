import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function SocialButton({
  provider,
  onPress,
  loading = false,
  disabled = false,
}: SocialButtonProps) {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          text: 'Continue with Google',
          icon: 'logo-google' as const,
          backgroundColor: '#fff',
          textColor: '#1f2937',
          borderColor: '#d1d5db',
        };
      case 'apple':
        return {
          text: 'Continue with Apple',
          icon: 'logo-apple' as const,
          backgroundColor: '#000',
          textColor: '#fff',
          borderColor: '#000',
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={config.textColor} 
            style={styles.icon}
          />
        ) : (
          <Ionicons
            name={config.icon}
            size={20}
            color={config.textColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.buttonText, { color: config.textColor }]}>
          {loading ? 'Signing in...' : config.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
    width: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});