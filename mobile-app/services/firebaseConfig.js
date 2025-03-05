// services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// soundswipe-web firebase web app config
const firebaseConfig = {
  apiKey: "AIzaSyDMdk0AdOk--oL4QZt2oIUzf0j344ubu8g",
  authDomain: "cs52-soundswipe.firebaseapp.com",
  projectId: "cs52-soundswipe",
  storageBucket: "cs52-soundswipe.firebasestorage.app",
  messagingSenderId: "708600476587",
  appId: "1:708600476587:web:981f1e73e3ed5b150c58ee",
  measurementId: "G-TS3SQ44D70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);