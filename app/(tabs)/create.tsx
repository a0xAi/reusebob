import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../firebaseConfig';
import { Text, View, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Modal } from 'react-native';
import { createListing, addPhoto } from '../../database/listing';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useSession } from '../../ctx';
import categories from '../../constants/categories';

export default function CreateScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isCatModalVisible, setCatModalVisible] = useState(false);
  const [modalLevel, setModalLevel] = useState<0 | 1>(0);
  const [modalCategory, setModalCategory] = useState<string | null>(null);

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
      selectedCategory!,
      selectedSubcategory!
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

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => {
              setModalLevel(0);
              setModalCategory(null);
              setCatModalVisible(true);
            }}
          >
            <Text style={styles.categoryButtonText}>
              {selectedCategory
                ? `${selectedCategory} > ${selectedSubcategory}`
                : 'Pasirinkti kategoriją'}
            </Text>
          </TouchableOpacity>

          <Button
            title="Pridėti nuotrauką"
            onPress={pickImage}
          />
          <View style={{ height: 16 }} />
          <Input
            label='Pavadinimas'
            value={name}
            onChangeText={setName}
          />
          <Input
            label='Kaina'
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Input
            label='Aprašymas'
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          /> */}

          {/* <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            {categories.map(cat => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker> */}

          <Button
            title="Įkelti"
            onPress={create}
          />

          {/* Modal category/subcategory selection */}
          <Modal
            visible={isCatModalVisible}
            transparent
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {(() => {
                  // compute cat and subItems above the return
                  const cat = categories.find(c => c.name === modalCategory);
                  const subItems = modalLevel === 0
                    ? categories
                    : cat?.subcategories || [];
                  return (
                    <>
                      {subItems.map(item => {
                        const label = typeof item === 'string' ? item : item.name;
                        return (
                          <TouchableOpacity
                            key={label}
                            style={styles.modalItem}
                            onPress={() => {
                              if (modalLevel === 0) {
                                setModalCategory(label);
                                setModalLevel(1);
                              } else {
                                setSelectedCategory(modalCategory);
                                setSelectedSubcategory(label);
                                setCatModalVisible(false);
                              }
                            }}
                          >
                            <Text style={styles.modalText}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  );
                })()}
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setCatModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Uždaryti</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  categoryButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  modalClose: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
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