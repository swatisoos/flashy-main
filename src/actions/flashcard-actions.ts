"use server";

import { Flashcard } from "@/types/flashcard";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import * as z from "zod";
import { CreateFlashcardSchema } from "@/components/sets/create-flashcard-form";

/**
 * Get all flashcards from a set
 * @param set The set id to get flashcards from
 * @returns A list of flashcards
 */
export const getFlashcards = async (set: string): Promise<Flashcard[]> => {
  const flashcardsCol = collection(db, "sets", set, "cards");
  const flashcardsSnapshot = await getDocs(flashcardsCol);

  return flashcardsSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      question: doc.data().question,
      imageQuestionId: doc.data().imageQuestionId,
      answer: doc.data().answer,
    } as Flashcard;
  });
};

/**
 * Create a flashcard
 * @param set The set to add the flashcard to
 * @param data The flashcard data
 */
export const createFlashcard = async (
  set: string,
  data: z.infer<typeof CreateFlashcardSchema>,
): Promise<void> => {
  const flashcardsCol = collection(db, "sets", set, "cards");
  await addDoc(flashcardsCol, data);
};

/**
 * Delete a flashcard
 * @param set The set to delete the flashcard from
 * @param id The id of the flashcard to delete
 */
export const deleteFlashcard = async (
  set: string,
  id: string,
): Promise<void> => {
  const flashcardsCol = collection(db, "sets", set, "cards");
  await deleteDoc(doc(flashcardsCol, id));
};

/**
 * Update a flashcard
 * @param set The set to update the flashcard in
 * @param id The id of the flashcard to update
 * @param data The new flashcard data
 */
export const updateFlashcard = async (
  set: string,
  id: string,
  data: z.infer<typeof CreateFlashcardSchema>,
): Promise<void> => {
  const flashcardsCol = collection(db, "sets", set, "cards");
  await setDoc(doc(flashcardsCol, id), data);
};
