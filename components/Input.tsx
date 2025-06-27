import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Input = ({ label, value, onChangeText, keyboardType, multiline }) => {
  return (
    <View style={styles.container}>
      {label && (<Text style={styles.label}>{label}</Text>)}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter_500Medium',
    backgroundColor: '#eeeeee',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    borderRadius: 8,
  },
});

export default Input;

