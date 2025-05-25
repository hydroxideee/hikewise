import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = 100;

export default function PrefScreen() {
  const router = useRouter();

  // State for radius input (user-defined search radius)
  const [radius, setRadius] = useState('');

  // Slider labels for different weather preferences
  const sliderLabels = ['Temperature', 'Wind Speed', 'Precipitation', 'Cloud Cover', 'UV Index'];
  const [sliderValues, setSliderValues] = useState(
    Object.fromEntries(sliderLabels.map(label => [label, 50]))
  );

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
                {label}: {sliderValues[label]}
              </Text>

              {/* Slider input (individual for each feature) */}
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={sliderValues[label]}
                onValueChange={(val) =>
                  setSliderValues(prev => ({ ...prev, [label]: val }))
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

          {/* Numeric text input*/}
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

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffade',
  },
  headerRow: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#fffade',
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontFamily: 'JetBrainsMono-Bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  box: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 24,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'JetBrainsMono-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  sliderGroup: {
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: 'JetBrainsMono-Regular',
    textAlign: 'center',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontFamily: 'JetBrainsMono-Regular',
    color: '#000',
    textAlign: 'center',
  },
});
