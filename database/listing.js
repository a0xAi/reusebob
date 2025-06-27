import app from '../firebaseConfig';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where } from "firebase/firestore";

const db = getFirestore(app);

export const createListing = async (
  userRef,
  name,
  price,
  description,
  quantity,
  category,
  subcategory
) => {
  try {
    console.log({
      userRef,
      name,
      price,
      description,
      quantity,
      category,
      subcategory,
      sold: false,
    })
    const docRef = await addDoc(collection(db, "listings"), {
      userRef: doc(db, 'users', userRef),
      name,
      price,
      description,
      quantity,
      category,
      subcategory,
      sold: false,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const addPhoto = async (listingId, url) => {
  try {
    await addDoc(collection(db, 'photos'), { listingRef: doc(db, 'listings', listingId), url });
  } catch (e) {
    console.error('Error adding photo:', e);
  }
};

export const getAllListings = async () => {
  const db = getFirestore(app);
  const listingsSnap = await getDocs(collection(db, 'listings'));
  const listings = [];
  for (const docSnap of listingsSnap.docs) {
    const id = docSnap.id;
    const data = docSnap.data();
    const photosQuery = query(collection(db, 'photos'), where('listingRef', '==', doc(db, 'listings', id)));
    const photosSnap = await getDocs(photosQuery);
    const photos = photosSnap.docs.map(d => d.data().url);
    listings.push({ id, ...data, photos });
  }
  return listings;
};

export const getListingsBySubcategory = async (subcategory) => {
  const db = getFirestore(app);
  const listingsQuery = query(
    collection(db, 'listings'),
    where('subcategory', '==', subcategory)
  );
  const listingsSnap = await getDocs(listingsQuery);
  const listings = [];
  for (const docSnap of listingsSnap.docs) {
    const id = docSnap.id;
    const data = docSnap.data();
    const photosQuery = query(
      collection(db, 'photos'),
      where('listingRef', '==', doc(db, 'listings', id))
    );
    const photosSnap = await getDocs(photosQuery);
    const photos = photosSnap.docs.map(d => d.data().url);
    listings.push({ id, ...data, photos });
  }
  return listings;
};

export const getListingByID = async (id) => {
  const docRef = doc(db, "listings", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
    return null;
  }
}
