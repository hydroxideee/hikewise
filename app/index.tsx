import { FavoriteSvg } from "@/components/FavoriteSvg";
import MapDisplay, { TrailWithScore } from "@/components/Map";
import { StorageContext } from "@/context/storageContext";
import { KNOWN_TRAILS, TrailCoordinates } from "@/scripts/data/knownTrails";
import CurrentConditionsCard from "@/scripts/services/currentConditionsCard";
import {
  calculateDistance,
  getTrailImages,
} from "@/scripts/services/trailService";
import WeatherMultiChart from "@/scripts/services/weatherMultiChart";
import {
  getScore,
  WeatherResponse,
  WeatherService,
} from "@/scripts/services/weatherService";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import Mapbox from "@rnmapbox/maps";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import _ from "lodash";
import debounce from "lodash.debounce";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  const { favorites, setFavorites, weatherPreferences, radius } =
    useContext(StorageContext);

  const [targetCoordinates, setTargetCoordinates] = useState<
    number[] | undefined
  >();

  // Bottom sheet ref and control
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["37%", "100%"], []);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const openSheet = () => {
    sheetRef.current?.snapToIndex(0);
  };
  const closeSheet = () => {
    // sheetRef.current?.snapToIndex(-1);
    sheetRef.current?.close();
  };

  // State for current trail
  const [currentTrail, setCurrentTrail] = useState<TrailCoordinates>(
    KNOWN_TRAILS[0]
  );

  // State for selected date
  const [date, setDate] = useState(new Date());

  const [trailsWithScores, setTrailsWithScores] = useState<TrailWithScore[]>(
    []
  );

  const [currentWeatherMap, setCurrentWeatherMap] = useState<
    Map<string, WeatherResponse>
  >(new Map());

  function updateCurrentWeatherMap(key: string, value: WeatherResponse) {
    console.log(2, currentWeatherMap.entries.length);
    setCurrentWeatherMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  }

  const weatherService = new WeatherService();

  useEffect(() => {
    const promises = KNOWN_TRAILS.map((trail) => {
      weatherService
        .getCurrentConditions(trail.latitude, trail.longitude)
        .then((r) => updateCurrentWeatherMap(trail.name, r));
    });
    Promise.all(promises);
  }, [KNOWN_TRAILS, date]);

  function updateScores() {
    setTrailsWithScores(
      KNOWN_TRAILS.map((trail) => {
        const weather = currentWeatherMap.get(trail.name);
        if (weather !== undefined) {
          const score = getScore(weather, weatherPreferences);
          console.log(trail.name, score);
          return { ...trail, score: getScore(weather, weatherPreferences) };
        }
      }).filter((t) => t !== undefined)
    );
  }

  const debouncedUpdateScore = useMemo(
    () => debounce(updateScores, 100),
    [KNOWN_TRAILS]
  );

  const updateScore = useCallback(() => {
    console.log(1);
    debouncedUpdateScore();
  }, [debouncedUpdateScore]);

  useEffect(updateScore, [currentWeatherMap, weatherPreferences]);

  // State for hourly/daily view
  const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");

  // Controls visibility of date picker
  const [showPicker, setShowPicker] = useState(false);

  const [currentLocation, setCurrentLocation] =
    useState<Mapbox.Location | null>(null);

  const [trailImageUrl, setTrailImageUrl] = useState<string | null>(null);

  // Set date range for the date picker
  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + 9);
    return max;
  }, []);

  // Format date to button text readable
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handles date change from picker - ios looks better
  const onChangeDate = (event: any, selectedDate: any) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Navigation lock to prevent rapid presses
  const [isNav, setIsNav] = useState(false);

  // Prevents rapid-fire navigation
  const handleNav = (path: Href) => {
    if (isNav) return;
    setIsNav(true);
    router.push(path);
    setTimeout(() => setIsNav(false), 50);
  };

  function distanceToTrail(trail: TrailCoordinates) {
    return currentLocation
      ? calculateDistance(
          currentLocation?.coords.latitude,
          currentLocation?.coords.longitude,
          trail.latitude,
          trail.longitude
        )
      : null;
  }

  function showTrail(trail: TrailWithScore) {
    setCurrentTrail(trail);
    setTrailImageUrl(null);
    getTrailImages(trail).then((t) => {
      const imageUrl = t.imageUrls[0];
      console.log(imageUrl);
      setTrailImageUrl(imageUrl);
    });
    openSheet();
  }

  return (
    <View style={styles.container}>
      <MapDisplay
        trails={trailsWithScores}
        favorites={favorites}
        targetCoordinates={targetCoordinates}
        onTrailSelect={(trail) => {
          console.log(`Pressed: ${trail.name} ${trail.score}`);
          showTrail(trail);
        }}
        onCurrentLocationChange={(location: Mapbox.Location) =>
          setCurrentLocation(location)
        }
        onUserMoveMap={() => closeSheet()}
      />
      {/* Left nav button (Preferences) */}
      <Pressable onPress={() => handleNav("/pref")} style={styles.leftIcon}>
        <MaterialIcons name="menu" size={48} color="#333" />
      </Pressable>

      {/* Right nav button (Favorites) */}
      <Pressable onPress={() => handleNav("/fav")} style={styles.rightIcon}>
        <FavoriteSvg size={48} active />
      </Pressable>

      {/* Recommend button to trigger bottom sheet on best trail*/}
      <Pressable
        onPress={() => {
          let filteredTrails = trailsWithScores.filter((t) => {
            console.log(
              t.name,
              distanceToTrail(t) ?? Infinity,
              (distanceToTrail(t) ?? Infinity) <= radius
            );
            return (distanceToTrail(t) ?? Infinity) <= radius;
          });
          let trail = _.maxBy(filteredTrails, (t) => t.score);
          if (trail === undefined) return;
          setTargetCoordinates([trail.longitude, trail.latitude]);
          showTrail(trail);
        }}
        style={styles.recButton}
      >
        <Text style={styles.buttonText}>Recommend</Text>
      </Pressable>

      {/* Date selector */}
      <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.buttonText}>Date: {formatDate(date)}</Text>
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        keyboardBehavior="interactive"
        enableContentPanningGesture={true}
        backgroundStyle={{ backgroundColor: "#f0f0f0" }}
        onChange={(index) => {
          setIsSheetExpanded(index >= 0);
        }}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Sheet header with trail info and image */}
          <View style={styles.sheetHeader}>
            <View style={styles.leftSection}>
              <Text style={styles.sheetTitle}>{currentTrail.name}</Text>
              <Text style={styles.infoText}>
                Distance: {distanceToTrail(currentTrail)?.toFixed(1) ?? "..."}{" "}
                km
              </Text>
              {/* <Text style={styles.infoText}>Temperature: 23 C</Text>
              <Text style={styles.infoText}>Wind Speed: 3km/h</Text>
              <Text style={styles.infoText}>Precipitation: 20mm</Text>
              <Text style={styles.infoText}>Overall Score: 7/10</Text> */}
              <View style={styles.graphSection}>
                <CurrentConditionsCard
                  latitude={currentTrail.latitude}
                  longitude={currentTrail.longitude}
                />
              </View>
            </View>
            <View style={styles.infoRightSide}>
              <View style={styles.favoriteBox}>
                <Pressable
                  onPress={() =>
                    setFavorites((prev) =>
                      favorites.includes(currentTrail.name)
                        ? prev.filter((n) => n !== currentTrail.name)
                        : [...prev, currentTrail.name]
                    )
                  }
                >
                  <FavoriteSvg
                    size={40}
                    active={favorites.includes(currentTrail.name)}
                  />
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                {trailImageUrl ? (
                  <Image source={trailImageUrl} style={styles.trailImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    {/* <Text style={{ color: "#000" }}>Image</Text> */}
                  </View>
                )}
              </View>
            </View>
          </View>

          <Text style={styles.text}>Swipe up for detailed information:</Text>

          <View style={styles.toggleContainer}>
            <Pressable
              onPress={() => setViewMode("hourly")}
              style={[
                styles.toggleButton,
                viewMode === "hourly" && styles.activeToggle,
              ]}
            >
              <Text style={styles.toggleText}>Hourly</Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode("daily")}
              style={[
                styles.toggleButton,
                viewMode === "daily" && styles.activeToggle,
              ]}
            >
              <Text style={styles.toggleText}>Daily</Text>
            </Pressable>
          </View>

          {/* Graph Section only opens when expanded */}
          {isSheetExpanded && (
            <View style={styles.graphSection}>
              <WeatherMultiChart
                latitude={currentTrail.latitude} // Replace with actual location or state
                longitude={currentTrail.longitude}
                viewMode={viewMode}
              />
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Date picker functionality */}
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffade",
  },
  leftIcon: {
    padding: 10,
    position: "absolute",
    top: height * 0.04,
    left: width * 0.05,
  },
  rightIcon: {
    padding: 10,
    position: "absolute",
    top: height * 0.04,
    right: width * 0.05,
  },
  recButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: "center",
    position: "absolute",
    bottom: height * 0.07,
    left: width * 0.07,
    minWidth: 100,
  },
  dateButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: "center",
    position: "absolute",
    bottom: height * 0.07,
    right: width * 0.07,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    minWidth: 100,
    fontFamily: "JetBrainsMono-Bold",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "JetBrainsMono-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  sheetTitle: {
    fontSize: 24,
    fontFamily: "JetBrainsMono-Bold",
    marginBottom: 10,
    textAlign: "left",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 20,
  },
  leftSection: {
    flex: 1,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  infoText: {
    fontSize: 14,
    fontFamily: "JetBrainsMono-Regular",
    color: "#333",
    marginBottom: 4,
  },
  graphSection: {
    marginTop: 10,
    paddingBottom: 10,
  },
  graphBox: {
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#999",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  activeToggle: {
    backgroundColor: "#4CAF50",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  trailImage: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
  infoRightSide: {
    maxWidth: 160,
    flex: 1,
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-start",

    gap: 30,
    alignItems: "flex-end",
  },
  favoriteBox: {
    marginTop: 20,
    marginLeft: 20,
    justifyContent: "flex-start",
    width: 140,
    alignItems: "center",
    // marginBottom: 50,
  },
});
