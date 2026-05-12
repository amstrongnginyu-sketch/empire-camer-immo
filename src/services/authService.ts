import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { UserProfile } from "../types/user";
import { cleanPhone } from "../utils/phone";
import { auth, db } from "./firebase";

export function listenAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return {
      uid: user.uid,
      ...(userSnap.data() as Omit<UserProfile, "uid">),
    };
  }

  const newProfile: UserProfile = {
    uid: user.uid,
    name: user.email || "Utilisateur",
    phone: "",
    email: user.email || "",
    role: "user",
    agencyUntil: null,
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);

  return newProfile;
}

export async function registerUser(input: {
  name: string;
  phone: string;
  email: string;
  password: string;
}) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email.trim().toLowerCase(),
    input.password
  );

  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    name: input.name.trim(),
    phone: cleanPhone(input.phone),
    email: input.email.trim().toLowerCase(),
    role: "user",
    agencyUntil: null,
    createdAt: serverTimestamp(),
  });
}

export async function loginUser(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
}

export async function logoutUser() {
  await signOut(auth);
}