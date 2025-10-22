import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7hNL3As8hgBaBpwTKwsS33GaGsv--zZ8",
    authDomain: "tiendahuertohogar-72ded.firebaseapp.com",
    projectId: "tiendahuertohogar-72ded",
    storageBucket: "tiendahuertohogar-72ded.appspot.com",
    messagingSenderId: "888478567485",
    appId: "1:888478567485:web:90abdf6721a7a587ad6e54",
    measurementId: "G-1R2GTJ3VGR"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);