"use server";

import { User } from "@/types/user-type";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { setDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

export const getUserById = async (id: string): Promise<User> => {
  const docRef = doc(db, "users", id!);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("No such document!");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as User;
};

interface formUser {
  name: string;
  password: string;
}

export const editUser = async (UserId: string, data: Partial<formUser>) => {
  const docRef = doc(db, "users", UserId);
  await setDoc(docRef, data, { merge: true });

  if (data.password) {
    const user = auth.currentUser!;
    if (user) {
      await updatePassword(user, data.password);
    }
  }
};

export const createUser = async (id: string, email: string, name: string) => {
  const docRef = doc(db, "users", id);
  await setDoc(
    docRef,
    {
      name: name,
      email: email,
      role: "user",
    },
    { merge: true },
  );
};
