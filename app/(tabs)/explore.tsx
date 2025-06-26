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
    <SafeAreaView>
      <Text>Explore here</Text>
      <View>
        {listings.map((listing, key) => (
          <View>
            <Text>{listing.name}</Text>
            <Text>{listing.price}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}