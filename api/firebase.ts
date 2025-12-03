// api/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6RnSiEsMmnD1qFP-r8A8foVZNeeJxEO4",
  authDomain: "todo-rn-app-bd42b.firebaseapp.com",
  projectId: "todo-rn-app-bd42b",
  storageBucket: "todo-rn-app-bd42b.appspot.com",
  messagingSenderId: "212509415224",
  appId: "1:212509415224:web:8a165b95418d0689f613cd",
};

// ensure we only init once (Fast Refresh etc.)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
