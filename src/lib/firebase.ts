import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

export { auth, app, db };

export async function getScholarships() {
  const db = getFirestore(app);
  const querySnapshot = await getDocs(collection(db, "scholarships"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getUserProfile(uid: string) {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  return snapshot.exists()
    ? { success: true, data: snapshot.data() }
    : { success: false };
}

export async function updateUserProfile(uid: string, data: any) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
}

export async function saveScholarship(uid: string, scholarship: any) {
  const docRef = doc(db, "users", uid, "saved_scholarships", scholarship.id);
  await setDoc(docRef, scholarship);
}

export async function unsaveScholarship(uid: string, scholarshipId: string) {
  const docRef = doc(db, "users", uid, "saved_scholarships", scholarshipId);
  await deleteDoc(docRef);
}

export async function getSavedScholarships(uid: string) {
  const colRef = collection(db, "users", uid, "saved_scholarships");
  const snap = await getDocs(colRef);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function isScholarshipSaved(uid: string, scholarshipId: string) {
  const docRef = doc(db, "users", uid, "saved_scholarships", scholarshipId);
  const snap = await getDoc(docRef);
  return snap.exists();
}

// export function toggleSave(
//   scholarship: any,
//   user: any,
//   savedScholarships: any,
//   setSavedScholarships: any
// ) {
//   if (!user) return;
//   if (savedScholarships.includes(scholarship.id)) {
//     unsaveScholarship(user.uid, scholarship.id);
//     setSavedScholarships((prev: any) =>
//       prev.filter((id: any) => id !== scholarship.id)
//     );
//   } else {
//     saveScholarship(user.uid, scholarship);
//     setSavedScholarships((prev: any) => [...prev, scholarship.id]);
//   }
// }
