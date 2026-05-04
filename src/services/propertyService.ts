import {
    addDoc,
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import { Property } from "../types/property";
import { addDays } from "../utils/date";
import { db } from "./firebase";

export function listenApprovedProperties(
  callback: (items: Property[]) => void,
  take = 30
) {
  const q = query(
    collection(db, "annonces"),
    where("status", "==", "approved"),
    orderBy("boost", "desc"),
    orderBy("createdAt", "desc"),
    limit(take)
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Property[]
    );
  });
}

export function listenAdminProperties(callback: (items: Property[]) => void) {
  const q = query(collection(db, "annonces"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Property[]
    );
  });
}

export async function createProperty(
  input: Omit<
    Property,
    "id" | "status" | "verified" | "boost" | "boostUntil" | "createdAt" | "updatedAt"
  >,
  autoApprove: boolean
) {
  await addDoc(collection(db, "annonces"), {
    ...input,
    status: autoApprove ? "approved" : "pending",
    verified: autoApprove,
    boost: false,
    boostUntil: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function approveProperty(propertyId: string) {
  await updateDoc(doc(db, "annonces", propertyId), {
    status: "approved",
    verified: true,
    updatedAt: serverTimestamp(),
  });
}

export async function rejectProperty(propertyId: string) {
  await updateDoc(doc(db, "annonces", propertyId), {
    status: "rejected",
    updatedAt: serverTimestamp(),
  });
}

export async function activateBoost(propertyId: string, days: number) {
  await updateDoc(doc(db, "annonces", propertyId), {
    boost: true,
    boostUntil: addDays(days),
    updatedAt: serverTimestamp(),
  });
}