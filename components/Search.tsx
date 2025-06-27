import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Search = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name='search' size={24} />
      </View>
      <TextInput
        style={styles.input}
        placeholder='Ieškoti'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    // width: '100%',
    borderRadius: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    padding: 8,
  },
  input: {
    fontFamily: 'Inter_500Medium',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
});

export default Search;

