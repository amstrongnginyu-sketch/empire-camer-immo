import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export type UserItem = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: any;
};

export async function getAllUsers(): Promise<UserItem[]> {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      name: data.name || data.displayName || "Utilisateur",
      email: data.email || "",
      phone: data.phone || "",
      role: data.role || "user",
      status: data.status || "active",
      createdAt: data.createdAt || null,
    };
  });
}

export async function promoteUserToAgency(userId: string) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    role: "agency",
    updatedAt: new Date(),
  });
}

export async function suspendUser(userId: string) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    status: "suspended",
    updatedAt: new Date(),
  });
}

export async function activateUser(userId: string) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    status: "active",
    updatedAt: new Date(),
  });
}