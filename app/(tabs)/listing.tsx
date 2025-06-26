import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ScrollView as RNScrollView } from 'react-native';
import app from '../../firebaseConfig';

export default function ListingScreen() {
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        const db = getFirestore(app);
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
          const photosQuery = query(
            collection(db, 'photos'),
            where('listingRef', '==', id)
          );
          const photosSnap = await getDocs(photosQuery);
          setPhotos(photosSnap.docs.map(d => d.data().url));
        }
      };
      fetchListing();
    }
  }, [id]);

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {photos.length > 0 ? (
        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosContainer}
        >
          {photos.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.image} />
          ))}
        </RNScrollView>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.name}>{listing.name}</Text>
      <Text style={styles.category}>{listing.category}</Text>
      <Text style={styles.price}>{(listing.price / 100).toFixed(2)} €</Text>
      <Text style={styles.description}>{listing.description}</Text>
      <Text style={styles.quantity}>Quantity: {listing.quantity}</Text>
      <View
        style={[styles.colorSwatch, { backgroundColor: listing.color }]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#888',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
});