import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import { Lead, LeadSource } from "../types/lead";
import { Property } from "../types/property";
import { UserProfile } from "../types/user";
import { db } from "./firebase";

export function listenLeads(callback: (items: Lead[]) => void) {
  const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Lead[]
    );
  });
}

export async function trackLead(input: {
  property: Property;
  source: LeadSource;
  buyerId: string;
  buyerEmail: string;
  profile: UserProfile | null;
}) {
  const { property, source, buyerId, buyerEmail, profile } = input;

  await addDoc(collection(db, "leads"), {
    annonceId: property.id,
    annonceTitle: property.title,
    ownerId: property.ownerId || "demo",
    ownerEmail: property.ownerEmail || "",
    buyerId,
    buyerEmail,
    buyerName: profile?.name || "Utilisateur",
    source,
    city: property.city || "",
    quartier: property.quartier || "",
    price: property.price || "",
    createdAt: serverTimestamp(),
  });
}