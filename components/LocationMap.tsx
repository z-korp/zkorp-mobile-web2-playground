import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface LocationMapProps {
  location: Location.LocationObject | null;
  followUser?: boolean;
  height?: number;
}

export function LocationMap({ location, followUser = true }: LocationMapProps) {
  const [showInfo, setShowInfo] = useState(false);
  const mapRef = useRef<MapView>(null);
  
  const openInMaps = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const url = `https://maps.apple.com/?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  useEffect(() => {
    if (location && followUser && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [location, followUser]);

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (!location) {
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📍 Location not available</Text>
          <Text style={styles.subtitle}>Enable location to see your position on map</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullscreenContainer}>
      {/* Fullscreen Native Map */}
      <MapView
        ref={mapRef}
        style={styles.fullscreenMap}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        mapType="standard"
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description={`Accuracy: ±${location.coords.accuracy?.toFixed(0)}m`}
            pinColor="red"
          />
        )}
      </MapView>
      
      {/* Info Button Overlay */}
      <TouchableOpacity 
        style={styles.infoButton} 
        onPress={() => setShowInfo(!showInfo)}
      >
        <Text style={styles.infoButtonText}>i</Text>
      </TouchableOpacity>
      
      {/* Collapsible Info Panel */}
      {showInfo && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelHeader}>
            <Text style={styles.infoPanelTitle}>🗺️ Location Info</Text>
            <TouchableOpacity onPress={() => setShowInfo(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.coordinates}>
            <Text style={styles.coordText}>
              📍 {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.accuracy}>
              🎯 Accuracy: ±{location.coords.accuracy?.toFixed(0)}m
            </Text>
          </View>

          <View style={styles.details}>
            <Text style={styles.detailText}>
              🧭 Altitude: {location.coords.altitude?.toFixed(0) ?? 'N/A'}m
            </Text>
            <Text style={styles.detailText}>
              🏃‍♂️ Speed: {location.coords.speed ? `${(location.coords.speed * 3.6).toFixed(1)} km/h` : 'N/A'}
            </Text>
            <Text style={styles.detailText}>
              🧭 Heading: {location.coords.heading?.toFixed(0) ?? 'N/A'}°
            </Text>
          </View>

          <Text style={styles.timestamp}>
            🕐 Updated: {new Date(location.timestamp).toLocaleTimeString()}
          </Text>

          <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
            <Text style={styles.openMapsButtonText}>Open in Maps App</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    position: 'relative',
  },
  fullscreenMap: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  infoButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  infoPanel: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoPanelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    padding: 4,
  },
  coordinates: {
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  coordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  accuracy: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  details: {
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  openMapsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  openMapsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});