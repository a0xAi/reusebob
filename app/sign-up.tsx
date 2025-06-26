import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from '../firebaseConfig';
import { useSession } from '../ctx';
import { createUser } from '../database/user';

export default function SignUp() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('1st@reusebob.com');
  const [password, setPassword] = useState('123123123');
  const [error, setError] = useState(null);
  const auth = getAuth(app);
  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        signIn(user.uid);
        createUser(user.uid, email);
        router.replace('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
      });
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder='email' value={email} onChangeText={(text) => setEmail(text)} />
      <TextInput placeholder='password' value={password} onChangeText={(text) => setPassword(text)} />
      <Text
        onPress={() => {
          signup();
          router.replace('/');
        }}>
        Sign Up
      </Text>
      {error && (<Text>{error}</Text>)}
      <Text
        onPress={() => {
          signup();
          router.replace('/sign-in');
        }}>
        Back to login
      </Text>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});