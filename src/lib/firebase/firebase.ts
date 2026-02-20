import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  Firestore,
  getDocs,
  getFirestore,
  Query,
  runTransaction,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { createUser } from "@/actions/login-actions";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export async function deleteQueryBatch(db: Firestore, query: Query) {
  const snapshot = await getDocs(query);

  await runTransaction(db, async (transaction) => {
    snapshot.docs.forEach((doc) => transaction.delete(doc.ref));
  });
}

/**
 * Logs in a user with email and password
 * @param data email and password
 */
export const login = async (data: { email: string; password: string }) => {
  await signInWithEmailAndPassword(auth, data.email, data.password);
};

/**
 * Signs up a user with email and password
 * @param data email and password
 */
export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const userSession = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password,
  );
  await createUser(userSession.user.uid, data.email, data.name);
};
