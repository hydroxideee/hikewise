import Map from "@/components/Map";
import { KNOWN_TRAILS, TrailCoordinates } from "@/scripts/data/knownTrails";
import CurrentConditionsCard from "@/scripts/services/currentConditionsCard";
import { calculateDistance } from "@/scripts/services/trailService";
import WeatherMultiChart from "@/scripts/services/weatherMultiChart";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import Mapbox from "@rnmapbox/maps";
import { Href, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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

  // Bottom sheet ref and control
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["37%", "100%"], []);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const openSheet = () => {
    sheetRef.current?.snapToIndex(0);
  };
  const closeSheet = () => {
    sheetRef.current?.snapToIndex(-1);
  };

  // State for current trail
  const [currentTrail, setCurrentTrail] = useState<TrailCoordinates>(
    KNOWN_TRAILS[0]
  );

  // State for selected date
  const [date, setDate] = useState(new Date());

  // State for hourly/daily view
  const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");

  // Controls visibility of date picker
  const [showPicker, setShowPicker] = useState(false);

  const [currentLocation, setCurrentLocation] =
    useState<Mapbox.Location | null>(null);

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
    setTimeout(() => setIsNav(false), 500);
  };

  return (
    <View style={styles.container}>
      <Map
        trails={KNOWN_TRAILS}
        onTrailSelect={(trail) => {
          console.log(`Pressed: ${trail.name} ${trail.score}`);
          setCurrentTrail(trail);
          openSheet();
        }}
        onCurrentLocationChange={(location: Mapbox.Location) =>
          setCurrentLocation(location)
        }
      />
      {/* Left nav button (Preferences) */}
      <Pressable onPress={() => handleNav("/pref")} style={styles.leftIcon}>
        <MaterialIcons name="menu" size={48} color="#333" />
      </Pressable>

      {/* Right nav button (Favorites) */}
      <Pressable onPress={() => handleNav("/fav")} style={styles.rightIcon}>
        <MaterialIcons name="star" size={48} color="#333" />
      </Pressable>

      {/* Recommend button to trigger bottom sheet on best trail*/}
      <Pressable style={styles.recButton}>
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
                Distance:{" "}
                {currentLocation?.coords
                  ? calculateDistance(
                      currentLocation?.coords.latitude,
                      currentLocation?.coords.longitude,
                      currentTrail.latitude,
                      currentTrail.longitude
                    ).toFixed(1)
                  : "..."}{" "}
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
            <View style={styles.imageContainer}>
              <View style={styles.placeholderImage}>
                <Text style={{ color: "#000" }}>Image</Text>
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
    alignItems: "center",
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
    marginLeft: 20,
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
});
