// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg_4fpVPO2Y1t26qlr1JuqA_2WOKH6V3c",
  authDomain: "portal-admin-user.firebaseapp.com",
  projectId: "portal-admin-user",
  storageBucket: "portal-admin-user.firebasestorage.app",
  messagingSenderId: "391179428406",
  appId: "1:391179428406:web:ea01a791fc69dbb61aee97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };