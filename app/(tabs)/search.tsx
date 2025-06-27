import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import categories from '@/constants/categories';

export default function SearchScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const topCategories = categories.map(c => c.name);
  const subcategories = selectedCategory
    ? categories
      .find(c => c.name === selectedCategory)
      ?.subcategories
      .map(sc => (typeof sc === 'string' ? sc : sc.name)) || []
    : [];

  return (
    <View style={styles.container}>
      {selectedCategory === null ? (
        <FlatList
          data={topCategories}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={styles.text}>{item}</Text>
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
                <Text style={styles.text}>{item}</Text>
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
});