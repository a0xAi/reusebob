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
  const [email, setEmail] = useState('1st@reusebob.com');
  const [password, setPassword] = useState('123123123');
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
      <TextInput style={styles.textInput} placeholder='email' value={email} onChangeText={(text) => setEmail(text)} />
      <TextInput style={styles.textInput} placeholder='password' value={password} onChangeText={(text) => setPassword(text)} />
      {error && (<Text style={styles.error}>{error}</Text>)}
      <Button
        onPress={() => {
          login();
        }}
        title='Sign in'
        small={false}
      />

      <TouchableOpacity
        onPress={() => {
          router.replace('/sign-up');
        }}>
        <Text style={styles.buttonText}>Sign up</Text>
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
  },
  textInput: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#aaaaaa',

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