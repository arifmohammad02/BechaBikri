// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJGiWCLvUFe8e8M9lWotO7VnhPMoZxH8c",
  authDomain: "mernecommerce-9697d.firebaseapp.com",
  projectId: "mernecommerce-9697d",
  storageBucket: "mernecommerce-9697d.firebasestorage.app",
  messagingSenderId: "113310360625",
  appId: "1:113310360625:web:dddee40c08239834d96110",
  measurementId: "G-QVMYQ5W7GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);