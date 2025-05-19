import { View, Button, StyleSheet, Pressable} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push('/pref')} style={styles.leftIcon}>
        <MaterialIcons name="menu" size={48} color="#333" />
      </Pressable>

      <Pressable onPress={() => router.push('/fav')} style={styles.rightIcon}>
         <MaterialIcons name="star" size={48} color="#333" />
      </Pressable>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffade',
  },
  leftIcon: {
    padding: 10,
    position: 'absolute',
    top: 30,
    left: 20,
  },
  rightIcon: {
    padding: 10,
    position: 'absolute',
    top: 30,
    right: 20,
  },
});
