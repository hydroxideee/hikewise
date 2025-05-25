import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const itemHeight = screenHeight * 0.3;

export default function FavScreen() {
  const router = useRouter();

  const favourites = [
    { name: 'Trail 1', distance: '4 km from me', description: 'A scenic trail with beautiful views.' },
    { name: 'Trail 2', distance: '7 km from me', description: 'Moderate difficulty, good for a quick hike.' },
    { name: 'Trail 3', distance: '2 km from me', description: 'Easy walk along the river.' },
    { name: 'Trail etc', distance: '5 km from me', description: 'Popular spot with picnic areas.' },
  ];

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
        {favourites.map((item, index) => (
          <View key={index} style={[styles.itemBox, { height: itemHeight }]}>
            {/* Text content on the left */}
            <View style={styles.textContent}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.subheadText}>{item.distance}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>

              <Pressable style={styles.mapButton} onPress={() => { /* your handler */ }}>
                <MaterialIcons name="map" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.mapButtonText}>View on Map</Text>
              </Pressable>

            </View>

            {/* Image on the right */}
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
    flexDirection: 'row', // Horizontal layout for text + image
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
   width: 130,  // equal width and height for square shape
   height: 130,
   marginLeft: 15,
   borderRadius: 10,
   overflow: 'hidden',
  },
  placeholderImage: {
   flex: 1,
   backgroundColor: '#ccc',
   justifyContent: 'center',
   alignItems: 'center',
  },
});
