// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY0XnqA2mfZSyC_9SSpJ4hE_6AbU8WZd0",
  authDomain: "job-mate-f53e2.firebaseapp.com",
  projectId: "job-mate-f53e2",
  storageBucket: "job-mate-f53e2.firebasestorage.app",
  messagingSenderId: "630908449359",
  appId: "1:630908449359:web:7b4b5c8eb27f202918703a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);