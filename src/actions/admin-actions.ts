"use server";
import { UserInfo } from "@/components/adminpanel/columns";
import { db } from "@/lib/firebase/firebase";
import { Role } from "@/types/user-type";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const setUserType = async (userEmail: string, userType: Role) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", userEmail));

  const querySnapshot = await getDocs(q);
  await querySnapshot.forEach(async (snapshot) => {
    // doc.data() is never undefined for query doc snapshots
    const userRef = doc(db, "users", snapshot.id);
    await updateDoc(userRef, {
      role: userType,
    });
  });
  return Promise.resolve();
};

export const getAdmins = async () => {
  const q = query(collection(db, "users"), where("role", "==", "admin"));

  const querySnapshot = await getDocs(q);

  const admins: UserInfo[] = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    admins.push({
      email: doc.data().email,
      id: doc.id,
      role: doc.data().role,
    });
  });

  return admins;
};
