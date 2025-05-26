import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WeatherService } from '../services/weatherService';

interface Props {
  latitude: number;
  longitude: number;
}

const CurrentConditionsCard: React.FC<Props> = ({ latitude, longitude }) => {
  const [conditions, setConditions] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const weatherService = new WeatherService();

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const data = await weatherService.getCurrentConditions(latitude, longitude);
        setConditions(data);
      } catch (error) {
        console.error('Error fetching current conditions:', error);
        setConditions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
  }, [latitude, longitude]);

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 10 }} />;
  }

  if (!conditions) {
    return <Text style={{ color: 'red' }}>No current data</Text>;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.text}>🌡️ Temp: {conditions.temperature?.degrees ?? '-'}°C</Text>
      <Text style={styles.text}>💨 Wind: {conditions.wind?.speed?.value ?? '-'} km/h</Text>
      <Text style={styles.text}>🌧️ Precipitation: {conditions.precipitation?.probability?.percent ?? '-'}%</Text>
      <Text style={styles.text}>☁️ Cloud Cover: {conditions.cloudCover ?? '-'}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Regular',
    color: '#333',
    marginBottom: 4,
  },
});

export default CurrentConditionsCard;
