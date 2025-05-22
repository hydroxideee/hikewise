import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const itemHeight = screenHeight * 0.3;

export default function FavScreen() {
  const router = useRouter();

  const favourites = ['Trail 1', 'Trail 2', 'Trail 3', 'Trail etc'];

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
            <Text style={styles.itemText}>{item}</Text>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },

  itemText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
