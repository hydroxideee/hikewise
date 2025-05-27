import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export type WeatherPreferences = {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  cloudCover: number;
  uvIndex: number;
};

type ContextValue = {
  radius: number;
  setRadius: Dispatch<SetStateAction<number>>;
  weatherPreferences: WeatherPreferences;
  setWeatherPreferences: Dispatch<SetStateAction<WeatherPreferences>>;
  favorites: string[];
  setFavorites: Dispatch<SetStateAction<string[]>>;
};

export const StorageContext = createContext<ContextValue>(undefined!);

export const StorageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [radius, setRadiusState] = useState(100);
  const [weatherPreferences, setWeatherPreferencesState] = useState({
    temperature: 50,
    windSpeed: 50,
    precipitation: 50,
    cloudCover: 50,
    uvIndex: 50,
  });
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load preferences from storage
  useEffect(() => {
    (async () => {
      const r = await AsyncStorage.getItem("pref_radius");
      const wp = await AsyncStorage.getItem("pref_sliders");
      const favs = await AsyncStorage.getItem("favorites");

      if (r) setRadiusState(Number(r));
      if (wp) setWeatherPreferencesState(JSON.parse(wp));
      if (favs) setFavorites(JSON.parse(favs));
    })();
  }, []);

  // Save on changes
  useEffect(() => {
    AsyncStorage.setItem("pref_radius", radius.toString());
  }, [radius]);

  useEffect(() => {
    AsyncStorage.setItem("pref_sliders", JSON.stringify(weatherPreferences));
  }, [weatherPreferences]);

  useEffect(() => {
    AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <StorageContext.Provider
      value={{
        radius,
        setRadius: setRadiusState,
        weatherPreferences,
        setWeatherPreferences: setWeatherPreferencesState,
        favorites,
        setFavorites,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};
