import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../firebaseConfig';
import { Text, View, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { createListing, addPhoto } from '../../database/listing';
import Button from '@/components/Button';
import { useSession } from '../../ctx';

export default function CreateScreen() {
  const [name, setName] = useState('Test item' + Date.now());
  const [price, setPrice] = useState('9999');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('-');
  const [categories] = useState(['Vinys', 'Sraigtai', 'Lentos']);
  const [photos, setPhotos] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    const cancelled = (result as any).cancelled ?? (result as any).canceled;
    const uri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
    if (!cancelled && uri) {
      if (photos.length < 3) {
        setPhotos([...photos, uri]);
      } else {
        alert('You can upload up to 3 photos');
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
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
    // first, create the listing and get its ID
    const listingId = await createListing(
      session,
      name,
      price,
      description,
      parseInt(quantity, 10),
      category
    );
    // then upload each photo to storage and register it in Firestore
    const storage = getStorage(app);
    for (const uri of photos) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const photoRef = ref(storage, `images/${session}_${Date.now()}_${Math.random()}`);
      await uploadBytes(photoRef, blob);
      const url = await getDownloadURL(photoRef);
      await addPhoto(listingId, url);
    }
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
          <Text style={styles.title}>Įkelti prekę</Text>
          <Button
            title="Pasirinkti nuotrauką"
            onPress={pickImage}
          />
          <View style={{ height: 16 }} />
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

          {/* <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            {categories.map(cat => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker> */}

          <View style={styles.photosContainer}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.thumbnail} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Button
            title="Įkelti"
            onPress={create}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  input: {
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
  picker: { height: 150, marginBottom: 12 },
  colorPicker: { height: 200, marginBottom: 12 },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 12
  },
  photosContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16,
  },
});