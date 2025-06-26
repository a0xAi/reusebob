import app from '../firebaseConfig';
import { getFirestore, collection, addDoc, getDocs, } from "firebase/firestore";

const db = getFirestore(app);

export const createListing = async (
  userRef,
  name,
  price,
  description,
  quantity,
  category,
  photoUrl,
) => {
  try {
    console.log({
      userRef,
      name,
      price,
      description,
      quantity,
      category,
      photoUrl,
      sold: false,
    })
    const docRef = await addDoc(collection(db, "listings"), {
      userRef,
      name,
      price,
      description,
      quantity,
      category,
      photoUrl,
      sold: false,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const getAllListings = async () => {
  const querySnapshot = await getDocs(collection(db, "listings"));
  const listings = [];
  querySnapshot.forEach((doc) => {
    listings.push({ id: doc.id, ...doc.data() });
  });
  return listings;
}