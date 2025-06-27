import app from '../firebaseConfig';
import { getFirestore, getDoc, setDoc, doc, docs, collection, getDocs, } from "firebase/firestore";

const db = getFirestore(app);

export const getAllChats = async () => {
  const chatsCollectionRef = collection(db, 'chats');
  const chatsSnap = await getDocs(chatsCollectionRef);
  const chats = [];
  for (const docSnap of chatsSnap.docs) {
    const id = docSnap.id;
    const data = docSnap.data();
    let seller = null;
    if (data.sellerRef) {
      const sellerSnap = await getDoc(data.sellerRef);
      if (sellerSnap.exists()) {
        seller = { id: sellerSnap.id, ...sellerSnap.data() };
      }
    }
    let buyer = null;
    if (data.buyerRef) {
      const buyerSnap = await getDoc(data.buyerRef);
      if (buyerSnap.exists()) {
        buyer = { id: buyerSnap.id, ...buyerSnap.data() };
      }
    }
    let listing = null;
    if (data.listingRef) {
      const listingSnap = await getDoc(data.listingRef);
      if (listingSnap.exists()) {
        listing = { id: listingSnap.id, ...listingSnap.data() };
      }
    }
    console.log({ id, ...data, seller, buyer, listing })
    chats.push({ id, ...data, seller, buyer, listing });
  }
  return chats;
}


// export const createUser = async (id, email, name) => {
//   try {
//     const userRef = doc(db, 'users', id)
//     await setDoc(userRef, {
//       email: email,
//       name: name,
//       createdAt: new Date()
//     })

//     console.log("Document written with ID: ", id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

// export const getUserByID = async (id) => {
//   const docRef = doc(db, 'users', id);
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     return { id: docSnap.id, ...docSnap.data() };
//   } else {
//     console.log("No such document!");
//     return null;
//   }
// }
