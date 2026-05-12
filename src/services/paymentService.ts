import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { Payment } from "../types/payment";
import { addDays } from "../utils/date";
import { db } from "./firebase";
import { activateBoost } from "./propertyService";

export function listenPayments(callback: (items: Payment[]) => void) {
  const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Payment[];

    callback(payments);
  });
}

export async function getAllPayments(): Promise<Payment[]> {
  const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Payment[];
}

export async function createPaymentRequest(
  input: Omit<
    Payment,
    "id" | "status" | "createdAt" | "updatedAt" | "approvedAt"
  >
) {
  await addDoc(collection(db, "payments"), {
    ...input,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function approvePayment(payment: Payment) {
  if (!payment?.id) {
    throw new Error("Paiement invalide.");
  }

  await updateDoc(doc(db, "payments", payment.id), {
    status: "approved",
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (payment.type === "boost" && payment.annonceId) {
    await activateBoost(payment.annonceId, payment.days || 7);
  }

  if (payment.type === "agency_subscription" && payment.userId) {
    await updateDoc(doc(db, "users", payment.userId), {
      role: "agency",
      agencyUntil: addDays(payment.days || 30),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function rejectPayment(paymentId: string) {
  if (!paymentId) {
    throw new Error("ID paiement manquant.");
  }

  await updateDoc(doc(db, "payments", paymentId), {
    status: "rejected",
    updatedAt: serverTimestamp(),
  });
}

export async function markPaymentPending(paymentId: string) {
  if (!paymentId) {
    throw new Error("ID paiement manquant.");
  }

  await updateDoc(doc(db, "payments", paymentId), {
    status: "pending",
    updatedAt: serverTimestamp(),
  });
}