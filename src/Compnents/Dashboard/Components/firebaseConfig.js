// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyA9yLiaxW_wy_3WBo5O1Vfc5tyIvYz2WpQ",
  authDomain: "llm-powered-transcription.firebaseapp.com",
  projectId: "llm-powered-transcription",
  storageBucket: "llm-powered-transcription.firebasestorage.app",
  messagingSenderId: "433466035290",
  appId: "1:433466035290:web:7ac23262ab938026b19c63",
  measurementId: "G-DSMDV20D2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and Firestore
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, ref, listAll, getDownloadURL, db }; // Export Firestore as well
