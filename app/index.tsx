import React, { useState } from 'react';
import { View, Button, StyleSheet, Pressable} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const [isNav, setIsNav] = useState(false);

  const handleNav = (path: string) => {
    if (isNav) return;
    setIsNav(true);
    router.push(path);
    setTimeout(() => setIsNav(false), 500);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleNav('/pref')} style={styles.leftIcon}>
        <MaterialIcons name="menu" size={48} color="#333" />
      </Pressable>

      <Pressable onPress={() => handleNav('/fav')} style={styles.rightIcon}>
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
