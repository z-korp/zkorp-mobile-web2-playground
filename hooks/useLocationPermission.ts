import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationPermissionState {
  status: Location.PermissionStatus | null;
  isLoading: boolean;
  error: string | null;
  canAskAgain: boolean;
}

export function useLocationPermission() {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>({
    status: null,
    isLoading: true,
    error: null,
    canAskAgain: true,
  });

  const checkPermission = async () => {
    try {
      setPermissionState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      setPermissionState({
        status,
        isLoading: false,
        error: null,
        canAskAgain: canAskAgain ?? true,
      });
      
      return status;
    } catch (error) {
      setPermissionState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check location permission',
      }));
      return null;
    }
  };

  const requestPermission = async () => {
    try {
      setPermissionState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      setPermissionState({
        status,
        isLoading: false,
        error: null,
        canAskAgain: canAskAgain ?? true,
      });
      
      return status;
    } catch (error) {
      setPermissionState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to request location permission',
      }));
      return null;
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Location.openSettings();
    } else {
      Location.openSettings();
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    ...permissionState,
    checkPermission,
    requestPermission,
    openSettings,
    isGranted: permissionState.status === Location.PermissionStatus.GRANTED,
    isDenied: permissionState.status === Location.PermissionStatus.DENIED,
    isUndetermined: permissionState.status === Location.PermissionStatus.UNDETERMINED,
  };
}