import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ScrollView as RNScrollView } from 'react-native';
import app from '../firebaseConfig';
import Button from '@/components/Button';
import { MaterialIcons } from '@expo/vector-icons';

export default function ListingScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
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
          const sellerRef = doc(db, 'users', docSnap.data().userRef);
          const sellerSnap = await getDoc(sellerRef);
          const photosSnap = await getDocs(photosQuery);
          setPhotos(photosSnap.docs.map(d => d.data().url));
          setSeller(sellerSnap.data())
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [id]);

  if (loading) {
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
      <View style={styles.descriptionContainer}>
        <View style={{ flexDirection: 'row', marginBottom: 16, }}>
          <View style={{ backgroundColor: '#555', width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 18, }}>
            <MaterialIcons name='person' size={24} color='#fff' />
          </View>
          <View style={{ marginLeft: 8, }}>
            <Text style={{ fontFamily: 'Inter_500Medium' }}>{seller.name}</Text>
          </View>
        </View>
        <Text style={styles.name}>{listing.name}</Text>
        <Text style={styles.category}>{listing.category} / {listing.subcategory}</Text>
        <Text style={styles.price}>{(listing.price / 100).toFixed(2)} €</Text>
        <Text style={styles.description}>{listing.description}</Text>
        <Button title='Teirautis' />
      </View>
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
    backgroundColor: '#ffffff',
    // flex: 1,
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    // width: 200,
    height: 400,
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
  descriptionContainer: {
    padding: 16,
    flex: 1,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontFamily: 'Inter_500Medium',
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