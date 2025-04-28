import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';

export default function Map() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<{ lat: number; lng: number; name: string; vicinity: string }[]>([]);

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show nearby places.');
        return;
      }

      // Get user's current location
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Fetch nearby hospitals and clinics (implemented below)
      fetchNearbyPlaces(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

  const fetchNearbyPlaces = async (lat: any, lng: any) => {
    try {
      // Overpass API query to find hospitals and clinics within ~5km
      const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${lat},${lng});
          node["amenity"="clinic"](around:5000,${lat},${lng});
        );
        out body;
      `;

      const response = await axios.post('https://overpass-api.de/api/interpreter', overpassQuery, {
        headers: { 'Content-Type': 'text/plain' },
      });

      const places = response.data.elements.map((element: any) => ({
        lat: element.lat,
        lng: element.lon,
        name: element.tags.name || 'Unnamed Hospital/Clinic',
        vicinity: element.tags['addr:street'] || 'Unknown address',
      }));

      setNearbyPlaces(places);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      Alert.alert('Error', 'Could not fetch nearby places. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
        >
          {/* Render nearby places as markers */}
          {nearbyPlaces.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.lat,
                longitude: place.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor="red"
            />
          ))}
        </MapView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="large" color={'#fe2238'} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
})