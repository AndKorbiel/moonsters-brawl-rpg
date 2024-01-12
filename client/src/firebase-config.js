import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "moonster-rpg.firebaseapp.com",
    projectId: "moonster-rpg",
    storageBucket: "moonster-rpg.appspot.com",
    messagingSenderId: process.env.RECAT_APP_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);