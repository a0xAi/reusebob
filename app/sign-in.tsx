import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, TextInput } from 'react-native';
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput placeholder='email' value={email} onChangeText={(text) => setEmail(text)} />
      <TextInput placeholder='password' value={password} onChangeText={(text) => setPassword(text)} />
      {error && (<Text>{error}</Text>)}
      <Text
        onPress={() => {
          login();
        }}>
        Sign In
      </Text>
      <Text
        onPress={() => {
          router.replace('/sign-up');
        }}>
        Sign up
      </Text>
    </View>
  );
}