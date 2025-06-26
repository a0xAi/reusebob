import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../ctx';
import app from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
      <TextInput style={styles.textInput} placeholder='email' value={email} onChangeText={(text) => setEmail(text)} />
      <TextInput style={styles.textInput} placeholder='password' value={password} onChangeText={(text) => setPassword(text)} />
      {error && (<Text style={styles.error}>{error}</Text>)}
      <TouchableOpacity style={styles.button}
        onPress={() => {
          login();
        }}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}
        onPress={() => {
          router.replace('/sign-up');
        }}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbbbbb',
  },
  textInput: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 8,
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
    color: '#ffffff',
  },
});