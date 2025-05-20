import React, { useState, useRef, useMemo } from 'react';
import { View, Button, StyleSheet, Pressable, Text} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';

export default function Index() {
  const router = useRouter();
  const [isNav, setIsNav] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['25%'],[]);

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

      <Pressable onPress={() => bottomSheetRef.current?.expand()} style={styles.recButton}>
        <Text style={styles.buttonText}>Recommend</Text>
      </Pressable>

      <Pressable onPress={() => bottomSheetRef.current?.expand()} style={styles.dateButton}>
        <Text style={styles.buttonText}>Date View</Text>
      </Pressable>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%']}
        enablePanDownToClose={true}
        backgroundStyle={{backgroundColor:'fffade'}}>
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
  recButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    left: 30,
  },

  dateButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    right: 30,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    minWidth: 120,
    fontFamily: 'JetBrainsMono-Bold',
    textAlign: 'center',
  },

  sheetContent: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 32,
    fontFamily: 'JetBrainsMono-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
