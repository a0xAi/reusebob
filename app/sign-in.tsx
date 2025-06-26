import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../ctx';
import app from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from '@/components/Button';

export default function SignIn() {
  const { signIn } = useSession();
  const auth = getAuth(app);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        signIn(user.uid);
        router.replace('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ': ' + errorMessage)
        setError(errorCode)
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ReuseBob</Text>
      <TextInput style={styles.textInput} placeholderTextColor='#444' placeholder='El. paštas' value={email} onChangeText={(text) => setEmail(text)} />
      <TextInput style={styles.textInput} laceholderTextColor='#444' placeholder='Slaptažodis' value={password} onChangeText={(text) => setPassword(text)} />
      {error && (<Text style={styles.error}>{error}</Text>)}
      <Button
        onPress={() => {
          login();
        }}
        title='Prisijungti'
        small={false}
      />

      <TouchableOpacity
        onPress={() => {
          router.replace('/sign-up');
        }}>
        <Text style={styles.buttonText}>Registracija</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 32,
    marginVertical: 32,
    fontFamily: 'Inter_900Black',
  },
  textInput: {
    fontFamily: 'Inter_500Medium',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 8,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: '#dddddd',
  },
  error: {
    color: '#ff0000',
  },
  button: {
    backgroundColor: '#333333',
    width: '100%',
    padding: 32,
    marginBottom: 16,
  },
  buttonText: {
    color: '#333333',
    fontWeight: 'bold',
    marginVertical: 32,
  },
});