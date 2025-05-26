import { PermissionsAndroid, Platform, StyleSheet, View } from "react-native";

import { TrailCoordinates } from "@/scripts/data/knownTrails";
import Mapbox from "@rnmapbox/maps";
import type { FeatureCollection, Point } from "geojson";
import { useEffect, useRef, useState } from "react";

interface PointProperties extends TrailCoordinates {
  score: number;
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
      properties: { ...p, score: Math.random() * 10 },
      geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
    })),
  };
  return geojson;
}

const MAP_STYLE_URL = "mapbox://styles/hikewise/cmawz9a9r006w01sdawjq2n4d";

interface MapProps {
  trails: TrailCoordinates[];
  onTrailSelect?: (trail: PointProperties) => void;
  onUserMoveMap?: () => void;
  onCurrentLocationChange?: (location: Mapbox.Location) => void;
  favorites?: string[];
}

export default function Map(props: MapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<Mapbox.Location | null>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);
  const mapViewRef = useRef<Mapbox.MapView>(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
  }, []);

  // useEffect(() => {}, [mapViewRef.current?]);

  function onUpdateLocation(location: Mapbox.Location) {
    if (!currentLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 10,
      });
    }
    props.onCurrentLocationChange?.(location);
    setCurrentLocation(location);
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Mapbox.MapView
        ref={mapViewRef}
        style={styles.map}
        scaleBarEnabled={false}
        styleURL={MAP_STYLE_URL}
        onCameraChanged={(state) =>
          state.gestures.isGestureActive && props.onUserMoveMap?.()
        }
        onDidFinishRenderingMapFully={() => setMapReady(true)}
      >
        <Mapbox.Images
          images={{
            favorite: require("../assets/images/favorite.png"),
          }}
        />
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
            const feature = e.features[0];
            cameraRef.current?.setCamera({
              centerCoordinate: (feature.geometry as { coordinates: number[] })
                .coordinates,
              zoomLevel: 12,
            });
            props.onTrailSelect?.(feature.properties as PointProperties);
          }}
        >
          {/* <Mapbox.SymbolLayer
            id="pointsSymbols"
            sourceLayerID="pointsSource"
            style={{
              iconImage: "marker-15", // built-in Mapbox icon
              iconAllowOverlap: true, // don’t hide overlapping points
              iconSize: 2.5, // make it a bit bigger
              //   textField: ["get", "name"], // optional: show text labels
              textOffset: [0, 1.2], // push text above the icon
              textAllowOverlap: false,
            }}
          /> */}
          <Mapbox.CircleLayer
            id="pointsCircles"
            style={{
              circleRadius: 8,
              circleColor: [
                "interpolate",
                ["linear"],
                ["get", "score"],
                0,
                "#ff9999", // soft red
                5,
                "#ffcc99", // pastel orange
                10,
                "#99ff99", // minty green
              ],
              circleStrokeColor: "#000000", // black outline
              circleStrokeWidth: 1.5,
            }}
          />

          <Mapbox.SymbolLayer
            id="pointsFavorites"
            filter={["in", ["get", "name"], ["literal", props.favorites ?? []]]}
            style={{
              iconImage: "favorite", // matches your key
              iconSize: 0.05, // tweak to fit circle
              iconAllowOverlap: true,
              // push it to top‐right of circle:
              iconOffset: [
                // x right, y up in pixels
                150, -75,
              ],
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
