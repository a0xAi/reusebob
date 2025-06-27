import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ScrollView as RNScrollView } from 'react-native';
import app from '../../firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '@/components/Button';

export default function ListingScreen() {
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [seller, setSeller] = useState(null);
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');

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
          const sellerRef = doc(db, 'users', listing.userRef);
          const sellerSnap = await getDoc(sellerRef);
          const photosSnap = await getDocs(photosQuery);
          setPhotos(photosSnap.docs.map(d => d.data().url));
          setSeller(sellerSnap.data())
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
        <>
          <RNScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveIndex(idx);
            }}
            scrollEventThrottle={16}
            style={styles.photosContainer}
          >
            {photos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={[styles.image, { width }]} />
            ))}
          </RNScrollView>
          <Text>{JSON.stringify(seller)}</Text>
          <View style={styles.dots}>
            {photos.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex && styles.dotActive
                ]}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.name}>{listing.name}</Text>
      <Text style={styles.category}>{listing.category}</Text>
      <Text style={styles.price}>{(listing.price / 100).toFixed(2)} €</Text>
      <Text style={styles.description}>{listing.description}</Text>
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
  badgesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf4fc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#333',
  },
  shippingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcebea',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 4,
    marginBottom: 12,
  },
  shippingText: {
    marginLeft: 6,
    color: '#c0392b',
    fontSize: 14,
  },
  buyerProtection: {
    fontSize: 14,
    color: '#2c3e50',
    marginTop: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  outlineButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  solidButton: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#333',
  },
});