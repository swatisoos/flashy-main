"use server";

import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Comment } from "@/types/comment";
import { getUserById } from "./login-actions";

export const getComments = async (id: string): Promise<Comment[]> => {
  const commentsCol = collection(db, "sets", id, "comments");
  const commentsSnapshot = await getDocs(commentsCol);

  const comments = await Promise.all(
    commentsSnapshot.docs.map(async (doc) => {
      const name = (await getUserById(doc.data().createdBy)).name;
      return {
        id: doc.id,
        createdBy: name,
        content: doc.data().content,
      } as Comment;
    }),
  );

  return comments;
};

export const addComment = async (
  userId: string,
  setId: string,
  content: string,
) => {
  const commentsCol = collection(db, "sets", setId, "comments");
  await addDoc(commentsCol, {
    createdBy: userId,
    content: content,
  }).then(() => true);
};
