import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQWpFadj7L-U-jF1b1DeEJqX-vDEmyiTA",
  authDomain: "huertohogar-15d5.firebaseapp.com",
  projectId: "huertohogar-15d5",
  storageBucket: "huertohogar-15d5.appspot.com",
  messagingSenderId: "663380007423",
  appId: "1:663380007423:web:51638d3581e2453989efca",
  measurementId: "G-6YRGN9FZLM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const auth = getAuth(app);