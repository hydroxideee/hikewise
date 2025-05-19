import { View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top-left button */}
      <View style={styles.topLeft}>
        <Button title="Pref" onPress={() => router.push("/pref")} />
      </View>

      {/* Top-right button */}
      <View style={styles.topRight}>
        <Button title="Fav" onPress={() => router.push("/fav")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffade", // White background
  },
  topLeft: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  topRight: {
    position: "absolute",
    top: 50,
    right: 20,
  },
});
