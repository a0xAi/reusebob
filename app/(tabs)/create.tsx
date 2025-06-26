import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../firebaseConfig';
import { Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Button from '@/components/Button';
import { createListing } from '../../database/listing';
import { useSession } from '../../ctx';

export default function CreateScreen() {
  const [name, setName] = useState('Test item' + Date.now());
  const [price, setPrice] = useState('9999');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [categories] = useState(['Electronics', 'Books', 'Clothing']);
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    const cancelled = (result as any).cancelled ?? (result as any).canceled;
    const uri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
    if (!cancelled && uri) {
      setPhoto(uri);
    }
  };
  const { session } = useSession();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const create = async () => {
    let photoUrl: string | null = null;
    if (photo) {
      const response = await fetch(photo);
      const blob = await response.blob();
      const storage = getStorage(app);
      const photoRef = ref(storage, `images/${session.uid}_${Date.now()}`);
      await uploadBytes(photoRef, blob);
      photoUrl = await getDownloadURL(photoRef);
    }
    createListing(
      session,
      name,
      price,
      description,
      parseInt(quantity, 10),
      category,
      photoUrl,
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.title}>Create Listing</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            {categories.map(cat => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>


          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>Tap to add photo</Text>
            )}
          </TouchableOpacity>

          <Button title="Create" onPress={create} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  scrollView: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePicker: {
    height: 180,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#888',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});