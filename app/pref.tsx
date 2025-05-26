import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = 100;
const PREF_KEYS = {
  radius: 'pref_radius',
  sliders: 'pref_sliders',
};

export type WeatherPreferences = {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  cloudCover: number;
  uvIndex: number;
};

export default function PrefScreen() {
  const router = useRouter();

  // State for radius input (user-defined search radius)
  const [radius, setRadius] = useState('');

  // Slider labels for different weather preferences
  const sliderLabels = ['Temperature', 'Wind Speed', 'Precipitation', 'Cloud Cover', 'UV Index'];
  const [weatherPreferences, setWeatherPreferences] = useState<WeatherPreferences>({
    temperature: 50,
    windSpeed: 50,
    precipitation: 50,
    cloudCover: 50,
    uvIndex: 50
  });

  // Helper function to convert label to preference key
  const getPreferenceKey = (label: string): keyof WeatherPreferences => {
    return label.toLowerCase().replace(' ', '') as keyof WeatherPreferences;
  };

  // Load preferences on start
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedRadius = await AsyncStorage.getItem(PREF_KEYS.radius);
        const storedSliders = await AsyncStorage.getItem(PREF_KEYS.sliders);

        if (storedRadius) setRadius(storedRadius);
        if (storedSliders) setSliderValues(JSON.parse(storedSliders));
      } catch (e) {
        console.error('Failed to load preferences', e);
      }
    };

    loadPreferences();
  }, []);

  // Save radius when it changes
  useEffect(() => {
    AsyncStorage.setItem(PREF_KEYS.radius, radius).catch((e) =>
      console.error('Failed to save radius', e)
    );
  }, [radius]);

  // Save slider values when they change
  useEffect(() => {
    AsyncStorage.setItem(PREF_KEYS.sliders, JSON.stringify(sliderValues)).catch((e) =>
      console.error('Failed to save sliders', e)
    );
  }, [sliderValues]);

  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={48} color="#333" />
        </Pressable>
        <Text style={styles.heading}>Preferences</Text>
        <View style={styles.backButton} />
      </View>

      {/* Main scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sliders box */}
        <View style={styles.box}>
          <Text style={styles.pageTitle}>What are your ideal weather conditions?</Text>
          <Text style={styles.subHeader}>(Left to Right = Low to High)</Text>

          {/* Render each slider */}
          {sliderLabels.map((label, index) => (
            <View key={index} style={styles.sliderGroup}>
              <Text style={styles.sliderLabel}>
                {label}: {weatherPreferences[getPreferenceKey(label)]}
              </Text>

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={weatherPreferences[getPreferenceKey(label)]}
                onValueChange={(val) =>
                  setWeatherPreferences(prev => ({
                    ...prev,
                    [getPreferenceKey(label)]: val
                  }))
                }
                minimumTrackTintColor="#0a441e"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#0a441e"
              />
            </View>
          ))}
        </View>

        {/* Radius input box */}
        <View style={styles.box}>
          <Text style={styles.pageTitle}>How far away would you like to track (radius)?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter radius in km"
            keyboardType="numeric"
            placeholderTextColor="#999"
            value={radius}
            onChangeText={setRadius}
          />
        </View>
      </ScrollView>
    </View>
  );
}
