import app from '../firebaseConfig';
import { getFirestore, getDoc, setDoc, doc, } from "firebase/firestore";

const db = getFirestore(app);

export const createUser = async (id, email, name) => {
  try {
    const userRef = doc(db, 'users', id)
    await setDoc(userRef, {
      email: email,
      name: name,
      createdAt: new Date()
    })

    console.log("Document written with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const getUserByID = async (id) => {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
    return null;
  }
}
