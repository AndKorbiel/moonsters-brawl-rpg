import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.REACT_APP_API_KEY,
    authDomain: "moonster-rpg.firebaseapp.com",
    projectId: "moonster-rpg",
    storageBucket: "moonster-rpg.appspot.com",
    messagingSenderId:
        import.meta.env.REACT_APP_SENDER_ID ?? import.meta.env.RECAT_APP_SENDER_ID,
    appId: import.meta.env.REACT_APP_FIREBASE_ID
};

export const app = initializeApp(firebaseConfig);