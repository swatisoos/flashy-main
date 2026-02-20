"use server";

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { FlashcardSet } from "@/types/flashcard-set";
import { db, deleteQueryBatch } from "@/lib/firebase/firebase";
import { getFlashcards } from "@/actions/flashcard-actions";
import { getUserById } from "./login-actions";
import { User } from "@/types/user-type";
import { getComments } from "./comment-actions";

/**
 * Gets a flashcard set by its id
 * @param id the id of the flashcard set
 * @returns a promise that resolves to the flashcard set
 */
export const getFlashcardSet = async (id: string): Promise<FlashcardSet> => {
  const docRef = doc(db, "sets", id);
  const snapshot = await getDoc(docRef);

  const data = snapshot.data();
  if (data === undefined) {
    throw new Error("Flashcard set not found");
  }

  const flashcards = await getFlashcards(id);
  const comments = await getComments(id);

  return {
    id: snapshot.id,
    name: data.name,
    createdBy: data.createdBy,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    likes: data.likes,
    tags: data.tags,
    flashcards: flashcards,
    comments: comments,
    canEdit: data.canEdit || [],
  } as FlashcardSet;
};

/**
 * Gets all flashcard sets created by or shared with a user
 * @param userId the id of the user
 * @returns a promise that resolves to an array of flashcard sets
 */
export const getFlashcardSets = async (
  userId: string,
): Promise<FlashcardSet[]> => {
  const createdByQuery = query(
    collection(db, "sets"),
    where("createdBy", "==", userId),
  );
  const canEditQuery = query(
    collection(db, "sets"),
    where("canEdit", "array-contains", userId),
  );

  // const sets: FlashcardSet[] = [];
  const createdByResults = await getDocs(createdByQuery);
  const canEditResults = await getDocs(canEditQuery);

  const results = new Map<string, QueryDocumentSnapshot>();
  createdByResults.forEach((doc) => {
    results.set(doc.id, doc);
  });

  canEditResults.forEach((doc) => {
    if (!results.has(doc.id)) {
      results.set(doc.id, doc);
    }
  });
  return Array.from(results.values()).map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    createdBy: doc.data().createdBy,
    likes: doc.data().likes,
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    tags: doc.data().tags,
    flashcards: [],
    comments: [],
    canEdit: doc.data().canEdit || [],
  }));
};

/**
 * Gets all flashcard sets saved by a user
 * @param userId the id of the user
 * @returns a promise that resolves to an array of flashcard sets
 */
export const getSavedFlashcardSets = async (
  userId: string,
): Promise<FlashcardSet[]> => {
  const user = await getUserById(userId);

  if (user.favourites === undefined) {
    return [];
  }

  const sets: FlashcardSet[] = [];
  for (let i = 0; i < user.favourites.length; i++) {
    const q = query(
      collection(db, "sets"),
      where("Id", "==", user.favourites[i]),
    );

    const docRef = doc(db, "sets", user.favourites[i]);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("No such document!");
    }

    sets.push({
      id: snapshot.id,
      ...snapshot.data(),
    } as FlashcardSet);
  }
  return sets;
};

/**
 * Edits the visibility to be public or private
 * @param id the id of the flashcard set
 * @param isPublic if set should be public or not
 */
export const updateVisibility = async (
  id: string,
  publicSet: string,
  isPublic: boolean,
): Promise<void> => {
  const docRef = doc(db, "sets", id);

  await updateDoc(docRef, {
    [publicSet]: isPublic,
  } as any);
};

/**
 * Deletes a flashcard set and it's flashcards from the database
 * @param id the id of the flashcard set
 */
export const deleteFlashcardSet = async (id: string): Promise<void> => {
  const docRef = doc(db, "sets", id);
  const cardsRef = collection(db, "sets", id, "cards");

  await deleteQueryBatch(db, cardsRef);
  await deleteDoc(docRef);
};

/**
 *
 * @param name name of the new flascard set
 * @returns
 */
export const createFlashCardSet = async (name: string, userId: string) => {
  const docRef = collection(db, "sets");
  const doc = await addDoc(docRef, {
    name,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    publicSet: true,
  });
  return doc.id;
};

/**
 * Gets all flashcard sets from the database
 * @returns a promise that resolves to all flashcard sets
 */
export const getAllPublicSets = async (): Promise<FlashcardSet[]> => {
  const q = query(collection(db, "sets"), where("publicSet", "==", true));
  const snapshot = await getDocs(q);
  const res = snapshot.docs.map(async (document) => {
    const userRef = doc(db, "users", document.data().createdBy);
    const userSnapshot = await getDoc(userRef);

    return {
      id: document.id,
      name: document.data().name,
      createdBy:
        (userSnapshot.data() as any)?.name || document.data().createdBy,
      likes: document.data().likes,
      createdAt: document.data().createdAt.toDate(),
      updatedAt: document.data().updatedAt.toDate(),
      tags: document.data().tags,
      flashcards: [],
      comments: [],
      canEdit: document.data().canEdit || [],
    } as FlashcardSet;
  });

  return await Promise.all(res);
};

/**
 * Adds a flashcard set to the user's favourites
 * @param userId the id of the user
 * @param setId the id of the flashcard set
 */
export const addFavourite = async (userId: string, setId: string) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    favourites: arrayUnion(setId),
  });
};

/**
 * Removes a flashcard set from the user's favourites
 * @param userId the id of the user
 * @param setId the id of the flashcard set
 */
export const removeFavourite = async (userId: string, setId: string) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    favourites: arrayRemove(setId),
  });
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No such user!");
  }

  const userDoc = querySnapshot.docs[0];

  return {
    id: userDoc.id,
    ...userDoc.data(),
  } as User;
};

export const addCanEdit = async (email: string, setId: string) => {
  const user = await getUserByEmail(email);

  const docRef = doc(db, "sets", setId);
  await updateDoc(docRef, {
    canEdit: arrayUnion(user.id),
  });
};

export const addLikedSet = async (userId: string, setId: string) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    likedSets: arrayUnion(setId),
  });

  const setRef = doc(db, "sets", setId);
  await updateDoc(setRef, {
    likes: increment(1),
  });
};

export const removeLikedSet = async (userId: string, setId: string) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    likedSets: arrayRemove(setId),
  });

  const setRef = doc(db, "sets", setId);
  await updateDoc(setRef, {
    likes: increment(-1),
  });
};

export const setFlashCardSetTags = async (
  id: string,
  tags: string[],
): Promise<void> => {
  const docRef = doc(db, "sets", id);
  return await updateDoc(docRef, {
    tags: tags,
  } as any);
};
