// src/firebase/init.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWVpOng8wgzJEjnMR2syqSIe2wpSudYrI",
  authDomain: "ultra-live-8f555.firebaseapp.com",
  projectId: "ultra-live-8f555",
  storageBucket: "ultra-live-8f555.appspot.com",
  messagingSenderId: "12110653617",
  appId: "1:12110653617:web:f2bd9c6ffae0f1ce865a90",
  measurementId: "G-PX38H5CYG8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

const db = getFirestore(app);

export { app, analytics, auth, db };
