import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.REACT_APP_SECRET_NAME,
    authDomain: "moonster-rpg.firebaseapp.com",
    projectId: "moonster-rpg",
    storageBucket: "moonster-rpg.appspot.com",
    messagingSenderId: process.env.RECAT_APP_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)