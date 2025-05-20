// app/fav.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function FavScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
         <Pressable onPress={() => router.back()} style={styles.backButton}>
           <MaterialIcons name="arrow-back" size={48} color="#333" />
         </Pressable>
        <Text style={styles.heading}>Favourites</Text>
        {/* Empty view to balance spacing */}
        <View style={styles.backButton} />
      </View>

      {/* Add more favourites content below here */}
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
});
