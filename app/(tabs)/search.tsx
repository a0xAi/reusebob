import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllListings } from '../../database/listing';
import categories from '@/constants/categories';

export default function SearchScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const all = await getAllListings();
      setListings(all);
    })();
  }, []);

  const topCategories = categories.map(c => c.name);
  const subcategories = selectedCategory
    ? categories
      .find(c => c.name === selectedCategory)
      ?.subcategories
      .map(sc => (typeof sc === 'string' ? sc : sc.name)) || []
    : [];

  const totalCount = listings.length;
  const categoryCounts: Record<string, number> = {};
  categories.forEach(c => { categoryCounts[c.name] = 0; });
  listings.forEach(l => {
    if (l.category && categoryCounts[l.category] !== undefined) {
      categoryCounts[l.category]++;
    }
  });
  const subCounts: Record<string, number> = {};
  subcategories.forEach(sc => { subCounts[sc] = 0; });
  listings.forEach(l => {
    if (l.category === selectedCategory && l.subcategory && subCounts[l.subcategory] !== undefined) {
      subCounts[l.subcategory]++;
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>Viso skelbimų: {totalCount}</Text>
      {selectedCategory === null ? (
        <FlatList
          data={categories}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => setSelectedCategory(item.name)}
            >
              <Text style={styles.text}>
                {item.name} ({categoryCounts[item.name] || 0})
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.back}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.backText}>← Grįžti atgal</Text>
          </TouchableOpacity>
          <FlatList
            data={subcategories}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  router.push({
                    pathname: '/explore',
                    params: { subcategory: item },
                  })
                }
              >
                <Text style={styles.text}>
                  {item} ({subCounts[item] || 0})
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  list: {
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  back: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    color: '#007AFF',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});