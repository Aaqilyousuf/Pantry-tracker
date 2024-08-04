// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDDwK7tZPUcA8D8Mn2AiCQUHl4IU3a-go",
  authDomain: "pantry-tracker-7aa88.firebaseapp.com",
  projectId: "pantry-tracker-7aa88",
  storageBucket: "pantry-tracker-7aa88.appspot.com",
  messagingSenderId: "866117184868",
  appId: "1:866117184868:web:6f5e913fdddf6c54d41e71",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
