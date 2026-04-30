import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGRIGfVGKjs6HSCaq9OM-F4EKcXLHT-Ok",
  authDomain: "empire-camer-immo.firebaseapp.com",
  projectId: "empire-camer-immo",
  storageBucket: "empire-camer-immo.appspot.com",
  messagingSenderId: "894254560064",
  appId: "1:894254560064:web:dc6f81d0ec2d5cefa800a5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);