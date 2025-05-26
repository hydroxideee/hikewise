import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StorageContext } from '/context/StorageContext';

const screenHeight = Dimensions.get('window').height;
const itemHeight = screenHeight * 0.3;

export default function FavScreen() {
  const router = useRouter();
  const { favorites, setFavorites } = useContext(StorageContext);

  const handleRemove = (indexToRemove: number) => {
    const updated = favorites.filter((_, i) => i !== indexToRemove);
    setFavorites(updated); // Updates context and AsyncStorage
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={48} color="#333" />
        </Pressable>
        <Text style={styles.heading}>Favourites</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {favorites.map((item, index) => (
          <View key={index} style={[styles.itemBox, { height: itemHeight }]}>
            {/* Remove Button */}
            <Pressable style={styles.removeButton} onPress={() => handleRemove(index)}>
              <MaterialIcons name="close" size={36} color="#444" />
            </Pressable>

            {/* Text Content */}
            <View style={styles.textContent}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.subheadText}>{item.distance}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>

              <Pressable style={styles.mapButton} onPress={() => {/* view on map logic */}}>
                <MaterialIcons name="map" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.mapButtonText}>View on Map</Text>
              </Pressable>
            </View>

            {/* Placeholder Image */}
            <View style={styles.imageContainer}>
              <View style={styles.placeholderImage}>
                <Text style={{ color: '#000' }}>Image</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffade',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontFamily: 'JetBrainsMono-Bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  itemBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 22,
    fontWeight: '700',
  },
  subheadText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    flexShrink: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
   width: 130,
   height: 130,
   marginLeft: 15,
   marginTop: 40,
   borderRadius: 10,
   overflow: 'hidden',
  },
  placeholderImage: {
   flex: 1,
   backgroundColor: '#ccc',
   justifyContent: 'center',
   alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
