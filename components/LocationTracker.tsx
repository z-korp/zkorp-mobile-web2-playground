import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useLocationStore } from '@/stores/locationStore';
import { LocationMap } from '@/components/LocationMap';
import * as Location from 'expo-location';

export function LocationTracker() {
  const permission = useLocationPermission();
  const {
    currentLocation,
    isTracking,
    isLoading,
    error,
    accuracy,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    setAccuracy,
    clearError,
  } = useLocationStore();

  useEffect(() => {
    // Auto-request location when permission is granted
    if (permission.isGranted && !currentLocation && !isLoading) {
      getCurrentLocation();
    }
    
    return () => {
      stopLocationTracking();
    };
  }, [permission.isGranted]);

  useEffect(() => {
    // Auto-start tracking when we have location
    if (permission.isGranted && currentLocation && !isTracking) {
      startLocationTracking();
    }
  }, [currentLocation, permission.isGranted]);

  const handleRequestPermission = async () => {
    const status = await permission.requestPermission();
    if (status === Location.PermissionStatus.GRANTED) {
      getCurrentLocation();
    }
  };

  // Show permission UI if needed
  if (permission.isLoading) {
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Checking location permissions...</Text>
        </View>
      </View>
    );
  }

  if (!permission.isGranted) {
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>📍 Location Access Required</Text>
          <Text style={styles.subtitle}>
            {permission.isDenied && !permission.canAskAgain
              ? 'Location permission was denied. Please enable it in your device settings to see the map.'
              : 'We need access to your location to show you an interactive map with your current position.'}
          </Text>
          <View style={styles.buttonContainer}>
            {permission.canAskAgain ? (
              <Button title="Grant Location Permission" onPress={handleRequestPermission} />
            ) : (
              <Button title="Open Device Settings" onPress={permission.openSettings} />
            )}
          </View>
        </View>
      </View>
    );
  }

  // Show loading state while getting initial location
  if (!currentLocation && isLoading) {
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error && !currentLocation) {
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.centerContent}>
          <Text style={styles.errorTitle}>❌ Location Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Retry" onPress={() => { clearError(); getCurrentLocation(); }} />
          </View>
        </View>
      </View>
    );
  }

  // Show fullscreen map
  return (
    <View style={styles.fullscreenContainer}>
      <LocationMap location={currentLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 16,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#dc3545',
  },
  errorText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
  },
});