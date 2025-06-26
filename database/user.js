import app from '../firebaseConfig';
import { getFirestore, collection, addDoc, setDoc, doc, } from "firebase/firestore";

const db = getFirestore(app);

export const createUser = async (id, email) => {
  try {
    const userRef = doc(db, 'users', id)
    await setDoc(userRef, {
      email: email,
      createdAt: new Date()
    })

    console.log("Document written with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}