// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGaeDaQrR9WYmITj4B2IGqW1Oqg1t5s0Y",
  authDomain: "inventory-management-app-c524c.firebaseapp.com",
  projectId: "inventory-management-app-c524c",
  storageBucket: "inventory-management-app-c524c.appspot.com",
  messagingSenderId: "760293932843",
  appId: "1:760293932843:web:ffa5ec6c4fefc1e5248f6e",
  measurementId: "G-477QJJRXGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };