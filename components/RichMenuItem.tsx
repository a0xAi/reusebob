import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RichMenuItem = ({ name }) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.photo}>
          <Text style={styles.photoText}>A</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtext}>Peržiūrėti profilį</Text>
      </View>
      <View>
        <MaterialIcons size={28} name="chevron-right" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
  },
  photo: {
    backgroundColor: '#555555',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoText: {
    color: '#ffffff',
    fontFamily: 'Inter_900Black',
    fontSize: 20,
  },
  textContainer: {
    paddingHorizontal: 8,
    marginRight: 'auto',
  },
  name: {
    fontFamily: 'Inter_700Bold',
  },
  subtext: {
    fontFamily: 'Inter_500Medium',
  },
});

export default RichMenuItem;