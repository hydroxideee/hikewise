import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageContext = createContext();

const PREF_KEYS = {
  radius: 'pref_radius',
  sliders: 'pref_sliders',
  favorites: 'favorites',
};

export const storageProvider = ({ children }) => {
  const [radius, setRadius] = useState('');
  const [sliderValues, setSliderValues] = useState({
    Temperature: 50,
    'Wind Speed': 50,
    Precipitation: 50,
    'Cloud Cover': 50,
    'UV Index': 50,
  });

  const [favorites, setFavorites] = useState([]);

  // Load on mount
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storedRadius = await AsyncStorage.getItem(PREF_KEYS.radius);
        const storedSliders = await AsyncStorage.getItem(PREF_KEYS.sliders);
        const storedFavorites = await AsyncStorage.getItem(PREF_KEYS.favorites);

        if (storedRadius) setRadius(storedRadius);
        if (storedSliders) setSliderValues(JSON.parse(storedSliders));
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    };

    loadStorage();
  }, []);

  // Save when updated
  useEffect(() => {
    AsyncStorage.setItem(PREF_KEYS.radius, radius).catch(console.error);
  }, [radius]);

  useEffect(() => {
    AsyncStorage.setItem(PREF_KEYS.sliders, JSON.stringify(sliderValues)).catch(console.error);
  }, [sliderValues]);

  useEffect(() => {
    AsyncStorage.setItem(PREF_KEYS.favorites, JSON.stringify(favorites)).catch(console.error);
  }, [favorites]);

  // Add/remove favorite helpers
  const addFavorite = (item) => {
    setFavorites(prev => {
      const updated = [...prev, item];
      return [...new Set(updated.map(JSON.stringify))].map(JSON.parse); // ensure uniqueness
    });
  };

  const removeFavorite = (item) => {
    setFavorites(prev => prev.filter(fav => fav.id !== item.id));
  };

  return (
    <StorageContext.Provider
      value={{
        radius,
        setRadius,
        sliderValues,
        setSliderValues,
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};
