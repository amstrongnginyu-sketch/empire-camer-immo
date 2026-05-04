import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { Message } from "../types/message";
import { Property } from "../types/property";
import { UserProfile } from "../types/user";
import { db } from "./firebase";

export function listenUserMessages(
  userId: string,
  callback: (items: Message[]) => void
) {
  const q = query(
    collection(db, "messages"),
    where("participants", "array-contains", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Message[]
    );
  });
}

export async function sendMessage(input: {
  property: Property;
  text: string;
  userId: string;
  userEmail: string;
  profile: UserProfile | null;
}) {
  const { property, text, userId, userEmail, profile } = input;

  await addDoc(collection(db, "messages"), {
    annonceId: property.id,
    annonceTitle: property.title,
    fromUserId: userId,
    fromUserEmail: userEmail,
    fromUserName: profile?.name || "Utilisateur",
    toUserId: property.ownerId || "owner_demo",
    toUserEmail: property.ownerEmail || "",
    participants: [userId, property.ownerId || "owner_demo"],
    text: text.trim(),
    status: "sent",
    createdAt: serverTimestamp(),
  });
}