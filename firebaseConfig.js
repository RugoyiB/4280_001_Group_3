// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjGIQpKJgfeupAUuG3kgNtkima1L5uPwI",
  authDomain: "musicplayer-d826e.firebaseapp.com",
  projectId: "musicplayer-d826e",
  storageBucket: "musicplayer-d826e.firebasestorage.app",
  messagingSenderId: "320798821513",
  appId: "1:320798821513:web:8cd8a63a71d09ae93e8a58",
  measurementId: "G-MBLXLDTJFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// ✅ Initialize Firebase Authentication and export it
// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);