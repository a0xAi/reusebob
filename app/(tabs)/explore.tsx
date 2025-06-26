import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity } from 'react-native';
import { getAllListings } from '../../database/listing';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const [listings, setListings] = useState([]);
  const router = useRouter();

  const loadListings = async () => {
    const listingsRaw = await getAllListings()
    setListings(listingsRaw);
  }

  useEffect(() => {
    loadListings()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/listing?id=${item.id}`)}
          >
            {item.photoUrl ? (
              <Image source={{ uri: item.photoUrl }} style={styles.thumbnail} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
              <Text style={styles.quantity}>In stock: {item.quantity}</Text>
              <Text style={styles.price}>{(item.price / 100).toFixed(2)} €</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    paddingHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 120,
    height: 120,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  cardContent: {
    flex: 1,
    padding: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginVertical: 2,
  },
  quantity: {
    fontSize: 12,
    color: '#888',
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});