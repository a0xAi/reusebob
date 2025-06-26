import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from '../firebaseConfig';
import { useSession } from '../ctx';
import { createUser } from '../database/user';
import Button from '@/components/Button';

export default function SignUp() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        const errorMessage = error.message;
        setError(errorCode)
      });
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} placeholderTextColor='#444' placeholder='El. paštas' value={email} onChangeText={(text) => setEmail(text)} />
      <TextInput style={styles.textInput} placeholderTextColor='#444' placeholder='Slaptažodis' value={password} onChangeText={(text) => setPassword(text)} />
      <Button title="Registruotis" onPress={() => {
        signup();
        router.replace('/');
      }} />
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
});