// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEBvK_OWll5y0j_gZOtjQybk9MX1EiU1M",
  authDomain: "vadsomhelst-d40da.firebaseapp.com",
  projectId: "vadsomhelst-d40da",
  storageBucket: "vadsomhelst-d40da.appspot.com",
  messagingSenderId: "714622196588",
  appId: "1:714622196588:web:1821ad2378a081223f7149",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore();

export { auth, storage, db };
