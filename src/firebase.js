import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDCLg0kh6Lm-jjjuXD3qX6LR5c31LsoisA",
  authDomain: "recipe-app-f8041.firebaseapp.com",
  projectId: "recipe-app-f8041",
  storageBucket: "recipe-app-f8041.appspot.com",
  messagingSenderId: "496830238323",
  appId: "1:496830238323:web:6daa16b2529355602b2406"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const storageRef = (refName) => ref(storage, refName);
