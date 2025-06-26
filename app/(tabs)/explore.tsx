import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { getAllListings } from '../../database/listing';

export default function ExploreScreen() {
  const [listings, setListings] = useState([]);

  const loadListings = async () => {
    const listingsRaw = await getAllListings()
    setListings(listingsRaw);
  }

  useEffect(() => {
    loadListings()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Explore here</Text>
      <View>
        {listings.map((listing, key) => (
          <View style={styles.listing}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Photo</Text>
            </View>
            <View style={{ paddingHorizontal: 8, }}>
              <Text>{listing.name}</Text>
              <Text>{(listing.price / 100).toFixed(2)} €</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    padding: 16,
  },
  listing: {
    padding: 8,
    flexDirection: 'row'
  },
  photoPlaceholder: {
    backgroundColor: '#555555',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  photoPlaceholderText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
});