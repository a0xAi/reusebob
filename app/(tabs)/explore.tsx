import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { getAllListings, getListingsBySubcategory } from '../../database/listing';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Search from '@/components/Search';

const ListingImage = ({ uri }: { uri: string }) => {
  const [loading, setLoading] = useState(true);
  return (
    <View style={styles.imageWrapper}>
      {loading && (
        <ActivityIndicator style={styles.imageLoader} size="small" color="#888" />
      )}
      <Image
        source={{ uri }}
        style={styles.cardImage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

export default function ExploreScreen() {
  const { width } = Dimensions.get('window');
  const [listings, setListings] = useState([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { subcategory } = useLocalSearchParams();

  const loadListings = async () => {
    if (subcategory) {
      const filtered = await getListingsBySubcategory(subcategory);
      setListings(filtered);
    } else {
      const all = await getAllListings();
      setListings(all);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    setRefreshing(false);
  };

  useEffect(() => {
    loadListings();
  }, [subcategory]);

  return (
    <SafeAreaView style={styles.container}>
      <Search />
      {subcategory && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>
            Filtruojama pagal: <Text style={styles.filterValue}>{subcategory}</Text>
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => router.push('/explore')}
          >
            <Text style={styles.clearButtonText}>Išvalyti</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={listings}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: (width - 48) / 2 }]}
            onPress={() => router.push(`/listing?id=${item.id}`)}
          >
            <View>
              {item.photos && item.photos.length > 0 ? (
                <ListingImage uri={item.photos[0]} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.description}
            </Text>
            <Text style={styles.cardPriceMain}>
              {(item.price / 100).toFixed(2)} €
            </Text>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
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
  imageWrapper: {
    width: '100%',
    height: 240,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoader: {
    position: 'absolute',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  likeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  likeCount: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
    marginTop: 2,
  },
  cardPriceMain: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
    marginTop: 4,
  },
  cardPriceSecondary: {
    fontSize: 12,
    color: '#007AFF',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterValue: {
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});