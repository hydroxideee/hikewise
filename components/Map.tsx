import { PermissionsAndroid, Platform, StyleSheet, View } from "react-native";

import { TrailCoordinates } from "@/scripts/data/knownTrails";
import Mapbox from "@rnmapbox/maps";
import type { FeatureCollection, Point } from "geojson";
import { useEffect, useRef, useState } from "react";

interface PointProperties {
  //   title: string;
}

Mapbox.setAccessToken(
  "pk.eyJ1IjoiaGlrZXdpc2UiLCJhIjoiY21hcGZ2MnFrMGVxdjJscjA3d3M2ejg2biJ9.BnOHZXq733sdJwvu1K_2-Q"
);
Mapbox.Logger.setLogLevel("verbose");

// const points = [
//   { id: "1", coordinates: [0.091755, 52.210914], title: "WGB" },
//   { id: "2", coordinates: [0.124573, 52.20117], title: "Downing College" },
//   { id: "3", coordinates: [0.122388, 52.211565], title: "Jesus Green" },
// ];

// const geojson: FeatureCollection<Point, PointProperties> = {
//   type: "FeatureCollection",
//   features: points.map((p) => ({
//     type: "Feature",
//     id: p.id,
//     properties: { title: p.title },
//     geometry: { type: "Point", coordinates: p.coordinates },
//   })),
// };

function toGeoJson(points: TrailCoordinates[]) {
  const geojson: FeatureCollection<Point, PointProperties> = {
    type: "FeatureCollection",
    features: points.map((p) => ({
      type: "Feature",
      id: p.name,
      properties: {},
      geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
    })),
  };
  return geojson;
}

interface MapProps {
  trails: TrailCoordinates[];
}

export default function Map(props: MapProps) {
  const [mapReady, setMapReady] = useState(false);
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

  useEffect(() => {});

  function onUpdateLocation(location: Mapbox.Location) {
    if (!currentLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 10,
      });
    }
    setCurrentLocation(location);
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Outdoors}
        onDidFinishRenderingMapFully={() => setMapReady(true)}
      >
        <Mapbox.Camera ref={cameraRef} zoomLevel={10} />
        <Mapbox.UserLocation
          visible
          onUpdate={onUpdateLocation}
          showsUserHeadingIndicator
        />
        <Mapbox.ShapeSource
          id="pointsSource"
          shape={toGeoJson(props.trails)}
          onPress={(e) => {
            console.log(`Pressed: ${e.features[0].id}`);
            cameraRef.current?.setCamera({
              centerCoordinate: [
                e.coordinates.longitude,
                e.coordinates.latitude,
              ],
              zoomLevel: 15,
            });
          }}
        >
          <Mapbox.SymbolLayer
            id="pointsSymbols"
            sourceLayerID="pointsSource"
            style={{
              iconImage: "marker-15", // built-in Mapbox icon
              iconAllowOverlap: true, // don’t hide overlapping points
              iconSize: 2.5, // make it a bit bigger
              textField: ["get", "title"], // optional: show text labels
              textOffset: [0, 1.2], // push text above the icon
              textAllowOverlap: false,
            }}
          />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
