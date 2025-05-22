import Map from "@/components/Map";
import { KNOWN_TRAILS } from "@/scripts/data/knownTrails";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Href, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [isNav, setIsNav] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const [sheetIndex, setSheetIndex] = useState(-1);

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
        onTrailSelect={(trail) =>
          console.log(`Pressed: ${trail.name} ${trail.score}`)
        }
      />

      <Pressable onPress={() => handleNav("/pref")} style={styles.leftIcon}>
        <MaterialIcons name="menu" size={48} color="#333" />
      </Pressable>

      <Pressable onPress={() => handleNav("/fav")} style={styles.rightIcon}>
        <Svg
          width={48}
          height={48}
          fill="#F7E88D"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <Path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </Svg>
        {/* <Star size={48} color={"#000000"} fill={"#F7E88D"} /> */}
        {/* <MaterialIcons name="star" size={48} color="#333" /> */}
      </Pressable>

      <TouchableOpacity
        onPress={() => setSheetIndex(0)}
        style={styles.recButton}
      >
        <Text style={styles.buttonText}>Recommend</Text>
      </TouchableOpacity>

      <Pressable onPress={() => setSheetIndex(0)} style={styles.dateButton}>
        <Text style={styles.buttonText}>Date View</Text>
      </Pressable>

      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndex}
        onChange={setSheetIndex}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#fffade" }}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>More Info</Text>
          <Text>awdwadawdawdawd</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

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
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: "center",
    position: "absolute",
    bottom: height * 0.07,
    left: width * 0.07,
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
    fontSize: 16,
    minWidth: 120,
    fontFamily: "JetBrainsMono-Bold",
    textAlign: "center",
  },
  sheetContent: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 32,
    fontFamily: "JetBrainsMono-Bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
