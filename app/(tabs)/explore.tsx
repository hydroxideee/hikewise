import { PermissionsAndroid, Platform, StyleSheet, View } from "react-native";

import Mapbox from "@rnmapbox/maps";
import { useEffect, useRef, useState } from "react";

Mapbox.setAccessToken(
  "pk.eyJ1IjoiaGlrZXdpc2UiLCJhIjoiY21hcGZ2MnFrMGVxdjJscjA3d3M2ejg2biJ9.BnOHZXq733sdJwvu1K_2-Q"
);

export default function TabTwoScreen() {
  const [currentLocation, setCurrentLocation] =
    useState<Mapbox.Location | null>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
  }, []);

  function onUpdateLocation(location: Mapbox.Location) {
    if (!currentLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
      });
    }
    setCurrentLocation(location);
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Light}>
          <Mapbox.Camera ref={cameraRef} zoomLevel={14} />
          <Mapbox.UserLocation
            visible
            onUpdate={onUpdateLocation}
            showsUserHeadingIndicator
          />
        </Mapbox.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
});
