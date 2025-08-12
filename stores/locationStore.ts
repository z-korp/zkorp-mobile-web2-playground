import { create } from 'zustand';
import * as Location from 'expo-location';

export interface LocationState {
  currentLocation: Location.LocationObject | null;
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  locationSubscription: Location.LocationSubscription | null;
  accuracy: Location.Accuracy;
  updateInterval: number;
}

export interface LocationActions {
  getCurrentLocation: () => Promise<void>;
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => void;
  setAccuracy: (accuracy: Location.Accuracy) => void;
  setUpdateInterval: (interval: number) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  isLoading: false,
  error: null,
  locationSubscription: null,
  accuracy: Location.Accuracy.Balanced,
  updateInterval: 5000,
};

export const useLocationStore = create<LocationState & LocationActions>((set, get) => ({
  ...initialState,

  getCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: get().accuracy,
      });
      
      set({ 
        currentLocation: location,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get current location',
      });
    }
  },

  startLocationTracking: async () => {
    const { isTracking, locationSubscription } = get();
    
    if (isTracking && locationSubscription) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: get().accuracy,
          timeInterval: get().updateInterval,
          distanceInterval: 10,
        },
        (location) => {
          set({ currentLocation: location });
        }
      );

      set({ 
        locationSubscription: subscription,
        isTracking: true,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start location tracking',
      });
    }
  },

  stopLocationTracking: () => {
    const { locationSubscription } = get();
    
    if (locationSubscription) {
      locationSubscription.remove();
    }

    set({ 
      locationSubscription: null,
      isTracking: false,
    });
  },

  setAccuracy: (accuracy) => {
    set({ accuracy });
    
    const { isTracking } = get();
    if (isTracking) {
      get().stopLocationTracking();
      get().startLocationTracking();
    }
  },

  setUpdateInterval: (interval) => {
    set({ updateInterval: interval });
    
    const { isTracking } = get();
    if (isTracking) {
      get().stopLocationTracking();
      get().startLocationTracking();
    }
  },

  clearError: () => set({ error: null }),

  reset: () => {
    const { locationSubscription } = get();
    if (locationSubscription) {
      locationSubscription.remove();
    }
    set(initialState);
  },
}))