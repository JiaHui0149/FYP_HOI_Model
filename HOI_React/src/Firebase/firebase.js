// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-ffDdMn-HX7dnxHC-jrLf1EWFSwEkLY4",
  authDomain: "hoi-system.firebaseapp.com",
  projectId: "hoi-system",
  storageBucket: "hoi-system.appspot.com",
  messagingSenderId: "460144803322",
  appId: "1:460144803322:web:736c900f95ec5a1ee2b843",
  measurementId: "G-TCZS34CT32",
};

// // // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

// // Export the initialized instance
export default firebaseConfig;