import { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TextInput, Button } from 'react-native';
import { createListing } from '../../database/listing';
import { useSession } from '../../ctx';

export default function CreateScreen() {
  const [name, setName] = useState('Test item' + Date.now());
  const [price, setPrice] = useState('9999');
  const { session } = useSession();
  const create = () => {
    createListing(session, name, price);
  }

  return (
    <SafeAreaView>
      <Text>Create listing</Text>
      <TextInput placeholder='name' value={name} onChangeText={(text) => setName(text)} />
      <TextInput placeholder='price' value={price} onChangeText={(text) => setPrice(text)} />
      <Button onPress={create} title='Create' />
    </SafeAreaView>
  );
}