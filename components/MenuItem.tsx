import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MenuItem = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={32} color='#999' />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  subtext: {
    fontFamily: 'Inter_500Medium',
  },
});

export default MenuItem;