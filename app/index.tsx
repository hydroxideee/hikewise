import React, { useState, useMemo, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [isNav, setIsNav] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['40%', '100%'], []);

  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + 14);
    return max;
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleNav = (path: string) => {
    if (isNav) return;
    setIsNav(true);
    router.push(path);
    setTimeout(() => setIsNav(false), 500);
  };

  const openSheet = () => {
    sheetRef.current?.snapToIndex(0); // open at 40%
  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleNav('/pref')} style={styles.leftIcon}>
        <MaterialIcons name="menu" size={48} color="#333" />
      </Pressable>

      <Pressable onPress={() => handleNav('/fav')} style={styles.rightIcon}>
        <MaterialIcons name="star" size={48} color="#333" />
      </Pressable>

      <Pressable onPress={openSheet} style={styles.recButton}>
        <Text style={styles.buttonText}>Recommend</Text>
      </Pressable>

      <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.buttonText}>Date: {formatDate(date)}</Text>
      </Pressable>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        keyboardBehavior="interactive"
        enableContentPanningGesture={true}
        backgroundStyle={{ backgroundColor: '#f0f0f0' }}       >
        <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.sheetTitle}>Trail Name</Text>
          <Text style={styles.text}>Add details here: </Text>
        </BottomSheetScrollView>
      </BottomSheet>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffade',
  },
  leftIcon: {
    padding: 10,
    position: 'absolute',
    top: height * 0.04,
    left: width * 0.05,
  },
  rightIcon: {
    padding: 10,
    position: 'absolute',
    top: height * 0.04,
    right: width * 0.05,
  },
  recButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: height * 0.07,
    left: width * 0.07,
    minWidth: 100,
  },
  dateButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: height * 0.07,
    right: width * 0.07,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    minWidth: 100,
    fontFamily: 'JetBrainsMono-Bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'JetBrainsMono-Bold',
    marginBottom: 20,
  },
});
