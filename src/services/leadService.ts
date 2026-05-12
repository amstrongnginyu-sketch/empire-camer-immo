import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export function listenLeads(callback: (items: any[]) => void) {
  const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    callback(leads);
  });
}

export async function trackLead(input: {
  property: any;
  source: any;
  buyerId: string;
  buyerEmail: string;
  profile: any;
}) {
  const { property, source, buyerId, buyerEmail, profile } = input;

  await addDoc(collection(db, "leads"), {
    annonceId: property?.id || "",
    annonceTitle: property?.title || "Annonce immobilière",

    ownerId: property?.ownerId || "demo",
    ownerEmail: property?.ownerEmail || "",

    buyerId,
    buyerEmail,
    buyerName: profile?.name || profile?.displayName || "Utilisateur",

    source,

    city: property?.city || "",
    quartier: property?.quartier || "",
    price: property?.price || "",

    createdAt: serverTimestamp(),
  });
}